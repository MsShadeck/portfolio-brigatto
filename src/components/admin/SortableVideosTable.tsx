"use client";

import { useId, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { deleteVideo, reorderVideos } from "@/actions/videos";
import { DeleteButton } from "@/components/ui/DeleteButton";
import type { Video, Cliente, Categoria } from "@prisma/client";

type VideoComRelacoes = Video & { cliente: Cliente | null; categoria: Categoria };

function DragHandle(props: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="cursor-grab touch-none rounded p-1 text-foreground-muted hover:text-foreground active:cursor-grabbing"
      aria-label="Arrastar para reordenar"
      {...props}
    >
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path d="M7 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm6 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM7 9a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm6 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM7 14a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm6 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
      </svg>
    </button>
  );
}

function Row({ video }: { video: VideoComRelacoes }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: video.id,
  });

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`border-t border-border bg-background ${isDragging ? "relative z-10 opacity-80 shadow-lg" : ""}`}
    >
      <td className="px-2 py-3">
        <DragHandle {...attributes} {...listeners} />
      </td>
      <td className="px-4 py-3">
        <div className="relative h-12 w-20 overflow-hidden rounded bg-background">
          <Image src={video.thumbnailUrl} alt="" fill className="object-cover" unoptimized />
        </div>
      </td>
      <td className="px-4 py-3 font-medium">{video.titulo}</td>
      <td className="px-4 py-3 text-foreground-muted">{video.categoria.nome}</td>
      <td className="px-4 py-3 text-foreground-muted">{video.cliente?.nome ?? "—"}</td>
      <td className="px-4 py-3 text-foreground-muted">{video.ano}</td>
      <td className="px-4 py-3">
        <div className="flex gap-1.5">
          {video.publicado ? (
            <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent">
              Publicado
            </span>
          ) : (
            <span className="rounded-full bg-border px-2 py-0.5 text-xs text-foreground-muted">
              Rascunho
            </span>
          )}
          {video.destaque && (
            <span className="rounded-full border border-accent px-2 py-0.5 text-xs text-accent">
              Destaque
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/videos/${video.id}`}
            className="text-xs text-foreground-muted hover:text-accent"
          >
            Editar
          </Link>
          <DeleteButton
            action={deleteVideo.bind(null, video.id)}
            confirmMessage={`Excluir o vídeo "${video.titulo}"?`}
          />
        </div>
      </td>
    </tr>
  );
}

export function SortableVideosTable({ videos: initial }: { videos: VideoComRelacoes[] }) {
  const [videos, setVideos] = useState(initial);
  const [, startTransition] = useTransition();
  const dndId = useId();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = videos.findIndex((v) => v.id === active.id);
    const newIndex = videos.findIndex((v) => v.id === over.id);
    const reordered = [...videos];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    setVideos(reordered);
    startTransition(() => {
      reorderVideos(reordered.map((v) => v.id));
    });
  }

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-foreground-muted">
            <tr>
              <th className="px-2 py-3" />
              <th className="px-4 py-3 font-medium">Thumb</th>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Ano</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            <SortableContext
              items={videos.map((v) => v.id)}
              strategy={verticalListSortingStrategy}
            >
              {videos.map((video) => (
                <Row key={video.id} video={video} />
              ))}
            </SortableContext>
            {videos.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-foreground-muted">
                  Nenhum vídeo cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {videos.length > 1 && (
          <p className="border-t border-border px-4 py-2 text-xs text-foreground-muted">
            Arraste pelo ícone para reordenar a exibição no portfólio.
          </p>
        )}
      </div>
    </DndContext>
  );
}
