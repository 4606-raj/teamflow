import { Logger } from '@nestjs/common';
import { inspect } from 'node:util';

declare global {
  /** Debug logger: l('label', someVar, { a: 1 }) */
  // eslint-disable-next-line no-var
  var l: (...args: unknown[]) => void;
}

const logger = new Logger('DEBUG');

const callerLocation = () => {
  // stack[0] = "Error", [1] = this fn, [2] = l(), [3] = the caller
  const line = new Error().stack?.split('\n')[3] ?? '';
  const match = line.match(/\(?([^()\s]+:\d+):\d+\)?$/);

  return match ? match[1].split('/').slice(-2).join('/') : '';
};

globalThis.l = (...args: unknown[]) => {
  if (process.env.NODE_ENV === 'production') return;

  const body = args
    .map((arg) =>
      typeof arg === 'string' ? arg : inspect(arg, { depth: 4, colors: false }),
    )
    .join(' ');

  logger.debug(`${callerLocation()} → ${body}`);
};
