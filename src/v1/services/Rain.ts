import { CreateApplicationForCompanySchema } from './../schemas/rain';
import { ERROR400 } from '@/helpers/constants';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Static } from '@sinclair/typebox';
import { PrismaError } from './Error';
import { Config } from '@/config';

export class RainService {
  private static instance: RainService;

  public static getInstance(): RainService {
    if (!RainService.instance) {
      RainService.instance = new RainService();
    }
    return RainService.instance;
  }

  private API_URL = Config.rainApiUrl;
  private API_KEY = Config.rainApiKey;

  private async fetcher(
    url: string,
    options: Omit<RequestInit, 'body'> & {
      body?: any;
    }
  ) {
    const res = await fetch(`${this.API_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        accept: 'application/json',
        'content-type': 'application/json',
        'Api-Key': this.API_KEY,
      },
      body: JSON.stringify(options.body),
    });

    return await res.json();
  }
  public async createApplicationForCompany(
    data: Static<(typeof CreateApplicationForCompanySchema)['body']>
  ) {
    try {
      const res = await this.fetcher('/issuing/applications/company', {
        method: 'POST',
        body: data,
      });
      return res;
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new PrismaError(ERROR400.statusCode, error.message);
      } else {
        throw error;
      }
    }
  }

  public async getStatusOfCompanyApplication(companyId: string) {
    try {
      const res = await this.fetcher(
        `/issuing/applications/company/${companyId}`,
        {
          method: 'GET',
        }
      );

      return res;
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new PrismaError(ERROR400.statusCode, error.message);
      } else {
        throw error;
      }
    }
  }
}
