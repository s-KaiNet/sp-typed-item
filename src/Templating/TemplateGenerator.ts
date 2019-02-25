import * as path from 'path';
import * as fs from 'fs';
import * as ejs from 'ejs';
import { promisify } from 'bluebird';

import { Config } from '../Interfaces/Config';
import { Entity } from '../Interfaces/Output/Entity';
import { LISTS_OUTPUT, CONTENT_TYPES_OUTPUT } from '../Common/Consts';
import { removeDirectory, addDirectory, removeExtraSymbols } from '../Common/Utils';

let readFileAsync = promisify<any, string, any>(fs.readFile);
let writeFileAsync = promisify<void, string, any>(fs.writeFile);

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
        let templateString = (await readFileAsync(path.resolve(__dirname, './Templates/url.ejs'), null)).toString();
        let template = ejs.compile(templateString, {
            filename: path.resolve(__dirname, './Templates/url.ejs')
        });
        let result = template();
        await writeFileAsync(path.resolve(config.outputPath, 'Url.ts'), result);

        templateString = (await readFileAsync(path.resolve(__dirname, './Templates/location.ejs'), null)).toString();
        template = ejs.compile(templateString, {
            filename: path.resolve(__dirname, './Templates/location.ejs')
        });
        result = template();
        await writeFileAsync(path.resolve(config.outputPath, 'Location.ts'), result);

        templateString = (await readFileAsync(path.resolve(__dirname, './Templates/metadata.ejs'), null)).toString();
        template = ejs.compile(templateString, {
            filename: path.resolve(__dirname, './Templates/metadata.ejs')
        });
        result = template();
        await writeFileAsync(path.resolve(config.outputPath, 'Metadata.ts'), result);
    }

    private static async renderContentTypes(config: Config, contentTypes: Entity[]): Promise<void> {
        let contentTypesOutputPath = path.resolve(config.outputPath, CONTENT_TYPES_OUTPUT);

        await addDirectory(contentTypesOutputPath);

        let templateString = (await readFileAsync(path.resolve(__dirname, './Templates/root.ejs'), null)).toString();
        let template = ejs.compile(templateString, {
            filename: path.resolve(__dirname, './Templates/root.ejs')
        });

        for (const contentType of contentTypes) {
            let result = template(contentType);
            await writeFileAsync(path.resolve(contentTypesOutputPath, `${contentType.fileName ? contentType.fileName : removeExtraSymbols(contentType.name)}.ts`), result);
        }
    }

    private static async renderLists(config: Config, lists: Entity[]): Promise<void> {

        let listsOutputPath = path.resolve(config.outputPath, LISTS_OUTPUT);

        await addDirectory(listsOutputPath);

        let templateString = (await readFileAsync(path.resolve(__dirname, './Templates/root.ejs'), null)).toString();
        let template = ejs.compile(templateString, {
            filename: path.resolve(__dirname, './Templates/root.ejs')
        });

        for (const list of lists) {
            let result = template(list);
            await writeFileAsync(path.resolve(listsOutputPath, `${list.fileName ? list.fileName : list.name}.ts`), result);
        }
    }
}
