/** @docs https://developer.worldpay.com/products/access/verified-tokens/openapi/#other/cardonfile */
// TODO: validate schema with Typebox

import { WorldpayPaymentInstrumentType } from './payment';

export type WorldpayVerifiedTokenRequest = {
  description: string;
  verificationCurrency: string;
  paymentInstrument: {
    type: WorldpayPaymentInstrumentType;
    cardHolderName: string;
    sessionHref: string;
    billingAddress: {
      address1: string;
      address2?: string;
      address3?: string;
      postalCode: string;
      city: string;
      state?: string;
      countryCode: string; // 2 char
    };
  };
  merchant: {
    entity: string;
  };
  narrative: {
    line1: string;
    line2?: string;
  };
  namespace?: string;
  tokenExpiryDateTime?: string;
};

export type WorldpayVerifiedTokenResponse = {
  _embedded: {
    token: {
      tokenId?: string;
      description: string;
      tokenExpiryDateTime: string;
      namespace?: string;
      schemeTransactionReference?: string;
      tokenPaymentInstrument: {
        type: string;
        href: string;
      };
      paymentInstrument: {
        type?: string;
        cardNumber: string;
        cardHolderName: string;
        cardExpiryDate: {
          month: number;
          year: number;
        };
        billingAddress: {
          address1: string;
          address2?: string;
          address3?: string;
          postalCode: string;
          city: string;
          state?: string;
          countryCode: string;
        };
        bin: string;
        brand: string;
      };
      _links: {
        [key: string]: {
          href: string;
        };
      };
    };
    verification: {
      outcome: string;
      schemeTransactionReference: string;
      checkedAt: string;
      riskFactors: {
        risk: string;
        type: string;
        detail?: string;
      }[];
      paymentInstrument: {
        type: string;
        card: {
          brand: string;
          fundingType: string;
          issuer: {
            name: string;
          };
        };
      };
      _links: {
        [key: string]: {
          href: string;
        };
      };
    };
  };
};
