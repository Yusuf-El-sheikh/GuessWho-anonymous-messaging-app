import Redis from "ioredis";

export class RedisCacheProvider {
  client;

  constructor(config) {
    this.client = new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
      lazyConnect: true,
      maxLoadingRetryTime: 3,
    });
    this.client.on("error", (error) => {
      console.log("Redis error: ", error.message);
      return;
    });
    this.client.connect().catch((error) => {
      console.log("System failure: failed to connect to cache", error.message);
      return;
    });
  }

  async get(key) {
    return await this.client.get(key);
  }

  async set(key, value, ttl) {
    return await this.client.set(key, value, "EX", ttl);
  }

  async del(key) {
    return await this.client.del(key);
  }
}
