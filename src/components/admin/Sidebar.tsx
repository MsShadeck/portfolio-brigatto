"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/actions/auth";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/videos", label: "Vídeos" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/mensagens", label: "Mensagens" },
  { href: "/admin/configuracoes", label: "Configurações" },
  { href: "/admin/conta", label: "Conta" },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      {links.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`block rounded-md px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-accent text-accent-foreground"
                : "text-foreground-muted hover:bg-surface-hover hover:text-foreground"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

export function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between border-b border-border bg-surface p-4 md:hidden">
        <p className="font-display text-xl tracking-wide uppercase">Admin</p>
        <button
          type="button"
          aria-label="Abrir menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-1.5"
        >
          <span className="h-px w-6 bg-foreground" />
          <span className="h-px w-6 bg-foreground" />
        </button>
      </header>

      {open && (
        <nav className="flex flex-col gap-1 border-b border-border bg-surface p-3 md:hidden">
          <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full rounded-md px-3 py-2 text-left text-sm text-foreground-muted hover:bg-surface-hover hover:text-foreground"
            >
              Sair
            </button>
          </form>
        </nav>
      )}

      <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="border-b border-border p-6">
          <p className="font-display text-2xl tracking-wide uppercase">Admin</p>
          <p className="mt-1 truncate text-xs text-foreground-muted">{userName}</p>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          <NavLinks pathname={pathname} />
        </nav>

        <div className="border-t border-border p-3">
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full rounded-md px-3 py-2 text-left text-sm text-foreground-muted hover:bg-surface-hover hover:text-foreground"
            >
              Sair
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
