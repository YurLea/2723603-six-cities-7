import pino, { Logger as PinoLogger } from 'pino';
import { injectable } from 'inversify';
import { ILogger } from './logger.interface.js';

@injectable()
export class LoggerService implements ILogger {
  private readonly logger: PinoLogger;

  constructor() {
    this.logger = pino({
      level: process.env.LOG_LEVEL ?? 'info',
    });
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info({ args }, message);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn({ args }, message);
  }

  public error(message: string, ...args: unknown[]): void {
    this.logger.error({ args }, message);
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug({ args }, message);
  }
}
