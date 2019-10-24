const fastify = require('fastify');

const { Service } = require('Class/service');
const { SERVERS } = require('Helpers/configs');

const { HOST, PORT, OPTIONS } = SERVERS.HTTP;

const URI = `http://${HOST}:${PORT}`;

const service = new Service(['SERVER', 'HTTP']);
const server = fastify(OPTIONS);

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
