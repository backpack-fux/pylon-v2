import { UUID } from 'crypto';
import { PrismaSelectedCompliance } from '../types/prisma';
import {
  BridgeComplianceCustomer,
  BridgeComplianceCustomerResponse,
  BridgeComplianceKycStatus,
  BridgeComplianceLinksResponse,
  BridgeComplianceTosStatus,
  BridgeComplianceType,
} from '../types/bridge/compliance';
import { prisma } from '@/db';
import { Merchant } from '@prisma/client';
import { AccountType, TosStatus, VerificationStatus } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ERROR400 } from '@/helpers/constants';
import { PrismaError } from './Error';

export class ComplianceService {
  private static instance: ComplianceService;

  private mapKycStatus = (
    status: BridgeComplianceKycStatus
  ): VerificationStatus => {
    switch (status) {
      case BridgeComplianceKycStatus.NotStarted:
        return VerificationStatus.NOT_STARTED;
      case BridgeComplianceKycStatus.Pending:
        return VerificationStatus.PENDING;
      case BridgeComplianceKycStatus.Incomplete:
        return VerificationStatus.INCOMPLETE;
      case BridgeComplianceKycStatus.AwaitingUbo:
        return VerificationStatus.AWAITING_UBO;
      case BridgeComplianceKycStatus.ManualReview:
        return VerificationStatus.MANUAL_REVIEW;
      case BridgeComplianceKycStatus.UnderReview:
        return VerificationStatus.UNDER_REVIEW;
      case BridgeComplianceKycStatus.Approved:
      case BridgeComplianceKycStatus.Active:
        return VerificationStatus.APPROVED;
      case BridgeComplianceKycStatus.Rejected:
        return VerificationStatus.REJECTED;
      default:
        throw new Error(`Unknown KYC status: ${status}`);
    }
  };

  private mapTosStatus = (status: BridgeComplianceTosStatus): TosStatus => {
    switch (status) {
      case BridgeComplianceTosStatus.Pending:
        return TosStatus.PENDING;
      case BridgeComplianceTosStatus.Approved:
        return TosStatus.APPROVED;
      default:
        throw new Error(`Unknown TOS status: ${status}`);
    }
  };

  private mapAccountType = (type: BridgeComplianceType): AccountType => {
    switch (type) {
      case BridgeComplianceType.Individual:
        return AccountType.INDIVIDUAL;
      case BridgeComplianceType.Business:
        return AccountType.BUSINESS;
      default:
        throw new Error(`Unknown account type: ${type}`);
    }
  };

  public static getInstance(): ComplianceService {
    if (!ComplianceService.instance) {
      ComplianceService.instance = new ComplianceService();
    }
    return ComplianceService.instance;
  }

  /**
   * @param complianceUuid Randomly generated UUID for compliance
   * @param registered response links from compliance partner
   * @param merchant link compliance table to merchant id
   * @returns Insert merchant into db using information from the compliance partner
   */
  public async createComplianceLinksForMerchant(
    complianceUuid: UUID,
    registered: Pick<
      BridgeComplianceLinksResponse,
      'kyc_link' | 'tos_link' | 'kyc_status' | 'tos_status' | 'type'
    >,
    merchant: Merchant
  ): Promise<PrismaSelectedCompliance> {
    try {
      const compliance = await prisma.compliance.create({
        data: {
          id: complianceUuid,
          type: this.mapAccountType(registered.type),
          verificationDocumentLink: registered.kyc_link,
          termsOfServiceLink: registered.tos_link,
          verificationStatus: this.mapKycStatus(registered.kyc_status),
          termsOfServiceStatus: this.mapTosStatus(registered.tos_status),
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
