"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pubsub = exports.publish = exports.unsubscribe = exports.subscribe = void 0;
var __1 = require("../");
var subscriptions = {};
var masterSubscriptions = {};
/*
 * SUBSCRIBE
 * Subscribe to one channel, with the provided callback
 */
function subscribe(topic, callback) {
    if (!(0, __1.isMasterNode)()) {
        if (!subscriptions[topic]) {
            subscriptions[topic] = [];
        }
        subscriptions[topic].push(callback);
        __1.store.dispatch("subscribe", undefined, topic, (0, __1.getProcessId)());
    }
    else {
        if (!masterSubscriptions[topic]) {
            masterSubscriptions[topic] = [];
        }
        // "callback" is actually the process id here.
        masterSubscriptions[topic].push(callback);
    }
}
exports.subscribe = subscribe;
/*
 * UNSUBSCRIBE
 * Unsubscribe from one channel. Callback is optional.
 */
function unsubscribe(topic, callback) {
    if (!(0, __1.isMasterNode)()) {
        var hasCallback = (callback !== undefined);
        if (subscriptions[topic]) {
            if (hasCallback) {
                var index = subscriptions[topic].indexOf(callback);
                if (index !== -1) {
                    subscriptions[topic].splice(index, 1);
                }
            }
            else {
                delete subscriptions[topic];
            }
        }
        __1.store.dispatch("unsubscribe", undefined, topic, hasCallback, (0, __1.getProcessId)());
    }
    else {
        var hasCallback = callback;
        var processId = arguments[2];
        if (hasCallback) {
            var index = masterSubscriptions[topic].indexOf(processId);
            if (index !== -1) {
                masterSubscriptions[topic].splice(index, 1);
            }
        }
        else {
            delete masterSubscriptions[topic];
        }
    }
}
exports.unsubscribe = unsubscribe;
/*
 * PUBLISH channel message
 * Publish a message to an specific channel
 */
function publish(topic, message, isDispatching) {
    if (isDispatching === void 0) { isDispatching = true; }
    if (!(0, __1.isMasterNode)()) {
        if (isDispatching) {
            __1.store.dispatch("publish", undefined, topic, message);
        }
        else {
            subscriptions[topic].forEach(function (c) { return c(message); });
        }
    }
    else {
        if (masterSubscriptions[topic]) {
            masterSubscriptions[topic].forEach(function (processId) {
                var data = {
                    cmd: "publish",
                    args: [topic, message, false],
                    pubsub: true
                };
                if (__1.pm2) {
                    __1.pm2.sendDataToProcessId({
                        type: 'memshared',
                        data: data,
                        id: processId,
                        topic: 'memshared'
                    }, function (err, res) {
                        if (err)
                            return console.error("memshared: couldn't send message to worker.");
                    });
                }
                else {
                    (0, __1.getProcessById)(processId).send(data);
                }
            });
        }
    }
}
exports.publish = publish;
/*
 * PUBSUB channel
 * List the processes subscribing to this topic.
 */
function pubsub(topic, callback) {
    if (!(0, __1.isMasterNode)()) {
        __1.store.dispatch("pubsub", callback, topic);
    }
    else {
        return masterSubscriptions[topic];
    }
}
exports.pubsub = pubsub;
