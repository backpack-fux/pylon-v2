import { Config } from '@/config';
import { headers, methods } from '@/helpers/constants';
import { ERRORS } from '@/helpers/errors';
import {
  BridgeComplianceGetAllComplianceLinksResponse,
  BridgeComplianceGetAllCustomersResponse,
  BridgeComplianceType,
} from '@/v1/types/bridge/compliance';
import { BridgeErrorResponse } from '@/v1/types/bridge/error';
import { BridgeTransferGetStatusResponse } from '@/v1/types/bridge/transfer';
import {
  BridgeCurrencyTypeDst,
  BridgeCurrencyTypeSrc,
  BridgePaymentRailTypeDst,
  BridgePaymentRailTypeSrc,
  BridgePrefundedAccountBalance,
  BridgeUUID,
} from '@/v1/types/bridge/preFundedAccount';
import { Hex } from 'viem';
import { BridgeError } from '../Error';

export class BridgeService {
  private static instance: BridgeService;
  private baseUrl: string;
  private apiKey: string;

  private endpoints = {
    createTos: '/customers/tos_links',
    createCustomer: '/customers',
    createComplianceLinks: '/kyc_links',
    createPrefundedAccountTransfer: '/transfers',
    getPrefundedAccountBalance: '/prefunded_accounts',
    createKycUrl: (customerId: string, redirectUri: string) =>
      `/customers/${customerId}/id_verification_link?redirect_uri=${redirectUri}`,
    getCustomer: (customerId: string) => `/customers/${customerId}`,
    getKycLinks: (kycLinkId: string) => `/kyc_links/${kycLinkId}`,
    getTransferStatus: (transferId: BridgeUUID) => `/transfers/${transferId}`,
    getAllCustomers: (limit: number, startingAfter?: string) =>
      `/customers?limit=${limit}${
        startingAfter ? `&starting_after=${startingAfter}` : ''
      }`,
    getComplianceLinks: (limit: number, startingAfter?: string) =>
      `/kyc_links?limit=${limit}${
        startingAfter ? `&starting_after=${startingAfter}` : ''
      }`,
  };

  private constructor() {
    this.baseUrl = Config.bridge.apiUrl;
    this.apiKey = Config.bridge.apiKey;
  }

  private buildRequestHeaders(
    customHeaders: Record<string, string>
  ): Record<string, string> {
    return {
      ...headers,
      ...customHeaders,
    };
  }

  private mapBridgeErrorToHttpStatus(bridgeErrorCode: string): number {
    switch (bridgeErrorCode) {
      case 'not_found':
        return 404;
      case 'unauthorized':
        return 401;
      case 'forbidden':
        return 403;
      case 'bad_request':
        return 400;
      default:
        return 500;
    }
  }

  private isBridgeErrorResponse(data: any): data is BridgeErrorResponse {
    return (
      data && typeof data.code === 'string' && typeof data.message === 'string'
    );
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
      const res = await response.json();

      if (!response.ok) {
        console.error(res);
        throw new BridgeError(response.status, res.message, res.code);
      }

      if (this.isBridgeErrorResponse(res)) {
        const httpStatusCode = this.mapBridgeErrorToHttpStatus(res.code);
        throw new BridgeError(
          httpStatusCode,
          res.message,
          res.code,
          'BridgeAPIError'
        );
      }

      return response;
    } catch (error: any) {
      if (error instanceof BridgeError) {
        throw error;
      } else {
        throw new Error('SendRequest: Something went wrong ');
      }
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
    idempotencyKey: BridgeUUID,
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

  async getComplianceLinks(
    limit: number,
    startingAfter?: string
  ): Promise<BridgeComplianceGetAllComplianceLinksResponse> {
    const response = await this.sendRequest(
      this.endpoints.getComplianceLinks(limit, startingAfter),
      {
        method: methods.GET,
        headers,
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

  /** @docs https://apidocs.bridge.xyz/reference/get_prefunded-accounts */
  async createPrefundedAccountTransfer({
    idempotencyKey,
    amount,
    on_behalf_of,
    developer_fee,
    src_payment_rail,
    src_currency,
    prefunded_account_id,
    dst_payment_rail,
    dst_currency,
    dst_to_address,
  }: {
    idempotencyKey: BridgeUUID;
    amount: number | string;
    on_behalf_of: BridgeUUID;
    developer_fee: number | string | undefined;
    src_payment_rail: BridgePaymentRailTypeSrc;
    src_currency: BridgeCurrencyTypeSrc;
    prefunded_account_id: BridgeUUID;
    dst_payment_rail: BridgePaymentRailTypeDst;
    dst_currency: BridgeCurrencyTypeDst;
    dst_to_address: Hex;
  }) {
    const headers = this.buildRequestHeaders({
      'Idempotency-Key': idempotencyKey,
      accept: 'application/json',
    });

    const response = await this.sendRequest(
      this.endpoints.createPrefundedAccountTransfer,
      {
        method: methods.POST,
        headers: headers,
        body: JSON.stringify({
          amount: String(amount),
          on_behalf_of,
          developer_fee: String(developer_fee),
          source: {
            payment_rail: src_payment_rail,
            currency: src_currency,
            prefunded_account_id,
          },
          destination: {
            payment_rail: dst_payment_rail,
            currency: dst_currency,
            to_address: dst_to_address,
          },
        }),
      }
    );
    return await response.json();
  }

  async getPrefundedAccountBalance(): Promise<BridgePrefundedAccountBalance> {
    const headers = this.buildRequestHeaders({
      accept: 'application/json',
    });

    const response = await this.sendRequest(
      this.endpoints.getPrefundedAccountBalance,
      {
        method: methods.GET,
        headers: headers,
      }
    );

    return (await response.json()).data;
  }

  async getTransferStatus(
    transferId: BridgeUUID
  ): Promise<BridgeErrorResponse> {
    const response = await this.sendRequest(
      this.endpoints.getTransferStatus(transferId),
      {
        method: methods.GET,
        headers,
      }
    );
    return await response.json();
  }

  async getAllCustomers(
    limit: number,
    startingAfter?: string
  ): Promise<BridgeComplianceGetAllCustomersResponse> {
    const response = await this.sendRequest(
      this.endpoints.getAllCustomers(limit, startingAfter),
      {
        method: methods.GET,
        headers,
      }
    );

    return await response.json();
  }
}
