import * as vscode from 'vscode';

import { Command } from './Command';
import { Pipeline } from '../UserInput/Pipeline';
import { AuthContext } from '../UserInput/AuthOptions/AuthContext';
import { EnvironmentSelectionStep } from '../UserInput/AuthOptions/EnvironmentSelectionStep';

export class GenerateInterfacesCommand extends Command {
    constructor(context: vscode.ExtensionContext) {
        super(context);
    }

    public async execute(): Promise<void> {
        let authConfig = (await Pipeline.process({
            config: this.config,
            auth: {} as any
        } as AuthContext, new EnvironmentSelectionStep())).auth;

        console.log(authConfig);
    }
}
