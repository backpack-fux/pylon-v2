import { FastifyInstance } from 'fastify';
import { methods } from '@/helpers/constants';
import {
  RegisterDeviceWithWebAuthnSchema,
  SendWebAuthnChallengeSchema,
} from '../schemas/authentication';
import {
  registerDeviceWithWebAuthn,
  sendChallenge,
} from '../handlers/authentication';

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
      handler: sendChallenge,
    })
    /**
     * @description Register a device with WebAuthn
     * @param {FastifyRequestTypebox<typeof RegisterDeviceWithWebAuthnSchema>} req
     */
    .route({
      method: methods.POST,
      url: '/register',
      schema: RegisterDeviceWithWebAuthnSchema,
      handler: registerDeviceWithWebAuthn,
    });
};

export default Authentication;
