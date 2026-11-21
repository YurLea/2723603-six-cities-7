import { StatusCodes } from 'http-status-codes';

import { HttpError } from './http-error.js';
import type { ValidationErrorField } from './validation-error-field.type.js';

export class ValidationError extends HttpError {
  public readonly details: ValidationErrorField[];

  constructor(message: string, details: ValidationErrorField[]) {
    super(StatusCodes.BAD_REQUEST, message);
    this.name = 'ValidationError';
    this.details = details;
  }
}
