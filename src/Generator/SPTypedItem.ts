import { Config } from '../Interfaces/Config';
import { SPService } from '../Common/SPService';
import { DataFilter } from '../Filters/DataFilter';
import { LogManager } from '../Logging/LogManager';
import { JsonSchemaValidator } from '../JsonValidation/JsonSchemaValidator';
import { TemplateGenerator } from '../Templating/TemplateGenerator';
import { SchemaValidationError } from '../Common/SchemaValidationError';

export class SPTypedItem {
    public static async renderFiles(config: Config): Promise<any> {
        try {
            if (!config.lists && !config.contentTypes) {
                LogManager.instance.error('Provide either "lists" or "contentTypes" node for sp-typed-item.json configuration.');
                return;
            }

            if (!config.authConfigPath) {
                LogManager.instance.error('"authConfigPath" option is missing from configuration.');
                return;
            }

            JsonSchemaValidator.validate([config]);

            let spService = new SPService(config.authConfigPath, config.siteUrl);
            let dataFilter = new DataFilter(spService);
            let listEntities = await dataFilter.filterLists(config.lists);
            let contentTypeEntities = await dataFilter.filterConentTypes(config.contentTypes);

            await TemplateGenerator.renderTemplates(config, listEntities, contentTypeEntities);
        } catch (error) {
            if (error instanceof SchemaValidationError) {
                LogManager.instance.error('sp-typed-item.json schema validation errors. Errors received: ');
                LogManager.instance.error(error.errors);
                return;
            }

            throw error;
        }
    }
}
