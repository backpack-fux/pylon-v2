import { Config } from '@/config';
import {
  ERROR400,
  ERROR401,
  ERROR403,
  ERROR404,
  ERROR500,
  SESSION_EXPIRATION,
} from '@/helpers/constants';
import { ERRORS, parseError } from '@/helpers/errors';
import { errorResponse, successResponse } from '@/responses';
import {
  AuthenticatePasskeySchema,
  BaseResponseSchema,
  GenerateFarcasterJWTSchema,
  InitiateRegisterPasskeyForUserSchema,
  IssueOTPSchema,
  RegisterPasskeyForExistingUserSchema,
  RegisterPasskeySchema,
  RemovePasskeySchema,
  SendWebAuthnChallengeSchema,
  VerifyOTPSchema,
} from '@/v1/schemas/auth';
import { OTPService } from '@/v1/services/OTP';
import { PasskeyService } from '@/v1/services/Passkey';
import { UserService } from '@/v1/services/User';
import { AuthenticationChecks } from '@/v1/types/auth';
import { FastifyReplyTypebox, FastifyRequestTypebox } from '@/v1/types/fastify';
import jwt from 'jsonwebtoken';
import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { v4 as uuidv4 } from 'uuid';

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

export async function generateFarcasterJWT(
  req: FastifyRequestTypebox<typeof GenerateFarcasterJWTSchema>,
  rep: FastifyReplyTypebox<typeof GenerateFarcasterJWTSchema>
) {
  try {
    const { fid, signerUuid } = req.body;
    const ipAddress =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip;
    const userAgent = req.headers['user-agent'];

    if (!fid || !signerUuid) {
      return rep.code(ERROR401.statusCode).send({
        statusCode: ERROR401.statusCode,
        data: ERRORS.auth.farcaster.missingFidOrSignerUuid,
      });
    }

    const neynarAPIClient = new NeynarAPIClient(Config.neynarApiKey);
    const signer = await neynarAPIClient.lookupSigner(signerUuid);

    if (!signer || !signer.fid || !signer.status) {
      return rep.code(ERROR401.statusCode).send({
        statusCode: ERROR401.statusCode,
        data: ERRORS.auth.farcaster.signerNotFound,
      });
    }

    const { fid: signerFid, status } = signer;

    if (status !== 'approved') {
      return rep.code(ERROR401.statusCode).send({
        statusCode: ERROR401.statusCode,
        data: ERRORS.auth.farcaster.signerNotApproved,
      });
    }

    if (Number(signerFid) !== fid) {
      return rep.code(ERROR401.statusCode).send({
        statusCode: ERROR401.statusCode,
        data: ERRORS.auth.farcaster.signerFidMismatch,
      });
    }

    if (!Config.fidAdmins.includes(signerFid.toString())) {
      return rep.code(ERROR403.statusCode).send({
        statusCode: ERROR403.statusCode,
        data: ERRORS.auth.farcaster.userForbidden,
      });
    }

    const sessionId = uuidv4();
    const redisClient = req.server.redis;
    await redisClient.set(
      `session:${signerUuid}`,
      sessionId,
      'EX',
      SESSION_EXPIRATION['1D']
    );

    // TODO: bump algo to RS256 and privateKey issuer
    const token = jwt.sign(
      { signerFid, signerUuid, ipAddress, userAgent, sessionId },
      Config.jwtSecret,
      {
        expiresIn: SESSION_EXPIRATION['1D'],
      }
    );

    rep.setCookie('pyv2_auth_token', token, {
      httpOnly: true,
      secure: Config.isProduction,
      sameSite: Config.isProduction ? 'strict' : 'lax',
      maxAge: SESSION_EXPIRATION['1D'],
      signed: true,
      path: '/',
      domain: Config.isProduction ? 'office.backpack.network' : undefined,
    });

    return successResponse(rep, { message: 'success' });
  } catch (error) {
    console.error(error);
    return errorResponse(
      req,
      rep,
      ERROR500.statusCode,
      'Failed to generate JWT'
    );
  }
}
