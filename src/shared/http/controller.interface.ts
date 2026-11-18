import type { Router } from 'express';

export interface ControllerInterface {
  readonly router: Router;
}

