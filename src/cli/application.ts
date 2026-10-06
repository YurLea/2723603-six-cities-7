import chalk from 'chalk';
import type { ICommand } from './commands/command.interface.js';

export class CLIApplication {
  private readonly commands = new Map<string, ICommand>();

  constructor(private readonly defaultCommand: ICommand) {}

  public register(command: ICommand): void {
    this.commands.set(command.getName(), command);
  }

  public async process(argv: string[]): Promise<void> {
    const [, , ...args] = argv;
    const [commandName, ...commandArgs] = args;

    const command = commandName ? this.commands.get(commandName) : this.defaultCommand;

    if (!command) {
      console.log(chalk.red(`Неизвестная команда: ${commandName}\n`));
      await this.defaultCommand.execute([]);
      process.exitCode = 1;
      return;
    }

    await command.execute(commandArgs);
  }
}
