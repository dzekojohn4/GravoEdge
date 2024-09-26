import redis.asyncio as aioredis

WALLET_ID_EXPIRATION = 60 * 60 * 24  # 24 hours


class RedisCache:
    _instance = None  # Singleton instance

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(RedisCache, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def __init__(self, redis_url: str = "redis://localhost:6379"):
        if not hasattr(self, 'redis_url'):  # Ensure initialization happens only once
            self.redis_url = redis_url
            self.redis = None

    async def connect(self):
        """
        Connect to the Redis server.
        """
        if self.redis is None:  # Only connect if not already connected
            self.redis = await aioredis.from_url(self.redis_url, decode_responses=True)

    async def close(self):
        """
        Close the Redis connection.
        """
        if self.redis:
            await self.redis.close()
            self.redis = None  # Reset the connection

    async def set(self, key: str, value: str, expiration: int = WALLET_ID_EXPIRATION):
        """
        Set a key-value pair in Redis with optional expiration time.
        """
        await self.redis.set(key, value, ex=expiration)

    async def get(self, key: str):
        """
        Get a value from Redis by key.
        """
        return await self.redis.get(key)

    async def delete(self, key: str):
        """
        Delete a key from Redis.
        """
        await self.redis.delete(key)


# Global singleton instance
redis_cache = RedisCache()
