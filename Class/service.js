/* eslint-disable consistent-return */
const { EventEmitter } = require('events');
const util = require('util');

class Service extends EventEmitter {
  constructor(namespace) {
    super();

    if (Array.isArray(namespace)) {
      this.namespace = namespace.join('/');
    } else {
      this.namespace = namespace.toString();
    }

    return this;
  }

  async exec(event, options, ...args) {
    try {
      if (typeof this[event] === 'function') {
        const result = await new Promise((resolve, reject) => {
          try {
            let eventTimeout;

            if (options && options.timeout) {
              eventTimeout = setTimeout(
                reject.bind(null, 'TIMEOUT'),
                options.timeout
              );
            }

            const clearEventTimeout = () => {
              if (eventTimeout) clearTimeout(eventTimeout);
            };

            const eventResult = this[event](...args);

            if (util.types.isPromise(eventResult)) {
              eventResult
                .then(parseEventResult => {
                  clearEventTimeout();

                  resolve(parseEventResult);
                })
                .catch(error => {
                  clearEventTimeout();
                  reject(error);
                });
            } else {
              clearEventTimeout();
              resolve(eventResult);
            }
          } catch (error) {
            reject(error);
          }
        });

        const info = {
          namespace: this.namespace,
          event
        };

        if (result && typeof result === 'object') {
          Object.assign(info, result);
        } else {
          info.message = result;
        }

        return info;
      }

      throw new Error(`Cannot find listener for event ${event}`);
    } catch (error) {
      let parseError;

      if (typeof error !== 'object') {
        parseError = {
          message: error
        };
      } else {
        parseError = error;
      }

      parseError.namespace = this.namespace;
      parseError.event = event;

      throw error;
    }
  }

  static async execAllSeries(services, event, options, ...args) {
    const result = [];

    for (let i = 0; i < services.length; i += 1) {
      const service = services[i];

      try {
        const info = await service.exec(event, ...args);

        result.push(info);
      } catch (error) {
        result.push(error);

        if (options && options.stopOnError) {
          return result;
        }
      }
    }

    return result;
  }
}

module.exports = {
  Service
};
