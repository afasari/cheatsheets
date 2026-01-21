# MongoDB

NoSQL document-oriented database.

## Connecting to MongoDB

| COMMAND | DESCRIPTION |
| --- | --- |
| `mongosh` | Connect to local MongoDB |
| `mongosh --host host --port port` | Connect to remote host |
| `mongosh -u username -p password` | Connect with authentication |
| `mongosh "mongodb://user:pass@host:port/db"` | Connect with connection string |
| `exit` | Exit MongoDB shell |
| `use database` | Switch database |
| `show dbs` | List all databases |
| `db` | Show current database |
| `show collections` | List collections in database |

## Database Operations

| COMMAND | DESCRIPTION |
| --- | --- |
| `use newdb` | Create/switch database |
| `db.dropDatabase()` | Delete current database |
| `db.stats()` | Get database statistics |
| `db.getCollectionNames()` | List all collections |

## Collection Operations

| COMMAND | DESCRIPTION |
| --- | --- |
| `db.createCollection('name')` | Create collection |
| `db.collection.drop()` | Drop collection |
| `db.collection.getIndexes()` | List indexes |
| `db.collection.stats()` | Collection statistics |

## CRUD Operations

### Insert

```javascript
// Insert single document
db.collection.insertOne({
  name: 'John Doe',
  age: 30,
  email: 'john@example.com'
})

// Insert multiple documents
db.collection.insertMany([
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
  { name: 'Bob', age: 35 }
])

// Insert with _id
db.collection.insertOne({
  _id: 1,
  name: 'Custom ID'
})
```

### Find

```javascript
// Find all documents
db.collection.find()

// Find with condition
db.collection.find({ name: 'John' })

// Find with multiple conditions
db.collection.find({
  name: 'John',
  age: { $gt: 25 }
})

// Find with operators
db.collection.find({
  age: { $gte: 18, $lte: 65 }
})

// Find with OR
db.collection.find({
  $or: [
    { name: 'John' },
    { age: { $gt: 30 } }
  ]
})

// Find with array
db.collection.find({
  tags: 'mongodb'
})

// Find with projection (specific fields)
db.collection.find(
  { age: { $gt: 25 } },
  { name: 1, age: 1, _id: 0 }
)

// Find one
db.collection.findOne({ name: 'John' })

// Find by _id
db.collection.findOne({ _id: ObjectId('...') })

// Count documents
db.collection.countDocuments({ age: { $gte: 18 } })

// Limit results
db.collection.find().limit(10)

// Skip results
db.collection.find().skip(5)

// Sort results
db.collection.find().sort({ age: 1 })
db.collection.find().sort({ age: -1, name: 1 })
```

### Update

```javascript
// Update one document
db.collection.updateOne(
  { name: 'John' },
  { $set: { age: 31 } }
)

// Update many documents
db.collection.updateMany(
  { age: { $lt: 18 } },
  { $set: { status: 'minor' } }
)

// Replace document
db.collection.replaceOne(
  { name: 'John' },
  { name: 'John Doe', age: 31 }
)

// Update operators
db.collection.updateOne(
  { name: 'John' },
  {
    $set: { status: 'active' },
    $inc: { age: 1 },
    $mul: { score: 2 },
    $rename: { name: 'fullName' },
    $unset: { temp: '' },
    $min: { balance: 100 },
    $max: { balance: 1000 }
)

// Update array
db.collection.updateOne(
  { name: 'John' },
  {
    $push: { tags: 'new-tag' },
    $pull: { tags: 'old-tag' },
    $addToSet: { tags: 'unique-tag' }
  }
)

// Find and update
db.collection.findOneAndUpdate(
  { name: 'John' },
  { $set: { status: 'updated' } },
  { returnDocument: 'after' }
)

// Upsert (update or insert)
db.collection.updateOne(
  { name: 'John' },
  { $set: { age: 30 } },
  { upsert: true }
)
```

### Delete

```javascript
// Delete one document
db.collection.deleteOne({ name: 'John' })

// Delete many documents
db.collection.deleteMany({ age: { $lt: 18 } })

// Delete all documents
db.collection.deleteMany({})

// Find and delete
db.collection.findOneAndDelete({ name: 'John' })
```

## Query Operators

### Comparison Operators

| OPERATOR | DESCRIPTION |
| --- | --- |
| `$eq` | Equal to |
| `$ne` | Not equal to |
| `$gt` | Greater than |
| `$gte` | Greater than or equal to |
| `$lt` | Less than |
| `$lte` | Less than or equal to |
| `$in` | In array |
| `$nin` | Not in array |

### Logical Operators

| OPERATOR | DESCRIPTION |
| --- | --- |
| `$and` | AND |
| `$or` | OR |
| `$not` | NOT |
| `$nor` | Neither |

### Element Operators

| OPERATOR | DESCRIPTION |
| --- | --- |
| `$exists` | Field exists |
| `$type` | Field type |

### Array Operators

| OPERATOR | DESCRIPTION |
| --- | --- |
| `$all` | Match all array elements |
| `$size` | Array size |
| `$elemMatch` | Match array elements |

## Aggregation

```javascript
// Basic aggregation
db.collection.aggregate([
  { $match: { age: { $gte: 18 } } },
  { $group: { _id: '$status', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])

// Aggregation stages
db.collection.aggregate([
  { $match: { status: 'active' } },  // Filter documents
  { $group: { _id: '$department', total: { $sum: '$salary' } } },  // Group
  { $sort: { total: -1 } },  // Sort
  { $limit: 10 },  // Limit results
  { $project: { _id: 0, department: 1, total: 1 } }  // Project fields
])

// Lookup (join)
db.orders.aggregate([
  {
    $lookup: {
      from: 'products',
      localField: 'product_id',
      foreignField: '_id',
      as: 'product_details'
    }
  }
])

// Unwind array
db.collection.aggregate([
  { $unwind: '$tags' },
  { $group: { _id: '$tags', count: { $sum: 1 } } }
])

// Facet (multiple aggregations)
db.collection.aggregate([
  {
    $facet: {
      'by_status': [{ $group: { _id: '$status', count: { $sum: 1 } } }],
      'by_age': [{ $group: { _id: '$age', count: { $sum: 1 } } }]
    }
  }
])
```

## Indexes

| COMMAND | DESCRIPTION |
| --- | --- |
| `db.collection.createIndex({ field: 1 })` | Create index |
| `db.collection.createIndex({ field: -1 })` | Create descending index |
| `db.collection.createIndex({ field: 1 }, { unique: true })` | Create unique index |
| `db.collection.createIndex({ field: 'text' })` | Create text index |
| `db.collection.createIndex({ field: 1 }, { sparse: true })` | Create sparse index |
| `db.collection.getIndexes()` | List indexes |
| `db.collection.dropIndex('name')` | Drop index |
| `db.collection.dropIndexes()` | Drop all indexes |

### Compound Index
```javascript
db.collection.createIndex({ name: 1, age: -1 })
```

### Multikey Index
```javascript
db.collection.createIndex({ tags: 1 })
```

## Users & Roles

| COMMAND | DESCRIPTION |
| --- | --- |
| `db.createUser({ user: 'name', pwd: 'pass', roles: ['readWrite'] })` | Create user |
| `db.dropUser('username')` | Drop user |
| `db.updateUser('username', { pwd: 'newpass' })` | Update user |
| `db.getUsers()` | List users |
| `db.getRoles()` | List roles |

## Backup & Restore

### Backup
```bash
# Dump all databases
mongodump --out /backup

# Dump specific database
mongodump --db mydb --out /backup

# Dump specific collection
mongodump --db mydb --collection mycollection --out /backup

# Dump with authentication
mongodump --username user --password pass --out /backup

# Compressed dump
mongodump --gzip --out /backup
```

### Restore
```bash
# Restore all databases
mongorestore /backup

# Restore specific database
mongorestore --db mydb /backup/mydb

# Restore specific collection
mongorestore --db mydb --collection mycoll /backup/mydb/mycoll.bson

# Restore with drop
mongorestore --drop /backup

# Restore compressed backup
mongorestore --gzip /backup
```

## Transactions

```javascript
// Start session
const session = db.getMongo().startSession()

try {
  // Start transaction
  session.startTransaction()

  // Perform operations
  db.collection1.insertOne({ ... }, { session })
  db.collection2.updateOne({ ... }, { session })

  // Commit transaction
  session.commitTransaction()
} catch (error) {
  // Abort transaction on error
  session.abortTransaction()
} finally {
  // End session
  session.endSession()
}
```

## Useful Queries

### Find duplicate documents
```javascript
db.collection.aggregate([
  {
    $group: {
      _id: '$email',
      count: { $sum: 1 },
      docs: { $push: '$_id' }
    }
  },
  { $match: { count: { $gt: 1 } } }
])
```

### Get collection size
```javascript
db.collection.stats().size
```

### Rename collection
```javascript
db.collection.renameCollection('new_name')
```

### Check if field exists
```javascript
db.collection.find({ field: { $exists: true } })
```

## Best Practices

- Use indexes for frequently queried fields
- Use appropriate data types for your data
- Use projection to limit returned fields
- Use aggregation pipelines for complex queries
- Regularly backup your databases
- Monitor query performance with explain()
- Use connection pooling in applications
- Use sharding for large datasets
- Implement proper authentication and authorization
- Use read preference for read-heavy workloads
- Regularly compact collections to reclaim space
- Use TTL indexes for expiring data

::: tip
Use `db.collection.explain('executionStats')` to analyze query performance.
:::
