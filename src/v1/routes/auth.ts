import { FastifyInstance } from 'fastify';
import { methods } from '@/helpers/constants';
import {
  AuthenticatePasskeyWithWebAuthnSchema,
  BaseResponseSchema,
  RegisterPasskeyForExistingUserSchema,
  RegisterPasskeyWithWebAuthnSchema,
  RemovePasskeySchema,
  SendWebAuthnChallengeSchema,
} from '@/v1/schemas/auth';
import {
  authenticatePasskeyWithWebAuthn,
  generateChallenge,
  registerPasskeyForExistingUser,
  registerPasskeyWithWebAuthn,
  initiateRegisterPasskeyForExistingUser,
  removePasskey,
  findPasskeysForUser,
} from '@/v1/handlers/auth';
import { authenticate } from '../middleware';
import { SWAGGER_TAG } from '../types/swagger';

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
      url: '',
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
      url: '/add-passkey',
      schema: RegisterPasskeyForExistingUserSchema,
      preHandler: [authenticate],
      handler: registerPasskeyForExistingUser,
    })
    .route({
      method: methods.GET,
      url: '',
      schema: {
        tags: [SWAGGER_TAG.Authentication],
        ...BaseResponseSchema,
      },
      preHandler: [authenticate],
      handler: findPasskeysForUser,
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
