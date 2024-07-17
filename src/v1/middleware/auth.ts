import { Config } from '@/config';
import { ERROR401, ERROR403 } from '@/helpers/constants';
import { ERRORS } from '@/helpers/errors';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/User';
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../types/fastify';
import { ValidateFarcasterJWTSchema } from '../schemas/auth';
import jwt from 'jsonwebtoken';
import { BridgePrefundedAccountBalanceSchema } from '../schemas/bridge';
import { UUID } from 'crypto';

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
  const signedCookie = req.cookies.pyv2_auth_token;
  if (!signedCookie) {
    return rep.code(ERROR401.statusCode).send({
      statusCode: ERROR401.statusCode,
      data: ERRORS.auth.missingAuthorizationHeader,
    });
  }

  const unsignResult = req.unsignCookie(signedCookie);
  if (!unsignResult.valid || !unsignResult.value) {
    return rep.code(ERROR401.statusCode).send({
      statusCode: ERROR401.statusCode,
      data: ERRORS.auth.invalidCookieSignature,
    });
  }

  const token = unsignResult.value;

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

  const fid = payload.signerFid as number;
  const currentTime = Math.floor(Date.now() / 1000);

  if (!Config.fidAdmins.includes(String(fid))) {
    return rep.code(ERROR403.statusCode).send({
      statusCode: ERROR403.statusCode,
      data: ERRORS.auth.farcaster.userForbidden,
    });
  }

  if (payload.exp < currentTime || payload.iat > currentTime) {
    return rep.code(ERROR401.statusCode).send({
      statusCode: ERROR401.statusCode,
      data: ERRORS.auth.invalidJWT,
    });
  }

  const ipAddress =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.ip;

  if (ipAddress !== payload.ipAddress) {
    return rep.code(ERROR401.statusCode).send({
      statusCode: ERROR401.statusCode,
      data: ERRORS.auth.invalidIPAddress,
    });
  }

  const userAgent = req.headers['user-agent'];

  if (userAgent !== payload.userAgent) {
    return rep.code(ERROR401.statusCode).send({
      statusCode: ERROR401.statusCode,
      data: ERRORS.auth.invalidUserAgent,
    });
  }

  const redisClient = req.server.redis;
  const storedSessionId = await redisClient.get(
    `session:${payload.signerUuid}`
  );
  if (storedSessionId !== payload.sessionId) {
    return rep.code(ERROR401.statusCode).send({
      statusCode: ERROR401.statusCode,
      data: ERRORS.auth.expiredJWT,
    });
  }

  req.signerUuid = payload.signerUuid as UUID;
  return;
};
