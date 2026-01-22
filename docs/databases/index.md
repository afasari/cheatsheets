# Database Overview

Databases are fundamental to modern applications, storing and managing data efficiently. Choosing the right database depends on your data model, scalability needs, and query patterns.

## Database Categories

### Relational Databases (SQL)
Structured data with predefined schemas, supporting complex queries and transactions.

**Characteristics**:
- ACID transactions (Atomic, Consistent, Isolated, Durable)
- Structured Query Language (SQL)
- Fixed schema with data types and constraints
- Strong consistency

**Best For**:
- Financial transactions
- User authentication and profiles
- Inventory management
- Systems requiring complex relationships

### NoSQL Databases
Flexible schema design optimized for specific use cases.

**NoSQL Types**:
- **Document**: JSON-like documents (MongoDB, CouchDB)
- **Key-Value**: Simple key-value pairs (Redis, DynamoDB)
- **Column-Family**: Wide column stores (Cassandra, HBase)
- **Graph**: Relationship-focused (Neo4j, Amazon Neptune)

**Best For**:
- Rapid prototyping and evolving schemas
- Real-time big data applications
- Content management systems
- Social networks and recommendation engines

## Database Selection Guide

| Database | Type | When to Use | Scalability | Consistency |
|----------|------|-------------|-------------|-------------|
| **PostgreSQL** | Relational | Complex queries, transactions | Vertical scaling first, then read replicas | Strong |
| **MySQL** | Relational | Web applications, CMS | Read replicas, sharding | Strong |
| **SQLite** | Relational | Embedded, mobile, small apps | Single file only | Strong |
| **MongoDB** | Document | Flexible schema, rapid development | Horizontal sharding | Eventual |
| **Redis** | Key-Value | Caching, sessions, real-time | Horizontal clustering | Tunable |
| **Cassandra** | Column | High write throughput, time-series | Horizontal scaling | Tunable |

## Data Modeling

### Relational Modeling
**Normalization**: Organize data to minimize redundancy.

**Normalization Levels**:
- 1NF: Atomic values, no repeating groups
- 2NF: No partial dependencies
- 3NF: No transitive dependencies
- BCNF: Boyce-Codd normal form

**When to Normalize**:
- Data integrity is critical
- Write-heavy workloads
- Complex relationships

**When to Denormalize**:
- Read-heavy workloads
- Performance optimization
- Simpler queries

### Document Modeling
**Embedding vs Referencing**:

**Embed**: Store related data in single document
```json
{
  "user": {
    "name": "John",
    "address": { "street": "123 Main" }
  }
}
```
**Use When**: Data always accessed together, one-to-one relationships

**Reference**: Store separate documents with IDs
```json
{
  "order": {
    "user_id": "user123",
    "items": ["item1", "item2"]
  }
}
```
**Use When**: Data accessed independently, one-to-many relationships

## Scaling Strategies

### Vertical Scaling (Scale Up)
Add more resources (CPU, RAM, storage) to a single server.

**Pros**:
- Simple to implement
- No application changes needed
- Strong consistency maintained

**Cons**:
- Hardware limits
- Single point of failure
- Expensive at scale

### Horizontal Scaling (Scale Out)
Add more servers to distribute load.

**Read Replicas**:
- Master handles writes
- Replicas handle reads
- Eventual consistency

**Sharding**:
- Data partitioned across multiple servers
- Each shard handles subset of data
- Requires sharding key

**Pros**:
- Theoretically unlimited scaling
- Better fault tolerance
- Cost-effective

**Cons**:
- Complex to implement
- Distributed transactions challenging
- Cross-shard queries difficult

## Performance Optimization

### Indexing
Data structures that speed up data retrieval.

**Index Types**:
- **B-Tree**: Default for most databases, good for range queries
- **Hash**: Fast for exact matches
- **Full-text**: Text search capabilities
- **Composite**: Multiple columns

**When to Index**:
- Frequently queried columns
- Columns in WHERE, JOIN, ORDER BY clauses
- Foreign keys

**When NOT to Index**:
- Columns frequently updated (slow down writes)
- Tables with few rows
- Low-selectivity columns (many duplicates)

### Query Optimization
**Best Practices**:
- Use EXPLAIN/EXPLAIN ANALYZE to understand query plans
- Avoid SELECT *, only fetch needed columns
- Use LIMIT for large result sets
- Batch operations instead of loops
- Optimize JOINs by indexing join columns

### Caching
**Application-Level Caching**:
- Cache frequent queries in Redis
- Invalidate cache on data changes
- Consider cache expiration policies

**Database-Level Caching**:
- Query cache (MySQL)
- Buffer pool (PostgreSQL)
- Connection pooling

## Database Backup Strategies

### Backup Types
| Type | Description | Recovery Time | Storage |
|------|-------------|---------------|---------|
| **Full Backup** | Complete database backup | Fastest | Most |
| **Incremental** | Changes since last backup | Medium | Medium |
| **Differential** | Changes since last full backup | Medium | Less than incremental |

### Backup Considerations
- **Recovery Point Objective (RPO)**: Maximum data loss tolerated
- **Recovery Time Objective (RTO)**: Maximum downtime tolerated
- **Backup retention**: How long to keep backups
- **Off-site storage**: Store backups in different location

## Common Scenarios

### Scenario: E-commerce Application
**Database**: PostgreSQL with Redis cache
**Why**: ACID transactions for orders, Redis for session storage and product caching

### Scenario: Real-time Analytics
**Database**: MongoDB with aggregation pipeline
**Why**: Flexible schema for diverse event data, powerful aggregation for analytics

### Scenario: Content Management System
**Database**: PostgreSQL
**Why**: Strong consistency, complex queries for content relationships

### Scenario: Mobile Application Backend
**Database**: SQLite on device, PostgreSQL server
**Why**: Offline capability with sync to central database

## Further Reading

- [PostgreSQL](./postgresql) - Advanced PostgreSQL features and commands
- [PostgreSQL Internals](./postgresql-internals) - WAL, MVCC, storage engines
- [MySQL](./mysql) - MySQL administration and optimization
- [Redis](./redis) - Redis data structures and patterns
- [Redis Patterns](./redis-patterns) - Common Redis use cases
- [MongoDB](./mongodb) - MongoDB CRUD and aggregation
- [MongoDB Aggregation](./mongodb-aggregation) - Advanced data processing
- [SQLite](./sqlite) - SQLite for embedded applications
- [SQLite Optimization](./sqlite-optimization) - Performance tuning for SQLite
