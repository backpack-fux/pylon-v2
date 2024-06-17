import { Type as t } from '@sinclair/typebox';
import { BaseResponse } from '.';

const AddressSchema = t.Object({
  street1: t.String({ maxLength: 50 }),
  street2: t.Optional(t.String({ maxLength: 50 })),
  city: t.String({ maxLength: 50 }),
  postcode: t.Optional(t.String({ maxLength: 25 })),
  state: t.Optional(t.String({ minLength: 2, maxLength: 2 })),
  country: t.String({ minLength: 2, maxLength: 2 }),
});

export const MerchantCreateSchema = {
  body: t.Object({
    initialUser: t.Object({
      lastName: t.String({ minLength: 1 }),
      firstName: t.String({ minLength: 1 }),
      birthDate: t.String({ minLength: 1 }),
      nationalId: t.String({ minLength: 1 }),
      countryOfIssue: t.String({ minLength: 1 }),
      email: t.String({ format: 'email' }),
      address: AddressSchema,
      role: t.String({ minLength: 1 }),
      walletAddress: t.String({ minLength: 1 }),
      ipAddress: t.Optional(t.String()),
      iovationBlackbox: t.Optional(t.String()),
    }),
    name: t.String({ minLength: 1 }),
    address: AddressSchema,
    entity: t.Object({
      name: t.String({ minLength: 1 }),
      type: t.String({ minLength: 1 }),
      description: t.String({ minLength: 1 }),
      taxId: t.String({ minLength: 1 }),
      website: t.String({ minLength: 1 }),
      expectedSpend: t.String({ minLength: 1 }),
      statementOfFunds: t.Any(File),
      formationDocument: t.Any(File),
      ownershipDocument: t.Any(File),
      einRegistration: t.Optional(t.Any(File)),
      certificateOfIncorporation: t.Optional(t.Any(File)),
    }),
    representatives: t.Array(t.Object({
      lastName: t.String({ minLength: 1 }),
      firstName: t.String({ minLength: 1 }),
      birthDate: t.String({ minLength: 1 }),
      nationalId: t.String({ minLength: 1 }),
      countryOfIssue: t.String({ minLength: 1 }),
      email: t.String({ format: 'email' }),
      address: AddressSchema,
    })),
    ultimateBeneficialOwners: t.Array(t.Object({
      lastName: t.String({ minLength: 1 }),
      firstName: t.String({ minLength: 1 }),
      birthDate: t.String({ minLength: 1 }),
      nationalId: t.String({ minLength: 1 }),
      countryOfIssue: t.String({ minLength: 1 }),
      email: t.String({ format: 'email' }),
      address: AddressSchema,
      idFrontPhoto: t.Any(File),
      idBackPhoto: t.Any(File),
      proofOfAddressDocument: t.Any(File),
    })),
  }),
  ...BaseResponse,
};