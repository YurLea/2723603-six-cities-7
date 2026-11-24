import type { Request, Response } from 'express';
import type { Document } from 'mongoose';
import { StatusCodes } from 'http-status-codes';

import type { CityName } from '../../../types/city.type.js';
import type { ILogger } from '../../logger/logger.interface.js';
import { Controller } from '../../http/controller.abstract.js';
import { HttpError } from '../../http/http-error.js';
import { ValidateObjectIdMiddleware } from '../../http/middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../http/middlewares/validate-dto.middleware.js';
import { ValidateExistenceMiddleware } from '../../http/middlewares/validate-existence.middleware.js';

import {
  offerToResponse,
  offerPreviewToResponse,
} from '../../helpers/document-to-response.js';

import type { OfferService } from './offer-service.interface.js';
import type { FavoriteService } from '../favorite/favorite-service.interface.js';
import { SessionService } from '../user/session.service.js';

import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';

type OfferParams = {
  offerId: string;
};

export class OfferController extends Controller {
  constructor(
    logger: ILogger,
    private readonly offerService: OfferService,
    private readonly favoriteService: FavoriteService,
    private readonly sessions: SessionService
  ) {
    super(logger);

    this.addRoute({
      path: '/',
      method: 'get',
      handler: this.index,
    });

    this.addRoute({
      path: '/',
      method: 'post',
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateOfferDto),
      ],
    });

    this.addRoute({
      path: '/premium/:city',
      method: 'get',
      handler: this.indexPremium,
    });

    this.addRoute({
      path: '/:offerId',
      method: 'get',
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateExistenceMiddleware('offerId', this.offerService, 'Offer'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: 'patch',
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new ValidateExistenceMiddleware('offerId', this.offerService, 'Offer'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: 'delete',
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateExistenceMiddleware('offerId', this.offerService, 'Offer'),
      ],
    });
  }

  private async getOffer(offerId: string): Promise<Document> {
    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Offer not found'
      );
    }

    return offer;
  }

  private async getFavoriteIds(req: Request): Promise<Set<string>> {
    const userId = this.sessions.getUserId(req);

    if (!userId) {
      return new Set<string>();
    }

    const ids = await this.favoriteService.findOfferIds(userId);

    return new Set(ids.map((id) => String(id)));
  }

  private async index(req: Request, res: Response): Promise<void> {
    const limit = req.query.limit === undefined
      ? 60
      : Number(req.query.limit);

    if (!Number.isSafeInteger(limit) || limit < 1) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Limit must be a positive integer'
      );
    }

    const favoriteIds = await this.getFavoriteIds(req);
    const offers = await this.offerService.find(limit);

    this.ok(
      res,
      offers.map((offer) => offerPreviewToResponse(
        offer,
        favoriteIds.has(String(offer._id))
      ))
    );
  }

  private async show(
    req: Request<OfferParams>,
    res: Response
  ): Promise<void> {
    const favoriteIds = await this.getFavoriteIds(req);
    const offer = res.locals.offerIdEntity as Document;

    this.ok(
      res,
      offerToResponse(offer, favoriteIds.has(String(offer._id)))
    );
  }

  private async create(
    req: Request<Record<string, string>, unknown, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const userId = this.sessions.requireUserId(req);
    const created = await this.offerService.create(req.body, userId);

    const offer = await this.getOffer(String(created._id));

    this.created(res, offerToResponse(offer, false));
  }

  private async update(
    req: Request<OfferParams, unknown, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const userId = this.sessions.requireUserId(req);

    const offer = await this.offerService.updateById(
      req.params.offerId,
      req.body,
      userId
    );

    const isFavorite = await this.favoriteService.exists(
      userId,
      req.params.offerId
    );

    this.ok(res, offerToResponse(offer, isFavorite));
  }

  private async delete(
    req: Request<OfferParams>,
    res: Response
  ): Promise<void> {
    const userId = this.sessions.requireUserId(req);

    await this.offerService.deleteById(req.params.offerId, userId);

    this.noContent(res);
  }

  private async indexPremium(
    req: Request<{ city: string }>,
    res: Response
  ): Promise<void> {
    const favoriteIds = await this.getFavoriteIds(req);

    const offers = await this.offerService.findPremiumByCity(
      req.params.city as CityName
    );

    this.ok(
      res,
      offers.map((offer) => offerPreviewToResponse(
        offer,
        favoriteIds.has(String(offer._id))
      ))
    );
  }
}
