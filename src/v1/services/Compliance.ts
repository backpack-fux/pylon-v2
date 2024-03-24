import { UUID } from 'crypto';
import { PrismaSelectedCompliance } from '../types/prisma';
import { BridgeComplianceLinksResponse } from '../types/bridge';
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

  /** @dev store response from compliance partner */
  public async storePartner(
    merchantUuid: UUID,
    registered: BridgeComplianceLinksResponse,
    merchant: Merchant
  ): Promise<PrismaSelectedCompliance | null> {
    try {
      const compliance: PrismaSelectedCompliance =
        await prisma.compliance.create({
          data: {
            id: merchantUuid,
            type: AccountType.BUSINESS,
            verificationDocumentLink: registered.kyc_link,
            termsOfServiceLink: registered.tos_link,
            verificatonStatus: VerificationStatus.NOT_STARTED,
            termsOfServiceStatus: TosStatus.PENDING,
            merchant: {
              connect: { id: merchant.id },
            },
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
}
