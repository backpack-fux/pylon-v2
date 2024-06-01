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

  /** @dev create partner */
  public async createPartner(partnerData: any): Promise<PrismaMerchant> {
    const {
      name,
      surname,
      email,
      phoneNumber,
      companyNumber,
      companyJurisdiction,
      fee,
      walletAddress,
      registeredAddress,
    } = partnerData;

    const { street1, street2, city, postcode, state, country } =
      registeredAddress;

    try {
      const merchant: PrismaMerchant = await prisma.merchant.create({
        data: {
          name,
          surname,
          email,
          phoneNumber,
          companyNumber,
          companyJurisdiction,
          fee,
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
        data: { },
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
