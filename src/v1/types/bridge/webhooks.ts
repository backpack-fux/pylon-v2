import { UUID } from 'crypto';

export type BridgeWebhookPayload_KycLink = {
  api_version: string;
  event_id: string;
  event_category: string;
  event_type: string;
  event_object_id: UUID;
  event_object_status?: string;
  event_object: {
    id: UUID;
    type: string;
    email: string;
    kyc_link: string;
    tos_link: string;
    full_name: string;
    created_at: string;
    kyc_status: string;
    tos_status: string;
    customer_id: string | null;
    persona_inquiry_type: string;
  };
  event_object_changes?: {
    [key: string]: [string, string];
  };
  event_created_at: string;
};
