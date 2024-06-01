import crypto from 'crypto';
import { RegisterDeviceWithWebAuthnSchema } from '@/v1/schemas/authentication';
import { server } from '@passwordless-id/webauthn';
import { RegistrationEncoded } from '@passwordless-id/webauthn/dist/esm/types';
import { RegistrationChecks } from '../types/webauthn';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaError } from './Error';
import { ERROR400 } from '@/helpers/constants';
import { prisma } from '@/db';

export class AuthenticationService {
  private static instance: AuthenticationService;

  public static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
    }
    return AuthenticationService.instance;
  }

  public async generateChallenge() {
    // Generate a random challenge
    return crypto.randomBytes(32).toString('base64');
  }

  public async registerDeviceWithWebAuthn(
    registration: RegistrationEncoded,
    expected: RegistrationChecks
  ) {
    try {
      // Return the verified credentials
      const verified = await server.verifyRegistration(registration, expected);

      const user = await prisma.merchant

      
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new PrismaError(ERROR400.statusCode, error.message);
      } else {
        throw error;
      }
    }
  }
}
