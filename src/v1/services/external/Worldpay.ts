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
import { WorldpayError } from '../Error';

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
    payload: WorldpayVerifiedTokenRequest
  ): Promise<WorldpayVerifiedTokenResponse> {
    console.log('go in here', payload);
    const response = await this.sendRequest(this.endpoints.cardOnFile, {
      method: methods.POST,
      headers: this.headers.verifiedToken,
      body: JSON.stringify(payload),
    });

    const status = response.status;
    let responseData: WorldpayVerifiedTokenResponse;

    try {
      responseData = await response.json();
    } catch (error) {
      throw new WorldpayError(status, 'Failed to parse response JSON');
    }

    console.log('go in here again');
    switch (status) {
      case 200:
        // The payload has been verified and a Token has been created.
        return responseData;
      case 201:
        // The payload has been verified and a matching Token already exists.
        // data = (await response.json()) as WorldpayVerifiedTokenResponse;
        return responseData;
      case 206:
        // TODO
        console.log(responseData);
        throw new WorldpayError(
          status,
          'The supplied payload could not be verified. An unverified token has been created/matched.'
        );
      case 409:
        // TODO
        console.log(responseData);
        throw new WorldpayError(
          status,
          'Conflicts with an existing token for cardOnFile transactions using a verified token or card session created by the access checkout SDK.'
        );
      default:
        // TODO
        throw new WorldpayError(status, 'Unexpected status code');
    }
  }

  async authorizePayment(
    payload: WorldpayAuthorizePaymentRequest
  ): Promise<WorldpayAuthorizePaymentResponse> {
    console.log('payload', payload);
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

  // TODO: Updating a token with conflicts
}
