import { Router, type Response } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';

import type { ILogger } from '../logger/logger.interface.js';
import type { ControllerInterface } from './controller.interface.js';
import type { Route } from './route.interface.js';

export abstract class Controller implements ControllerInterface {
  public readonly router = Router();

  constructor(protected readonly logger: ILogger) {}

  protected addRoute<Params extends Record<string, string>>(
    route: Route<Params>
  ): void {
    const handler = route.handler.bind(this);
    const wrapperAsyncHandler = asyncHandler<Params>(
      async (req, res, next): Promise<void> => {
        await handler(req, res, next);
      }
    );

    const middlewareHandlers = route.middlewares?.map(
      (middleware) => asyncHandler<Params>(
        async (req, res, next): Promise<void> => {
          await middleware.execute(req, res, next);
        }
      )
    );

    const allHandlers = middlewareHandlers
      ? [...middlewareHandlers, wrapperAsyncHandler]
      : [wrapperAsyncHandler];

    this.router[route.method]<Params>(
      route.path,
      ...allHandlers
    );

    this.logger.debug(
      `Route registered: ${route.method.toUpperCase()} ${route.path}`
    );
  }

  protected ok<T>(res: Response, data: T): void {
    res.status(StatusCodes.OK).json(data);
  }

  protected created<T>(res: Response, data: T): void {
    res.status(StatusCodes.CREATED).json(data);
  }

  protected noContent(res: Response): void {
    res.status(StatusCodes.NO_CONTENT).end();
  }
}
