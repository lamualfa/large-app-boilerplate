const amqplib = require('amqplib');

const { Service } = require('Class/service');
const { RABBITMQ } = require('Helpers/configs').DBS;

let { OPTIONS } = RABBITMQ;
const { HOST, PORT, USER, PASSWORD } = RABBITMQ;

OPTIONS = {
  ...OPTIONS,
  hostname: HOST,
  port: PORT
};

if (USER && PASSWORD) {
  OPTIONS.username = USER;
  OPTIONS.password = PASSWORD;
}

const URI = `amqp://${HOST}:${PORT}`;

const service = new Service(['DB', 'RABBITMQ']);

let client;

service.init = async () => {
  client = await amqplib.connect(OPTIONS);

  client.connected = true;
  client.on('error', error => {
    service.emit('error', error);
  });

  module.exports.client = client;

  return `CONNECTED TO ${URI}`;
};

service.stop = async () => {
  if (client && client.connected) {
    client.close();

    client.connected = false;

    return 'OK';
  }

  throw new Error('NOT CONNECTED');
};

module.exports.service = service;
