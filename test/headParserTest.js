let Parser = require("../src/headParser.js");
let assert = require("assert");
let test = {};
exports.test = test;


test["parser.getAllFiles() should return all files which are given"] = function() {
  let args = ["-n12", "myheadLib.js", "-nmanish"];
  let parser = new Parser(args);
  parser.parse();
  assert.deepEqual(parser.getAllFiles(), ["myheadLib.js", "-nmanish"]);
};

test["parser.getAllFiles() should return all files when options are also given"] = function() {
  let args = ["-n6", "myheadLib.js", '-n17'];
  let parser = new Parser(args);
  parser.parse();
  assert.deepEqual(parser.getAllFiles(), ["myheadLib.js", "-n17"]);
  args = ["-n6", "myheadLib.js", '-n17'];
  parser = new Parser(args);
  parser.parse();
  assert.deepEqual(parser.getAllFiles(), ["myheadLib.js", "-n17"]);
};

test["parser.getAllFiles() should return empty array when no files are given"] = function() {
  let args = [];
  let parser = new Parser(args);
  parser.parse();
  assert.deepEqual(parser.getAllFiles(), []);
};

test["parser.getAllFiles() should return files when options are not given"] = function() {
  let args = ["headLib.js", "runTest.js"];
  let parser = new Parser(args);
  parser.parse();
  assert.deepEqual(parser.getAllFiles(), ['headLib.js', 'runTest.js']);
};

test["should return default option"] = function() {
  let args = ["myheadLib.js", '-n17'];
  let parser = new Parser(args);
  parser.parse();
  assert.deepEqual(parser.getAllOptions(), {
    "-n": 10
  });
};

test["should select valid option when lineOption is given with a number"] = function() {
  let args = ["-n10", "one.txt"];
  let parser = new Parser(args);
  parser.parse();
  assert.deepEqual(parser.getAllOptions(), {
    "-n": "10"
  });
};

test["should select valid option when byteOption is given with a number"] = function() {
  let args = ["-c10", "one.txt"];
  let parser = new Parser(args);
  parser.parse();
  assert.deepEqual(parser.getAllOptions(), {
    "-c": '10'
  });
};

test["should select valid option when byteOption and number are given saperate"] = function() {
  let args = ["-c", "10", "one.txt"];
  let parser = new Parser(args);
  parser.parse();
  assert.deepEqual(parser.getAllOptions(), {
    "-c": "10"
  });
};

test["should select valid option when lineOption and number are given saperate"] = function() {
  let args = ["-n", "10", "one.txt"];
  let parser = new Parser(args);
  parser.parse();
  assert.deepEqual(parser.getAllOptions(), {
    "-n": "10"
  });
};

test["should select last valid option when many lineOptions are given"] = function() {
  let args = ["-n", "10", "-n", "4", "one.txt"];
  let parser = new Parser(args);
  parser.parse();
  assert.deepEqual(parser.getAllOptions(), {
    "-n": "4"
  });
};

test["should select last valid option when many byteOption are given"] = function() {
  let args = ["-c", "3", "-c", "2", "one.txt"];
  let parser = new Parser(args);
  parser.parse();
  assert.deepEqual(parser.getAllOptions(), {
    "-c": "2"
  });
};

test["should set only line count value"] = function() {
  let args = ["-2", "-4", "-5", "one.txt"];
  let parser = new Parser(args);
  parser.parse();
  assert.deepEqual(parser.getAllOptions(), {
    "-n": "5"
  });
};

test["should tell that help option is given or not"] = function() {
  let args = ["--help", "headLib.js", "runTest.js", "-15"];
  let parser = new Parser(args);
  parser.parse();
  assert.ok(parser.hasHelpOption());
  args = ["--help", "headLib.js", "runTest.js", "-15"];
  parser = new Parser(args);
  parser.parse();
  assert.ok(parser.hasHelpOption());
};

test["should throw error when more than one options are given"] = function() {
  let args = ["-n10", "-c2", "headLib.js", "runTest.js", "-15"];
  let parser = new Parser(args);
  let expectedError = "head: can't combine line and byte counts\n";
  try {
    parser.parse();
    assert.fail();
  } catch (error) {
    assert.equal(error, expectedError);
  }
};

test["should throw option needs argument error when no value is given"] = function() {
  let args = ["-n10", "-c"];
  let parser = new Parser(args);
  let expectedError = "head: option requires an argument -- c\n" +
    "usage: head [-n lines | -c bytes] [file ...]\n";
  try {
    parser.parse();
    assert.fail();
  } catch (error) {
    assert.equal(error, expectedError);
  }
};

test["should throw illegal line count when invalid value is given"] = function() {
  let args = ["-n10", "-n", "head.js"];
  let parser = new Parser(args);
  let expectedError = "head: illegal line count -- head.js\n";
  try {
    parser.parse();
    assert.fail();
  } catch (error) {
    assert.equal(error, expectedError);
  }
};

test["should throw illegal byte count when invalid value is given"] = function() {
  let args = ["-c10", "-c", "head.js"];
  let parser = new Parser(args);
  let expectedError = "head: illegal byte count -- head.js\n";
  try {
    parser.parse();
    assert.fail();
  } catch (error) {
    assert.equal(error, expectedError);
  }
};

test["should throw illegal line count when line and byte options and invalid value is given"] = function() {
  let args = ["-c10", "-n", "head.js"];
  let parser = new Parser(args);
  let expectedError = "head: illegal line count -- head.js\n";
  try {
    parser.parse();
    assert.fail();
  } catch (error) {
    assert.equal(error, expectedError);
  }
};

test["should throw illegal byte count when line and byte options and invalid value is given"] = function() {
  let args = ["-n10", "-c", "head.js"];
  let parser = new Parser(args);
  let expectedError = "head: illegal byte count -- head.js\n";
  try {
    parser.parse();
    assert.fail();
  } catch (error) {
    assert.equal(error, expectedError);
  }
};

test["should throw illegalOptionErr when illegal options are given after options"] = function() {
  let args = ["-n10", "-m", "head.js"];
  let parser = new Parser(args);
  let expectedError = "head: illegal option -- m" +
    "\nusage: head [-n lines | -c bytes] [file ...]\n";
  try {
    parser.parse();
    assert.fail();
  } catch (error) {
    assert.equal(error, expectedError);
  }
};

test["should throw illegalOptionErr when illegal options are given in starting"] = function() {
  let args = ["-e", "one.txt"];
  let parser = new Parser(args);
  let expectedError = "head: illegal option -- e" +
    "\nusage: head [-n lines | -c bytes] [file ...]\n";
  try {
    parser.parse();
    assert.fail();
  } catch (error) {
    assert.equal(error,expectedError);
  }
};

test["should throw illegalOptionErr when illegal options are given in middle"] = function() {
  let args = ["-1","-2","-f", "one.txt"];
  let parser = new Parser(args);
  let expectedError = "head: illegal option -- f" +
    "\nusage: head [-n lines | -c bytes] [file ...]\n";
  try {
    parser.parse();
    assert.fail();
  } catch (error) {
    assert.equal(error,expectedError);
  }
};
