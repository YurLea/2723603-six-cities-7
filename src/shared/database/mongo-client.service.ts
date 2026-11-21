import { injectable, inject } from 'inversify';
import { connect, disconnect } from 'mongoose';

import type { DatabaseClient } from './database-client.interface.js';
import type { ILogger } from '../logger/logger.interface.js';
import { COMPONENTS } from '../types.js';

@injectable()
export class MongoClientService implements DatabaseClient {
  constructor(
    @inject(COMPONENTS.Logger)
    private readonly logger: ILogger
  ) {}

  public async connect(uri: string): Promise<void> {
    this.logger.info('Connecting to MongoDB');

    await connect(uri);

    this.logger.info('MongoDB connection established');
  }

  public async disconnect(): Promise<void> {
    await disconnect();

    this.logger.info('MongoDB connection closed');
  }
}
