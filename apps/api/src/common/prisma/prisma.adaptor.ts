import { PrismaMariaDb } from '@prisma/adapter-mariadb';

export const adapter = new PrismaMariaDb({
  host: 'localhost',
  port: 3306,
  user: 'db-user',
  password: 'password',
  database: 'team_flow',
});