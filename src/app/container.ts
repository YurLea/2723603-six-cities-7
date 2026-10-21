import { Container } from 'inversify';
import { COMPONENTS } from '../shared/types.js';
import { LoggerService } from '../shared/logger/logger.service.js';
import { ConfigService } from '../shared/config/config.service.js';
import { Application } from './application.js';

export function createContainer(): Container {
  const container = new Container();

  container.bind(COMPONENTS.Logger).to(LoggerService).inSingletonScope();
  container.bind(COMPONENTS.Config).to(ConfigService).inSingletonScope();
  container.bind(COMPONENTS.Application).to(Application).inSingletonScope();

  return container;
}
