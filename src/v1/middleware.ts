import { Config } from '@/config';
import {
  ERROR400,
  ERROR401,
  ERROR403,
  bridgeWebhookAllowedIPs,
} from '@/helpers/constants';
import { ERRORS } from '@/helpers/errors';
import {
  FastifyRequest,
  FastifyReply,
  FastifyServerFactoryHandler,
} from 'fastify';
import { createHmac } from 'crypto';
import { utils } from '@/helpers/utils';

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

export const authenticateWebAuthn = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  
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

export const authMiddlewareForWebhook = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const ipAddress = req.ip;

  if (!bridgeWebhookAllowedIPs.includes(ipAddress)) {
    return res.code(ERROR403.statusCode).send({ message: ERROR403.message });
  }

  const { headers, rawBody, body } = req;
  const signatureHeader = headers['x-webhook-signature'] as string;
  if (!signatureHeader) {
    return res
      .status(ERROR400.statusCode)
      .send({ message: ERRORS.auth.bridge.malformedSignature });
  }

  const [_, timestamp, signature] =
    signatureHeader.match(/^t=(\d+),v0=(.*)$/) || [];
  if (!timestamp || !signature) {
    return res
      .status(ERROR400.statusCode)
      .send({ message: ERRORS.auth.bridge.malformedSignature });
  }

  if (
    new Date(parseInt(timestamp, 10)) < new Date(Date.now() - 10 * 60 * 1000)
  ) {
    return res
      .status(ERROR400.statusCode)
      .send({ message: ERRORS.auth.bridge.invalidSignature });
  }

  if (!utils.verifySignature(timestamp, rawBody, signature)) {
    return res
      .status(ERROR400.statusCode)
      .send({ message: ERRORS.auth.bridge.invalidSignature });
  }

  return res.status(200);
};

/** @TODO create merchant middleware to check if any of the body is not unique,
 * unless this can be done natively by prisma
 * */
