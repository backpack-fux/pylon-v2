import { Type as t } from '@sinclair/typebox';
import { BaseResponse } from '.';
import {
  BridgeComplianceKycStatus,
  BridgeComplianceTosStatus,
} from '../types/bridge/compliance';

export const MerchantCreateSchema = {
  body: t.Object({
    fee: t.Optional(t.Number({ minimum: 3, maximum: 100 })),
    walletAddress: t.String({
      pattern: '^0x[a-fA-F0-9]{40}$',
      minLength: 42,
      maxLength: 42,
    }),
    representatives: t.Array(
      t.Object({
        name: t.String({ minLength: 1, maxLength: 255 }),
        surname: t.String({ minLength: 1, maxLength: 255 }),
        email: t.String({ format: 'email' }),
        phoneNumber: t.String({
          pattern: '^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$',
        }),
      })
    ),
    company: t.Object({
      name: t.String({ minLength: 1, maxLength: 255 }),
      email: t.String({ format: 'email' }),
      number: t.String({ pattern: '^[a-zA-Z0-9]*$' }),
    }),
    registeredAddress: t.Object({
      street1: t.String({ maxLength: 50 }),
      street2: t.Optional(t.String({ maxLength: 50 })),
      city: t.String({ maxLength: 50 }),
      postcode: t.Optional(
        t.String({
          maxLength: 25,
          pattern: '^[a-zA-Z0-9]*$',
        })
      ),
      state: t.Optional(
        t.String({
          minLength: 2,
          maxLength: 2,
          pattern: '^[a-zA-Z0-9]{2}$',
        })
      ),
      country: t.String({
        minLength: 2,
        maxLength: 2,
        pattern: '^[a-zA-Z0-9]{2}$',
      }),
    }),
    compliance: t.Optional(
      t.Object({
        complianceUuid: t.String({ format: 'uuid' }),
        kycLink: t.String({ format: 'uri' }),
        tosLink: t.String({ format: 'uri' }),
        kycStatus: t.Enum(BridgeComplianceKycStatus),
        tosStatus: t.Enum(BridgeComplianceTosStatus),
        createdAt: t.String({ format: 'date-time' }),
      })
    ),
  }),
  ...BaseResponse,
};

export const TransferStatusSchema = {
  params: t.Object({
    transferId: t.String({ format: 'uuid' }),
  }),
  ...BaseResponse,
};
