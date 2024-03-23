import { FastifyRequestTypebox, FastifyReplyTypebox } from '@/v1/fastifyTypes';
import { prisma } from '@/db/index';
import { ERRORS } from '@/helpers/errors';
import {
  UserSignUpInput,
  UserAuthInput,
  UserLoginInput,
} from '../schemas/user';
import { ERROR404, ERROR500, STANDARD } from '@/helpers/constants';

export async function createUserAtSignUp(
  req: FastifyRequestTypebox<typeof UserSignUpInput>,
  rep: FastifyReplyTypebox<typeof UserSignUpInput>
): Promise<void> {
  const {} = req.body;

  try {
    const createUserAtSignUp = 'something';

    if (!createUserAtSignUp)
      rep.code(ERROR404.statusCode).send({ msg: ERRORS.userNotExists });
    else rep.code(STANDARD.SUCCESS).send({ data: createUserAtSignUp });
  } catch (error) {
    console.error('Error creating user at sign up:', error);
    rep.code(ERROR500.statusCode).send({ msg: ERROR500.message });
  }
}

export async function checkUserAuth(
  req: FastifyRequestTypebox<typeof UserAuthInput>,
  rep: FastifyReplyTypebox<typeof UserAuthInput>
): Promise<void> {
  const {} = req.body;

  try {
    const signatory = 'something';

    if (!signatory)
      rep.code(ERROR404.statusCode).send({ msg: ERRORS.userNotRegistered });
    else rep.code(STANDARD.SUCCESS).send({ data: signatory });
  } catch (error) {
    console.error('Error checking user auth: ', error);
    rep.code(ERROR500.statusCode).send({ msg: ERROR500.message });
  }
}

export async function updateUserSignatureAtLogin(
  req: FastifyRequestTypebox<typeof UserLoginInput>,
  rep: FastifyReplyTypebox<typeof UserLoginInput>
): Promise<void> {
  const {} = req.body;

  try {
    const signatory = 'something';

    if (!signatory)
      rep.code(ERROR404.statusCode).send({ msg: ERRORS.userNotExists });
    else rep.code(STANDARD.SUCCESS).send({ data: signatory });
  } catch (error) {
    console.error('Error updating user signature: ', error);
    rep.code(ERROR500.statusCode).send({ msg: ERROR500.message });
  }
}
