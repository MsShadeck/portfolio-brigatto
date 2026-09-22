import { auth } from "@/lib/auth";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export default async function ContaPage() {
  const session = await auth();

  return (
    <div>
      <h1 className="font-display text-3xl tracking-wide uppercase">Conta</h1>
      <p className="mt-1 text-sm text-foreground-muted">{session?.user?.email}</p>

      <div className="mt-6 max-w-md">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
