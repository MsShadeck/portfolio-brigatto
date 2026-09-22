import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VideoEmbed } from "@/components/public/VideoEmbed";
import { VideoCard } from "@/components/public/VideoCard";
import { Reveal } from "@/components/public/Reveal";

async function getVideo(slug: string) {
  return prisma.video.findFirst({
    where: { slug, publicado: true },
    include: { cliente: true, categoria: true },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideo(slug);
  if (!video) return {};

  return {
    title: video.titulo,
    description: video.descricao ?? `${video.titulo} — ${video.categoria.nome}, ${video.ano}`,
    openGraph: {
      title: video.titulo,
      description: video.descricao ?? undefined,
      images: [{ url: video.thumbnailUrl }],
    },
  };
}

export default async function TrabalhoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const video = await getVideo(slug);
  if (!video) notFound();

  const relacionados = await prisma.video.findMany({
    where: {
      publicado: true,
      categoriaId: video.categoriaId,
      NOT: { id: video.id },
    },
    include: { cliente: true, categoria: true },
    orderBy: { ordem: "asc" },
    take: 3,
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <Link href="/trabalhos" className="text-sm text-foreground-muted hover:text-accent">
        ← Voltar para trabalhos
      </Link>

      <h1 className="mt-4 font-display text-4xl tracking-wide uppercase sm:text-5xl">
        {video.titulo}
      </h1>

      <div className="mt-2 flex flex-wrap gap-x-4 text-sm text-foreground-muted">
        {video.cliente && <span>{video.cliente.nome}</span>}
        <span>{video.categoria.nome}</span>
        <span>{video.ano}</span>
        {video.funcao && <span>{video.funcao}</span>}
      </div>

      <div className="mt-8">
        <VideoEmbed urlVideo={video.urlVideo} thumbnailUrl={video.thumbnailUrl} titulo={video.titulo} />
      </div>

      {video.descricao && (
        <p className="mt-8 max-w-2xl whitespace-pre-wrap text-foreground-muted">{video.descricao}</p>
      )}

      {relacionados.length > 0 && (
        <Reveal className="mt-24">
          <h2 className="font-display text-2xl tracking-wide uppercase">Trabalhos relacionados</h2>
          <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-3">
            {relacionados.map((relacionado) => (
              <VideoCard key={relacionado.id} video={relacionado} />
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
