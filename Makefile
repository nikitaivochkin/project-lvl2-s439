install: 
	npm install
	
start:
	npx run babel-node -- src/bin/gendiff.js

publish:
	npm publish

lint:
	npx run eslint .
