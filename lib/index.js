"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = exports.setupPM2LaunchBus = exports.pm2 = exports.processMasterMessage = exports.registerProcess = exports.getProcessById = exports.getProcessId = exports.isMasterNode = exports.store = exports.Store = void 0;
var cluster = require("cluster");
var commands = require("./commands");
var Store_1 = require("./Store");
Object.defineProperty(exports, "Store", { enumerable: true, get: function () { return Store_1.Store; } });
exports.store = new Store_1.Store();
var processesById = {};
function masterHandleIncomingMessage(processId, message) {
    if (!processMasterMessage(message)) {
        return;
    }
    // send result back to worker
    processesById[processId].send(message);
}
function workerHandleIncomingMessage(message) {
    if (message.topic === "memshared") {
        message = message.data;
    }
    if (!message || !commands[message.cmd]) {
        return;
    }
    if (message.messageId) {
        exports.store.consume(message);
    }
    else if (message.pubsub) {
        commands[message.cmd].apply(undefined, message.args);
    }
}
if (isMasterNode()) {
    // Setup existing workers
    Object.keys(cluster.workers).forEach(function (workerId) {
        registerProcess(cluster.workers[workerId].process);
    });
    // Listen for new workers to setup
    cluster.on("fork", function (worker) { return registerProcess(worker.process); });
    // Be notified when worker processes die.
    cluster.on('exit', function (worker, code, signal) {
        delete processesById[worker.process.pid];
    });
}
else {
    process.on("message", workerHandleIncomingMessage);
}
function isMasterNode() {
    return (cluster.isMaster);
}
exports.isMasterNode = isMasterNode;
function getProcessId() {
    return process.env.pm_id || process.pid;
}
exports.getProcessId = getProcessId;
function getProcessById(processId) {
    return processesById[processId];
}
exports.getProcessById = getProcessById;
function registerProcess(childProcess) {
    processesById[childProcess.pid] = childProcess;
    childProcess.on("message", function (message) { return masterHandleIncomingMessage(childProcess.pid, message); });
}
exports.registerProcess = registerProcess;
function processMasterMessage(message) {
    if (!message || !commands[message.cmd]) {
        return false;
    }
    // run command on master process
    try {
        message.result = commands[message.cmd].apply(undefined, message.args);
    }
    catch (e) {
        message.error = e.message;
    }
    // delete irrelevant data to send back to the worker
    delete message['args'];
    return true;
}
exports.processMasterMessage = processMasterMessage;
function setupPM2LaunchBus(mod) {
    exports.pm2 = mod;
    exports.pm2.launchBus(function (err, bus) {
        bus.on('memshared', function (packet) {
            var message = packet.data;
            var processId = packet.process.pm_id;
            if (!processMasterMessage(message)) {
                return;
            }
            exports.pm2.sendDataToProcessId({
                type: 'memshared',
                data: message,
                id: processId,
                topic: 'memshared'
            }, function (err, res) {
                if (err)
                    console.error("memshared: couldn't send message to worker.");
            });
        });
    });
}
exports.setupPM2LaunchBus = setupPM2LaunchBus;
function setup(data) {
    Object.assign(exports.store, data);
}
exports.setup = setup;
//
// Export commands
//
__exportStar(require("./commands"), exports);
