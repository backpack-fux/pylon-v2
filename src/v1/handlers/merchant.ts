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
    const merchant = await merchantService.createPartner(req.body);

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
