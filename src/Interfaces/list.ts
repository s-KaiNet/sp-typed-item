import { Folder } from './folder';

export interface List {
    Hidden: boolean;
    Id: string;
    Title: string;
    RootFolder: Folder;
}
