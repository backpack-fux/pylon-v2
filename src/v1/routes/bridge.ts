import { FastifyInstance } from 'fastify';
import { methods } from '@/helpers/constants';
import { validateAPIKey } from '../middleware';
import { getPrefundedAccountBalance } from '../handlers/bridge';

const Bridge = async (app: FastifyInstance) => {
  app.route({
    method: methods.GET,
    url: '/prefunded-account-balance',
    preHandler: [],
    handler: getPrefundedAccountBalance,
  });
};

export default Bridge;
