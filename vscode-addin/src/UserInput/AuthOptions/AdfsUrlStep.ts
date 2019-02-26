import { AuthContext } from './AuthContext';
import { Step } from '../Step';
import { IAdfsUserCredentials } from 'node-sp-auth';
import { ClientSecretPickStep } from './ClientSecretPickStep';
import { GenericInputStep } from './GenericInputStep';

export class AdfsUrlStep extends GenericInputStep<AuthContext> {

    constructor(context: AuthContext) {
        super(context);

        this.input.prompt = 'ADFS server url';
        this.input.placeholder = 'https://your-adfs-server-url';
    }

    protected resolveNextStep(context: AuthContext): Step<AuthContext> {
        (context.auth as IAdfsUserCredentials).relyingParty = this.input.value;

        return new ClientSecretPickStep();
    }
}
