const fastify = require('fastify');
const fs_extra = require('fs-extra');
const path = require('path');

const { Service } = require('Class/service');
const { SERVERS } = require('Helpers/configs');

const { HOST, PORT, SSL, OPTIONS } = SERVERS.HTTPS;

const URI = `https://${HOST}:${PORT}`;

const service = new Service(['SERVER', 'HTTPS']);
const server = fastify({
  https: {
    key: fs_extra.readFileSync(path.resolve(SSL.KEY.PATH)),
    cert: fs_extra.readFileSync(path.resolve(SSL.CERT.PATH))
  },
  ...OPTIONS
});

service.init = () => {
  return new Promise((resolve, reject) => {
    try {
      server.listen(PORT, HOST, error => {
        if (error) {
          reject(error);
        } else {
          resolve(`LISTENING ON ${URI}`);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

service.stop = async () => {
  await server.close();

  return 'OK';
};

module.exports.service = service;
