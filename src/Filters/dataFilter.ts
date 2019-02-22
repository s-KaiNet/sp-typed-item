import { ListSetting } from '../Interfaces/listSetting';
import { SpService } from '../Common/spService';
import { Entity } from '../Interfaces/output/entity';
import { removeSlashes } from '../Common/utils';
import { Field } from '../Interfaces/field';
import { FieldSetting } from '../Interfaces/fieldSetting';
import { Field as FieldEntity } from '../Interfaces/output/field';
import { ContentTypeSetting } from '../Interfaces/contentTypeSetting';

export class DataFilter {
    constructor(private service: SpService) { }

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
            let url = removeSlashes(listSetting.url);
            for (const list of lists) {
                let listRelativeUrl = removeSlashes(list.RootFolder.ServerRelativeUrl.replace(serverRelativeUrl, ''));
                if (listRelativeUrl === url) {
                    let entity: Entity = {
                        name: list.Title,
                        fields: null
                    };
                    entities.push(entity);

                    let listFields = await this.service.getListFields(list.Title);
                    entity.fields = this.populateFields(listFields, listSetting.fields);
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
                        name: contentType.Name,
                        fields: null
                    };
                    entities.push(entity);

                    let listFields = await this.service.getContentTypeFields(id);
                    entity.fields = this.populateFields(listFields, contentTypeSetting.fields);
                }
            }
        }

        return entities;
    }

    private populateFields(fields: Field[], fieldSetting: FieldSetting): FieldEntity[] {
        let fieldEntities: FieldEntity[] = [];

        for (const field of fields) {
            if (!fieldSetting) {
                fieldEntities.push({
                    entityPropertyName: field.EntityPropertyName,
                    fieldType: field.FieldTypeKind
                });
            } else {
                if ((fieldSetting.excludeHidden && field.Hidden)) {
                    continue;
                }

                if (!fieldSetting.exclude || fieldSetting.exclude.length === 0) {
                    fieldEntities.push({
                        entityPropertyName: field.EntityPropertyName,
                        fieldType: field.FieldTypeKind
                    });
                } else if (fieldSetting.exclude.indexOf(field.InternalName) === -1) {
                    fieldEntities.push({
                        entityPropertyName: field.EntityPropertyName,
                        fieldType: field.FieldTypeKind
                    });
                }
            }
        }

        return fieldEntities;
    }
}
