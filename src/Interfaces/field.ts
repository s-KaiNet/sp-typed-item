import { FieldType } from '../types/sp';

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
