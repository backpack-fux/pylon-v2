import { FastifyInstance } from 'fastify';
import { methods } from '@/helpers/constants';
import {
  AuthenticatePasskeyWithWebAuthnSchema,
  RegisterPasskeyForExistingUserSchema,
  RegisterPasskeyWithWebAuthnSchema,
  RemovePasskeySchema,
  SendWebAuthnChallengeSchema,
} from '@/v1/schemas/passkey';
import {
  authenticatePasskeyWithWebAuthn,
  generateChallenge,
  registerPasskeyForExistingUser,
  registerPasskeyWithWebAuthn,
  initiateRegisterPasskeyForExistingUser,
  removePasskey,
} from '@/v1/handlers/passkey';
import { authenticate } from '../middleware';

const Authentication = async (app: FastifyInstance) => {
  /**
   * @description Send a challenge to the client
   * @param {FastifyRequestTypebox<typeof SendWebAuthnChallengeSchema>} req
   */
  app
    .route({
      method: methods.GET,
      url: '/challenge',
      schema: SendWebAuthnChallengeSchema,
      handler: generateChallenge,
    })
    /**
     * @description Register a Passkey with WebAuthn
     * @param {FastifyRequestTypebox<typeof RegisterPasskeyWithWebAuthnSchema>} req
     */
    .route({
      method: methods.POST,
      url: '/register',
      schema: RegisterPasskeyWithWebAuthnSchema,
      handler: registerPasskeyWithWebAuthn,
    })
    /**
     * @description Authenticate a Passkey with WebAuthn
     */
    .route({
      method: methods.POST,
      url: '/authenticate',
      schema: AuthenticatePasskeyWithWebAuthnSchema,
      handler: authenticatePasskeyWithWebAuthn,
    })
    .route({
      method: methods.POST,
      url: '/initiate-register',
      schema: RegisterPasskeyWithWebAuthnSchema,
      handler: initiateRegisterPasskeyForExistingUser,
    })
    .route({
      method: methods.PATCH,
      url: '/add',
      schema: RegisterPasskeyForExistingUserSchema,
      preHandler: [authenticate],
      handler: registerPasskeyForExistingUser,
    })
    .route({
      method: methods.DELETE,
      url: '/:id',
      schema: RemovePasskeySchema,
      preHandler: [authenticate],
      handler: removePasskey,
    });
};

export default Authentication;
