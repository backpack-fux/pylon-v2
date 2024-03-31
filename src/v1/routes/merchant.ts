import { FastifyInstance } from 'fastify';
import { methods } from '@/helpers/constants';
import { createMerchantHandler } from '../handlers/merchant';
import { CreateMerchantSchema } from '../schemas/merchant';
import { validateAPIKey } from '../middleware';

const Merchant = async (app: FastifyInstance) => {
  /** @description create a new merchant */
  /** @returns KYB links from our compliance partner e.g. bridge */
  app.route({
    method: methods.POST,
    url: '/create',
    schema: CreateMerchantSchema,
    preHandler: [validateAPIKey],
    handler: createMerchantHandler,
  });
};

export default Merchant;
