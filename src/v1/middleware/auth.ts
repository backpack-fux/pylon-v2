import { Config } from '@/config';
import { ERROR401 } from '@/helpers/constants';
import { ERRORS } from '@/helpers/errors';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/User';

const userService = UserService.getInstance();

export const authenticate = async (req: FastifyRequest, rep: FastifyReply) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return rep.code(ERROR401.statusCode).send({
      unauthorized: ERRORS.auth.missingAuthorizationHeader,
    });
  }
  try {
    // Verify the JWT token using the Fastify JWT plugin
    await req.jwtVerify();

    const user = await userService.findOneById(req.user.id);
    if (!user) {
      return rep
        .code(ERROR401.statusCode)
        .send({ unauthorized: ERRORS.auth.invalidJWT });
    }

    return;
  } catch (err) {
    return rep
      .code(ERROR401.statusCode)
      .send({ unauthorized: ERRORS.auth.invalidJWT });
  }
};

export const validateAPIKey = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
  const authHeader = req.headers.authorization;
  const apiKey = authHeader && authHeader.split(' ')[1];

  if (!apiKey) {
    return rep
      .code(ERROR401.statusCode)
      .send({ unauthorized: ERRORS.auth.missingAuthorizationHeader });
  }

  if (apiKey !== Config.serverApiKey) {
    return rep
      .code(ERROR401.statusCode)
      .send({ unauthorized: ERRORS.auth.invalidAPIKey });
  } else {
    return;
  }
};
