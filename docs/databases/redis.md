# Redis

Open-source, in-memory data structure store.

## Connecting to Redis

| COMMAND | DESCRIPTION |
| --- | --- |
| `redis-cli` | Connect to local Redis |
| `redis-cli -h host -p port` | Connect to remote Redis |
| `redis-cli -a password` | Connect with password |
| `redis-cli -u redis://user:password@host:port` | Connect with URL |
| `exit` or `quit` | Exit Redis CLI |

## Key Operations

| COMMAND | DESCRIPTION |
| --- | --- |
| `SET key value` | Set key-value pair |
| `GET key` | Get value by key |
| `DEL key` | Delete key |
| `EXISTS key` | Check if key exists |
| `EXPIRE key seconds` | Set expiration time |
| `TTL key` | Get time to live |
| `EXPIREAT key timestamp` | Set expiration at timestamp |
| `PERSIST key` | Remove expiration |
| `RENAME oldkey newkey` | Rename key |
| `TYPE key` | Get data type of key |
| `KEYS pattern` | Find keys by pattern |
| `SCAN cursor MATCH pattern COUNT count` | Iterate keys |

## Strings

| COMMAND | DESCRIPTION |
| --- | --- |
| `SET key value` | Set string value |
| `GET key` | Get string value |
| `GETSET key value` | Get and set value |
| `MGET key1 key2 ...` | Get multiple values |
| `MSET key1 val1 key2 val2` | Set multiple values |
| `INCR key` | Increment by 1 |
| `INCRBY key amount` | Increment by amount |
| `DECR key` | Decrement by 1 |
| `DECRBY key amount` | Decrement by amount |
| `APPEND key value` | Append to string |
| `STRLEN key` | Get string length |
| `SETRANGE key offset value` | Set substring |
| `GETRANGE key start end` | Get substring |

## Hashes

| COMMAND | DESCRIPTION |
| --- | --- |
| `HSET key field value` | Set hash field |
| `HGET key field` | Get hash field |
| `HMSET key f1 v1 f2 v2` | Set multiple fields |
| `HMGET key f1 f2` | Get multiple fields |
| `HGETALL key` | Get all fields and values |
| `HDEL key field` | Delete field |
| `HEXISTS key field` | Check if field exists |
| `HKEYS key` | Get all fields |
| `HVALS key` | Get all values |
| `HLEN key` | Get number of fields |
| `HINCRBY key field amount` | Increment field by amount |

## Lists

| COMMAND | DESCRIPTION |
| --- | --- |
| `LPUSH key value1 value2` | Push to left |
| `RPUSH key value1 value2` | Push to right |
| `LPOP key` | Pop from left |
| `RPOP key` | Pop from right |
| `LRANGE key start stop` | Get range |
| `LLEN key` | Get list length |
| `LINDEX key index` | Get by index |
| `LSET key index value` | Set by index |
| `LINSERT key BEFORE|AFTER pivot value` | Insert before/after |
| `LREM key count value` | Remove elements |
| `LTRIM key start stop` | Trim list |

## Sets

| COMMAND | DESCRIPTION |
| --- | --- |
| `SADD key member1 member2` | Add members |
| `SREM key member` | Remove member |
| `SMEMBERS key` | Get all members |
| `SISMEMBER key member` | Check if member exists |
| `SCARD key` | Get set size |
| `SPOP key` | Get and remove random member |
| `SRANDMEMBER key count` | Get random members |
| `SINTER key1 key2` | Intersection |
| `SUNION key1 key2` | Union |
| `SDIFF key1 key2` | Difference |
| `SMOVE source destination member` | Move member |

## Sorted Sets

| COMMAND | DESCRIPTION |
| --- | --- |
| `ZADD key score1 member1 score2 member2` | Add members with scores |
| `ZREM key member` | Remove member |
| `ZSCORE key member` | Get score |
| `ZRANGE key start stop` | Get range by rank |
| `ZRANGE key start stop WITHSCORES` | Get range with scores |
| `ZREVRANGE key start stop` | Get range reversed |
| `ZRANK key member` | Get rank |
| `ZREVRANK key member` | Get reverse rank |
| `ZCOUNT key min max` | Count members in score range |
| `ZRANGEBYSCORE key min max` | Get by score range |
| `ZINCRBY key increment member` | Increment score |
| `ZCARD key` | Get number of members |
| `ZREM key member` | Remove member |

## Bitmaps

| COMMAND | DESCRIPTION |
| --- | --- |
| `SETBIT key offset value` | Set bit at offset |
| `GETBIT key offset` | Get bit at offset |
| `BITCOUNT key` | Count set bits |
| `BITOP AND dest key1 key2` | Bitwise operations |
| `BITPOS key bit` | Find first bit |

## HyperLogLog

| COMMAND | DESCRIPTION |
| --- | --- |
| `PFADD key element1 element2` | Add elements |
| `PFCOUNT key` | Count unique elements |
| `PFMERGE dest key1 key2` | Merge HyperLogLogs |

## Transactions

```bash
# Start transaction
MULTI

# Queue commands
SET key1 value1
SET key2 value2

# Execute transaction
EXEC

# Discard transaction
DISCARD
```

## Pub/Sub

### Publishing
```bash
# Publish message
PUBLISH channel "message"
```

### Subscribing
```bash
# Subscribe to channel
SUBSCRIBE channel1 channel2

# Unsubscribe
UNSUBSCRIBE channel

# Pattern subscribe
PSUBSCRIBE news.*
```

## Server Operations

| COMMAND | DESCRIPTION |
| --- | --- |
| `DBSIZE` | Get number of keys in database |
| `FLUSHDB` | Delete all keys in current database |
| `FLUSHALL` | Delete all keys in all databases |
| `SAVE` | Save to disk |
| `BGSAVE` | Save to disk in background |
| `LASTSAVE` | Get last save timestamp |
| `SHUTDOWN` | Shutdown server |
| `INFO` | Get server info |
| `CLIENT LIST` | List connected clients |
| `CLIENT KILL ip:port` | Kill client connection |

## Configuration

| COMMAND | DESCRIPTION |
| --- | --- |
| `CONFIG GET parameter` | Get configuration |
| `CONFIG SET parameter value` | Set configuration |
| `CONFIG RESETSTAT` | Reset statistics |
| `CONFIG REWRITE` | Rewrite config file |

## Useful Queries

### Get all keys
```bash
KEYS *
```

### Get keys by pattern
```bash
KEYS user:*
```

### Get Redis info
```bash
INFO

INFO memory
INFO replication
INFO stats
```

### Monitor commands
```bash
MONITOR
```

### Scan large datasets
```bash
SCAN 0 MATCH user:* COUNT 100
```

### Get memory usage
```bash
MEMORY USAGE key
```

## Persistence

### RDB (Snapshot)
```bash
# Enable RDB
CONFIG SET save "900 1 300 10 60 10000"

# Force save
SAVE
BGSAVE
```

### AOF (Append Only File)
```bash
# Enable AOF
CONFIG SET appendonly yes

# Rewrite AOF
BGREWRITEAOF
```

## Cluster

| COMMAND | DESCRIPTION |
| --- | --- |
| `CLUSTER NODES` | List cluster nodes |
| `CLUSTER INFO` | Get cluster info |
| `CLUSTER MEET ip port` | Meet a node |
| `CLUSTER ADDSLOTS slot1 slot2` | Add slots to node |
| `CLUSTER REPLICATE node_id` | Replicate node |
| `CLUSTER FAILOVER` | Manual failover |

## Lua Scripting

```bash
# Execute Lua script
EVAL "return redis.call('SET', KEYS[1], ARGV[1])" 1 key value

# Load and execute script
SCRIPT LOAD "return redis.call('GET', KEYS[1])"
EVALSHA <sha> 1 key
```

## Best Practices

- Use appropriate data types for your use case
- Set expiration times to prevent memory bloat
- Use pipelining for multiple commands
- Use transactions for atomic operations
- Monitor memory usage with `INFO memory`
- Use connection pooling in applications
- Regularly backup Redis data
- Use Redis Cluster for high availability
- Use appropriate eviction policies
- Monitor slow queries with `SLOWLOG`
- Use Redis Sentinel for automatic failover
- Compress large values stored in Redis

::: tip
Use `SCAN` instead of `KEYS` for large datasets to avoid blocking the server.
:::
