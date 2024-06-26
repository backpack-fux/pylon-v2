import { FastifyRequestTypebox, FastifyReplyTypebox } from '@/v1/types/fastify';
import { IssueOTPSchema, VerifyOTPSchema } from '../schemas/auth';
import { OTPService } from '../services/OTP';
import { successResponse, errorResponse } from '@/responses';
import { ERROR400, ERROR500 } from '@/helpers/constants';

export async function issueOTPHandler(
  req: FastifyRequestTypebox<typeof IssueOTPSchema>,
  rep: FastifyReplyTypebox<typeof IssueOTPSchema>
): Promise<void> {
  try {
    const { email } = req.body;
    const otpService = OTPService.getInstance(req.server);
    await otpService.issueOTP(email);
    return successResponse(rep, {
      message: 'OTP issued successfully',
    });
  } catch (error) {
    console.error(error);
    return errorResponse(req, rep, ERROR500.statusCode, 'Failed to issue OTP');
  }
}

export async function verifyOTPHandler(
  req: FastifyRequestTypebox<typeof VerifyOTPSchema>,
  rep: FastifyReplyTypebox<typeof VerifyOTPSchema>
): Promise<void> {
  try {
    const { email, otp } = req.body;
    const otpService = OTPService.getInstance(req.server);
    const isValid = await otpService.verifyOTP(email, otp);
    if (isValid) {
      return successResponse(rep, { message: 'OTP verified successfully' });
    } else {
      return errorResponse(req, rep, ERROR400.statusCode, 'Invalid OTP');
    }
  } catch (error) {
    console.error(error);
    return errorResponse(req, rep, ERROR500.statusCode, 'Failed to verify OTP');
  }
}
