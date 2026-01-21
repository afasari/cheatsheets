# PostgreSQL

Powerful, open source object-relational database system.

## Connecting to PostgreSQL

| COMMAND | DESCRIPTION |
| --- | --- |
| `psql -U username -d database -h host` | Connect to database |
| `psql -U postgres -d mydb` | Connect as postgres user |
| `psql -l` | List all databases |
| `\c database_name` | Switch to another database |
| `\q` | Quit psql |
| `\! command` | Execute shell command |

## Database Operations

| COMMAND | DESCRIPTION |
| --- | --- |
| `CREATE DATABASE dbname;` | Create new database |
| `DROP DATABASE dbname;` | Delete database |
| `ALTER DATABASE dbname RENAME TO newname;` | Rename database |
| `\list` or `\l` | List all databases |
| `\db` | List tablespaces |

## Table Operations

| COMMAND | DESCRIPTION |
| --- | --- |
| `\dt` | List all tables |
| `\dt schema.*` | List tables in schema |
| `\d table_name` | Describe table structure |
| `\d+ table_name` | Detailed table info |
| `CREATE TABLE name (...);` | Create table |
| `DROP TABLE name;` | Drop table |
| `TRUNCATE TABLE name;` | Remove all rows |
| `ALTER TABLE name ADD COLUMN col type;` | Add column |
| `ALTER TABLE name DROP COLUMN col;` | Drop column |

## User & Permissions

| COMMAND | DESCRIPTION |
| --- | --- |
| `CREATE USER username WITH PASSWORD 'pwd';` | Create user |
| `CREATE ROLE role_name;` | Create role |
| `DROP USER username;` | Drop user |
| `ALTER USER username PASSWORD 'newpwd';` | Change password |
| `GRANT ALL ON db TO user;` | Grant privileges |
| `REVOKE ALL ON db FROM user;` | Revoke privileges |
| `\du` | List users/roles |
| `GRANT CONNECT ON DATABASE db TO user;` | Grant connect |

## Data Manipulation

### SELECT
```sql
-- Select all columns
SELECT * FROM table_name;

-- Select specific columns
SELECT col1, col2 FROM table_name;

-- With conditions
SELECT * FROM table_name WHERE col = 'value';

-- With multiple conditions
SELECT * FROM table_name WHERE col1 = 'value' AND col2 > 10;

-- Sort results
SELECT * FROM table_name ORDER BY col ASC;
SELECT * FROM table_name ORDER BY col DESC;

-- Limit results
SELECT * FROM table_name LIMIT 10;

-- Offset and limit
SELECT * FROM table_name OFFSET 10 LIMIT 5;

-- Distinct values
SELECT DISTINCT col FROM table_name;
```

### INSERT
```sql
-- Insert single row
INSERT INTO table_name (col1, col2) VALUES ('value1', 'value2');

-- Insert multiple rows
INSERT INTO table_name (col1, col2) VALUES
  ('value1', 'value2'),
  ('value3', 'value4');

-- Insert from select
INSERT INTO table_name (col1, col2)
SELECT col1, col2 FROM another_table;
```

### UPDATE
```sql
-- Update single column
UPDATE table_name SET col1 = 'new_value' WHERE id = 1;

-- Update multiple columns
UPDATE table_name SET col1 = 'value1', col2 = 'value2' WHERE id = 1;

-- Update all rows
UPDATE table_name SET col1 = 'new_value';
```

### DELETE
```sql
-- Delete specific rows
DELETE FROM table_name WHERE id = 1;

-- Delete all rows
DELETE FROM table_name;

-- Truncate (faster, no rollback)
TRUNCATE TABLE table_name;
```

## Joins

```sql
-- Inner join
SELECT * FROM table1
INNER JOIN table2 ON table1.id = table2.id;

-- Left join
SELECT * FROM table1
LEFT JOIN table2 ON table1.id = table2.id;

-- Right join
SELECT * FROM table1
RIGHT JOIN table2 ON table1.id = table2.id;

-- Full outer join
SELECT * FROM table1
FULL OUTER JOIN table2 ON table1.id = table2.id;

-- Self join
SELECT a.name, b.name FROM employees a
JOIN employees b ON a.manager_id = b.id;
```

## Aggregations

```sql
-- Count
SELECT COUNT(*) FROM table_name;
SELECT COUNT(col) FROM table_name;
SELECT COUNT(DISTINCT col) FROM table_name;

-- Sum
SELECT SUM(col) FROM table_name;

-- Average
SELECT AVG(col) FROM table_name;

-- Min/Max
SELECT MIN(col), MAX(col) FROM table_name;

-- Group by
SELECT col, COUNT(*) FROM table_name GROUP BY col;

-- Having clause
SELECT col, COUNT(*) FROM table_name
GROUP BY col HAVING COUNT(*) > 5;
```

## String Functions

| FUNCTION | DESCRIPTION |
| --- | --- |
| `CONCAT(str1, str2)` | Concatenate strings |
| `LOWER(str)` | Convert to lowercase |
| `UPPER(str)` | Convert to uppercase |
| `TRIM(str)` | Remove whitespace |
| `LENGTH(str)` | String length |
| `SUBSTRING(str FROM start FOR len)` | Extract substring |
| `REPLACE(str, from, to)` | Replace substring |
| `POSITION(sub IN str)` | Find position |
| `STRPOS(str, sub)` | Find substring |

## Date Functions

```sql
-- Current date/time
SELECT NOW();
SELECT CURRENT_DATE;
SELECT CURRENT_TIME;

-- Date arithmetic
SELECT NOW() + INTERVAL '1 day';
SELECT NOW() - INTERVAL '1 month';

-- Extract parts
SELECT EXTRACT(YEAR FROM NOW());
SELECT EXTRACT(MONTH FROM NOW());
SELECT EXTRACT(DAY FROM NOW());

-- Date formatting
SELECT TO_CHAR(NOW(), 'YYYY-MM-DD');
SELECT TO_DATE('2024-01-01', 'YYYY-MM-DD');
```

## Indexes

| COMMAND | DESCRIPTION |
| --- | --- |
| `CREATE INDEX idx_name ON table(col);` | Create index |
| `CREATE UNIQUE INDEX idx ON table(col);` | Create unique index |
| `DROP INDEX idx_name;` | Drop index |
| `\di` | List indexes |
| `CREATE INDEX ON table USING gin(col);` | GIN index for arrays |

## Views

```sql
-- Create view
CREATE VIEW view_name AS
SELECT col1, col2 FROM table_name WHERE condition;

-- Drop view
DROP VIEW view_name;

-- List views
\dv

```

## Common Table Expressions (CTE)

```sql
-- Basic CTE
WITH cte_name AS (
  SELECT col FROM table WHERE condition
)
SELECT * FROM cte_name;

-- Multiple CTEs
WITH
  cte1 AS (SELECT ...),
  cte2 AS (SELECT ...)
SELECT * FROM cte1 JOIN cte2 ON ...;
```

## Window Functions

```sql
-- ROW_NUMBER
SELECT col, ROW_NUMBER() OVER (ORDER BY col) as rn
FROM table_name;

-- RANK
SELECT col, RANK() OVER (ORDER BY col DESC) as rank
FROM table_name;

-- LAG/LEAD
SELECT col,
  LAG(col) OVER (ORDER BY col) as prev_value,
  LEAD(col) OVER (ORDER BY col) as next_value
FROM table_name;
```

## Backup & Restore

### Backup
```bash
# Dump all databases
pg_dumpall > backup.sql

# Dump single database
pg_dump dbname > backup.sql

# Dump with custom format
pg_dump -F c -f backup.dump dbname

# Dump only schema
pg_dump -s dbname > schema.sql

# Dump only data
pg_dump -a dbname > data.sql
```

### Restore
```bash
# Restore from SQL file
psql dbname < backup.sql

# Restore from custom format
pg_restore -d dbname backup.dump

# Restore specific table
pg_restore -d dbname -t tablename backup.dump
```

## Performance

### Query Analysis
```sql
-- Explain query plan
EXPLAIN SELECT * FROM table_name;

-- Explain with execution
EXPLAIN ANALYZE SELECT * FROM table_name;

-- Check indexes usage
SELECT * FROM pg_stat_user_indexes;
```

### Vacuum
```sql
-- Vacuum database
VACUUM;

-- Vacuum analyze
VACUUM ANALYZE;

-- Vacuum full
VACUUM FULL;

-- Vacuum specific table
VACUUM table_name;
```

## Useful Queries

### Table sizes
```sql
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Database sizes
```sql
SELECT
  datname,
  pg_size_pretty(pg_database_size(datname)) AS size
FROM pg_database
ORDER BY pg_database_size(datname) DESC;
```

### Active connections
```sql
SELECT
  pid,
  usename,
  application_name,
  state,
  query_start,
  state_change,
  query
FROM pg_stat_activity;
```

### Kill connection
```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'dbname'
AND pid <> pg_backend_pid();
```

## Configuration

| COMMAND | DESCRIPTION |
| --- | --- |
| `SHOW config_file;` | Show config file location |
| `SHOW all;` | Show all parameters |
| `SHOW work_mem;` | Show parameter value |
| `SET work_mem = '256MB';` | Set parameter value |
| `RESET work_mem;` | Reset parameter to default |

## Best Practices

- Use indexes on columns used in WHERE, JOIN, and ORDER BY clauses
- Avoid SELECT * when possible
- Use prepared statements to prevent SQL injection
- Regularly vacuum and analyze tables
- Use appropriate data types
- Partition large tables
- Use connection pooling (PgBouncer)
- Monitor query performance
- Set appropriate resource limits
- Regular backups and test restores
- Use transactions for data consistency

::: tip
Use `EXPLAIN ANALYZE` to identify slow queries and optimize them accordingly.
:::
