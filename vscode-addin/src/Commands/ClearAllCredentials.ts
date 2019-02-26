import * as vscode from 'vscode';

import { Command } from './Command';

export class ClearAllCredentials extends Command {
    constructor(context: vscode.ExtensionContext) {
        super(context);
    }

    public async execute(): Promise<void> {
        throw new Error('not implemented');
    }
}
