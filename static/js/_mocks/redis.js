"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = void 0;
class MockRedisClient {
    constructor() {
        this.store = {};
        this.expireTimers = {};
        this.connected = true;
    }
    on(event, callback) {
        const self = this;
        if (event === 'connect') {
            setTimeout(() => {
                self.connected = true;
                callback(null);
            }, 100);
        }
    }
    get(key, callback) {
        if (!this.connected) {
            callback(new Error('Redis connection not established!'), null);
            return;
        }
        const value = this.store[key] || null;
        callback(null, value);
    }
    set(key, value, callback) {
        if (!this.connected) {
            callback(new Error('Redis connection not established!'), '');
            return;
        }
        this.store[key] = value;
        callback(null, 'OK');
    }
    del(key, callback) {
        if (!this.connected) {
            callback(new Error('Redis connection not established!'), 0);
            return;
        }
        if (this.store[key]) {
            delete this.store[key];
            callback(null, 1);
        }
        else {
            callback(null, 0);
        }
    }
    flushall(callback) {
        if (!this.connected) {
            callback(new Error('Redis connection not established!'), '');
            return;
        }
        this.store = {};
        callback(null, 'OK');
    }
    expire(key, seconds, callback) {
        if (!this.connected) {
            callback(new Error('Redis connection not established!'), 0);
            return;
        }
        if (this.store[key]) {
            this.expireTimers[key] = setTimeout(() => {
                this.del(key, () => { });
            }, seconds * 1000);
            callback(null, 1);
        }
        else {
            callback(null, 0);
        }
    }
    exists(key, callback) {
        if (!this.connected) {
            callback(new Error('Redis connection not established!'), 0);
            return;
        }
        callback(null, this.store[key] ? 1 : 0);
    }
    sadd(key, member, callback) {
        if (!this.store[key]) {
            this.store[key] = new Set();
        }
        this.store[key].add(member);
        callback(null, 1);
    }
    srem(key, member, callback) {
        if (this.store[key] && this.store[key].has(member)) {
            this.store[key].delete(member);
            callback(null, 1);
        }
        else {
            callback(null, 0);
        }
    }
    smembers(key, callback) {
        callback(null, Array.from(this.store[key] || []));
    }
    lpush(key, value, callback) {
        if (!this.store[key]) {
            this.store[key] = [];
        }
        this.store[key].unshift(value);
        callback(null, this.store[key].length);
    }
    rpush(key, value, callback) {
        if (!this.store[key]) {
            this.store[key] = [];
        }
        this.store[key].push(value);
        callback(null, this.store[key].length);
    }
    lrange(key, start, stop, callback) {
        if (this.store[key]) {
            callback(null, this.store[key].slice(start, stop + 1));
        }
        else {
            callback(null, []);
        }
    }
}
function createClient() {
    return new MockRedisClient();
}
exports.createClient = createClient;
