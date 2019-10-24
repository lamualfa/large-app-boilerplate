## INSTALATION
```bash
npm install
# or
yarn
```

## RUN
### PRODUCTION MODE (WITHOUT SUPERVISOR)
`yarn start`

### DEVELOPMENT MODE
`yarn dev`

### FEATURES

- Graceful shutdown
- Pretty logging
- Centralized logging system
- Centralized config (we changed from `process.env` to require config file)
- Integrate with Mongodb, Redis, Rabbitmq
- Support http, https, ws, wss
- Module aliases
- Service class to integrate another system

## LIBRARY USES

### DATABASE

- Mongodb : [mongodb](https://www.npmjs.com/package/mongodb)
- Redis : [redis](https://www.npmjs.com/package/redis)
- Rabbitmq: [amqplib](https://www.npmjs.com/package/amqplib)

### SERVER

- Http, Https : [fastify](https://www.npmjs.com/package/fastify)
- Ws, Wss : [ws](https://www.npmjs.com/package/ws)

### LOGGING

- [winston](https://www.npmjs.com/package/winston)

### SCREENSHOT