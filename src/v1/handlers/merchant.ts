import { FastifyRequestTypebox, FastifyReplyTypebox } from '@/v1/fastifyTypes';
import { prisma } from '@/db/index';
import { ERRORS } from '@/helpers/errors';
import { CreateMerchantInput } from '../schemas/merchant';
import { ERROR404, ERROR500, STANDARD } from '@/helpers/constants';
import { BridgeService } from '../services/bridgeService';

export async function createMerchantHandler(
  req: FastifyRequestTypebox<typeof CreateMerchantInput>,
  rep: FastifyReplyTypebox<typeof CreateMerchantInput>
): Promise<void> {
  const {
    name,
    email,
    phoneNumber,
    companyNumber,
    companyJurisidiction,
    walletAddress,
  } = req.body;

  try {
    const merchant = await prisma.merchant.create({
      data: {
        name,
        email,
        phoneNumber,
        companyNumber,
        companyJurisidiction,
        walletAddress,
      },
    });

    console.log(`merchant details: ${merchant}`);

    if (!merchant)
      rep.code(ERROR404.statusCode).send({ msg: ERRORS.merchant.exists });
    else rep.code(STANDARD.SUCCESS).send({ data: merchant });
  } catch (error) {
    console.error('Error creating merchant:', error);
    rep.code(ERROR500.statusCode).send({ msg: ERROR500.message });
  }
}
