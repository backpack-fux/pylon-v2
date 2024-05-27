import 'dotenv/config';

function loadEnvironmentVariable(
  envVarKey: string | number,
  defaultValue?: any
) {
  const envVar = process.env[envVarKey];

  if (!envVar && defaultValue === undefined) {
    throw new Error(`Configuration must include ${envVarKey}`);
  }

  return envVar || defaultValue;
}

export const Config = {
  port: Number(loadEnvironmentVariable('PORT', 5000)),
  jwtSecret: loadEnvironmentVariable('JWT_SECRET'),
  jwtExpires: Number(loadEnvironmentVariable('JWT_EXPIRES', 24)),
  rainApiUrl: loadEnvironmentVariable('RAIN_API_URL'),
  rainApiKey: loadEnvironmentVariable('RAIN_API_KEY'),
  sessionSecret: loadEnvironmentVariable('SESSION_SECRET'),
  serverApiKey: loadEnvironmentVariable('SERVER_API_KEY'),
  isProduction: process.env.NODE_ENV === 'production',
  isStaging: process.env.NODE_ENV === 'staging',
  isLocal: process.env.NODE_ENV === 'local',
  discordBotToken: loadEnvironmentVariable('DISCORD_BOT_TOKEN'),
  web3: {
    explorerUri: loadEnvironmentVariable('EXPLORER_URI'),
    rpcProviderUri: loadEnvironmentVariable('RPC_PROVIDER_URI'),
    usdcContractAddress: loadEnvironmentVariable('USDC_CONTRACT_ADDRESS'),
    usdcPoolPrivateKey: loadEnvironmentVariable('USDC_POOL_PRIVATE_KEY'),
  },
  bridge: {
    testnet: {
      apiKey: loadEnvironmentVariable('BRIDGE_API_KEY'),
      apiUrl: loadEnvironmentVariable('BRIDGE_API_URL'),
      webhookPublicKey: loadEnvironmentVariable('BRIDGE_WEBHOOK_PUBLIC_KEY'),
    },
    mainnet: {
      apiKey: loadEnvironmentVariable('BRIDGE_API_KEY'),
      apiUrl: loadEnvironmentVariable('BRIDGE_API_URL'),
      webhookPublicKey: loadEnvironmentVariable('BRIDGE_WEBHOOK_PUBLIC_KEY'),
    },
  },
  worldpay: {
    testnet: {
      apiUrl: loadEnvironmentVariable('WORLDPAY_API_URI'),
      entityRef: loadEnvironmentVariable('WORLDPAY_ENTITY_REF'),
      username: loadEnvironmentVariable('WORLDPAY_USERNAME'),
      password: loadEnvironmentVariable('WORLDPAY_PASSWORD'),
      accessCheckoutId: loadEnvironmentVariable('WORLDPAY_ACCESS_CHECKOUT_ID'),
    },
  },
};
