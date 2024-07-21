import { methods } from '@/helpers/constants';
import {
  authenticatePasskey,
  deleteFarcasterJWT,
  findPasskeysForUser,
  generateChallenge,
  generateFarcasterJWT,
  initiatePasskeyRegistration,
  issueOTPHandler,
  registerPasskey,
  registerPasskeyForExistingUser,
  removePasskey,
  verifyOTPHandler,
} from '@/v1/handlers/auth';
import { authenticate } from '@/v1/middleware/auth';
import {
  AuthenticatePasskeySchema,
  BaseResponseSchema,
  GenerateFarcasterJWTSchema,
  IssueOTPSchema,
  RegisterPasskeyForExistingUserSchema,
  RegisterPasskeySchema,
  RemovePasskeySchema,
  SendWebAuthnChallengeSchema,
  VerifyOTPSchema,
} from '@/v1/schemas/auth';
import { SWAGGER_TAG } from '@/v1/types/swagger';
import { FastifyInstance } from 'fastify';

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
    })

    .route({
      method: methods.POST,
      url: '/jwt',
      schema: GenerateFarcasterJWTSchema,
      handler: generateFarcasterJWT,
    })

    .route({
      method: methods.DELETE,
      url: '/jwt',
      schema: BaseResponseSchema,
      handler: deleteFarcasterJWT,
    });
};

export default Authentication;
