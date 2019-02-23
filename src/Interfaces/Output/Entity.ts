import { Field } from './Field';

export interface Entity {
    name: string;
    fields: Field[];
    fileName: string;
}
