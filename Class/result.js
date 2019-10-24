class HttpOk {
  constructor(code, message, props) {
    this.status = 'OK';
    this.statusCode = 200;
    this.code = code;
    this.message = message;

    Object.assign(this, props);
  }
}

class HttpInvalid {
  constructor(code, message, props) {
    this.status = 'INVALID';
    this.statusCode = 400;
    this.code = code;
    this.message = message;

    Object.assign(this, props);
  }
}

class HttpError {
  constructor(code, message, props) {
    this.status = 'ERROR';
    this.statusCode = 500;
    this.code = code;
    this.message = message;

    Object.assign(this, props);
  }
}

class Invalid {
  constructor(code, message, props) {
    this.status = 'INVALID';
    this.code = code;
    this.message = message;

    Object.assign(this, props);
  }
}

module.exports = {
  HttpOk,
  HttpInvalid,
  HttpError,
  Invalid
};
