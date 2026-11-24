import type { Request, Response } from 'express';
import type { ILogger } from '../../logger/logger.interface.js';
import { Controller } from '../../http/controller.abstract.js';
import { ValidateObjectIdMiddleware } from '../../http/middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../http/middlewares/validate-dto.middleware.js';
import { ValidateExistenceMiddleware } from '../../http/middlewares/validate-existence.middleware.js';
import { commentToResponse } from '../../helpers/document-to-response.js';

import type { CommentService } from './comment-service.interface.js';
import type { OfferService } from '../offer/offer-service.interface.js';
import { SessionService } from '../user/session.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

type CommentParams = {
  offerId: string;
};

export class CommentController extends Controller {
  constructor(
    logger: ILogger,
    private readonly commentService: CommentService,
    private readonly offerService: OfferService,
    private readonly sessions: SessionService
  ) {
    super(logger);

    this.addRoute({
      path: '/:offerId',
      method: 'get',
      handler: this.index,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateExistenceMiddleware('offerId', this.offerService, 'Offer'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: 'post',
      handler: this.create,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(CreateCommentDto),
        new ValidateExistenceMiddleware('offerId', this.offerService, 'Offer'),
      ],
    });
  }

  private async index(
    req: Request<CommentParams>,
    res: Response
  ): Promise<void> {
    const { offerId } = req.params;

    const comments = await this.commentService.findByOfferId(offerId);

    this.ok(
      res,
      comments.map((comment) => commentToResponse(comment))
    );
  }

  private async create(
    req: Request<CommentParams, unknown, CreateCommentDto>,
    res: Response
  ): Promise<void> {
    const userId = this.sessions.requireUserId(req);
    const { offerId } = req.params;

    const comment = await this.commentService.create(
      req.body,
      offerId,
      userId
    );

    this.created(res, commentToResponse(comment));
  }
}
