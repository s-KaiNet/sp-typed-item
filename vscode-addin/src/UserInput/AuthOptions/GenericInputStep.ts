import * as vscode from 'vscode';

import { AuthContext } from './AuthContext';
import { Step } from '../Step';

export abstract class GenericInputStep<T extends AuthContext> extends Step<T> {
    protected input: vscode.InputBox;

    constructor(context: T) {
        super();

        let input = vscode.window.createInputBox();
        input.title = `Target SharePoint site: ${context.config.siteUrl}`;
        input.ignoreFocusOut = true;
    }

    public async execute(context: T): Promise<Step<T>> {
        return new Promise((resolve, reject) => {
            this.input.onDidAccept(() => {
                if (!this.input.value) {
                    this.input.validationMessage = 'Should\'n be empty';
                    return;
                }

                let next = this.resolveNextStep(context);
                this.input.dispose();
                resolve(next);
            });

            this.input.show();
        });

    }

    protected abstract resolveNextStep(context: T): Step<T>;
}
