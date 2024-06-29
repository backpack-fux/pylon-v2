import { Type as t } from '@sinclair/typebox';
import { SWAGGER_TAG } from '../types/swagger';

const BaseResponse = {
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

export const RegisterPasskeySchema = {
  tags: [SWAGGER_TAG.Authentication],
  body: t.Object({
    passkeyName: t.Optional(t.String()),
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

export const AuthenticatePasskeySchema = {
  tags: [SWAGGER_TAG.Authentication],
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

export const InitiateRegisterPasskeyForUserSchema = {
  tags: [SWAGGER_TAG.Authentication],
  body: t.Object({
    email: t.String({ format: 'email' }),
  }),
  ...BaseResponse,
};

export const RegisterPasskeyForExistingUserSchema = {
  tags: [SWAGGER_TAG.Authentication],
  body: t.Object({
    passkeyName: t.Optional(t.String()),
    credential: t.Object({
      id: t.String(),
      algorithm: t.Enum({ RS256: 'RS256', ES256: 'ES256' }),
      publicKey: t.String(),
    }),
    authenticatorData: t.String(),
    clientData: t.String(),
    attestationData: t.Optional(t.String()),
    challenge: t.String(),
  }),
  session: t.Object({
    challenge: t.String(),
  }),
  user: t.Object({
    email: t.String({ format: 'email' }),
    username: t.String(),
    createdAt: t.String(),
    updatedAt: t.String(),
    id: t.String(),
  }),
  ...BaseResponse,
};

export const RemovePasskeySchema = {
  tags: [SWAGGER_TAG.Authentication],
  params: t.Object({
    id: t.Number(),
  }),
  ...BaseResponse,
};

export const SendWebAuthnChallengeSchema = {
  tags: [SWAGGER_TAG.Authentication],
  session: t.Object({
    challenge: t.String({ minLength: 32 }),
  }),
  ...BaseResponse,
};

export const BaseResponseSchema = BaseResponse