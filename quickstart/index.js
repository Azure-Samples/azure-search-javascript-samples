#!/usr/bin/env/node

const nconf = require('nconf')
const config = nconf.file({ file: "config.json" });

console.log(config.get("serviceName"));

const run = async() => {
    console.log("Hello, Node from CLI");

}

run();