#!/usr/bin/env node
import chalk from 'chalk';
import { CLIApplication } from './application.js';
import { HelpCommand } from './commands/help.command.js';
import { VersionCommand } from './commands/version.command.js';
import { ImportCommand } from './commands/import.command.js';
import { TSVFileReader } from './tsv/tsv-file-reader.js';
import { TSVOfferParser } from './tsv/tsv-offer.parser.js';
import { GenerateCommand } from './commands/generate.command.js';

const HELP_TEXT = `
${chalk.bold('Программа для подготовки данных для REST API сервера.')}

${chalk.bold('Пример:')} cli.js --<command> [--arguments]

${chalk.bold('Команды:')}
  ${chalk.cyan('--version')}                          выводит номер версии
  ${chalk.cyan('--help')}                             печатает этот текст
  ${chalk.cyan('--import <path>')}                    импортирует данные из TSV
  ${chalk.cyan('--generate <n> <path> <url>')}        генерирует TSV с тестовыми данными
`.trim();

const helpCommand = new HelpCommand(HELP_TEXT);

const app = new CLIApplication(helpCommand);

app.register(helpCommand);
app.register(new VersionCommand());
app.register(new ImportCommand(new TSVFileReader(), new TSVOfferParser()));
app.register(new GenerateCommand());

await app.process(process.argv);
