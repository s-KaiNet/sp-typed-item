import { Logger } from './Logger';
import { ConsoleLogger } from './ConsoleLogger';

export class LogManager {

    private static logger: Logger;
    public static externalLogger: Logger;

    private constructor() { }

    public static get instance(): Logger {
        if (!LogManager.logger) {
            if (this.externalLogger) {
                LogManager.logger = this.externalLogger;
            } else {
                LogManager.logger = new ConsoleLogger();
            }
        }

        return LogManager.logger;
    }
}
