import { FastifyInstance } from 'fastify';
import { methods } from '@/helpers/constants';
import { processTransaction } from '../handlers/transaction';
import { TransactionProcessSchema } from '../schemas/transaction';
import { validateMerchantAPIKey } from '../middleware/merchant';

const Transaction = async (app: FastifyInstance) => {
  app.route({
    method: methods.POST,
    url: '/process',
    schema: TransactionProcessSchema,
    preHandler: [validateMerchantAPIKey],
    handler: processTransaction,
  });
};

export default Transaction;
