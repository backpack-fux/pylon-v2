import { AddressType } from '@prisma/client/edge';

import {
  FastifyRequestTypebox,
  FastifyReplyTypebox,
} from '@/v1/types/fastifyTypes';
import { prisma } from '@/db/index';
import { ERRORS } from '@/helpers/errors';
import { CreateMerchantInput } from '../schemas/merchant';
import { ERROR404, ERROR500, STANDARD } from '@/helpers/constants';
import { BridgeService } from '../services/bridgeService';
import { ComplianceTypeEnum } from '@/v1/types/bridge';
import { utils } from '@/helpers/utils';

const bridgeService = BridgeService.getInstance();

export async function createMerchantHandler(
  req: FastifyRequestTypebox<typeof CreateMerchantInput>,
  rep: FastifyReplyTypebox<typeof CreateMerchantInput>
): Promise<void> {
  const {
    name,
    surname,
    email,
    phoneNumber,
    companyNumber,
    companyJurisdiction,
    walletAddress,
    registeredAddress,
  } = req.body;

  const { street1, street2, city, postcode, state, country } =
    registeredAddress;

  /**
   * @TODO
   * 1. create partner
   * 2. do kyb via bridge.xyz
   * 3. store to db
   * 4. return bridge.xyz response
   */

  try {
    /** @dev create partner */
    const merchant = await prisma.merchant.create({
      data: {
        name,
        surname,
        email,
        phoneNumber,
        companyNumber,
        companyJurisdiction,
        walletAddress,
        registeredAddress: {
          create: {
            type: AddressType.REGISTERED,
            street1,
            street2,
            city,
            postcode,
            state,
            country,
          },
        },
      },
    });

    console.log(`merchant details: ${merchant}`);

    const merchantUuid = utils.generateUUID();
    const fullName = utils.getFullName(name, surname);

    bridgeService.createComplianceLinks(
      merchantUuid,
      fullName,
      ComplianceTypeEnum.Business,
      email
    );

    if (!merchant)
      rep.code(ERROR404.statusCode).send({ msg: ERRORS.merchant.exists });
    else rep.code(STANDARD.SUCCESS).send({ data: merchant });
  } catch (error) {
    console.error('Error creating merchant:', error);
    rep.code(ERROR500.statusCode).send({ msg: ERROR500.message });
  }
}
