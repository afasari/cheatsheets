# Big O Complexity

Reference table for common data structures and algorithms.

## Data Structures

| Data Structure | Access | Search | Insert | Delete | Space |
|--------------|--------|--------|--------|--------|-------|
| Array | O(1) | O(n) | O(n) | O(n) | O(n) |
| HashMap | O(1)* | O(1)* | O(1)* | O(1)* | O(n) |
| Linked List | O(n) | O(n) | O(1) | O(1) | O(n) |
| Stack | O(n) | O(n) | O(1) | O(1) | O(n) |
| Queue | O(n) | O(n) | O(1) | O(1) | O(n) |

*Average case, worst case O(n)

## Algorithms

| Algorithm | Best | Average | Worst | Space |
|-----------|-------|---------|-------|-------|
| Binary Search | O(1) | O(log n) | O(log n) | O(1) |
| Linear Search | O(1) | O(n) | O(n) | O(1) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |
| BFS/DFS | O(V+E) | O(V+E) | O(V+E) | O(V) |

**Legend:**
- n = number of elements
- V = vertices
- E = edges

## Big O Common Patterns

| Pattern | Example | Complexity |
|---------|----------|-----------|
| Constant | Access array element | O(1) |
| Logarithmic | Binary search | O(log n) |
| Linear | Simple loop | O(n) |
| Linearithmic | Merge sort | O(n log n) |
| Quadratic | Nested loops | O(n²) |
| Exponential | Recursive Fibonacci | O(2ⁿ) |

## Time vs Space Tradeoff

- **Time complexity**: How fast algorithm runs as input grows
- **Space complexity**: How much memory algorithm uses as input grows
- Often you can trade space for time (e.g., memoization) or time for space

When optimizing, consider both based on constraints given in the problem.