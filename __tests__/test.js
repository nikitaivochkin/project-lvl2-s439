#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import gendiff from '../src';

const getPath = fileName => path.join('__tests__', '__fixtures__', `${fileName}`);

test('diff json 1', () => {
  const expected = fs.readFileSync(getPath('expected.txt'), 'utf8');
  expect(gendiff(getPath('before.json'), getPath('after.json'))).toBe(expected);
});


test('diff json 2', () => {
  const expected = fs.readFileSync(getPath('expected1.txt'), 'utf8');
  expect(gendiff(getPath('before1.json'), getPath('after1.json'))).toBe(expected);
});

test('diff yaml 1', () => {
  const expected = fs.readFileSync(getPath('expected.txt'), 'utf8');
  expect(gendiff(getPath('before.yaml'), getPath('after.yaml'))).toBe(expected);
});


test('diff yaml 2', () => {
  const expected = fs.readFileSync(getPath('expected1.txt'), 'utf8');
  expect(gendiff(getPath('before1.yaml'), getPath('after1.yaml'))).toBe(expected);
});
