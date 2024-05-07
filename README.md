# Overview

Next-gen Pylon, starting with transactional on-ramping.

## Set up

`npm i` or `pnpm i`

**Note:** `pnpm` will not install prisma correctly, so you will need to run `pnpm run db:generate` before running `pnpm run dev`

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
