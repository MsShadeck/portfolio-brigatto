import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [totalVideos, totalClientes, mensagensNaoLidas] = await Promise.all([
    prisma.video.count(),
    prisma.cliente.count(),
    prisma.mensagem.count({ where: { lida: false } }),
  ]);

  const cards = [
    { label: "Vídeos", value: totalVideos, href: "/admin/videos" },
    { label: "Clientes", value: totalClientes, href: "/admin/clientes" },
    { label: "Mensagens não lidas", value: mensagensNaoLidas, href: "/admin/mensagens" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl tracking-wide uppercase">Dashboard</h1>
      <p className="mt-1 text-sm text-foreground-muted">Visão geral do portfólio.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-lg border border-border bg-surface p-6 transition-colors hover:bg-surface-hover"
          >
            <p className="text-sm text-foreground-muted">{card.label}</p>
            <p className="mt-2 font-display text-4xl text-accent">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
