import { prisma } from "@/lib/prisma";
import { createVideo } from "@/actions/videos";
import { VideoForm } from "@/components/admin/VideoForm";

export default async function NovoVideoPage() {
  const [categorias, clientes] = await Promise.all([
    prisma.categoria.findMany({ orderBy: { nome: "asc" } }),
    prisma.cliente.findMany({ orderBy: { nome: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl tracking-wide uppercase">Novo vídeo</h1>
      <div className="mt-6">
        <VideoForm action={createVideo} categorias={categorias} clientes={clientes} />
      </div>
    </div>
  );
}
