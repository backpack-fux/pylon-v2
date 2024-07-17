import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastify, { FastifyInstance } from 'fastify';
import accepts from '@fastify/accepts';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import rawBody from 'fastify-raw-body';
import fastifyRedis from '@fastify/redis';
import fastifyCookie from '@fastify/cookie';
import swagger from '@fastify/swagger'; // TODO
import swaggerUi from '@fastify/swagger-ui'; // TODO

import { Home, Merchant, Bridge, Transaction, Auth } from './v1/routes/index';
import { Config } from './config';

const startServer = async () => {
  try {
    const server: FastifyInstance = fastify()
      .withTypeProvider<TypeBoxTypeProvider>()
      .register(accepts)
      .register(cors, {
        origin: true, // allow all origins
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Content-Length', 'X-Kuma-Revision'],
        credentials: true,
        maxAge: 600,
      })
      .register(formbody)
      .register(helmet)
      .register(rateLimit)
      .register(jwt, {
        secret: Config.jwtSecret,
        verify: {
          extractToken: (request) => {
            const authHeader = request.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];
            console.log(Config.jwtSecret, 'secret & token:', token);
            return token;
          },
        },
      })
      .register(rawBody, {
        field: 'rawBody',
        global: false,
        encoding: 'utf8',
        runFirst: true,
        routes: [],
      })
      .register(fastifyRedis, {
        host: Config.redis.host,
        port: Config.redis.port,
        password: Config.redis.password,
      })
      .register(fastifyCookie, {
        secret: Config.cookieSecret,
        hook: 'onRequest',
      })

      .register(Home)
      .register(Merchant, { prefix: '/v1/merchant' })
      .register(Bridge, { prefix: '/v1/bridge' })
      .register(Transaction, { prefix: '/v1/transaction' })
      .register(Auth, { prefix: '/v1/auth' });

    const serverOptions = {
      port: Config.port,
      host: '0.0.0.0', // @dev listen on all IPv4 interfaces
    };

    server.listen(serverOptions, (err, address) => {
      if (err) {
        console.error(`Server ERROR ${err}`);
        process.exit(1);
      }
      console.log(`Server listening on ${address}`);
    });
  } catch (e) {
    console.error(e);
  }
};

process.on('unhandledRejection', (e) => {
  console.error(e);
  process.exit(1);
});

startServer();
