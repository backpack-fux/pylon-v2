import { PrismaUser } from './prisma';

export type CreateUser = Pick<PrismaUser, 'email' | 'username' | 'role'>;
export type UpdateUser = Pick<PrismaUser, 'email' | 'username' | 'role'>;
