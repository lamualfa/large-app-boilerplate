const bluebird = require('bluebird');
const redis = require('redis');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const { DBS } = require('Helpers/configs');
const { Service } = require('Class/service');

const { REDIS } = DBS;
const { HOST, PORT, PASSWORD } = REDIS;
const URI = `redis://${HOST}:${PORT}`;
const OPTIONS = {
  ...REDIS.OPTIONS
};

if (PASSWORD) {
  OPTIONS.auth_pass = PASSWORD;
}

const service = new Service(['DB', 'REDIS']);

let client;

service.init = () => {
  return new Promise((resolve, reject) => {
    try {
      client = redis.createClient(URI, OPTIONS);

      client.on('ready', () => {
        module.exports.client = client;

        client.on('error', error => {
          service.emit('error', error);
        });

        resolve(`CONNECTED TO ${URI}`);
      });

      client.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

service.stop = () => {
  return new Promise((resolve, reject) => {
    try {
      if (client) {
        client.quit(() => {
          resolve('OK');
        });
      } else {
        reject(new Error('NOT CONNECTED'));
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.service = service;
