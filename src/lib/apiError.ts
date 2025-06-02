export function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    // @ts-ignore
    return err.message;
  }
  return "Unbekannter Fehler";
}
