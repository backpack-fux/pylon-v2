import { Type as t } from '@sinclair/typebox';
import { BaseResponse } from '.';

export const BridgePrefundedAccountBalanceSchema = {
  ...BaseResponse,
};

export const BridgePrefundedAccountTransferSchema = {
  body: t.Object({
    amount: t.String(),
    on_behalf_of: t.String(),
    developer_fee: t.String(),
    source: t.Object({
      payment_rail: t.String(),
      currency: t.String(),
      prefunded_account_id: t.String(),
    }),
    destination: t.Object({
      payment_rail: t.String(),
      currency: t.String(),
      to_address: t.String(),
    }),
  }),
  ...BaseResponse,
};

export const BridgeWebhookSchema = {
  ...BaseResponse,
};
