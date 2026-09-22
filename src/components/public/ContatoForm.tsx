"use client";

import { useActionState } from "react";
import { enviarMensagem } from "@/actions/contato";
import { Field, Input, Textarea, Select } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/Button";

const tiposProjeto = [
  "Aftermovie",
  "Clipe musical",
  "Institucional",
  "Publicidade",
  "Cobertura de evento",
  "Reels / redes sociais",
  "Outro",
];

export function ContatoForm() {
  const [state, formAction] = useActionState(enviarMensagem, undefined);
  const values = state?.values;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {/* honeypot: invisível para pessoas, bots costumam preencher todos os campos */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="empresa">Empresa</label>
        <input id="empresa" name="empresa" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Nome" htmlFor="nome">
          <Input id="nome" name="nome" required defaultValue={values?.nome} />
        </Field>
        <Field label="E-mail" htmlFor="email">
          <Input id="email" name="email" type="email" required defaultValue={values?.email} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Telefone / WhatsApp" htmlFor="telefone" hint="Opcional">
          <Input id="telefone" name="telefone" defaultValue={values?.telefone} />
        </Field>
        <Field label="Tipo de projeto" htmlFor="tipoProjeto" hint="Opcional">
          <Select id="tipoProjeto" name="tipoProjeto" defaultValue={values?.tipoProjeto ?? ""}>
            <option value="">Selecione</option>
            {tiposProjeto.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Mensagem" htmlFor="texto">
        <Textarea id="texto" name="texto" rows={6} required defaultValue={values?.texto} />
      </Field>

      {state && (
        <p className={`text-sm ${state.type === "error" ? "text-danger" : "text-accent"}`}>
          {state.message}
        </p>
      )}

      <div>
        <SubmitButton pendingLabel="Enviando...">Enviar mensagem</SubmitButton>
      </div>
    </form>
  );
}
