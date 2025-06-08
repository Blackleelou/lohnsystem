const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Test1234!', 10);

  // Testnutzer
  await prisma.user.upsert({
    where: { email: 'test@user.de' },
    update: {},
    create: {
      email: 'test@user.de',
      password,
      verified: true,
      isAdmin: false,
    },
  });

  // Hauptadmin
  await prisma.user.upsert({
    where: { email: 'jantzen.chris@gmail.com' },
    update: {},
    create: {
      email: 'jantzen.chris@gmail.com',
      password,
      verified: true,
      isAdmin: true,
    },
  });

  console.log('✅ Testnutzer und Hauptadmin wurden angelegt.');
}

main()
  .catch((e) => {
    console.error('❌ Fehler beim Seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
