import * as path from 'path';
import * as fs from 'fs';
import * as ejs from 'ejs';

import { Config } from '../Interfaces/Config';
import { Entity } from '../Interfaces/Output/Entity';
import { LISTS_OUTPUT, CONTENT_TYPES_OUTPUT } from '../Common/Consts';
import { removeDirectory, addDirectory, removeExtraSymbols } from '../Common/Utils';

export class TemplateGenerator {
    public static async renderTemplates(config: Config, lists: Entity[], contentTypes: Entity[]): Promise<void> {
        let outputPath = path.resolve(config.outputPath);
        await removeDirectory(outputPath);
        await addDirectory(outputPath);

        await this.renderHelperInterfaces(config);

        if (lists.length > 0) {
            await this.renderLists(config, lists);
        }

        if (contentTypes.length > 0) {
            await this.renderContentTypes(config, contentTypes);
        }
    }

    private static async renderHelperInterfaces(config: Config): Promise<void> {
        let templateString = fs.readFileSync(path.resolve(__dirname, './Templates/url.ejs')).toString();
        let template = ejs.compile(templateString, {
            filename: path.resolve(__dirname, './Templates/url.ejs')
        });
        let result = template();
        fs.writeFileSync(path.resolve(config.outputPath, 'Url.ts'), result);

        templateString = fs.readFileSync(path.resolve(__dirname, './Templates/location.ejs')).toString();
        template = ejs.compile(templateString, {
            filename: path.resolve(__dirname, './Templates/location.ejs')
        });
        result = template();
        fs.writeFileSync(path.resolve(config.outputPath, 'Location.ts'), result);

        templateString = fs.readFileSync(path.resolve(__dirname, './Templates/metadata.ejs')).toString();
        template = ejs.compile(templateString, {
            filename: path.resolve(__dirname, './Templates/metadata.ejs')
        });
        result = template();
        fs.writeFileSync(path.resolve(config.outputPath, 'Metadata.ts'), result);
    }

    private static async renderContentTypes(config: Config, contentTypes: Entity[]): Promise<void> {
        let contentTypesOutputPath = path.resolve(config.outputPath, CONTENT_TYPES_OUTPUT);

        await addDirectory(contentTypesOutputPath);

        let templateString = fs.readFileSync(path.resolve(__dirname, './Templates/root.ejs')).toString();
        let template = ejs.compile(templateString, {
            filename: path.resolve(__dirname, './Templates/root.ejs')
        });

        for (const contentType of contentTypes) {
            let result = template(contentType);
            fs.writeFileSync(path.resolve(contentTypesOutputPath, `${contentType.fileName ? contentType.fileName : removeExtraSymbols(contentType.name)}.ts`), result);
        }
    }

    private static async renderLists(config: Config, lists: Entity[]): Promise<void> {

        let listsOutputPath = path.resolve(config.outputPath, LISTS_OUTPUT);

        await addDirectory(listsOutputPath);

        let templateString = fs.readFileSync(path.resolve(__dirname, './Templates/root.ejs')).toString();
        let template = ejs.compile(templateString, {
            filename: path.resolve(__dirname, './Templates/root.ejs')
        });

        for (const list of lists) {
            let result = template(list);
            fs.writeFileSync(path.resolve(listsOutputPath, `${list.fileName ? list.fileName : list.name}.ts`), result);
        }
    }
}
