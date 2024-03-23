import { HTTPMethods } from 'fastify';

export const methods: Record<string, HTTPMethods> = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
};

export const headers = {
  'Content-Type': 'application/json',
};
