import { errorResponse, successResponse } from '@/responses';
import { FastifyRequestTypebox, FastifyReplyTypebox } from '../types/fastify';
import { ERROR404 } from '@/helpers/constants';
import { TransactionProcessSchema } from '../schemas/transaction';
import { TransactionService } from '../services/Transaction';
import {
  ISO3166Alpha2Country,
  ISO4217Currency,
  TransactionProcessor,
} from '../types/transaction';
import { WorldpayPaymentInstrumentType } from '../types/worldpay/payment';
import { Config } from '@/config';
import { utils } from '@/helpers/utils';

const transactionService = TransactionService.getInstance();

export async function processTransaction(
  req: FastifyRequestTypebox<typeof TransactionProcessSchema>,
  rep: FastifyReplyTypebox<typeof TransactionProcessSchema>
): Promise<void> {
  try {
    const PP = req.query.paymentProcessor as TransactionProcessor;
    let bodyContent = {};

    switch (PP) {
      case TransactionProcessor.WORLDPAY:
        const { sessionUrl, buyer } = req.body;
        const { fullName, billingAddress } = buyer;
        bodyContent = {
          description: utils.generateTokenDescription(PP),
          paymentInstrument: {
            type: WorldpayPaymentInstrumentType.CHECKOUT,
            cardHolderName: fullName,
            sessionHref: sessionUrl,
            billingAddress: {
              address1: billingAddress.address1,
              address2: billingAddress.address2,
              address3: billingAddress.address3,
              postalCode: billingAddress.postalCode,
              city: billingAddress.city,
              state: billingAddress.state,
              countryCode: billingAddress.countryCode,
            },
          },
          narrative: {
            line1: 'The Mind Palace Ltd', // TODO: DB operation req (basic details e.g. company name)
            line2: 'Memory265-13-08-1876', // TODO: DB operation req (e.g. order or phone id )
          },
          merchant: {
            entity: Config.worldpay.testnet.entityRef,
          },
          verificationCurrency: ISO4217Currency.USD,
        };
        break;
    }

    const res = await transactionService.processTransaction(PP, bodyContent);
    successResponse(rep, res);
  } catch (error) {
    console.error(error);
    const errorMessage = 'An error occurred processing the transaction';
    return errorResponse(req, rep, ERROR404.statusCode, errorMessage);
  }
}
