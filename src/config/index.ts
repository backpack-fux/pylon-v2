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
  port: Number(loadEnvironmentVariable('PORT', 8000)),
  jwtSecret: loadEnvironmentVariable('JWT_SECRET'),
  jwtExpires: Number(loadEnvironmentVariable('JWT_EXPIRES', 24)),
  serverApiKey: loadEnvironmentVariable('SERVER_API_KEY'),
  bridgeApiKey: loadEnvironmentVariable('BRIDGE_API_KEY'),
  bridgeApiURI: loadEnvironmentVariable('BRIDGE_API_URL'),
  bridgeWebhookPublicKey: loadEnvironmentVariable('BRIDGE_WEBHOOK_PUBLIC_KEY'),
  isProduction: process.env.NODE_ENV === 'production',
  isStaging: process.env.NODE_ENV === 'staging',
  isLocal: process.env.NODE_ENV === 'local',
  clientHost: loadEnvironmentVariable('CLIENT_HOST'),
  discordBotToken: loadEnvironmentVariable('DISCORD_BOT_TOKEN'),
  fidAdmins: loadEnvironmentVariable('FID_ADMINS', '').split(','),
  neynarApiKey: loadEnvironmentVariable('NEYNAR_API_KEY'),
  cookieSecret: loadEnvironmentVariable('COOKIE_SECRET'),
  redis: {
    host: loadEnvironmentVariable('REDIS_HOST'),
    port: Number(loadEnvironmentVariable('REDIS_PORT', 6379)),
    password: loadEnvironmentVariable('REDIS_PASSWORD'),
  },
  resend: {
    apiKey: loadEnvironmentVariable('RESEND_API_KEY'),
  },
  bridge: {
    apiKey: loadEnvironmentVariable('BRIDGE_API_KEY'),
    apiUrl: loadEnvironmentVariable('BRIDGE_API_URL'),
    webhookPublicKey: loadEnvironmentVariable('BRIDGE_WEBHOOK_PUBLIC_KEY'),
  },
  worldpay: {
    apiUrl: loadEnvironmentVariable('WORLDPAY_API_URI'),
    entityRef: loadEnvironmentVariable('WORLDPAY_ENTITY_REF'),
    username: loadEnvironmentVariable('WORLDPAY_USERNAME'),
    password: loadEnvironmentVariable('WORLDPAY_PASSWORD'),
    accessCheckoutId: loadEnvironmentVariable('WORLDPAY_ACCESS_CHECKOUT_ID'),
  },
};
