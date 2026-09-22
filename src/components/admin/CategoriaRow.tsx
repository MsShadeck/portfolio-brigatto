"use client";

import { useActionState, useState } from "react";
import { updateCategoria, deleteCategoria } from "@/actions/categorias";
import { Input } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import type { Categoria } from "@prisma/client";

export function CategoriaRow({ categoria, videosCount }: { categoria: Categoria; videosCount: number }) {
  const [editando, setEditando] = useState(false);
  const [error, formAction] = useActionState(updateCategoria.bind(null, categoria.id), undefined);
  const [deleteError, setDeleteError] = useState<string | undefined>();

  async function handleDelete() {
    const msg = await deleteCategoria(categoria.id);
    if (msg) setDeleteError(msg);
  }

  if (editando) {
    return (
      <li className="flex flex-col gap-2 border-b border-border p-4 last:border-b-0">
        <form
          action={async (formData) => {
            await formAction(formData);
            setEditando(false);
          }}
          className="flex items-center gap-2"
        >
          <Input name="nome" defaultValue={categoria.nome} required className="max-w-xs" />
          <SubmitButton pendingLabel="Salvando...">Salvar</SubmitButton>
          <button
            type="button"
            onClick={() => setEditando(false)}
            className="text-sm text-foreground-muted hover:text-foreground"
          >
            Cancelar
          </button>
        </form>
        {error && <p className="text-sm text-danger">{error}</p>}
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-2 border-b border-border p-4 last:border-b-0">
      <div>
        <p className="font-medium">{categoria.nome}</p>
        <p className="text-xs text-foreground-muted">{videosCount} vídeo(s)</p>
      </div>
      <div className="flex items-center gap-3">
        {deleteError && <p className="text-xs text-danger">{deleteError}</p>}
        <button
          type="button"
          onClick={() => setEditando(true)}
          className="text-xs text-foreground-muted hover:text-accent"
        >
          Editar
        </button>
        <DeleteButton
          action={handleDelete}
          confirmMessage={`Excluir a categoria "${categoria.nome}"?`}
        />
      </div>
    </li>
  );
}
