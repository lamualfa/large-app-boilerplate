const path = require('path');

const fs_extra = require('fs-extra');

const ENV = process.env;

const KEYS = fs_extra.readJSONSync(path.resolve(__dirname, './keys.json'));

module.exports = {
  ...ENV,
  LOGS: {
    DIR: path.resolve(ENV.LOGS_DIR),
    LEVELS: {
      error: 0,
      info: 1,
      debug: 2
    },
    COLORS: {
      error: 'red',
      info: 'blue',
      debug: 'gray'
    }
  },
  SERVERS: {
    HTTP: {
      HOST: '0.0.0.0',
      PORT: 3000,
      OPTIONS: {}
    },
    HTTPS: {
      HOST: '0.0.0.0',
      PORT: 3001,
      SSL: {
        KEY: {
          PATH: './Resources/SSL/sample.key'
        },
        CERT: {
          PATH: './Resources/SSL/sample.cert'
        }
      },
      OPTIONS: {}
    },
    WS: {
      HOST: '0.0.0.0',
      PORT: 3002,
      OPTIONS: {}
    },
    WSS: {
      HOST: '0.0.0.0',
      PORT: 3003,
      SSL: {
        KEY: {
          PATH: './Resources/SSL/sample.key'
        },
        CERT: {
          PATH: './Resources/SSL/sample.cert'
        }
      },
      OPTIONS: {}
    }
  },
  DBS: {
    MONGODB: {
      HOST: '0.0.0.0',
      PORT: 27017,
      USER: 'root',
      PASSWORD: '',
      NAME: 'large-app-project-boilerplate',
      OPTIONS: {
        authSource: 'admin',
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    },
    REDIS: {
      HOST: '0.0.0.0',
      PORT: 6379,
      PASSWORD: '',
      OPTIONS: {}
    },
    RABBITMQ: {
      HOST: '0.0.0.0',
      PORT: 5672,
      USER: '',
      PASSWORD: '',
      OPTIONS: {}
    }
  },
  KEYS,
  SERVICES: {
    EVENTS: {
      TIMEOUTS: {
        init: 5000,
        kill: 5000
      }
    }
  }
};
