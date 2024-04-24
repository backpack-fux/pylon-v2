import { errorResponse, successResponse } from '@/responses';
import { CheckCompanyApplicationStatusSchema, CreateApplicationForCompanySchema } from '../schemas/rain';
import { RainService } from '../services/Rain';
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../types/fastify';
import { ERROR500 } from '@/helpers/constants';
import { ERRORS } from '@/helpers/errors';

const rainServices = RainService.getInstance();

export async function createApplicationForCompany(
  req: FastifyRequestTypebox<typeof CreateApplicationForCompanySchema>,
  rep: FastifyReplyTypebox<typeof CreateApplicationForCompanySchema>
): Promise<void> {
  try {
    const application = await rainServices.createApplicationForCompany(
      req.body
    );

    return successResponse(rep, { application });
  } catch (error) {
    console.error(error);
    return errorResponse(
      req,
      rep,
      ERROR500.statusCode,
      ERRORS.http.error(ERROR500.statusCode)
    );
  }
}

export async function checkCompanyApplicationStatusSchema(
  req: FastifyRequestTypebox<typeof CheckCompanyApplicationStatusSchema>,
  rep: FastifyReplyTypebox<typeof CheckCompanyApplicationStatusSchema>
): Promise<void> {
  try {
    const application = await rainServices.getStatusOfCompanyApplication(
      req.params.companyId
    );

    return successResponse(rep, { application });
  } catch (error) {
    console.error(error);
    return errorResponse(
      req,
      rep,
      ERROR500.statusCode,
      ERRORS.http.error(ERROR500.statusCode)
    );
  }
}
