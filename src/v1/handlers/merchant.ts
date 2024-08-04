import { FastifyRequestTypebox, FastifyReplyTypebox } from '@/v1/types/fastify';
import { ERRORS } from '@/helpers/errors';
import {
  MerchantCreateSchema,
  TransferStatusSchema,
} from '../schemas/merchant';
import { ERROR400, ERROR404, ERROR500, STANDARD } from '@/helpers/constants';
import { BridgeService } from '../services/external/Bridge';
import { utils } from '@/helpers/utils';
import { errorResponse, successResponse } from '@/responses';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { MerchantService } from '../services/Merchant';
import { ComplianceService } from '../services/Compliance';
import { PrismaError } from '../services/Error';
import { UUID } from 'crypto';

const merchantService = MerchantService.getInstance();
const complianceService = ComplianceService.getInstance();
const bridgeService = BridgeService.getInstance();

// TODO: create merchant via merchant dashboard
export async function createMerchantHandler(
  req: FastifyRequestTypebox<typeof MerchantCreateSchema>,
  rep: FastifyReplyTypebox<typeof MerchantCreateSchema>
): Promise<void> {
  try {
    const partnerData = req.body;
    const merchant = await merchantService.createPartner(partnerData);

    const complianceUuid = utils.generateUUID();
    const fullName = utils.getFullName(req.body.name, req.body.surname);
    const registered = await merchantService.registerCompliancePartner(
      complianceUuid,
      fullName,
      req.body.email
    );

    const compliance = await complianceService.insertMerchant(
      complianceUuid,
      registered,
      merchant
    );

    return successResponse(rep, compliance);
  } catch (error) {
    if (error instanceof PrismaError) {
      return errorResponse(req, rep, error.statusCode, error.message);
    } else {
      console.error(error);
      /** @todo handle generic errors in the utils file */
      const errorMessage = 'An error occurred during partner creation';
      return errorResponse(req, rep, ERROR404.statusCode, errorMessage);
    }
  }
}

export async function getTransferStatusHandler(
  req: FastifyRequestTypebox<typeof TransferStatusSchema>,
  rep: FastifyReplyTypebox<typeof TransferStatusSchema>
): Promise<void> {
  try {
    const transferId = req.params.transferId as UUID;
    const transferStatus = await bridgeService.getTransferStatus(transferId);
    return successResponse(rep, transferStatus);
  } catch (error) {
    console.error(error);
    const errorMessage = 'An error occurred during transfer status retrieval';
    return errorResponse(req, rep, ERROR404.statusCode, errorMessage);
  }
}
