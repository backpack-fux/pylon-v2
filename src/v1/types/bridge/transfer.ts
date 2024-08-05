import { UUID } from 'crypto';
import { BridgeCurrencyEnum, BridgePaymentRailEnum } from './preFundedAccount';

enum BridgeTransferStateEnum {
  AWAITING_FUNDS = 'awaiting_funds',
  IN_REVIEW = 'in_review',
  FUNDS_RECEIVED = 'funds_received',
  PAYMENT_SUBMITTED = 'payment_submitted',
  PAYMENT_PROCESSED = 'payment_processed',
  CANCELED = 'canceled',
  ERROR = 'error',
  RETURNED = 'returned',
  REFUNDED = 'refunded',
}

type Transfer = {
  currency: BridgeCurrencyEnum;
  payment_rail: BridgePaymentRailEnum;
  external_account_id?: UUID;
  omad?: string;
  imad?: string;
};

type TransferSource = Transfer & {
  bank_beneficiary_name?: string | null;
  bank_routing_number?: string | null;
  bank_name?: string | null;
  description?: string | null;
  from_address?: string;
};

type TransferDestination = Transfer & {
  trace_number?: string;
  description?: string;
  wire_message?: string;
  sepa_reference?: string;
  swift_reference?: string;
  to_address: string;
  blockchain_memo?: string | null;
};

type SourceDepositInstructions = {
  payment_rail: BridgePaymentRailEnum;
  amount: string;
  currency: BridgeCurrencyEnum;
  from_address?: string;
  to_address?: string;
  deposit_message?: string;
  bank_name?: string;
  bank_address?: string;
  bank_routing_number?: string;
  bank_account_number?: string;
  bank_beneficiary_name?: string;
  iban?: string;
  bic?: string;
  account_holder_name?: string;
};

type Receipt = {
  initial_amount: string;
  developer_fee: string;
  exchange_fee: string;
  subtotal_amount: string;
  remaining_prefunded_balance?: string;
  gas_fee?: string;
  final_amount?: string;
  source_tx_hash?: string;
  destination_tx_hash?: string;
  exchange_rate?: string;
  url?: string;
};

type ReturnDetails = {
  reason?: string;
};

export type BridgeTransferGetStatusResponse = {
  id: UUID;
  client_reference_id?: string;
  amount: string;
  currency: BridgeCurrencyEnum.USD | BridgeCurrencyEnum.EUR;
  on_behalf_of: UUID;
  developer_fee: string;
  source: TransferSource;
  destination: TransferDestination;
  state: BridgeTransferStateEnum;
  source_deposit_instructions?: SourceDepositInstructions;
  receipt: Receipt;
  return_details?: ReturnDetails;
  created_at: string; // ISO 8601 date-time string
  updated_at: string; // ISO 8601 date-time string
};
