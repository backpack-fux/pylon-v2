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
  const { email: companyEmail } = req.body.company;
  const { walletAddress: companyWalletAddress } = req.body;
  const reps = req.body.representatives;

  const repEmails = reps.map((rep) => rep.email);
  const repPhoneNumbers = reps.map((rep) => rep.phoneNumber).filter(Boolean);

  const company = 'company';
  const representative = 'representative';

  const existingUsers = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { in: repEmails } },
        { phoneNumber: { in: repPhoneNumbers } },
        { walletAddress: companyWalletAddress },
      ],
      Employee: {
        merchant: {
          company: {
            email: companyEmail,
          },
        },
      },
    },
    select: {
      email: true,
      phoneNumber: true,
      walletAddress: true,
    },
  });

  if (existingUsers) {
    if (existingUsers.email === companyEmail) {
      return rep.code(ERROR409.statusCode).send({
        statusCode: ERROR409.statusCode,
        message: ERRORS.general.emailExists(company, companyEmail),
      });
    }
    if (repEmails.includes(existingUsers.email)) {
      return rep.code(ERROR409.statusCode).send({
        statusCode: ERROR409.statusCode,
        message: ERRORS.general.emailExists(
          representative,
          existingUsers.email
        ),
      });
    }
    if (
      existingUsers.phoneNumber &&
      repPhoneNumbers.includes(existingUsers.phoneNumber)
    ) {
      return rep.code(ERROR409.statusCode).send({
        statusCode: ERROR409.statusCode,
        message: ERRORS.general.phoneNumberExists(
          representative,
          existingUsers.phoneNumber
        ),
      });
    }
    if (existingUsers.walletAddress === companyWalletAddress) {
      return rep.code(ERROR409.statusCode).send({
        statusCode: ERROR409.statusCode,
        message: ERRORS.general.walletAddressExists(
          company,
          companyWalletAddress
        ),
      });
    }
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
      merchant: true,
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

  req.merchant = userApiKey.merchant;

  return;
};
