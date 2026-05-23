"use client";

import { useState, useEffect } from "react";
import { Loader2, Key, Sparkles, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { generateCurrentWeekSummary, getAvailableWeekImages } from "@/actions/weekly-gen";

export default function GenerateWeekPage() {
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    async function loadImages() {
      try {
        const images = await getAvailableWeekImages();
        setAvailableImages(images);
      } catch (err) {
        console.error("Failed to load images", err);
      } finally {
        setLoadingImages(false);
      }
    }
    loadImages();
  }, []);

  const toggleImage = (img: string) => {
    setSelectedImages(prev => 
      prev.includes(img) ? prev.filter(i => i !== img) : [...prev, img]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret) {
      toast.error("Please enter the generation secret.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Analyzing logs and generating summary with Gemini...", {
      description: "This may take a few moments. Do not close this page."
    });

    try {
      await generateCurrentWeekSummary(secret, selectedImages);
      toast.success("Weekly Summary Generated!", {
        id: toastId,
        description: "Successfully processed the pipeline, uploaded images, and saved to database."
      });
      setSecret(""); // clear secret on success
      setSelectedImages([]);
    } catch (err: any) {
      toast.error("Generation Failed", {
        id: toastId,
        description: err.message || "Something went wrong."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Sparkles className="h-6 w-6 text-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Generate Weekly Summary</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Select images to feature in your weekly summary, then trigger the AI pipeline.
          </p>
        </div>

        {/* Image Selection */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Available Images from This Week</h3>
          </div>
          
          {loadingImages ? (
            <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : availableImages.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
              No images found in this week's daily logs.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {availableImages.map((img, idx) => {
                const isSelected = selectedImages.includes(img);
                return (
                  <div 
                    key={idx}
                    onClick={() => toggleImage(img)}
                    className={`group relative aspect-square cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
                      isSelected ? "border-primary" : "border-transparent hover:border-muted-foreground/30"
                    }`}
                  >
                    <img src={img} alt={`Log image ${idx}`} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-white drop-shadow-md" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          {selectedImages.length > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              {selectedImages.length} image(s) selected for upload.
            </p>
          )}
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="relative">
            <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              placeholder="Enter generation secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition-colors focus:border-ring placeholder:text-muted-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !secret}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Run AI Pipeline & Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}
