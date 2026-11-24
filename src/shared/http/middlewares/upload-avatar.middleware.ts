import multer from 'multer';
import { nanoid } from 'nanoid';
import { mkdirSync } from 'node:fs';
import { extension } from 'mime-types';
import type { Middleware } from '../middleware.interface.js';
import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../http-error.js';
import { StatusCodes } from 'http-status-codes';

export class UploadAvatarMiddleware implements Middleware {
  private readonly upload: ReturnType<typeof multer>;
  constructor(uploadDirectory: string) {
    mkdirSync(uploadDirectory, { recursive: true });
    this.upload = multer({
      storage: multer.diskStorage({
        destination: uploadDirectory,
        filename: (_req, file, callback) => {
          const fileExtension = extension(file.mimetype);
          if (!['image/jpeg', 'image/png'].includes(file.mimetype) || !fileExtension) {
            callback(new Error('Only JPEG and PNG images are allowed'), '');
            return;
          }
          callback(null, `${nanoid()}.${fileExtension}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
          return callback(null, true);
        }
        return callback(new Error('Only JPEG and PNG images are allowed'));
      },
    });
  }

  public execute(req: Request, res: Response, next: NextFunction): void {
    this.upload.single('avatar')(req, res, (error: unknown) => {
      if (error) {
        next(new HttpError(StatusCodes.BAD_REQUEST, error instanceof Error ? error.message : 'Upload failed'));
        return;
      }
      if (!req.file) {
        next(new HttpError(StatusCodes.BAD_REQUEST, 'Avatar file is required'));
        return;
      }
      next();
    });
  }
}
