import { Config } from '@/config';
import { headers, methods } from '@/helpers/api';
import { ERRORS } from '@/helpers/errors';
import { UUID } from 'crypto';
import { BridgeComplianceType } from '../../types/bridge';

export class BridgeService {
  private static instance: BridgeService;
  private baseUrl: string;
  private apiKey: string;

  private endpoints = {
    createTos: '/customers/tos_links',
    createCustomer: '/customers',
    createComplianceLinks: '/kyc_links',
    createKycUrl: (customerId: string, redirectUri: string) =>
      `/customers/${customerId}/id_verification_link?redirect_uri=${redirectUri}`,
    getCustomer: (customerId: string) => `/customers/${customerId}`,
    getKycLinks: (kycLinkId: string) => `/kyc_links/${kycLinkId}`,
  };

  private constructor() {
    this.baseUrl = Config.bridgeApiURI;
    this.apiKey = Config.bridgeApiKey;
  }

  /** @dev avoid multiple instances; allow one global, reusable instance */
  public static getInstance(): BridgeService {
    if (!BridgeService.instance) {
      BridgeService.instance = new BridgeService();
    }
    return BridgeService.instance;
  }

  /** @dev build the request */
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
        ...headers,
        'Api-Key': this.apiKey,
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

  async createTermsOfServiceUrl(uuid: string): Promise<string> {
    const response = await this.sendRequest(this.endpoints.createTos, {
      method: methods.POST,
      headers,
    });
    const data = await response.json();
    return data.url;
  }

  /** @docs https://apidocs.bridge.xyz/reference/get_customers-customerid */
  async createCustomer(data: any, uuid: string) {
    const response = await this.sendRequest(this.endpoints.createCustomer, {
      method: methods.POST,
      headers,
      body: JSON.stringify(data),
    });
    return await response.json();
  }

  async createKycUrl(customerId: string, redirectUri: string): Promise<string> {
    const response = await this.sendRequest(
      this.endpoints.createKycUrl(customerId, redirectUri),
      {
        method: methods.GET,
        headers,
      }
    );
    const data = await response.json();
    return data.url;
  }

  async getCustomer(customerId: string): Promise<any> {
    const response = await this.sendRequest(
      this.endpoints.getCustomer(customerId),
      {
        method: methods.GET,
        headers,
      }
    );
    return await response.json();
  }

  /** @docs https://apidocs.bridge.xyz/docs/kyc-links  */
  async createComplianceLinks(
    idempotencyKey: UUID,
    fullName: string,
    type: BridgeComplianceType,
    email: string
  ) {
    const headers = this.buildRequestHeaders({
      'Idempotency-Key': idempotencyKey,
    });

    const response = await this.sendRequest(
      this.endpoints.createComplianceLinks,
      {
        method: methods.POST,
        headers: headers,
        body: JSON.stringify({
          full_name: fullName,
          email,
          type,
        }),
      }
    );
    return await response.json();
  }

  async getKycLinks(kycLinkId: string): Promise<any> {
    const response = await this.sendRequest(
      this.endpoints.getKycLinks(kycLinkId),
      {
        method: methods.GET,
        headers,
      }
    );
    return await response.json();
  }

  private buildRequestHeaders(
    customHeaders: Record<string, string>
  ): Record<string, string> {
    return {
      ...headers,
      ...customHeaders,
    };
  }
}
