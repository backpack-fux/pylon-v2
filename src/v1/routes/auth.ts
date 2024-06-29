import { FastifyInstance } from 'fastify';
import { methods } from '@/helpers/constants';
import { issueOTPHandler, verifyOTPHandler } from '../handlers/auth';
import { IssueOTPSchema, VerifyOTPSchema } from '../schemas/auth';
import {
  AuthenticatePasskeySchema,
  BaseResponseSchema,
  RegisterPasskeyForExistingUserSchema,
  RegisterPasskeySchema,
  RemovePasskeySchema,
  SendWebAuthnChallengeSchema,
} from '@/v1/schemas/auth';
import {
  authenticatePasskey,
  generateChallenge,
  registerPasskeyForExistingUser,
  registerPasskey,
  initiatePasskeyRegistration,
  removePasskey,
  findPasskeysForUser,
} from '@/v1/handlers/auth';
import { authenticate } from '../middleware';
import { SWAGGER_TAG } from '../types/swagger';

const Authentication = async (app: FastifyInstance) => {
  // Generates a challenge for the client to authenticate the user
  app
    .route({
      method: methods.GET,
      url: '/challenge',
      schema: SendWebAuthnChallengeSchema,
      handler: generateChallenge,
    })

    // Registers a passkey for a new user
    .route({
      method: methods.POST,
      url: '/passkey/register',
      schema: RegisterPasskeySchema,
      handler: registerPasskey,
    })

    // Authenticates a passkey against existing passkeys on the server
    .route({
      method: methods.POST,
      url: '/passkey',
      schema: AuthenticatePasskeySchema,
      handler: authenticatePasskey,
    })

    // Sends a token to a user to add a new passkey
    .route({
      method: methods.POST,
      url: '/passkey/add/send-token',
      schema: RegisterPasskeySchema,
      handler: initiatePasskeyRegistration,
    })

    // Registers a passkey for an existing user
    .route({
      method: methods.PUT,
      url: '/add',
      schema: RegisterPasskeyForExistingUserSchema,
      preHandler: [authenticate],
      handler: registerPasskeyForExistingUser,
    })

    // Finds all passkeys for a user
    .route({
      method: methods.GET,
      url: '/passkey',
      schema: {
        tags: [SWAGGER_TAG.Authentication],
        ...BaseResponseSchema,
      },
      preHandler: [authenticate],
      handler: findPasskeysForUser,
    })

    // Removes a passkey for a user
    .route({
      method: methods.DELETE,
      url: '/passkey/:id',
      schema: RemovePasskeySchema,
      preHandler: [authenticate],
      handler: removePasskey,
    })

    .route({
      method: methods.POST,
      url: '/otp/issue',
      schema: IssueOTPSchema,
      handler: issueOTPHandler,
    })

    .route({
      method: methods.POST,
      url: '/otp/verify',
      schema: VerifyOTPSchema,
      handler: verifyOTPHandler,
    });
};

export default Authentication;
