#!/bin/bash

scripts="\n"
for f in classes/*.js; do
  scripts+="		<script src=\"$f\"></script>\n"
done

sed "s|<!-- CLASSES_HERE -->|$scripts|" .index-template.html > index.html

