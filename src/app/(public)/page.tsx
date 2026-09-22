import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/public/Hero";
import { VideoCard } from "@/components/public/VideoCard";
import { ClientLogosMarquee } from "@/components/public/ClientLogosMarquee";
import { Reveal } from "@/components/public/Reveal";

// Título/descrição da home vêm do `default` definido em generateMetadata do
// layout raiz (usa o mesmo heroTitulo/heroTexto das Configurações).

export default async function HomePage() {
  const [configuracao, destaques, clientes] = await Promise.all([
    prisma.configuracao.findUnique({ where: { id: "singleton" } }),
    prisma.video.findMany({
      where: { publicado: true, destaque: true },
      orderBy: { ordem: "asc" },
      include: { cliente: true, categoria: true },
      take: 6,
    }),
    prisma.cliente.findMany({ orderBy: { ordem: "asc" } }),
  ]);

  return (
    <>
      <Hero
        nomeSite={configuracao?.nomeSite ?? "Videomaker"}
        titulo={configuracao?.heroTitulo ?? "Contando histórias em movimento"}
        texto={configuracao?.heroTexto ?? null}
        showreelUrl={configuracao?.showreelUrl ?? null}
      />

      {destaques.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-24">
          <Reveal>
            <div className="flex items-end justify-between">
              <h2 className="font-display text-3xl tracking-wide uppercase sm:text-4xl">
                Trabalhos em destaque
              </h2>
              <Link href="/trabalhos" className="text-sm text-foreground-muted hover:text-accent">
                Ver todos →
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {destaques.map((video, index) => (
              <Reveal key={video.id} delay={index * 80}>
                <VideoCard video={video} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {clientes.length > 0 && (
        <section className="border-t border-white/5 py-16">
          <Reveal className="mb-8">
            <p className="text-center text-sm uppercase tracking-[0.3em] text-foreground-muted">
              Clientes que confiam no trabalho
            </p>
          </Reveal>
          <ClientLogosMarquee clientes={clientes} />
        </section>
      )}

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <Reveal>
          <h2 className="font-display text-3xl tracking-wide uppercase sm:text-4xl">
            Tem um projeto em mente?
          </h2>
          <p className="mt-4 text-foreground-muted">
            Vamos conversar sobre como transformar sua ideia em vídeo.
          </p>
          <Link
            href="/contato"
            className="mt-8 inline-block rounded-md bg-accent px-6 py-3 text-sm font-medium uppercase tracking-wide text-accent-foreground transition-transform hover:scale-105"
          >
            Entrar em contato
          </Link>
        </Reveal>
      </section>
    </>
  );
}
