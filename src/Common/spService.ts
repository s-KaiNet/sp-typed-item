import { List } from '../Interfaces/list';
import * as sprequest from 'sp-request';
import { removeSlashes } from './utils';
import { AuthConfig } from 'node-sp-auth-config';
import { Field } from '../Interfaces/field';
import { ContentType } from '../Interfaces/contentType';

export class SpService {
    private siteUrl: string;
    private request: sprequest.ISPRequest;

    constructor(private authConfigPath: string, siteUrl: string) {
        this.siteUrl = removeSlashes(siteUrl);
    }

    public async getLists(): Promise<List[]> {
        let request = await this.createRequest();

        return (await request.get(`${this.siteUrl}/_api/web/lists?$expand=RootFolder&$select=RootFolder/Name,RootFolder/ServerRelativeUrl,Title,Id,Hidden`)).body.d.results;
    }

    public async getWebServerRelativeUrl(): Promise<string> {
        let request = await this.createRequest();

        return (await request.get(`${this.siteUrl}/_api/web?$select=ServerRelativeUrl`)).body.d.ServerRelativeUrl;
    }

    public async getContentTypes(): Promise<ContentType[]> {
        let request = await this.createRequest();

        return (await request.get(`${this.siteUrl}/_api/web/ContentTypes?$select=Id,Hidden,Name`)).body.d.results;
    }

    public async getListFields(listTitle: string): Promise<Field[]> {
        let request = await this.createRequest();

        return (await request.get(`${this.siteUrl}/_api/web/lists/getByTitle('${listTitle}')/fields?$select=Id,Hidden,InternalName,EntityPropertyName,Required,Title,FieldTypeKind,TypeAsString`)).body.d.results;
    }

    public async getContentTypeFields(id: string): Promise<Field[]> {
        let request = await this.createRequest();

        return (await request.get(`${this.siteUrl}/_api/web/ContentTypes/GetById('${id}')/fields?$select=Id,Hidden,InternalName,EntityPropertyName,Required,Title,FieldTypeKind,TypeAsString`)).body.d.results;
    }

    private async createRequest(): Promise<sprequest.ISPRequest> {
        if (this.request) {
            return this.request;
        }
        const authConfig = this.createAuthConfig();
        let auth = (await authConfig.getContext()).authOptions;
        this.request = sprequest.create(auth);

        return this.request;
    }

    private createAuthConfig(): AuthConfig {
        return new AuthConfig({
            configPath: this.authConfigPath,
            encryptPassword: true,
            saveConfigOnDisk: false,
            headlessMode: true
        });
    }
}
