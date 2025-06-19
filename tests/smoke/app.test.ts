// tests/smoke/app.test.ts
import next from 'next';
import http from 'http';
import request from 'supertest';

let app: ReturnType<typeof next> | undefined;
let server: http.Server | undefined;

/** Vor allen Tests: Next-App im Production-Modus booten */
beforeAll(async () => {
  app = next({ dev: false, dir: '.' });      // Projekt-Root
  await app.prepare();                       // .next-Build laden

  const handle = app.getRequestHandler();
  server = http.createServer((req, res) => handle(req, res));

  // 0 ⇒ Node wählt freien Port; Supertest greift direkt auf server-Objekt zu
  await new Promise<void>((res) => server!.listen(0, res));
}, 120_000);                                 // Build/Boot kann dauern

/** Nach allen Tests: sauber herunterfahren – nur wenn gestarted */
afterAll(async () => {
  if (server) {
    await new Promise<void>((res) => server.close(() => res()));
  }
  if (app) {
    await app.close();
  }
});

/** 1) Homepage rendert (inkl. möglichem Redirect) */
test('GET / liefert 200 (nach Redirect)', async () => {
  const res = await request(server!)
    .get('/')
    .redirects(5);           // folgt bis 5 Weiterleitungen
  expect(res.status).toBe(200);
});


/** 2) Auth-Status-Endpoint antwortet */
test('GET /api/auth/status liefert 200', async () => {
  await request(server!).get('/api/auth/status').expect(200);
});
