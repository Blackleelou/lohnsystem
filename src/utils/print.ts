// src/utils/print.ts

export function getPrintableQrUrl(token: string) {
  return `/team/print/secure?token=${encodeURIComponent(token)}`;
}
