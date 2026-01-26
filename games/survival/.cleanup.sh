#!/bin/bash

sed -i 's/\/\/.*$//' *.js

sed -i -e '/\/\*/,/\*\//d' *.js

js-beautify -r -t --wrap-line-length=80 --max-preserve-newlines=1 *.js *.html

