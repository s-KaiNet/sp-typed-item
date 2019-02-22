import { expect } from 'chai';
import { SpService } from '../src/Common/spService';
import { DataFilter } from '../src/Filters/dataFilter';
import { stub, restore } from 'sinon';
import { List } from '../src/Interfaces/list';
import { Field } from '../src/Interfaces/field';
import { FieldType } from '../src/types/sp';

describe('Data filter tests', () => {
    afterEach(() => {
        restore();
    });

    it('should return null for empty list settings', async () => {
        let service = new SpService('', '');
        let dataFilter = new DataFilter(service);

        let value = await dataFilter.filterLists();

        expect(value.length).equal(0);
    });

    it('should return empty when no lists', async () => {
        let service = new SpService('', '');
        let dataFilter = new DataFilter(service);
        stub(SpService.prototype, 'getLists').returns(Promise.resolve<List[]>([]));

        let value = await dataFilter.filterLists({} as any);

        expect(value.length).equal(0);
    });

    it('should return one list #1', async () => {
        let service = new SpService('', '');
        let dataFilter = new DataFilter(service);
        stub(SpService.prototype, 'getLists').returns(Promise.resolve<List[]>([{
            Hidden: false,
            Id: 'id',
            RootFolder: {
                Name: '',
                ServerRelativeUrl: 'sites/dev/Lists/MyList'
            },
            Title: 'List'
        }]));
        stub(SpService.prototype, 'getWebServerRelativeUrl').returns(Promise.resolve<string>('/sites/dev/'));
        stub(SpService.prototype, 'getListFields').returns(Promise.resolve<Field[]>([]));

        let value = await dataFilter.filterLists([{
            url: 'Lists/MyList'
        }]);

        expect(value.length).equal(1);
    });

    it('should return one list #2', async () => {
        let service = new SpService('', '');
        let dataFilter = new DataFilter(service);
        stub(SpService.prototype, 'getLists').returns(Promise.resolve<List[]>([{
            Hidden: false,
            Id: 'id',
            RootFolder: {
                Name: '',
                ServerRelativeUrl: '/sites/dev/Lists/MyList/'
            },
            Title: 'List'
        }]));
        stub(SpService.prototype, 'getWebServerRelativeUrl').returns(Promise.resolve<string>('sites/dev/'));
        stub(SpService.prototype, 'getListFields').returns(Promise.resolve<Field[]>([]));

        let value = await dataFilter.filterLists([{
            url: 'Lists/MyList'
        }]);

        expect(value.length).equal(1);
    });

    it('should return one list #3', async () => {
        let service = new SpService('', '');
        let dataFilter = new DataFilter(service);
        stub(SpService.prototype, 'getLists').returns(Promise.resolve<List[]>([{
            Hidden: false,
            Id: 'id',
            RootFolder: {
                Name: '',
                ServerRelativeUrl: '/sites/dev/Lists/MyList/'
            },
            Title: 'List'
        },
        {
            Hidden: false,
            Id: 'id',
            RootFolder: {
                Name: '',
                ServerRelativeUrl: '/sites/dev/Lists/MyList2/'
            },
            Title: 'List'
        }]));
        stub(SpService.prototype, 'getWebServerRelativeUrl').returns(Promise.resolve<string>('sites/dev/'));
        stub(SpService.prototype, 'getListFields').returns(Promise.resolve<Field[]>([]));

        let value = await dataFilter.filterLists([{
            url: 'Lists/MyList'
        }]);

        expect(value.length).equal(1);
    });

    it('should return two lists', async () => {
        let service = new SpService('', '');
        let dataFilter = new DataFilter(service);
        stub(SpService.prototype, 'getLists').returns(Promise.resolve<List[]>([{
            Hidden: false,
            Id: 'id',
            RootFolder: {
                Name: '',
                ServerRelativeUrl: '/sites/dev/Lists/MyList/'
            },
            Title: 'List'
        },
        {
            Hidden: false,
            Id: 'id',
            RootFolder: {
                Name: '',
                ServerRelativeUrl: '/sites/dev/Lists/MyList2/'
            },
            Title: 'List'
        }]));
        stub(SpService.prototype, 'getWebServerRelativeUrl').returns(Promise.resolve<string>('sites/dev/'));
        stub(SpService.prototype, 'getListFields').returns(Promise.resolve<Field[]>([]));

        let value = await dataFilter.filterLists([{
            url: '/Lists/MyList'
        },
        {
            url: 'Lists/MyList2/'
        }]);

        expect(value.length).equal(2);
    });

    it('should return zero field (excluded by internal name)', async () => {
        let service = new SpService('', '');
        let dataFilter = new DataFilter(service);
        stub(SpService.prototype, 'getLists').returns(Promise.resolve<List[]>([{
            Hidden: false,
            Id: 'id',
            RootFolder: {
                Name: '',
                ServerRelativeUrl: '/sites/dev/Lists/MyList/'
            },
            Title: 'List'
        }]));
        stub(SpService.prototype, 'getWebServerRelativeUrl').returns(Promise.resolve<string>('sites/dev/'));
        stub(SpService.prototype, 'getListFields').returns(Promise.resolve<Field[]>([{
            InternalName: 'Id',
            EntityPropertyName: '',
            FieldTypeKind: FieldType.integer,
            Hidden: false,
            Id: ''
        } as Field]));

        let value = await dataFilter.filterLists([{
            url: '/Lists/MyList',
            fields: {
                exclude: ['Id']
            }
        }]);

        expect(value[0].fields.length).equal(0);
    });

    it('should return one field (not excluded by internal name)', async () => {
        let service = new SpService('', '');
        let dataFilter = new DataFilter(service);
        stub(SpService.prototype, 'getLists').returns(Promise.resolve<List[]>([{
            Hidden: false,
            Id: 'id',
            RootFolder: {
                Name: '',
                ServerRelativeUrl: '/sites/dev/Lists/MyList/'
            },
            Title: 'List'
        }]));
        stub(SpService.prototype, 'getWebServerRelativeUrl').returns(Promise.resolve<string>('sites/dev/'));
        stub(SpService.prototype, 'getListFields').returns(Promise.resolve<Field[]>([{
            InternalName: 'Id',
            EntityPropertyName: '',
            FieldTypeKind: FieldType.integer,
            Hidden: false,
            Id: ''
        } as Field, {
            InternalName: 'MyF',
            EntityPropertyName: '',
            FieldTypeKind: FieldType.integer,
            Hidden: false,
            Id: ''
        } as Field]));

        let value = await dataFilter.filterLists([{
            url: '/Lists/MyList',
            fields: {
                exclude: ['Id']
            }
        }]);

        expect(value[0].fields.length).equal(1);
    });

    it('should return zero field (excluded by Hidden prop)', async () => {
        let service = new SpService('', '');
        let dataFilter = new DataFilter(service);
        stub(SpService.prototype, 'getLists').returns(Promise.resolve<List[]>([{
            Hidden: false,
            Id: 'id',
            RootFolder: {
                Name: '',
                ServerRelativeUrl: '/sites/dev/Lists/MyList/'
            },
            Title: 'List'
        }]));
        stub(SpService.prototype, 'getWebServerRelativeUrl').returns(Promise.resolve<string>('sites/dev/'));
        stub(SpService.prototype, 'getListFields').returns(Promise.resolve<Field[]>([{
            InternalName: 'Id',
            EntityPropertyName: '',
            FieldTypeKind: FieldType.integer,
            Hidden: true,
            Id: ''
        } as Field]));

        let value = await dataFilter.filterLists([{
            url: '/Lists/MyList',
            fields: {
                exclude: ['Id'],
                excludeHidden: true
            }
        }]);

        expect(value[0].fields.length).equal(0);
    });
});
