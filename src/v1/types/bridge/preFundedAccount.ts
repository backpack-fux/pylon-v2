export enum BridgePaymentRailEnum {
  POLYGON = 'polygon',
  ARBITRUM = 'arbitrum',
  AVALANCHE = 'avalanche',
  OPTIMISM = 'optimism',
  SOLANA = 'solana',
  STELLAR = 'stellar',
  ACH = 'ach',
  WIRE = 'wire',
  ACH_PUSH = 'ach_push',
  PREFUNDED = 'prefunded',
}

type BridgePaymentRailType =
  | BridgePaymentRailEnum.POLYGON
  | BridgePaymentRailEnum.ARBITRUM
  | BridgePaymentRailEnum.AVALANCHE
  | BridgePaymentRailEnum.OPTIMISM
  | BridgePaymentRailEnum.SOLANA
  | BridgePaymentRailEnum.STELLAR
  | BridgePaymentRailEnum.ACH
  | BridgePaymentRailEnum.WIRE
  | BridgePaymentRailEnum.ACH_PUSH
  | BridgePaymentRailEnum.PREFUNDED;

export type BridgePaymentRailTypeSrc =
  | BridgePaymentRailEnum.ACH
  | BridgePaymentRailEnum.WIRE
  | BridgePaymentRailEnum.ACH_PUSH
  | BridgePaymentRailEnum.PREFUNDED;

export type BridgePaymentRailTypeDst = Exclude<
  BridgePaymentRailType,
  BridgePaymentRailTypeSrc
>;

export enum BridgeCurrencyEnum {
  USD = 'usd',
  USDC = 'usdc',
  USDT = 'usdt',
  DAI = 'dai',
}

type BridgeCurrencyType = BridgeCurrencyEnum;

export type BridgeCurrencyTypeSrc = BridgeCurrencyEnum.USD;
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
