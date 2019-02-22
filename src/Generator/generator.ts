import { Config } from '../Interfaces/config';
import { SpService } from '../Common/spService';
import { DataFilter } from '../Filters/dataFilter';
import { LogManager } from '../Logging/logManager';
import { JsonSchemaValidator } from '../JsonValidation/jsonSchemaValidator';

export class Generator {
    public static async Generate(siteUrl: string, authConfigPath: string, config: Config): Promise<any> {
        if (!config.lists && !config.contentTypes) {
            LogManager.instance.error('Provide either "lists" or "contentTypes" node for sp-typed-item.');
            return;
        }

        let schemaValidationResult = JsonSchemaValidator.validate([config]);

        if (!schemaValidationResult.valid) {
            LogManager.instance.error('Schema validation errors. Errors received: ');
            LogManager.instance.error(JSON.stringify(schemaValidationResult.errors, null, 2));
            return;
        }

        let spService = new SpService(authConfigPath, siteUrl);
        let dataFilter = new DataFilter(spService);
        let listEntities = dataFilter.filterLists(config.lists);
        let contentTypeEntities = dataFilter.filterConentTypes(config.contentTypes);

    }
}
