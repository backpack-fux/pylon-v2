import { WorldpayService } from './external/Worldpay';
import { TransactionProcessor } from '../types/transaction';
import { WorldpayAuthorizePaymentResponse } from '../types/worldpay/payment';

export class TransactionService {
  private static instance: TransactionService;
  private worldpayService: WorldpayService;

  constructor() {
    this.worldpayService = WorldpayService.getInstance();
    // Add more here
  }

  public static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }

  async processTransaction(
    processor: TransactionProcessor,
    paymentDetails: any
  ): Promise<WorldpayAuthorizePaymentResponse> {
    switch (processor) {
      case TransactionProcessor.WORLDPAY:
        return await this.worldpayService.authorizePayment(paymentDetails);
      // Add more here
      default:
        throw new Error('Invalid payment processor');
    }
  }

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
