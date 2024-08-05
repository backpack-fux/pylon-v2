import { EmployeeRole, prisma } from '@/db';
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

  const fields = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { phoneNumber }, { walletAddress }],
    },
    select: {
      email: true,
      phoneNumber: true,
      walletAddress: true,
    },
  });

  if (fields && fields.email === email) {
    return rep.code(ERROR409.statusCode).send({
      statusCode: ERROR409.statusCode,
      message: ERRORS.user.emailExists(email),
    });
  }
  if (fields && fields.phoneNumber === phoneNumber) {
    return rep.code(ERROR409.statusCode).send({
      statusCode: ERROR409.statusCode,
      message: ERRORS.user.phoneNumberExists(phoneNumber),
    });
  }
  if (fields && fields.walletAddress === walletAddress) {
    return rep.code(ERROR409.statusCode).send({
      statusCode: ERROR409.statusCode,
      message: ERRORS.user.walletAddressExists(walletAddress),
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

  const userApiKey = await prisma.apiKey.findUnique({
    where: { key: apiKey },
    include: {
      user: { include: { Employee: { include: { merchant: true } } } },
    },
  });

  if (!userApiKey || !userApiKey.isActive) {
    return rep.code(ERROR401.statusCode).send({
      statusCode: ERROR401.statusCode,
      message: ERRORS.auth.invalidAPIKey,
    });
  }

  if (userApiKey.expiresAt && userApiKey.expiresAt < new Date()) {
    return rep.code(ERROR401.statusCode).send({
      statusCode: ERROR401.statusCode,
      message: ERRORS.auth.expiredAPIKey,
    });
  }

  await prisma.apiKey.update({
    where: { id: userApiKey.id },
    data: { lastUsedAt: new Date() },
  });

  req.merchant = userApiKey.user.Employee?.merchant;

  return;
};
