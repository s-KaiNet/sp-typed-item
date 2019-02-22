import { FieldType } from '../types/SP';

export interface Field {
    Id: string;
    Hidden: boolean;
    InternalName: string;
    EntityPropertyName: string;
    Required: boolean;
    Title: string;
    TypeAsString: string;
    FieldTypeKind: FieldType;
}
