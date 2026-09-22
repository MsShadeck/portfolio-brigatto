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
import { deleteCliente, reorderClientes } from "@/actions/clientes";
import { DeleteButton } from "@/components/ui/DeleteButton";
import type { Cliente } from "@prisma/client";

type ClienteComContagem = Cliente & { _count: { videos: number } };

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

function Row({ cliente }: { cliente: ClienteComContagem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: cliente.id,
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
        <div className="relative flex h-10 w-16 items-center justify-center overflow-hidden rounded bg-background">
          <Image src={cliente.logoUrl} alt="" fill className="object-contain p-1" unoptimized />
        </div>
      </td>
      <td className="px-4 py-3 font-medium">{cliente.nome}</td>
      <td className="px-4 py-3 text-foreground-muted">{cliente._count.videos}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/clientes/${cliente.id}`}
            className="text-xs text-foreground-muted hover:text-accent"
          >
            Editar
          </Link>
          <DeleteButton
            action={deleteCliente.bind(null, cliente.id)}
            confirmMessage={`Excluir o cliente "${cliente.nome}"?`}
          />
        </div>
      </td>
    </tr>
  );
}

export function SortableClientesTable({ clientes: initial }: { clientes: ClienteComContagem[] }) {
  const [clientes, setClientes] = useState(initial);
  const [, startTransition] = useTransition();
  const dndId = useId();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = clientes.findIndex((c) => c.id === active.id);
    const newIndex = clientes.findIndex((c) => c.id === over.id);
    const reordered = [...clientes];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    setClientes(reordered);
    startTransition(() => {
      reorderClientes(reordered.map((c) => c.id));
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
              <th className="px-4 py-3 font-medium">Logo</th>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Vídeos</th>
              <th className="px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            <SortableContext
              items={clientes.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {clientes.map((cliente) => (
                <Row key={cliente.id} cliente={cliente} />
              ))}
            </SortableContext>
            {clientes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-foreground-muted">
                  Nenhum cliente cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {clientes.length > 1 && (
          <p className="border-t border-border px-4 py-2 text-xs text-foreground-muted">
            Arraste pelo ícone para reordenar a exibição no site.
          </p>
        )}
      </div>
    </DndContext>
  );
}
