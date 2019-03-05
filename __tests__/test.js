#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import gendiff from '../src';

const getPath = fileName => path.join('__tests__', '__fixtures__', `${fileName}`);
const expected = fs.readFileSync(getPath('expected.txt'), 'utf8');
const expected1 = fs.readFileSync(getPath('expected1.txt'), 'utf8');

// eslint-disable-next-line no-undef
test('diff json 1', () => {
  // eslint-disable-next-line no-undef
  expect(gendiff(getPath('before.json'), getPath('after.json'))).toBe(expected);
});

// eslint-disable-next-line no-undef
test('diff json 2', () => {
  // eslint-disable-next-line no-undef
  expect(gendiff(getPath('before1.json'), getPath('after1.json'))).toBe(expected1);
});
