import { Type as t } from '@sinclair/typebox';
import { AddressType } from '@prisma/client/edge';

export const CreateMerchantInput = {
  body: t.Object({
    name: t.String(),
    email: t.String(),
    phoneNumber: t.String(),
    companyNumber: t.Optional(t.String()),
    companyJurisidiction: t.Optional(t.String()),
    walletAddress: t.String(),
    registeredAddress: t.Object({
      type: t.Enum(AddressType),
      street1: t.String(),
      street2: t.Optional(t.String()),
      city: t.String(),
      postcode: t.Optional(t.String()),
      state: t.Optional(t.String()),
      country: t.String(),
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
