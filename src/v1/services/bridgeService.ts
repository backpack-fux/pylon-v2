import { Config } from '@/config';
import { headers, methods } from '@/helpers/api';
import { ERRORS } from '@/helpers/errors';

export class BridgeService {
  private baseUrl: string;
  private apiKey: string;

  private endpoints = {
    createTos: '/customers/tos_links',
    createCustomer: '/customers',
    createKycLink: '/kyc_links',
    createKycUrl: (customerId: string, redirectUri: string) =>
      `/customers/${customerId}/id_verification_link?redirect_uri=${redirectUri}`,
    getCustomer: (customerId: string) => `/customers/${customerId}`,
    getKycLink: (kycLinkId: string) => `/kyc_links/${kycLinkId}`,
  };

  constructor() {
    this.baseUrl = Config.bridgeApiURI;
    this.apiKey = Config.bridgeApiKey;
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

  async createKycLink({
    idempotencyKey,
    name,
    type,
    email,
  }: {
    idempotencyKey: string;
    name: string;
    type: 'individual' | 'business';
    email: string;
  }) {
    const response = await this.sendRequest(this.endpoints.createKycLink, {
      method: methods.POST,
      headers,
      body: JSON.stringify({
        full_name: name,
        email,
        type,
      }),
    });
    return await response.json();
  }

  async getKycLink(kycLinkId: string): Promise<any> {
    const response = await this.sendRequest(
      this.endpoints.getKycLink(kycLinkId),
      {
        method: methods.GET,
        headers,
      }
    );
    return await response.json();
  }
}
