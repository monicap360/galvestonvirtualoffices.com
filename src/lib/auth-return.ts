export function safeAuthReturn(value: unknown): string {
  if (typeof value !== "string" || !/^\/(?!\/)/.test(value) || /[\\\x00-\x20\x7f]/.test(value)) {
    return "/dashboard";
  }
  return value;
}
