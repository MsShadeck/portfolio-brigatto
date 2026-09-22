import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateVideo, deleteVideo } from "@/actions/videos";
import { VideoForm } from "@/components/admin/VideoForm";
import { DeleteButton } from "@/components/ui/DeleteButton";

export default async function EditarVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [video, categorias, clientes] = await Promise.all([
    prisma.video.findUnique({ where: { id } }),
    prisma.categoria.findMany({ orderBy: { nome: "asc" } }),
    prisma.cliente.findMany({ orderBy: { nome: "asc" } }),
  ]);

  if (!video) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl tracking-wide uppercase">Editar vídeo</h1>
        <DeleteButton
          action={deleteVideo.bind(null, video.id)}
          confirmMessage={`Excluir o vídeo "${video.titulo}"?`}
        />
      </div>
      <div className="mt-6">
        <VideoForm
          action={updateVideo.bind(null, video.id)}
          categorias={categorias}
          clientes={clientes}
          video={video}
        />
      </div>
    </div>
  );
}
