import type { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import type { ILogger } from '../logger/logger.interface.js';
import type { ExceptionFilter } from './exception-filter.interface.js';
import { HttpError } from './http-error.js';
import { ValidationError } from './validation-error.js';

export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: ILogger) {}

  public readonly catch: ErrorRequestHandler = (
    error: unknown,
    req,
    res,
    next
  ): void => {
    if (res.headersSent) {
      next(error);
      return;
    }

    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (error instanceof ValidationError) {
      this.logger.warn('Validation error', {
        method: req.method,
        path: req.path,
        statusCode: error.statusCode,
        message: error.message,
        details: error.details,
      });

      res.status(error.statusCode).json({
        error: error.message,
        details: error.details,
      });
      return;
    }

    if (error instanceof HttpError) {
      statusCode = error.statusCode;
      message = error.message;
    } else if (
      error instanceof SyntaxError &&
      'type' in error &&
      error.type === 'entity.parse.failed'
    ) {
      statusCode = StatusCodes.BAD_REQUEST;
      message = 'Invalid JSON';
    } else if (
      error instanceof Error &&
      'type' in error &&
      error.type === 'entity.too.large'
    ) {
      statusCode = StatusCodes.REQUEST_TOO_LONG;
      message = 'Request body is too large';
    } else if (
      error instanceof Error &&
      'code' in error &&
      error.code === 11000
    ) {
      statusCode = StatusCodes.CONFLICT;
      message = 'Resource already exists';
    } else if (
      error instanceof Error &&
      (error.name === 'CastError' || error.name === 'ValidationError')
    ) {
      statusCode = StatusCodes.BAD_REQUEST;
      message = 'Invalid request data';
    }

    const context = {
      method: req.method,
      path: req.path,
      statusCode,
    };

    if (statusCode >= StatusCodes.INTERNAL_SERVER_ERROR) {
      this.logger.error('Unhandled request error', {
        ...context,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    } else {
      this.logger.warn('HTTP request error', {
        ...context,
        message,
      });
    }

    res.status(statusCode).json({ error: message });
  };
}
