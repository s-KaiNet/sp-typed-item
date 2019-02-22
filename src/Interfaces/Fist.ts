import { Folder } from './Folder';

export interface List {
    Hidden: boolean;
    Id: string;
    Title: string;
    RootFolder: Folder;
}
