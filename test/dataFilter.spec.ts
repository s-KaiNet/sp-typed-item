import { expect } from 'chai';

import { DataFilter } from '../src/Filters/dataFilter';
import { SpService } from '../src/Common/spService';

describe('Data filter tests', () => {
    it('should work fff', () => {
        let dataFilter = new DataFilter(new SpService('', ''));
        expect(1).to.equal(1);
    });
});
