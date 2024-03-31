import { Type as t } from '@sinclair/typebox';

export const CreateMerchantSchema = {
  body: t.Object({
    name: t.String({ minLength: 1, maxLength: 255 }),
    surname: t.String({ minLength: 1, maxLength: 255 }),
    email: t.String({ format: 'email' }),
    phoneNumber: t.String({ pattern: '^[+(s.-/d)]{5,30}$' }),
    companyNumber: t.Optional(t.String()),
    companyJurisdiction: t.Optional(t.String({ minLength: 2, maxLength: 2 })),
    fee: t.Optional(t.Number({ minimum: 3, maximum: 100 })),
    walletAddress: t.String({ pattern: '^(0x)?[0-9a-fA-F]{40}$' }),
    registeredAddress: t.Object({
      street1: t.String({ maxLength: 50 }),
      street2: t.Optional(t.String({ maxLength: 50 })),
      city: t.String({ maxLength: 50 }),
      postcode: t.Optional(t.String({ maxLength: 25 })),
      state: t.Optional(t.String({ minLength: 2, maxLength: 2 })),
      country: t.String({ minLength: 2, maxLength: 2 }),
    }),
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
