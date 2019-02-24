import { FieldType } from '../../types/SP';

export interface Field {
    entityPropertyName: string;
    fieldType: FieldType;
    fieldTypeName: string;
    template: string;
}
