import { Context } from '@azure/functions';
import Transport, { TransportStreamOptions } from 'winston-transport';

interface Options extends TransportStreamOptions {
  context?: Context;
}

class AzureContextLogger extends Transport {
  readonly context: Context;

  constructor(options?: Options) {
    super(options);

    if (!options?.context)
      throw new Error('Azure function context must be provided');

    this.context = options.context;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    const message = info[Symbol.for('message')] || info.message;
    this.context.log(message);

    callback?.();
  }
}

export default AzureContextLogger;
