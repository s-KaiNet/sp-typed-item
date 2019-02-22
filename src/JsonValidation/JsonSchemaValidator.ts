let Ajv = require('ajv');
import { Config } from '../Interfaces/Config';

const schema: any = require('./sp-typed-item.schema.json');

export class JsonSchemaValidator {
    public static validate(config: Config[]): {valid: boolean, errors: any} {
        let ajv = new Ajv();
        let validate = ajv.compile(schema);
        let valid = validate(config);

        return {
            valid,
            errors: validate.errors
        };
    }
}
