import { BridgePrefundedAccountBalanceSchema } from './bridge';
import { CreateMerchantSchema } from './merchant';

/** @dev we need this for the error and success responses */
export type CustomSchemas =
  | typeof BridgePrefundedAccountBalanceSchema
  | typeof CreateMerchantSchema;
