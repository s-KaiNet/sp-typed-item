let Ajv = require('ajv');
import { Config } from '../Interfaces/Config';
import { SchemaValidationError } from '../Common/SchemaValidationError';

const schema: any = require('../../schemas/sp-typed-item.schema.json');

export class JsonSchemaValidator {
    public static validate(config: Config[]): void {
        let ajv = new Ajv();
        let validate = ajv.compile(schema);
        let valid = validate(config);

        if (!valid) {
            throw new SchemaValidationError('', JSON.stringify(validate.errors, null, 2));
        }
    }
}
