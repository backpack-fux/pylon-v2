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
  serverApiKey: loadEnvironmentVariable('SERVER_API_KEY'),
  bridgeApiKey: loadEnvironmentVariable('BRIDGE_API_KEY'),
  bridgeApiURI: loadEnvironmentVariable('BRIDGE_API_URL'),
  bridgeWebhookPublicKey: loadEnvironmentVariable('BRIDGE_WEBHOOK_PUBLIC_KEY'),
  isProduction: process.env.NODE_ENV === 'production',
  isStaging: process.env.NODE_ENV === 'staging',
  isLocal: process.env.NODE_ENV === 'local',
  discordBotToken: loadEnvironmentVariable('DISCORD_BOT_TOKEN'),
  frontendUri: loadEnvironmentVariable(
    'FRONT_END_URI',
    'https://test.checkout.mybackpack.app'
  ),
  web3: {
    explorerUri: loadEnvironmentVariable('EXPLORER_URI'),
    rpcProviderUri: loadEnvironmentVariable('RPC_PROVIDER_URI'),
    usdcContractAddress: loadEnvironmentVariable('USDC_CONTRACT_ADDRESS'),
    usdcPoolPrivateKey: loadEnvironmentVariable('USDC_POOL_PRIVATE_KEY'),
  },
};
