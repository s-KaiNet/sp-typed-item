import { expect } from 'chai';
import { SpService } from '../src/Common/spService';
import { DataFilter } from '../src/Filters/dataFilter';
import { stub } from 'sinon';
import { List } from '../src/Interfaces/list';

describe('Data filter tests', () => {
    it('should work', async () => {
        let service = new SpService('', '');

        let dataFilter = new DataFilter(service);
        stub(SpService.prototype, 'getLists').returns(Promise.resolve<List[]>([{
            Hidden: false,
            Id: 'id',
            RootFolder: {} as any,
            Title: 'List'
        }]));

        let value = await dataFilter.filterLists({} as any);

        expect(value.length).to.equal(1);
    });
});
