import convict from 'convict';
import { injectable } from 'inversify';
import { type Config } from 'convict';
import { createRequire } from 'node:module';

import type { AppConfig } from './config.type.js';

const require = createRequire(import.meta.url);
const addFormats = require('convict-format-with-validator');

@injectable()
export class ConfigService {
  private readonly config: Config<AppConfig>;

  constructor() {
    const requiredVariables = [
      'PORT',
      'DB_HOST',
      'MONGO_URI',
      'SALT',
      'SESSION_TTL_SECONDS',
    ];

    for (const variable of requiredVariables) {
      if (!process.env[variable]?.trim()) {
        throw new Error(`Environment variable ${variable} is required`);
      }
    }

    convict.addFormats(addFormats);

    convict.addFormat({
      name: 'non-empty-string',
      validate: (value: unknown): void => {
        if (typeof value !== 'string' || value.trim().length === 0) {
          throw new Error('must be a non-empty string');
        }
      },
    });

    this.config = convict<AppConfig>({
      port: {
        doc: 'Port for incoming connections',
        format: 'port',
        env: 'PORT',
        default: 0,
      },
      dbHost: {
        doc: 'Database server address',
        format: 'ipaddress',
        env: 'DB_HOST',
        default: '',
      },
      mongoUri: {
        doc: 'MongoDB connection URI',
        format: 'non-empty-string',
        env: 'MONGO_URI',
        default: '',
        sensitive: true,
      },
      salt: {
        doc: 'Password hashing salt',
        format: 'non-empty-string',
        env: 'SALT',
        default: '',
        sensitive: true,
      },
      sessionTtlSeconds: {
        doc: 'Session lifetime in seconds',
        format: 'nat',
        env: 'SESSION_TTL_SECONDS',
        default: 0,
      },
    });

    this.config.validate({ allowed: 'strict' });

    if (this.config.get('port') === 0) {
      throw new Error('PORT must be greater than 0');
    }

    if (this.config.get('sessionTtlSeconds') === 0) {
      throw new Error('SESSION_TTL_SECONDS must be greater than 0');
    }
  }

  public getPort(): number {
    return this.config.get('port');
  }

  public getDbHost(): string {
    return this.config.get('dbHost');
  }

  public getMongoUri(): string {
    return this.config.get('mongoUri');
  }

  public getSalt(): string {
    return this.config.get('salt');
  }

  public getSessionTtlSeconds(): number {
    return this.config.get('sessionTtlSeconds');
  }
}
