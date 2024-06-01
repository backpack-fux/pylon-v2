import { FastifySessionObject } from '@fastify/session';
import { Type as t } from '@sinclair/typebox';

export const RegisterDeviceWithWebAuthnSchema = {
  body: t.Object({
    username: t.String(),
    credential: t.Object({
      id: t.String(),
      algorithm: t.Enum({ RS256: 'RS256', ES256: 'ES256' }),
      publicKey: t.String(),
    }),
    authenticatorData: t.String(),
    clientData: t.String(),
    attestationData: t.String().optional(),
  }),
  session: t.Object({
    challenge: t.String({ minLength: 32 }),
  }),
  response: {
    200: t.Object({
      statusCode: t.Number(),
      data: t.Any(),
    }),
    400: t.Object({
      statusCode: t.Number(),
      message: t.String(),
    }),
    404: t.Object({
      statusCode: t.Number(),
      message: t.String(),
    }),
    500: t.Object({
      statusCode: t.Number(),
      message: t.String(),
    }),
  },
};

export const SendWebAuthnChallengeSchema = {
  session: t.Object({
    challenge: t.String({ minLength: 32 }),
  }),
  response: {
    200: t.Object({
      statusCode: t.Number(),
      data: t.Any(),
    }),
    400: t.Object({
      statusCode: t.Number(),
      message: t.String(),
    }),
    404: t.Object({
      statusCode: t.Number(),
      message: t.String(),
    }),
    500: t.Object({
      statusCode: t.Number(),
      message: t.String(),
    }),
  },
};

export interface SessionWIthChallenge extends FastifySessionObject {
  challenge: string;
}
