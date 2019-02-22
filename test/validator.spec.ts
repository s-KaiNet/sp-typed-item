import { JsonSchemaValidator } from '../src/JsonValidation/JsonSchemaValidator';

import { expect } from 'chai';
import { Config } from '../src/Interfaces/Config';

describe('Validator tests', () => {
    it('should not validate empty object', () => {
        let result = JsonSchemaValidator.validate([{} as Config]);
        expect(result.valid).equal(false);
    });

    it('should not validate empty siteUrl', () => {
        let result = JsonSchemaValidator.validate([{
            outputPath: ''
        } as Config]);
        expect(result.valid).equal(false);
    });

    it('should set valid state', () => {
        let result = JsonSchemaValidator.validate([{
            outputPath: '',
            siteUrl: ''
        } as Config]);
        expect(result.valid).equal(true);
    });

    it('should set not valid - no url for list was provided', () => {
        let result = JsonSchemaValidator.validate([{
            outputPath: '',
            siteUrl: '',
            lists: [
                {

                }
            ]
        } as Config]);
        expect(result.valid).equal(false);
    });

    it('should set valid - url for list was provided', () => {
        let result = JsonSchemaValidator.validate([{
            outputPath: '',
            siteUrl: '',
            lists: [
                {
                    url: 'my list'
                }
            ]
        } as Config]);
        expect(result.valid).equal(true);
    });
});
