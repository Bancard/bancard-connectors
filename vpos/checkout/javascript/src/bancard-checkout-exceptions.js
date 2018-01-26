const DivDoesNotExist = function DivDoesNotExist(divId) {
  this.name = 'DivDoesNotExist';
  this.message = `Div with id: ${divId} could not be found.`;
  this.stack = (new Error()).stack;
};
DivDoesNotExist.prototype = new Error();

const InvalidParameter = function InvalidParameter(parameter) {
  this.name = 'InvalidParameter';
  this.message = `${parameter} must be a non empty string.`;
  this.stack = (new Error()).stack;
};
InvalidParameter.prototype = new Error();

const exceptions = {
  DivDoesNotExist,
  InvalidParameter,
};

export default exceptions;
