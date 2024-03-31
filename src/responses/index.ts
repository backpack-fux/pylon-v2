import { ERROR401, STANDARD } from '@/helpers/constants';
import { CustomSchemas } from '@/v1/schemas';
import { FastifyReplyTypebox, FastifyRequestTypebox } from '@/v1/types/fastify';
import { FastifyReply, FastifyRequest } from 'fastify';

/**
 * Unauthorized responses.
 *
 * @param res
 */
export const unathorizedResponse = (
  req: FastifyRequestTypebox<CustomSchemas>,
  rep: FastifyReplyTypebox<CustomSchemas>
) => {
  req.log.error({
    statusCode: ERROR401.statusCode,
    message: ERROR401.message,
    path: req.routeOptions.url,
    method: req.routeOptions.method,
  });

  // return rep.code(ERROR401.statusCode).send({
  //   statusCode: ERROR401.statusCode,
  //   error: new Error(ERROR401.message),
  //   message: ERROR401.message,
  // });
};

export const successResponse = (
  rep: FastifyReplyTypebox<CustomSchemas>,
  data: any
) => {
  return rep.code(STANDARD.SUCCESS).send({
    statusCode: STANDARD.SUCCESS,
    data,
  });
};

export const errorResponse = (
  req: FastifyRequestTypebox<CustomSchemas>,
  rep: FastifyReplyTypebox<CustomSchemas>,
  statusCode: number,
  errorMessage: string
) => {
  req.log.error({
    statusCode,
    message: errorMessage,
    path: req.routeOptions.url,
    method: req.routeOptions.method,
  });

  return rep.code(statusCode).send({
    statusCode,
    message: errorMessage,
  });
};
