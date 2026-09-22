import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { SortableClientesTable } from "@/components/admin/SortableClientesTable";

export default async function ClientesPage() {
  const clientes = await prisma.cliente.findMany({
    orderBy: { ordem: "asc" },
    include: { _count: { select: { videos: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-wide uppercase">Clientes</h1>
          <p className="mt-1 text-sm text-foreground-muted">{clientes.length} cliente(s) cadastrado(s).</p>
        </div>
        <Link href="/admin/clientes/novo">
          <Button>Novo cliente</Button>
        </Link>
      </div>

      <div className="mt-6">
        <SortableClientesTable clientes={clientes} />
      </div>
    </div>
  );
}
