import { PortfolioProjectType } from "@/types";

export const aboutMe = {
  bio: "Passionate about building products that make a difference. Currently interning and documenting my journey through daily logs, weekly reflections, and portfolio projects. I believe in learning in public and sharing knowledge with the community.",
  status: "Software Engineering Intern",
  skills: [
    "TypeScript", "React", "Next.js", "Node.js", "Python",
    "PostgreSQL", "MongoDB", "Prisma", "Tailwind CSS",
    "Docker", "Git", "AWS",
  ],
};

// You can easily manage your portfolio projects by adding or modifying objects in this array.
// Ensure your image URLs are hosted on allowed domains (e.g., Cloudinary, Google Drive, Pinterest).
export const portfolioProjects: PortfolioProjectType[] = [
  // Example project:
  {
    id: "1",
    title: "The Preacher Clan",
    description: "A short description of what this project does and why it was built.",
    techStack: ["Next.js", "Tailwind CSS", "Prisma"],
    githubUrl: "https://github.com/Rheosta561/project",
    liveUrl: "https://project.vercel.app",
    coverImage: "https://i.pinimg.com/736x/example.jpg", // Pinterest image example
    gallery: [],
    featured: true,
    createdAt: new Date().toISOString(),
  },
];
