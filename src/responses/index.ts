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

export const successResponse = (
  res: FastifyReply,
  statusCode: number,
  data: any
) => {
  return res.code(statusCode).send({
    statusCode,
    data,
  });
};

export const errorResponse = (
  req: FastifyRequest,
  res: FastifyReply,
  statusCode: number,
  errorMessage: string
) => {
  req.log.error({
    statusCode,
    message: errorMessage,
    path: req.routerPath,
    method: req.routerMethod,
  });

  return res.code(statusCode).send({
    statusCode,
    error: new Error(errorMessage),
    message: errorMessage,
  });
};
