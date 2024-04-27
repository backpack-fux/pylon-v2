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
