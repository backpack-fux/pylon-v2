import { FastifyInstance } from 'fastify';
import { methods } from '@/helpers/constants';
import { CreateApplicationForCompanySchema } from '../schemas/rain';
import { createApplicationForCompany } from '../handlers/rain';

const Rain = async (app: FastifyInstance) => {
  app.route({
    method: methods.POST,
    url: '/application/company',
    schema: CreateApplicationForCompanySchema,
    handler: createApplicationForCompany,
  });
};

export default Rain;
