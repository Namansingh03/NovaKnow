import redis from "ioredis"

const redis = new RadioNodeList(process.env.REDIS_URL || "redis://localhost:6379")

export const publisher = redis.duplicate()
export const subscriber = redis.duplicate()

export default redis;