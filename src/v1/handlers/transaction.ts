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
import {
  WorldpayRiskAssessmentInstrumentType,
  WorldpayRiskAssessmentRequest,
} from '../types/worldpay/fraudSight';

const transactionService = TransactionService.getInstance();

function createVerifiedTokenPayload(
  req: FastifyRequestTypebox<typeof TransactionProcessSchema>,
  PP: TransactionProcessor
): WorldpayVerifiedTokenRequest {
  const { sessionUrl, order } = req.body;
  const { merchant, value, buyer } = order;
  const { billingAddress } = buyer;
  const { firstName, lastName, ...addressDetails } = billingAddress;

  return {
    description: utils.generateTokenDescription(PP),
    paymentInstrument: {
      type: WorldpayPaymentInstrumentType.CHECKOUT,
      cardHolderName: utils.getFullName(firstName, lastName),
      sessionHref: sessionUrl,
      billingAddress: addressDetails,
    },
    narrative: {
      line1: 'The Mind Palace Ltd',
      line2: 'Memory265-13-08-1876',
    },
    merchant: {
      entity: Config.worldpay.testnet.entityRef,
    },
    verificationCurrency: value.currency,
  };
}

function createAuthorizePaymentPayload(
  req: FastifyRequestTypebox<typeof TransactionProcessSchema>,
  txRef: string
): WorldpayAuthorizePaymentRequest {
  const { cvcUrl, order } = req.body;
  const { value } = order;

  return {
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
}

function createFraudSightPayload(
  req: FastifyRequestTypebox<typeof TransactionProcessSchema>,
  txRef: string
): WorldpayRiskAssessmentRequest {
  const { order } = req.body;
  const { value, buyer } = order;
  const { billingAddress, shippingAddress, isShippingEqualBilling } = buyer;
  const { firstName, lastName, ...addressDetails } = billingAddress;

  return {
    transactionReference: txRef,
    merchant: {
      entity: Config.worldpay.testnet.entityRef,
    },
    instruction: {
      value: {
        amount: value.amount,
        currency: value.currency,
      },
      paymentInstrument: {
        type: WorldpayRiskAssessmentInstrumentType.CARD_TOKENIZED,
        href: '', // NB: this will be set in the authorize payment response
      },
    },
    requestExemption: true,
    doNotApplyExemption: false,
    riskData: {
      transaction: {
        firstName: firstName,
        lastName: lastName,
      },
      shipping: {
        firstName: firstName,
        lastName: lastName,
        // TODO: remove firstName and lastName from shippingAddress
        address: isShippingEqualBilling ? addressDetails : shippingAddress,
      },
    },
    deviceData: {
      ipAddress:
        typeof req.headers['x-forwarded-for'] === 'string'
          ? req.headers['x-forwarded-for']
          : req.headers['x-forwarded-for']?.[0] || req.ip,
    },
  };
}

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
          const { billingAddress, shippingAddress, isShippingEqualBilling } =
            buyer;
          const { firstName, lastName, ...addressDetails } = billingAddress;

          const transactionId = utils.generateUUID();
          const txRef = utils.generateTransactionReference(
            merchant.id,
            transactionId
          );

          const verifiedTokenPayload = createVerifiedTokenPayload(req, PP);
          const authorizePaymentPayload = createAuthorizePaymentPayload(
            req,
            txRef
          );
          const fraudSightPayload = createFraudSightPayload(req, txRef);

          const PPDetails = {
            authorizePaymentPayload,
            verifiedTokenPayload,
            fraudSightPayload,
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
    let errorMessage = 'An error occurred processing the transaction';
    if (error instanceof WorldpayError) {
      errorMessage = error.message || errorMessage;
      return errorResponse(
        req,
        rep,
        error.statusCode || ERROR404.statusCode,
        errorMessage
      );
    } else if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    }
    return errorResponse(req, rep, ERROR404.statusCode, errorMessage);
  }
}
