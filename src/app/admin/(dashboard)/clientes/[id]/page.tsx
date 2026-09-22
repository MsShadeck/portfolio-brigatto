import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCliente, deleteCliente } from "@/actions/clientes";
import { ClienteForm } from "@/components/admin/ClienteForm";
import { DeleteButton } from "@/components/ui/DeleteButton";

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cliente = await prisma.cliente.findUnique({ where: { id } });
  if (!cliente) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl tracking-wide uppercase">Editar cliente</h1>
        <DeleteButton
          action={deleteCliente.bind(null, cliente.id)}
          confirmMessage={`Excluir o cliente "${cliente.nome}"?`}
        />
      </div>
      <div className="mt-6">
        <ClienteForm action={updateCliente.bind(null, cliente.id)} cliente={cliente} />
      </div>
    </div>
  );
}
