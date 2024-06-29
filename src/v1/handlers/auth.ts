import { IssueOTPSchema, VerifyOTPSchema } from '../schemas/auth';
import { OTPService } from '../services/OTP';
import { errorResponse, successResponse } from '@/responses';
import {
  AuthenticatePasskeySchema,
  BaseResponseSchema,
  InitiateRegisterPasskeyForUserSchema,
  RegisterPasskeyForExistingUserSchema,
  RegisterPasskeySchema,
  RemovePasskeySchema,
  SendWebAuthnChallengeSchema,
} from '../schemas/auth';
import { PasskeyService } from '../services/Passkey';
import { FastifyReplyTypebox, FastifyRequestTypebox } from '@/v1/types/fastify';
import { parseError } from '@/helpers/errors';
import { Config } from '@/config';
import { AuthenticationChecks } from '../types/auth';
import { UserService } from '@/v1/services/User';
import { ERROR400, ERROR404, ERROR500 } from '@/helpers/constants';

const passkeyService = PasskeyService.getInstance();
const userService = UserService.getInstance();

export async function generateChallenge(
  req: FastifyRequestTypebox<typeof SendWebAuthnChallengeSchema>,
  rep: FastifyReplyTypebox<typeof SendWebAuthnChallengeSchema>
): Promise<void> {
  try {
    const challenge = await passkeyService.generateChallenge();

    return successResponse(rep, { challenge });
  } catch (e) {
    const parsedError = parseError(e);
    return errorResponse(req, rep, parsedError.statusCode, parsedError.message);
  }
}

export async function registerPasskey(
  req: FastifyRequestTypebox<typeof RegisterPasskeySchema>,
  rep: FastifyReplyTypebox<typeof RegisterPasskeySchema>
) {
  try {
    const registration = req.body;
    const email = req.body.email;
    const passkeyName = req.body.passkeyName;

    const expected = {
      challenge: req.body.challenge,
      origin: Config.clientHost,
    };

    const user = await passkeyService.registerPasskey(
      registration,
      expected,
      email,
      passkeyName
    );

    const token = await rep.jwtSign({
      user,
      credential: registration.credential.id,
    });

    return successResponse(rep, {
      user,
      token,
    });
  } catch (error) {
    const parsedError = parseError(error);
    return errorResponse(req, rep, parsedError.statusCode, parsedError.message);
  }
}

export async function authenticatePasskey(
  req: FastifyRequestTypebox<typeof AuthenticatePasskeySchema>,
  rep: FastifyReplyTypebox<typeof AuthenticatePasskeySchema>
) {
  try {
    const authentication = req.body;

    const expected: AuthenticationChecks = {
      challenge: req.body.challenge,
      origin: Config.clientHost,
      userVerified: true,
      verbose: !Config.isProduction,
    };

    const user = await passkeyService.authenticatePasskey(
      authentication,
      expected
    );

    const token = await rep.jwtSign({
      user,
      credential: authentication.credentialId,
    });

    return successResponse(rep, {
      user,
      token,
    });
  } catch (error) {
    const parsedError = parseError(error);
    return errorResponse(req, rep, parsedError.statusCode, parsedError.message);
  }
}

export async function initiatePasskeyRegistration(
  req: FastifyRequestTypebox<typeof InitiateRegisterPasskeyForUserSchema>,
  rep: FastifyReplyTypebox<typeof InitiateRegisterPasskeyForUserSchema>
) {
  try {
    const email = req.body.email;
    const user = await userService.findOneByEmail(email);

    if (!user) {
      return errorResponse(req, rep, ERROR404.statusCode, 'User not found');
    }

    const token = await rep.jwtSign(user, {
      expiresIn: 1000 * 60 * 10, // 10 minutes
    });

    await passkeyService.initiatePasskeyRegistration({
      email,
      token,
    });
  } catch (error) {
    const parsedError = parseError(error);
    return errorResponse(req, rep, parsedError.statusCode, parsedError.message);
  }
}

export async function registerPasskeyForExistingUser(
  req: FastifyRequestTypebox<typeof RegisterPasskeyForExistingUserSchema>,
  rep: FastifyReplyTypebox<typeof RegisterPasskeyForExistingUserSchema>
) {
  try {
    const user = await userService.findOneByEmail(req.user.email);

    if (!user) {
      return errorResponse(req, rep, ERROR404.statusCode, 'User not found');
    }
  } catch (error) {
    const parsedError = parseError(error);
    return errorResponse(req, rep, parsedError.statusCode, parsedError.message);
  }
}

export async function removePasskey(
  req: FastifyRequestTypebox<typeof RemovePasskeySchema>,
  rep: FastifyReplyTypebox<typeof RemovePasskeySchema>
) {
  try {
    const passkeyId = req.params.id;

    if (!req.user.credential) {
      return errorResponse(
        req,
        rep,
        ERROR400.statusCode,
        'User does not have a credential'
      );
    }

    await passkeyService.removePasskey({
      id: passkeyId,
      userId: req.user.id,
      credential: req.user.credential,
    });
  } catch (error) {
    const parsedError = parseError(error);
    return errorResponse(req, rep, parsedError.statusCode, parsedError.message);
  }
}

export async function findPasskeysForUser(
  req: FastifyRequestTypebox<typeof BaseResponseSchema>,
  rep: FastifyReplyTypebox<typeof BaseResponseSchema>
) {
  try {
    const passkeys = await passkeyService.findPasskeyByUserId(req.user.id);
    return successResponse(rep, { passkeys });
  } catch (error) {
    const parsedError = parseError(error);
    return errorResponse(req, rep, parsedError.statusCode, parsedError.message);
  }
}

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
