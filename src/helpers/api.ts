import { HTTPMethods } from 'fastify';

export const methods: Record<string, HTTPMethods> = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
};
