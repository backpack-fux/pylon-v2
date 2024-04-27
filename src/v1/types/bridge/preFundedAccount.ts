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
