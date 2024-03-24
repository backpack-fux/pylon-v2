import {
  AddressType,
  AccountType,
  VerificationStatus,
  TosStatus,
} from '@prisma/client';

import { FastifyRequestTypebox, FastifyReplyTypebox } from '@/v1/types/fastify';
import { prisma } from '@/db/index';
import { ERRORS } from '@/helpers/errors';
import { CreateMerchantInput } from '../schemas/merchant';
import { ERROR400, ERROR404, ERROR500, STANDARD } from '@/helpers/constants';
import { BridgeService } from '../services/external/Bridge';
import {
  BridgeComplianceLinksResponse,
  BridgeComplianceTypeEnum,
} from '@/v1/types/bridge';
import { utils } from '@/helpers/utils';
import { PrismaMerchant, PrismaSelectedCompliance } from '../types/prisma';
import { errorResponse, successResponse } from '@/responses';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { MerchantService } from '../services/Merchant';
import { ComplianceService } from '../services/Compliance';

const bridgeService = BridgeService.getInstance();
const merchantService = MerchantService.getInstance();
const complianceService = ComplianceService.getInstance();

export async function createMerchantHandler(
  req: FastifyRequestTypebox<typeof CreateMerchantInput>,
  rep: FastifyReplyTypebox<typeof CreateMerchantInput>
): Promise<void> {
  try {
    const merchant = await merchantService.createPartner(req.body);
    if (!merchant)
      return rep
        .code(ERROR404.statusCode)
        .send({ msg: ERRORS.merchant.exists });

    const merchantUuid = utils.generateUUID();
    const fullName = utils.getFullName(req.body.name, req.body.surname);
    const registered = await merchantService.registerCompliancePartner(
      merchantUuid,
      fullName,
      req.body.email
    );
    if (!registered)
      return rep
        .code(ERROR404.statusCode)
        .send({ msg: ERRORS.merchant.exists });

    const compliance = complianceService.storePartner(
      merchantUuid,
      registered,
      merchant
    );
    if (!compliance)
      return rep
        .code(ERROR404.statusCode)
        .send({ msg: ERRORS.merchant.exists });

    return rep.code(STANDARD.SUCCESS).send({ data: compliance });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return errorResponse(req, rep, ERROR400.statusCode, error.message);
      } else {
        return errorResponse(req, rep, ERROR400.statusCode, error.message);
      }
    }

    // Handle generic errors
    /** @todo handle generic errors in the utils file */
    const errorMessage = 'An error occurred during partner creation';
    return errorResponse(req, rep, ERROR500.statusCode, errorMessage);
  }
}
