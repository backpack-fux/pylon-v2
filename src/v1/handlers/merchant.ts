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
import { MerchantService } from '../services/Merchant';
import { ComplianceService } from '../services/Compliance';
import { BridgeError, PrismaError } from '../services/Error';
import { UUID } from 'crypto';
import {
  BridgeComplianceLinksResponse,
  BridgeComplianceType,
} from '../types/bridge/compliance';
import { PrismaSelectedCompliance } from '../types/prisma';
import { ApiKeyService } from '../services/ApiKey';

const merchantService = MerchantService.getInstance();
const complianceService = ComplianceService.getInstance();
const bridgeService = BridgeService.getInstance();
const apiKeyService = ApiKeyService.getInstance();

// TODO: create merchant via merchant dashboard
export async function createMerchantHandler(
  req: FastifyRequestTypebox<typeof MerchantCreateSchema>,
  rep: FastifyReplyTypebox<typeof MerchantCreateSchema>
): Promise<void> {
  try {
    const partnerData = req.body;
    const merchant = await merchantService.createPartner(partnerData);

    let compliance: PrismaSelectedCompliance;

    if (partnerData.compliance) {
      // Existing merchant flow
      const { complianceUuid, kycLink, tosLink, kycStatus, tosStatus } =
        partnerData.compliance;

      const complianceData: Pick<
        BridgeComplianceLinksResponse,
        'kyc_link' | 'tos_link' | 'kyc_status' | 'tos_status' | 'type'
      > = {
        type: BridgeComplianceType.Business,
        kyc_link: kycLink,
        tos_link: tosLink,
        kyc_status: kycStatus,
        tos_status: tosStatus,
      };

      compliance = await complianceService.createComplianceLinksForMerchant(
        complianceUuid as UUID,
        complianceData,
        merchant
      );
    } else {
      // New merchant flow
      const complianceUuid = utils.generateUUID();

      const registered = await merchantService.registerCompliancePartner(
        complianceUuid,
        partnerData.company.name,
        partnerData.company.email
      );

      compliance = await complianceService.createComplianceLinksForMerchant(
        complianceUuid,
        registered,
        merchant
      );
    }

    const apiKey = await apiKeyService.createKey(merchant.id);

    return successResponse(rep, { compliance, apiKey });
  } catch (error) {
    if (error instanceof BridgeError) {
      return errorResponse(req, rep, error.statusCode, error.message);
    } else if (error instanceof PrismaError) {
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
    if (error instanceof BridgeError) {
      return errorResponse(req, rep, error.statusCode, error.message);
    } else {
      console.error(error);
      const errorMessage = 'An error occurred during transfer status retrieval';
      return errorResponse(req, rep, ERROR404.statusCode, errorMessage);
    }
  }
}
