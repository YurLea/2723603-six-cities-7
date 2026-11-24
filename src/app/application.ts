import express, { type Express } from 'express';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { COMPONENTS } from '../shared/types.js';
import type { ILogger } from '../shared/logger/logger.interface.js';
import { ConfigService } from '../shared/config/config.service.js';
import type { DatabaseClient } from '../shared/database/database-client.interface.js';

import { HttpError } from '../shared/http/http-error.js';
import { HttpExceptionFilter } from '../shared/http/http-exception-filter.js';

import { UserController } from '../shared/modules/user/user.controller.js';
import { OfferController } from '../shared/modules/offer/offer.controller.js';
import { CommentController } from '../shared/modules/comment/comment.controller.js';
import { FavoriteController } from '../shared/modules/favorite/favorite.controller.js';

@injectable()
export class Application {
  private readonly server: Express = express();

  constructor(
    @inject(COMPONENTS.Logger)
    private readonly logger: ILogger,

    @inject(COMPONENTS.Config)
    private readonly config: ConfigService,

    @inject(COMPONENTS.DatabaseClient)
    private readonly databaseClient: DatabaseClient,

    @inject(UserController)
    private readonly userController: UserController,

    @inject(OfferController)
    private readonly offerController: OfferController,

    @inject(CommentController)
    private readonly commentController: CommentController,

    @inject(FavoriteController)
    private readonly favoriteController: FavoriteController,

    @inject(HttpExceptionFilter)
    private readonly exceptionFilter: HttpExceptionFilter
  ) {}

  private initMiddleware(): void {
    this.server.disable('x-powered-by');
    this.server.use(express.json());
    this.server.use('/uploads', express.static(this.config.getUploadDirectory()));
  }

  private initControllers(): void {
    this.server.use('/offers', this.offerController.router);
    this.server.use('/comments', this.commentController.router);
    this.server.use('/favorite', this.favoriteController.router);
    this.server.use('/', this.userController.router);
  }

  private initExceptionFilters(): void {
    this.server.use((_req, _res, next): void => {
      next(new HttpError(
        StatusCodes.NOT_FOUND,
        'Route not found'
      ));
    });
    this.server.use(this.exceptionFilter.catch);
  }

  private async initServer(): Promise<void> {
    const port = this.config.getPort();

    await new Promise<void>((resolve, reject) => {
      const httpServer = this.server.listen(port, '0.0.0.0');

      httpServer.once('error', reject);

      httpServer.once('listening', () => {
        httpServer.off('error', reject);
        resolve();
      });
    });

    this.logger.info(`Server is listening on port ${port}`);
  }

  public async init(): Promise<void> {
    try {
      await this.databaseClient.connect(this.config.getMongoUri());

      this.initMiddleware();
      this.initControllers();
      this.initExceptionFilters();

      await this.initServer();

      this.logger.info('Application initialized');
    } catch (error: unknown) {
      await this.databaseClient.disconnect();
      throw error;
    }
  }
}

