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

  async processTransaction(
    processor: TransactionProcessor,
    processorDetails: TransactionProcessProcessorDetails
  ): Promise<WorldpayAuthorizePaymentResponse | Error | WorldpayError> {
    switch (processor) {
      case TransactionProcessor.WORLDPAY:
        try {
          const { verifiedTokenPayload, authorizePaymentPayload } =
            processorDetails.worldpayProcessorDetails;
          const { _embedded } = await this.worldpayService.createVerifiedToken(
            verifiedTokenPayload!
          );
          if (blacklistedBins.includes(_embedded.token.paymentInstrument.bin)) {
            // TODO
          }
          const tokenUrl = _embedded.token.tokenPaymentInstrument.href;
          authorizePaymentPayload!.instruction.paymentInstrument.tokenHref =
            tokenUrl;
          await this.worldpayService.authorizePayment(authorizePaymentPayload!);
          return await this.worldpayService.deleteVerifiedToken(
            utils.extractTokenFromUrl(tokenUrl)
          );
        } catch (error) {
          throw error;
        }
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
