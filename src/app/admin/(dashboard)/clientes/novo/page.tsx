import { createCliente } from "@/actions/clientes";
import { ClienteForm } from "@/components/admin/ClienteForm";

export default function NovoClientePage() {
  return (
    <div>
      <h1 className="font-display text-3xl tracking-wide uppercase">Novo cliente</h1>
      <div className="mt-6">
        <ClienteForm action={createCliente} />
      </div>
    </div>
  );
}
