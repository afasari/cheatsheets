# SQLite

Lightweight, serverless, embedded SQL database.

## Connecting to SQLite

| COMMAND | DESCRIPTION |
| --- | --- |
| `sqlite3 database.db` | Open/create database |
| `sqlite3 :memory:` | Create in-memory database |
| `.quit` or `.exit` | Exit SQLite |
| `.tables` | List tables |
| `.schema` | Show database schema |
| `.schema tablename` | Show table schema |
| `.databases` | List databases |
| `.open filename` | Open database |
| `.read filename.sql` | Execute SQL file |

## Database Operations

| COMMAND | DESCRIPTION |
| --- | --- |
| `CREATE DATABASE dbname;` | Create database (not applicable in SQLite) |
| `DROP DATABASE dbname;` | Drop database (not applicable) |
| `ATTACH DATABASE 'file.db' AS alias;` | Attach database |
| `DETACH DATABASE alias;` | Detach database |

## Table Operations

| COMMAND | DESCRIPTION |
| --- | --- |
| `CREATE TABLE name (...);` | Create table |
| `DROP TABLE name;` | Drop table |
| `ALTER TABLE name ADD COLUMN col type;` | Add column |
| `ALTER TABLE name DROP COLUMN col;` | Drop column |
| `ALTER TABLE name RENAME TO newname;` | Rename table |

### Create Table Examples

```sql
-- Basic table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- With foreign key
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  title TEXT NOT NULL,
  content TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- With constraints
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL CHECK (price >= 0),
  quantity INTEGER DEFAULT 0
);
```

## Data Manipulation

### INSERT
```sql
-- Insert single row
INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com');

-- Insert multiple rows
INSERT INTO users (name, email) VALUES
  ('Jane Doe', 'jane@example.com'),
  ('Bob Smith', 'bob@example.com');

-- Insert from SELECT
INSERT INTO new_users (name, email)
SELECT name, email FROM old_users WHERE active = 1;
```

### SELECT
```sql
-- Select all columns
SELECT * FROM users;

-- Select specific columns
SELECT id, name FROM users;

-- With WHERE clause
SELECT * FROM users WHERE id = 1;

-- With ORDER BY
SELECT * FROM users ORDER BY created_at DESC;

-- With LIMIT
SELECT * FROM users LIMIT 10;

-- With OFFSET
SELECT * FROM users LIMIT 10 OFFSET 20;

-- With DISTINCT
SELECT DISTINCT email FROM users;

-- With LIKE
SELECT * FROM users WHERE name LIKE '%John%';

-- With IN
SELECT * FROM users WHERE id IN (1, 2, 3);

-- With BETWEEN
SELECT * FROM users WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31';

-- With GROUP BY
SELECT status, COUNT(*) FROM users GROUP BY status;

-- With HAVING
SELECT status, COUNT(*) as count
FROM users
GROUP BY status
HAVING count > 10;
```

### UPDATE
```sql
-- Update single column
UPDATE users SET email = 'newemail@example.com' WHERE id = 1;

-- Update multiple columns
UPDATE users SET name = 'Jane', email = 'jane@example.com' WHERE id = 1;

-- Update all rows
UPDATE users SET active = 1;

-- Update from SELECT
UPDATE users SET status = 'premium'
WHERE id IN (SELECT user_id FROM orders WHERE total > 100);
```

### DELETE
```sql
-- Delete specific rows
DELETE FROM users WHERE id = 1;

-- Delete with condition
DELETE FROM users WHERE created_at < '2020-01-01';

-- Delete all rows
DELETE FROM users;

-- Truncate (faster)
DELETE FROM users; VACUUM;
```

## Joins

```sql
-- Inner join
SELECT users.name, posts.title
FROM users
INNER JOIN posts ON users.id = posts.user_id;

-- Left join
SELECT users.name, posts.title
FROM users
LEFT JOIN posts ON users.id = posts.user_id;

-- Right join
SELECT users.name, posts.title
FROM users
RIGHT JOIN posts ON users.id = posts.user_id;

-- Self join
SELECT e1.name AS employee, e2.name AS manager
FROM employees e1
LEFT JOIN employees e2 ON e1.manager_id = e2.id;
```

## Aggregation Functions

| FUNCTION | DESCRIPTION |
| --- | --- |
| `COUNT(*)` | Count rows |
| `COUNT(column)` | Count non-null values |
| `SUM(column)` | Sum values |
| `AVG(column)` | Average values |
| `MIN(column)` | Minimum value |
| `MAX(column)` | Maximum value |
| `GROUP_CONCAT(column)` | Concatenate values |

## String Functions

| FUNCTION | DESCRIPTION |
| --- | --- |
| `SUBSTR(str, start, len)` | Extract substring |
| `LENGTH(str)` | String length |
| `UPPER(str)` | Convert to uppercase |
| `LOWER(str)` | Convert to lowercase |
| `TRIM(str)` | Remove whitespace |
| `REPLACE(str, from, to)` | Replace substring |
| `LIKE` | Pattern matching |

## Date Functions

```sql
-- Current date/time
SELECT date('now');
SELECT datetime('now');
SELECT time('now');

-- Date arithmetic
SELECT date('now', '+1 day');
SELECT date('now', '-1 month');
SELECT datetime('now', '+3 hours');

-- Format date
SELECT strftime('%Y-%m-%d', 'now');
SELECT strftime('%H:%M:%S', 'now');

-- Extract parts
SELECT strftime('%Y', 'now');  -- Year
SELECT strftime('%m', 'now');  -- Month
SELECT strftime('%d', 'now');  -- Day
```

## Indexes

| COMMAND | DESCRIPTION |
| --- | --- |
| `CREATE INDEX idx ON table(col);` | Create index |
| `CREATE UNIQUE INDEX idx ON table(col);` | Create unique index |
| `DROP INDEX idx;` | Drop index |
| `REINDEX idx;` | Rebuild index |

### Create Index Examples

```sql
-- Single column index
CREATE INDEX idx_email ON users(email);

-- Multi-column index
CREATE INDEX idx_name_email ON users(name, email);

-- Unique index
CREATE UNIQUE INDEX idx_unique_email ON users(email);

-- Index on expression
CREATE INDEX idx_active ON users(active);
```

## Views

```sql
-- Create view
CREATE VIEW active_users AS
SELECT id, name, email FROM users WHERE active = 1;

-- Use view
SELECT * FROM active_users;

-- Drop view
DROP VIEW active_users;
```

## Triggers

```sql
-- Create trigger
CREATE TRIGGER update_timestamp
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
  UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

-- Create trigger for insert
CREATE TRIGGER insert_timestamp
AFTER INSERT ON users
FOR EACH ROW
BEGIN
  INSERT INTO user_logs (user_id, action)
  VALUES (NEW.id, 'created');
END;

-- Drop trigger
DROP TRIGGER update_timestamp;
```

## Transactions

```sql
-- Start transaction
BEGIN;

-- Perform operations
INSERT INTO users (name) VALUES ('John');
UPDATE users SET active = 1 WHERE id = 1;

-- Commit transaction
COMMIT;

-- Rollback transaction
ROLLBACK;
```

## Backup & Restore

### Backup
```bash
# Export to SQL
sqlite3 database.db .dump > backup.sql

# Export to CSV
sqlite3 database.db "SELECT * FROM users" > users.csv

# Export specific table
sqlite3 database.db ".dump users" > users.sql
```

### Restore
```bash
# Import from SQL
sqlite3 database.db < backup.sql

# Import from CSV
sqlite3 database.db ".import users.csv users"
```

## Performance

### Analyze
```sql
ANALYZE;
```

### Vacuum
```sql
VACUUM;
```

### Explain Query Plan
```sql
EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = 'john@example.com';
```

## Useful Commands

### Check table size
```sql
SELECT count(*) FROM sqlite_master WHERE type='table' AND name='users';
```

### Check database size
```bash
ls -lh database.db
```

### Export table to CSV
```bash
sqlite3 database.db <<EOF
.mode csv
.headers on
.output users.csv
SELECT * FROM users;
.quit
EOF
```

### Import CSV to table
```bash
sqlite3 database.db <<EOF
.mode csv
.import users.csv users
.quit
EOF
```

## Pragma Commands

| COMMAND | DESCRIPTION |
| --- | --- |
| `PRAGMA table_info(table);` | Show table structure |
| `PRAGMA index_list(table);` | List indexes |
| `PRAGMA index_info(index);` | Show index info |
| `PRAGMA foreign_keys;` | Check foreign key status |
| `PRAGMA foreign_keys = ON;` | Enable foreign keys |
| `PRAGMA synchronous;` | Get synchronous mode |
| `PRAGMA synchronous = NORMAL;` | Set synchronous mode |
| `PRAGMA journal_mode;` | Get journal mode |
| `PRAGMA journal_mode = WAL;` | Set journal mode to WAL |

## Best Practices

- Use indexes on frequently queried columns
- Use appropriate data types
- Use transactions for multiple operations
- Regularly vacuum database to reclaim space
- Use WAL journal mode for better concurrency
- Use foreign keys for data integrity
- Use prepared statements to prevent SQL injection
- Regularly backup your database
- Monitor query performance
- Use connection pooling in applications
- Use transactions for data consistency
- Regularly analyze database with ANALYZE

::: tip
Use SQLite's `.dump` command to create portable backups that can be restored on any platform.
:::
