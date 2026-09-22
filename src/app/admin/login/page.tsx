"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";
import { Field, Input } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/Button";

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-8">
        <h1 className="font-display text-3xl tracking-wide text-foreground uppercase">
          Painel Admin
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Entre com suas credenciais para gerenciar o portfólio.
        </p>

        <form action={formAction} className="mt-6 flex flex-col gap-4">
          <Field label="E-mail" htmlFor="email">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={state?.email}
              required
            />
          </Field>
          <Field label="Senha" htmlFor="password">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </Field>

          {state?.error && <p className="text-sm text-danger">{state.error}</p>}

          <SubmitButton pendingLabel="Entrando...">Entrar</SubmitButton>
        </form>
      </div>
    </div>
  );
}
