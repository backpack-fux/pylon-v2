import { FastifyInstance } from 'fastify';
import { methods } from '@/helpers/constants';
import { issueOTPHandler, verifyOTPHandler } from '../handlers/auth';
import { IssueOTPSchema, VerifyOTPSchema } from '../schemas/auth';

const OTP = async (app: FastifyInstance) => {
  app
    .route({
      method: methods.POST,
      url: '/otp/issue',
      schema: IssueOTPSchema,
      handler: issueOTPHandler,
    })

    .route({
      method: methods.POST,
      url: '/otp/verify',
      schema: VerifyOTPSchema,
      handler: verifyOTPHandler,
    });
};

export default OTP;
