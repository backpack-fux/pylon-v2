import { ERROR401 } from '@/helpers/constants';
import { FastifyReply, FastifyRequest } from 'fastify';

/**
 * Unauthorized responses.
 *
 * @param res
 */
export const unathorizedResponse = (req: FastifyRequest, res: FastifyReply) => {
  req.log.error({
    statusCode: ERROR401.statusCode,
    message: ERROR401.message,
    path: req.routerPath,
    method: req.routerMethod,
  });

  return res.code(ERROR401.statusCode).send({
    statusCode: ERROR401.statusCode,
    error: new Error(ERROR401.message),
    message: ERROR401.message,
  });
};
