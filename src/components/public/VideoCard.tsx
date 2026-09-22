"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import type { Video, Cliente, Categoria } from "@prisma/client";

type VideoComRelacoes = Video & { cliente: Cliente | null; categoria: Categoria };

export function VideoCard({ video }: { video: VideoComRelacoes }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Link
      href={`/trabalhos/${video.slug}`}
      className="group block"
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      <div className="relative aspect-video overflow-hidden bg-surface shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-shadow duration-500 group-hover:shadow-[0_20px_60px_-8px_rgba(229,161,59,0.3),0_8px_24px_rgba(0,0,0,0.6)]">
        <Image
          src={video.thumbnailUrl}
          alt={video.titulo}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        {video.previewUrl && (
          <video
            ref={videoRef}
            src={video.previewUrl}
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="mt-3">
        <h3 className="font-display text-lg tracking-wide uppercase group-hover:text-accent">
          {video.titulo}
        </h3>
        <p className="text-sm text-foreground-muted">
          {video.cliente?.nome ?? "—"} · {video.categoria.nome} · {video.ano}
        </p>
      </div>
    </Link>
  );
}
