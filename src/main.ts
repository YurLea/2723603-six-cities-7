import 'reflect-metadata';
import dotenv from 'dotenv';

import { createContainer } from './app/container.js';
import { Application } from './app/application.js';
import { COMPONENTS } from './shared/types.js';
import { LoggerService } from './shared/logger/logger.service.js';
import type { ILogger } from './shared/logger/logger.interface.js';

dotenv.config();

let logger: ILogger = new LoggerService();

try {
  const container = createContainer();

  logger = container.get<ILogger>(COMPONENTS.Logger);

  const app = container.get<Application>(COMPONENTS.Application);

  await app.init();
} catch (error: unknown) {
  logger.error('Application initialization failed', {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });

  process.exitCode = 1;
}
