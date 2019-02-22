import * as path from 'path';
import * as fs from 'fs';
import * as ejs from 'ejs';

import { Config } from '../Interfaces/Config';
import { Entity } from '../Interfaces/Output/Entity';
import { LISTS_OUTPUT, CONTENT_TYPES_OUTPUT } from '../Common/Consts';

export class TemplateGenerator {
    public static renderTemplates(config: Config, lists: Entity[], contentTypes: Entity[]): void {
        let listsOutputPath = path.resolve(config.outputPath, LISTS_OUTPUT);
        let contentTypeOutputPath = path.resolve(config.outputPath, CONTENT_TYPES_OUTPUT);

        let templateString = fs.readFileSync('./Templates/root.ejs').toString();
        let template = ejs.compile(templateString, {
            filename: path.resolve(__dirname, './Templates/root.ejs')
        });

        let result = template(lists);
    }
}
