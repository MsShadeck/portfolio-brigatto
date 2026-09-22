import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/public/Reveal";

export const metadata: Metadata = {
  title: "Sobre",
};

export default async function SobrePage() {
  const configuracao = await prisma.configuracao.findUnique({ where: { id: "singleton" } });

  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <Reveal>
        <h1 className="font-display text-4xl tracking-wide uppercase sm:text-5xl">Sobre</h1>
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-12 grid grid-cols-1 gap-12 sm:grid-cols-[220px_1fr]">
          {configuracao?.fotoUrl && (
            <div className="relative aspect-square w-full max-w-[220px] overflow-hidden rounded-lg bg-surface">
              <Image
                src={configuracao.fotoUrl}
                alt={configuracao.nomeSite}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="whitespace-pre-wrap text-foreground-muted">
            {configuracao?.bio ?? "Biografia em breve."}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
