import { Config } from '@/config';
import { ERRORS } from '@/helpers/errors';

export class WorldpayService {
  private static instance: WorldpayService;
  private baseUrl: string;
  private entityRef: string;
  private username: string;
  private password: string;
  private accessCheckoutId: string;

  private endpoints = {
    cardOnFile: 'verifiedTokens/cardOnFile',
  };

  private constructor() {
    this.baseUrl = Config.worldpay.baseUrl;
    this.entityRef = Config.worldpay.entityRef;
    this.username = Config.worldpay.username;
    this.password = Config.worldpay.password;
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
    return Buffer.from(credentials).toString('base64');
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
}
