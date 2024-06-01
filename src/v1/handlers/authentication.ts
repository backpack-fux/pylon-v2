import { errorResponse, successResponse } from '@/responses';
import {
  RegisterDeviceWithWebAuthnSchema,
  SendWebAuthnChallengeSchema,
  SessionWIthChallenge,
} from '../schemas/authentication';
import { AuthenticationService } from '../services/Authentication';
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../types/fastify';
import { ERROR500 } from '@/helpers/constants';
import { ERRORS } from '@/helpers/errors';
import { Config } from '@/config';

const authenticationService = AuthenticationService.getInstance();
export async function sendChallenge(
  req: FastifyRequestTypebox<typeof SendWebAuthnChallengeSchema>,
  rep: FastifyReplyTypebox<typeof SendWebAuthnChallengeSchema>
): Promise<void> {
  try {
    const challenge = await authenticationService.generateChallenge();
    (req.session as SessionWIthChallenge).challenge = challenge;

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

    const session = req.session as SessionWIthChallenge;
    if (!session.challenge) {
      return errorResponse(req, rep, 400, 'No challenge found');
    }

    const expected = {
      challenge: session.challenge,
      origin: Config.host,
    };

    const user = await authenticationService.registerDeviceWithWebAuthn(
      registration,
      expected
    );

    const token = await rep.jwtSign({ credentialId: user.credentialId });

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

