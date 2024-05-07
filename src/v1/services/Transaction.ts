import { WorldpayService } from './external/Worldpay';
import {
  TransactionProcessProcessorDetails,
  TransactionProcessor,
} from '../types/transaction';
import {
  WorldpayAuthorizePaymentRequest,
  WorldpayAuthorizePaymentResponse,
} from '../types/worldpay/payment';
import { blacklistedBins } from '@/helpers/constants';
import { utils } from '@/helpers/utils';
import { WorldpayError } from './Error';
import { WorldpayVerifiedTokenRequest } from '../types/worldpay/verifiedToken';
import {
  WorldpayFraudOutcomeTypes,
  WorldpayRiskAssessmentRequest,
} from '../types/worldpay/fraudSight';

export class TransactionService {
  private static instance: TransactionService;
  private worldpayService: WorldpayService;

  constructor() {
    this.worldpayService = WorldpayService.getInstance();
    // Add more PP services here
  }

  public static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }

  private async handleWorldpayTransaction(
    details: TransactionProcessProcessorDetails
  ): Promise<WorldpayAuthorizePaymentResponse | Error | WorldpayError> {
    try {
      const {
        verifiedTokenPayload,
        authorizePaymentPayload,
        fraudSightPayload,
      } = details;
      const { _embedded } =
        await this.worldpayService.createVerifiedToken(verifiedTokenPayload);
      const bin = _embedded.token.paymentInstrument.bin;

      if (blacklistedBins.includes(bin)) {
        throw new Error(`BIN ${bin} is blacklisted.`);
      }

      const tokenUrl = _embedded.token.tokenPaymentInstrument.href;
      this.updatePaymentPayloads(
        authorizePaymentPayload,
        fraudSightPayload,
        tokenUrl
      );

      authorizePaymentPayload.instruction.paymentInstrument.tokenHref =
        tokenUrl;
      fraudSightPayload.instruction.paymentInstrument.href = tokenUrl;
      console.log(fraudSightPayload);

      const riskAssessment =
        await this.worldpayService.getRiskAssessment(fraudSightPayload);
      if (riskAssessment.outcome === WorldpayFraudOutcomeTypes.HIGH_RISK) {
        throw new Error('Transaction is high risk.');
      }

      // TODO: Link the FraudSight assessment
      await this.worldpayService.authorizePayment(authorizePaymentPayload!);
      return await this.worldpayService.deleteVerifiedToken(
        utils.extractTokenFromUrl(tokenUrl)
      );
    } catch (error) {
      throw error;
    }
  }

  private updatePaymentPayloads(
    authorizePayload: WorldpayAuthorizePaymentRequest,
    fraudPayload: WorldpayRiskAssessmentRequest,
    tokenUrl: string
  ) {
    authorizePayload.instruction.paymentInstrument.tokenHref = tokenUrl;
    fraudPayload.instruction.paymentInstrument.href = tokenUrl;
  }

  async processTransaction(
    processor: TransactionProcessor,
    worldpayProcessorDetails: TransactionProcessProcessorDetails
  ): Promise<WorldpayAuthorizePaymentResponse | Error | WorldpayError> {
    switch (processor) {
      case TransactionProcessor.WORLDPAY:
        return this.handleWorldpayTransaction(worldpayProcessorDetails);
      // Add more here
      default:
        throw new Error('Invalid payment processor');
    }
  }

  // TODO
  async refundTransaction(
    processor: TransactionProcessor,
    paymentId: string,
    amount: number
  ): Promise<any> {
    switch (processor) {
      case TransactionProcessor.WORLDPAY:
      // TODO
      default:
        throw new Error('Invalid payment processor');
    }
  }
}
