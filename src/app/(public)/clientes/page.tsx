import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/public/Reveal";

export const metadata: Metadata = {
  title: "Clientes",
  description: "Marcas e clientes que já confiaram no trabalho.",
};

export default async function ClientesPage() {
  const clientes = await prisma.cliente.findMany({
    orderBy: { ordem: "asc" },
    include: { _count: { select: { videos: { where: { publicado: true } } } } },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="font-display text-4xl tracking-wide uppercase sm:text-5xl">Clientes</h1>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {clientes.map((cliente, index) => (
          <Reveal key={cliente.id} delay={(index % 6) * 60}>
            <div className="group border border-border bg-surface p-8 shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_16px_40px_-8px_rgba(229,161,59,0.25),0_4px_16px_rgba(0,0,0,0.5)]">
              <div className="relative h-16 w-full">
                <Image
                  src={cliente.logoUrl}
                  alt={cliente.nome}
                  fill
                  className="object-contain object-left"
                />
              </div>
              <h2 className="mt-6 font-display text-xl tracking-wide uppercase">{cliente.nome}</h2>

              {cliente.depoimento && (
                <p className="mt-3 text-sm text-foreground-muted">&ldquo;{cliente.depoimento}&rdquo;</p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-4">
                {cliente._count.videos > 0 && (
                  <Link
                    href={`/trabalhos?cliente=${cliente.id}`}
                    className="text-sm text-accent hover:underline"
                  >
                    Ver trabalhos ({cliente._count.videos})
                  </Link>
                )}
                {cliente.site && (
                  <a
                    href={cliente.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground-muted hover:text-accent"
                  >
                    Site ↗
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        ))}

        {clientes.length === 0 && (
          <p className="text-foreground-muted">Nenhum cliente cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}
