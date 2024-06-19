import { errorResponse, successResponse } from '@/responses';
import {
  AuthenticatePasskeyWithWebAuthnSchema,
  InitiateRegisterPasskeyForUserSchema,
  RegisterPasskeyForExistingUserSchema,
  RegisterPasskeyWithWebAuthnSchema,
  SendWebAuthnChallengeSchema,
} from '../schemas/passkey';
import { PasskeyService } from '../services/Passkey';
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../types/fastify';
import { parseError } from '@/helpers/errors';
import { Config } from '@/config';
import { AuthenticationChecks } from '../types/passkey';
import { UserService } from '@/v1/services/User';

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

export async function registerPasskeyWithWebAuthn(
  req: FastifyRequestTypebox<typeof RegisterPasskeyWithWebAuthnSchema>,
  rep: FastifyReplyTypebox<typeof RegisterPasskeyWithWebAuthnSchema>
) {
  try {
    const registration = req.body;
    const email = req.body.email;
    const passkeyName = req.body.passkeyName;

    const expected = {
      challenge: req.body.challenge,
      origin: Config.clientHost,
    };

    const user = await passkeyService.registerPasskeyWithWebAuthn(
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
    const parsedError = parseError(error);
    return errorResponse(req, rep, parsedError.statusCode, parsedError.message);
  }
}

export async function authenticatePasskeyWithWebAuthn(
  req: FastifyRequestTypebox<typeof AuthenticatePasskeyWithWebAuthnSchema>,
  rep: FastifyReplyTypebox<typeof AuthenticatePasskeyWithWebAuthnSchema>
) {
  try {
    const authentication = req.body;

    const expected: AuthenticationChecks = {
      challenge: req.body.challenge,
      origin: Config.clientHost,
      userVerified: true,
      verbose: !Config.isProduction,
    };

    const user = await passkeyService.authenticatePasskeyWithWebAuthn(
      authentication,
      expected
    );

    const token = await rep.jwtSign({ user });

    return successResponse(rep, {
      user,
      token,
    });
  } catch (error) {
    const parsedError = parseError(error);
    return errorResponse(req, rep, parsedError.statusCode, parsedError.message);
  }
}

export async function initiateRegisterPasskeyForExistingUser(
  req: FastifyRequestTypebox<typeof InitiateRegisterPasskeyForUserSchema>,
  rep: FastifyReplyTypebox<typeof InitiateRegisterPasskeyForUserSchema>
) {
  try {
    const email = req.body.email;
    const user = await userService.findOneByEmail(email);

    if (!user) {
      return errorResponse(req, rep, 404, 'User not found');
    }

    const token = await rep.jwtSign(user, {
      expiresIn: 1000 * 60 * 10, //10 minutes
    });

    await passkeyService.initiateRegisterDeviceForExistingUser({
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
      return errorResponse(req, rep, 404, 'User not found');
    }



  } catch (error) {
    const parsedError = parseError(error);
    return errorResponse(req, rep, parsedError.statusCode, parsedError.message);
  }
}
