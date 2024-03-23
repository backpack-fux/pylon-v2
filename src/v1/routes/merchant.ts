import { FastifyInstance } from 'fastify';
import { methods } from '@/helpers/api';
import { createMerchantHandler } from '../handlers/merchant';
import { CreateMerchantInput } from '../schemas/merchant';
import { validateAPIKey } from '../middleware';

const Merchant = async (app: FastifyInstance) => {
  /** @description create a new merchant */
  /** @returns KYB links from our compliance partner e.g. bridge */
  app.route({
    method: methods.POST,
    url: '/create',
    schema: CreateMerchantInput,
    preHandler: [validateAPIKey],
    handler: createMerchantHandler,
  });
};

export default Merchant;
