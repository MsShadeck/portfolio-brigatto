import { prisma } from "@/lib/prisma";
import { updateConfiguracao } from "@/actions/configuracao";
import { ConfiguracaoForm } from "@/components/admin/ConfiguracaoForm";

export default async function ConfiguracoesPage() {
  const configuracao = await prisma.configuracao.findUnique({ where: { id: "singleton" } });

  return (
    <div>
      <h1 className="font-display text-3xl tracking-wide uppercase">Configurações</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Dados usados na home, na página sobre e no contato do site público.
      </p>

      <div className="mt-6">
        <ConfiguracaoForm action={updateConfiguracao} configuracao={configuracao ?? undefined} />
      </div>
    </div>
  );
}
