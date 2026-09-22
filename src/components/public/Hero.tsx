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
    <section className="vignette relative flex h-[calc(100vh-4rem)] min-h-[520px] items-center justify-center overflow-hidden bg-background">
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

      {/* Fumaça atmosférica */}
      <div className="smoke-layer">
        <div className="smoke-blob-1" />
        <div className="smoke-blob-2" />
        <div className="smoke-blob-3" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-accent drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          {nomeSite}
        </p>
        <h1 className="mt-4 font-display text-5xl tracking-wide uppercase sm:text-7xl [text-shadow:0_4px_30px_rgba(0,0,0,0.85),0_2px_8px_rgba(0,0,0,0.9)]">
          {titulo}
        </h1>
        {texto && (
          <p className="mx-auto mt-6 max-w-xl text-foreground-muted drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {texto}
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/trabalhos"
            className="glow-accent rounded-md bg-accent px-6 py-3 text-sm font-medium uppercase tracking-wide text-accent-foreground shadow-[0_4px_20px_rgba(229,161,59,0.25)] transition-transform hover:scale-105"
          >
            Ver trabalhos
          </Link>
          <Link
            href="/contato"
            className="rounded-md border border-white/20 bg-black/20 px-6 py-3 text-sm font-medium uppercase tracking-wide text-foreground backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
          >
            Entrar em contato
          </Link>
        </div>
      </div>
    </section>
  );
}
