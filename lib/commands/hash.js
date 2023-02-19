"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hscan = exports.hvals = exports.hstrlen = exports.hsetnx = exports.hset = exports.hmset = exports.hmget = exports.hlen = exports.hkeys = exports.hincrbyfloat = exports.hincrby = exports.hgetall = exports.hget = exports.hexists = exports.hdel = void 0;
var __1 = require("../");
/*
 * HDEL key field [field ...]
 * Delete one or more hash fields
 */
function hdel(key, field, callback) {
    if (!(0, __1.isMasterNode)()) {
        __1.store.dispatch("hdel", callback, key, field);
    }
    else {
        if (typeof (__1.store[key]) !== "object") {
            throw new Error("'".concat(key, "' expected to be type of hash."));
        }
        delete __1.store[key][field];
        return "OK";
    }
}
exports.hdel = hdel;
/*
 * HEXISTS key field
 * Determine if a hash field exists
 */
function hexists(key, field, callback) {
    if (!(0, __1.isMasterNode)()) {
        __1.store.dispatch("hexists", callback, key, field);
    }
    else {
        return (__1.store[key] && __1.store[key][field] !== undefined);
    }
}
exports.hexists = hexists;
/*
 * HGET key field
 * Get the value of a hash field
 */
function hget(key, field, callback) {
    if (!(0, __1.isMasterNode)()) {
        __1.store.dispatch("hget", callback, key, field);
    }
    else {
        return (__1.store[key] && __1.store[key][field]);
    }
}
exports.hget = hget;
/*
 * HGETALL key
 * Get all the fields and values in a hash
 */
function hgetall(key, callback) {
    if (!(0, __1.isMasterNode)()) {
        __1.store.dispatch("hgetall", callback, key);
    }
    else {
        var result = [];
        var target = __1.store[key] || {};
        for (var k in target) {
            result.push(k);
            result.push(__1.store[key][k]);
        }
        return result;
    }
}
exports.hgetall = hgetall;
/*
 * HINCRBY key field increment
 * Increment the integer value of a hash field by the given number
 */
function hincrby(key, field, increment, callback) {
    if (!(0, __1.isMasterNode)()) {
        __1.store.dispatch("hincrby", callback, key, field, increment);
    }
    else {
        if (!__1.store[key]) {
            __1.store[key] = {};
        }
        if (!__1.store[key][field]) {
            __1.store[key][field] = increment;
        }
        else {
            __1.store[key][field] += increment;
        }
        return __1.store[key][field];
    }
}
exports.hincrby = hincrby;
/*
 * HINCRBYFLOAT key field increment
 * Increment the float value of a hash field by the given amount
 */
function hincrbyfloat() {
}
exports.hincrbyfloat = hincrbyfloat;
/*
 * HKEYS key
 * Get all the fields in a hash
 */
function hkeys(key, callback) {
    if (!(0, __1.isMasterNode)()) {
        __1.store.dispatch("hkeys", callback, key);
    }
    else {
        return (__1.store[key] !== undefined)
            ? Object.keys(__1.store[key])
            : [];
    }
}
exports.hkeys = hkeys;
/*
 * HLEN key
 * Get the number of fields in a hash
 */
function hlen(key, callback) {
    if (!(0, __1.isMasterNode)()) {
        __1.store.dispatch("hlen", callback, key);
    }
    else {
        return (__1.store[key] !== undefined)
            ? Object.keys(__1.store[key]).length
            : 0;
    }
}
exports.hlen = hlen;
/*
 * HMGET key field [field ...]
 * Get the values of all the given hash fields
 */
function hmget() {
}
exports.hmget = hmget;
/*
 * HMSET key field value [field value ...]
 * Set multiple hash fields to multiple values
 */
function hmset() {
}
exports.hmset = hmset;
/*
 * HSET key field value
 * Set the string value of a hash field
 */
function hset(key, field, value, callback) {
    if (!(0, __1.isMasterNode)()) {
        __1.store.dispatch("hset", callback, key, field, value);
    }
    else {
        if (!__1.store[key]) {
            __1.store[key] = {};
        }
        __1.store[key][field] = value;
        return true;
    }
}
exports.hset = hset;
/*
 * HSETNX key field value
 * Set the value of a hash field, only if the field does not exist
 */
function hsetnx() {
}
exports.hsetnx = hsetnx;
/*
 * HSTRLEN key field
 * Get the length of the value of a hash field
 */
function hstrlen() {
}
exports.hstrlen = hstrlen;
/*
 * HVALS key
 * Get all the values in a hash
 */
function hvals(key, callback) {
    if (!(0, __1.isMasterNode)()) {
        __1.store.dispatch("hvals", callback, key);
    }
    else {
        var result = [];
        var target = __1.store[key] || {};
        for (var k in target) {
            result.push(target[k]);
        }
        return result;
    }
}
exports.hvals = hvals;
/*
 * HSCAN key cursor [MATCH pattern] [COUNT count]
 * Incrementally iterate hash fields and associated values
 */
function hscan() {
}
exports.hscan = hscan;
