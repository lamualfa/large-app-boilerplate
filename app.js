/**
 * LARGE-APP-BOILERPLATE
 * Written by https://github.com/laodemalfatih
 * Written on 24 Oct 2019
 */

process.stdin.resume();

const path = require('path');
const module_alias = require('module-alias');

module_alias.addAliases({
  Helpers: path.resolve('./Helpers'),
  Class: path.resolve('./Class'),
  Dbs: path.resolve('./Dbs'),
  Libs: path.resolve('./Libs'),
  Servers: path.resolve('./Servers'),
  Utils: path.resolve('./Utils')
});

const { Service } = require('Class/service');
const LOGS = require('Helpers/logs');
const { SERVICES } = require('Helpers/configs');

const serviceApp = new Service(['APP']);
const serviceDbMongodb = require('Dbs/Mongodb').service;
const serviceDbRedis = require('Dbs/Redis').service;
const serviceDbRabitmq = require('Dbs/Rabbitmq').service;
const serviceServerHttp = require('Servers/Http/http').service;
const serviceServerHttps = require('Servers/Http/https').service;
const serviceServerWs = require('Servers/Ws/ws').service;
const serviceServerWss = require('Servers/Ws/wss').service;

/** You only need to comment on services that you don't need. Example:
I don't need message broker like Rabbitmq, just comment that:

const services = [
  serviceDbMongodb,
  serviceDbRedis,
  // serviceDbRabitmq,
  serviceServerHttp,
  serviceServerHttps,
  serviceServerWs,
  serviceServerWss
];
*/
const services = [
  serviceDbMongodb,
  serviceDbRedis,
  serviceDbRabitmq,
  serviceServerHttp,
  serviceServerHttps,
  serviceServerWs,
  serviceServerWss
];

for (let i = 0; i < services.length; i += 1) {
  const service = services[i];

  service.on('info', (info, ...args) => {
    if (info && typeof info === 'object') {
      info.namespace = service.namespace;
    } else {
      info = {
        namespace: service.namespace,
        message: info
      };
    }

    LOGS.info(info, ...args);
  });
  service.on('error', (error, ...args) => {
    error.namespace = service.namespace;

    serviceApp.emit('error', error, ...args);
  });
}

serviceApp.init = async () => {
  try {
    let hasError = false;

    const infos = await Service.execAllSeries(services, 'init', {
      stopOnError: true,
      timeout: SERVICES.EVENTS.TIMEOUTS.init
    });

    for (let i = 0; i < infos.length; i += 1) {
      const info = infos[i];

      if (info instanceof Error) {
        hasError = true;
        LOGS.error(info);
      } else {
        LOGS.info(info);
      }
    }

    if (hasError) {
      throw new Error('ERROR');
    } else {
      return 'READY';
    }
  } catch (error) {
    error.stopApp = true;

    throw error;
  }
};

serviceApp.stop = async () => {
  let hasError = false;

  const infos = await Service.execAllSeries(services, 'stop', null, {
    timeout: SERVICES.EVENTS.TIMEOUTS.stop
  });

  for (let i = 0; i < infos.length; i += 1) {
    const info = infos[i];

    if (info instanceof Error) {
      hasError = true;
      LOGS.error(info);
    } else {
      LOGS.info(info);
    }
  }

  if (hasError) {
    throw new Error('ERROR');
  } else {
    return 'OK';
  }
};

serviceApp.on('stop', code => {
  if (!serviceApp.stopped) {
    serviceApp.stopped = true;

    serviceApp
      .exec('stop')
      .then(info => {
        LOGS.info(info);
        process.exit(code);
      })
      .catch(error => {
        LOGS.error(error);
        process.exit(1);
      });
  }
});

serviceApp.on('error', error => {
  LOGS.error(error);

  if (error.stopApp) {
    serviceApp.emit('stop', 1);
  }
});

serviceApp
  .exec('init')
  .then(info => LOGS.info(info))
  .catch(error => serviceApp.emit('error', error));

process.on('SIGINT', () => {
  serviceApp.emit('stop', 0);
});
