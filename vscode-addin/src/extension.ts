import * as vscode from 'vscode';

import { LogManager, SchemaValidationError } from 'sp-typed-item';
import { VSCodeLogger } from './Logging/VSCodeLogger';
import { GenerateInterfacesCommand } from './Commands/GenerateInterfacesCommand';
import { Command } from './Commands/Command';
import { ConfigNotFoundError } from './Common/ConfigNotFoundError';

export function activate(context: vscode.ExtensionContext) {

    LogManager.externalLogger = new VSCodeLogger();

    LogManager.instance.info('activate');

    let commands: { [key: string]: new (context: vscode.ExtensionContext) => Command } = {
        'extension.generate': GenerateInterfacesCommand
    };

    for (const commandKey in commands) {
        if (commands.hasOwnProperty(commandKey)) {

            ((command) => {
                try {
                    let disposable = vscode.commands.registerCommand(command, async () => {
                        try {
                            const vscodeCommand = new commands[command](context);
                            await vscodeCommand.execute();
                        } catch (error) {
                            if (error instanceof ConfigNotFoundError) {
                                LogManager.instance.warn(error.message);
                                return;
                            }

                            if (error instanceof SchemaValidationError) {
                                LogManager.instance.error(error.errors);
                                LogManager.instance.error('sp-typed-item.json schema validation errors. Errors received: ');
                                return;
                            }

                            LogManager.instance.error(error);
                            LogManager.instance.error(`An error occurred during the execution of the command '${command}'${error && error.message ? ': ' + error.message : ''}`);
                        }
                    });

                    context.subscriptions.push(disposable);
                } catch (error) {
                    LogManager.instance.error(error);
                    throw error;
                }
            })(commandKey);
        }
    }
}
