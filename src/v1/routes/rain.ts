import { FastifyInstance } from 'fastify';
import { methods } from '@/helpers/constants';
import { CheckCompanyApplicationStatusSchema, CreateApplicationForCompanySchema } from '../schemas/rain';
import { checkCompanyApplicationStatusSchema, createApplicationForCompany } from '../handlers/rain';

const Rain = async (app: FastifyInstance) => {
  app.route({
    method: methods.POST,
    url: '/application/company',
    schema: CreateApplicationForCompanySchema,
    handler: createApplicationForCompany,
  }).route({
    method: methods.GET,
    url: '/application/company/status/:companyId',
    schema: CheckCompanyApplicationStatusSchema,
    handler: checkCompanyApplicationStatusSchema,
  });
};

export default Rain;
