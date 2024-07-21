import { prisma } from '@/db';
import {
  BridgeComplianceLinksResponse,
  BridgeComplianceTypeEnum,
} from '../types/bridge/compliance';
import { BridgeService } from './external/Bridge';
import { UUID } from 'crypto';
import { PrismaMerchant, PrismaUser } from '../types/prisma';
import { AddressType, UserRole } from '@prisma/client';
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
      const merchant = await prisma.merchant.create({
        data: {
          name,
          surname,
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
          user: {
            create: {
              role: UserRole.MERCHANT,
              email,
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
