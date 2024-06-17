import { errorResponse, successResponse } from '@/responses';
import {
  AuthenticateDeviceWithWebAuthnSchema,
  RegisterDeviceWithWebAuthnSchema,
  SendWebAuthnChallengeSchema,
} from '../schemas/passkey';
import { PasskeyService } from '../services/Passkey';
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../types/fastify';
import { ERROR500 } from '@/helpers/constants';
import { ERRORS } from '@/helpers/errors';
import { Config } from '@/config';
import { AuthenticationChecks } from '../types/webauthn';

const passkeyService = PasskeyService.getInstance();

export async function generateChallenge(
  req: FastifyRequestTypebox<typeof SendWebAuthnChallengeSchema>,
  rep: FastifyReplyTypebox<typeof SendWebAuthnChallengeSchema>
): Promise<void> {
  try {
    const challenge = await passkeyService.generateChallenge();

    return successResponse(rep, { challenge });
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

export async function registerDeviceWithWebAuthn(
  req: FastifyRequestTypebox<typeof RegisterDeviceWithWebAuthnSchema>,
  rep: FastifyReplyTypebox<typeof RegisterDeviceWithWebAuthnSchema>
) {
  try {
    const registration = req.body;
    const email = req.body.email;
    const passkeyName = req.body.passkeyName;

    const expected = {
      challenge: req.body.challenge,
      origin: Config.clientHost,
    };

    const user = await passkeyService.registerDeviceWithWebAuthn(
      registration,
      expected,
      email,
      passkeyName
    );

    const token = await rep.jwtSign({ user });

    return successResponse(rep, {
      user,
      token,
    });
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

export async function authenticateDeviceWithWebAuthn(
  req: FastifyRequestTypebox<typeof AuthenticateDeviceWithWebAuthnSchema>,
  rep: FastifyReplyTypebox<typeof AuthenticateDeviceWithWebAuthnSchema>
) {
  try {
    const authentication = req.body;

    const expected: AuthenticationChecks = {
      challenge: req.body.challenge,
      origin: Config.clientHost,
      userVerified: true,
      verbose: !Config.isProduction,
    };

    const user = await passkeyService.authenticateDeviceWithWebAuthn(
      authentication,
      expected
    );

    const token = await rep.jwtSign({ user });

    return successResponse(rep, {
      user,
      token,
    });
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
