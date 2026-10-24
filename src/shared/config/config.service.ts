import convict, { type Config } from 'convict';
import { createRequire } from 'node:module';
import { injectable } from 'inversify';
import type { AppConfig } from './config.type.js';

const require = createRequire(import.meta.url);
const addFormats = require('convict-format-with-validator');

@injectable()
export class ConfigService {
  private readonly config: Config<AppConfig>;

  constructor() {
    convict.addFormats(addFormats);

    convict.addFormat({
      name: 'non-empty-string',
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.trim().length === 0) {
          throw new Error('must be a non-empty string');
        }
      }
    });

    this.config = convict<AppConfig>({
      port: {
        doc: 'Port for incoming connections',
        format: 'port',
        env: 'PORT',
        default: 0
      },
      dbHost: {
        doc: 'Database server address (ip)',
        format: 'ipaddress',
        env: 'DB_HOST',
        default: ''
      },
      salt: {
        doc: 'Salt',
        format: 'non-empty-string',
        env: 'SALT',
        default: ''
      }
    });

    this.config.validate({ allowed: 'strict' });
  }

  public getPort(): number {
    return this.config.get('port');
  }

  public getDbHost(): string {
    return this.config.get('dbHost');
  }

  public getSalt(): string {
    return this.config.get('salt');
  }
}
