// Money + label helpers shared across the app.

export function money(cents: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function price(cents: number, interval?: string | null): string {
  return interval ? `${money(cents)}/${interval === "year" ? "yr" : "mo"}` : money(cents);
}

export function dateLabel(d: string | Date): string {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Human-friendly status labels.
export function titleCase(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Short reference code for invoices / check memos, e.g. "GVO-7F3K2Q".
export function makeReference(prefix = "GVO"): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) {
    // crypto for unbiased, collision-resistant codes
    const idx = (globalThis.crypto?.getRandomValues(new Uint32Array(1))[0] ?? 0) % chars.length;
    s += chars[idx];
  }
  return `${prefix}-${s}`;
}
