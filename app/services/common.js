//common.js
const Events = require('events');
const eventEmitter = new Events.EventEmitter();
module.exports.commonEmitter = eventEmitter;