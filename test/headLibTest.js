const functions = require('../src/headLib.js');
const display = functions.display;
const readContent = functions.readContent;
const getInputNumsOfLines = functions.getInputNumsOfLines;
const getCharacter = functions.getCharacter;
const getLinesOrCharacters = functions.getLinesOrCharacters;
const isBadFile = functions.isBadFile;

let events = require("events");
let test = {};
exports.test = test;
let assert = require("assert");

test["display(text,outputStream) should display text"] = function() {
  let writtenText = "";
  let dummyStream = {
    write: function(text) {
      writtenText = text;
    }
  }
  display(dummyStream, "hello");
  assert.equal(writtenText, "hello");
};

test["readContent(fileName,fs) should read file content"] = function() {
  let dummyStream = {};
  dummyStream.readFileSync = function(fileName) {
    return "=======>  " + fileName;
  };
  assert.equal(readContent("manish", dummyStream), "=======>  manish");
};

test["getInputNumsOfLines(fileContents,requiredLines) returns required numbers of lines of given contents"] = function() {
  let fileContent = "\nline1\nline2\nline3\nline4\nline5\nline6\nline7\nline8" +
    "\nline9\nline10\nline11\nline12\nline13\nline14\nline15\nline16\nline17\n\n";
  let firstResult = "\nline1\nline2\nline3\nline4\nline5\nline6\nline7\n";
  let secondResult = "\n";
  assert.equal(getInputNumsOfLines(fileContent, 8), firstResult);
  assert.equal(getInputNumsOfLines(fileContent, 0), secondResult);
};

test["getCharacter(fileContents,requiredchar) returns required numbers of given contents characters "] = function() {
  let fileContents = "\n\nline1\nline2\nline3\nline4\nline5\nline6\nline7\nline8";
  let firstResult = "\n\nlin\n";
  let secondResult = "\n\nline\n";
  let thirdResult = "\n";
  assert.equal(getCharacter(fileContents, 5), firstResult);
  assert.equal(getCharacter(fileContents, 6), secondResult);
  assert.equal(getCharacter(fileContents, 0), thirdResult);
};

test["getLinesOrCharacters() should return number of lines or character according to options"] = function() {
  let options = {
    "-n": 5
  };
  let fileContents = "line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8";
  let firstResult = "==> dummyFile <==\nline1\nline2\nline3\nline4\nline5\n\n";
  assert.equal(getLinesOrCharacters("dummyFile", fileContents, options, 1), firstResult);
  options = {
    "-c": 5
  };
  let secondResult = "==> dummyFile <==\nline1\n\n";
  assert.equal(getLinesOrCharacters("dummyFile", fileContents, options, 1), secondResult);
};

test["getLinesOrCharacters() should return number of lines or character with heading if more than one file is provided"] = function() {
  let fileContents = "line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8";
  let firstResult = "==> " + "dummyFile" + " <==\n" + "line1\nline2\nline3\nline4\nline5\n\n";
  let options = {
    "-n": 5
  };
  assert.equal(getLinesOrCharacters("dummyFile", fileContents, options, 2), firstResult);
  options = {
    "-c": 5
  };
  let secondResult = "==> " + "dummyFile" + " <==\n" + "line1\n\n";
  assert.equal(getLinesOrCharacters("dummyFile", fileContents, options, 2), secondResult);
};

test["isBadFile(fileName,fs) tells thst file is exists in current directory or not"] = function() {
  let files = ['one.txt', 'two.txt'];
  let dummyStream = {};
  dummyStream.existsSync = function(fileName) {
    return files.includes(fileName);
  };
  assert.ok(isBadFile("one.tx", dummyStream));
  assert.ok(!isBadFile("two.txt", dummyStream));
};
