import fs from 'node:fs';
import path from 'node:path';
import { createInterface } from 'node:readline';

export class TSVFileReader {
  public async read(
    filePath: string,
    onLine: (line: string, lineNumber: number) => void | Promise<void>
  ): Promise<void> {
    const resolvedPath = path.resolve(process.cwd(), filePath);

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Файл не найден: ${resolvedPath}`);
    }

    const stream = fs.createReadStream(resolvedPath, { encoding: 'utf-8' });
    const rl = createInterface({ input: stream, crlfDelay: Infinity });

    let lineNumber = 0;
    for await (const line of rl) {
      lineNumber += 1;
      const trimmed = line.trim();
      if (!trimmed) {
        continue;
      }
      await onLine(trimmed, lineNumber);
    }
  }
}
