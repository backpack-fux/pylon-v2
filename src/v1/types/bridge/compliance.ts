import { TosStatus, VerificationStatus } from '@prisma/client';
import { UUID } from 'crypto';

export enum BridgeComplianceType {
  Individual = 'individual',
  Business = 'business',
}

export enum BridgeComplianceKycStatus {
  NotStarted = 'not_started',
  Pending = 'pending',
  Incomplete = 'incomplete',
  AwaitingUbo = 'awaiting_ubo',
  ManualReview = 'manual_review',
  UnderReview = 'under_review',
  Approved = 'approved', // Same as Active
  Active = 'active', // Same as Approved
  Rejected = 'rejected',
}

export enum BridgeComplianceTosStatus {
  Pending = 'pending',
  Approved = 'approved',
}

export type BridgeComplianceLinksResponse = {
  id: UUID;
  full_name: string;
  email: string;
  type: BridgeComplianceType;
  kyc_link: string;
  tos_link: string;
  kyc_status: BridgeComplianceKycStatus;
  tos_status: BridgeComplianceTosStatus;
  customer_id: UUID;
};

/** CUSTOMERS */

enum BridgeComplianceCapabilityStatus {
  Pending = 'pending',
  Active = 'active',
  Inactive = 'inactive',
  Rejected = 'rejected',
}

type BridgeComplianceCapabilities = {
  payin_crypto: BridgeComplianceCapabilityStatus;
  payout_crypto: BridgeComplianceCapabilityStatus;
  payin_fiat: BridgeComplianceCapabilityStatus;
  payout_fiat: BridgeComplianceCapabilityStatus;
};

enum BridgeComplianceEndorsementName {
  Base = 'base',
  Sepa = 'sepa',
}

enum BridgeComplianceEndorsementStatus {
  Incomplete = 'incomplete',
  Approved = 'approved',
  Revoked = 'revoked',
}

type BridgeComplianceEndorsementRequirements = string[];

type BridgeComplianceEndorsement = {
  name: BridgeComplianceEndorsementName;
  status: BridgeComplianceEndorsementStatus;
  additional_requirements: BridgeComplianceEndorsementRequirements;
};

type BridgeComplianceRejectionReason = {
  developer_reason: string;
  reason: string;
  created_at: string;
};

export type BridgeComplianceCustomer = {
  id: UUID;
  first_name: string;
  last_name: string;
  email: string;
  status: BridgeComplianceKycStatus;
  type: BridgeComplianceType;
  future_requirements_due: string[];
  requirements_due: string[];
  capabilities: BridgeComplianceCapabilities;
  persona_inquiry_type: string;
  created_at: string;
  updated_at: string;
  rejection_reasons: BridgeComplianceRejectionReason[];
  has_accepted_terms_of_service: boolean;
  endorsements: BridgeComplianceEndorsement[];
};

export type BridgeComplianceCustomerResponse = {
  id: UUID;
  full_name: string;
  email: string;
  type: BridgeComplianceType;
  kyc_link: string;
  tos_link: string;
  kyc_status: BridgeComplianceKycStatus;
  rejection_reasons: BridgeComplianceRejectionReason[];
  tos_status: BridgeComplianceTosStatus;
  created_at: string;
  customer_id: UUID;
  persona_inquiry_type: string;
};

export type BridgeComplianceGetAllComplianceLinksResponse = {
  count: number;
  data: BridgeComplianceCustomerResponse[];
};

export type BridgeComplianceGetAllCustomersResponse = {
  count: number;
  data: BridgeComplianceCustomer[];
};
