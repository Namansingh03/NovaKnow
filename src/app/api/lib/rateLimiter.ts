import {LRUCache} from "lru-cache"
import { NextApiRequest, NextApiResponse } from "next";

const rateLimitOptions = {
  max: 100, // Max 100 requests per minute
  ttl: 60 * 1000, // 1 minute
};

const rateLimiter = new LRUCache<string, number>(rateLimitOptions);

export default function apiLimiter(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";

    const requestCount = rateLimiter.get(ip as string) || 0;

    if (requestCount >= rateLimitOptions.max) {
      return res.status(429).json({ error: "Too many requests, please try again later." });
    }

    rateLimiter.set(ip as string, requestCount + 1);
    return handler(req, res);
  };
}
