import { errorResponse, successResponse } from '@/responses';
import {
  CheckCompanyApplicationStatusSchema,
  CreateApplicationForCompanySchema,
  ReapplyForCompanySchema,
  UploadApplicationDocumentSchema,
} from '../schemas/rain';
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

    if (
      application.statusCode?.toString().startsWith('4') ||
      application.statusCode?.toString().startsWith('5')
    ) {
      return errorResponse(
        req,
        rep,
        application.statusCode,
        application.message
      );
    }

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

    if (
      application.statusCode?.toString().startsWith('4') ||
      application.statusCode?.toString().startsWith('5')
    ) {
      return errorResponse(
        req,
        rep,
        application.statusCode,
        application.message
      );
    }

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

export async function reapplyForCompany(
  req: FastifyRequestTypebox<typeof ReapplyForCompanySchema>,
  rep: FastifyReplyTypebox<typeof ReapplyForCompanySchema>
): Promise<void> {
  try {
    const application = await rainServices.reapplyForCompany(
      req.body,
      req.params.companyId
    );

    if (
      application.statusCode?.toString().startsWith('4') ||
      application.statusCode?.toString().startsWith('5')
    ) {
      return errorResponse(
        req,
        rep,
        application.statusCode,
        application.message
      );
    }
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

export async function uploadCompanyApplicationDocs(
  req: FastifyRequestTypebox<typeof UploadApplicationDocumentSchema>,
  rep: FastifyReplyTypebox<typeof UploadApplicationDocumentSchema>
): Promise<void> {
  try {
    const application = await rainServices.uploadCompanyDocument(
      req.body,
      req.params.id
    );

    console.log(req.body);
    console.log(typeof req.body);

    if (
      application.statusCode?.toString().startsWith('4') ||
      application.statusCode?.toString().startsWith('5')
    ) {
      return errorResponse(
        req,
        rep,
        application.statusCode,
        application.message
      );
    }
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
