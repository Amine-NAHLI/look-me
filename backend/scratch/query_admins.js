const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const admins = await p.user.findMany({
    where: { role: 'admin' },
    select: { id: true, email: true, firstName: true, role: true }
  });
  console.log('Admin users:', JSON.stringify(admins, null, 2));
  await p.$disconnect();
}

main();
