# SQLite Optimization Cheatsheet

## Indexes

```sql
-- Create index
CREATE INDEX idx_users_email ON users(email);

-- Create composite index
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

-- Create unique index
CREATE UNIQUE INDEX idx_unique_email ON users(email);

-- Create index with condition (partial index)
CREATE INDEX idx_active_users ON users(status) WHERE status = 'active';

-- Check if index is being used
EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = 'user@example.com';

-- Drop index
DROP INDEX idx_users_email;

-- Rebuild index
REINDEX idx_users_email;
REINDEX users;  -- Rebuild all indexes on table

-- List indexes
PRAGMA index_list('users');
PRAGMA index_info('idx_users_email');
```

## Query Optimization

```sql
-- Analyze query plan
EXPLAIN SELECT * FROM users WHERE email = 'user@example.com';
EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = 'user@example.com';

-- Analyze with stats
ANALYZE;
EXPLAIN QUERY PLAN SELECT * FROM users;

-- Check table stats
PRAGMA table_info(users);
PRAGMA stats;

-- Optimize LIKE queries
-- Use leading wildcard if possible
SELECT * FROM users WHERE name LIKE 'John%';  -- Uses index
SELECT * FROM users WHERE name LIKE '%John';  -- Full scan

-- Use IN instead of OR
SELECT * FROM users WHERE id IN (1, 2, 3);  -- Uses index
SELECT * FROM users WHERE id = 1 OR id = 2 OR id = 3;  -- May not use index

-- Use EXISTS instead of IN for subqueries
SELECT * FROM users WHERE EXISTS (
  SELECT 1 FROM orders WHERE orders.user_id = users.id
);

-- Use LIMIT with ORDER BY for top queries
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;
```

## Vacuum and Optimization

```sql
-- Rebuild database (compact file)
VACUUM;

-- Vacuum specific table
VACUUM users;

-- Analyze statistics
ANALYZE;
ANALYZE users;

-- Vacuum with analyze
VACUUM; ANALYZE;

-- Incremental vacuum (for write-ahead log)
PRAGMA wal_checkpoint(PASSIVE);
PRAGMA wal_checkpoint(FULL);
PRAGMA wal_checkpoint(RESTART);

-- Check database size
SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size();
```

## Configuration Options

```sql
-- Set journaling mode
PRAGMA journal_mode = WAL;          -- Better concurrency
PRAGMA journal_mode = DELETE;       -- Default
PRAGMA journal_mode = TRUNCATE;
PRAGMA journal_mode = MEMORY;
PRAGMA journal_mode = OFF;          -- Fastest, unsafe

-- Set synchronous mode
PRAGMA synchronous = NORMAL;        -- Default with WAL
PRAGMA synchronous = FULL;          -- Safest, slower
PRAGMA synchronous = OFF;            -- Fastest, unsafe

-- Set cache size (pages, typically 2KB-4KB each)
PRAGMA cache_size = -2000;           -- 2MB (negative = KB)
PRAGMA cache_size = 2000;            -- 2000 pages

-- Set page size
PRAGMA page_size = 4096;             -- 4KB (common for SSD)
PRAGMA page_size = 8192;             -- 8KB
PRAGMA page_size = 1024;             -- 1KB (old default)

-- Set temp store
PRAGMA temp_store = MEMORY;          -- Store temp tables in memory
PRAGMA temp_store = FILE;            -- Default

-- Set locking mode
PRAGMA locking_mode = NORMAL;        -- Default
PRAGMA locking_mode = EXCLUSIVE;     -- Single connection
PRAGMA locking_mode = NORMAL;

-- Set mmap size
PRAGMA mmap_size = 268435456;        -- 256MB

-- View current settings
PRAGMA journal_mode;
PRAGMA synchronous;
PRAGMA cache_size;
```

## Transactions

```sql
-- Basic transaction
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

-- Transaction with savepoints
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
SAVEPOINT my_savepoint;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
ROLLBACK TO my_savepoint;
COMMIT;

-- Immediate transaction (BEGIN IMMEDIATE)
BEGIN IMMEDIATE;
-- Gets write lock immediately
COMMIT;

-- Exclusive transaction
BEGIN EXCLUSIVE;
-- Gets exclusive lock
COMMIT;

-- Transaction nesting (savepoints)
SAVEPOINT sp1;
-- ...
RELEASE sp1;
-- or ROLLBACK TO sp1;
```

## Batch Operations

```sql
-- Batch insert with transaction
BEGIN TRANSACTION;
INSERT INTO users (name, email) VALUES ('John', 'john@example.com');
INSERT INTO users (name, email) VALUES ('Jane', 'jane@example.com');
-- ... more inserts
COMMIT;

-- Batch update with CASE
UPDATE products
SET price = CASE id
  WHEN 1 THEN 10.99
  WHEN 2 THEN 15.99
  WHEN 3 THEN 20.99
  ELSE price
END
WHERE id IN (1, 2, 3);

-- Batch delete with WHERE
DELETE FROM logs WHERE created_at < datetime('now', '-30 days');

-- Use INSERT OR REPLACE
INSERT OR REPLACE INTO users (id, name, email)
VALUES (1, 'John', 'john@example.com');

-- Use INSERT OR IGNORE
INSERT OR IGNORE INTO users (id, name, email)
VALUES (1, 'John', 'john@example.com');
```

## Connection Pooling

```python
# Python SQLite connection pool
import sqlite3
from queue import Queue
from threading import Lock

class SQLitePool:
    def __init__(self, db_path, max_connections=5):
        self.db_path = db_path
        self.max_connections = max_connections
        self._pool = Queue(max_connections)
        self._lock = Lock()
        for _ in range(max_connections):
            conn = sqlite3.connect(db_path, check_same_thread=False)
            conn.execute("PRAGMA journal_mode=WAL")
            conn.execute("PRAGMA synchronous=NORMAL")
            conn.execute("PRAGMA cache_size=-64000")  # 64MB
            self._pool.put(conn)

    def get_connection(self):
        return self._pool.get()

    def return_connection(self, conn):
        self._pool.put(conn)

# Usage
pool = SQLitePool('mydb.sqlite', max_connections=5)
conn = pool.get_connection()
try:
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    results = cursor.fetchall()
finally:
    pool.return_connection(conn)
```

## Prepared Statements

```python
# Python prepared statement
import sqlite3

conn = sqlite3.connect('mydb.sqlite')
cursor = conn.cursor()

# Prepare statement
stmt = "INSERT INTO users (name, email) VALUES (?, ?)"
cursor.execute(stmt, ('John', 'john@example.com'))
cursor.execute(stmt, ('Jane', 'jane@example.com'))
conn.commit()

# Executemany for batch
users = [
    ('Alice', 'alice@example.com'),
    ('Bob', 'bob@example.com'),
    ('Charlie', 'charlie@example.com')
]
cursor.executemany(stmt, users)
conn.commit()

# Parameterized queries
cursor.execute("SELECT * FROM users WHERE email = ?", ('user@example.com',))
```

## WAL (Write-Ahead Logging)

```sql
-- Enable WAL
PRAGMA journal_mode=WAL;

-- Checkpoint manually
PRAGMA wal_checkpoint(PASSIVE);
PRAGMA wal_checkpoint(FULL);
PRAGMA wal_checkpoint(RESTART);
PRAGMA wal_checkpoint(TRUNCATE);

-- Check WAL status
PRAGMA wal_autocheckpoint;
PRAGMA wal_checkpoint;

-- Set auto-checkpoint interval (pages)
PRAGMA wal_autocheckpoint = 1000;

-- Disable WAL
PRAGMA journal_mode=DELETE;

-- Check for write-ahead log
.mode column
SELECT * FROM pragma_wal_info();
```

## Foreign Keys

```sql
-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- Check foreign keys status
PRAGMA foreign_keys;

-- Create foreign key
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  amount REAL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ON DELETE options
ON DELETE CASCADE    -- Delete child records
ON DELETE SET NULL   -- Set foreign key to NULL
ON DELETE RESTRICT   -- Prevent deletion
ON DELETE NO ACTION  -- Default, prevent deletion

-- ON UPDATE options
ON UPDATE CASCADE
ON UPDATE SET NULL
ON UPDATE RESTRICT
ON UPDATE NO ACTION

-- Check foreign key integrity
PRAGMA foreign_key_check;

-- List foreign keys
PRAGMA foreign_key_list('orders');
```

## Triggers for Optimization

```sql
-- Update denormalized data
CREATE TRIGGER update_user_count
AFTER INSERT ON users
BEGIN
  UPDATE stats SET user_count = user_count + 1 WHERE id = 1;
END;

-- Update timestamp
CREATE TRIGGER update_timestamp
AFTER UPDATE ON posts
BEGIN
  UPDATE posts SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Soft delete
CREATE TRIGGER soft_delete_users
BEFORE DELETE ON users
BEGIN
  INSERT INTO deleted_users SELECT * FROM users WHERE id = OLD.id;
END;

-- Auto-increment counter
CREATE TRIGGER update_counter
AFTER INSERT ON items
BEGIN
  UPDATE counters SET count = count + 1 WHERE name = 'items';
END;
```

## Table Optimization

```sql
-- Optimize table structure
-- Use appropriate data types
CREATE TABLE users (
  id INTEGER PRIMARY KEY,                    -- Auto-increment
  name TEXT NOT NULL,                       -- Variable-length text
  email TEXT UNIQUE NOT NULL,
  age INTEGER,                              -- Integer
  balance REAL,                             -- Floating point
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT 1               -- 0 or 1
);

-- Use WITHOUT ROWID for smaller tables
CREATE TABLE small_table (
  id INTEGER PRIMARY KEY,
  name TEXT,
  value REAL
) WITHOUT ROWID;

-- Create table with specific page size
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT
) WITHOUT ROWID;

-- Rename column (SQLite 3.25+)
ALTER TABLE users RENAME COLUMN old_name TO new_name;

-- Add column
ALTER TABLE users ADD COLUMN age INTEGER;

-- Drop column (SQLite 3.35+)
ALTER TABLE users DROP COLUMN age;
```

## Caching Strategies

```sql
-- Application-level cache example (Python)
import sqlite3
import json
from functools import lru_cache

class CachedQuery:
    def __init__(self, db_path):
        self.db_path = db_path

    @lru_cache(maxsize=1000)
    def get_user(self, user_id):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        result = cursor.fetchone()
        conn.close()
        return result

    @lru_cache(maxsize=100)
    def get_user_stats(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*), AVG(age) FROM users")
        result = cursor.fetchone()
        conn.close()
        return result

-- Materialized view pattern
CREATE TABLE user_stats AS
SELECT
  id,
  name,
  (SELECT COUNT(*) FROM orders WHERE orders.user_id = users.id) AS order_count,
  (SELECT SUM(amount) FROM orders WHERE orders.user_id = users.id) AS total_spent
FROM users;

-- Update materialized view
DELETE FROM user_stats;
INSERT INTO user_stats
SELECT ... same query as above ...;
```

## Memory Optimization

```sql
-- Use memory-mapped I/O
PRAGMA mmap_size = 268435456;  -- 256MB

-- Increase cache size for large databases
PRAGMA cache_size = -262144;   -- 256MB

-- Use in-memory database for temporary data
ATTACH DATABASE ':memory:' AS temp;
CREATE TABLE temp.cache AS SELECT * FROM users LIMIT 100;

-- Use temporary tables
CREATE TEMP TABLE temp_results AS
SELECT * FROM large_table WHERE condition;

-- Use index on large tables
CREATE INDEX idx_large_table_field ON large_table(field);

-- Optimize LIKE with COLLATE NOCASE
CREATE INDEX idx_users_name ON users(name COLLATE NOCASE);
SELECT * FROM users WHERE name LIKE 'john%';
```

## Backup and Restore

```sql
-- Online backup
.backup mydb.sqlite backup.sqlite

-- Restore from backup
.open backup.sqlite
.backup mydb.sqlite

-- Export data
.mode csv
.output users.csv
SELECT * FROM users;
.output

-- Import data
.import users.csv users

-- Dump database to SQL
.output dump.sql
.dump
.output

-- Restore from SQL dump
.read dump.sql

-- Vacuum into new file
VACUUM INTO new_database.sqlite;
```

## Performance Monitoring

```sql
-- Check query plan
EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = 'user@example.com';

-- Check table stats
PRAGMA table_info(users);
PRAGMA index_list(users);

-- Check database size
PRAGMA page_count;
PRAGMA page_size;

-- Check WAL status
PRAGMA journal_mode;
PRAGMA wal_checkpoint;

-- Check foreign key integrity
PRAGMA foreign_key_check;

-- Check index usage
EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = 'user@example.com';

-- Monitor slow queries
-- Use timing in application code
import sqlite3
import time

conn = sqlite3.connect('mydb.sqlite')
cursor = conn.cursor()
start = time.time()
cursor.execute("SELECT * FROM users WHERE email = 'user@example.com'")
end = time.time()
print(f"Query time: {end - start:.3f}s")
```

## Common Patterns

### Bulk Import
```sql
-- Disable journaling for bulk import
PRAGMA journal_mode=OFF;
PRAGMA synchronous=OFF;
PRAGMA cache_size=-1000000;

BEGIN TRANSACTION;
.import largefile.csv large_table
COMMIT;

-- Re-enable journaling
PRAGMA journal_mode=WAL;
PRAGMA synchronous=NORMAL;
```

### Time-series Data
```sql
-- Use partition-like structure
CREATE TABLE measurements_2024_01 (
  timestamp INTEGER PRIMARY KEY,
  value REAL
) WITHOUT ROWID;

-- Create partial index for recent data
CREATE INDEX idx_measurements_recent
ON measurements_2024_01(timestamp)
WHERE timestamp > strftime('%s', 'now', '-30 days');

-- Query with time filter
SELECT * FROM measurements_2024_01
WHERE timestamp > strftime('%s', 'now', '-7 days');
```

### Full-text Search
```sql
-- Create FTS table
CREATE VIRTUAL TABLE docs USING fts5(title, content);

-- Insert documents
INSERT INTO docs(title, content) VALUES ('My Document', 'This is the content...');

-- Search
SELECT * FROM docs WHERE docs MATCH 'search term';

-- Highlight matches
SELECT highlight(docs, 0, '<b>', '</b>') FROM docs WHERE docs MATCH 'search';
```
