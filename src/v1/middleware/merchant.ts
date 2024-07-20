import { prisma } from '@/db';
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../types/fastify';
import {
  MerchantCreateSchema,
  TransferStatusSchema,
} from '../schemas/merchant';
import { ERROR401, ERROR409 } from '@/helpers/constants';
import { ERRORS } from '@/helpers/errors';
import { FastifyReply, FastifyRequest } from 'fastify';

export const validateMerchantDetails = async (
  req: FastifyRequestTypebox<typeof MerchantCreateSchema>,
  rep: FastifyReplyTypebox<typeof MerchantCreateSchema>
): Promise<void> => {
  const { email, phoneNumber, walletAddress } = req.body;

  const merchant = await prisma.merchant.findFirst({
    where: {
      OR: [{ email }, { phoneNumber }, { walletAddress }],
    },
    select: {
      email: true,
      phoneNumber: true,
      walletAddress: true,
    },
  });

  if (merchant && merchant.email === email) {
    return rep.code(ERROR409.statusCode).send({
      statusCode: ERROR409.statusCode,
      message: ERRORS.merchant.emailExists(email),
    });
  }
  if (merchant && merchant.phoneNumber === phoneNumber) {
    return rep.code(ERROR409.statusCode).send({
      statusCode: ERROR409.statusCode,
      message: ERRORS.merchant.phoneNumberExists(phoneNumber),
    });
  }
  if (merchant && merchant.walletAddress === walletAddress) {
    return rep.code(ERROR409.statusCode).send({
      statusCode: ERROR409.statusCode,
      message: ERRORS.merchant.walletAddressExists(walletAddress),
    });
  }

  return;
};

export const validateMerchantAPIKey = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
  const authHeader = req.headers.authorization;
  const apiKey = authHeader && authHeader.split(' ')[1];

  if (!apiKey) {
    return rep.code(ERROR401.statusCode).send({
      statusCode: ERROR401.statusCode,
      message: ERRORS.auth.missingAuthorizationHeader,
    });
  }

  const merchantApiKey = await prisma.apiKey.findUnique({
    where: { key: apiKey },
    include: { merchant: true },
  });

  if (!merchantApiKey || !merchantApiKey.isActive) {
    return rep.code(ERROR401.statusCode).send({
      statusCode: ERROR401.statusCode,
      message: ERRORS.auth.invalidAPIKey,
    });
  }

  if (merchantApiKey.expiresAt && merchantApiKey.expiresAt < new Date()) {
    return rep.code(ERROR401.statusCode).send({
      statusCode: ERROR401.statusCode,
      message: ERRORS.auth.expiredAPIKey,
    });
  }

  await prisma.apiKey.update({
    where: { id: merchantApiKey.id },
    data: { lastUsedAt: new Date() },
  });

  // Attach merchant to request for use in route handlers
  req.merchant = merchantApiKey.merchant;

  return;
};
