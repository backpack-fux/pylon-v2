import { TosStatus, VerificationStatus } from '@prisma/client';

export enum BridgeComplianceTypeEnum {
  Individual = 'individual',
  Business = 'business',
}

export type BridgeComplianceType = 'individual' | 'business';

export type BridgeComplianceLinksResponse = {
  id: string;
  full_name: string;
  email: string;
  type: BridgeComplianceType;
  kyc_link: string;
  tos_link: string;
  kyc_status:
    | 'not_started'
    | 'pending'
    | 'incomplete'
    | 'awaiting_ubo'
    | 'manual_review'
    | 'under_review'
    | 'approved'
    | 'rejected'; // TODO: use enums
  tos_status: 'pending' | 'approved'; // TODO: use enums
  customer_id: string;
};
