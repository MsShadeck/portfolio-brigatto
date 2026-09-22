import { prisma } from "@/lib/prisma";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { WhatsappButton } from "@/components/public/WhatsappButton";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const configuracao = await prisma.configuracao.findUnique({ where: { id: "singleton" } });

  return (
    <>
      <Header nomeSite={configuracao?.nomeSite ?? "Videomaker"} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer configuracao={configuracao} />
      <WhatsappButton whatsapp={configuracao?.whatsapp} />
    </>
  );
}
