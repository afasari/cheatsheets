# Redis Patterns Cheatsheet

## String Patterns

```bash
# Cache with TTL
SETEX cache:key 3600 "value"  # Set with 1 hour TTL
TTL cache:key                    # Check TTL
EXPIRE cache:key 1800           # Update TTL

# Counter with expiration
INCR page_views:12345
EXPIRE page_views:12345 86400

# Rate limiting (sliding window)
INCR rate_limit:user:123
EXPIRE rate_limit:user:123 60

# Distributed lock
SET lock:resource "owner" NX EX 30  # Set if not exists, 30s TTL
DEL lock:resource                   # Release lock
```

## Hash Patterns

```bash
# Object storage
HSET user:123 name "John" email "john@example.com" age 30
HGET user:123 name
HGETALL user:123

# Incrementing fields
HINCRBY counters:views 123 1
HINCRBY counters:clicks 123 5

# Partial updates
HMSET session:123 token "abc" user_id 456 timestamp 1640995200
HDEL session:123 timestamp

# Hash expiration (entire hash)
HSET cache:123 field1 "value1"
EXPIRE cache:123 3600

# Check if field exists
HEXISTS user:123 email
```

## List Patterns

```bash
# Queue (FIFO)
LPUSH queue:task task1
RPUSH queue:task task2
RPOP queue:task   # Get first task
LPOP queue:task   # Get last task

# Stack (LIFO)
LPUSH stack:item item1
LPUSH stack:item item2
LPOP stack:item   # Get last pushed

# Limited list (trim)
LPUSH recent:items item1
LPUSH recent:items item2
LTRIM recent:items 0 9  # Keep last 10 items

# Blocking queue (multiple consumers)
BRPOP queue:task 10  # Wait up to 10s for task

# Range operations
LRANGE recent:items 0 -1  # Get all items
LLEN recent:items          # Get length
```

## Set Patterns

```bash
# Unique items
SADD tags:article:123 "redis" "database" "nosql"
SMEMBERS tags:article:123

# Membership check
SISMEMBER tags:article:123 "redis"  # Returns 1 or 0

# Set operations (unique visitors)
SADD visitors:2024-01-01 user1 user2 user3
SADD visitors:2024-01-02 user2 user3 user4

# Union (total unique)
SUNION visitors:2024-01-01 visitors:2024-01-02

# Intersection (repeat visitors)
SINTER visitors:2024-01-01 visitors:2024-01-02

# Difference (new visitors)
SDIFF visitors:2024-01-02 visitors:2024-01-01

# Random member
SRANDMEMBER tags:article:123
SPOP tags:article:123  # Remove and return random
```

## Sorted Set Patterns

```bash
# Leaderboard
ZADD leaderboard 1000 "user1" 1500 "user2" 800 "user3"
ZREVRANGE leaderboard 0 9 WITHSCORES  # Top 10
ZREVRANK leaderboard "user1"          # User's rank
ZSCORE leaderboard "user1"            # User's score

# Pagination
ZREVRANGE leaderboard 0 2 WITHSCORES   # Page 1
ZREVRANGE leaderboard 3 5 WITHSCORES   # Page 2

# Score ranges (rank range)
ZRANGE leaderboard 800 1000 BYSCORE

# Increment score
ZINCRBY leaderboard 50 "user1"

# Expiring leaderboard
ZADD leaderboard:2024:01 1000 "user1"
ZADD leaderboard:2024:02 1200 "user1"
EXPIRE leaderboard:2024:01 2592000  # 30 days

# Time-based events
ZADD events:pending 1704067200 "event1" 1704153600 "event2"
ZRANGEBYSCORE events:pending -inf 1704067200  # Events before time

# Moving average (sliding window)
ZADD window:10:00 5 "metric1" 7 "metric2"
ZREMRANGEBYRANK window:10:00 0 -11  # Keep last 10
ZCARD window:10:00
ZSCORE window:10:00 "metric1"
```

## HyperLogLog

```bash
# Unique count (approximate)
PFADD unique:visitors 123 456 789
PFCOUNT unique:visitors

# Combine multiple HLLs
PFADD unique:day1 123 456
PFADD unique:day2 456 789
PFCOUNT unique:day1 unique:day2  # Union count

# Merge HLLs
PFMERGE unique:combined unique:day1 unique:day2
PFCOUNT unique:combined

# Memory-efficient for large sets
# Error rate: < 1% for < 2^64 elements
```

## Bitmap Patterns

```bash
# Daily user activity
SETBIT activity:2024-01-01:123 1 1  # User 123 active on day 1
SETBIT activity:2024-01-01:456 1 1
BITCOUNT activity:2024-01-01        # Total active users

# Check user activity
GETBIT activity:2024-01-01:123 1   # Returns 1 or 0

# Weekly activity (7 days bitmap)
SETBIT activity:2024-w1:123 0 1     # Monday
SETBIT activity:2024-w1:123 1 0     # Tuesday

# Bit operations (find common active days)
BITOP OR combined:activity \
  activity:2024-01-01 \
  activity:2024-01-02

# Active on multiple days
BITPOS combined:activity 1  # Find first active day

# Efficient range queries
BITCOUNT activity:2024-01-01 0 100  # Count first 100 users
```

## Geospatial Patterns

```bash
# Add location
GEOADD locations -122.4194 37.7749 "SF" -118.2437 34.0522 "LA"

# Find nearby
GEORADIUS locations -122.4194 37.7749 50 km  # 50km radius

# Find nearby with distance
GEORADIUS locations -122.4194 37.7749 50 km WITHDIST

# Find nearby with coordinates
GEORADIUS locations -122.4194 37.7749 50 km WITHCOORD

# Geohash (compact representation)
GEOHASH locations "SF"

# Distance between two points
GEODIST locations "SF" "LA" km
```

## Pub/Sub Patterns

```bash
# Publish message
PUBLISH channel:news "Breaking news!"

# Subscribe to channel
SUBSCRIBE channel:news

# Pattern subscription
PSUBSCRIBE channel:*

# Unsubscribe
UNSUBSCRIBE channel:news
PUNSUBSCRIBE channel:*
```

## Streams

```bash
# Add to stream
XADD stream:events * user 123 action "login" timestamp 1704067200

# Read from stream
XREAD STREAMS stream:events 0  # Read from beginning
XREAD STREAMS stream:events $  # Read new events only

# Consumer group
XGROUP CREATE stream:events mygroup 0

# Consume from group
XREADGROUP GROUP mygroup consumer1 COUNT 1 STREAMS stream:events >

# Acknowledge processing
XACK stream:events mygroup 1234567890-0

# Consumer groups for load balancing
XGROUP CREATE stream:events processing-group 0 MKSTREAM
XREADGROUP GROUP processing-group worker1 COUNT 10 STREAMS stream:events >
```

## Caching Patterns

```bash
# Cache-aside pattern
GET cache:key
# If nil, compute and set
SET cache:key value EX 3600

# Write-through pattern
# Write to cache immediately after DB write
SET cache:key value EX 3600

# Write-back pattern
# Write to cache, async to DB
SET cache:key value EX 3600
# Background job syncs to DB

# Multi-get
MGET cache:key1 cache:key2 cache:key3

# Multi-set
MSET cache:key1 value1 cache:key2 value2 cache:key3 value3
```

## Session Storage

```bash
# Session data
HSET session:123 token "abc123" user_id 456 expires_at 1704153600

# Check session
HEXISTS session:123 token
HGET session:123 user_id

# Update session
HSET session:123 last_active 1704067200
EXPIRE session:123 3600

# Remove session
DEL session:123

# Active sessions scan
SCAN 0 MATCH session:* COUNT 100
```

## Rate Limiting

```bash
# Fixed window
INCR rate_limit:user:123:2024-01-01
EXPIRE rate_limit:user:123:2024-01-01 86400

# Sliding window
ZADD rate_limit:user:123 1704067200 "request1"
ZREMRANGEBYSCORE rate_limit:user:123 -inf 1704067100
ZCARD rate_limit:user:123

# Token bucket
HINCRBY bucket:user:123 tokens -1
HEXPIRE bucket:user:123 tokens 1
```

## Pagination

```bash
# Cursor-based pagination (sorted set)
ZADD recent:items timestamp1 "item1"
ZADD recent:items timestamp2 "item2"

# Get page
ZREVRANGE recent:items 0 9 WITHSCORES
ZREVRANGE recent:items 10 19 WITHSCORES

# With bookmark
ZSCORE recent:items "item10"
ZREVRANGEBYSCORE recent:items (timestamp -inf LIMIT 0 10
```

## Search Patterns

```bash
# Prefix search (autocomplete)
ZADD autocomplete:redis 0 "redis" 0 "redis:cluster" 0 "redis:sentinel"
ZRANGEBYLEX autocomplete:redis "[redis" "[redis\xff"

# Tag search (intersection)
SADD user:123:tags "python" "redis" "database"
SADD user:456:tags "python" "django"
SINTER user:123:tags user:456:tags

# Full-text search (simple)
FT.CREATE idx:users ON JSON PREFIX 1 user: SCHEMA $.name AS name TEXT
FT.SEARCH idx:users "John"
```

## Distributed Locks

```bash
# Simple lock
SET lock:resource "owner" NX PX 30000  # 30 second TTL

# Redlock (distributed)
SET lock:resource "owner" NX PX 30000
# Acquire lock on majority of nodes

# Watchdog (extend TTL)
while [ $((GET lock:resource TTL)) -lt 10000 ]; do
  PEXPIRE lock:resource 30000
  sleep 10000
done

# Safe unlock
# 1. Get lock value
# 2. Verify it's our lock
# 3. Delete lock
```

## Message Queue

```bash
# Simple queue (list)
LPUSH queue:jobs job1
RPOP queue:jobs

# Reliable queue (pop then ack)
RPUSH queue:pending job1 job2 job3
RPOPLPUSH queue:pending queue:processing

# Process job
# ... process job ...
LREM queue:processing job1  # Remove when done

# Delayed queue (sorted set)
ZADD delayed:jobs 1704067200 job1  # Execute at timestamp
ZRANGEBYSCORE delayed:jobs -inf 1704067200
ZREM delayed:jobs job1
```

## Leader Election

```bash
# Simple election
SET leader:nodes "node1" NX EX 30

# Vote for leader
INCR votes:candidate1
INCR votes:candidate2

# Check winner
ZREVRANGE votes:leaders 0 0 WITHSCORES

# Failover
DEL leader:nodes
# Wait for new leader
```

## Performance Tips

```bash
# Use pipelining for multiple commands
ECHO cmd1; ECHO cmd2; ECHO cmd3

# Use transactions
MULTI
SET key1 value1
SET key2 value2
EXEC

# Use Lua scripts for atomic operations
EVAL "if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('DEL', KEYS[1]) else return 0 end" 1 key value

# Use SCAN instead of KEYS for large datasets
SCAN 0 MATCH user:* COUNT 1000

# Monitor slow commands
SLOWLOG GET 10
CONFIG SET slowlog-log-slower-than 10000  # 10ms
```
