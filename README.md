## INSTALATION
```bash
npm install
# or
yarn
```

## RUN
```bash
# PRODUCTION MODE (WITHOUT SUPERVISOR)
yarn start

# DEVELOPMENT MODE
yarn dev`
```

## FEATURES

- Graceful shutdown
- Centralized logging system
- Pretty logging
- Pretty error
- Centralized config (we changed from `process.env` to require config file)
- Integrate with Mongodb, Redis, Rabbitmq
- Support Http, Https, Ws, Wss
- Support using SSL Certificate
- Module aliases
- Service namespace
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

## SCREENSHOT

<img src="https://i.ibb.co/tC9MNRT/Screenshot-from-2019-10-24-17-19-10.png" alt="Screenshot-from-2019-10-24-17-19-10" border="0">
