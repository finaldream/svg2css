/**
 *  Svg2Css App.
 *  A small and simple SVG to inline CSS converter for node.js.
 *
 *  @author Oliver Erdmann, <o.erdmann@finaldream.de>
 *  @since 13.03.2015
 */

'use strict';

var fs   = require('fs');
var path = require('path');

/**
 * Instantiate and call either init with the required arguments or directly call process() with an array of files.
 *
 * @constructor
 */
var Svg2CssApp = function () {

    var srcFolder = '';
    var dstFile   = '';


    /**
     * Internal init function.
     * Needs only be called when evaluating arguments.
     *
     * @param {String[]} args
     */
    this.init = function (args) {

        if (args.length < 2) {
            this.help();
            process.exit(1);
            return;
        }

        srcFolder = args[0];
        dstFile   = args[1];

        fs.readdir(srcFolder, this._readdirCallback.bind(this));

    };


    /**
     * Readdir callback for error-processing and keeping the process-function clean.
     * Calls @see process();
     *
     * @param {Error} error
     * @param {String[]} files
     * @private
     */
    this._readdirCallback = function (error, files) {

        if (error) {
            console.error(error);
            process.exit(1);
        }

        this.process(files, dstFile);

    };


    /**
     * Processes the provided input-files and writes the result to destination.
     * @param {String[]} inputFiles
     * @param {String}   destination
     */
    this.process = function(inputFiles, destination) {

        inputFiles = this.filterFiles(inputFiles, '.svg');

        if (inputFiles.length < 1) {
            console.error('No input files found!');
        }

        var output = [];


        for (var i = 0; i < inputFiles.length; i++) {
            var file     = path.join(srcFolder, inputFiles[i]);
            var fileBase = inputFiles[i].split('.').shift();

            console.log('Processing:', file);

            var content = this.cleanUpInputFile(file);
            content     = this.makeCSSBlock(fileBase, content);

            output.push(content);
        }

        console.log('Writing file', destination);
        fs.writeFile(destination, output.join('\n'));

    };

    /**
     * Filters an array of files by a provided extension.
     * @param {array} files
     * @param {string} ext  File-ext with a dot (eg. ".svg").
     */
    this.filterFiles = function (files, ext) {

        var result = [];

        for (var i = 0; i < files.length; i++) {
            if (path.extname(files[i]) === ext) {
                result.push(files[i]);
            }
        }

        return result;

    };


    /**
     * Reads the input-file and cleans up line-breaks, comments and tabs.
     *
     * @param {string} filePath File to read.
     * @returns {string} Single line content-string.
     */
    this.cleanUpInputFile = function(filePath) {

        var content = fs.readFileSync(filePath, {encoding: 'utf-8'});

        // Clean up.
        return content
            // Remove comments.
            .replace(/<!--[\s\S]*?-->/g, '')
            // Remove linebreaks.
            .replace(/(\n|\r)/gm, '')
            // Replace tabs / collapse double tabs.
            .replace(/(\t\t|\t)/gm, ' ');

    };


    /**
     * Generates a named CSS-Block from file-content.
     *
     * @param {String} name    Selector-name.
     * @param {String} content Content to be encoded.
     *
     * @returns {string} Generated CSS-block.
     */
    this.makeCSSBlock = function (name, content) {

        var encoded = new Buffer(content).toString('base64');
        //var encoded = encodeURIComponent(content);

        return [
            '.', name, ' {\n',
            '    background-image: url(data:image/svg+xml;base64,', encoded,');\n',
            '}\n'
        ].join('');

    };


    /**
     * Help-screen.
     */
    this.help = function() {

        var text = [
            'Svg2Css Utility',
            '',
            'Takes a folder of SVG-files and translates them into a single CSS-file with inline background-images.',
            'The filenames will be used as CSS-selectors for the generated rules.',
            '',
            'Usage:',
            '\tnode svg2css.js SOURCE-FOLDER DESTINATION-FILE'
        ];

        console.log(text.join('\n'));

    };

};

module.exports = Svg2CssApp;
