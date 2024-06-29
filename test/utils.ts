import Merchant from '@/v1/routes/merchant';
import fastify from 'fastify';

export function buildFastify() {
  const app = fastify();
  app.register(Merchant, { prefix: '/v1/merchant' });
  return app;
}
