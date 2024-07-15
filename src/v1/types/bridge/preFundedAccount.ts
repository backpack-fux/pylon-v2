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
