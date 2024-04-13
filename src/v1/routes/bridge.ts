import { FastifyInstance } from 'fastify';
import { methods } from '@/helpers/constants';
import { validateAPIKey, authMiddlewareForWebhook } from '../middleware';
import {
  getPrefundedAccountBalance,
  processWebhooksHandler,
} from '../handlers/bridge';

const Bridge = async (app: FastifyInstance) => {
  app
    .route({
      method: methods.GET,
      url: '/prefunded-account-balance',
      preHandler: [],
      handler: getPrefundedAccountBalance,
    })

    .route({
      config: {
        rawBody: true,
      },
      method: methods.POST,
      url: '/webhook',
      preHandler: [authMiddlewareForWebhook],
      handler: processWebhooksHandler,
    });
};

export default Bridge;
