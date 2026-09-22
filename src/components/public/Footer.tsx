import Link from "next/link";
import type { Configuracao } from "@prisma/client";

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-foreground-muted transition-colors hover:text-accent"
    >
      {label}
    </a>
  );
}

export function Footer({ configuracao }: { configuracao: Configuracao | null }) {
  const nomeSite = configuracao?.nomeSite ?? "Videomaker";

  return (
    <footer className="border-t border-white/5 bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-xl tracking-widest uppercase">{nomeSite}</p>
          {configuracao?.emailContato && (
            <a
              href={`mailto:${configuracao.emailContato}`}
              className="mt-1 block text-sm text-foreground-muted hover:text-accent"
            >
              {configuracao.emailContato}
            </a>
          )}
        </div>

        <div className="flex flex-wrap gap-6">
          {configuracao?.instagramUrl && (
            <SocialLink href={configuracao.instagramUrl} label="Instagram" />
          )}
          {configuracao?.youtubeUrl && <SocialLink href={configuracao.youtubeUrl} label="YouTube" />}
          {configuracao?.linkedinUrl && (
            <SocialLink href={configuracao.linkedinUrl} label="LinkedIn" />
          )}
          <Link href="/contato" className="text-sm text-foreground-muted hover:text-accent">
            Contato
          </Link>
        </div>
      </div>

      <div className="border-t border-white/5 px-6 py-4">
        <p className="mx-auto max-w-6xl text-xs text-foreground-muted">
          © {new Date().getFullYear()} {nomeSite}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
