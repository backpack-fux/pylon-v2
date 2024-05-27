import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { utils } from '@/helpers/utils';
import { ERROR500, STANDARD } from '@/helpers/constants';

import Merchant from './merchant';
import Bridge from './bridge';
export { default as Authentication } from './authentication';
export { default as Rain } from './rain';
export { default as Upload } from './upload';
import Transaction from './transaction';

const Home = async (app: FastifyInstance) => {
  app
    .all('/', async (req: FastifyRequest, rep: FastifyReply) => {
      rep.code(STANDARD.SUCCESS).send({ ok: true });
    })

    .get('/health-check', async (req: FastifyRequest, rep: FastifyReply) => {
      try {
        await utils.healthCheck(); //status 200
        rep.code(STANDARD.SUCCESS).send({ message: 'Success' });
      } catch (e) {
        rep.code(ERROR500.statusCode);
      }
    });
};

export { Home, Merchant, Bridge, Transaction };
