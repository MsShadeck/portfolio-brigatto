import { prisma } from "@/lib/prisma";
import { marcarMensagemLida, deleteMensagem } from "@/actions/mensagens";
import { DeleteButton } from "@/components/ui/DeleteButton";

function formatarData(data: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(data);
}

export default async function MensagensPage() {
  const mensagens = await prisma.mensagem.findMany({ orderBy: { criadoEm: "desc" } });

  return (
    <div>
      <h1 className="font-display text-3xl tracking-wide uppercase">Mensagens</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        {mensagens.filter((m) => !m.lida).length} não lida(s) de {mensagens.length}.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {mensagens.map((mensagem) => (
          <div
            key={mensagem.id}
            className={`rounded-lg border p-5 ${
              mensagem.lida ? "border-border bg-surface" : "border-accent/50 bg-surface"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium">
                  {mensagem.nome}{" "}
                  {!mensagem.lida && (
                    <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
                      Nova
                    </span>
                  )}
                </p>
                <p className="text-xs text-foreground-muted">
                  {mensagem.email}
                  {mensagem.telefone ? ` · ${mensagem.telefone}` : ""}
                  {mensagem.tipoProjeto ? ` · ${mensagem.tipoProjeto}` : ""}
                </p>
              </div>
              <p className="text-xs text-foreground-muted">{formatarData(mensagem.criadoEm)}</p>
            </div>

            <p className="mt-3 text-sm text-foreground whitespace-pre-wrap">{mensagem.texto}</p>

            <div className="mt-4 flex items-center gap-3">
              <form action={marcarMensagemLida.bind(null, mensagem.id, !mensagem.lida)}>
                <button
                  type="submit"
                  className="text-xs text-foreground-muted hover:text-accent"
                >
                  {mensagem.lida ? "Marcar como não lida" : "Marcar como lida"}
                </button>
              </form>
              <DeleteButton
                action={deleteMensagem.bind(null, mensagem.id)}
                confirmMessage="Excluir esta mensagem?"
              />
            </div>
          </div>
        ))}

        {mensagens.length === 0 && (
          <div className="rounded-lg border border-border bg-surface p-8 text-center text-foreground-muted">
            Nenhuma mensagem recebida ainda.
          </div>
        )}
      </div>
    </div>
  );
}
