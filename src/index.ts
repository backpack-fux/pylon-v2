import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastify from 'fastify';
import accepts from '@fastify/accepts';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import rawBody from 'fastify-raw-body';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { Home, Merchant, Bridge, Auth } from './v1/routes/index';
import { Config } from './config';

const startServer = async () => {
  try {
    const server = fastify()
      .withTypeProvider<TypeBoxTypeProvider>()
      .register(accepts)
      .register(cors)
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
      });

    await server
      .register(rawBody, {
        field: 'rawBody',
        global: false,
        encoding: 'utf8',
        runFirst: true,
        routes: [],
      })
      .register(swagger, {
        prefix: '/docs',
        swagger: {
          swagger: '2.0',
          info: {
            title: 'Pylon V2 API',
            description: 'Pylon V2 API Documentation',
            version: '1.0.0',
          },
          host: Config.host,
          // security: {
          //   apiKey: '',
          //   Authorization: 'Bearer <token>',
          // },
        },
      })
      .register(swaggerUi, {
        routePrefix: '/docs',
      })
      .register(Home)
      .register(Merchant, { prefix: '/v1/merchant' })
      .register(Bridge, { prefix: '/v1/bridge' })
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

    await server.ready();
    server.swagger();
  } catch (e) {
    console.error(e);
  }
};

process.on('unhandledRejection', (e) => {
  console.error(e);
  process.exit(1);
});

startServer();
