function toWhatsappLink(numero: string) {
  const digits = numero.replace(/\D/g, "");
  const comCodigoPais = digits.length <= 11 ? `55${digits}` : digits;
  return `https://wa.me/${comCodigoPais}`;
}

export function WhatsappButton({ whatsapp }: { whatsapp: string | null | undefined }) {
  if (!whatsapp) return null;

  return (
    <a
      href={toWhatsappLink(whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 32 32" fill="currentColor" className="h-7 w-7">
        <path d="M16.004 3C9.377 3 4 8.373 4 14.996c0 2.34.652 4.53 1.785 6.404L4 29l7.79-1.75a12.94 12.94 0 0 0 4.214.7c6.627 0 12.004-5.373 12.004-11.996C28.008 8.373 22.63 3 16.004 3Zm0 21.8a9.7 9.7 0 0 1-4.955-1.36l-.355-.21-4.62 1.038 1.06-4.5-.232-.368a9.72 9.72 0 0 1-1.494-5.204c0-5.37 4.372-9.74 9.596-9.74 5.222 0 9.594 4.37 9.594 9.74 0 5.372-4.372 9.604-9.594 9.604Zm5.276-7.196c-.29-.145-1.71-.844-1.976-.94-.265-.096-.458-.145-.65.146-.194.29-.746.94-.916 1.134-.168.194-.337.218-.626.073-.29-.145-1.223-.45-2.33-1.437-.86-.767-1.442-1.715-1.611-2.005-.168-.29-.018-.446.127-.59.13-.13.29-.338.435-.507.145-.169.193-.29.29-.483.096-.194.048-.362-.024-.507-.073-.145-.65-1.567-.891-2.148-.235-.564-.474-.487-.65-.496l-.554-.01c-.194 0-.507.073-.773.362-.265.29-1.012.99-1.012 2.412 0 1.422 1.036 2.796 1.18 2.99.145.194 2.04 3.116 4.943 4.368.69.298 1.229.476 1.649.61.693.22 1.324.19 1.823.115.556-.083 1.71-.699 1.951-1.373.24-.675.24-1.253.168-1.373-.072-.121-.265-.194-.555-.339Z" />
      </svg>
    </a>
  );
}
