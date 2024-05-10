import { HTTPMethods } from 'fastify';

export const methods: Record<string, HTTPMethods> = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
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

export const blacklistedBins = [
  '409758',
  '410039',
  '415518',
  '422967',
  '426938',
  '435880',
  '438857',
  '440393',
  '444607',
  '469497',
  '485932',
  '485953',
  '486014',
  '511332',
  '511786',
  '511932',
  '512230',
  '515307',
  '515676',
  '516648',
  '517148',
  '517805',
  '517975',
  '518725',
  '518941',
  '521267',
  '521307',
  '521876',
  '523081',
  '525363',
  '525475',
  '528546',
  '532839',
  '534636',
  '535885',
  '540324',
  '542418',
  '544282',
  '544303',
  '545958',
  '546325',
  '546616',
  '546657',
  '548042',
  '549345',
  '552433',
  '558341',
];
