import * as path from 'path';
import * as fs from 'fs';
import * as ejs from 'ejs';
import * as pify from 'pify';
import * as mkdirp from 'mkdirp';
import * as rimraf from 'rimraf';

import { Config } from '../Interfaces/Config';
import { Entity } from '../Interfaces/Output/Entity';
import { LISTS_OUTPUT, CONTENT_TYPES_OUTPUT } from '../Common/Consts';
import { removeExtraSymbols } from '../Common/Utils';

let readFileAsync = pify(fs.readFile);
let writeFileAsync = pify(fs.writeFile);
let mkdirpAsync = pify(mkdirp);
let rimrafAsync = pify(rimraf);

export class TemplateGenerator {
    public static async renderTemplates(config: Config, lists: Entity[], contentTypes: Entity[]): Promise<void> {
        let outputPath = path.resolve(config.outputPath);
        await rimrafAsync(outputPath);
        await mkdirpAsync(outputPath);

        await this.renderHelperInterfaces(config);

        if (lists.length > 0) {
            await this.renderLists(config, lists);
        }

        if (contentTypes.length > 0) {
            await this.renderContentTypes(config, contentTypes);
        }
    }

    private static async renderHelperInterfaces(config: Config): Promise<void> {
        let templateString = (await readFileAsync(path.resolve(__dirname, './Templates/url.ejs'))).toString();
        let template = ejs.compile(templateString, {
            filename: path.resolve(__dirname, './Templates/url.ejs')
        });
        let result = template();
        await writeFileAsync(path.resolve(config.outputPath, 'Url.ts'), result);

        templateString = (await readFileAsync(path.resolve(__dirname, './Templates/location.ejs'))).toString();
        template = ejs.compile(templateString, {
            filename: path.resolve(__dirname, './Templates/location.ejs')
        });
        result = template();
        await writeFileAsync(path.resolve(config.outputPath, 'Location.ts'), result);

        templateString = (await readFileAsync(path.resolve(__dirname, './Templates/metadata.ejs'))).toString();
        template = ejs.compile(templateString, {
            filename: path.resolve(__dirname, './Templates/metadata.ejs')
        });
        result = template();
        await writeFileAsync(path.resolve(config.outputPath, 'Metadata.ts'), result);
    }

    private static async renderContentTypes(config: Config, contentTypes: Entity[]): Promise<void> {
        let contentTypesOutputPath = path.resolve(config.outputPath, CONTENT_TYPES_OUTPUT);

        await mkdirpAsync(contentTypesOutputPath);

        let templateString = (await readFileAsync(path.resolve(__dirname, './Templates/root.ejs'))).toString();
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

        await mkdirpAsync(listsOutputPath);

        let templateString = (await readFileAsync(path.resolve(__dirname, './Templates/root.ejs'))).toString();
        let template = ejs.compile(templateString, {
            filename: path.resolve(__dirname, './Templates/root.ejs')
        });

        for (const list of lists) {
            let result = template(list);
            await writeFileAsync(path.resolve(listsOutputPath, `${list.fileName ? list.fileName : list.name}.ts`), result);
        }
    }
}
