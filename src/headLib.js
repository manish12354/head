let Parser = require("./headParser.js")

const display = function(outputStream, text) {
  outputStream.write(text);
};

const isBadFile = function(fileName, fileSystem) {
  return !fileSystem.existsSync(fileName);
};

const readContent = function(fileName, fileSystem) {
  var contents = fileSystem.readFileSync(fileName, "utf8");
  return contents;
};

const getInputNumsOfLines = function(fileContents, requiredLines) {
  let splitedContent = fileContents.split("\n");
  let requiredLine = splitedContent.slice(0, requiredLines).join("\n") + "\n";
  return requiredLine;
};

const getCharacter = function(fileContents, requiredchar) {
  let requiredChar = fileContents.slice(0, requiredchar) + "\n";
  return requiredChar;
};

const hasSingleFile = function(filesArrayLength){
  return filesArrayLength==1;
};

//make lines and bytes functions as one.
const getLinesOfOneOrMoreFiles = function(lineOrByteCountOption, contents, fileName, filesArrayLength) {
  let requiredLines = lineOrByteCountOption["-n"];
  if (hasSingleFile(hasSingleFile)) {
    return getInputNumsOfLines(contents, requiredLines);
  } else {
    return "==> " + fileName + " <==\n" + getInputNumsOfLines(contents, requiredLines)+"\n";
  }
};

const getBytesOfOneOrMoreFiles = function(lineOrByteCountOption, contents, fileName, filesArrayLength) {
  let requiredchar = lineOrByteCountOption["-c"];
  if (hasSingleFile(hasSingleFile)) {
    return getCharacter(contents, requiredchar);
  } else {
    return "==> " + fileName + " <==\n" + getCharacter(contents, requiredchar)+"\n";
  }
};

const getLinesOrCharacters = function(fileName, contents, lineOrByteCountOption, filesArrayLength) {
  let lineOrByteCountOptionKeys = Object.keys(lineOrByteCountOption);
  if (lineOrByteCountOptionKeys.includes("-n")) {
    return getLinesOfOneOrMoreFiles(lineOrByteCountOption, contents, fileName, filesArrayLength);
  } else {
    return getBytesOfOneOrMoreFiles(lineOrByteCountOption, contents, fileName, filesArrayLength)
  }
};

const dealWithStdInLines = function(inputStream, outputStream, lineCountOption) {
  let lineCount = lineCountOption["-n"];
  let counter = 0;
  inputStream.setEncoding('utf8');
  inputStream.on('data', function(text) {
    display(outputStream, text);
    counter++;
    if (counter ==lineCount) {
      inputStream.unref();
    }
  });
};

const dealWithStdinBytes = function(inputStream, outputStream, byteCountOption) {
  let byteCount = byteCountOption["-c"];
  let fullContent = "";
  inputStream.setEncoding('utf8');
  inputStream.on('data', function(text) {
    fullContent += text;
    if (fullContent.length >= byteCount) {
      let contents = fullContent.slice(0, byteCount);
      display(outputStream, contents);
      inputStream.unref();
    }
  });
}

const dealWithStdInputOrOutput = function(lineOrByteCountOption, inputStream, outputStream) {
  if (Object.keys(lineOrByteCountOption).includes("-n")) {
    return dealWithStdInLines(inputStream, outputStream, lineOrByteCountOption);
  } else {
    return dealWithStdinBytes(inputStream, outputStream, lineOrByteCountOption);
  }
};

const help = function() {
  let helpTxt =
    "HEAD(1)                   BSD General Commands Manual                  HEAD(1)" + "\n\n\n" +
    "NAME" + "\n" +
    "    head -- display first lines of a file" + "\n\n" +
    "SYNOPSIS" + "\n" +
    "    head [-n count | -c bytes] [file ...]" + "\n\n" +
    "DESCRIPTION" + "\n" +
    "    This filter displays the first count lines or bytes of each of the specified files,or of" + "\n" +
    "    the standard input if no files are specified.  If count is omitted it defaults to 10." + "\n\n" +
    "    If more than a single file is specified,each file is preceded by a header consisting of" + "\n" +
    "    the string ``==> XXX <=='' where ``XXX'' is the name of the file.\n"
  return helpTxt;
};

const hasFile = function(fileNames) {
  return fileNames.length != 0;
};

const displayLinesOrChar = function(parser, fs, outputStream) {
  let fileNames = parser.getAllFiles();
  let lineOrByteCountOption = parser.getAllOptions();
  let filesArrayLength = fileNames.length;
  for (var index = 0; index < fileNames.length; index++) {
    let currentFile = fileNames[index];
    if (isBadFile(currentFile, fs)) {
      let error = "head: " + currentFile + ": No such file or directory\n";
      display(outputStream, error);
    } else {
      let contents = readContent(currentFile, fs);
      let requiredLinesOrChar = getLinesOrCharacters(currentFile, contents, lineOrByteCountOption, filesArrayLength);
      display(outputStream, requiredLinesOrChar);
    }
  }
};

const main = function(allArgument, fs, inputStream, outputStream) {
  let parser = new Parser(allArgument);
  try {
    parser.parse()
    let lineOrByteCountOption = parser.getAllOptions();
    let fileNames = parser.getAllFiles();
    let hasHelpOption = parser.hasHelpOption();
    if (hasHelpOption) {
      display(outputStream, help());
    } else if (hasFile(fileNames)) {
      displayLinesOrChar(parser, fs, outputStream);
    } else if (!hasFile(fileNames)) {
      dealWithStdInputOrOutput(lineOrByteCountOption, inputStream, outputStream);
    }
  } catch (error) {
    outputStream.write(error);
  }
};

exports.display = display;
exports.readContent = readContent;
exports.getInputNumsOfLines = getInputNumsOfLines;
exports.getCharacter = getCharacter;
exports.getLinesOrCharacters = getLinesOrCharacters;
exports.isBadFile = isBadFile;
exports.main = main;
