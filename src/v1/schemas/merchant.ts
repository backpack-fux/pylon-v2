import { Type as t } from '@sinclair/typebox';

export const CreateMerchantSchema = {
  body: t.Object({
    name: t.String({ minLength: 1, maxLength: 255 }), // Name must be between 1 and 255 characters and pattern to be alphanumeric
    surname: t.String({ minLength: 1, maxLength: 255 }), // Surname must be between 1 and 255 characters and pattern to be alphanumeric
    email: t.String({ format: 'email' }), // Email must be in a valid email format
    phoneNumber: t.String({ 
      pattern: '^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$'
    }), // Phone number must match the specified pattern and be in a valid phone number format
    companyNumber: t.Optional(t.String({ 
      pattern: '^[a-zA-Z0-9]*$'
    })), // Company number must be alphanumeric (optional)
    companyJurisdiction: t.Optional(t.String({ 
      minLength: 2, 
      maxLength: 2, 
      pattern: '^[a-zA-Z0-9]{2}$'
    })), // Company jurisdiction must be exactly 2 alphanumeric characters (optional)
    fee: t.Optional(t.Number({ minimum: 3, maximum: 100 })), // Fee must be between 3 and 100 (optional)
    walletAddress: t.String({ 
      pattern: '^0x[a-fA-F0-9]{40}$'
    }), // Wallet address must match the specified Ethereum address pattern
    registeredAddress: t.Object({
      street1: t.String({ maxLength: 50 }), // Street1 must be at most 50 characters
      street2: t.Optional(t.String({ maxLength: 50 })), // Street2 must be at most 50 characters (optional)
      city: t.String({ maxLength: 50 }), // City must be at most 50 characters
      postcode: t.Optional(t.String({ 
        maxLength: 25, 
        pattern: '^[a-zA-Z0-9]*$'
      })), // Postcode must be alphanumeric (optional)
      state: t.Optional(t.String({ 
        minLength: 2, 
        maxLength: 2, 
        pattern: '^[a-zA-Z0-9]{2}$'
      })), // State must be exactly 2 alphanumeric characters (optional)
      country: t.String({ 
        minLength: 2, 
        maxLength: 2, 
        pattern: '^[a-zA-Z0-9]{2}$'
      }), // Country must be exactly 2 alphanumeric characters
    }),
  }),
  response: {
    200: t.Object({
      statusCode: t.Number(),
      data: t.Any(),
    }), // Successful response schema
    400: t.Object({
      statusCode: t.Number(),
      message: t.String(),
    }), // Error response for bad request
    404: t.Object({
      statusCode: t.Number(),
      message: t.String(),
    }), // Error response for not found
    500: t.Object({
      statusCode: t.Number(),
      message: t.String(),
    }), // Error response for server error
  },
};
