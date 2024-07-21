import { Config } from '@/config';
import { methods } from '@/helpers/constants';
import { ERRORS } from '@/helpers/errors';
import {
  WorldpayVerifiedTokenRequest,
  WorldpayVerifiedTokenResponse,
} from '@/v1/types/worldpay/verifiedToken';
import {
  WorldpayAuthorizePaymentRequest,
  WorldpayAuthorizePaymentResponse,
  WorldpayQueryPaymentStatusResponse,
} from '@/v1/types/worldpay/payment';
import { WorldpayErrorResponse } from '@/v1/types/worldpay/error';
import { WorldpayError } from '../Error';
import {
  WorldpayRiskAssessmentRequest,
  WorldpayRiskAssessmentResponse,
} from '@/v1/types/worldpay/fraudSight';

export class WorldpayService {
  private static instance: WorldpayService;
  private baseUrl: string;
  private username: string;
  private password: string;
  public entityRef: string;
  public accessCheckoutId: string;

  private endpoints = {
    cardOnFile: '/verifiedTokens/cardOnFile',
    authorizePayment: '/cardPayments/customerInitiatedTransactions',
    fetchCardBins: '/api/cardBin/panLookup',
    fraudAssessment: '/fraudsight/assessment',
    deleteToken: (verifiedToken: string) => `/tokens/${verifiedToken}`,
    paymentStatus: (linkData: string) => `/payments/events/${linkData}`,
  };

  // NB: WP API version control
  private headers = {
    payment: {
      'Content-Type': 'application/vnd.worldpay.payments-v7+json',
      Accept: 'application/vnd.worldpay.payments-v7+json',
    },
    verifiedToken: {
      'Content-Type': 'application/vnd.worldpay.verified-tokens-v3.hal+json',
      Accept: 'application/vnd.worldpay.verified-tokens-v3.hal+json',
    },
    token: {
      'Content-Type': 'application/vnd.worldpay.tokens-v3.hal+json',
      Accept: 'application/vnd.worldpay.tokens-v3.hal+json',
    },
    fraudSight: {
      'Content-Type': 'application/vnd.worldpay.fraudsight-v1.hal+json',
      Accept: 'application/vnd.worldpay.fraudsight-v1.hal+json',
    },
  };

  private constructor() {
    this.baseUrl = Config.worldpay.apiUrl;
    this.username = Config.worldpay.username;
    this.password = Config.worldpay.password;
    this.entityRef = Config.worldpay.entityRef;
    this.accessCheckoutId = Config.worldpay.accessCheckoutId;
  }

  public static getInstance(): WorldpayService {
    if (!WorldpayService.instance) {
      WorldpayService.instance = new WorldpayService();
    }
    return WorldpayService.instance;
  }

  private getCredentials(): string {
    const credentials = `${this.username}:${this.password}`;
    return 'Basic ' + Buffer.from(credentials).toString('base64');
  }

  private async sendRequest(
    url: string,
    options: RequestInit
  ): Promise<Response> {
    const { method, headers, body } = options;

    if (method === 'POST' && !body) {
      throw new Error(ERRORS.methods.missingPostBody);
    }

    if (method === 'GET' && body) {
      throw new Error(ERRORS.methods.extraGetBody);
    }

    const mergedOptions: RequestInit = {
      ...options,
      headers: {
        authorization: this.getCredentials(),
        ...headers,
      },
    };

    try {
      const response = await fetch(`${this.baseUrl}${url}`, mergedOptions);
      if (!response.ok && response.status !== 409) {
        const wpResponse = await response.json();

        throw new WorldpayError(
          response.status,
          wpResponse.message,
          wpResponse.errorName
        );
      }
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async createVerifiedToken(
    payload: WorldpayVerifiedTokenRequest
  ): Promise<WorldpayVerifiedTokenResponse> {
    try {
      const response = await this.sendRequest(this.endpoints.cardOnFile, {
        method: methods.POST,
        headers: this.headers.verifiedToken,
        body: JSON.stringify(payload),
      });

      const status = response.status;
      let responseData;

      try {
        responseData = await response.json();
      } catch (error) {
        return responseData as WorldpayVerifiedTokenResponse;
      }

      switch (status) {
        case 200:
          // The payload has been verified and a Token has been created.
          return responseData as WorldpayVerifiedTokenResponse;
        case 201:
          // The payload has been verified and a matching Token already exists.
          return responseData as WorldpayVerifiedTokenResponse;
        case 206:
          // TODO
          throw new WorldpayError(
            status,
            'The supplied payload could not be verified. An unverified token has been created/matched.'
          );
        case 409:
          // TODO
          throw new WorldpayError(
            status,
            'Conflicts with an existing token for cardOnFile transactions using a verified token or card session created by the access checkout SDK.'
          );
        default:
          // TODO
          responseData as WorldpayErrorResponse;
          throw new WorldpayError(
            status,
            responseData.message,
            responseData.errorName
          );
      }
    } catch (error) {
      throw error;
    }
  }

  async authorizePayment(
    payload: WorldpayAuthorizePaymentRequest
  ): Promise<WorldpayAuthorizePaymentResponse> {
    const response = await this.sendRequest(this.endpoints.authorizePayment, {
      method: methods.POST,
      headers: this.headers.payment,
      body: JSON.stringify(payload),
    });
    return await response.json();
  }

  /**
   * You might want to delete tokens if a customer has closed their account with you,
   * or if the customer no longer wants their card details kept on file.
   * @param verifiedToken the token to delete
   * @returns status 204 No Content
   */
  async deleteVerifiedToken(verifiedToken: string): Promise<any> {
    const response = await this.sendRequest(
      this.endpoints.deleteToken(verifiedToken),
      {
        method: methods.DELETE,
        headers: this.headers.token,
      }
    );

    if (response.status === 204) {
      return { message: 'success' };
    } else {
      throw Error;
    }
  }

  // NB: It can take up to 15 minutes for a payment event to update
  async queryPaymentStatus(
    linkData: string
  ): Promise<WorldpayQueryPaymentStatusResponse> {
    const response = await this.sendRequest(
      this.endpoints.paymentStatus(linkData),
      {
        method: methods.GET,
        headers: this.headers.payment,
      }
    );
    return await response.json();
  }

  async getRiskAssessment(
    payload: WorldpayRiskAssessmentRequest
  ): Promise<WorldpayRiskAssessmentResponse> {
    const response = await this.sendRequest(this.endpoints.fraudAssessment, {
      method: methods.POST,
      headers: this.headers.fraudSight,
      body: JSON.stringify(payload),
    });
    return await response.json();
  }

  // TODO: Updating a token with conflicts
}
