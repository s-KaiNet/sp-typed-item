#!/usr/bin/env node

import * as program from 'commander';
import * as path from 'path';

import { RenderOptions } from './Params';
import { SPTypedItem } from '.';
import { LogManager } from './Logging/LogManager';
import { Config } from './Interfaces/Config';

const { version } = require(path.join(__dirname, '..', 'package.json'));

program.version(version)
    .name('spitem')
    .usage('[command]')
    .description('Command line utility for TypeScript interface generation based on SharePoint data (lists or content types)');

program
    .command('render')
    .description('Outputs interface files based on configuration file provided')
    .option('--config <path to config file>', 'required, path to your sp-typed-item.json configuration file')
    .action(async (opts: RenderOptions) => {
        assert(opts.config, '--config');

        try {
            let config: Config[] = require(path.resolve(opts.config));

            await SPTypedItem.renderFiles(config[0]);
        } catch (error) {
            LogManager.instance.error(error);
            process.exit();
        }
    });

program.parse(process.argv);

if (program.args.length === 0) {
    program.help();
}

function assert(value: any, name: string) {
    if (typeof value === 'undefined') {
        LogManager.instance.error(`${name} - parameter is required`);
        process.exit();
    }
}
