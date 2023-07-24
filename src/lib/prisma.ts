import { PrismaClient } from "@prisma/client";

// For Development
declare global {
  var prismaDb: PrismaClient | undefined;
}

const prisma: PrismaClient = globalThis.prismaDb || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  globalThis.prismaDb = prisma;
}

export { prisma };
