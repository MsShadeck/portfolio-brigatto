import { prisma } from "@/lib/prisma";
import { createCategoria } from "@/actions/categorias";
import { CategoriaRow } from "@/components/admin/CategoriaRow";
import { NovaCategoriaForm } from "@/components/admin/NovaCategoriaForm";

export default async function CategoriasPage() {
  const categorias = await prisma.categoria.findMany({
    orderBy: { nome: "asc" },
    include: { _count: { select: { videos: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-3xl tracking-wide uppercase">Categorias</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Usadas para filtrar os trabalhos no portfólio público.
      </p>

      <div className="mt-6 max-w-md">
        <NovaCategoriaForm action={createCategoria} />
      </div>

      <ul className="mt-6 max-w-md rounded-lg border border-border bg-surface">
        {categorias.map((categoria) => (
          <CategoriaRow
            key={categoria.id}
            categoria={categoria}
            videosCount={categoria._count.videos}
          />
        ))}
        {categorias.length === 0 && (
          <li className="p-4 text-center text-sm text-foreground-muted">
            Nenhuma categoria cadastrada ainda.
          </li>
        )}
      </ul>
    </div>
  );
}
