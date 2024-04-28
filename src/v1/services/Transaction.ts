import { WorldpayService } from './external/Worldpay';
import { TransactionProcessor } from '../types/transaction';
import { WorldpayAuthorizePaymentResponse } from '../types/worldpay/payment';
import { blacklistedBins } from '@/helpers/constants';
import { utils } from '@/helpers/utils';

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
    verifiedTokenPayload?: any,
    authorizePaymentPayload?: any
  ): Promise<any> {
    switch (processor) {
      case TransactionProcessor.WORLDPAY:
        const { _embedded } =
          await this.worldpayService.createVerifiedToken(verifiedTokenPayload);
        console.log('1');
        if (blacklistedBins.includes(_embedded.token.paymentInstrument.bin)) {
          // TODO
        }
        const tokenUrl = _embedded.token.tokenPaymentInstrument.href;
        authorizePaymentPayload.instruction.paymentInstrument.tokenHref =
          tokenUrl;
        console.log('2:before');
        await this.worldpayService.authorizePayment(authorizePaymentPayload);
        console.log('2:after');
        return await this.worldpayService.deleteVerifiedToken(
          utils.extractTokenFromUrl(tokenUrl)
        );
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
