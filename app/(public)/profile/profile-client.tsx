"use client";

import { motion } from "framer-motion";
import { ExternalLink, Mail, PlayCircle, GraduationCap, Building2, Calendar as CalendarIcon, Award } from "lucide-react";
import { siteConfig } from "@/config/site";
import { aboutMe } from "@/config/data";
import Image from "next/image";
import { fadeUp, staggerContainer, staggerItem } from "@/animations/variants";

export function ProfileClient() {
  const { author } = siteConfig;
  const { bio, status, skills } = aboutMe;

  // Image for the About Me section
  const aboutImage = { url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1000&auto=format&fit=crop", title: "About Me" };

  const education = [
    {
      institution: "Delhi Technological University",
      degree: "BTech, Software Engineering",
      date: "May 2027",
      score: "8.65 CGPA",
    },
    {
      institution: "Rosary Senior Secondary School, Delhi",
      degree: "Class 12th, PCM",
      date: "May 2023",
      score: "91.2%",
    },
    {
      institution: "Rosary Senior Secondary School, Delhi",
      degree: "Class 10th",
      date: "May 2021",
      score: "94.6%",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid gap-12 lg:grid-cols-[1fr_350px]">
        
        {/* Main Content Area */}
        <div className="order-2 lg:order-1">
          {/* About */}
          <motion.section variants={fadeUp} initial="hidden" animate="visible" className="mb-12">
            <div className="flex items-center gap-6">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-background shadow-lg">
                <img 
                  src="https://github.com/Rheosta561.png" 
                  alt={author.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{author.name}</h1>
                <p className="mt-1.5 text-base font-medium text-primary">{status}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  {author.github && (
                    <a href={author.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                      <ExternalLink className="h-4 w-4" /> GitHub
                    </a>
                  )}
                  {author.linkedin && (
                    <a href={author.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                      <ExternalLink className="h-4 w-4" /> LinkedIn
                    </a>
                  )}
                  {author.twitter && (
                    <a href={author.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                      <ExternalLink className="h-4 w-4" /> Twitter
                    </a>
                  )}
                  <a href={`mailto:${author.email}`} className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <Mail className="h-4 w-4" /> Email
                  </a>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Bio & Video Section */}
          <div className="grid gap-8 sm:grid-cols-[1fr_240px] mb-16">
            <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="mb-4 text-xl font-bold tracking-tight">Biography</h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                {bio}
              </p>
            </motion.section>

            {/* Cinematic Vertical Image */}
            <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="group relative aspect-[9/16] w-full max-w-[240px] overflow-hidden rounded-2xl bg-black shadow-xl ring-1 ring-border/50 mx-auto">
              <Image
                  src={require('@/public/images/about2.jpeg')}
                  alt="About Me"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
               
                
                {/* Cinematic Overlay overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                
                {/* Label */}
                <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                  <h3 className="text-lg font-bold text-white drop-shadow-md">{aboutImage.title}</h3>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Education Section */}
          <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16">
            <div className="mb-6 flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold tracking-tight">Education</h2>
            </div>
            
            <div className="space-y-6">
              {education.map((edu, idx) => (
                <motion.div 
                  key={idx} 
                  variants={staggerItem}
                  className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-full before:w-[2px] before:bg-border last:before:h-0"
                >
                  {/* Timeline Node */}
                  <div className="absolute left-[-4px] top-2 h-[10px] w-[10px] rounded-full bg-primary ring-4 ring-background"></div>
                  
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/50">
                    <h3 className="text-lg font-bold text-foreground">{edu.institution}</h3>
                    
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4 shrink-0" />
                        <span className="truncate">{edu.degree}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4 shrink-0" />
                        <span>{edu.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Award className="h-4 w-4 shrink-0 text-primary" />
                        <span>{edu.score}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Sidebar */}
        <div className="order-1 lg:order-2">
          {/* Skills */}
          <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12 rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold tracking-tight">Core Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <motion.span 
                  key={skill} 
                  variants={staggerItem} 
                  className="rounded-xl border border-border bg-muted/30 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.section>

          {/* Contact CTA */}
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-3xl border border-border bg-gradient-to-b from-card to-muted/20 p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Mail className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-lg font-bold tracking-tight">Let's Connect</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
            </p>
            <a 
              href={`mailto:${author.email}`} 
              className="inline-flex w-full items-center justify-center rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Send an Email
            </a>
          </motion.section>
        </div>

      </div>
    </div>
  );
}
