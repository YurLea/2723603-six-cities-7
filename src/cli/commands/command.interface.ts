export interface ICommand {
  getName(): string;
  execute(args: string[]): Promise<void> | void;
}
