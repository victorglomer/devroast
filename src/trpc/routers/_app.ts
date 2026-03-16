import { router } from '../init';
import { metricsRouter } from './metrics';

export const appRouter = router({
  metrics: metricsRouter,
});

export type AppRouter = typeof appRouter;
