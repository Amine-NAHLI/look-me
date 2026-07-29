require('dotenv').config();
const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');
const { connectDatabase, disconnectDatabase, prisma } = require('../config/db');
const bcrypt = require('bcryptjs');

async function main() {
  const cli = readline.createInterface({ input, output });
  const email = (process.env.ADMIN_EMAIL || await cli.question('Email administrateur : ')).trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || await cli.question('Mot de passe administrateur (10+ caractères) : ');
  if (!email || password.length < 10) throw new Error('ADMIN_EMAIL et un mot de passe de 10 caractères minimum sont requis.');
  
  await connectDatabase();
  const existing = await prisma.user.findUnique({ where: { email } });
  
  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { role: 'admin' }
    });
  } else {
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({ 
      data: { 
        firstName: 'Administrateur', 
        email, 
        password: hashedPassword, 
        role: 'admin',
        passwordChangedAt: new Date()
      } 
    });
  }
  
  await disconnectDatabase();
  await cli.close();
  process.stdout.write('Administrateur créé ou promu.\n');
}

main().catch(async (error) => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
