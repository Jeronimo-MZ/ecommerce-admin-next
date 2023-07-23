import { PrismaClient } from "@prisma/client";

// For Development only
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma: PrismaClient = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  globalThis.prisma = prisma;
}

export { prisma };
