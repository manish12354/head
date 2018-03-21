const isValidValue = function(value) {
  return Number.isInteger(+value) && +value != 0;
};

const startsWithHyphen = function(argument) {
  return argument.startsWith("-");
};

const isAnyFileExist = function(files) {
  return files.length > 0;
};

const isHelpOption = function(argument) {
  return argument == "--help" || argument == "-h"
};

const hasMoreThanOneOptions = function(options) {
  return Object.keys(options).length > 1;
};

const cantCombineLineAndByteErr = function(options) {
  if (hasMoreThanOneOptions(options)) {
    let error = "head: can't combine line and byte counts\n";
    throw error;
  }
};

const isLineCountOption = function(argument) {
  return argument == "-n";
};

const illegalCountErr = function(option, illegalValue) {
  if (isLineCountOption(option)) {
    var error = "head: illegal line count -- " + illegalValue + "\n";
  } else {
    var error = "head: illegal byte count -- " + illegalValue + "\n";
  }
  throw error;
};

const optionsRequiresValueErr = function(argument) {
  let error = "head: option requires an argument -- " + argument.slice(1) +
    "\nusage: head [-n lines | -c bytes] [file ...]\n"
  throw error;
};


const illegalOptionErr = function(argument) {
  let error = "head: illegal option -- " + argument +
    "\nusage: head [-n lines | -c bytes] [file ...]\n";
  throw error;
};

const isUndefined = function(argument) {
  return argument == undefined;
};

const hasOptions = function(options) {
  return Object.keys(options).length != 0;
};



const Parser = function(userInputs) {
  this.validOptions = ["-n", "-c"];
  this.arguments = userInputs;
  this.options = {};
  this.files = [];
  this.helpOption = false;
}

Parser.prototype = {

  isValidOption: function(argument) {
    let options = this.validOptions;
    return options.includes(argument);
  },

  startsWithOptions: function(argument) {
    let options = this.validOptions;
    let option = argument.slice(0, 2);
    return options.includes(option);
  },

  startsWithOptionAndValue: function(argument) {
    return argument.length > 2 && this.startsWithOptions(argument);
  },

  setCombinedOptions: function(argument) {
    let option = argument.slice(0, 2);
    let value = argument.slice(2);
    if (isValidValue(+value) && value > 0) {
      this.options[option] = value;
    } else {
      illegalCountErr(option, value);
    }
  },

  setSplittedOptions: function(argument, nextArgument) {
    if (isValidValue(+nextArgument) && +nextArgument > 0) {
      this.options[argument] = nextArgument;
    } else if (isUndefined(nextArgument)) {
      optionsRequiresValueErr(argument);
    } else {
      illegalCountErr(argument, nextArgument);
    }
  },

  setDefaultValue: function() {
    if (!hasOptions(this.options)) {
      this.options["-n"] = 10;
    }
  },

  isIllegalOption: function(argsIndex) {
    if (argsIndex > 0) {
      let previousArgument = this.arguments[argsIndex - 1];
      let isOption = (this.startsWithOptionAndValue(previousArgument) || this.isValidOption(this.arguments[argsIndex - 2]));
      return isOption;
    }
  },

  setLineCountValue: function(argsIndex) {
    let selectedArgument = this.arguments[argsIndex];
    let illegalOption = selectedArgument.slice(1, 2);
    if (this.isIllegalOption(argsIndex)) {
      illegalOptionErr(illegalOption);
    }
    if (isValidValue(selectedArgument)) {
      let value = selectedArgument.slice(1);
      this.options["-n"] = Math.abs(value);
    } else {
      illegalOptionErr(illegalOption);
    }
  },

  pushIntoFiles: function(argsIndex) {
    let argument = this.arguments[argsIndex];
    let previousArgument = this.arguments[argsIndex - 1];
    if (!this.isValidOption(previousArgument)) {
      this.files.push(argument);
    }
  },

  setHelpOption: function() {
    this.helpOption = true;
  },

  dealWithHyphenValue: function(argsIndex, argument) {
    let nextArgument = this.arguments[argsIndex + 1];
    if (isHelpOption(argument)) {
      this.setHelpOption();
    } else if (this.startsWithOptionAndValue(argument)) {
      this.setCombinedOptions(argument);
    } else if (this.isValidOption(argument)) {
      this.setSplittedOptions(argument, nextArgument);
    } else {
      this.setLineCountValue(argsIndex);
    }
  },

  // parse: function() {
  //   for (var argsIndex = 0; argsIndex < this.arguments.length; argsIndex++) {
  //     let previousArgument = this.arguments[argsIndex - 1];
  //     let argument = this.arguments[argsIndex];
  //     if (isAnyFileExist(this.files)) {
  //       this.pushIntoFiles(argsIndex);
  //     } else if (startsWithHyphen(argument)) {
  //       this.dealWithHyphenValue(argsIndex, argument);
  //     } else {
  //       this.pushIntoFiles(argsIndex);
  //     }
  //   }
  //   cantCombineLineAndByteErr(this.options);
  //   this.setDefaultValue();
  // },

  parse: function() {
    let self = this;
    this.arguments.reduce(function(options, element, index) {
      if (isAnyFileExist(self.files)) {
        self.pushIntoFiles(index);
      } else if (startsWithHyphen(element)) {
        self.dealWithHyphenValue(index, element);
      } else {
        self.pushIntoFiles(index);
      }
      cantCombineLineAndByteErr(self.options);
      self.setDefaultValue();
    },self.options);
  },

  getAllFiles: function() {
    return this.files;
  },

  getAllOptions: function() {
    return this.options;
  },

  hasHelpOption: function() {
    return this.helpOption;
  }
}

module.exports = Parser;
// let input = process.argv.slice(2);
// let parser = new Parser(input);
// parser.parse()
// console.log(parser);
