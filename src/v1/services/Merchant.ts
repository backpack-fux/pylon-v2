import { prisma } from '@/db';
import {
  BridgeComplianceLinksResponse,
  BridgeComplianceTypeEnum,
} from '../types/bridge/compliance';
import { BridgeService } from './external/Bridge';
import { UUID } from 'crypto';
import { PrismaMerchant } from '../types/prisma';
import { AddressType } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ERROR400 } from '@/helpers/constants';
import { PrismaError } from './Error';

const bridgeService = BridgeService.getInstance();

export class MerchantService {
  private static instance: MerchantService;

  public static getInstance(): MerchantService {
    if (!MerchantService.instance) {
      MerchantService.instance = new MerchantService();
    }
    return MerchantService.instance;
  }
  /* 
  
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
  */
  /** @dev create partner */
  public async createPartner(partnerData: any, ultimateBeneficialOwners: any): Promise<PrismaMerchant> {
    console.log(partnerData, 'PartnerDATA')
    console.log(ultimateBeneficialOwners, 'ULTIMATE BENEFICIAL OWNERS DATA')
    const {
      firstName,
      lastName,
      email,
      companyNumber,
      companyJurisdiction,
      fee,
      walletAddress,
      address,
    } = partnerData;


    const { street1, street2, city, postcode, state, country } =
      address;

    try {
      const merchant: PrismaMerchant = await prisma.merchant.create({
        data: {
          name: firstName,
          surname: lastName,
          email,
          phoneNumber: ultimateBeneficialOwners[0].phoneNumber,
          companyNumber: null,
          companyJurisdiction: ultimateBeneficialOwners[0].address.country,
          fee: 0.050, //TODO make this not hardcoded?
          walletAddress,
          registeredAddress: {
            create: {
              type: AddressType.REGISTERED,
              street1,
              street2,
              city,
              postcode,
              state,
              country,
            },
          },
        },
      });

      return merchant;
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new PrismaError(ERROR400.statusCode, error.message);
      } else {
        throw error;
      }
    }
  }

  /** @dev update merchant rain id */
  public async updateRainId(
    merchantId: number,
    rainId: string
  ): Promise<PrismaMerchant> {
    try {
      const updatedMerchant: PrismaMerchant = await prisma.merchant.update({
        where: { id: merchantId },
        data: {},
      });

      return updatedMerchant;
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new PrismaError(ERROR400.statusCode, error.message);
      } else {
        throw error;
      }
    }
  }

  /** @dev register kyb partner via compliance partner */
  public async registerCompliancePartner(
    merchantUuid: UUID,
    fullName: string,
    email: string
  ): Promise<BridgeComplianceLinksResponse> {
    try {
      const registered: BridgeComplianceLinksResponse =
        await bridgeService.createComplianceLinks(
          merchantUuid,
          fullName,
          BridgeComplianceTypeEnum.Business,
          email
        );

      return registered;
    } catch (error) {
      /** @todo improve error handling from compliance partner */
      throw error;
    }
  }
}
