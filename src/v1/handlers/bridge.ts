import { FastifyRequestTypebox, FastifyReplyTypebox } from '@/v1/types/fastify';
import { ERRORS } from '@/helpers/errors';
import {
  BridgePrefundedAccountBalanceSchema,
  BridgeWebhookSchema,
} from '../schemas/bridge';
import {
  DISCORD,
  ERROR400,
  ERROR404,
  ERROR500,
  STANDARD,
} from '@/helpers/constants';
import { BridgeService } from '../services/external/Bridge';
import { DiscordService } from '../services/external/Discord';
import { errorResponse, successResponse } from '@/responses';

const discordService = DiscordService.getInstance();
const bridgeService = BridgeService.getInstance();

//https://discord.com/channels/1082013710048051342/1224052196245635222
export async function getPrefundedAccountBalance(
  req: FastifyRequestTypebox<typeof BridgePrefundedAccountBalanceSchema>,
  rep: FastifyReplyTypebox<typeof BridgePrefundedAccountBalanceSchema>
): Promise<void> {
  try {
    const balance = await bridgeService.getPrefundedAccountBalance();
    const res = await discordService.send(
      DISCORD.channelId,
      balance.available_balance
    );
    console.log(res);
    successResponse(rep, res);
  } catch (error) {
    console.error(error);
    const errorMessage =
      'An error occurred fetching the prefunded account balance';
    return errorResponse(req, rep, ERROR404.statusCode, errorMessage);
  }
}

// event_category: kyc_link
// event_type:
export async function processWebhooksHandler(
  req: FastifyRequestTypebox<typeof BridgeWebhookSchema>,
  rep: FastifyReplyTypebox<typeof BridgeWebhookSchema>
): Promise<void> {
  try {
    const balance = await bridgeService.getPrefundedAccountBalance();
    const res = await discordService.send(
      DISCORD.channelId,
      balance.available_balance
    );
    console.log(res);
    successResponse(rep, res);
  } catch (error) {
    console.error(error);
    const errorMessage =
      'An error occurred fetching the prefunded account balance';
    return errorResponse(req, rep, ERROR404.statusCode, errorMessage);
  }
}
