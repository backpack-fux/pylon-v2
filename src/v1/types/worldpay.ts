export type WorldpayVerifiedTokenRequest = {
  description: 'card/plain' | 'card/checkout';
  paymentInstrument: {
    type: string;
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
  narrative: {
    line1: string;
    line2: string;
  };
  merchant: {
    entity: string;
  };
  verificationCurrency: string;
};

export type WorldpayVerifiedTokenResponse = {
  _embedded: {
    token: {
      tokenId: string;
      description: string;
      tokenExpiryDateTime: string;
      namespace: string;
      schemeTransactionReference: string;
      tokenPaymentInstrument: {
        type: string;
        href: string;
      };
      paymentInstrument: {
        type: string;
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

export type WorldpayAuthorizePaymentRequest = {
  transactionReference: string;
  merchant: {
    entity: string;
  };
  instruction: {
    narrative: {
      line1: string;
    };
    value: {
      currency: string;
      amount: number;
    };
    paymentInstrument: {
      type: string;
      href: string;
    };
  };
};

export type WorldpayAuthorizePaymentResponse = {
  outcome: string;
  riskFactors: {
    type: string;
    risk: string;
    detail?: string;
  }[];
  issuer: {
    authorizationCode: string;
  };
  scheme: {
    reference: string;
  };
  paymentInstrument: {
    type: string;
    card: {
      number: {
        bin: string;
        last4Digits: string;
      };
      category: string;
      brand: string;
      fundingType: string;
      issuer: {
        name: string;
      };
      paymentAccountReference: string;
    };
  };
  _links: {
    [key: string]: {
      href: string;
    };
  };
};
