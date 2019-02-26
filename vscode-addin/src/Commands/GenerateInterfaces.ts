import * as vscode from 'vscode';
import * as path from 'path';
import { IAuthOptions } from 'node-sp-auth';
import { AuthConfig } from 'node-sp-auth-config';
import { SPTypedItem } from 'sp-typed-item';

import { TypedItemCommand } from './TypedItemCommand';
import { Pipeline } from '../UserInput/Pipeline';
import { AuthContext } from '../UserInput/AuthOptions/AuthContext';
import { EnvironmentSelectionStep } from '../UserInput/AuthOptions/EnvironmentSelectionStep';
import { getUserDataFolder, resolveFileName, pathExists } from '../Common/Utils';

export class GenerateInterfaces extends TypedItemCommand {
    constructor(context: vscode.ExtensionContext) {
        super(context);
    }

    public async execute(): Promise<void> {

        // if auth not provided, read it from user app data folder
        if (!this.config.authConfigPath) {
            let userDataPath = await getUserDataFolder();
            let authConfigPath = path.join(userDataPath, resolveFileName(this.config.siteUrl));
            let configExists = await pathExists(authConfigPath);

            if (!configExists) {
                let authData = await this.askForCredentials();

                const authConfig = new AuthConfig({
                    configPath: authConfigPath,
                    encryptPassword: true,
                    saveConfigOnDisk: true,
                    headlessMode: true,
                    authOptions: authData
                });

                // saves auth on the disk
                await authConfig.getContext();
            }
            this.config.authConfigPath = authConfigPath;
        }

        this.config.outputPath = path.join(this.workspaceRoot, this.config.outputPath);

        vscode.window.withProgress({
            title: 'Loading...',
            cancellable: true,
            location: vscode.ProgressLocation.Notification
        }, () => {
            return SPTypedItem.renderFiles(this.config);
        });

    }

    private async askForCredentials(): Promise<IAuthOptions> {
        let result = await Pipeline.process({
            config: this.config,
            auth: {} as any
        } as AuthContext, new EnvironmentSelectionStep());

        return result.auth;
    }
}
