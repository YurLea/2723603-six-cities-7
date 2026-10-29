import { Container } from 'inversify';

import { COMPONENTS } from '../shared/types.js';

import { LoggerService } from '../shared/logger/logger.service.js';
import { ConfigService } from '../shared/config/config.service.js';
import { Application } from './application.js';

import { MongoClientService } from '../shared/database/mongo-client.service.js';

import { createUserModel } from '../shared/modules/user/user.model.js';
import { createOfferModel } from '../shared/modules/offer/offer.model.js';

import { DefaultUserService } from '../shared/modules/user/user.service.js';
import { DefaultOfferService } from '../shared/modules/offer/offer.service.js';

import { TSVFileReader } from '../cli/tsv/tsv-file-reader.js';
import { TSVOfferParser } from '../cli/tsv/tsv-offer.parser.js';
import { ImportCommand } from '../cli/commands/import.command.js';

export function createContainer(): Container {
  const container = new Container();

  container.bind(COMPONENTS.Logger).to(LoggerService).inSingletonScope();
  container.bind(COMPONENTS.Config).to(ConfigService).inSingletonScope();
  container.bind(COMPONENTS.Application).to(Application).inSingletonScope();

  container.bind(COMPONENTS.DatabaseClient).to(MongoClientService).inSingletonScope();

  container.bind(COMPONENTS.UserModel).toConstantValue(createUserModel());
  container.bind(COMPONENTS.OfferModel).toConstantValue(createOfferModel());

  container.bind(COMPONENTS.UserService).to(DefaultUserService).inSingletonScope();
  container.bind(COMPONENTS.OfferService).to(DefaultOfferService).inSingletonScope();

  container.bind(TSVFileReader).toSelf().inSingletonScope();
  container.bind(TSVOfferParser).toSelf().inSingletonScope();
  container.bind(ImportCommand).toSelf().inSingletonScope();

  return container;
}
