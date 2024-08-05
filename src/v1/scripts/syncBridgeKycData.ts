import { BridgeService } from '../services/external/Bridge';
import { BridgeComplianceErrorResponse } from '../types/bridge/compliance';

// Type guard
const isBridgeComplianceErrorResponse = (
  data: any
): data is BridgeComplianceErrorResponse => {
  return (
    data && typeof data.code === 'string' && typeof data.message === 'string'
  );
};

/**
 * Syncs KYC data from Bridge to Compliance Table
 */
const syncBridgeKycData = async () => {
  const bridgeService = BridgeService.getInstance();

  let startingAfter: string | undefined;
  const limit = 100;
  let hasMoreCustomers = true;

  while (hasMoreCustomers) {
    // Fetch customers from Bridge with query parameters
    const resp = await bridgeService.getComplianceLinks(limit, startingAfter);

    if (isBridgeComplianceErrorResponse(resp)) {
      return;
    }

    const { data: customers } = resp;

    console.log(`Processed ${customers.length} customers`);

    if (customers.length < limit) {
      hasMoreCustomers = false;
    } else {
      startingAfter = customers[customers.length - 1].customer_id;
    }
  }

  console.log('KYC data sync completed.');
};

const main = async () => {
  try {
    await syncBridgeKycData();
    process.exit(0);
  } catch (error) {
    console.error('KYC data sync failed:', error);
    process.exit(1);
  }
};

main();
