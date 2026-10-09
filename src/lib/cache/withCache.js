import { cacheProvider } from "../cache/init.js";

export function withCache(ttl = 3600) {
  return async (req, res, next) => {
    let key = `${req.method}:${req.originalUrl}`;
    const cached = await cacheProvider.get(key);
    if (cached) {
      res.setHeader("X-Cache", "Hit");
      return res.json(JSON.parse(cached));
    }

    const originalJson = res.json.bind(res);

    //interceptor
    res.json = async (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        //cache first
        await cacheProvider.set(key, JSON.stringify(body), ttl);

        //send response
        res.setHeader("X-Cache", "Miss");
        return originalJson(body);
      }
    };
    next();
  };
}
