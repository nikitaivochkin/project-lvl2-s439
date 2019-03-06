#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import gendiff from '../src';

test.each([
  ['before.json', 'after.json', 'expected.txt'],
  ['before1.json', 'after1.json', 'expected1.txt'],
  ['before.yaml', 'after.yaml', 'expected.txt'],
  ['before1.yaml', 'after1.yaml', 'expected1.txt'],
  ['before.ini', 'after.ini', 'expected.txt'],
  ['before1.ini', 'after1.ini', 'expected1.txt'],
])(
  '.gendiff(%#)',
  (fileBefore, fileAfter, expectedValue) => {
    const getPath = fileName => path.join('__tests__', '__fixtures__', `${fileName}`);
    const expected = fs.readFileSync(getPath(expectedValue), 'utf8');
    expect(gendiff(getPath(fileBefore), getPath(fileAfter))).toBe(expected);
  },
);
