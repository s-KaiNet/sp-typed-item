import * as vscode from 'vscode';

import { LogManager } from 'sp-typed-item';
import { VSCodeLogger } from './Logging/VSCodeLogger';
import { GenerateInterfacesCommand } from './Commands/GenerateInterfacesCommand';
import { Command } from './Commands/Command';
import { ConfigNotFoundError } from './Common/ConfigNotFoundError';

export function activate(context: vscode.ExtensionContext) {

    LogManager.externalLogger = new VSCodeLogger();

    let commands: { [key: string]: new () => Command } = {
        'extension.generate': GenerateInterfacesCommand
    };

    for (const commandKey in commands) {
        if (commands.hasOwnProperty(commandKey)) {

            ((command) => {
                try {
                    let disposable = vscode.commands.registerCommand(command, async () => {
                        try {
                            const vscodeCommand = new commands[command]();
                            await vscodeCommand.execute();
                        } catch (error) {
                            if (error instanceof ConfigNotFoundError) {
                                LogManager.instance.warn(error.message);
                                return;
                            }

                            LogManager.instance.error(`An error occurred during the execution of the command '${command}'`);
                            LogManager.instance.error(error);
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
