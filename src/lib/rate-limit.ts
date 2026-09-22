import "server-only";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 3;

const hits = new Map<string, number[]>();

/**
 * Rate limit simples em memória (por processo). Suficiente para um único
 * formulário de contato de baixo tráfego; não sobrevive a restarts nem
 * funciona entre múltiplas instâncias — se o tráfego crescer, trocar por
 * um store compartilhado (ex.: Upstash Redis).
 */
export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    hits.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return false;
}
