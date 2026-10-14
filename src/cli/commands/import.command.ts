import chalk from 'chalk';
import type { ICommand } from './command.interface.js';
import { TSVFileReader } from '../tsv/tsv-file-reader.js';
import { TSVOfferParser } from '../tsv/tsv-offer.parser.js';

export class ImportCommand implements ICommand {
  constructor(
    private readonly fileReader: TSVFileReader,
    private readonly parser: TSVOfferParser
  ) {}

  public getName(): string {
    return '--import';
  }

  public async execute(args: string[]): Promise<void> {
    const [filePath] = args;

    if (!filePath) {
      console.log(chalk.red('Не указан путь. Пример: --import ./mocks/offers.tsv'));
      process.exitCode = 1;
      return;
    }

    let total = 0;
    let ok = 0;
    let errors = 0;
    const startedAt = Date.now();

    try {
      await this.fileReader.read(filePath, (line, lineNumber) => {
        total += 1;

        try {
          this.parser.parse(line);
          ok += 1;

          if (total % 100000 === 0) {
            console.log(chalk.gray(`Прочитано строк: ${total}...`));
          }
        } catch (e) {
          errors += 1;
          const message = e instanceof Error ? e.message : String(e);
          console.log(chalk.red(`[ERROR] строка ${lineNumber}: ${message}`));
        }
      });

      const seconds = (Date.now() - startedAt) / 1000;
      const speed = seconds > 0 ? Math.round(total / seconds) : total;

      console.log(chalk.bold('\nИмпорт завершён.'));
      console.log(`${chalk.green('Успешно:')} ${ok}`);
      console.log(`${chalk.red('Ошибок:')} ${errors}`);
      console.log(`${chalk.cyan('Всего строк:')} ${total}`);
      console.log(chalk.gray(`Время: ${seconds.toFixed(2)}s, скорость: ~${speed} строк/с\n`));
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.log(chalk.red(message));
      process.exitCode = 1;
    }
  }
}
