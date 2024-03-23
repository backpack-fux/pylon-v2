import { Type as t } from '@sinclair/typebox';

export const UserSignUpInput = {
  body: t.Object({
    signatory_address: t.String(),
    contact_address: t.String(),
    contact_chain_id: t.Number(),
    contact_name: t.String(),
    contact_description: t.Optional(t.String()),
    signature: t.String(),
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

export const UserAuthInput = {
  body: t.Object({
    signatory_address: t.String(),
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

export const UserLoginInput = {
  body: t.Object({
    signatory_address: t.String(),
    signature: t.String(),
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
