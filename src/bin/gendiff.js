#!/usr/bin/env node

import program from 'commander';
import getDifference from '..';

program
  .version('1.0.6')
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .action((fileBefore, fileAfter) => {
    console.log(getDifference(fileBefore, fileAfter));
  })
  .parse(process.argv);
