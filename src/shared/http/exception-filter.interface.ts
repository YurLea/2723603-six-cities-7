import type { ErrorRequestHandler } from 'express';

export interface ExceptionFilter {
  readonly catch: ErrorRequestHandler;
}
