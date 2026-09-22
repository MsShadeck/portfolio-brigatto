import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ContatoForm } from "@/components/public/ContatoForm";

export const metadata: Metadata = {
  title: "Contato",
  description: "Vamos conversar sobre o seu projeto.",
};

export default async function ContatoPage() {
  const configuracao = await prisma.configuracao.findUnique({ where: { id: "singleton" } });

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-display text-4xl tracking-wide uppercase sm:text-5xl">Contato</h1>
      <p className="mt-4 text-foreground-muted">
        Conte um pouco sobre o seu projeto e retorno em breve.
        {configuracao?.emailContato && (
          <>
            {" "}
            Ou envie um e-mail direto para{" "}
            <a href={`mailto:${configuracao.emailContato}`} className="text-accent hover:underline">
              {configuracao.emailContato}
            </a>
            .
          </>
        )}
      </p>

      <div className="mt-12">
        <ContatoForm />
      </div>
    </div>
  );
}
