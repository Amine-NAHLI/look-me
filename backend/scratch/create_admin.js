const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const p = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('ramrani197@gmail.com', 12);
  const admin = await p.user.create({
    data: {
      firstName: 'Rajae',
      email: 'ramrani197@gmail.com',
      password,
      role: 'admin'
    }
  });
  console.log('Admin créé avec succès:', { id: admin.id, email: admin.email, role: admin.role });
  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
