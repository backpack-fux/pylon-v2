import { Config } from '@/config';
import { headers, methods } from '@/helpers/constants';
import { ERRORS } from '@/helpers/errors';
import {
  WorldpayVerifiedTokenRequest,
  WorldpayVerifiedTokenResponse,
} from '@/v1/types/worldpay/verifiedToken';
import {
  WorldpayAuthorizePaymentRequest,
  WorldpayAuthorizePaymentResponse,
} from '@/v1/types/worldpay/authorizePayment';

const worldpayHeaders = {
  payments: {
    'Content-Type': 'application/vnd.worldpay.payments-v7+json',
    Accept: 'application/vnd.worldpay.payments-v7+json',
  },
  verifiedToken: {
    'Content-Type': 'application/vnd.worldpay.verified-tokens-v3.hal+json',
  },
};

export class WorldpayService {
  private static instance: WorldpayService;
  private baseUrl: string;
  private entityRef: string;
  private username: string;
  private password: string;
  private accessCheckoutId: string;

  private endpoints = {
    cardOnFile: '/verifiedTokens/cardOnFile',
    authorizePayment: '/cardPayments/customerInitiatedTransactions',
    fetchCardBins: '/api/cardBin/panLookup',
    deleteToken: (verifiedToken: string) => `/tokens/${verifiedToken}`,
  };

  private constructor() {
    this.baseUrl = Config.isLocal ? Config.worldpay.testnet.apiUrl : 'TODO';
    this.username = Config.isLocal ? Config.worldpay.testnet.username : 'TODO';
    this.password = Config.isLocal ? Config.worldpay.testnet.password : 'TODO';
    this.entityRef = Config.isLocal
      ? Config.worldpay.testnet.entityRef
      : 'TODO';
    this.accessCheckoutId = Config.isLocal
      ? Config.worldpay.testnet.accessCheckoutId
      : 'TODO';
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
      if (!response.ok) {
        throw new Error(ERRORS.http.error(response.status));
      }
      return response;
    } catch (error: any) {
      throw new Error(ERRORS.fetch.error(error.message));
    }
  }

  async createVerifiedToken(
    body: WorldpayVerifiedTokenRequest
  ): Promise<WorldpayVerifiedTokenResponse> {
    const response = await this.sendRequest(this.endpoints.cardOnFile, {
      method: methods.POST,
      headers: worldpayHeaders.verifiedToken,
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data.url;
  }

  async authorizePayment(
    body: WorldpayAuthorizePaymentRequest
  ): Promise<WorldpayAuthorizePaymentResponse> {
    const response = await this.sendRequest(this.endpoints.authorizePayment, {
      method: methods.POST,
      headers: worldpayHeaders.payments,
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data.url;
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
        headers,
      }
    );
    return await response.json();
  }

  // TODO: Updating a token with conflicts
  // TODO: Fetch card BINs
}
