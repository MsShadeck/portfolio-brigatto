"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/Button";
import type { ClienteFormState } from "@/actions/clientes";
import type { Cliente } from "@prisma/client";

type Action = (prevState: ClienteFormState, formData: FormData) => Promise<ClienteFormState>;

export function ClienteForm({ action, cliente }: { action: Action; cliente?: Cliente }) {
  const [state, formAction] = useActionState(action, undefined);
  const [preview, setPreview] = useState<string | null>(cliente?.logoUrl ?? null);
  const values = state?.values;

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <Field label="Nome do cliente" htmlFor="nome">
        <Input id="nome" name="nome" required defaultValue={values?.nome ?? cliente?.nome} />
      </Field>

      <Field
        label="Logo"
        htmlFor="logo"
        hint={cliente ? "Deixe em branco para manter a logo atual." : undefined}
      >
        <Input
          id="logo"
          name="logo"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
          }}
        />
        {preview && (
          <div className="mt-2 flex h-20 w-40 items-center justify-center overflow-hidden rounded-md border border-border bg-background p-3">
            <Image
              src={preview}
              alt="Pré-visualização da logo"
              width={160}
              height={80}
              className="h-full w-full object-contain"
              unoptimized
            />
          </div>
        )}
      </Field>

      <Field label="Site" htmlFor="site" hint="Opcional">
        <Input
          id="site"
          name="site"
          type="url"
          placeholder="https://"
          defaultValue={values?.site ?? cliente?.site ?? ""}
        />
      </Field>

      <Field label="Depoimento" htmlFor="depoimento" hint="Opcional">
        <Textarea
          id="depoimento"
          name="depoimento"
          rows={3}
          defaultValue={values?.depoimento ?? cliente?.depoimento ?? ""}
        />
      </Field>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <div>
        <SubmitButton pendingLabel="Salvando...">
          {cliente ? "Salvar alterações" : "Criar cliente"}
        </SubmitButton>
      </div>
    </form>
  );
}
