import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { Middleware } from '../middleware.interface.js';
import { HttpError } from '../http-error.js';

export interface FindByIdService {
  findById(id: string): Promise<unknown | null>;
}

export class ValidateExistenceMiddleware implements Middleware {
  constructor(
    private readonly param: string,
    private readonly service: FindByIdService,
    private readonly entityName: string,
    private readonly getId?: (req: Request) => string
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = this.getId ? this.getId(req) : req.params[this.param];
    const entity = await this.service.findById(id);
    if (!entity) {
      throw new HttpError(StatusCodes.NOT_FOUND, `${this.entityName} not found`);
    }
    res.locals[`${this.param}Entity`] = entity;
    next();
  }
}
