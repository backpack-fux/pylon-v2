import { Type as t } from '@sinclair/typebox';
import { BridgePrefundedAccountBalanceSchema } from './bridge';
import { MerchantCreateSchema } from './merchant';
import { TransactionProcessSchema } from './transaction';

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

export const RequestUser = t.Object({
  id: t.Number(),
  email: t.String({format: 'email'}),
  username: t.String(),
  rain: t.String({format: 'uuid'}),
  createdAt: t.String({format: "date-time"}),
  created: t.String({format: "date-time"}),

  // username          String             @unique @db.VarChar(15)
  // rain              String             @unique @db.VarChar(36)
  // createdAt         DateTime           @default(now())
  // updatedAt         DateTime           @updatedAt
  // RegisteredDevices RegisteredDevice[]
  // RainCompany  
})

/** @dev we need this for the error and success responses */
export type CustomSchemas =
  | typeof BridgePrefundedAccountBalanceSchema
  | typeof MerchantCreateSchema
  | typeof TransactionProcessSchema;

