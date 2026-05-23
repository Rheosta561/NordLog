import fs from "fs";
import path from "path";

export interface LocalLog {
  id: string; // The folder name, e.g., 'May_28'
  title: string;
  tags: string[];
  learnings: string;
  diary: string;
  images: string[]; // Paths to images like '/daily_logs/May_28/1.jpeg'
  date: string; // ISO string representation
}

const LOGS_DIR = path.join(process.cwd(), "public", "daily_logs");

export function getDailyLogs(): LocalLog[] {
  if (!fs.existsSync(LOGS_DIR)) return [];

  const folders = fs.readdirSync(LOGS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const logs: LocalLog[] = [];

  for (const folder of folders) {
    const folderPath = path.join(LOGS_DIR, folder);
    const dataPath = path.join(folderPath, "data.json");

    if (fs.existsSync(dataPath)) {
      try {
        const fileContents = fs.readFileSync(dataPath, "utf8");
        const data = JSON.parse(fileContents);

        // Find all images in this folder
        const images = fs.readdirSync(folderPath)
          .filter(file => /\.(jpeg|jpg|png|gif|webp)$/i.test(file))
          .map(file => `/daily_logs/${folder}/${file}`);

        // Try to parse the folder name into a sortable date
        // Assuming format like "May_28" or "May_28_2024"
        // Let's create a dummy ISO date for sorting purposes, default to current year if not provided
        let dateObj = new Date();
        try {
          const parts = folder.split('_');
          if (parts.length >= 2) {
            const month = parts[0];
            const day = parts[1];
            const year = parts[2] || new Date().getFullYear().toString();
            const parsed = new Date(`${month} ${day}, ${year}`);
            if (!isNaN(parsed.getTime())) {
              dateObj = parsed;
            }
          }
        } catch (e) {
          // ignore
        }

        logs.push({
          id: folder,
          title: data.title || "Untitled",
          tags: data.tags || [],
          learnings: data.learnings || "",
          diary: data.diary || "",
          images,
          date: dateObj.toISOString(),
        });
      } catch (err) {
        console.error(`Error reading data.json for ${folder}:`, err);
      }
    }
  }

  // Sort by date descending
  return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getDailyLogById(id: string): LocalLog | null {
  const logs = getDailyLogs();
  return logs.find(log => log.id === id) || null;
}
