import 'server-only';
import { createCallerFactory, createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';
import { cache } from 'react';

export const getQueryClient = cache(makeQueryClient);
const createCaller = createCallerFactory(appRouter);

export const serverCaller = createCaller(await createTRPCContext());

export const trpc = serverCaller;
