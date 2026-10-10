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

    let okCount = 0;

    try {
      await this.fileReader.read(filePath, (line, lineNumber) => {
        try {
          const offer = this.parser.parse(line);
          okCount += 1;
          console.log(
            `${chalk.green('[OK]')} ${offer.title} — ${chalk.gray(offer.city.name)} — €${offer.price}`
          );
        } catch (e) {
          const message = e instanceof Error ? e.message : String(e);
          console.log(chalk.red(`[ERROR] строка ${lineNumber}: ${message}`));
        }
      });

      console.log(chalk.bold(`\nИмпорт завершён. Успешно: ${okCount}\n`));
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.log(chalk.red(message));
      process.exitCode = 1;
    }
  }
}
