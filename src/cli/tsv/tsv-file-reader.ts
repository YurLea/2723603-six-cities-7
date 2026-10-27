import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { injectable } from 'inversify';

@injectable()
export class TSVFileReader {
  public async read(
    filePath: string,
    onLine: (line: string, lineNumber: number) => void | Promise<void>
  ): Promise<void> {
    const rl = createInterface({
      input: createReadStream(filePath),
      crlfDelay: Infinity
    });

    let lineNumber = 0;

    for await (const line of rl) {
      lineNumber += 1;
      await onLine(line, lineNumber);
    }
  }
}
