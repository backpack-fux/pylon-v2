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
    emailExists: (email: string) => `A merchant with email ${email} already exists.`,
    phoneNumberExists: (phoneNumber: string) => `A merchant with phone number ${phoneNumber} already exists.`,
    walletAddressError: (walletAddress: string) => `The wallet address ${walletAddress} is already in use.`,
  },
};
