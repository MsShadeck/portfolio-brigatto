import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123456";
  const adminNome = process.env.ADMIN_NOME ?? "Admin";

  const senhaHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      nome: adminNome,
      email: adminEmail,
      senhaHash,
    },
  });
  console.log(`Usuário admin pronto: ${adminEmail}`);

  const categorias = [
    { nome: "Aftermovie", slug: "aftermovie" },
    { nome: "Clipe", slug: "clipe" },
    { nome: "Institucional", slug: "institucional" },
    { nome: "Publicidade", slug: "publicidade" },
    { nome: "Cobertura de Evento", slug: "cobertura-de-evento" },
    { nome: "Reels", slug: "reels" },
  ];

  for (const categoria of categorias) {
    await prisma.categoria.upsert({
      where: { slug: categoria.slug },
      update: {},
      create: categoria,
    });
  }
  console.log(`${categorias.length} categorias prontas.`);

  const cliente = await prisma.cliente.upsert({
    where: { id: "cliente-exemplo" },
    update: {},
    create: {
      id: "cliente-exemplo",
      nome: "Cliente Exemplo",
      logoUrl: "/placeholder-logo.svg",
      site: "https://exemplo.com",
      depoimento: "Trabalho excelente, super recomendo!",
      ordem: 0,
    },
  });

  const categoriaAftermovie = await prisma.categoria.findUniqueOrThrow({
    where: { slug: "aftermovie" },
  });

  await prisma.video.upsert({
    where: { slug: "video-exemplo" },
    update: {},
    create: {
      titulo: "Vídeo de Exemplo",
      slug: "video-exemplo",
      urlVideo: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "/placeholder-thumb.svg",
      descricao: "Este é um vídeo de exemplo criado pelo seed.",
      ano: new Date().getFullYear(),
      funcao: "Direção, Edição",
      destaque: true,
      publicado: true,
      ordem: 0,
      clienteId: cliente.id,
      categoriaId: categoriaAftermovie.id,
    },
  });
  console.log("Vídeo de exemplo pronto.");

  await prisma.configuracao.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      nomeSite: adminNome,
      heroTitulo: "Contando histórias em movimento",
      heroTexto: "Videomaker especializado em aftermovies, clipes e institucionais.",
      bio: "Escreva aqui sua biografia.",
      emailContato: adminEmail,
    },
  });
  console.log("Configuração inicial pronta.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
