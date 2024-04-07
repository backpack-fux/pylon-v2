import { Config } from '@/config';
import { ERROR401 } from '@/helpers/constants';
import { ERRORS } from '@/helpers/errors';
import { FastifyRequest, FastifyReply } from 'fastify';

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const authHeader = request.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  console.log(process.env.JWT_SECRET, 'secret & token:', token);

  if (!token) {
    return reply.code(ERROR401.statusCode).send({
      unauthorized: ERRORS.auth.missingAuthorizationHeader,
    });
  }
  try {
    // Verify the JWT token using the Fastify JWT plugin
    await request.jwtVerify();
    // If the token is valid, continue with the request
    return;
  } catch (err) {
    return reply
      .code(ERROR401.statusCode)
      .send({ unauthorized: ERRORS.auth.invalidJWT });
  }
};

export const validateAPIKey = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const authHeader = request.headers.authorization;
  const apiKey = authHeader && authHeader.split(' ')[1];

  if (!apiKey) {
    return reply
      .code(ERROR401.statusCode)
      .send({ unauthorized: ERRORS.auth.missingAuthorizationHeader });
  }

  if (apiKey !== Config.serverApiKey) {
    return reply
      .code(ERROR401.statusCode)
      .send({ unauthorized: ERRORS.auth.invalidAPIKey });
  } else {
    return;
  }
};

/** @TODO create merchant middleware to check if any of the body is not unique,
 * unless this can be done natively by prisma
 * */
