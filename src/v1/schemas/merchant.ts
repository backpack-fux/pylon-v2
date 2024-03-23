import { Type as t } from '@sinclair/typebox';

export const CreateMerchantInput = {
  body: t.Object({
    name: t.String({ maxLength: 255 }),
    surname: t.String({ maxLength: 255 }),
    email: t.String({ format: 'email' }),
    phoneNumber: t.Optional(t.String()),
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
      data: t.Any(),
    }),
    404: t.Object({
      msg: t.String(),
    }),
    500: t.Object({
      msg: t.String(),
    }),
  },
};
