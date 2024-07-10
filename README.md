# Overview

Next-gen Pylon, starting with transactional on-ramping.

## Getting Started Guide

### Pre-requisites:
* NodeJS >=20.11.1
    * Recommend you use [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file) to get the latest version of NodeJS.  On Mac you can [install using Homebrew](https://formulae.brew.sh/formula/nvm)
* (recommended) [pnpm](https://pnpm.io/) >=8.15.4 OR npm >=10.2.4
     * On Mac suggest you [install using Homebrew](https://formulae.brew.sh/formula/pnpm)
* Postgres
    * On Mac suggest using [Postgresapp](https://postgresapp.com/)
* Access to our [Railway.app](https://railway.app/) instance
 
### Installation
1. On your local machine, clone this repo: `git clone git@github.com:newdaojones/pylon-v2.git`
2. Copy `.env.example` to `.env`
3. Log into [Railway.app project]([https://railway.app/](https://railway.app/project/068640ee-91f7-4664-82d1-5d1ebecee1e8/service/2bf62a2e-6e2b-4f99-ab9e-b8c456211048/variables)) and open the *Variables* tab
4. Copy the value of each variable in Railway.app to your `.env`
5. Run the following setup scripts
    ```
    pnpm i
    pnpm run db:generate
    pnpm run db:dev  
    ```
6. Run the server `pnpm run dev`

### Testing
To test locally, you'll have to [download Postman desktop](https://www.postman.com/downloads/).

1. Ensure your server is running (follow *Installation* steps above)
2. Create a new request
4. For the request type, change `GET` to `POST`
5. Set *URL* to `http://localhost:8000/v1/merchant/create`
6. Under *Header* tab, add *Key* as `authorization` and *Value* as `[JWT_SECRET]  [SERVER_API_KEY]`
    * `[JWT_SECRET]` and  `[SERVER_API_KEY]` can be found in your `.env` you set up above
    * Please note there is a space between the two values
7. Go to the *Body* tab and set to *raw*, then enter the following info:
    ```
    {
        "name": "Jeff",
        "surname": "Winger",
        "email": "youremail@gmail.com",
        "phoneNumber": "(555)555-5555",
        "walletAddress": "0x0000000000000000000000000000000000000000",
        "registeredAddress": {
            "street1": "123 Main Street",
            "city": "New York",
            "postcode": "11111",
            "country": "US"
        }
    }
    ```
8. Press *Send*.  You should get a `200 OK` Response.

## Components

### Enums and Types

- **TransactionProcessor**: Enum for supported payment processors (e.g., `WORLDPAY`).
- **ISO4217Currency**: Enum for supported currencies using ISO 4217 currency codes (e.g., `USD`, `EUR`).
- **ISO3166Alpha2Country**: Enum for supported countries using ISO 3166-1 alpha-2 country codes.
- **ISO3611_2USAState**: Enum for U.S. states and territories using their abbreviations.

### Transaction Handling

- **TransactionProcessSchema**: Defines the structure and validation for transaction data.
- **TransactionService**: Contains business logic for processing transactions, including methods to handle payment authorization, risk assessment, and token management with Worldpay.

### Database Integration

- **Prisma ORM**: Used for object-relational mapping, managing database operations.
- **SQL Migrations**: Scripts for creating and updating database tables and enums, ensuring data integrity and supporting database evolution.

### Error Handling

- **WorldpayError**: Custom error handling for issues related to Worldpay integration.
- **PrismaError**: Handles errors related to database operations using Prisma.

### Utilities

- **utils**: A collection of utility functions for generating UUIDs, transaction references, and handling timestamps.

## Database Schema

- **Merchant**: Stores merchant details including name, contact info, and transaction fees.
- **Transaction**: Represents a transaction record including status, amount, currency, and associated merchant and buyer.
- **PhysicalAddress**: Used for storing address details for billing, shipping, or registered addresses.

## Code Examples

### Process a Transaction

```ts
const transactionDetails = {
  paymentProcessor: TransactionProcessor.WORLDPAY,
  amount: 100,
  currency: ISO4217Currency.USD,
  merchantId: 1,
  buyerId: 2,
};

const transactionService = TransactionService.getInstance();

transactionService
  .processTransaction(transactionDetails)
  .then((response) => console.log('Transaction processed:', response))
  .catch((error) => console.error('Error processing transaction:', error));
```

### Add a New Payment Processor

To add a new payment processor, extend the `TransactionProcessor` enum and implement corresponding service methods in `TransactionService`.

## Future Enhancements

- **Support for Additional Payment Processors**: Extend the system to integrate with more payment processors.
- **Enhanced Fraud Detection**: Implement advanced fraud detection mechanisms during the transaction process.
