import * as vscode from 'vscode';

import { Step } from '../Step';
import { AuthContext } from './AuthContext';
import { PICK_USER_CREDS, PICK_ADDIN_CREDS } from '../../Common/Consts';
import { OnlineCreds } from '../../Common/OnlineCreds';
import { UserNamePickStep } from './UserNamePickStep';
import { ClientIdPickStep } from './ClientIdPickStep';

export class OnlineAuthOptionsStep extends Step<AuthContext> {
    public async execute(context: AuthContext): Promise<Step<AuthContext>> {
        let result = await this.selectAuth(context);

        switch (result) {
            case OnlineCreds.User:
                return new UserNamePickStep(context, 'O365 user login name', 'user@contoso.onmicrosoft.com or user@contoso.com');
            case OnlineCreds.Addin:
                return new ClientIdPickStep(context);
        }
    }

    private async selectAuth(context: AuthContext): Promise<OnlineCreds> {
        return new Promise((resolve, reject) => {
            let options: vscode.QuickPickItem[] = [{
                label: PICK_USER_CREDS,
                description: 'With this option your user name and password will be used to authenticate against target SharePoint site'
            }, {
                label: PICK_ADDIN_CREDS,
                description: 'With this option ClientId and ClientSecret will be used to authenticate against target SharePoint site'
            }];

            let pick = vscode.window.createQuickPick();
            pick.title = `Select authentication type`;
            pick.ignoreFocusOut = true;
            pick.items = options;

            pick.show();

            pick.onDidAccept(() => {
                let picked = pick.selectedItems[0];
                pick.dispose();
                resolve(picked.label === PICK_USER_CREDS ? OnlineCreds.User : OnlineCreds.Addin);
            });
        });
    }
}
