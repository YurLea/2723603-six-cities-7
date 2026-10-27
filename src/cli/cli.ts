#!/usr/bin/env node
import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import chalk from 'chalk';

import { createContainer } from '../app/container.js';
import { CLIApplication } from './application.js';
import { HelpCommand } from './commands/help.command.js';
import { VersionCommand } from './commands/version.command.js';
import { GenerateCommand } from './commands/generate.command.js';
import { ImportCommand } from './commands/import.command.js';

const HELP_TEXT = `
${chalk.bold('Программа для подготовки данных для REST API сервера.')}

${chalk.bold('Пример:')} cli.js --<command> [--arguments]

${chalk.bold('Команды:')}
  ${chalk.cyan('--version')}                                  выводит номер версии
  ${chalk.cyan('--help')}                                     печатает этот текст
  ${chalk.cyan('--import <path> <mongoUri>')}                 импортирует TSV в MongoDB
  ${chalk.cyan('--generate <n> <path> <url>')}                генерирует TSV с тестовыми данными
`.trim();

const helpCommand = new HelpCommand(HELP_TEXT);
const app = new CLIApplication(helpCommand);

const container = createContainer();
const importCommand = container.get(ImportCommand);

app.register(helpCommand);
app.register(new VersionCommand());
app.register(importCommand);
app.register(new GenerateCommand());

await app.process(process.argv);
