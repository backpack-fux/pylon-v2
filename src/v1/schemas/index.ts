import {
  BridgePrefundedAccountBalanceSchema,
  BridgeWebhookSchema,
} from './bridge';
import { CreateMerchantSchema } from './merchant';

/** @dev we need this for the error and success responses */
export type CustomSchemas =
  | typeof BridgePrefundedAccountBalanceSchema
  | typeof BridgeWebhookSchema
  | typeof CreateMerchantSchema;
