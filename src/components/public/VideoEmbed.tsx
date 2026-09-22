"use client";

import { useState } from "react";
import Image from "next/image";
import { parseVideoUrl } from "@/lib/video-embed";

export function VideoEmbed({
  urlVideo,
  thumbnailUrl,
  titulo,
}: {
  urlVideo: string;
  thumbnailUrl: string;
  titulo: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const { embedUrl } = parseVideoUrl(urlVideo);

  if (loaded && embedUrl) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        <iframe
          src={embedUrl}
          title={titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-lg bg-black"
      aria-label={`Assistir: ${titulo}`}
    >
      <Image src={thumbnailUrl} alt={titulo} fill className="object-cover opacity-80" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/50">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform group-hover:scale-110">
          <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-6 w-6">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>
    </button>
  );
}
