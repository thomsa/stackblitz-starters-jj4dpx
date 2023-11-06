interface IRedisStore {
  [key: string]: string | Set<string> | string[];
}

interface IRedisExpire {
  [key: string]: NodeJS.Timeout;
}

class MockRedisClient {
  private store: IRedisStore;
  private expireTimers: IRedisExpire;
  private connected: boolean;

  constructor() {
    this.store = {};
    this.expireTimers = {};
    this.connected = true;
  }

  public on(event: string, callback: (err?: Error | null) => void): void {
    const self = this;
    if (event === 'connect') {
      setTimeout(() => {
        self.connected = true;
        callback(null);
      }, 100);
    }
  }

  public get(
    key: string,
    callback: (err: Error | null, reply: string | null) => void
  ): void {
    if (!this.connected) {
      callback(new Error('Redis connection not established!'), null);
      return;
    }
    const value = this.store[key] || null;
    callback(null, value as string);
  }

  public set(
    key: string,
    value: string,
    callback: (err: Error | null, reply: string) => void
  ): void {
    if (!this.connected) {
      callback(new Error('Redis connection not established!'), '');
      return;
    }
    this.store[key] = value;
    callback(null, 'OK');
  }

  public del(
    key: string,
    callback: (err: Error | null, reply: number) => void
  ): void {
    if (!this.connected) {
      callback(new Error('Redis connection not established!'), 0);
      return;
    }
    if (this.store[key]) {
      delete this.store[key];
      callback(null, 1);
    } else {
      callback(null, 0);
    }
  }

  public flushall(callback: (err: Error | null, reply: string) => void): void {
    if (!this.connected) {
      callback(new Error('Redis connection not established!'), '');
      return;
    }
    this.store = {};
    callback(null, 'OK');
  }

  public expire(
    key: string,
    seconds: number,
    callback: (err: Error | null, reply: number) => void
  ): void {
    if (!this.connected) {
      callback(new Error('Redis connection not established!'), 0);
      return;
    }
    if (this.store[key]) {
      this.expireTimers[key] = setTimeout(() => {
        this.del(key, () => {});
      }, seconds * 1000);
      callback(null, 1);
    } else {
      callback(null, 0);
    }
  }

  public exists(
    key: string,
    callback: (err: Error | null, reply: number) => void
  ): void {
    if (!this.connected) {
      callback(new Error('Redis connection not established!'), 0);
      return;
    }
    callback(null, this.store[key] ? 1 : 0);
  }

  public sadd(
    key: string,
    member: string,
    callback: (err: Error | null, reply: number) => void
  ): void {
    if (!this.store[key]) {
      this.store[key] = new Set<string>();
    }
    (this.store[key] as Set<string>).add(member);
    callback(null, 1);
  }

  public srem(
    key: string,
    member: string,
    callback: (err: Error | null, reply: number) => void
  ): void {
    if (this.store[key] && (this.store[key] as Set<string>).has(member)) {
      (this.store[key] as Set<string>).delete(member);
      callback(null, 1);
    } else {
      callback(null, 0);
    }
  }

  public smembers(
    key: string,
    callback: (err: Error | null, reply: string[]) => void
  ): void {
    callback(null, Array.from((this.store[key] as Set<string>) || []));
  }

  public lpush(
    key: string,
    value: string,
    callback: (err: Error | null, reply: number) => void
  ): void {
    if (!this.store[key]) {
      this.store[key] = [];
    }
    (this.store[key] as string[]).unshift(value);
    callback(null, (this.store[key] as string[]).length);
  }

  public rpush(
    key: string,
    value: string,
    callback: (err: Error | null, reply: number) => void
  ): void {
    if (!this.store[key]) {
      this.store[key] = [];
    }
    (this.store[key] as string[]).push(value);
    callback(null, (this.store[key] as string[]).length);
  }

  public lrange(
    key: string,
    start: number,
    stop: number,
    callback: (err: Error | null, reply: string[]) => void
  ): void {
    if (this.store[key]) {
      callback(null, (this.store[key] as string[]).slice(start, stop + 1));
    } else {
      callback(null, []);
    }
  }
}

export function createClient() {
  return new MockRedisClient();
}
