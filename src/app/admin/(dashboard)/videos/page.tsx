import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { SortableVideosTable } from "@/components/admin/SortableVideosTable";

export default async function VideosPage() {
  const videos = await prisma.video.findMany({
    orderBy: { ordem: "asc" },
    include: { categoria: true, cliente: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-wide uppercase">Vídeos</h1>
          <p className="mt-1 text-sm text-foreground-muted">{videos.length} vídeo(s) cadastrado(s).</p>
        </div>
        <Link href="/admin/videos/novo">
          <Button>Novo vídeo</Button>
        </Link>
      </div>

      <div className="mt-6">
        <SortableVideosTable videos={videos} />
      </div>
    </div>
  );
}
