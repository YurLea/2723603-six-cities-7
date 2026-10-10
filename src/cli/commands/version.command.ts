import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import type { ICommand } from './command.interface.js';

export class VersionCommand implements ICommand {
  public getName(): string {
    return '--version';
  }

  public execute(): void {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const raw = fs.readFileSync(packageJsonPath, 'utf-8');
    const parsed = JSON.parse(raw) as { version?: string };

    console.log(chalk.yellow(parsed.version ?? 'unknown'));
  }
}
