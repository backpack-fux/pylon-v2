import { FastifyInstance } from 'fastify';
import { methods } from '@/helpers/constants';
import {
  CheckCompanyApplicationStatusSchema,
  CreateApplicationForCompanySchema,
  ReapplyForCompanySchema,
} from '../schemas/rain';
import {
  checkCompanyApplicationStatusSchema,
  createApplicationForCompany,
  reapplyForCompany,
} from '../handlers/rain';
import { authenticate } from '../middleware';

const Rain = async (app: FastifyInstance) => {
  app
    /**
     * @description Create an application for a company
     * @param CreateApplicationForCompanySchema
     */
    .route({
      method: methods.POST,
      url: '/application/company',
      schema: CreateApplicationForCompanySchema,
      preHandler: [authenticate],
      handler: createApplicationForCompany,
    })
    /**
     * @description Check the status of a company application
     * @param CheckCompanyApplicationStatusSchema
     */
    .route({
      method: methods.GET,
      url: '/application/company/status/:companyId',
      schema: CheckCompanyApplicationStatusSchema,
      preHandler: [authenticate],
      handler: checkCompanyApplicationStatusSchema,
    })
    /**
     * @description Reapply for a company, with information that was requested
     * @param CreateApplicationForCompanySchema
    
    */
    .route({
      method: methods.PUT,
      url: '/application/company/reapply/:companyId',
      schema: ReapplyForCompanySchema,
      preHandler: [authenticate],
      handler: reapplyForCompany,
    });

  /**
   * @TODO Add route to upload documents
   */
};

export default Rain;
