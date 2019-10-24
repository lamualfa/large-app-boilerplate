const chalk = require('chalk');
const Pretty_Error = require('pretty-error');
const stack_trace = require('stack-trace');
const { LEVEL, MESSAGE } = require('triple-beam');
const winston = require('winston');

const { NODE_ENV, LOGS } = require('Helpers/configs');

const pretty_error = new Pretty_Error();

const errorFormat = winston.format(info => {
  if (info instanceof Error) {
    if (NODE_ENV !== 'production') {
      info[MESSAGE] = pretty_error.render(info);
    }

    info = {
      ...info,
      message: info.message,
      stack: stack_trace.parse(info)
    };
  }

  return info;
});

const prettyFormat = winston.format((info, opts) => {
  if (!(MESSAGE in info)) {
    const level = info[LEVEL];
    const { message } = info;

    const newMessage = [];

    if (NODE_ENV === 'production') {
      newMessage.push(`${chalk.cyan(new Date().toISOString())}`);
    }

    if (info instanceof Error && NODE_ENV !== 'production') {
      newMessage.push(pretty_error.render(info));

      info[MESSAGE] = newMessage.join(' ');

      return info;
    }

    newMessage.push(`[${chalk[LOGS.COLORS[level]](level.toUpperCase())}]`);

    if (info.event) {
      newMessage.push(`(${chalk.keyword('orange')(info.event)})`);
    }

    if (info.namespace) {
      newMessage.push(chalk.magenta(info.namespace));
    }

    if (message) {
      newMessage.push(message.toString());
    } else {
      // Falsely value to string, like undefined, null
      newMessage.push(`${message}`);
    }

    info[MESSAGE] = newMessage.join(' ');

    return info;
  }

  return info;
});

const errorFileTransport = new winston.transports.File({
  dirname: LOGS.DIR,
  filename: 'error.log',
  silent: NODE_ENV !== 'production',
  format: winston.format.json()
});
const infoFileTransport = new winston.transports.File({
  dirname: LOGS.DIR,
  filename: 'info.log',
  silent: NODE_ENV !== 'production',
  format: winston.format.json()
});
const debugFileTransport = new winston.transports.File({
  dirname: LOGS.DIR,
  filename: 'debug.log',
  silent: NODE_ENV !== 'production',
  format: winston.format.json()
});
const globalConsoleTransport = new winston.transports.Console({
  format: prettyFormat({
    colors: LOGS.COLORS
  })
});

const logger = winston.createLogger({
  levels: LOGS.LEVELS,
  format: winston.format.combine(errorFormat(), winston.format.timestamp()),
  transports: [
    errorFileTransport,
    infoFileTransport,
    debugFileTransport,
    globalConsoleTransport
  ]
});

module.exports = logger;
