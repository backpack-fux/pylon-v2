import { FastifyInstance } from 'fastify';
import { methods } from '@/helpers/constants';
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
  sendUserTokenToAddPasskey,
  removePasskey,
  findPasskeysForUser,
} from '@/v1/handlers/auth';
import { authenticate } from '../middleware';
import { SWAGGER_TAG } from '../types/swagger';

const Authentication = async (app: FastifyInstance) => {
  /**
   * @description Send a passkey challenge to the client
   */
  app
    .route({
      method: methods.GET,
      url: '/challenge',
      schema: SendWebAuthnChallengeSchema,
      handler: generateChallenge,
    })

    /**
     * @description Register a Passkey for a new user
     * @returns user object with jwt token
     */
    .route({
      method: methods.POST,
      url: '/passkey/register',
      schema: RegisterPasskeySchema,
      handler: registerPasskey,
    })

    /**
     * @description Authenticate a Passkey against existing passkeys on the server
     * @returns user object with jwt token
     */
    .route({
      method: methods.POST,
      url: '/passkey',
      schema: AuthenticatePasskeySchema,
      handler: authenticatePasskey,
    })

    /**
     * @description Send a token to a user to add a new passkey
     * @returns user object with jwt token
     */
    .route({
      method: methods.POST,
      url: 'passkey/add/send-token',
      schema: RegisterPasskeySchema,
      handler: sendUserTokenToAddPasskey,
    })

    /**
     * @description Register a Passkey for an existing user
     * @returns user object with jwt token
     */
    .route({
      method: methods.PUT,
      url: '/add',
      schema: RegisterPasskeyForExistingUserSchema,
      preHandler: [authenticate],
      handler: registerPasskeyForExistingUser,
    })

    /**
     * @description Find all passkeys for a user
     * @returns passkeys
     */
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

    /**
     * @description Remove a passkey for a user
     * @returns passkeys
     */
    .route({
      method: methods.DELETE,
      url: '/passkey/:id',
      schema: RemovePasskeySchema,
      preHandler: [authenticate],
      handler: removePasskey,
    });
};

export default Authentication;
