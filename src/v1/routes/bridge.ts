import { methods } from '@/helpers/constants';
import {
  createPrefundedAccountTransfer,
  getPrefundedAccountBalance,
  processWebhooksHandler,
} from '@/v1/handlers/bridge';
import {
  BridgePrefundedAccountBalanceSchema,
  BridgePrefundedAccountTransferSchema,
  BridgeWebhookSchema,
} from '@/v1/schemas/bridge';
import { FastifyInstance } from 'fastify';
import { validateFarcasterUser } from '../middleware/auth';
import { validateBridgeWebhook } from '../middleware/webhook';

const Bridge = async (app: FastifyInstance) => {
  app
    .route({
      method: methods.POST,
      url: '/prefunded-account-balance',
      schema: BridgePrefundedAccountBalanceSchema,
      preHandler: [validateFarcasterUser],
      handler: getPrefundedAccountBalance,
    })

    .route({
      method: methods.POST,
      url: '/prefunded-account-transfer',
      schema: BridgePrefundedAccountTransferSchema,
      preHandler: [validateFarcasterUser],
      handler: createPrefundedAccountTransfer,
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
