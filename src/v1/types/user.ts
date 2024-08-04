import { PrismaUser } from './prisma';

export type CreateUser = Pick<PrismaUser, 'email' | 'username'>;
export type UpdateUser = Pick<PrismaUser, 'email' | 'username'>;
