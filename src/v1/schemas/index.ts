import { Type as t } from '@sinclair/typebox';
import {
  BridgePrefundedAccountBalanceSchema,
  BridgeWebhookSchema,
} from './bridge';
import { CreateMerchantSchema } from './merchant';

export const BaseResponse = {
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

/** @dev we need this for the error and success responses */
export type CustomSchemas =
  | typeof BridgePrefundedAccountBalanceSchema
  | typeof BridgeWebhookSchema
  | typeof CreateMerchantSchema;
