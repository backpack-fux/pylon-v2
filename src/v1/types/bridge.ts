/** @dev COMPLIANCE */
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
    | 'rejected';
  tos_status: 'pending' | 'approved';
  customer_id: string;
};

/** @dev PRE-FUNDED ACCOUNT */
type BridgePaymentRailType =
  | 'Polygon'
  | 'Arbitrum'
  | 'Avalanche'
  | 'Optimism'
  | 'Solana'
  | 'Stellar'
  | 'ach'
  | 'wire'
  | 'ach_push'
  | 'prefunded';

export type BridgePaymentRailTypeSrc =
  | 'ach'
  | 'wire'
  | 'ach_push'
  | 'prefunded';

export type BridgePaymentRailTypeDst = Exclude<
  BridgePaymentRailType,
  BridgePaymentRailTypeSrc
>;

type BridgeCurrencyType = 'usd' | 'usdc';

export type BridgeCurrencyTypeSrc = 'usd';
export type BridgeCurrencyTypeDst = Exclude<
  BridgeCurrencyType,
  BridgeCurrencyTypeSrc
>;

export type BridgePrefundedAccountBalance = {
  id: string;
  available_balance: string;
  currency: string;
  name: string;
};
