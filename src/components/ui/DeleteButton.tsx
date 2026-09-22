"use client";

import { SubmitButton } from "./Button";

export function DeleteButton({
  action,
  confirmMessage = "Tem certeza que deseja excluir? Essa ação não pode ser desfeita.",
  label = "Excluir",
}: {
  action: () => Promise<void>;
  confirmMessage?: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <SubmitButton variant="danger" pendingLabel="Excluindo...">
        {label}
      </SubmitButton>
    </form>
  );
}
