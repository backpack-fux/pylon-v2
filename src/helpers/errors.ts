export const ERRORS = {
  auth: {
    invalidToken: 'Token is invalid.',
    credError: 'Invalid credential',
    tokenError: 'Invalid Token',
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
    exists: 'Merchant already exists',
    notExists: 'Merchant does not exist',
    notRegistered: 'Merchant is not registered',
  },
};
