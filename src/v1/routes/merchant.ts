import { FastifyInstance } from 'fastify';
import { methods } from '@/helpers/constants';
import {
  createMerchantHandler,
  getTransferStatusHandler,
} from '../handlers/merchant';
import {
  MerchantCreateSchema,
  TransferStatusSchema,
} from '../schemas/merchant';
import { validateAPIKey } from '../middleware/auth';
import {
  validateMerchantDetails,
  validateMerchantAPIKey,
} from '../middleware/merchant';

const Merchant = async (app: FastifyInstance) => {
  /**
   * @description create a new merchant
   * @returns KYB links from our compliance partner e.g. bridge
   */
  app
    .route({
      method: methods.POST,
      url: '/create',
      schema: MerchantCreateSchema,
      preHandler: [validateAPIKey, validateMerchantDetails],
      handler: createMerchantHandler,
    })

    /**
     * @description get transfer status of on-ramp event
     * @returns transfer status
     */
    .route({
      method: methods.GET,
      url: '/transfer/:transferId',
      schema: TransferStatusSchema,
      preHandler: [validateMerchantAPIKey],
      handler: getTransferStatusHandler,
    });
};

export default Merchant;
