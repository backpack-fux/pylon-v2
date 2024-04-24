import { CreateApplicationForCompanySchema } from './../schemas/rain';
import { ERROR400, headers } from '@/helpers/constants';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Static } from '@sinclair/typebox';
import axios, { AxiosRequestConfig } from 'axios';
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

  private fetcher(url: string, options: AxiosRequestConfig = {}) {
    return axios(`${this.API_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        accept: 'application/json',
        'content-type': 'application/json',
        'Api-Key': this.API_KEY,
      },
    });
  }
  public async createApplicationForCompany(
    data: Static<(typeof CreateApplicationForCompanySchema)['body']>
  ) {
    try {
      const { data: applicationResponse } = await this.fetcher('/issuing/applications/company', {
        method: 'POST',
        data,
      });

      console.log("Application response");
      console.log(applicationResponse);

      return applicationResponse;
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new PrismaError(ERROR400.statusCode, error.message);
      } else {
        throw error;
      }
    }
  }
}
