import * as vscode from 'vscode';

import { TypedItemCommand } from './TypedItemCommand';

export class ResetWorkspaceCredentials extends TypedItemCommand {
    constructor(context: vscode.ExtensionContext) {
        super(context);
    }

    public async execute(): Promise<void> {
        throw new Error('not implemented');
    }
}
