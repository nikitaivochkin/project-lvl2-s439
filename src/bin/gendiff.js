#!/usr/bin/env node

import program from 'commander';
import getDifference from '..';

program
  .version('1.1.0')
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .action((fileBefore, fileAfter, option) => {
    console.log(getDifference(fileBefore, fileAfter, option.format));
  })
  .parse(process.argv);
