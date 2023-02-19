"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
var _1 = require("./");
;
var messageId = 0;
var Store = /** @class */ (function () {
    function Store() {
        this.$callbacks = {};
    }
    Store.prototype.dispatch = function (cmd, callback) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var msg = this.buildMessage.apply(this, __spreadArray([cmd], args, false));
        // callback when the worker receives back the final result
        if (callback) {
            this.$callbacks[msg.messageId] = callback;
        }
        if (process.env.pm_id === undefined) {
            // send command to be executed by the master node
            process.send(msg);
        }
        else {
            // PM2: send command to PM2's launchBus
            // (http://pm2.keymetrics.io/docs/usage/pm2-api/#send-message-to-process)
            process.send({
                type: "memshared",
                topic: "memshared",
                data: msg,
            });
        }
    };
    Store.prototype.consume = function (message) {
        if (this.$callbacks[message.messageId]) {
            // dispatch callback
            this.$callbacks[message.messageId](message.error, message.result);
            // cleanup
            delete this.$callbacks[message.messageId];
        }
    };
    Store.prototype.buildMessage = function (command) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return {
            messageId: "".concat((0, _1.getProcessId)(), ":").concat(messageId++),
            cmd: command,
            args: args
        };
    };
    return Store;
}());
exports.Store = Store;
