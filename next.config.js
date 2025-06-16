// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // falls du sonst schon Einstellungen hast, füge das eslint-Objekt hinzu oder merge es
  eslint: {
    // verhindert, dass Next.js beim "next build" ESLint ausführt
    ignoreDuringBuilds: true,
  },

  // hier können bei Bedarf weitere Next.js-Konfigurationen rein
};

module.exports = nextConfig;
