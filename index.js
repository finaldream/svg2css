#!/usr/bin/env node

'use strict';

var Svg2CssApp = require('./lib/svg2css.js');
var cli        = require('commander');
var pJson      = require('./package.json');

process.title = 'svg2css';

var desc = [
    'Svg2Css Utility, Version ' + pJson.version,
    '',
    'Takes a folder of SVG-files and translates them into a single CSS-file with inline background-images.',
    'The filenames will be used as CSS-selectors for the generated rules.'
].join('\n');


cli.version(pJson.version)
    .description(desc)
    .usage('[options] <source-dir> <target-file>')
    .option('--prefix [value]', 'Prepended string to each selector in the resulting css.')
    .parse(process.argv);

if (!process.argv.slice(2).length) {
    cli.outputHelp();
    return;
}

var app = new Svg2CssApp();
app.init(cli);
