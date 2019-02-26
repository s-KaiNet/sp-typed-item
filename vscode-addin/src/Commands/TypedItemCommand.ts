import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { Config, JsonSchemaValidator } from 'sp-typed-item';
import { VSCodeConfig } from '../Common/VSCodeConfig';
import { ConfigNotFoundError } from '../Common/ConfigNotFoundError';
import { EXTENSION_KEY } from '../Common/Consts';
import { Command } from './Command';

export abstract class TypedItemCommand extends Command {
    protected config: Config;
    protected workspaceRoot: string;

    constructor(context: vscode.ExtensionContext) {
        super(context);

        let configuration = vscode.workspace.getConfiguration(EXTENSION_KEY) as VSCodeConfig;

        if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
            throw new Error('You must open a folder with VSCode');
        }

        this.workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;

        if (!configuration.configPath && (!configuration.config || configuration.config.length === 0)) {
            let warning = 'Provide configuration for SharePoint Typed Item extension before using it. Use extension home page for [guidance](http://example.com).';
            vscode.window.showWarningMessage(warning);
            throw new ConfigNotFoundError(warning);
        }

        if (configuration.config && configuration.config.length > 0) {
            this.config = configuration.config[0];
        } else {
            let workspace = vscode.workspace.workspaceFolders[0];
            let configPath = path.resolve(workspace.uri.fsPath, configuration.configPath);
            this.config = JSON.parse(fs.readFileSync(configPath).toString())[0];
        }

        JsonSchemaValidator.validate([this.config]);
    }
}
