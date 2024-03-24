export const ERRORS = {
  auth: {
    invalidJWT: 'Invalid JWT',
    invalidAPIKey: 'Invalid API key',
    missingAuthorizationHeader: 'Missing or invalid authorization header',
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
  },
};
