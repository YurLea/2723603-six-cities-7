import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import got from 'got';

import type { ICommand } from './command.interface.js';
import type { MockServerData, MockItem } from '../generate/mock-server-data.type.js';
import { TSVOfferGenerator } from '../generate/tsv-offer-generator.js';

function isPositiveInteger(value: string): boolean {
  const n = Number(value);
  return Number.isInteger(n) && n > 0;
}

function normalizeBaseUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

async function writeLine(stream: fs.WriteStream, line: string): Promise<void> {
  if (!stream.write(`${line}\n`)) {
    await new Promise<void>((resolve) => stream.once('drain', resolve));
  }
}

async function loadMockServerData(baseUrl: string): Promise<MockServerData> {
  const url = normalizeBaseUrl(baseUrl);

  const [
    titles,
    descriptions,
    previewImages,
    images,
    userNames,
    userEmails,
    userAvatars,
  ] = await Promise.all([
    got(`${url}/titles`).json<MockItem[]>(),
    got(`${url}/descriptions`).json<MockItem[]>(),
    got(`${url}/previewImages`).json<MockItem[]>(),
    got(`${url}/images`).json<MockItem[]>(),
    got(`${url}/userNames`).json<MockItem[]>(),
    got(`${url}/userEmails`).json<MockItem[]>(),
    got(`${url}/userAvatars`).json<MockItem[]>(),
  ]);

  return { titles, descriptions, previewImages, images, userNames, userEmails, userAvatars };
}

export class GenerateCommand implements ICommand {
  public getName(): string {
    return '--generate';
  }

  public async execute(args: string[]): Promise<void> {
    const [countRaw, filePathRaw, url] = args;

    if (!countRaw || !filePathRaw || !url) {
      console.log(chalk.red('Использование: --generate <n> <filepath> <url>'));
      process.exitCode = 1;
      return;
    }

    if (!isPositiveInteger(countRaw)) {
      console.log(chalk.red('<n> должно быть положительным целым числом'));
      process.exitCode = 1;
      return;
    }

    const count = Number(countRaw);
    const filePath = path.resolve(process.cwd(), filePathRaw);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    let mockData: MockServerData;
    try {
      mockData = await loadMockServerData(url);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.log(chalk.red(`Не удалось получить данные с mock-server: ${message}`));
      process.exitCode = 1;
      return;
    }

    const generator = new TSVOfferGenerator(mockData);
    const stream = fs.createWriteStream(filePath, { encoding: 'utf-8', flags: 'w' });

    try {
      for (let i = 0; i < count; i++) {
        await writeLine(stream, generator.generate());
      }

      await new Promise<void>((resolve, reject) => {
        stream.end(() => resolve());
        stream.on('error', reject);
      });

      console.log(chalk.green(`Готово. Сгенерировано ${count} строк в файл: ${filePath}`));
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.log(chalk.red(`Ошибка записи файла: ${message}`));
      process.exitCode = 1;
    }
  }
}
