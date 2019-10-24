const Ws = require('ws');

const { Service } = require('Class/service');
const { SERVERS } = require('Helpers/configs');

const { HOST, PORT, OPTIONS } = SERVERS.WS;

const URI = `ws://${HOST}:${PORT}`;

const service = new Service(['SERVER', 'WS']);
let server;
let socket;

service.init = () => {
  return new Promise((resolve, reject) => {
    try {
      server = new Ws.Server({
        host: HOST,
        port: PORT,
        ...OPTIONS
      });

      server.on('connection', ws => {
        socket = ws;

        module.exports.socket = socket;
      });

      server.on('listening', () => {
        resolve(`LISTENING ON ${URI}`);
      });

      server.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

service.stop = async () => {
  return new Promise((resolve, reject) => {
    try {
      if (server) {
        server.close(error => {
          if (error) {
            reject(error);
          } else {
            resolve('OK');
          }
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
