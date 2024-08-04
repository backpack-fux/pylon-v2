import type {
  Merchant as BaseMerchant,
  Compliance as BaseCompliance,
  User as BaseUser,
  RegisteredPasskey as BaseRegisteredPasskey,
  Customer as BaseCustomer,
  ApiKey as BaseApiKey,
} from '@prisma/client';

export type PrismaSelectedCompliance = Pick<
  BaseCompliance,
  'verificationDocumentLink' | 'termsOfServiceLink'
>;

export type PrismaMerchant = BaseMerchant;
export type PrismaCustomer = BaseCustomer;
export type PrismaUser = BaseUser;
export type PrismaRegisteredPasskey = BaseRegisteredPasskey;
export type PrismaApiKey = BaseApiKey;
