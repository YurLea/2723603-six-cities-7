import type { RequestHandler } from 'express';

import type { Middleware } from './middleware.interface.js';

export type HttpMethod = 'get' | 'post' | 'patch' | 'put' | 'delete';

export interface Route<
  Params extends Record<string, string> = Record<string, string>
> {
  path: string;
  method: HttpMethod;
  handler: RequestHandler<Params>;
  middlewares?: Middleware[];
}
