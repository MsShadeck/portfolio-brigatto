"use client";

import { useActionState, useRef } from "react";
import { Input } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/Button";

type Action = (prevState: string | undefined, formData: FormData) => Promise<string | undefined>;

export function NovaCategoriaForm({ action }: { action: Action }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, formAction] = useActionState(async (prev: string | undefined, formData: FormData) => {
    const result = await action(prev, formData);
    if (!result) formRef.current?.reset();
    return result;
  }, undefined);

  return (
    <form ref={formRef} action={formAction} className="flex items-start gap-2">
      <div className="flex-1">
        <Input name="nome" placeholder="Nome da categoria" required />
      </div>
      <SubmitButton pendingLabel="Adicionando...">Adicionar</SubmitButton>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </form>
  );
}
