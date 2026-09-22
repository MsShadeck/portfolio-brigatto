import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { VideoCard } from "@/components/public/VideoCard";
import { Reveal } from "@/components/public/Reveal";

export const metadata: Metadata = {
  title: "Trabalhos",
  description: "Portfólio de vídeos: aftermovies, clipes, institucionais e mais.",
};

export default async function TrabalhosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; cliente?: string }>;
}) {
  const { categoria: categoriaSlug, cliente: clienteId } = await searchParams;

  const [categorias, videos, clienteFiltro] = await Promise.all([
    prisma.categoria.findMany({ orderBy: { nome: "asc" } }),
    prisma.video.findMany({
      where: {
        publicado: true,
        ...(categoriaSlug ? { categoria: { slug: categoriaSlug } } : {}),
        ...(clienteId ? { clienteId } : {}),
      },
      orderBy: { ordem: "asc" },
      include: { cliente: true, categoria: true },
    }),
    clienteId ? prisma.cliente.findUnique({ where: { id: clienteId } }) : null,
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="font-display text-4xl tracking-wide uppercase sm:text-5xl">Trabalhos</h1>

      {clienteFiltro && (
        <p className="mt-2 text-sm text-foreground-muted">
          Filtrando por cliente: <span className="text-accent">{clienteFiltro.nome}</span>{" "}
          <Link href="/trabalhos" className="underline hover:text-accent">
            limpar
          </Link>
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/trabalhos"
          className={`rounded-full border px-4 py-1.5 text-sm uppercase tracking-wide transition-colors ${
            !categoriaSlug
              ? "border-accent bg-accent text-accent-foreground"
              : "border-border text-foreground-muted hover:border-accent hover:text-accent"
          }`}
        >
          Todos
        </Link>
        {categorias.map((categoria) => (
          <Link
            key={categoria.id}
            href={`/trabalhos?categoria=${categoria.slug}`}
            className={`rounded-full border px-4 py-1.5 text-sm uppercase tracking-wide transition-colors ${
              categoriaSlug === categoria.slug
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-foreground-muted hover:border-accent hover:text-accent"
            }`}
          >
            {categoria.nome}
          </Link>
        ))}
      </div>

      {videos.length > 0 ? (
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, index) => (
            <Reveal key={video.id} delay={(index % 6) * 60}>
              <VideoCard video={video} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-foreground-muted">
          Nenhum trabalho publicado nesta categoria ainda.
        </p>
      )}
    </div>
  );
}
