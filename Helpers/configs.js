require('dotenv').config();

const path = require('path');

const ENV = process.env;

const { NODE_ENV } = ENV;
let { CONFIGS_DIR } = ENV;

CONFIGS_DIR = path.resolve(CONFIGS_DIR);

const CONFIGS_PATH = path.join(CONFIGS_DIR, NODE_ENV, '/index.js');

// eslint-disable-next-line import/no-dynamic-require
module.exports = require(CONFIGS_PATH);
