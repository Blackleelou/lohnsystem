
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Test1234!', 10);

  await prisma.user.upsert({
    where: { email: 'test@user.de' },
    update: {},
    create: {
      email: 'test@user.de',
      username: 'testuser1',
      password,
    },
  });

  console.log('✅ Testuser wurde angelegt oder aktualisiert: test@user.de / Test1234!');
}

main()
  .catch((e) => {
    console.error('❌ Fehler beim Seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
