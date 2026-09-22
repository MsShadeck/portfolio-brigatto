"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Field, Input, Textarea, Select } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/Button";
import type { VideoFormState } from "@/actions/videos";
import type { Categoria, Cliente, Video } from "@prisma/client";

type Action = (prevState: VideoFormState, formData: FormData) => Promise<VideoFormState>;

export function VideoForm({
  action,
  categorias,
  clientes,
  video,
}: {
  action: Action;
  categorias: Categoria[];
  clientes: Cliente[];
  video?: Video;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const [preview, setPreview] = useState<string | null>(video?.thumbnailUrl ?? null);

  const values = state?.values;

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <Field label="Título" htmlFor="titulo">
        <Input
          id="titulo"
          name="titulo"
          required
          defaultValue={values?.titulo ?? video?.titulo}
        />
      </Field>

      <Field label="Link do vídeo (YouTube ou Vimeo)" htmlFor="urlVideo">
        <Input
          id="urlVideo"
          name="urlVideo"
          type="url"
          required
          placeholder="https://www.youtube.com/watch?v=..."
          defaultValue={values?.urlVideo ?? video?.urlVideo}
        />
      </Field>

      <Field
        label="Thumbnail"
        htmlFor="thumbnail"
        hint={video ? "Deixe em branco para manter a imagem atual." : undefined}
      >
        <Input
          id="thumbnail"
          name="thumbnail"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
          }}
        />
        {preview && (
          <div className="mt-2 aspect-video w-full max-w-xs overflow-hidden rounded-md border border-border bg-background">
            <Image
              src={preview}
              alt="Pré-visualização da thumbnail"
              width={320}
              height={180}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
        )}
      </Field>

      <Field label="Descrição" htmlFor="descricao">
        <Textarea
          id="descricao"
          name="descricao"
          rows={4}
          defaultValue={values?.descricao ?? video?.descricao ?? ""}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Ano" htmlFor="ano">
          <Input
            id="ano"
            name="ano"
            type="number"
            required
            defaultValue={values?.ano ?? video?.ano ?? new Date().getFullYear()}
          />
        </Field>
        <Field label="Função exercida" htmlFor="funcao" hint="Ex.: Direção, Edição">
          <Input id="funcao" name="funcao" defaultValue={values?.funcao ?? video?.funcao ?? ""} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Categoria" htmlFor="categoriaId">
          <Select
            id="categoriaId"
            name="categoriaId"
            required
            defaultValue={values?.categoriaId ?? video?.categoriaId ?? ""}
          >
            <option value="" disabled>
              Selecione
            </option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Cliente" htmlFor="clienteId" hint="Opcional">
          <Select id="clienteId" name="clienteId" defaultValue={values?.clienteId ?? video?.clienteId ?? ""}>
            <option value="">Nenhum</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="destaque"
            defaultChecked={values?.destaque ?? video?.destaque}
            className="h-4 w-4 rounded border-border bg-surface accent-accent"
          />
          Destaque na home
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="publicado"
            defaultChecked={values?.publicado ?? video?.publicado ?? false}
            className="h-4 w-4 rounded border-border bg-surface accent-accent"
          />
          Publicado
        </label>
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <div>
        <SubmitButton pendingLabel="Salvando...">
          {video ? "Salvar alterações" : "Criar vídeo"}
        </SubmitButton>
      </div>
    </form>
  );
}
