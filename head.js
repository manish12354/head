let main = require('./src/headLib.js').main;
let fs = require("fs");
let inputStream = process.stdin;
let outputStream = process.stdout;
let allArgument = process.argv.slice(2);


main(allArgument, fs, inputStream, outputStream);



// console.log('Not yet implemented');
