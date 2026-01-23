#!/bin/bash

js-beautify -r -t --wrap-line-length=80 --max-preserve-newlines=1 *.js *.html

sed -i 's/\/\/.*$//' *.js *.html

sed -i -e '/\/\*/,/\*\//d' *.js *.html

