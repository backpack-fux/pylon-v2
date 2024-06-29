import { prisma } from '@/db';
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../types/fastify';
import { MerchantCreateSchema } from '../schemas/merchant';
import { ERROR409 } from '@/helpers/constants';
import { ERRORS } from '@/helpers/errors';

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
