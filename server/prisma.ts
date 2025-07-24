// server/src/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default prisma;
// This file initializes the Prisma client for database interactions.