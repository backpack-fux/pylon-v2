import { Type as t } from '@sinclair/typebox';
import { BaseResponse } from '.';

export const IssueOTPSchema = {
  body: t.Object({
    email: t.String({ format: 'email' }),
  }),
  ...BaseResponse,
};

export const VerifyOTPSchema = {
  body: t.Object({
    email: t.String({ format: 'email' }),
    otp: t.String({ minLength: 6, maxLength: 6 }),
  }),
  ...BaseResponse,
};
