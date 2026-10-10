import type { ICommand } from './command.interface.js';

export class HelpCommand implements ICommand {
  constructor(private readonly helpText: string) {}

  public getName(): string {
    return '--help';
  }

  public execute(): void {
    console.log(this.helpText);
  }
}
