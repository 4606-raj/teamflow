import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';

export const adapter = new PrismaMariaDb({
  host: process.env['DB_HOST'],
  port: Number(process.env['DB_PORT']),
  user: process.env['DB_USER'],
  password: process.env['DB_PASSWORD'],
  database: process.env['DB_NAME'],
  trace: true,
  // MySQL 8.4 uses caching_sha2_password; after a server restart the first login
  // needs the RSA public key, which the mariadb driver won't fetch by default.
  allowPublicKeyRetrieval: true,
});
