# Introduction
`svg2css` is a small and simple tool for converting SVG to inline CSS. It takes a bunch of SVG-files, performes some cleanup-actions and outputs them as a single CSS-file with a single selector representing each image.

The graphics are converted into background-images with base64-encoded data-URLs. They are exposed through CSS-classes which match the original filenames.

# Installation

Run:
```
npm install -g svg2css
```
# Usage

```
node svg2css.js SOURCE-FOLDER DESTINATION-FILE
```
