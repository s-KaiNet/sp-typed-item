import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
		console.log('Congratulations, your extension "sharepoint-typed-item" is now active!');

		let disposable = vscode.commands.registerCommand('extension.generate', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
