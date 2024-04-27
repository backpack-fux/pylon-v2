import { errorResponse, successResponse } from '@/responses';
import { FastifyRequestTypebox, FastifyReplyTypebox } from '../types/fastify';
import { ERROR404 } from '@/helpers/constants';
import { TransactionProcessSchema } from '../schemas/transaction';

// const transactionService = TransactionService.getInstance();

export async function processTransaction(
  req: FastifyRequestTypebox<typeof TransactionProcessSchema>,
  rep: FastifyReplyTypebox<typeof TransactionProcessSchema>
): Promise<void> {
  try {
    // const balance = await bridgeService.getPrefundedAccountBalance();
    // successResponse(rep, res);
  } catch (error) {
    console.error(error);
    const errorMessage =
      'An error occurred fetching the prefunded account balance';
    return errorResponse(req, rep, ERROR404.statusCode, errorMessage);
  }
}
