"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, Layers, Zap, Smartphone, Database, Network } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

const rotatingLines = [
  "Developing modern Android applications with scalable architectures.",
  "Building AI-powered mobile experiences.",
  "Focused on performance, clean architecture, and usability.",
  "Engineering full-stack systems connected to intelligent mobile apps.",
  "Creating production-ready applications with modern technologies.",
  "Exploring Android systems, AI integration, and backend scalability.",
];

export function LandingHero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % rotatingLines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-18 md:pb-28 md:pt-32">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground shadow-xs">
            <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Anubhav Mishra
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-4xl text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-[4rem] lg:leading-[1.1]"
        >
          Engineering Intelligent Systems <br className="hidden sm:block" />
          <span className="text-muted-foreground">for Real-World Impact</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-3xl text-center text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          I’m Anubhav Mishra A BTech undergrad focused on Android development, AI-powered applications, and scalable full-stack systems.
        </motion.p>

        {/* Rotating Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto mt-6 flex h-16 max-w-2xl items-center justify-center text-center sm:h-8"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-sm font-medium text-foreground sm:text-base"
            >
              <Sparkles className="mb-1 mr-2 inline-block h-4 w-4 text-foreground/70" />
              {rotatingLines[currentIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex items-center justify-center gap-3"
        >
          <Link
            href="/portfolio"
            className="group flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            <Layers className="h-4 w-4" />
            View my work
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/logs"
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            The Qualcomm Experience
          </Link>
        </motion.div>

        {/* About Me Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mx-auto mt-16 max-w-5xl"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
            
            {/* Image 1 */}
            <div className="relative min-h-[300px] overflow-hidden rounded-3xl border border-border bg-muted md:min-h-full">
               <Image src={require('@/public/images/anubhav.jpeg')} alt="Anubhav" fill className="object-cover" /> 
            </div>

            {/* Bio Box */}
            <div className="md:col-span-2 flex flex-col justify-center overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold tracking-tight">
                Crafting software that matters.
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                I build Android applications and intelligent software systems designed for real-world impact. My work focuses on scalable architectures, clean engineering practices, AI-driven experiences, and modern full-stack development using technologies like Android, React, Next.js, Node.js, and cloud-connected systems.
              </p>
            </div>

            {/* Focus Areas Box */}
            <div className="md:col-span-2 flex flex-col justify-center overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h3 className="mb-5 text-lg font-semibold tracking-tight">Technical Focus Areas</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                  <Smartphone className="h-5 w-5 text-foreground" />
                  <span className="text-sm font-medium">Android Development</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                  <Sparkles className="h-5 w-5 text-foreground" />
                  <span className="text-sm font-medium">AI-Powered Apps</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                  <Layers className="h-5 w-5 text-foreground" />
                  <span className="text-sm font-medium">Full Stack</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                  <Database className="h-5 w-5 text-foreground" />
                  <span className="text-sm font-medium">Backend & APIs</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                  <Network className="h-5 w-5 text-foreground" />
                  <span className="text-sm font-medium">Scalable Systems</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                  <Zap className="h-5 w-5 text-foreground" />
                  <span className="text-sm font-medium">Performance</span>
                </div>
              </div>
            </div>

            {/* Image 2 */}
            <div className="relative min-h-[300px] overflow-hidden rounded-3xl border border-border bg-muted md:min-h-full">
                  <Image src={require('@/public/images/preacherclan.jpeg')} alt="Anubhav" fill className="object-cover" /> 
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
