const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // Add connection pooling and timeout configurations
  transactionOptions: {
    maxWait: 5000,      // 5 seconds
    timeout: 10000,     // 10 seconds
    isolationLevel: 'ReadCommitted'
  }
});

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit();
});

module.exports = {
  PrismaClient,
  prisma
};