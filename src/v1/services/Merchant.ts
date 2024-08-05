import { prisma } from '@/db';
import {
  BridgeComplianceLinksResponse,
  BridgeComplianceType,
} from '../types/bridge/compliance';
import { BridgeService } from './external/Bridge';
import { UUID } from 'crypto';
import { PrismaEmployee, PrismaMerchant, PrismaUser } from '../types/prisma';
import { AddressType, EmployeeRole } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ERROR400 } from '@/helpers/constants';
import { PrismaError } from './Error';
import { MerchantCreateBody } from '../types/merchant';

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
  public async createPartner(
    partnerData: MerchantCreateBody
  ): Promise<PrismaMerchant & { Employees: Pick<PrismaEmployee, 'userId'>[] }> {
    const {
      name: representativeName,
      surname: representativeSurname,
      email: representativeEmail,
      phoneNumber: representativePhoneNumber,
      company,
      fee,
      walletAddress,
      registeredAddress,
    } = partnerData;

    const { street1, street2, city, postcode, state, country } =
      registeredAddress;

    const { name: companyName, number: companyNumber } = company;

    try {
      const merchant = await prisma.merchant.create({
        data: {
          fee,
          walletAddress: walletAddress,
          company: {
            create: {
              name: companyName,
              number: companyNumber,
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
          },
          Employees: {
            create: {
              name: representativeName,
              surname: representativeSurname,
              role: EmployeeRole.OWNER,
              user: {
                create: {
                  email: representativeEmail,
                  phoneNumber: representativePhoneNumber,
                },
              },
            },
          },
        },
        select: {
          id: true,
          walletAddress: true,
          fee: true,
          createdAt: true,
          updatedAt: true,
          companyId: true,
          Employees: {
            select: {
              userId: true,
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
          BridgeComplianceType.Business,
          email
        );

      return registered;
    } catch (error) {
      /** @todo improve error handling from compliance partner */
      throw error;
    }
  }
}
