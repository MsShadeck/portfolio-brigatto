import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const displayFont = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const sansFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const configuracao = await prisma.configuracao.findUnique({ where: { id: "singleton" } });
  const nomeSite = configuracao?.nomeSite ?? "Portfólio Videomaker";
  const descricao =
    configuracao?.heroTexto ?? "Portfólio audiovisual — aftermovies, clipes e institucionais.";

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      template: `%s | ${nomeSite}`,
      default: `${nomeSite} — ${configuracao?.heroTitulo ?? "Portfólio"}`,
    },
    description: descricao,
    openGraph: {
      siteName: nomeSite,
      type: "website",
      locale: "pt_BR",
      ...(configuracao?.fotoUrl ? { images: [{ url: configuracao.fotoUrl }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${displayFont.variable} ${sansFont.variable} h-full antialiased`}
      data-theme="dark"
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
