# MongoDB Aggregation Cheatsheet

## Basic Aggregation

```javascript
// Simple aggregation
db.collection.aggregate([
  { $match: { status: "active" } },
  { $group: { _id: "$category", count: { $sum: 1 } } }
]);

// Multiple stages
db.collection.aggregate([
  { $match: { age: { $gte: 18 } } },
  { $sort: { name: 1 } },
  { $limit: 10 },
  { $project: { name: 1, age: 1, _id: 0 } }
]);
```

## $match (Filtering)

```javascript
// Simple match
db.users.aggregate([
  { $match: { age: { $gte: 25 } } }
]);

// Multiple conditions
db.orders.aggregate([
  { $match: { status: "completed", total: { $gt: 100 } } }
]);

// Date range
db.posts.aggregate([
  { $match: { createdAt: { $gte: ISODate("2024-01-01") } } }
]);

// Using expression
db.users.aggregate([
  { $match: { $expr: { $gt: ["$age", 18 } } }
]);
```

## $group (Aggregation)

```javascript
// Count by category
db.products.aggregate([
  { $group: { _id: "$category", count: { $sum: 1 } } }
]);

// Sum values
db.orders.aggregate([
  { $group: { _id: "$userId", totalSpent: { $sum: "$amount" } } }
]);

// Average
db.reviews.aggregate([
  { $group: { _id: "$productId", avgRating: { $avg: "$rating" } } }
]);

// Multiple aggregations
db.orders.aggregate([
  {
    $group: {
      _id: "$userId",
      totalOrders: { $sum: 1 },
      totalAmount: { $sum: "$amount" },
      avgAmount: { $avg: "$amount" },
      maxAmount: { $max: "$amount" },
      minAmount: { $min: "$amount" }
    }
  }
]);

// First and last
db.logs.aggregate([
  { $group: { _id: "$sessionId", firstEvent: { $first: "$event" } } }
]);
```

## $project (Field Selection)

```javascript
// Include/exclude fields
db.users.aggregate([
  { $project: { name: 1, email: 1, _id: 0 } }
]);

// Rename fields
db.users.aggregate([
  { $project: { fullName: "$name", emailAddress: "$email" } }
]);

// Add computed fields
db.users.aggregate([
  { $project: { name: 1, age: 1, isAdult: { $gte: ["$age", 18] } } }
]);

// Conditionals
db.products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      discountPrice: {
        $cond: {
          if: { $gt: ["$price", 100] },
          then: { $multiply: ["$price", 0.9] },
          else: "$price"
        }
      }
    }
  }
]);
```

## $sort (Ordering)

```javascript
// Sort by field
db.users.aggregate([
  { $sort: { name: 1 } }  // Ascending
]);

// Sort by multiple fields
db.orders.aggregate([
  { $sort: { createdAt: -1, status: 1 } }
]);

// Sort after group
db.orders.aggregate([
  { $group: { _id: "$userId", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } }
]);
```

## $limit / $skip (Pagination)

```javascript
// Pagination
db.posts.aggregate([
  { $sort: { createdAt: -1 } },
  { $skip: 20 },
  { $limit: 10 }
]);

// Top N
db.sales.aggregate([
  { $sort: { amount: -1 } },
  { $limit: 10 }
]);
```

## $unwind (Array Expansion)

```javascript
// Unwind array
db.users.aggregate([
  { $unwind: "$tags" }
]);

// Unwind with index
db.users.aggregate([
  { $unwind: { path: "$tags", includeArrayIndex: "tagIndex" } }
]);

// Preserve empty/null
db.users.aggregate([
  { $unwind: { path: "$tags", preserveNullAndEmptyArrays: true } }
]);

// Multiple arrays
db.orders.aggregate([
  { $unwind: "$items" },
  { $unwind: "$items.modifiers" }
]);
```

## $lookup (Joins)

```javascript
// Simple join
db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" }
]);

// Multiple matches
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      let: { productId: "$items.productId" },
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$productId"] } } }
      ],
      as: "productDetails"
    }
  }
]);

// Join on array field
db.posts.aggregate([
  {
    $lookup: {
      from: "comments",
      localField: "_id",
      foreignField: "postId",
      as: "comments"
    }
  }
]);
```

## $facet (Multiple Aggregations)

```javascript
// Multiple pipelines
db.products.aggregate([
  {
    $facet: {
      byCategory: [
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ],
      topSelling: [
        { $sort: { sales: -1 } },
        { $limit: 5 }
      ],
      totalValue: [
        { $group: { _id: null, total: { $sum: "$price" } } }
      ]
    }
  }
]);

// Pagination with total count
db.posts.aggregate([
  {
    $facet: {
      data: [
        { $sort: { createdAt: -1 } },
        { $skip: 20 },
        { $limit: 10 }
      ],
      totalCount: [
        { $count: "count" }
      ]
    }
  }
]);
```

## Array Operators

```javascript
// Array size
db.users.aggregate([
  { $project: { name: 1, tagsCount: { $size: "$tags" } } }
]);

// Array element at index
db.users.aggregate([
  { $project: { firstTag: { $arrayElemAt: ["$tags", 0] } } }
]);

// Array to string
db.users.aggregate([
  { $project: { name: 1, tagsStr: { $join: ["$tags", ", "] } } }
]);

// Filter array
db.users.aggregate([
  {
    $project: {
      name: 1,
      activeTags: {
        $filter: {
          input: "$tags",
          as: "tag",
          cond: { $eq: ["$$tag.active", true] }
        }
      }
    }
  }
]);

// Slice array
db.users.aggregate([
  { $project: { name: 1, recentPosts: { $slice: ["$posts", 5] } } }
]);

// Map array
db.orders.aggregate([
  {
    $project: {
      orderId: "$_id",
      itemNames: {
        $map: {
          input: "$items",
          as: "item",
          in: "$$item.name"
        }
      }
    }
  }
]);

// Reduce array
db.orders.aggregate([
  {
    $project: {
      orderId: "$_id",
      total: {
        $reduce: {
          input: "$items",
          initialValue: 0,
          in: { $add: ["$$value", "$$this.price"] }
        }
      }
    }
  }
]);
```

## String Operators

```javascript
// Concatenate
db.users.aggregate([
  { $project: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }
]);

// Substring
db.users.aggregate([
  { $project: { username: { $substr: ["$email", 0, { $indexOfCP: ["$email", "@"] }] } } }
]);

// To lower/upper case
db.users.aggregate([
  { $project: { email: { $toLower: "$email" } } }
]);

// Trim
db.users.aggregate([
  { $project: { name: { $trim: { input: "$name" } } } }
]);

// String length
db.users.aggregate([
  { $project: { nameLength: { $strLenCP: "$name" } } }
]);

// Split string
db.users.aggregate([
  { $project: { tags: { $split: ["$tags", ","] } } }
]);
```

## Date Operators

```javascript
// Extract date parts
db.posts.aggregate([
  {
    $project: {
      year: { $year: "$createdAt" },
      month: { $month: "$createdAt" },
      day: { $dayOfMonth: "$createdAt" },
      hour: { $hour: "$createdAt" }
    }
  }
]);

// Date difference
db.users.aggregate([
  {
    $project: {
      daysSinceSignup: {
        $divide: [
          { $subtract: [new Date(), "$signupDate"] },
          1000 * 60 * 60 * 24
        ]
      }
    }
  }
]);

// Date to string
db.posts.aggregate([
  {
    $project: {
      formattedDate: {
        $dateToString: {
          format: "%Y-%m-%d %H:%M",
          date: "$createdAt"
        }
      }
    }
  }
]);
```

## Conditional Operators

```javascript
// IF-THEN-ELSE
db.products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      status: {
        $cond: {
          if: { $lt: ["$stock", 10] },
          then: "low",
          else: "available"
        }
      }
    }
  }
]);

// CASE (switch)
db.products.aggregate([
  {
    $project: {
      name: 1,
      priceRange: {
        $switch: {
          branches: [
            { case: { $lt: ["$price", 10] }, then: "cheap" },
            { case: { $lt: ["$price", 50] }, then: "moderate" }
          ],
          default: "expensive"
        }
      }
    }
  }
]);

// Coalesce
db.users.aggregate([
  { $project: { displayName: { $ifNull: ["$nickname", "$name"] } } }
]);
```

## Math Operators

```javascript
// Arithmetic
db.products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      tax: { $multiply: ["$price", 0.08] },
      total: { $add: ["$price", { $multiply: ["$price", 0.08] }] }
    }
  }
]);

// Round
db.products.aggregate([
  { $project: { price: { $round: ["$price", 2] } } }
]);

// Absolute
db.transactions.aggregate([
  { $project: { amount: { $abs: "$amount" } } }
]);

// Modulo
db.items.aggregate([
  { $match: { $expr: { $eq: [{ $mod: ["$quantity", 10] }, 0] } } }
]);
```

## Set Operators

```javascript
// Remove duplicates
db.users.aggregate([
  { $project: { uniqueTags: { $setUnion: ["$tags", "$tags"] } } }
]);

// Set difference
db.users.aggregate([
  {
    $project: {
      newTags: {
        $setDifference: ["$tags", "$oldTags"]
      }
    }
  }
]);

// Set intersection
db.users.aggregate([
  {
    $project: {
      commonTags: {
        $setIntersection: ["$tags", "$otherTags"]
      }
    }
  }
]);

// Is subset
db.users.aggregate([
  {
    $project: {
      hasRequiredTags: {
        $setIsSubset: [["admin", "moderator"], "$tags"]
      }
    }
  }
]);
```

## Bucketing

```javascript
// Auto bucket
db.products.aggregate([
  {
    $bucketAuto: {
      groupBy: "$price",
      buckets: 5,
      output: {
        count: { $sum: 1 },
        avgPrice: { $avg: "$price" }
      }
    }
  }
]);

// Manual bucket
db.users.aggregate([
  {
    $bucket: {
      groupBy: "$age",
      boundaries: [0, 18, 25, 35, 50, 100],
      default: "Other",
      output: {
        count: { $sum: 1 }
      }
    }
  }
]);
```

## Accumulators

```javascript
// Push to array
db.orders.aggregate([
  {
    $group: {
      _id: "$userId",
      orderDates: { $push: "$createdAt" }
    }
  }
]);

// Push with expression
db.orders.aggregate([
  {
    $group: {
      _id: "$userId",
      orders: {
        $push: {
          orderId: "$_id",
          amount: "$amount",
          status: "$status"
        }
      }
    }
  }
]);

// Unique values
db.users.aggregate([
  { $group: { _id: null, uniqueEmails: { $addToSet: "$email" } } }
]);

// Merge objects
db.users.aggregate([
  {
    $group: {
      _id: "$userId",
      profile: { $mergeObjects: ["$profile", "$settings"] }
    }
  }
]);
```

## $redact (Document Filtering)

```javascript
// Filter based on permissions
db.documents.aggregate([
  {
    $redact: {
      $cond: {
        if: { $eq: ["$access", "public"] },
        then: "$$KEEP",
        else: "$$PRUNE"
      }
    }
  }
]);

// Nested filtering
db.documents.aggregate([
  {
    $redact: {
      $cond: {
        if: { $eq: ["$level", 1] },
        then: "$$DESCEND",
        else: "$$PRUNE"
      }
    }
  }
]);
```

## $sample (Random Sampling)

```javascript
// Random sample
db.users.aggregate([
  { $sample: { size: 10 } }
]);

// Sample with condition
db.products.aggregate([
  { $match: { category: "electronics" } },
  { $sample: { size: 5 } }
]);
```

## $graphLookup (Recursive Lookup)

```javascript
// Manager hierarchy
db.employees.aggregate([
  {
    $graphLookup: {
      from: "employees",
      startWith: "$reportsTo",
      connectFromField: "reportsTo",
      connectToField: "_id",
      as: "reportingChain"
    }
  }
]);

// Social graph (friends of friends)
db.users.aggregate([
  {
    $graphLookup: {
      from: "users",
      startWith: "$friends",
      connectFromField: "friends",
      connectToField: "_id",
      as: "friendNetwork"
    }
  }
]);
```

## Performance Tips

```javascript
// Use $match early
db.orders.aggregate([
  { $match: { status: "active" } },  // Filter first
  { $lookup: { from: "users", ... } }
]);

// Use indexes for $match and $sort
db.orders.createIndex({ status: 1, createdAt: -1 });

// Limit documents early
db.collection.aggregate([
  { $match: { status: "active" } },
  { $limit: 1000 },  // Reduce working set
  { $unwind: "$items" }
]);

// Use $facet for parallel aggregations
db.products.aggregate([
  {
    $facet: {
      categoryCount: [
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ],
      topSellers: [
        { $sort: { sales: -1 } },
        { $limit: 5 }
      ]
    }
  }
]);

// Avoid $unwind on large arrays when possible
db.users.aggregate([
  {
    $project: {
      name: 1,
      tagsCount: { $size: "$tags" }  // Instead of $unwind
    }
  }
]);

// Use $expr for complex queries
db.orders.aggregate([
  { $match: { $expr: { $gt: ["$total", "$minimum"] } } }
]);
```

## Common Patterns

### Sales Analytics
```javascript
db.sales.aggregate([
  { $match: { date: { $gte: ISODate("2024-01-01") } } },
  {
    $group: {
      _id: {
        year: { $year: "$date" },
        month: { $month: "$date" }
      },
      totalSales: { $sum: "$amount" },
      avgSale: { $avg: "$amount" },
      count: { $sum: 1 }
    }
  },
  { $sort: { "_id.year": 1, "_id.month": 1 } }
]);
```

### User Activity
```javascript
db.userActivities.aggregate([
  {
    $group: {
      _id: "$userId",
      lastActivity: { $max: "$timestamp" },
      totalActions: { $sum: 1 },
      actionTypes: { $addToSet: "$type" }
    }
  },
  {
    $project: {
      userId: "$_id",
      daysSinceLastActivity: {
        $divide: [
          { $subtract: [new Date(), "$lastActivity"] },
          1000 * 60 * 60 * 24
        ]
      },
      totalActions: 1,
      uniqueActionTypes: { $size: "$actionTypes" },
      _id: 0
    }
  }
]);
```

### Product Recommendations
```javascript
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.productId",
      buyers: { $addToSet: "$userId" }
    }
  },
  {
    $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "_id",
      as: "product"
    }
  },
  { $unwind: "$product" },
  { $sort: { "buyers": -1 } },
  { $limit: 10 }
]);
```
