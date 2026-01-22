# PostgreSQL Internals Cheatsheet

## Write-Ahead Log (WAL)

```sql
-- Enable WAL
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET max_wal_senders = 3;
ALTER SYSTEM SET wal_keep_size = '1GB';

-- View WAL files
SELECT pg_ls_waldir();

-- Current WAL position
SELECT pg_current_wal_lsn();
SELECT pg_current_wal_flush_lsn();

-- Replication slot info
SELECT * FROM pg_replication_slots;

-- Create replication slot
SELECT pg_create_physical_replication_slot('my_slot');

-- Drop replication slot
SELECT pg_drop_replication_slot('my_slot');
```

## MVCC (Multi-Version Concurrency Control)

```sql
-- Transaction visibility
SELECT xmin, xmax, * FROM mytable;

-- Check row visibility
SELECT ctid, xmin, xmax, cmin, cmax, * FROM mytable;

-- Transaction ID age
SELECT age(xmin) FROM mytable;

-- Check for transaction wraparound
VACUUM FREEZE mytable;

-- Freeze all rows
VACUUM (FREEZE) mytable;

-- View transaction info
SELECT txid_current();
SELECT txid_current_snapshot();

-- Check for long-running transactions
SELECT pid, query_start, state, query
FROM pg_stat_activity
WHERE state IN ('idle in transaction', 'active')
ORDER BY query_start;
```

## Storage Engines

```sql
-- Table storage information
SELECT pg_relation_filepath('mytable');
SELECT pg_relation_size('mytable');
SELECT pg_total_relation_size('mytable');

-- Index storage
SELECT pg_relation_size('mytable_pkey');
SELECT pg_indexes_size('mytable');

-- Database sizes
SELECT pg_database_size('mydb');
SELECT pg_size_pretty(pg_database_size('mydb'));

-- All database sizes
SELECT datname, pg_size_pretty(pg_database_size(datname)) AS size
FROM pg_database
ORDER BY pg_database_size(datname) DESC;

-- Check for bloat
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
  n_dead_tup
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
```

## TOAST (The Oversized-Attribute Storage Technique)

```sql
-- TOAST configuration
SELECT relname, reltoastrelid
FROM pg_class
WHERE reltoastrelid != 0;

-- TOAST thresholds
SHOW toast_tuple_target;
SHOW default_toast_compression;

-- Check TOAST table
SELECT * FROM pg_toast.pg_toast_12345;

-- Compression methods
ALTER TABLE mytable ALTER COLUMN column SET COMPRESSION pglz;
ALTER TABLE mytable ALTER COLUMN column SET COMPRESSION lz4;
```

## Checkpoints

```sql
-- Checkpoint configuration
SHOW checkpoint_timeout;
SHOW checkpoint_completion_target;
SHOW max_wal_size;
SHOW min_wal_size;

-- Force checkpoint
CHECKPOINT;

-- View checkpoint stats
SELECT * FROM pg_stat_bgwriter;

-- View checkpoint history
SELECT * FROM pg_stat_bgwriter WHERE checkpoint > 0;
```

## VACUUM and Autovacuum

```sql
-- VACUUM configuration
SHOW autovacuum;
SHOW autovacuum_max_workers;
SHOW autovacuum_naptime;
SHOW autovacuum_vacuum_threshold;
SHOW autovacuum_analyze_threshold;
SHOW autovacuum_vacuum_scale_factor;
SHOW autovacuum_analyze_scale_factor;

-- Manual VACUUM
VACUUM mytable;
VACUUM FULL mytable;
VACUUM ANALYZE mytable;
VACUUM (VERBOSE, ANALYZE) mytable;

-- Autovacuum stats
SELECT relname, last_vacuum, last_autovacuum, vacuum_count, autovacuum_count
FROM pg_stat_user_tables;

-- Configure per-table autovacuum
ALTER TABLE mytable SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE mytable SET (autovacuum_vacuum_threshold = 1000);
```

## Query Planning

```sql
-- Explain query
EXPLAIN SELECT * FROM mytable WHERE id = 1;

-- Explain with actual execution
EXPLAIN ANALYZE SELECT * FROM mytable WHERE id = 1;

-- Detailed explain
EXPLAIN (ANALYZE, BUFFERS, VERBOSE) SELECT * FROM mytable;

-- Plan cache
SELECT * FROM pg_prepared_statements;

-- Query stats
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

## Index Internals

```sql
-- Index types
SELECT indexrelid, indexrelname, indrelid, indisunique, indisprimary, indtype
FROM pg_index
JOIN pg_class ON pg_class.oid = indexrelid
WHERE indrelid = 'mytable'::regclass;

-- Index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE tablename = 'mytable';

-- Index size
SELECT
  indexrelname,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE tablename = 'mytable';

-- Missing indexes (potential)
SELECT
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public'
ORDER BY n_distinct DESC;
```

## Buffer Pool

```sql
-- Buffer pool size
SHOW shared_buffers;
SHOW effective_cache_size;

-- Buffer pool stats
SELECT * FROM pg_buffercache;

-- Cache hit ratio
SELECT
  sum(heap_blks_read) AS heap_read,
  sum(heap_blks_hit) AS heap_hit,
  sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) AS cache_hit_ratio
FROM pg_statio_user_tables;

-- Extension required
CREATE EXTENSION pg_buffercache;
```

## Background Processes

```sql
-- View running processes
SELECT * FROM pg_stat_activity;

-- Kill specific query
SELECT pg_cancel_backend(pid);
SELECT pg_terminate_backend(pid);

-- Long-running queries
SELECT
  pid,
  now() - query_start AS duration,
  query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;

-- Blocked queries
SELECT
  blocked_locks.pid AS blocked_pid,
  blocked_activity.usename AS blocked_user,
  blocking_locks.pid AS blocking_pid,
  blocking_activity.usename AS blocking_user,
  blocked_activity.query AS blocked_statement
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

## Connection Pooling (PgBouncer)

```ini
; pgbouncer.ini
[databases]
mydb = host=localhost port=5432 dbname=mydb

[pgbouncer]
listen_addr = 127.0.0.1
listen_port = 6432
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 100
default_pool_size = 25
```

```bash
# Create userlist.txt
"username" "md5_hash"

# Generate md5 hash
echo -n "usernamepassword" | md5sum

# Start PgBouncer
pgbouncer -d /etc/pgbouncer/pgbouncer.ini

# Reload config
pgbouncer -R /etc/pgbouncer/pgbouncer.ini

# Show stats
echo 'show stats' | psql -h localhost -p 6432 pgbouncer
```

## Replication

```sql
-- Check replication status
SELECT * FROM pg_stat_replication;

-- Check replication lag
SELECT
  now() - pg_last_xact_replay_timestamp() AS replication_lag;

-- Create physical replication standby
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET max_wal_senders = 3;
ALTER SYSTEM SET wal_keep_size = '1GB';
ALTER SYSTEM SET hot_standby = on;

-- Recovery configuration (standby)
# recovery.conf
standby_mode = on
primary_conninfo = 'host=primary port=5432 user=replicator'
```

## Partitioning

```sql
-- Range partitioning
CREATE TABLE measurement (
  id serial,
  logdate date,
  temperature numeric
) PARTITION BY RANGE (logdate);

CREATE TABLE measurement_2024_01 PARTITION OF measurement
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE measurement_2024_02 PARTITION OF measurement
  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- List partition
CREATE TABLE measurement_list PARTITION BY LIST (region);

CREATE TABLE measurement_us PARTITION OF measurement_list
  FOR VALUES IN ('US');

-- Hash partitioning
CREATE TABLE measurement_hash PARTITION BY HASH (id);

CREATE TABLE measurement_hash_0 PARTITION OF measurement_hash
  FOR VALUES WITH (MODULUS 4, REMAINDER 0);

-- Default partition
CREATE TABLE measurement_default PARTITION OF measurement DEFAULT;

-- Detach partition
ALTER TABLE measurement DETACH PARTITION measurement_2024_01;
```

## Parallel Query

```sql
-- Enable parallel query
SET max_parallel_workers_per_gather = 4;
SET max_parallel_workers = 8;
SET max_parallel_maintenance_workers = 4;
SET min_parallel_table_scan_size = '8MB';
SET max_parallel_table_scan_size = '1GB';

-- Force parallel query
SET parallel_setup_cost = 0;
SET parallel_tuple_cost = 0;

-- Check parallel query usage
SELECT
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements
WHERE query LIKE '%Parallel%'
ORDER BY total_time DESC;
```

## Performance Tuning

```sql
-- Work memory per operation
SET work_mem = '256MB';
SET maintenance_work_mem = '1GB';

-- Random page cost
SET random_page_cost = 1.1;  -- SSD
SET random_page_cost = 4.0;  -- HDD

-- Effective cache size
SET effective_cache_size = '4GB';

-- Synchronous commit
SET synchronous_commit = off;  -- Faster, less durable
SET synchronous_commit = on;   -- Default, fully durable

-- Checkpoint tuning
SET checkpoint_timeout = '15min';
SET checkpoint_completion_target = 0.9;
SET max_wal_size = '4GB';
SET min_wal_size = '1GB';
```

## Monitoring

```sql
-- Query stats (requires pg_stat_statements)
CREATE EXTENSION pg_stat_statements;

SELECT
  query,
  calls,
  total_time,
  mean_time,
  max_time,
  rows
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- Table stats
SELECT
  schemaname,
  tablename,
  n_tup_ins,
  n_tup_upd,
  n_tup_del,
  n_live_tup,
  n_dead_tup,
  last_vacuum,
  last_autovacuum,
  vacuum_count,
  autovacuum_count
FROM pg_stat_user_tables;

-- Index stats
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Function stats
SELECT
  funcid,
  schemaname,
  funcname,
  calls,
  total_time,
  mean_time
FROM pg_stat_user_functions
ORDER BY total_time DESC;
```

## Common Internals Issues

```sql
-- Transaction wraparound check
SELECT
  datname,
  age(datfrozenxid),
  autovacuum_freeze_max_age,
  (age(datfrozenxid) / autovacuum_freeze_max_age) * 100 AS wraparound_risk
FROM pg_database;

-- High bloat tables
SELECT
  schemaname,
  tablename,
  n_dead_tup,
  n_live_tup,
  (n_dead_tup::float / GREATEST(n_dead_tup + n_live_tup, 1)) * 100 AS dead_ratio
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY dead_ratio DESC;

-- Slow queries
SELECT
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements
WHERE mean_time > 100
ORDER BY mean_time DESC;
```
