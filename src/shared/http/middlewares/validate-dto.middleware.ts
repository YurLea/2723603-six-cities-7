import type { NextFunction, Request, Response } from 'express';
import { type ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';

import type { Middleware } from '../middleware.interface.js';
import { HttpError } from '../http-error.js';
import { ValidationError } from '../validation-error.js';
import { reduceValidationErrors } from '../../helpers/reduce-validation-errors.js';

export class ValidateDtoMiddleware implements Middleware {
  constructor(private readonly dto: ClassConstructor<object>) {}

  public async execute(
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> {
    if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Request body must be a JSON object'
      );
    }

    const dtoInstance = plainToInstance(this.dto, req.body);
    const errors = await validate(dtoInstance, {
      whitelist: true,
    });

    if (errors.length > 0) {
      throw new ValidationError(
        `Validation error: "${req.path}"`,
        reduceValidationErrors(errors)
      );
    }

    req.body = dtoInstance;
    next();
  }
}
