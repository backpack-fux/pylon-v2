import { PasskeyError, PrismaError } from '@/v1/services/Error';
import { ERROR500 } from './constants';

export const ERRORS = {
  auth: {
    invalidJWT: 'Invalid JWT',
    invalidAPIKey: 'Invalid API key',
    missingAuthorizationHeader: 'Missing or invalid authorization header',
    bridge: {
      malformedSignature: 'Malformed signature header',
      invalidSignature: 'Invalid signature',
      failedSignature: 'Signature verification failed',
    },
    farcaster: {
      missingFidOrSignerUuid: 'Missing fid or signerUuid',
      userNotAllowed: 'User not allowed to generate JWT',
      signerNotFound: 'Signer not found',
      signerNotApproved: 'Signer not approved',
      signerFidMismatch: 'Signer FID does not match',
    },
  },
  methods: {
    missingPostBody: 'Body is required for POST requests',
    extraGetBody: 'Body is not allowed for GET requests',
  },
  http: {
    error: (status: number) => `HTTP error! Status: ${status}`,
  },
  fetch: {
    error: (message: string) => `Fetch error: ${message}`,
  },
  merchant: {
    exists: 'Already exists',
    notExists: 'Does not exist',
    notRegistered: 'Is not registered',
    emailExists: (email: string) =>
      `A merchant with email ${email} already exists.`,
    phoneNumberExists: (phoneNumber: string) =>
      `A merchant with phone number ${phoneNumber} already exists.`,
    walletAddressExists: (walletAddress: string) =>
      `The wallet address ${walletAddress} is already in use.`,
  },
};

export const parseError = (
  error: unknown
): {
  statusCode: number;
  message: string;
} => {
  let statusCode: number = ERROR500.statusCode;
  let message: string = ERRORS.http.error(ERROR500.statusCode);

  if (error instanceof Error) {
    message = error.message;
  } else if (error instanceof PasskeyError || error instanceof PrismaError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  return {
    statusCode,
    message,
  };
};
