import Link from "next/link";
import { isDirectVideoFile } from "@/lib/video-embed";

export function Hero({
  nomeSite,
  titulo,
  texto,
  showreelUrl,
}: {
  nomeSite: string;
  titulo: string;
  texto: string | null;
  showreelUrl: string | null;
}) {
  const videoDeFundo = showreelUrl && isDirectVideoFile(showreelUrl) ? showreelUrl : null;

  return (
    <section className="relative flex h-[calc(100vh-4rem)] min-h-[520px] items-center justify-center overflow-hidden bg-background">
      {videoDeFundo && (
        <video
          src={videoDeFundo}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-accent">{nomeSite}</p>
        <h1 className="mt-4 font-display text-5xl tracking-wide uppercase sm:text-7xl">
          {titulo}
        </h1>
        {texto && <p className="mx-auto mt-6 max-w-xl text-foreground-muted">{texto}</p>}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/trabalhos"
            className="rounded-md bg-accent px-6 py-3 text-sm font-medium uppercase tracking-wide text-accent-foreground transition-transform hover:scale-105"
          >
            Ver trabalhos
          </Link>
          <Link
            href="/contato"
            className="rounded-md border border-border px-6 py-3 text-sm font-medium uppercase tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Entrar em contato
          </Link>
        </div>
      </div>
    </section>
  );
}
