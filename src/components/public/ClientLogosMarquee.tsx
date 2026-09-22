import Image from "next/image";
import Link from "next/link";
import type { Cliente } from "@prisma/client";

export function ClientLogosMarquee({ clientes }: { clientes: Cliente[] }) {
  if (clientes.length === 0) return null;

  const track = [...clientes, ...clientes];

  return (
    <div className="overflow-hidden py-4">
      <div className="flex w-max animate-marquee gap-16 hover:[animation-play-state:paused]">
        {track.map((cliente, index) => (
          <Link
            key={`${cliente.id}-${index}`}
            href="/clientes"
            className="relative flex h-12 w-32 shrink-0 items-center justify-center grayscale opacity-60 transition-all duration-300 hover:opacity-100 hover:grayscale-0"
          >
            <Image
              src={cliente.logoUrl}
              alt={cliente.nome}
              fill
              className="object-contain"
              sizes="128px"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
