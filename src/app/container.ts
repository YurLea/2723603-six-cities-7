import { Container } from 'inversify';

import { COMPONENTS } from '../shared/types.js';

import type { ILogger } from '../shared/logger/logger.interface.js';
import { LoggerService } from '../shared/logger/logger.service.js';
import { ConfigService } from '../shared/config/config.service.js';
import { Application } from './application.js';

import { MongoClientService } from '../shared/database/mongo-client.service.js';

import { createUserModel } from '../shared/modules/user/user.model.js';
import { createOfferModel } from '../shared/modules/offer/offer.model.js';
import { createCommentModel } from '../shared/modules/comment/comment.model.js';
import { createFavoriteModel } from '../shared/modules/favorite/favorite.model.js';

import type { UserService } from '../shared/modules/user/user-service.interface.js';
import type { OfferService } from '../shared/modules/offer/offer-service.interface.js';
import type { CommentService } from '../shared/modules/comment/comment-service.interface.js';
import type { FavoriteService } from '../shared/modules/favorite/favorite-service.interface.js';

import { DefaultUserService } from '../shared/modules/user/user.service.js';
import { DefaultOfferService } from '../shared/modules/offer/offer.service.js';
import { DefaultCommentService } from '../shared/modules/comment/comment.service.js';
import { DefaultFavoriteService } from '../shared/modules/favorite/favorite.service.js';

import { SessionService } from '../shared/modules/user/session.service.js';
import { UserController } from '../shared/modules/user/user.controller.js';
import { OfferController } from '../shared/modules/offer/offer.controller.js';
import { CommentController } from '../shared/modules/comment/comment.controller.js';
import { FavoriteController } from '../shared/modules/favorite/favorite.controller.js';
import { HttpExceptionFilter } from '../shared/http/http-exception-filter.js';

import { TSVFileReader } from '../cli/tsv/tsv-file-reader.js';
import { TSVOfferParser } from '../cli/tsv/tsv-offer.parser.js';
import { ImportCommand } from '../cli/commands/import.command.js';

export function createContainer(): Container {
  const container = new Container();

  container.bind(COMPONENTS.Logger).to(LoggerService).inSingletonScope();
  container.bind(COMPONENTS.Config).to(ConfigService).inSingletonScope();
  container.bind(COMPONENTS.Application).to(Application).inSingletonScope();

  container.bind(COMPONENTS.DatabaseClient)
    .to(MongoClientService)
    .inSingletonScope();

  container.bind(COMPONENTS.UserModel).toConstantValue(createUserModel());
  container.bind(COMPONENTS.OfferModel).toConstantValue(createOfferModel());
  container.bind(COMPONENTS.CommentModel).toConstantValue(createCommentModel());
  container.bind(COMPONENTS.FavoriteModel).toConstantValue(createFavoriteModel());

  container.bind(COMPONENTS.UserService)
    .to(DefaultUserService)
    .inSingletonScope();

  container.bind(COMPONENTS.OfferService)
    .to(DefaultOfferService)
    .inSingletonScope();

  container.bind(COMPONENTS.CommentService)
    .to(DefaultCommentService)
    .inSingletonScope();

  container.bind(COMPONENTS.FavoriteService)
    .to(DefaultFavoriteService)
    .inSingletonScope();

  container.bind(SessionService)
    .toDynamicValue(() => {
      const config = container.get<ConfigService>(COMPONENTS.Config);

      return new SessionService(config.getSessionTtlSeconds());
    })
    .inSingletonScope();

  container.bind(UserController)
    .toDynamicValue(() => new UserController(
      container.get<ILogger>(COMPONENTS.Logger),
      container.get<UserService>(COMPONENTS.UserService),
      container.get(SessionService),
      container.get<ConfigService>(COMPONENTS.Config).getUploadDirectory()
    ))
    .inSingletonScope();

  container.bind(OfferController)
    .toDynamicValue(() => new OfferController(
      container.get<ILogger>(COMPONENTS.Logger),
      container.get<OfferService>(COMPONENTS.OfferService),
      container.get<FavoriteService>(COMPONENTS.FavoriteService),
      container.get(SessionService)
    ))
    .inSingletonScope();

  container.bind(CommentController)
    .toDynamicValue(() => new CommentController(
      container.get<ILogger>(COMPONENTS.Logger),
      container.get<CommentService>(COMPONENTS.CommentService),
      container.get<OfferService>(COMPONENTS.OfferService),
      container.get(SessionService)
    ))
    .inSingletonScope();

  container.bind(FavoriteController)
    .toDynamicValue(() => new FavoriteController(
      container.get<ILogger>(COMPONENTS.Logger),
      container.get<FavoriteService>(COMPONENTS.FavoriteService),
      container.get<OfferService>(COMPONENTS.OfferService),
      container.get(SessionService)
    ))
    .inSingletonScope();

  container.bind(HttpExceptionFilter)
    .toDynamicValue(() => new HttpExceptionFilter(
      container.get<ILogger>(COMPONENTS.Logger)
    ))
    .inSingletonScope();

  container.bind(TSVFileReader).toSelf().inSingletonScope();
  container.bind(TSVOfferParser).toSelf().inSingletonScope();
  container.bind(ImportCommand).toSelf().inSingletonScope();

  return container;
}
