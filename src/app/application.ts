import { inject, injectable } from 'inversify';
import { COMPONENTS } from '../shared/types.js';
import type { ILogger } from '../shared/logger/logger.interface.js';
import { ConfigService } from '../shared/config/config.service.js';

@injectable()
export class Application {
  constructor(
    @inject(COMPONENTS.Logger) private readonly logger: ILogger,
    @inject(COMPONENTS.Config) private readonly config: ConfigService
  ) {}

  public async init(): Promise<void> {
    this.logger.info(`PORT is set to: ${this.config.getPort()}`);

    this.logger.info('Application initialized');
  }
}

