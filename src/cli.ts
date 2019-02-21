#!/usr/bin/env node

import * as programm from 'commander';

const packageJson = require('../package.json');

programm.version(packageJson.version)
.parse(process.argv);
