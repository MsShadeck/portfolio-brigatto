"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/Button";
import type { ConfiguracaoState } from "@/actions/configuracao";
import type { Configuracao } from "@prisma/client";

type Action = (prevState: ConfiguracaoState, formData: FormData) => Promise<ConfiguracaoState>;

export function ConfiguracaoForm({
  action,
  configuracao,
}: {
  action: Action;
  configuracao?: Configuracao;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const [preview, setPreview] = useState<string | null>(configuracao?.fotoUrl ?? null);
  const values = state?.values;

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <Field label="Nome do site / videomaker" htmlFor="nomeSite">
        <Input
          id="nomeSite"
          name="nomeSite"
          required
          defaultValue={values?.nomeSite ?? configuracao?.nomeSite}
        />
      </Field>

      <Field label="Título do hero (home)" htmlFor="heroTitulo">
        <Input
          id="heroTitulo"
          name="heroTitulo"
          required
          defaultValue={values?.heroTitulo ?? configuracao?.heroTitulo}
        />
      </Field>

      <Field label="Texto do hero" htmlFor="heroTexto" hint="Opcional">
        <Textarea
          id="heroTexto"
          name="heroTexto"
          rows={2}
          defaultValue={values?.heroTexto ?? configuracao?.heroTexto ?? ""}
        />
      </Field>

      <Field
        label="Link do showreel"
        htmlFor="showreelUrl"
        hint="Vídeo de fundo do hero — link direto para um .mp4, ou embed do YouTube/Vimeo"
      >
        <Input
          id="showreelUrl"
          name="showreelUrl"
          defaultValue={values?.showreelUrl ?? configuracao?.showreelUrl ?? ""}
        />
      </Field>

      <Field label="Biografia" htmlFor="bio" hint="Exibida na página Sobre">
        <Textarea id="bio" name="bio" rows={5} defaultValue={values?.bio ?? configuracao?.bio ?? ""} />
      </Field>

      <Field label="Foto de perfil" htmlFor="foto" hint="Exibida na página Sobre">
        <Input
          id="foto"
          name="foto"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
          }}
        />
        {preview && (
          <div className="mt-2 h-24 w-24 overflow-hidden rounded-full border border-border">
            <Image
              src={preview}
              alt="Pré-visualização da foto"
              width={96}
              height={96}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
        )}
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Instagram" htmlFor="instagramUrl" hint="Opcional">
          <Input
            id="instagramUrl"
            name="instagramUrl"
            defaultValue={values?.instagramUrl ?? configuracao?.instagramUrl ?? ""}
          />
        </Field>
        <Field label="YouTube" htmlFor="youtubeUrl" hint="Opcional">
          <Input
            id="youtubeUrl"
            name="youtubeUrl"
            defaultValue={values?.youtubeUrl ?? configuracao?.youtubeUrl ?? ""}
          />
        </Field>
        <Field label="LinkedIn" htmlFor="linkedinUrl" hint="Opcional">
          <Input
            id="linkedinUrl"
            name="linkedinUrl"
            defaultValue={values?.linkedinUrl ?? configuracao?.linkedinUrl ?? ""}
          />
        </Field>
        <Field label="WhatsApp" htmlFor="whatsapp" hint="Com DDD, ex.: 11999999999">
          <Input
            id="whatsapp"
            name="whatsapp"
            defaultValue={values?.whatsapp ?? configuracao?.whatsapp ?? ""}
          />
        </Field>
      </div>

      <Field label="E-mail de contato" htmlFor="emailContato" hint="Opcional">
        <Input
          id="emailContato"
          name="emailContato"
          type="email"
          defaultValue={values?.emailContato ?? configuracao?.emailContato ?? ""}
        />
      </Field>

      {state && (
        <p className={`text-sm ${state.type === "error" ? "text-danger" : "text-accent"}`}>
          {state.message}
        </p>
      )}

      <div>
        <SubmitButton pendingLabel="Salvando...">Salvar configurações</SubmitButton>
      </div>
    </form>
  );
}
