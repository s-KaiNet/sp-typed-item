import { ListSetting } from '../Interfaces/FistSetting';
import { SPService } from '../Common/SPService';
import { Entity } from '../Interfaces/Output/Entity';
import { removeSlashes, sanitizeUrl, removeExtraSymbols } from '../Common/Utils';
import { Field } from '../Interfaces/Field';
import { FieldSetting } from '../Interfaces/FieldSetting';
import { Field as FieldEntity } from '../Interfaces/Output/Field';
import { ContentTypeSetting } from '../Interfaces/ContentTypeSetting';
import { FIELD_TYPE_TO_TEMPLATE_MAPPINGS, UNSUPPORTED_FIELD_TYPE_TEMPLATE } from '../Common/Consts';
import { LogManager } from '../Logging/LogManager';
import { FieldType } from '../types/SP';

export class DataFilter {

    private SUPPORTED_LOOKUP_FIELDS = ['FileRef', 'FileDirRef', 'Last_x0020_Modified', 'Created_x0020_Date', 'FSObjType', 'UniqueId'];
    private NOT_SUPPORTED_FIELDS = ['_EditMenuTableStart', '_EditMenuTableStart2', '_EditMenuTableEnd', '_ComplianceFlags', '_ComplianceTag', '_ComplianceTagWrittenTime', '_ComplianceTagUserId', 'LinkFilenameNoMenu', 'LinkFilename', 'LinkFilename2', 'LinkTitleNoMenu', 'LinkTitle', 'LinkTitle2', 'AppAuthor', 'AppEditor'];

    constructor(private service: SPService) { }

    public async filterLists(listSettings?: ListSetting[]): Promise<Entity[]> {
        if (!listSettings || listSettings.length === 0) {
            return [];
        }

        let lists = await this.service.getLists();

        if (lists.length === 0) {
            return [];
        }
        let serverRelativeUrl = removeSlashes(await this.service.getWebServerRelativeUrl());

        let entities: Entity[] = [];

        for (const listSetting of listSettings) {
            let url = removeSlashes(listSetting.url).toLowerCase();
            let listWasAdded = false;
            for (const list of lists) {
                let listRelativeUrl = removeSlashes(list.RootFolder.ServerRelativeUrl.replace(serverRelativeUrl, '')).toLowerCase();
                if (listRelativeUrl === url) {
                    let urlParts = list.RootFolder.ServerRelativeUrl.split('/');
                    let entity: Entity = {
                        name: listSetting.fileName || sanitizeUrl(urlParts[urlParts.length - 1]),
                        fields: null,
                        fileName: listSetting.fileName,
                        hasUrl: false,
                        hasGeoLocation: false,
                        hasTaxonomy: false
                    };
                    entities.push(entity);

                    let listFields = await this.service.getListFields(list.RootFolder.ServerRelativeUrl);
                    this.populateFields(entity, listFields, listSetting.fields);
                    listWasAdded = true;
                }
            }

            if (!listWasAdded) {
                LogManager.instance.warn(`List with url: '${url}' was not found`);
            }
        }

        return entities;
    }

    public async filterConentTypes(contentTypeSettings?: ContentTypeSetting[]): Promise<Entity[]> {
        if (!contentTypeSettings || contentTypeSettings.length === 0) {
            return [];
        }

        let contentTypes = await this.service.getContentTypes();

        if (contentTypes.length === 0) {
            return [];
        }

        let entities: Entity[] = [];

        for (const contentTypeSetting of contentTypeSettings) {
            let id = contentTypeSetting.id;
            let contentTypeWasAdded = false;
            for (const contentType of contentTypes) {
                if (id === contentType.Id) {
                    let entity: Entity = {
                        name: contentTypeSetting.fileName || removeExtraSymbols(contentType.Name),
                        fields: null,
                        fileName: contentTypeSetting.fileName,
                        hasUrl: false,
                        hasGeoLocation: false,
                        hasTaxonomy: false
                    };
                    entities.push(entity);

                    let listFields = await this.service.getContentTypeFields(id);
                    this.populateFields(entity, listFields, contentTypeSetting.fields);
                    contentTypeWasAdded = true;
                }
            }

            if (!contentTypeWasAdded) {
                LogManager.instance.warn(`Content type with id: '${id}' was not found`);
            }
        }

        return entities;
    }

    private populateFields(entity: Entity, fields: Field[], fieldSetting: FieldSetting): void {
        let fieldEntities: FieldEntity[] = [];

        for (const field of fields) {
            if (!this.isFieldSupported(field)) {
                continue;
            }

            let fieldTypeName = field.TypeAsString.toLowerCase();
            let fieldEntity: FieldEntity = {
                entityPropertyName: field.EntityPropertyName,
                fieldType: field.FieldTypeKind,
                fieldTypeName: fieldTypeName,
                template: FIELD_TYPE_TO_TEMPLATE_MAPPINGS[fieldTypeName]
            };

            if (!fieldEntity.template) {
                LogManager.instance.error('Received unsupported field type: ' + fieldTypeName);
                fieldEntity.template = UNSUPPORTED_FIELD_TYPE_TEMPLATE;
            }

            if (!fieldSetting) {
                fieldEntities.push(fieldEntity);
            } else {
                if ((fieldSetting.excludeHidden && field.Hidden)) {
                    continue;
                }

                if (!fieldSetting.exclude || fieldSetting.exclude.length === 0) {
                    fieldEntities.push(fieldEntity);
                } else if (fieldSetting.exclude.indexOf(field.InternalName) === -1) {
                    fieldEntities.push(fieldEntity);
                }
            }
        }

        entity.fields = fieldEntities;
        entity.hasUrl = fieldEntities.filter(e => e.fieldTypeName === 'url').length > 0;
        entity.hasGeoLocation = fieldEntities.filter(e => e.fieldTypeName === 'geolocation').length > 0;
        entity.hasTaxonomy = fieldEntities.filter(e => e.fieldTypeName === 'taxonomyfieldtype' || e.fieldTypeName === 'taxonomyfieldtypemulti').length > 0;
    }

    private isFieldSupported(field: Field): boolean {
        if (this.SUPPORTED_LOOKUP_FIELDS.indexOf(field.InternalName) !== -1) {
            field.FieldTypeKind = FieldType.text;
            field.TypeAsString = 'text';

            if (field.InternalName === 'FSObjType') {
                field.FieldTypeKind = FieldType.number;
                field.TypeAsString = 'number';
            }
            return true;
        }

        if (this.NOT_SUPPORTED_FIELDS.indexOf(field.InternalName) !== -1) {
            return false;
        }

        let isSystemDocsListLookup = field.SchemaXml.indexOf('List="Docs"') !== -1;
        let isLookupListEmpty = !field.LookupList;
        let isLookup = field.FieldTypeKind === FieldType.lookup;

        if (isLookup && isLookupListEmpty && isSystemDocsListLookup && field.Hidden) {
            return false;
        }

        return true;
    }
}
