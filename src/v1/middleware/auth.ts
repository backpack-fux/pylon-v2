import { Config } from '@/config';
import { ERROR401, ERROR403 } from '@/helpers/constants';
import { ERRORS } from '@/helpers/errors';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/User';
import { prisma } from '@/db';
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../types/fastify';
import { ValidateFarcasterJWTSchema } from '../schemas/auth';
import jwt from 'jsonwebtoken';
import { BridgePrefundedAccountBalanceSchema } from '../schemas/bridge';

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
  const token = authHeader && authHeader.split(' ')[1];

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

  const signature = jwt.verify(decoded, merchant.id as unknown as jwt.Secret);
  if (!signature) {
    return rep.code(401).send({ error: 'Invalid signature' });
  }
};

async function getMerchant(id: number) {
  return await prisma.merchant.findUnique({
    where: { id },
  });
}
export const validateFarcasterUser = async (
  req: FastifyRequestTypebox<
    | typeof ValidateFarcasterJWTSchema
    | typeof BridgePrefundedAccountBalanceSchema
  >,
  rep: FastifyReplyTypebox<
    | typeof ValidateFarcasterJWTSchema
    | typeof BridgePrefundedAccountBalanceSchema
  >
) => {
  const { token } = req.body;

  const isVerified = jwt.verify(token, Config.jwtSecret, { complete: true });
  if (!isVerified) {
    return rep.code(ERROR401.statusCode).send({
      statusCode: ERROR401.statusCode,
      data: ERRORS.auth.invalidJWT,
    });
  }

  const decoded = jwt.decode(token, { complete: true });
  if (!decoded) {
    return rep.code(ERROR401.statusCode).send({
      statusCode: ERROR401.statusCode,
      data: ERRORS.auth.invalidJWT,
    });
  }

  const { payload } = decoded;
  if (
    typeof payload !== 'object' ||
    payload === null ||
    payload.exp === undefined ||
    payload.iat === undefined
  ) {
    return rep.code(ERROR401.statusCode).send({
      statusCode: ERROR401.statusCode,
      data: ERRORS.auth.invalidJWT,
    });
  }

  const fid = (payload?.fid as any).toString();
  const currentTime = Math.floor(Date.now() / 1000);

  if (!Config.fidAdmins.includes(fid)) {
    return rep.code(ERROR403.statusCode).send({
      statusCode: ERROR403.statusCode,
      data: ERRORS.auth.farcaster.userNotAllowed,
    });
  }

  if (payload.exp < currentTime || payload.iat > currentTime) {
    return rep.code(ERROR401.statusCode).send({
      statusCode: ERROR401.statusCode,
      data: ERRORS.auth.invalidJWT,
    });
  }

  return;
};
