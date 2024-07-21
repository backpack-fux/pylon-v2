import {
  FastifyReply,
  FastifyRequest,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  ContextConfigDefault,
} from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import { FastifySchema } from 'fastify/types/schema';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { PrismaBuyer, PrismaMerchant, PrismaUser } from './prisma';
import { Merchant } from '@prisma/client';

// extends FastifyJWT to include custom user type
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: PrismaUser & {
      credential?: string;
    };
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    merchant?: PrismaMerchant | null;
    buyer?: PrismaBuyer | null;
  }
}

export type FastifyRequestTypebox<TSchema extends FastifySchema> =
  FastifyRequest<
    RouteGenericInterface,
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    TSchema,
    TypeBoxTypeProvider
  >;

export type FastifyReplyTypebox<TSchema extends FastifySchema> = FastifyReply<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  RouteGenericInterface,
  ContextConfigDefault,
  TSchema,
  TypeBoxTypeProvider
>;
