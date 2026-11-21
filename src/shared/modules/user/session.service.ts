import { randomBytes } from 'node:crypto';
import type { Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { HttpError } from '../../http/http-error.js';

type Session = {
  userId: string;
  expiresAt: number;
};

export class SessionService {
  private readonly sessions = new Map<string, Session>();

  constructor(private readonly ttlSeconds: number) {}

  private removeExpired(): void {
    const now = Date.now();

    for (const [token, session] of this.sessions) {
      if (session.expiresAt <= now) {
        this.sessions.delete(token);
      }
    }
  }

  private getToken(req: Request): string | undefined {
    const authorization = req.get('Authorization');

    if (!authorization) {
      return undefined;
    }

    const match = /^Bearer ([^\s]+)$/i.exec(authorization);

    if (!match) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid authorization header'
      );
    }

    return match[1];
  }

  public create(userId: string): string {
    this.removeExpired();

    const token = randomBytes(32).toString('hex');

    this.sessions.set(token, {
      userId,
      expiresAt: Date.now() + this.ttlSeconds * 1000,
    });

    return token;
  }

  public getUserId(req: Request): string | undefined {
    this.removeExpired();

    const token = this.getToken(req);

    if (!token) {
      return undefined;
    }

    const session = this.sessions.get(token);

    if (!session) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid or expired token'
      );
    }

    return session.userId;
  }

  public requireUserId(req: Request): string {
    const userId = this.getUserId(req);

    if (!userId) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Authentication required'
      );
    }

    return userId;
  }

  public destroy(req: Request): void {
    this.requireUserId(req);

    const token = this.getToken(req);

    if (token) {
      this.sessions.delete(token);
    }
  }
}
