import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['error', 'warn']
        : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Handle graceful shutdown
process.on('exit', async () => {
  await prisma.$disconnect();
});

// Validate connection on startup
export async function validateDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection validated');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}
