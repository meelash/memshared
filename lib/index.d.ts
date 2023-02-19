/// <reference types="node" />
import { Store, Message } from "./Store";
import { ChildProcess } from "child_process";
export { Store };
export declare const store: Store;
export declare function isMasterNode(): boolean;
export declare function getProcessId(): string | number;
export declare function getProcessById(processId: number): ChildProcess;
export declare function registerProcess(childProcess: ChildProcess): void;
export declare function processMasterMessage(message: Message): boolean;
export declare let pm2: any;
export declare function setupPM2LaunchBus(mod: any): void;
export declare function setup(data: any): void;
export * from "./commands";
