import { Type as t } from '@sinclair/typebox';
import { BaseResponse } from '.';
import {
  ISO3166Alpha2Country,
  TransactionProcessor,
} from '../types/transaction';
import { Config } from '@/config';

export const TransactionProcessSchema = {
  querystring: t.Object({
    paymentProcessor: t.Enum(TransactionProcessor),
  }),
  body: t.Object({
    sessionUrl: t.String({
      format: 'uri',
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
  }),
  ...BaseResponse,
};
