const https = require('https');
const fs_extra = require('fs-extra');
const path = require('path');
const Ws = require('ws');

const { Service } = require('Class/service');
const { SERVERS } = require('Helpers/configs');

const { HOST, PORT, SSL, OPTIONS } = SERVERS.WSS;

const URI = `wss://${HOST}:${PORT}`;

const service = new Service(['SERVER', 'WSS']);
const httpsServer = https.createServer({
  key: fs_extra.readFileSync(path.resolve(SSL.KEY.PATH)),
  cert: fs_extra.readFileSync(path.resolve(SSL.CERT.PATH)),
  ...OPTIONS
});
let server;
let socket;

service.init = () => {
  return new Promise((resolve, reject) => {
    try {
      server = new Ws.Server({
        host: HOST,
        port: PORT,
        server: httpsServer,
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
