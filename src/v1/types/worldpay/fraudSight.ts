import { ISO3166Alpha2Country, ISO4217Currency } from '../transaction';

export type WorldpayRiskAssessmentRequest = {
  transactionReference: string;
  merchant: { entity: string };
  instruction: {
    value: {
      amount: number;
      currency: ISO4217Currency;
    };
    paymentInstrument: {
      type: WorldpayRiskAssessmentInstrumentType;
      href: string;
    };
  };
  requestExemption?: boolean;
  doNotApplyExemption?: boolean;
  riskData: {
    account?: { shopperId?: string; email?: string; dateOfBirth?: string };
    transaction?: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
    };
    shipping?: {
      firstName?: string;
      lastName?: string;
      address?: {
        address1: string;
        address2?: string;
        address3?: string;
        postalCode: string;
        city: string;
        state?: string;
        countryCode: ISO3166Alpha2Country;
        phoneNumber?: string;
      };
    };
    custom?: {
      string1?: string;
      string2?: string;
      string3?: string;
      string4?: string;
      string5?: string;
      string6?: string;
      string7?: string;
      string8?: string;
      string9?: string;
      string10?: string;
      number1?: number;
      number2?: number;
      number3?: number;
      number4?: number;
      number5?: number;
      number6?: number;
      number7?: number;
      number8?: number;
      number9?: number;
      number10?: number;
    };
  };
  deviceData?: {
    collectionReference?: string;
    ipAddress?: string;
  };
};

export type WorldpayRiskAssessmentResponse = {
  outcome: WorldpayFraudOutcomeTypes;
  transactionReference: string;
  riskProfile: {
    href: string;
  };
  reason?: string[];
  score?: number;
  exemption?: {
    placement: string;
    type: string;
  };
};

export enum WorldpayRiskAssessmentInstrumentType {
  CARD_TOKENIZED = 'card/tokenized',
  CARD_FRONT = 'card/front',
}

export enum WorldpayFraudOutcomeTypes {
  LOW_RISK = 'lowRisk',
  HIGH_RISK = 'highRisk',
  REVIEW = 'review',
}
