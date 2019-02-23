import { expect } from 'chai';
import { SPService } from '../src/Common/SPService';
import { DataFilter } from '../src/Filters/DataFilter';
import { stub, restore } from 'sinon';
import { List } from '../src/Interfaces/Fist';
import { Field } from '../src/Interfaces/Field';
import { FieldType } from '../src/types/SP';
import { ContentType } from '../src/Interfaces/ContentType';

describe('Data filter tests', () => {
    afterEach(() => {
        restore();
    });

    describe('List filter test', () => {

        it('should return null for empty list settings', async () => {
            let service = new SPService('', '');
            let dataFilter = new DataFilter(service);

            let value = await dataFilter.filterLists();

            expect(value.length).equal(0);
        });

        it('should return empty when no lists', async () => {
            let service = new SPService('', '');
            let dataFilter = new DataFilter(service);
            stub(SPService.prototype, 'getLists').returns(Promise.resolve<List[]>([]));

            let value = await dataFilter.filterLists({} as any);

            expect(value.length).equal(0);
        });

        it('should return one list #1', async () => {
            let service = new SPService('', '');
            let dataFilter = new DataFilter(service);
            stub(SPService.prototype, 'getLists').returns(Promise.resolve<List[]>([{
                Hidden: false,
                Id: 'id',
                RootFolder: {
                    Name: '',
                    ServerRelativeUrl: 'sites/dev/Lists/MyList'
                },
                Title: 'List'
            }]));
            stub(SPService.prototype, 'getWebServerRelativeUrl').returns(Promise.resolve<string>('/sites/dev/'));
            stub(SPService.prototype, 'getListFields').returns(Promise.resolve<Field[]>([]));

            let value = await dataFilter.filterLists([{
                url: 'Lists/MyList'
            }]);

            expect(value.length).equal(1);
        });

        it('should return one list #2', async () => {
            let service = new SPService('', '');
            let dataFilter = new DataFilter(service);
            stub(SPService.prototype, 'getLists').returns(Promise.resolve<List[]>([{
                Hidden: false,
                Id: 'id',
                RootFolder: {
                    Name: '',
                    ServerRelativeUrl: '/sites/dev/Lists/MyList/'
                },
                Title: 'List'
            }]));
            stub(SPService.prototype, 'getWebServerRelativeUrl').returns(Promise.resolve<string>('sites/dev/'));
            stub(SPService.prototype, 'getListFields').returns(Promise.resolve<Field[]>([]));

            let value = await dataFilter.filterLists([{
                url: 'Lists/MyList'
            }]);

            expect(value.length).equal(1);
        });

        it('should return one list #3', async () => {
            let service = new SPService('', '');
            let dataFilter = new DataFilter(service);
            stub(SPService.prototype, 'getLists').returns(Promise.resolve<List[]>([{
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
            stub(SPService.prototype, 'getWebServerRelativeUrl').returns(Promise.resolve<string>('sites/dev/'));
            stub(SPService.prototype, 'getListFields').returns(Promise.resolve<Field[]>([]));

            let value = await dataFilter.filterLists([{
                url: 'Lists/MyList'
            }]);

            expect(value.length).equal(1);
        });

        it('should ignore case', async () => {
            let service = new SPService('', '');
            let dataFilter = new DataFilter(service);
            stub(SPService.prototype, 'getLists').returns(Promise.resolve<List[]>([{
                Hidden: false,
                Id: 'id',
                RootFolder: {
                    Name: '',
                    ServerRelativeUrl: 'sites/dev/Lists/MyList'
                },
                Title: 'List'
            }]));
            stub(SPService.prototype, 'getWebServerRelativeUrl').returns(Promise.resolve<string>('/sites/dev/'));
            stub(SPService.prototype, 'getListFields').returns(Promise.resolve<Field[]>([]));

            let value = await dataFilter.filterLists([{
                url: 'lists/MyList'
            }]);

            expect(value.length).equal(1);
        });

        it('should return two lists', async () => {
            let service = new SPService('', '');
            let dataFilter = new DataFilter(service);
            stub(SPService.prototype, 'getLists').returns(Promise.resolve<List[]>([{
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
            stub(SPService.prototype, 'getWebServerRelativeUrl').returns(Promise.resolve<string>('sites/dev/'));
            stub(SPService.prototype, 'getListFields').returns(Promise.resolve<Field[]>([]));

            let value = await dataFilter.filterLists([{
                url: '/Lists/MyList'
            },
            {
                url: 'Lists/MyList2/'
            }]);

            expect(value.length).equal(2);
        });

        it('should return zero field (excluded by internal name)', async () => {
            let service = new SPService('', '');
            let dataFilter = new DataFilter(service);
            stub(SPService.prototype, 'getLists').returns(Promise.resolve<List[]>([{
                Hidden: false,
                Id: 'id',
                RootFolder: {
                    Name: '',
                    ServerRelativeUrl: '/sites/dev/Lists/MyList/'
                },
                Title: 'List'
            }]));
            stub(SPService.prototype, 'getWebServerRelativeUrl').returns(Promise.resolve<string>('sites/dev/'));
            stub(SPService.prototype, 'getListFields').returns(Promise.resolve<Field[]>([{
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
            let service = new SPService('', '');
            let dataFilter = new DataFilter(service);
            stub(SPService.prototype, 'getLists').returns(Promise.resolve<List[]>([{
                Hidden: false,
                Id: 'id',
                RootFolder: {
                    Name: '',
                    ServerRelativeUrl: '/sites/dev/Lists/MyList/'
                },
                Title: 'List'
            }]));
            stub(SPService.prototype, 'getWebServerRelativeUrl').returns(Promise.resolve<string>('sites/dev/'));
            stub(SPService.prototype, 'getListFields').returns(Promise.resolve<Field[]>([{
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
            let service = new SPService('', '');
            let dataFilter = new DataFilter(service);
            stub(SPService.prototype, 'getLists').returns(Promise.resolve<List[]>([{
                Hidden: false,
                Id: 'id',
                RootFolder: {
                    Name: '',
                    ServerRelativeUrl: '/sites/dev/Lists/MyList/'
                },
                Title: 'List'
            }]));
            stub(SPService.prototype, 'getWebServerRelativeUrl').returns(Promise.resolve<string>('sites/dev/'));
            stub(SPService.prototype, 'getListFields').returns(Promise.resolve<Field[]>([{
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

        it('should return one field (mix of excluded by Hidden and InternalName)', async () => {
            let service = new SPService('', '');
            let dataFilter = new DataFilter(service);
            stub(SPService.prototype, 'getLists').returns(Promise.resolve<List[]>([{
                Hidden: false,
                Id: 'id',
                RootFolder: {
                    Name: '',
                    ServerRelativeUrl: '/sites/dev/Lists/MyList/'
                },
                Title: 'List'
            }]));
            stub(SPService.prototype, 'getWebServerRelativeUrl').returns(Promise.resolve<string>('sites/dev/'));
            stub(SPService.prototype, 'getListFields').returns(Promise.resolve<Field[]>([{
                InternalName: 'Id',
                EntityPropertyName: '',
                FieldTypeKind: FieldType.integer,
                Hidden: true,
                Id: ''
            } as Field,
            {
                InternalName: 'Id',
                EntityPropertyName: '',
                FieldTypeKind: FieldType.integer,
                Hidden: false,
                Id: ''
            } as Field,
            {
                InternalName: 'MyF',
                EntityPropertyName: '',
                FieldTypeKind: FieldType.integer,
                Hidden: false,
                Id: ''
            } as Field]));

            let value = await dataFilter.filterLists([{
                url: '/Lists/MyList',
                fields: {
                    exclude: ['Id'],
                    excludeHidden: true
                }
            }]);

            expect(value[0].fields.length).equal(1);
        });

        it('should return all fields', async () => {
            let service = new SPService('', '');
            let dataFilter = new DataFilter(service);
            stub(SPService.prototype, 'getLists').returns(Promise.resolve<List[]>([{
                Hidden: false,
                Id: 'id',
                RootFolder: {
                    Name: '',
                    ServerRelativeUrl: '/sites/dev/Lists/MyList/'
                },
                Title: 'List'
            }]));
            stub(SPService.prototype, 'getWebServerRelativeUrl').returns(Promise.resolve<string>('sites/dev/'));
            stub(SPService.prototype, 'getListFields').returns(Promise.resolve<Field[]>([{
                InternalName: 'Id',
                EntityPropertyName: '',
                FieldTypeKind: FieldType.integer,
                Hidden: false,
                Id: ''
            } as Field]));

            let value = await dataFilter.filterLists([{
                url: '/Lists/MyList'
            }]);

            expect(value[0].fields.length).equal(1);
        });

        it('should return one field (one excluded by Hidden prop)', async () => {
            let service = new SPService('', '');
            let dataFilter = new DataFilter(service);
            stub(SPService.prototype, 'getLists').returns(Promise.resolve<List[]>([{
                Hidden: false,
                Id: 'id',
                RootFolder: {
                    Name: '',
                    ServerRelativeUrl: '/sites/dev/Lists/MyList/'
                },
                Title: 'List'
            }]));
            stub(SPService.prototype, 'getWebServerRelativeUrl').returns(Promise.resolve<string>('sites/dev/'));
            stub(SPService.prototype, 'getListFields').returns(Promise.resolve<Field[]>([{
                InternalName: 'Id',
                EntityPropertyName: '',
                FieldTypeKind: FieldType.integer,
                Hidden: true,
                Id: ''
            } as Field, {
                InternalName: 'Id',
                EntityPropertyName: '',
                FieldTypeKind: FieldType.integer,
                Hidden: false,
                Id: ''
            } as Field]));

            let value = await dataFilter.filterLists([{
                url: '/Lists/MyList',
                fields: {
                    excludeHidden: true
                }
            }]);

            expect(value[0].fields.length).equal(1);
        });
    });

    describe('Content type filter test', () => {
        it('should return empty collection', async () => {
            let service = new SPService('', '');
            let dataFilter = new DataFilter(service);

            let value = await dataFilter.filterConentTypes();

            expect(value.length).equal(0);
        });

        it('should return empty collection', async () => {
            let service = new SPService('', '');
            let dataFilter = new DataFilter(service);
            stub(SPService.prototype, 'getContentTypes').returns(Promise.resolve<ContentType[]>([]));
            let value = await dataFilter.filterConentTypes();

            expect(value.length).equal(0);
        });

        it('should return one entity (no filters applied)', async () => {
            let service = new SPService('', '');
            let dataFilter = new DataFilter(service);
            stub(SPService.prototype, 'getContentTypes').returns(Promise.resolve<ContentType[]>([{
                Hidden: false,
                Id: 'ct-id',
                Name: 'Ct'
            }]));
            stub(SPService.prototype, 'getContentTypeFields').returns(Promise.resolve<Field[]>([{
                InternalName: 'Id',
                EntityPropertyName: '',
                FieldTypeKind: FieldType.integer,
                Hidden: true,
                Id: ''
            } as Field, {
                InternalName: 'Id',
                EntityPropertyName: '',
                FieldTypeKind: FieldType.integer,
                Hidden: false,
                Id: ''
            } as Field]));

            let value = await dataFilter.filterConentTypes([{
                id: 'ct-id',
                fields: {
                    excludeHidden: true
                }
            }]);

            expect(value.length).equal(1);
        });

        it('should return one entity (filter by Hidden)', async () => {
            let service = new SPService('', '');
            let dataFilter = new DataFilter(service);
            stub(SPService.prototype, 'getContentTypes').returns(Promise.resolve<ContentType[]>([{
                Hidden: false,
                Id: 'ct-id',
                Name: 'Ct'
            }]));
            stub(SPService.prototype, 'getContentTypeFields').returns(Promise.resolve<Field[]>([{
                InternalName: 'Id',
                EntityPropertyName: '',
                FieldTypeKind: FieldType.integer,
                Hidden: true,
                Id: ''
            } as Field, {
                InternalName: 'Id',
                EntityPropertyName: '',
                FieldTypeKind: FieldType.integer,
                Hidden: false,
                Id: ''
            } as Field]));

            let value = await dataFilter.filterConentTypes([{
                id: 'ct-id',
                fields: {
                    excludeHidden: true
                }
            }]);

            expect(value[0].fields.length).equal(1);
        });
    });
});
