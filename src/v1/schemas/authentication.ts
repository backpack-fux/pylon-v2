import { FastifyCookie } from '@fastify/cookie';
import { FastifySessionObject } from '@fastify/session';
import { Type as t } from '@sinclair/typebox';
import { BaseResponse } from '.';

export const RegisterDeviceWithWebAuthnSchema = {
  body: t.Object({
    passKeyName: t.Optional(t.String()),
    username: t.String(),
    credential: t.Object({
      id: t.String(),
      algorithm: t.Enum({ RS256: 'RS256', ES256: 'ES256' }),
      publicKey: t.String(),
    }),
    authenticatorData: t.String(),
    clientData: t.String(),
    attestationData: t.Optional(t.String()),
    email: t.String({ format: 'email' }),
    challenge: t.String(),
  }),
  session: t.Object({
    challenge: t.String(),
  }),
  ...BaseResponse,
};

export const AuthenticateDeviceWithWebAuthnSchema = {
  body: t.Object({
    credentialId: t.String(),
    authenticatorData: t.String(),
    clientData: t.String(),
    signature: t.String(),
    userHandle: t.Optional(t.String()),
    challenge: t.String(),
  }),
  session: t.Object({
    challenge: t.String({ minLength: 32 }),
  }),
  ...BaseResponse,
};

export const SendWebAuthnChallengeSchema = {
  session: t.Object({
    challenge: t.String({ minLength: 32 }),
  }),
  ...BaseResponse,
};

export interface SessionWIthChallenge extends FastifySessionObject {
  challenge: string;
}
