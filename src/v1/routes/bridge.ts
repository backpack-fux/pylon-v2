import { methods } from '@/helpers/constants';
import {
  getPrefundedAccountBalance,
  processWebhooksHandler,
} from '@/v1/handlers/bridge';
import {
  BridgePrefundedAccountBalanceSchema,
  BridgeWebhookSchema,
} from '@/v1/schemas/bridge';
import { FastifyInstance } from 'fastify';
import { validateBridgeWebhook } from '../middleware/webhook';

const Bridge = async (app: FastifyInstance) => {
  app
    .route({
      method: methods.GET,
      url: '/prefunded-account-balance',
      schema: BridgePrefundedAccountBalanceSchema,
      preHandler: [],
      handler: getPrefundedAccountBalance,
    })

    .route({
      method: methods.POST,
      url: '/prefunded-account-transfer',
      schema: BridgePrefundedAccountBalanceSchema,
      preHandler: [],
      handler: getPrefundedAccountBalance,
    })

    .route({
      config: {
        rawBody: true,
      },
      method: methods.POST,
      url: '/webhook',
      schema: BridgeWebhookSchema,
      preHandler: [validateBridgeWebhook],
      handler: processWebhooksHandler,
    });
};

export default Bridge;
