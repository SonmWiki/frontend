export function isNullOrWhitespace<T extends string>(input: T | null | undefined): boolean {
  return !input || !input.trim()
}