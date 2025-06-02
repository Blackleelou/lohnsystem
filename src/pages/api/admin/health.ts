// src/pages/api/admin/health.ts

export default function handler(req, res) {
  res.status(200).json({
    db: "ok",
    mail: "warn",
    api: "ok",
    build: "ok",
    serverTime: new Date().toISOString(),
    // ...später echte Checks!
  });
}
