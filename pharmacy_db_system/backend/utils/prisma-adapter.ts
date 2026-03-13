import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
// import pg from "pg";

const connectionString = process.env.DATABASE_URL;
// console.log("Connection String:", connectionString);
const adapter = new PrismaPg({ connectionString });
export const prismaClient = new PrismaClient({ adapter });