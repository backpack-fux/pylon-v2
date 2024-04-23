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
    console.log((req.session as SessionWIthChallenge).challenge);
    console.log(req.body.challenge);
    return successResponse(rep, {
      challenge: (req.session as SessionWIthChallenge).challenge,
      bodyChallenge: req.body.challenge,
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

// export async function verifyChallenge(
//   req: FastifyRequestTypebox<typeof SendWebAuthnChallengeSchema>,
//   rep: FastifyReplyTypebox<typeof SendWebAuthnChallengeSchema>
// ): Promise<void> {
//   try {
//     const { challenge } = req.body;
//     const session = req.session as SessionWIthChallenge;
//     if (session.challenge !== challenge) {
//       return errorResponse(req, rep, 400, 'Invalid challenge');
//     }
//     return successResponse(rep, { valid: true });
//   } catch (error) {
//     console.error(error);
//     return errorResponse(
//       req,
//       rep,
//       ERROR500.statusCode,
//       ERRORS.http.error(ERROR500.statusCode)
//     );
//   }
// }
