import crypto from 'node:crypto';

export function createSha256(password: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}
