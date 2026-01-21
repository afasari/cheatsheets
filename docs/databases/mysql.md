# MySQL

Popular open-source relational database management system.

## Connecting to MySQL

| COMMAND | DESCRIPTION |
| --- | --- |
| `mysql -u username -p` | Connect to MySQL |
| `mysql -u username -p -h host` | Connect to remote host |
| `mysql -u username -p database_name` | Connect to specific database |
| `mysql -u username -p -e "query"` | Execute query |
| `exit` or `quit` | Exit MySQL shell |

## Database Operations

| COMMAND | DESCRIPTION |
| --- | --- |
| `CREATE DATABASE dbname;` | Create database |
| `DROP DATABASE dbname;` | Delete database |
| `USE dbname;` | Select database |
| `SHOW DATABASES;` | List all databases |
| `SHOW CREATE DATABASE dbname;` | Show database creation statement |
| `ALTER DATABASE dbname CHARACTER SET utf8mb4;` | Change character set |

## Table Operations

| COMMAND | DESCRIPTION |
| --- | --- |
| `SHOW TABLES;` | List tables in database |
| `CREATE TABLE name (...);` | Create table |
| `DROP TABLE name;` | Drop table |
| `TRUNCATE TABLE name;` | Remove all rows |
| `DESCRIBE table_name;` | Show table structure |
| `SHOW CREATE TABLE name;` | Show table creation statement |
| `ALTER TABLE name ADD COLUMN col type;` | Add column |
| `ALTER TABLE name DROP COLUMN col;` | Drop column |
| `ALTER TABLE name MODIFY col type;` | Modify column |

## Data Manipulation

### SELECT
```sql
-- Select all columns
SELECT * FROM table_name;

-- Select specific columns
SELECT col1, col2 FROM table_name;

-- With conditions
SELECT * FROM table_name WHERE col = 'value';

-- With LIKE
SELECT * FROM table_name WHERE col LIKE '%pattern%';

-- With LIMIT
SELECT * FROM table_name LIMIT 10;

-- With OFFSET
SELECT * FROM table_name LIMIT 10 OFFSET 5;

-- With ORDER BY
SELECT * FROM table_name ORDER BY col ASC;
SELECT * FROM table_name ORDER BY col DESC;

-- With GROUP BY
SELECT col, COUNT(*) FROM table_name GROUP BY col;

-- With HAVING
SELECT col, COUNT(*) FROM table_name GROUP BY col HAVING COUNT(*) > 5;
```

### INSERT
```sql
-- Insert single row
INSERT INTO table_name (col1, col2) VALUES ('value1', 'value2');

-- Insert multiple rows
INSERT INTO table_name (col1, col2) VALUES
  ('value1', 'value2'),
  ('value3', 'value4');

-- Insert from SELECT
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

-- Truncate (faster)
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

-- Self join
SELECT a.name, b.name FROM employees a
JOIN employees b ON a.manager_id = b.id;
```

## Indexes

| COMMAND | DESCRIPTION |
| --- | --- |
| `CREATE INDEX idx ON table(col);` | Create index |
| `CREATE UNIQUE INDEX idx ON table(col);` | Create unique index |
| `DROP INDEX idx ON table;` | Drop index |
| `SHOW INDEX FROM table;` | Show indexes |
| `CREATE FULLTEXT INDEX idx ON table(col);` | Fulltext index |

## Users & Privileges

| COMMAND | DESCRIPTION |
| --- | --- |
| `CREATE USER 'username'@'host' IDENTIFIED BY 'password';` | Create user |
| `DROP USER 'username'@'host';` | Drop user |
| `ALTER USER 'username'@'host' IDENTIFIED BY 'new_password';` | Change password |
| `GRANT ALL ON dbname.* TO 'user'@'host';` | Grant all privileges |
| `GRANT SELECT ON dbname.* TO 'user'@'host';` | Grant select only |
| `REVOKE ALL ON dbname.* FROM 'user'@'host';` | Revoke privileges |
| `FLUSH PRIVILEGES;` | Reload privileges |
| `SHOW GRANTS FOR 'user'@'host';` | Show user grants |

## Backup & Restore

### Backup
```bash
# Dump all databases
mysqldump -u root -p --all-databases > backup.sql

# Dump single database
mysqldump -u root -p dbname > backup.sql

# Dump specific tables
mysqldump -u root -p dbname table1 table2 > backup.sql

# Dump with data only
mysqldump -u root -p --no-create-info dbname > data.sql

# Dump with structure only
mysqldump -u root -p --no-data dbname > schema.sql

# Dump with compression
mysqldump -u root -p dbname | gzip > backup.sql.gz
```

### Restore
```bash
# Restore from SQL file
mysql -u root -p dbname < backup.sql

# Restore compressed backup
gunzip < backup.sql.gz | mysql -u root -p dbname

# Restore all databases
mysql -u root -p < backup.sql
```

## Performance

### Query Analysis
```sql
-- Explain query
EXPLAIN SELECT * FROM table_name WHERE col = 'value';

-- Explain extended
EXPLAIN EXTENDED SELECT * FROM table_name;
```

### Optimizing
| COMMAND | DESCRIPTION |
| --- | --- |
| `OPTIMIZE TABLE name;` | Optimize table |
| `ANALYZE TABLE name;` | Analyze table |
| `CHECK TABLE name;` | Check table for errors |
| `REPAIR TABLE name;` | Repair corrupted table |

### Show Processlist
```sql
-- Show running queries
SHOW PROCESSLIST;

-- Kill query
KILL <process_id>;
```

## Useful Queries

### Table sizes
```sql
SELECT
  table_name AS 'Table',
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'dbname'
ORDER BY (data_length + index_length) DESC;
```

### Database sizes
```sql
SELECT
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.TABLES
GROUP BY table_schema
ORDER BY (data_length + index_length) DESC;
```

### List all users
```sql
SELECT user, host FROM mysql.user;
```

### Kill all sleeping connections
```sql
KILL ALL SLEEPING CONNECTIONS;
```

## Replication

### Master Configuration
```sql
-- Enable binary logging
SET GLOBAL log_bin = ON;
SET GLOBAL server_id = 1;

-- Create replication user
CREATE USER 'repl'@'%' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';

-- Get master status
SHOW MASTER STATUS;
```

### Slave Configuration
```sql
-- Configure slave
CHANGE MASTER TO
  MASTER_HOST='master_host',
  MASTER_USER='repl',
  MASTER_PASSWORD='password',
  MASTER_LOG_FILE='mysql-bin.000001',
  MASTER_LOG_POS=154;

-- Start slave
START SLAVE;

-- Check slave status
SHOW SLAVE STATUS\G
```

## Common Data Types

| TYPE | DESCRIPTION |
| --- | --- |
| `INT` | Integer |
| `BIGINT` | Large integer |
| `VARCHAR(n)` | Variable-length string |
| `TEXT` | Long text |
| `DATE` | Date (YYYY-MM-DD) |
| `DATETIME` | Date and time |
| `TIMESTAMP` | Timestamp |
| `DECIMAL(p,s)` | Decimal number |
| `BOOLEAN` | Boolean (TINYINT(1)) |
| `JSON` | JSON data |

## Best Practices

- Use indexes on columns used in WHERE, JOIN, ORDER BY
- Use appropriate data types
- Use prepared statements to prevent SQL injection
- Regularly backup databases
- Monitor slow queries
- Use connection pooling
- Set appropriate resource limits
- Use transactions for data consistency
- Regularly analyze and optimize tables
- Partition large tables
- Use foreign keys for data integrity
- Implement proper error handling

::: tip
Use `SHOW ENGINE INNODB STATUS\G` to diagnose InnoDB performance issues.
:::
