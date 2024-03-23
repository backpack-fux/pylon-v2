import { FastifyRequest, FastifyReply } from 'fastify';

// @notes: I cant use the signature to authenticate because
// 1) Each message that is signed has a unique nonce, I would need to send in the stored user nonce for each HTTP request
// and we are currently not storing and updating the nonce in db or cookies
// 2) I would need to call createMessage() and pass in the stored nonce,
// but we are already using the createMessage() to generate random nonce,
// or I would need to duplicate the function or adjust the function to also handle an already-generated and user-stored nonce
// 3) this is because I would need to use the siweMessage.verify({ signature });
export const authenticationMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const authHeader = request.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  console.log(process.env.JWT_SECRET, 'secret & token:', token);

  if (!token) {
    return reply.code(401).send({ error: 'Unauthorized request' });
  }
  try {
    // Verify the JWT token using the Fastify JWT plugin
    await request.jwtVerify();
    // If the token is valid, continue with the request
    return;
  } catch (err) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }
};
