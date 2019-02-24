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

export class DataFilter {
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
            for (const list of lists) {
                let listRelativeUrl = removeSlashes(list.RootFolder.ServerRelativeUrl.replace(serverRelativeUrl, '')).toLowerCase();
                if (listRelativeUrl === url) {
                    let urlParts = list.RootFolder.ServerRelativeUrl.split('/');
                    let entity: Entity = {
                        name: sanitizeUrl(urlParts[urlParts.length - 1]),
                        fields: null,
                        fileName: listSetting.fileName,
                        hasUrl: false,
                        hasGeoLocation: false
                    };
                    entities.push(entity);

                    let listFields = await this.service.getListFields(list.RootFolder.ServerRelativeUrl);
                    this.populateFields(entity, listFields, listSetting.fields);
                }
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
            for (const contentType of contentTypes) {
                if (id === contentType.Id) {
                    let entity: Entity = {
                        name: removeExtraSymbols(contentType.Name),
                        fields: null,
                        fileName: contentTypeSetting.fileName,
                        hasUrl: false,
                        hasGeoLocation: false
                    };
                    entities.push(entity);

                    let listFields = await this.service.getContentTypeFields(id);
                    this.populateFields(entity, listFields, contentTypeSetting.fields);
                }
            }
        }

        return entities;
    }

    private populateFields(entity: Entity, fields: Field[], fieldSetting: FieldSetting): void {
        let fieldEntities: FieldEntity[] = [];

        for (const field of fields) {
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
    }
}
