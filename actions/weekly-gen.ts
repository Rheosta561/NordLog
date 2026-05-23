"use server";

import { GoogleGenAI } from "@google/genai";
import { getDailyLogs } from "@/lib/local-logs";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getWeeklySummaries() {
  return await prisma.weeklySummary.findMany({
    orderBy: { weekNumber: "desc" },
  });
}

// Reusable logic to get the current week's logs (or fallback)
function getCurrentWeekLogs() {
  const allLogs = getDailyLogs();
  
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1);
  const startOfWeek = new Date(now.setDate(diffToMonday));
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  let weekLogs = allLogs.filter(log => {
    const logDate = new Date(log.date).getTime();
    return logDate >= startOfWeek.getTime() && logDate <= endOfWeek.getTime();
  });

  if (weekLogs.length === 0 && allLogs.length > 0) {
    weekLogs = allLogs.slice(0, 7);
  }

  return weekLogs.reverse();
}

export async function getAvailableWeekImages() {
  const weekLogs = getCurrentWeekLogs();
  const images = weekLogs.flatMap(log => log.images);
  return images;
}

export async function generateCurrentWeekSummary(secret: string, selectedImages: string[] = []) {
  if (secret !== process.env.GENERATION_SECRET) {
    throw new Error("Invalid generation secret.");
  }

  const weekLogs = getCurrentWeekLogs();

  if (weekLogs.length === 0) {
    throw new Error("No logs available to generate a summary.");
  }

  // Upload selected images to Cloudinary
  const uploadedImageUrls: string[] = [];
  for (const imagePath of selectedImages) {
    try {
      // imagePath is like "/daily_logs/May_28/1.jpeg"
      const absolutePath = path.join(process.cwd(), "public", imagePath);
      const result = await cloudinary.uploader.upload(absolutePath, {
        folder: "nordlog_weekly",
      });
      uploadedImageUrls.push(result.secure_url);
    } catch (e) {
      console.error("Failed to upload image to Cloudinary:", imagePath, e);
    }
  }

  // Determine week number
  const existing = await getWeeklySummaries();
  const weekNumber = existing.length > 0 ? existing[0].weekNumber + 1 : 1;

  const textToAnalyze = weekLogs.map(log => `
Date: ${log.date}
Title: ${log.title}
Tags: ${log.tags.join(", ")}
Learnings: ${log.learnings}
Diary: ${log.diary}
  `).join("\n---\n");

  const prompt = `
You are an AI assistant helping a developer summarize their weekly internship progress.
Analyze the following daily logs and provide a structured summary.
Your response MUST be valid JSON with the following structure:
{
  "title": "A catchy title for the week",
  "summary": "A comprehensive 2-3 paragraph summary of the week's accomplishments, challenges, and overall theme.",
  "wins": ["String array of 3-5 major achievements/wins"],
  "blockers": ["String array of 1-3 blockers or challenges faced"],
  "nextWeekGoals": ["String array of 2-4 goals for next week based on current progress"]
}

Daily Logs:
${textToAnalyze}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const responseText = response.text;
    if (!responseText) throw new Error("No response from Gemini");

    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch (e) {
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error("Failed to parse JSON from Gemini response");
      }
    }

    // Save to DB
    const newSummary = await prisma.weeklySummary.create({
      data: {
        title: parsedResult.title || `Week ${weekNumber} Summary`,
        weekNumber,
        summary: parsedResult.summary || "No description generated.",
        images: uploadedImageUrls,
        wins: parsedResult.wins || [],
        blockers: parsedResult.blockers || [],
        nextWeekGoals: parsedResult.nextWeekGoals || [],
      }
    });

    return newSummary;
  } catch (error: any) {
    console.error("Error generating weekly summary:", error);
    throw new Error(error.message || "Failed to generate weekly summary");
  }
}
