import { expect } from 'chai';
import { removeSlashes, sanitizeUrl } from '../src/Common/Utils';

describe('Utils tests', () => {

    it('should return empty string #1', () => {
        let value = removeSlashes('');

        expect(value).equal('');
    });

    it('should return empty string #2', () => {
        let value = removeSlashes('///');

        expect(value).equal('');
    });

    it('should return string without slashes #1', () => {
        let value = removeSlashes('/sites/dev/');

        expect(value).equal('sites/dev');
    });

    it('should return string without slashes #2', () => {
        let value = removeSlashes('/sites/dev');

        expect(value).equal('sites/dev');
    });

    it('should return string without slashes #3', () => {
        let value = removeSlashes('sites/dev');

        expect(value).equal('sites/dev');
    });

    it('should return string without multiple slashes', () => {
        let value = removeSlashes('////sites/dev//');

        expect(value).equal('sites/dev');
    });

    it('should return null', () => {
        let value = removeSlashes(null);

        expect(value).equal(null);
    });

    it('should remove space', () => {
        let value = sanitizeUrl('m m');

        expect(value).equal('mm');
    });

    it('should decode uri and sanitize', () => {
        let value = sanitizeUrl('m%20m');

        expect(value).equal('mm');
    });
});
