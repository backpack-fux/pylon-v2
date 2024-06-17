import { FastifyRequestTypebox, FastifyReplyTypebox } from '@/v1/types/fastify';
import { ERRORS } from '@/helpers/errors';
import { MerchantCreateSchema } from '../schemas/merchant';
import { ERROR400, ERROR404, ERROR500, STANDARD } from '@/helpers/constants';
import { BridgeService } from '../services/external/Bridge';
import { utils } from '@/helpers/utils';
import { errorResponse, successResponse } from '@/responses';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { MerchantService } from '../services/Merchant';
import { ComplianceService } from '../services/Compliance';
import { PrismaError } from '../services/Error';

const merchantService = MerchantService.getInstance();
const complianceService = ComplianceService.getInstance();

export async function createMerchantHandler(
  req: FastifyRequestTypebox<typeof MerchantCreateSchema>,
  rep: FastifyReplyTypebox<typeof MerchantCreateSchema>
): Promise<void> {
  try {
    console.log('req.body', req.body, 'coming here merchant')
    const { initialUser, ultimateBeneficialOwners } = req.body
    const merchant = await merchantService.createPartner(initialUser, ultimateBeneficialOwners);

    const complianceUuid = utils.generateUUID();
    const fullName = utils.getFullName(initialUser.firstName, initialUser.lastName);
    const registered = await merchantService.registerCompliancePartner(
      complianceUuid,
      fullName,
      req.body.initialUser.email
    );

    const compliance = await complianceService.insertMerchant(
      complianceUuid,
      registered,
      merchant
    );

    return successResponse(rep, compliance);
  } catch (error) {
    console.log(error, 'what is error=')
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
