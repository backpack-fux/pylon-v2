import { FastifyInstance } from 'fastify/types/instance';
import { buildFastify } from '../utils';
import { Config } from '@/config';
import { utils } from '@/helpers/utils';

var sharedKYCLink = 'https://bridge.withpersona.com/';
var sharedTOSLink = 'https://dashboard.bridge.xyz/accept-terms-of-service/';
const randomUuid = utils.generateUUID();

jest.mock('@/v1/services/Merchant', () => {
  return {
    MerchantService: {
      getInstance: jest.fn().mockReturnValue({
        createPartner: jest
          .fn()
          .mockImplementation(async (partnerData, merchantId: 1) => {
            return Promise.resolve({
              id: merchantId,
              name: partnerData.name,
              surname: partnerData.surname,
              email: partnerData.email,
              phoneNumber: partnerData.phoneNumber,
              walletAddress: partnerData.walletAddress,
              registeredAddress: partnerData.registeredAddress,
            });
          }),
        registerCompliancePartner: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            kyc_link: sharedKYCLink,
            tos_link: sharedTOSLink,
            complianceUuid: randomUuid,
          });
        }),
      }),
    },
  };
});

jest.mock('@/v1/services/Compliance', () => {
  return {
    ComplianceService: {
      getInstance: jest.fn().mockReturnValue({
        insertMerchant: jest
          .fn()
          .mockImplementation(async (_, registerCompliancePartner, __) => {
            return Promise.resolve({
              id: registerCompliancePartner.complianceUuid,
              kyc_link: registerCompliancePartner.kyc_link,
              tos_link: registerCompliancePartner.tos_link,
            });
          }),
      }),
    },
  };
});

describe('Merchant Creation API Tests', () => {
  let app: FastifyInstance;

  beforeAll(() => {
    app = buildFastify();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a merchant successfully', async () => {
    const payload = {
      name: 'Jeff',
      surname: 'Winger',
      email: 'youruser@gmail.com',
      phoneNumber: '(558)555-5555',
      walletAddress: '0x0000000000000000000000000000000000000003',
      registeredAddress: {
        street1: '123 Main Street',
        city: 'New York',
        postcode: '11111',
        country: 'US',
      },
    };

    const response = await app.inject({
      method: 'POST',
      url: '/v1/merchant/create',
      headers: {
        Authorization: `Bearer ${Config.serverApiKey}`,
      },
      payload: payload,
    });

    expect(response.statusCode).toBe(200);
    expect(await response.json().data).toEqual({
      id: randomUuid,
      kyc_link: sharedKYCLink,
      tos_link: sharedTOSLink,
    });
  });

  // TODO
  it('should throw an error if the merchant already exists', async () => {
    const payload = {
      name: 'Jeff',
      surname: 'Winger',
      email: 'youruser@gmail.com',
      phoneNumber: '(558)555-5555',
      walletAddress: '0x0000000000000000000000000000000000000003',
      registeredAddress: {
        street1: '123 Main Street',
        city: 'New York',
        postcode: '11111',
        country: 'US',
      },
    };

    const response = await app.inject({
      method: 'POST',
      url: '/v1/merchant/create',
      headers: {
        Authorization: `Bearer ${Config.serverApiKey}`,
      },
      payload: payload,
    });

    expect(response.statusCode).toBe(400);
    expect(await response.json().data).toEqual({
      message: 'Merchant with this email already exists.',
    });
  });

  // TODO: throw an error when phone number is incorrect
  // TODO: throw an error when wallet address is incorrect
  // TODO: throw an error when registered address is incorrect
});
