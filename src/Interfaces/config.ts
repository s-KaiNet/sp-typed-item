import { ListSetting } from './listSetting';
import { ContentTypeSetting } from './contentTypeSetting';

export interface Config {
    siteUrl: string;
    authConfigPath?: string;
    lists?: ListSetting[];
    outputPath: string;
    contentTypes?: ContentTypeSetting[];
}
