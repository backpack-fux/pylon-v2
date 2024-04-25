import { HTTPMethods } from 'fastify';

export const methods: Record<"GET" | "POST" | "PUT", HTTPMethods> = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
};

export const headers = {
  'Content-Type': 'application/json',
};

export const STANDARD = {
  CREATED: 201,
  SUCCESS: 200,
  NOCONTENT: 204,
};

export const ERROR404 = {
  statusCode: 404,
  message: 'NOT_FOUND',
};

export const ERROR403 = {
  statusCode: 403,
  message: 'FORBIDDEN_ACCESS',
};

export const ERROR401 = {
  statusCode: 401,
  message: 'UNAUTHORIZED',
};

export const ERROR500 = {
  statusCode: 500,
  message: 'TRY_AGAIN',
};

export const ERROR409 = {
  statusCode: 409,
  message: 'DUPLICATE_FOUND',
};

export const ERROR400 = {
  statusCode: 400,
  message: 'BAD_REQUEST',
};

export const DISCORD = {
  channelId: '1224052196245635222',
};

export const bridgeWebhookAllowedIPs = [
  '35.160.120.126',
  '44.233.151.27',
  '34.211.200.85',
];
