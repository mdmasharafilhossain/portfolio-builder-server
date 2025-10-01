
import 'dotenv/config';  
import bcrypt from 'bcryptjs';
import { prisma } from '../config/db';

export async function seedAdmin() {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASS = process.env.ADMIN_PASSWORD;
  const SALT_ROUNDS = Number(process.env.bcrypt_salt_rounds) || 10;

  if (!ADMIN_EMAIL || !ADMIN_PASS) {
    console.warn(' ADMIN_EMAIL or ADMIN_PASS not set in .env. Skipping admin seeding.');
    return;
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
    if (existing) {
      console.log('Admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASS, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        name: 'Admin',
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('Created admin:', user.email);
  } catch (error) {
    console.error('Failed to seed admin:', error);
  }
}


if (require.main === module) {
  seedAdmin()
    .catch(console.error)
    .finally(() => process.exit());
}
