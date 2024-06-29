import { FastifyReply, FastifyRequest } from 'fastify';
import {
  ERROR400,
  ERROR403,
  bridgeWebhookAllowedIPs,
} from '@/helpers/constants';
import { ERRORS } from '@/helpers/errors';
import { utils } from '@/helpers/utils';

export const validateBridgeWebhook = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
  const ipAddress = req.ip;

  if (!bridgeWebhookAllowedIPs.includes(ipAddress)) {
    return rep.code(ERROR403.statusCode).send({ message: ERROR403.message });
  }

  const { headers, rawBody, body } = req;
  const signatureHeader = headers['x-webhook-signature'] as string;
  if (!signatureHeader) {
    return rep
      .code(ERROR400.statusCode)
      .send({ message: ERRORS.auth.bridge.malformedSignature });
  }

  const [_, timestamp, signature] =
    signatureHeader.match(/^t=(\d+),v0=(.*)$/) || [];
  if (!timestamp || !signature) {
    return rep
      .code(ERROR400.statusCode)
      .send({ message: ERRORS.auth.bridge.malformedSignature });
  }

  if (
    new Date(parseInt(timestamp, 10)) < new Date(Date.now() - 10 * 60 * 1000)
  ) {
    return rep
      .code(ERROR400.statusCode)
      .send({ message: ERRORS.auth.bridge.invalidSignature });
  }

  if (!utils.verifySignature(timestamp, rawBody, signature)) {
    return rep
      .code(ERROR400.statusCode)
      .send({ message: ERRORS.auth.bridge.invalidSignature });
  }

  return rep.code(200);
};
