import { LogManager } from 'sp-typed-item';
import { Command } from './Command';

export class GenerateInterfacesCommand extends Command {
    constructor() {
        super();
    }

    public async execute(): Promise<void> {
        LogManager.instance.info('inside execute');
    }
}
