import { Type as t } from '@sinclair/typebox';
import { BaseResponse } from '.';

export const BridgePrefundedAccountBalanceSchema = {
  body: t.Object({
    token: t.String(),
  }),
  ...BaseResponse,
};

export const BridgePrefundedAccountTransferSchema = {
  body: t.Object({
    token: t.String(),
    amount: t.String({ minLength: 20 }), // Bridge requires $20 minimum
    on_behalf_of: t.String({ format: 'uuid' }),
    developer_fee: t.String(),
    source: t.Object({
      payment_rail: t.String(),
      currency: t.String(),
      prefunded_account_id: t.String({ format: 'uuid' }),
    }),
    destination: t.Object({
      payment_rail: t.String(),
      currency: t.String(),
      to_address: t.String({
        pattern: '^0x[a-fA-F0-9]{40}$',
      }),
    }),
  }),
  ...BaseResponse,
};

export const BridgeWebhookSchema = {
  ...BaseResponse,
};
