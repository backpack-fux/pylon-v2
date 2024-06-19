import { Type as t } from '@sinclair/typebox';

const Address = t.Object({
  line1: t.String(),
  line2: t.Optional(t.String()),
  city: t.String(),
  region: t.String(),
  postalCode: t.String(),
  countryCode: t.String(),
  country: t.String(),
});

const Representative = t.Object({
  lastName: t.String(),
  firstName: t.String(),
  birthDate: t.String(),
  nationalId: t.String(),
  countryOfIssue: t.String(),
  email: t.String({ format: 'email' }),
  address: Address,
});

const UltimateBeneficialOwner = t.Object({
  lastName: t.String(),
  firstName: t.String(),
  birthDate: t.String(),
  nationalId: t.String(),
  countryOfIssue: t.String(),
  email: t.String({ format: 'email' }),
  address: Address,
});

const Entity = t.Object({
  name: t.String(),
  type: t.String(),
  description: t.String(),
  taxId: t.String(),
  website: t.String(),
  expectedSpend: t.String(),
});

const InitialUser = t.Object({
  lastName: t.String(),
  firstName: t.String(),
  birthDate: t.String(),
  nationalId: t.String(),
  countryOfIssue: t.String(),
  email: t.String({ format: 'email' }),
  address: Address,
  role: t.String(),
  walletAddress: t.String(),
  ipAddress: t.String(),
  iovationBlackbox: t.String(),
});

// Company
export const CreateApplicationForCompanySchema = {
  body: t.Object({
    initialUser: InitialUser,
    name: t.String(),
    address: Address,
    entity: Entity,
    representatives: t.Array(Representative),
    ultimateBeneficialOwners: t.Array(UltimateBeneficialOwner),
  }),
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

export const CheckCompanyApplicationStatusSchema = {
  params: t.Object({
    companyId: t.String(),
  }),
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

export const ReapplyForCompanySchema = {
  params: t.Object({
    companyId: t.String(),
  }),
  ...CreateApplicationForCompanySchema,
};

export const UploadApplicationDocumentSchema = {
  params: t.Object({
    id: t.String(),
  }),
  body: t.Any(),
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

/**
 * USER
 */

export const CreateApplicationForUserSchema = {
  phoneCountryCode: t.String({ pattern: '^[+(s.-d)]{5,30}$' }),
  phoneNumber: t.String({ pattern: '^[+(s.-d)]{5,30}$' }),
  // Merge the properties from InitialUser
  ...InitialUser,
};
