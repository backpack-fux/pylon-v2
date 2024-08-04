import { prisma } from '@/db';
import { ERROR400 } from '@/helpers/constants';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreatePasskey } from '../types/auth';
import { PrismaUser } from '../types/prisma';
import { CreateUser } from '../types/user';
import { PrismaError } from './Error';

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
      console.log('user data:', JSON.stringify(userData, null, 2  ));
      console.log('passkey data:', JSON.stringify(passkeyData, null, 2));
      
      const user = await prisma.user.create({
        data: {
          ...userData,
          registeredPasskey: {
            create: { ...passkeyData },
          },
        },
      });

      return user;
    } catch (error) {
      console.log('Error:', error);
      if (error instanceof PrismaClientKnownRequestError) {
        console.log('Prisma error code:', error.code);
        console.log('Prisma error message:', error.message);
        console.log('Prisma error meta:', error.meta);
        
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

  public async findOneById(id: number): Promise<PrismaUser | null> {
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
