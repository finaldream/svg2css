#!/usr/bin/env node

'use strict';

var Svg2CssApp = require('./lib/svg2css.js');

process.title = 'svg2css';

var app = new Svg2CssApp();
app.init(process.argv.slice(2));
