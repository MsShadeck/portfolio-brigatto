import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // A rota /admin/login não usa este layout (grupo separado), então
  // se chegamos aqui sem sessão é porque algo escapou do middleware —
  // falhar de forma segura em vez de renderizar dados do admin.
  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-foreground-muted">
        Não autorizado.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar userName={session.user.name ?? session.user.email ?? "Admin"} />
      <main className="flex-1 overflow-x-hidden p-4 sm:p-8">{children}</main>
    </div>
  );
}
