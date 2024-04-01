import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import { createContext } from '../util/createContext';

export const trpcInstance = initTRPC.context<inferAsyncReturnType<typeof createContext>>().create()