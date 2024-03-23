import { FastifyInstance } from 'fastify';
import { methods } from '@/helpers/api';
import {
  createUserAtSignUp,
  updateUserSignatureAtLogin,
  checkUserAuth,
} from '../handlers/user';
import {
  UserSignUpInput,
  UserAuthInput,
  UserLoginInput,
} from '../schemas/user';

const User = async (app: FastifyInstance) => {
  /** @description create a new user, address book, and contact at sign up */
  app.route({
    method: methods.POST,
    url: '/sign-up',
    schema: UserSignUpInput,
    handler: createUserAtSignUp,
  });

  /** @description check if user exists */
  app.route({
    method: methods.POST,
    url: '/auth',
    schema: UserAuthInput,
    handler: checkUserAuth,
  });

  /** @description update user signature at login */
  app.route({
    method: methods.PUT,
    url: '/login',
    schema: UserLoginInput,
    handler: updateUserSignatureAtLogin,
  });
};

export default User;
