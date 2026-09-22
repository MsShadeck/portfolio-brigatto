"use client";

import { useActionState } from "react";
import { changePassword } from "@/actions/conta";
import { Field, Input } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/Button";

export function ChangePasswordForm() {
  const [state, formAction] = useActionState(changePassword, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Senha atual" htmlFor="senhaAtual">
        <Input id="senhaAtual" name="senhaAtual" type="password" required autoComplete="current-password" />
      </Field>
      <Field label="Nova senha" htmlFor="novaSenha" hint="Mínimo de 8 caracteres">
        <Input id="novaSenha" name="novaSenha" type="password" required autoComplete="new-password" />
      </Field>
      <Field label="Confirmar nova senha" htmlFor="confirmarSenha">
        <Input
          id="confirmarSenha"
          name="confirmarSenha"
          type="password"
          required
          autoComplete="new-password"
        />
      </Field>

      {state && (
        <p className={`text-sm ${state.type === "error" ? "text-danger" : "text-accent"}`}>
          {state.message}
        </p>
      )}

      <div>
        <SubmitButton pendingLabel="Alterando...">Alterar senha</SubmitButton>
      </div>
    </form>
  );
}
