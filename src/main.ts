import 'reflect-metadata';
import dotenv from 'dotenv';

import { createContainer } from './app/container.js';
import { COMPONENTS } from './shared/types.js';
import { Application } from './app/application.js';

dotenv.config();

const container = createContainer();
const app = container.get<Application>(COMPONENTS.Application);

await app.init();
