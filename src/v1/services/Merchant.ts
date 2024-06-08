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
  public async emailExists(email: string): Promise<boolean> {
    const count = await prisma.merchant.count({
      where: {
        email: email,
      },
    });
    return count > 0;
  }

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
      const existingEmailCount = await prisma.merchant.count({ where: { email } });
      if (existingEmailCount > 0) {
        console.error(`Email already exists in the database: ${email}`);
        throw new Error('A merchant with this email already exists.');
      }

      const existingPhoneCount = await prisma.merchant.count({ where: { phoneNumber } });
      if (existingPhoneCount > 0) {
        console.error(`Phone number already exists in the database: ${phoneNumber}`);
        throw new Error('A merchant with this phone number already exists.');
      }

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
