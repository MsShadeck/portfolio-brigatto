import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

// Regenera a cada hora — evita que vídeos novos fiquem de fora do sitemap
// entre deploys, sem precisar tornar a rota totalmente dinâmica.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const videos = await prisma.video.findMany({
    where: { publicado: true },
    select: { slug: true, atualizadoEm: true },
    orderBy: { atualizadoEm: "desc" },
  });

  const paginasEstaticas: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/trabalhos`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/clientes`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/sobre`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contato`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const paginasDeVideo: MetadataRoute.Sitemap = videos.map((video) => ({
    url: `${baseUrl}/trabalhos/${video.slug}`,
    lastModified: video.atualizadoEm,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...paginasEstaticas, ...paginasDeVideo];
}
