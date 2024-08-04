import { prisma } from '@/db';
import { PrismaUser } from '../types/prisma';
import { CreateUser } from '../types/user';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaError } from './Error';
import { ERROR400 } from '@/helpers/constants';
import { CreatePasskey } from '../types/auth';

export class UserService {
  private static instance: UserService;

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async create(userData: CreateUser): Promise<PrismaUser> {
    try {
      const user = await prisma.user.create({
        data: userData,
      });

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new PrismaError(ERROR400.statusCode, error.message);
      } else {
        throw error;
      }
    }
  }

  public async createWithRegisteredPasskey(
    userData: CreateUser,
    passkeyData: Omit<CreatePasskey, 'userId'>
  ): Promise<PrismaUser> {
    try {
      const user = await prisma.user.create({
        data: {
          ...userData,
          registeredPasskeys: {
            create: { ...passkeyData },
          },
        },
      });

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new PrismaError(ERROR400.statusCode, error.message);
      } else {
        throw error;
      }
    }
  }

  public async findOneByEmail(email: string): Promise<PrismaUser | null> {
    try {
      return await prisma.user.findFirst({
        where: {
          email,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new PrismaError(ERROR400.statusCode, error.message);
      } else {
        throw error;
      }
    }
  }

  public async findOneById(id: bigint): Promise<PrismaUser | null> {
    try {
      return await prisma.user.findFirst({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new PrismaError(ERROR400.statusCode, error.message);
      } else {
        throw error;
      }
    }
  }
}
