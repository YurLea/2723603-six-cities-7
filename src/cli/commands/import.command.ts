import chalk from 'chalk';
import { inject, injectable } from 'inversify';

import type { ICommand } from './command.interface.js';
import { TSVFileReader } from '../tsv/tsv-file-reader.js';
import { TSVOfferParser } from '../tsv/tsv-offer.parser.js';

import { COMPONENTS } from '../../shared/types.js';
import type { ILogger } from '../../shared/logger/logger.interface.js';
import type { DatabaseClient } from '../../shared/database/database-client.interface.js';
import type { UserService } from '../../shared/modules/user/user-service.interface.js';
import type { OfferService } from '../../shared/modules/offer/offer-service.interface.js';
import { ConfigService } from '../../shared/config/config.service.js';
import { createSha256 } from '../../shared/helpers/hash.js';

@injectable()
export class ImportCommand implements ICommand {
  constructor(
    private readonly fileReader: TSVFileReader,
    private readonly parser: TSVOfferParser,

    @inject(COMPONENTS.Logger) private readonly logger: ILogger,
    @inject(COMPONENTS.DatabaseClient) private readonly dbClient: DatabaseClient,
    @inject(COMPONENTS.UserService) private readonly userService: UserService,
    @inject(COMPONENTS.OfferService) private readonly offerService: OfferService,
    @inject(COMPONENTS.Config) private readonly config: ConfigService,
  ) {}

  public getName(): string {
    return '--import';
  }

  public async execute(args: string[]): Promise<void> {
    const [filePath, mongoUri] = args;

    if (!filePath || !mongoUri) {
      console.log(chalk.red('Не указаны аргументы.'));
      console.log(chalk.gray('Пример: --import ./mocks/offers.tsv mongodb://127.0.0.1:27017/six-cities'));
      process.exitCode = 1;
      return;
    }

    let total = 0;
    let ok = 0;
    let errors = 0;
    const startedAt = Date.now();

    const userIdCache = new Map<string, unknown>();

    await this.dbClient.connect(mongoUri);

    try {
      const salt = this.config.getSalt();

      await this.fileReader.read(filePath, async (line, lineNumber) => {
        if (!line.trim()) {
          return;
        }

        total += 1;

        try {
          const offer = this.parser.parse(line);

          let userId = userIdCache.get(offer.author.email);

          if (!userId) {
            let userDoc = await this.userService.findByEmail(offer.author.email);

            if (!userDoc) {
              userDoc = await this.userService.create({
                name: offer.author.name,
                email: offer.author.email,
                avatarUrl: offer.author.avatarUrl ?? null,
                type: offer.author.type,
                passwordHash: createSha256(offer.author.password, salt),
              });
            }

            userId = userDoc._id;
            userIdCache.set(offer.author.email, userId);
          }

          await this.offerService.create({
            title: offer.title,
            description: offer.description,
            postDate: offer.postDate,

            city: offer.city,

            previewImage: offer.previewImage,
            images: offer.images,

            isPremium: offer.isPremium,
            isFavorite: offer.isFavorite,

            rating: offer.rating,
            type: offer.type,

            bedrooms: offer.bedrooms,
            maxAdults: offer.maxAdults,

            price: offer.price,
            goods: offer.goods,

            author: userId as any,
            commentsCount: offer.commentsCount,

            location: offer.location,
          });

          ok += 1;

          if (total % 100000 === 0) {
            this.logger.info(`Processed lines: ${total}`);
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
    } finally {
      await this.dbClient.disconnect();
    }
  }
}
