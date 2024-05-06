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
import { BridgeWebhookPayload_KycLink } from '../types/bridge/webhooks';
import { ComplianceService } from '../services/Compliance';
import { utils } from '@/helpers/utils';
import { BridgeError } from '../services/Error';

const discordService = DiscordService.getInstance();
const bridgeService = BridgeService.getInstance();
const complianceService = ComplianceService.getInstance();

/** @docs https://discord.com/channels/1082013710048051342/1224052196245635222 */
export async function getPrefundedAccountBalance(
  req: FastifyRequestTypebox<typeof BridgePrefundedAccountBalanceSchema>,
  rep: FastifyReplyTypebox<typeof BridgePrefundedAccountBalanceSchema>
): Promise<void> {
  try {
    const balance = await bridgeService.getPrefundedAccountBalance();
    // const msg = await discordService.send(
    //   DISCORD.channelId,
    //   balance.data[0].available_balance
    // );
    // console.log(msg);
    successResponse(rep, balance);
  } catch (error) {
    if (error instanceof BridgeError) {
      return errorResponse(req, rep, error.statusCode, error.message);
    } else {
      console.error(error);
      const errorMessage =
        'An error occurred fetching the prefunded account balance';
      return errorResponse(req, rep, ERROR404.statusCode, errorMessage);
    }
  }
}

export async function createPrefundedAccountTransfer(
  req: FastifyRequestTypebox<typeof BridgePrefundedAccountBalanceSchema>,
  rep: FastifyReplyTypebox<typeof BridgePrefundedAccountBalanceSchema>
): Promise<void> {
  try {
    req.body;
    // const balance = await bridgeService.createPrefundedAccountTransfer();
    // const res = await discordService.send(
    //   DISCORD.channelId,
    //   balance.available_balance
    // );
    // console.log(res);
    // successResponse(rep, res);
  } catch (error) {
    console.error(error);
    const errorMessage =
      'An error occurred fetching the prefunded account balance';
    return errorResponse(req, rep, ERROR404.statusCode, errorMessage);
  }
}

/** @docs https://withbridge.notion.site/Bridge-Webhooks-User-Guide-491f603997194c868b0600a5f45051e6 */
export async function processWebhooksHandler(
  req: FastifyRequestTypebox<typeof BridgeWebhookSchema>,
  rep: FastifyReplyTypebox<typeof BridgeWebhookSchema>
): Promise<void> {
  try {
    const payload = req.body as BridgeWebhookPayload_KycLink;

    switch (payload.event_type) {
      case 'kyc_link.updated.status_transitioned':
        const { kyc_status, tos_status } = payload.event_object;
        const resp = await complianceService.update(
          payload.event_object_id,
          utils.formattedKycStatus(kyc_status),
          utils.formattedTosStatus(tos_status)
        );
        return successResponse(rep, resp);
    }
  } catch (error) {
    console.error(error);
    const errorMessage = 'An error occurred processing the bridge webhook';
    return errorResponse(req, rep, ERROR404.statusCode, errorMessage);
  }
}
