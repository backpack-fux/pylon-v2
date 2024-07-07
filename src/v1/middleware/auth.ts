import { Config } from '@/config';
import { ERROR401 } from '@/helpers/constants';
import { ERRORS } from '@/helpers/errors';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/User';
import { prisma } from '@/db';

const userService = UserService.getInstance();

export const authenticate = async (req: FastifyRequest, rep: FastifyReply) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return rep.code(ERROR401.statusCode).send({
      unauthorized: ERRORS.auth.missingAuthorizationHeader,
    });
  }
  try {
    // Verify the JWT token using the Fastify JWT plugin
    await req.jwtVerify();

    const user = await userService.findOneById(req.user.id);
    if (!user) {
      return rep
        .code(ERROR401.statusCode)
        .send({ unauthorized: ERRORS.auth.invalidJWT });
    }

    return;
  } catch (err) {
    return rep
      .code(ERROR401.statusCode)
      .send({ unauthorized: ERRORS.auth.invalidJWT });
  }
};

export const validateAPIKey = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
  const authHeader = req.headers.authorization;
  const apiKey = authHeader && authHeader.split(' ')[1];

  if (!apiKey) {
    return rep
      .code(ERROR401.statusCode)
      .send({ unauthorized: ERRORS.auth.missingAuthorizationHeader });
  }

  if (apiKey !== Config.serverApiKey) {
    return rep
      .code(ERROR401.statusCode)
      .send({ unauthorized: ERRORS.auth.invalidAPIKey });
  } else {
    return;
  }
};

export const validateMerchant = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return rep.code(401).send({ error: 'No token provided' });
  }

  const decoded = (await req.jwtDecode()) as any;
  if (!decoded) {
    return rep.code(401).send({ error: 'Invalid token' });
  }

  if (!decoded || typeof decoded.merchant_id !== 'number') {
    return rep.code(401).send({ error: 'Invalid token payload' });
  }

  const merchant = await getMerchant(decoded.merchant_id);
  if (!merchant) {
    return rep.code(401).send({ error: 'Merchant not found' });
  }

  const signature = await req.jwtVerify({ verify: merchant.id });
  if (!signature) {
    return rep.code(401).send({ error: 'Invalid signature' });
  }
};

async function getMerchant(id: number) {
  return await prisma.merchant.findUnique({
    where: { id },
  });
}
