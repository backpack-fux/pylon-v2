import { Type as t } from '@sinclair/typebox';

export const CreateMerchantInput = {
  body: t.Object({
    name: t.String(),
    email: t.String(),
    phoneNumber: t.String(),
    companyNumber: t.Optional(t.String()),
    companyJurisidiction: t.Optional(t.String()),
    walletAddress: t.String(),
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
