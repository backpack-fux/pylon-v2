import { Type as t } from '@sinclair/typebox';
import { BaseResponse } from '.';
import {
  ISO3166Alpha2Country,
  ISO4217Currency,
  TransactionProcessor,
} from '../types/transaction';
import { MerchantIdentifier } from '../types/merchant';

export const TransactionProcessSchema = {
  querystring: t.Object({
    paymentProcessor: t.Enum(TransactionProcessor),
  }),
  body: t.Object({
    sessionUrl: t.String({
      format: 'uri',
    }),
    order: t.Object({
      merchant: t.Object({
        id: t.Enum(MerchantIdentifier),
      }),
      buyer: t.Object({
        fullName: t.String(),
        billingAddress: t.Object({
          address1: t.String(),
          address2: t.Optional(t.String()),
          address3: t.Optional(t.String()),
          postalCode: t.String(),
          city: t.String(),
          state: t.Optional(t.String()),
          countryCode: t.Enum(ISO3166Alpha2Country),
        }),
      }),
      value: t.Object({
        currency: t.Enum(ISO4217Currency),
        amount: t.Number({ exclusiveMinimum: 0 }),
      }),
    }),
  }),
  ...BaseResponse,
};
