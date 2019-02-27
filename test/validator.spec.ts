import { JsonSchemaValidator } from '../src/JsonValidation/JsonSchemaValidator';

import { expect } from 'chai';
import { Config } from '../src/Interfaces/Config';

describe('Validator tests', () => {
    it('should not validate empty object', () => {
        expect(JsonSchemaValidator.validate.bind(this, [{}])).to.throw();
    });

    it('should not validate empty siteUrl', () => {
        expect(JsonSchemaValidator.validate.bind(this, [{
            outputPath: ''
        } as Config])).to.throw();
    });

    it('should set valid state', () => {
        expect(JsonSchemaValidator.validate.bind(this, [{
            outputPath: '',
            siteUrl: '',
            authConfigPath: ''
        } as Config])).to.not.throw();
    });

    it('should set not valid - no url for list was provided', () => {
         expect(JsonSchemaValidator.validate.bind(this, [{
            outputPath: '',
            siteUrl: '',
            authConfigPath: '',
            lists: [
                {

                }
            ]
        } as Config])).to.throw();
    });

    it('should set valid - url for list was provided', () => {
        expect(JsonSchemaValidator.validate.bind(this, [{
            outputPath: '',
            siteUrl: '',
            authConfigPath: '',
            lists: [
                {
                    url: 'my list'
                }
            ]
        } as Config])).to.not.throw();
    });
});
