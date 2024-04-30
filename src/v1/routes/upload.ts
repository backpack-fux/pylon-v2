import { FastifyInstance } from 'fastify';
import { methods } from '@/helpers/constants';
import { UploadApplicationDocumentSchema } from '../schemas/rain';
import { uploadCompanyApplicationDocs } from '../handlers/rain';

const Uploads = async (app: FastifyInstance) => {
  app.route({
    method: methods.PUT,
    url: '/rain/application/company/:id',
    schema: UploadApplicationDocumentSchema,
    handler: uploadCompanyApplicationDocs,
  });
};

export default Uploads;
