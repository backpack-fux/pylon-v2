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
import {
  WorldpayAuthorizePaymentRequest,
  WorldpayPaymentChannelType,
  WorldpayPaymentInstrumentType,
} from '../types/worldpay/payment';
import { Config } from '@/config';
import { utils } from '@/helpers/utils';
import { WorldpayVerifiedTokenRequest } from '../types/worldpay/verifiedToken';
import { WorldpayError } from '../services/Error';

const transactionService = TransactionService.getInstance();

export async function processTransaction(
  req: FastifyRequestTypebox<typeof TransactionProcessSchema>,
  rep: FastifyReplyTypebox<typeof TransactionProcessSchema>
): Promise<void> {
  try {
    const PP = req.query.paymentProcessor as TransactionProcessor;

    switch (PP) {
      case TransactionProcessor.WORLDPAY:
        try {
          const { sessionUrl, cvcUrl, order } = req.body;
          const { merchant, value, buyer } = order;
          const { fullName, billingAddress } = buyer;

          const transactionId = utils.generateUUID();
          const txRef = utils.generateTransactionReference(
            merchant.id,
            transactionId
          );

          const verifiedTokenPayload: WorldpayVerifiedTokenRequest = {
            description: utils.generateTokenDescription(PP),
            paymentInstrument: {
              type: WorldpayPaymentInstrumentType.CHECKOUT,
              cardHolderName: fullName,
              sessionHref: sessionUrl,
              billingAddress: billingAddress,
            },
            narrative: {
              line1: 'The Mind Palace Ltd', // TODO: DB operation req (basic details e.g. company name)
              line2: 'Memory265-13-08-1876', // TODO: DB operation req (e.g. order or phone id)
            },
            merchant: {
              entity: Config.worldpay.testnet.entityRef,
            },
            verificationCurrency: value.currency,
          };

          const authorizePaymentPayload: WorldpayAuthorizePaymentRequest = {
            transactionReference: txRef,
            merchant: {
              entity: Config.worldpay.testnet.entityRef,
            },
            instruction: {
              requestAutoSettlement: {
                enabled: true,
              },
              narrative: {
                line1: 'The Mind Palace Ltd',
              },
              value: {
                currency: value.currency,
                amount: value.amount,
              },
              paymentInstrument: {
                type: WorldpayPaymentInstrumentType.CHECKOUT,
                tokenHref: '',
                cvcHref: cvcUrl,
              },
            },
            channel: WorldpayPaymentChannelType.ECOM,
          };

          const PPDetails = {
            worldpayProcessorDetails: {
              authorizePaymentPayload,
              verifiedTokenPayload,
            },
          };

          const result = await transactionService.processTransaction(
            PP,
            PPDetails
          );

          return successResponse(rep, result);
        } catch (error) {
          if (error instanceof WorldpayError) {
            return errorResponse(
              req,
              rep,
              error.statusCode,
              JSON.stringify({
                message: error.message,
                errorName: error.errorName,
              })
            );
          } else {
            throw error;
          }
        }
    }
  } catch (error) {
    console.error(error);
    const errorMessage = 'An error occurred processing the transaction';
    return errorResponse(req, rep, ERROR404.statusCode, errorMessage);
  }
}
