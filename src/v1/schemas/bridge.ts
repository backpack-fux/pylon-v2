import { Type as t } from '@sinclair/typebox';
import { BaseResponse } from '.';
import {
  BridgeCurrencyEnum,
  BridgePaymentRailEnum,
} from '../types/bridge/preFundedAccount';

export const BridgePrefundedAccountBalanceSchema = {
  body: t.Object({
    token: t.String(),
  }),
  ...BaseResponse,
};

export const BridgePrefundedAccountTransferSchema = {
  body: t.Object({
    token: t.String(), // TODO: pass in token from auth header
    amount: t.Number({ minimum: 20 }), // Bridge requires $20 minimum
    on_behalf_of: t.String({ format: 'uuid' }),
    developer_fee: t.Optional(t.Number({ minimum: 0, maximum: 100 })),
    source: t.Object({
      payment_rail: t.Enum(BridgePaymentRailEnum),
      currency: t.Enum(BridgeCurrencyEnum),
      prefunded_account_id: t.String({ format: 'uuid' }),
    }),
    destination: t.Object({
      payment_rail: t.Enum(BridgePaymentRailEnum),
      currency: t.Enum(BridgeCurrencyEnum),
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
