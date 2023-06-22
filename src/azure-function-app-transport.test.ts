import { Context } from '@azure/functions';
import { createLogger, format } from 'winston';
import { AzureContextLogger } from './azure-function-app-transport';

const getMockContext = (): Partial<Context> => ({
  log: Object.assign(jest.fn(), {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    verbose: jest.fn(),
  }),
});

describe('AzureContextLogger', () => {
  it('should log messages correctly', () => {
    const context = getMockContext() as Context;
    const logger = createLogger({
      format: format.combine(format.json()),
      transports: [
        new AzureContextLogger({
          context,
        }),
      ],
    });

    logger.info('This is an info message');

    expect(context.log).toHaveBeenCalledWith(
      expect.stringContaining('This is an info message'),
    );
  });

  it('should pass in the format options', () => {
    const context = getMockContext() as Context;
    const logger = createLogger({
      format: format.combine(format.errors({ stack: true }), format.json()),
      transports: [
        new AzureContextLogger({
          context,
        }),
      ],
    });

    logger.error(new Error('This is an error message'));

    expect(context.log).toHaveBeenCalledWith(expect.stringContaining('stack'));
  });
});
