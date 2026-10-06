import fs from 'node:fs';
import path from 'node:path';

const filePath = path.resolve(process.cwd(), 'dist', 'cli', 'cli.js');

if (!fs.existsSync(filePath)) {
  throw new Error(`File not found: ${filePath}`);
}

const content = fs.readFileSync(filePath, 'utf-8');

if (!content.startsWith('#!')) {
  fs.writeFileSync(filePath, `#!/usr/bin/env node\n${content}`, 'utf-8');
}
