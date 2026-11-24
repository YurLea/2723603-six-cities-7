import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import type { ILogger } from '../../logger/logger.interface.js';
import { Controller } from '../../http/controller.abstract.js';
import { HttpError } from '../../http/http-error.js';
import { ValidateObjectIdMiddleware } from '../../http/middlewares/validate-objectid.middleware.js';
import { ValidateExistenceMiddleware } from '../../http/middlewares/validate-existence.middleware.js';

import {
  offerToResponse,
  offerPreviewToResponse,
} from '../../helpers/document-to-response.js';

import type { FavoriteService } from './favorite-service.interface.js';
import type { OfferService } from '../offer/offer-service.interface.js';
import { SessionService } from '../user/session.service.js';

type FavoriteParams = {
  offerId: string;
  status: string;
};

export class FavoriteController extends Controller {
  constructor(
    logger: ILogger,
    private readonly favoriteService: FavoriteService,
    private readonly offerService: OfferService,
    private readonly sessions: SessionService
  ) {
    super(logger);

    this.addRoute({
      path: '/',
      method: 'get',
      handler: this.index,
    });

    this.addRoute({
      path: '/:offerId/:status',
      method: 'post',
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateExistenceMiddleware('offerId', this.offerService, 'Offer'),
      ],
    });
  }

  private async index(req: Request, res: Response): Promise<void> {
    const userId = this.sessions.requireUserId(req);
    const offers = await this.offerService.findFavorites(userId);

    this.ok(
      res,
      offers.map((offer) => offerPreviewToResponse(offer, true))
    );
  }

  private async update(
    req: Request<FavoriteParams>,
    res: Response
  ): Promise<void> {
    const userId = this.sessions.requireUserId(req);
    const { offerId, status } = req.params;

    if (status !== '0' && status !== '1') {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Favorite status must be 0 or 1'
      );
    }

    const offer = await this.offerService.findById(offerId);

    if (status === '1') {
      await this.favoriteService.add(userId, offerId);
    } else {
      await this.favoriteService.remove(userId, offerId);
    }

    this.ok(res, offerToResponse(offer!, status === '1'));
  }
}
