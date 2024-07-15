type BridgePaymentRailType =
  | 'polygon'
  | 'arbitrum'
  | 'avalanche'
  | 'optimism'
  | 'solana'
  | 'stellar'
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

type BridgeCurrencyType = 'usd' | 'usdc' | 'usdt' | 'dai';

export type BridgeCurrencyTypeSrc = 'usd';
export type BridgeCurrencyTypeDst = Exclude<
  BridgeCurrencyType,
  BridgeCurrencyTypeSrc
>;

export type BridgePrefundedAccountBalance = {
  data: Array<{
    id: string;
    available_balance: string;
    currency: string;
    name: string;
  }>;
};

export type BridgeUUID = `${string}-${string}-${string}-${string}-${string}`;

export type BridgeSourceObject = {
  payment_rail: BridgePaymentRailTypeSrc;
  currency: BridgeCurrencyTypeSrc;
  prefunded_account_id: BridgeUUID;
};

export type BridgeDestinationObject = {
  payment_rail: BridgePaymentRailTypeDst;
  currency: BridgeCurrencyTypeDst;
  to_address: `0x${string}`;
};

export type BridgePrefundedAccountTransferParams = {
  idempotencyKey: BridgeUUID;
  amount: string;
  on_behalf_of: BridgeUUID;
  developer_fee: string;
  source: BridgeSourceObject;
  destination: BridgeDestinationObject;
};
