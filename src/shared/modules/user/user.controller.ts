import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import type { ILogger } from '../../logger/logger.interface.js';
import { Controller } from '../../http/controller.abstract.js';
import { HttpError } from '../../http/http-error.js';
import { ValidateDtoMiddleware } from '../../http/middlewares/validate-dto.middleware.js';
import { userToResponse } from '../../helpers/document-to-response.js';

import type { UserService } from './user-service.interface.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { SessionService } from './session.service.js';

export class UserController extends Controller {
  constructor(
    logger: ILogger,
    private readonly userService: UserService,
    private readonly sessions: SessionService
  ) {
    super(logger);

    this.addRoute({
      path: '/register',
      method: 'post',
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateUserDto),
      ],
    });

    this.addRoute({
      path: '/login',
      method: 'post',
      handler: this.login,
      middlewares: [
        new ValidateDtoMiddleware(LoginUserDto),
      ],
    });

    this.addRoute({
      path: '/login',
      method: 'get',
      handler: this.checkAuth,
    });

    this.addRoute({
      path: '/logout',
      method: 'post',
      handler: this.logout,
    });
  }

  private async create(
    req: Request<Record<string, string>, unknown, CreateUserDto>,
    res: Response
  ): Promise<void> {
    if (this.sessions.getUserId(req)) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Registration is available only to anonymous users'
      );
    }

    const existingUser = await this.userService.findByEmail(req.body.email);

    if (existingUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        'User with this email already exists'
      );
    }

    const user = await this.userService.create(req.body);

    this.created(res, userToResponse(user));
  }

  private async login(
    req: Request<Record<string, string>, unknown, LoginUserDto>,
    res: Response
  ): Promise<void> {
    const user = await this.userService.verify(req.body);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid email or password'
      );
    }

    const token = this.sessions.create(String(user._id));

    this.ok(res, {
      ...userToResponse(user),
      token,
    });
  }

  private async checkAuth(
    req: Request,
    res: Response
  ): Promise<void> {
    const userId = this.sessions.requireUserId(req);
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'User no longer exists'
      );
    }

    this.ok(res, userToResponse(user));
  }

  private logout(req: Request, res: Response): void {
    this.sessions.destroy(req);
    this.noContent(res);
  }
}
