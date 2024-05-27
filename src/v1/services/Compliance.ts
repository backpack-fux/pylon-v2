import { UUID } from 'crypto';
import { PrismaSelectedCompliance } from '../types/prisma';
import { BridgeComplianceLinksResponse } from '../types/bridge/compliance';
import { prisma } from '@/db';
import { Merchant } from '@prisma/client';
import { AccountType, TosStatus, VerificationStatus } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ERROR400 } from '@/helpers/constants';
import { PrismaError } from './Error';

export class ComplianceService {
  private static instance: ComplianceService;

  public static getInstance(): ComplianceService {
    if (!ComplianceService.instance) {
      ComplianceService.instance = new ComplianceService();
    }
    return ComplianceService.instance;
  }

  /**
   * @param complianceUuid Randomly generated UUID for
   * @param registered response links from compliance partner
   * @param merchant link compliance table to merchant id
   * @returns Insert merchant into db using information from the compliance partner
   */
  public async insertMerchant(
    complianceUuid: UUID,
    registered: BridgeComplianceLinksResponse,
    merchant: Merchant
  ): Promise<PrismaSelectedCompliance | null> {
    try {
      const compliance: PrismaSelectedCompliance =
        await prisma.compliance.create({
          data: {
            id: complianceUuid,
            type: AccountType.BUSINESS,
            verificationDocumentLink: registered.kyc_link,
            termsOfServiceLink: registered.tos_link,
            verificationStatus: VerificationStatus.NOT_STARTED,
            termsOfServiceStatus: TosStatus.PENDING,
            merchantId: merchant.id,
          },
          select: {
            verificationDocumentLink: true,
            termsOfServiceLink: true,
          },
        });
      return compliance;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new PrismaError(ERROR400.statusCode, error.message);
      } else {
        throw error;
      }
    }
  }

  public async update(
    complianceUuid: UUID,
    kyc_status: VerificationStatus,
    tos_status: TosStatus
  ) {
    try {
      return await prisma.compliance.update({
        where: {
          id: complianceUuid,
        },
        data: {
          verificationStatus: kyc_status,
          termsOfServiceStatus: tos_status,
        },
        select: {
          merchantId: true,
          buyerId: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new PrismaError(ERROR400.statusCode, error.message);
      } else {
        throw error;
      }
    }
  }
}
