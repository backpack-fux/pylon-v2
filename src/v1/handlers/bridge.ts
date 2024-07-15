import { ERROR404 } from '@/helpers/constants';
import { utils } from '@/helpers/utils';
import { errorResponse, successResponse } from '@/responses';
import {
  BridgePrefundedAccountBalanceSchema,
  BridgePrefundedAccountTransferSchema,
  BridgeWebhookSchema,
} from '@/v1/schemas/bridge';
import { ComplianceService } from '@/v1/services/Compliance';
import { BridgeError } from '@/v1/services/Error';
import { BridgeService } from '@/v1/services/external/Bridge';
import { DiscordService } from '@/v1/services/external/Discord';
import {
  BridgeDestinationObject,
  BridgePrefundedAccountTransferParams,
  BridgeSourceObject,
  BridgeUUID,
} from '@/v1/types/bridge/preFundedAccount';
import { BridgeWebhookPayload_KycLink } from '@/v1/types/bridge/webhooks';
import { FastifyReplyTypebox, FastifyRequestTypebox } from '@/v1/types/fastify';
import {
  BridgeCurrencyTypeDst,
  BridgeCurrencyTypeSrc,
  BridgePaymentRailTypeDst,
  BridgePaymentRailTypeSrc,
} from '../types/bridge/preFundedAccount';
import { Hex } from 'viem';
import { UUID } from 'crypto';

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
  req: FastifyRequestTypebox<typeof BridgePrefundedAccountTransferSchema>,
  rep: FastifyReplyTypebox<typeof BridgePrefundedAccountTransferSchema>
): Promise<void> {
  try {
    const { amount, on_behalf_of, developer_fee, source, destination } =
      req.body;

    const {
      payment_rail: sourcePaymentRail,
      currency: sourceCurrency,
      prefunded_account_id: sosurcePrefundedAccountId,
    } = source;
    const {
      payment_rail: destinationPaymentRail,
      currency: destinationCurrency,
      to_address: destinationPrefundedAccountId,
    } = destination;

    // const params: BridgePrefundedAccountTransferParams = {
    //   idempotencyKey: req.signerUuid! as BridgeUUID,
    //   amount: amount.toString(),
    //   on_behalf_of: on_behalf_of as BridgeUUID,
    //   developer_fee: developer_fee ?? undefined,
    //   source: source as BridgeSourceObject,
    //   destination: destination as BridgeDestinationObject,
    // };

    const balance = await bridgeService.createPrefundedAccountTransfer({
      idempotencyKey: req.signerUuid!,
      amount,
      on_behalf_of: on_behalf_of as UUID,
      developer_fee,
      src_payment_rail: sourcePaymentRail as BridgePaymentRailTypeSrc,
      src_currency: sourceCurrency as BridgeCurrencyTypeSrc,
      prefunded_account_id: sosurcePrefundedAccountId as BridgeUUID,
      dst_payment_rail: destinationPaymentRail as BridgePaymentRailTypeDst,
      dst_currency: destinationCurrency as BridgeCurrencyTypeDst,
      dst_to_address: destinationPrefundedAccountId as Hex,
    });

    console.log(balance);
    successResponse(rep, balance);
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
