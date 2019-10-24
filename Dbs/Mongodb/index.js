const { MongoClient } = require('mongodb');

const { DBS } = require('Helpers/configs');
const { Service } = require('Class/service');

const { HOST, PORT, USER, PASSWORD, NAME, OPTIONS } = DBS.MONGODB;
const URI = `mongodb://${HOST}:${PORT}/${NAME}`;

if (USER && PASSWORD) {
  OPTIONS.auth = {
    user: USER,
    password: PASSWORD
  };
}

const service = new Service(['DB', 'MONGODB']);

let client;

service.init = async () => {
  client = new MongoClient(URI, OPTIONS);

  await client.connect();

  client.on('error', error => {
    service.emit('error', error);
  });

  module.exports.client = client;

  return `CONNECTED TO ${URI}`;
};

service.stop = async () => {
  if (client) {
    await client.close();

    return 'OK';
  }

  throw new Error('NOT CONNECTED');
};

module.exports.service = service;
