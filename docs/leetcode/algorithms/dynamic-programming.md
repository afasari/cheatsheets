# Dynamic Programming

Solve complex problems by breaking them into overlapping subproblems.

## Overview

DP optimizes by storing results of subproblems to avoid redundant computation.

**Key Patterns:**
1. **Memoization (Top-Down)** - Recursion with cache
2. **Tabulation (Bottom-Up)** - Iterative with table
3. **Space Optimization** - O(n) space → O(1)

**When to use:**
- Optimal substructure (optimal solution includes optimal solutions to subproblems)
- Overlapping subproblems (same subproblems repeat)
- Choice at each step (make decision that leads to optimal solution)

---

## Fibonacci - Classic DP Example

Show both memoization and tabulation approaches.

**Time Complexity:** O(n) | **Space Complexity:** O(n) (can be O(1) optimized)

<CodeTabs>

```go
// Fibonacci - Memoization (Top-Down)
var memo []int

func fibMemo(n int) int {
    if n <= 1 {
        return n
    }
    if memo[n] != 0 {
        return memo[n]
    }
    memo[n] = fibMemo(n-1) + fibMemo(n-2)
    return memo[n]
}

func initFib(n int) {
    memo = make([]int, n+1)
}

// Fibonacci - Tabulation (Bottom-Up)
func fibTab(n int) int {
    if n <= 1 {
        return n
    }
    
    dp := make([]int, n+1)
    dp[0], dp[1] = 0, 1
    
    for i := 2; i <= n; i++ {
        dp[i] = dp[i-1] + dp[i-2]
    }
    
    return dp[n]
}

// Fibonacci - Space Optimized
func fibOptimized(n int) int {
    if n <= 1 {
        return n
    }
    
    prev2, prev1 := 0, 1
    
    for i := 2; i <= n; i++ {
        curr := prev1 + prev2
        prev2 = prev1
        prev1 = curr
    }
    
    return prev1
}
```

```rust
// Fibonacci - Memoization (Top-Down)
use std::collections::HashMap;

fn fib_memo(n: usize) -> usize {
    let mut memo: HashMap<usize, usize> = HashMap::new();
    fib_memo_helper(n, &mut memo)
}

fn fib_memo_helper(n: usize, memo: &mut HashMap<usize, usize>) -> usize {
    if n <= 1 {
        return n;
    }
    
    if let Some(&val) = memo.get(&n) {
        return val;
    }
    
    let result = fib_memo_helper(n - 1, memo) + fib_memo_helper(n - 2, memo);
    memo.insert(n, result);
    result
}

// Fibonacci - Tabulation (Bottom-Up)
fn fib_tab(n: usize) -> usize {
    if n <= 1 {
        return n;
    }
    
    let mut dp = vec![0; n + 1];
    dp[0] = 0;
    dp[1] = 1;
    
    for i in 2..=n {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    dp[n]
}

// Fibonacci - Space Optimized
fn fib_optimized(n: usize) -> usize {
    if n <= 1 {
        return n;
    }
    
    let (mut prev2, mut prev1) = (0, 1);
    
    for _ in 2..=n {
        let curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    
    prev1
}
```

```python
# Fibonacci - Memoization (Top-Down)
from functools import lru_cache

@lru_cache(maxsize=None)
def fib_memo(n):
    if n <= 1:
        return n
    return fib_memo(n-1) + fib_memo(n-2)

# Fibonacci - Tabulation (Bottom-Up)
def fib_tab(n):
    if n <= 1:
        return n
    
    dp = [0] * (n + 1)
    dp[0], dp[1] = 0, 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]

# Fibonacci - Space Optimized
def fib_optimized(n):
    if n <= 1:
        return n
    
    prev2, prev1 = 0, 1
    
    for _ in range(2, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
    
    return prev1
```

```javascript
// Fibonacci - Memoization (Top-Down)
function fibMemo(n, memo = {}) {
    if (n <= 1) {
        return n;
    }
    
    if (memo[n] !== undefined) {
        return memo[n];
    }
    
    memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
    return memo[n];
}

// Fibonacci - Tabulation (Bottom-Up)
function fibTab(n) {
    if (n <= 1) {
        return n;
    }
    
    const dp = new Array(n + 1).fill(0);
    dp[0] = 0;
    dp[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

// Fibonacci - Space Optimized
function fibOptimized(n) {
    if (n <= 1) {
        return n;
    }
    
    let prev2 = 0, prev1 = 1;
    
    for (let i = 2; i <= n; i++) {
        const curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}
```

</CodeTabs>

---

## Climbing Stairs

Each step can take 1 or 2 steps. How many ways to reach top?

**Time Complexity:** O(n) | **Space Complexity:** O(n) or O(1)

<CodeTabs>

```go
// Climbing stairs - Memoization
var climbMemo []int

func climbStairsMemo(n int) int {
    if n <= 2 {
        return n
    }
    if climbMemo[n] != 0 {
        return climbMemo[n]
    }
    climbMemo[n] = climbStairsMemo(n-1) + climbStairsMemo(n-2)
    return climbMemo[n]
}

// Climbing stairs - Tabulation
func climbStairsTab(n int) int {
    if n <= 2 {
        return n
    }
    
    dp := make([]int, n+1)
    dp[0], dp[1], dp[2] = 1, 1, 2
    
    for i := 3; i <= n; i++ {
        dp[i] = dp[i-1] + dp[i-2]
    }
    
    return dp[n]
}

// Climbing stairs - Space Optimized
func climbStairsOptimized(n int) int {
    if n <= 2 {
        return n
    }
    
    prev2, prev1 := 1, 2
    
    for i := 3; i <= n; i++ {
        curr := prev1 + prev2
        prev2 = prev1
        prev1 = curr
    }
    
    return prev1
}
```

```rust
// Climbing stairs - Tabulation
fn climb_stairs_tab(n: usize) -> usize {
    if n <= 2 {
        return n;
    }
    
    let mut dp = vec![0; n + 1];
    dp[0] = 1;
    dp[1] = 1;
    
    for i in 2..=n {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    dp[n]
}

// Climbing stairs - Space Optimized
fn climb_stairs_optimized(n: usize) -> usize {
    if n <= 2 {
        return n;
    }
    
    let (mut prev2, mut prev1) = (1, 1);
    
    for _ in 2..=n {
        let curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    
    prev1
}
```

```python
# Climbing stairs - Memoization
from functools import lru_cache

@lru_cache(maxsize=None)
def climb_stairs_memo(n):
    if n <= 2:
        return n
    return climb_stairs_memo(n-1) + climb_stairs_memo(n-2)

# Climbing stairs - Tabulation
def climb_stairs_tab(n):
    if n <= 2:
        return n
    
    dp = [0] * (n + 1)
    dp[0], dp[1] = 1, 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]

# Climbing stairs - Space Optimized
def climb_stairs_optimized(n):
    if n <= 2:
        return n
    
    prev2, prev1 = 1, 1
    
    for _ in range(2, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
    
    return prev1
```

```javascript
// Climbing stairs - Memoization
function climbStairsMemo(n, memo = {}) {
    if (n <= 2) {
        return n;
    }
    
    if (memo[n] !== undefined) {
        return memo[n];
    }
    
    memo[n] = climbStairsMemo(n - 1, memo) + climbStairsMemo(n - 2, memo);
    return memo[n];
}

// Climbing stairs - Tabulation
function climbStairsTab(n) {
    if (n <= 2) {
        return n;
    }
    
    const dp = new Array(n + 1).fill(0);
    dp[0] = 1;
    dp[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

// Climbing stairs - Space Optimized
function climbStairsOptimized(n) {
    if (n <= 2) {
        return n;
    }
    
    let prev2 = 1, prev1 = 1;
    
    for (let i = 2; i <= n; i++) {
        const curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}
```

</CodeTabs>

---

## Coin Change - Minimum Coins

Find minimum number of coins to make amount.

**Time Complexity:** O(amount * coins) | **Space Complexity:** O(amount)

<CodeTabs>

```go
// Coin change - Tabulation
func coinChange(coins []int, amount int) int {
    if amount == 0 {
        return 0
    }
    
    dp := make([]int, amount+1)
    for i := range dp {
        dp[i] = amount + 1 // Infinity
    }
    dp[0] = 0
    
    for i := 1; i <= amount; i++ {
        for _, coin := range coins {
            if i >= coin {
                dp[i] = min(dp[i], dp[i-coin]+1)
            }
        }
    }
    
    if dp[amount] > amount {
        return -1
    }
    return dp[amount]
}
```

```rust
// Coin change - Tabulation
fn coin_change(coins: &[i32], amount: usize) -> i32 {
    if amount == 0 {
        return 0;
    }
    
    let inf = amount as i32 + 1;
    let mut dp = vec![inf; amount + 1];
    dp[0] = 0;
    
    for i in 1..=amount {
        for &coin in coins {
            let c = coin as usize;
            if i >= c {
                dp[i] = dp[i].min(dp[i - c] + 1);
            }
        }
    }
    
    if dp[amount] > amount as i32 {
        -1
    } else {
        dp[amount]
    }
}
```

```python
# Coin change - Tabulation
def coin_change(coins, amount):
    if amount == 0:
        return 0
    
    dp = [amount + 1] * (amount + 1)  # Infinity
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if i >= coin:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return -1 if dp[amount] > amount else dp[amount]
```

```javascript
// Coin change - Tabulation
function coinChange(coins, amount) {
    if (amount === 0) {
        return 0;
    }
    
    const inf = amount + 1;
    const dp = new Array(amount + 1).fill(inf);
    dp[0] = 0;
    
    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            if (i >= coin) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    return dp[amount] > amount ? -1 : dp[amount];
}
```

</CodeTabs>

---

## Longest Increasing Subsequence

Find length of longest strictly increasing subsequence.

**Time Complexity:** O(n²) | **Space Complexity:** O(n)

<CodeTabs>

```go
// LIS - DP O(n^2)
func lengthOfLIS(nums []int) int {
    if len(nums) == 0 {
        return 0
    }
    
    dp := make([]int, len(nums))
    maxLen := 1
    
    for i := 0; i < len(nums); i++ {
        dp[i] = 1
        for j := 0; j < i; j++ {
            if nums[j] < nums[i] {
                dp[i] = max(dp[i], dp[j]+1)
            }
        }
        maxLen = max(maxLen, dp[i])
    }
    
    return maxLen
}
```

```rust
// LIS - DP O(n^2)
fn length_of_lis(nums: &[i32]) -> usize {
    if nums.is_empty() {
        return 0;
    }
    
    let mut dp = vec![1; nums.len()];
    let mut max_len = 1;
    
    for i in 0..nums.len() {
        for j in 0..i {
            if nums[j] < nums[i] {
                dp[i] = dp[i].max(dp[j] + 1);
            }
        }
        max_len = max_len.max(dp[i]);
    }
    
    max_len
}
```

```python
# LIS - DP O(n^2)
def length_of_lis(nums):
    if not nums:
        return 0
    
    dp = [1] * len(nums)
    max_len = 1
    
    for i in range(len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
        max_len = max(max_len, dp[i])
    
    return max_len
```

```javascript
// LIS - DP O(n^2)
function lengthOfLIS(nums) {
    if (nums.length === 0) {
        return 0;
    }
    
    const dp = new Array(nums.length).fill(1);
    let maxLen = 1;
    
    for (let i = 0; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        maxLen = Math.max(maxLen, dp[i]);
    }
    
    return maxLen;
}
```

</CodeTabs>

---

## 0/1 Knapsack Problem

Maximize value with weight constraint, each item can be used at most once.

**Time Complexity:** O(n * W) | **Space Complexity:** O(n * W)

<CodeTabs>

```go
// 0/1 Knapsack - Tabulation
func knapSack(weights []int, values []int, capacity int) int {
    n := len(weights)
    dp := make([][]int, n+1)
    for i := range dp {
        dp[i] = make([]int, capacity+1)
    }
    
    for i := 1; i <= n; i++ {
        for w := 0; w <= capacity; w++ {
            if weights[i-1] <= w {
                dp[i][w] = max(
                    dp[i-1][w],
                    dp[i-1][w-weights[i-1]] + values[i-1],
                )
            } else {
                dp[i][w] = dp[i-1][w]
            }
        }
    }
    
    return dp[n][capacity]
}
```

```rust
// 0/1 Knapsack - Tabulation
fn knap_sack(weights: &[i32], values: &[i32], capacity: usize) -> i32 {
    let n = weights.len();
    let mut dp = vec![vec![0; capacity + 1]; n + 1];
    
    for i in 1..=n {
        for w in 0..=capacity {
            if weights[i - 1] as usize <= w {
                dp[i][w] = dp[i - 1][w].max(
                    dp[i - 1][w - weights[i - 1] as usize] + values[i - 1],
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    
    dp[n][capacity]
}
```

```python
# 0/1 Knapsack - Tabulation
def knap_sack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(
                    dp[i-1][w],
                    dp[i-1][w - weights[i-1]] + values[i-1]
                )
            else:
                dp[i][w] = dp[i-1][w]
    
    return dp[n][capacity]
```

```javascript
// 0/1 Knapsack - Tabulation
function knapSack(weights, values, capacity) {
    const n = weights.length;
    const dp = new Array(n + 1).fill(null).map(() => new Array(capacity + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(
                    dp[i - 1][w],
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    
    return dp[n][capacity];
}
```

</CodeTabs>

---

## Common Patterns

| Pattern | Description | Use Case |
|---------|-------------|----------|
| Memoization | Top-down recursion with cache | Tree DP, recursion with overlap |
| Tabulation | Bottom-up iterative | Linear DP, space optimization |
| 1D DP | Single array | Fibonacci, climbing stairs |
| 2D DP | 2D table/matrix | LCS, knapsack, edit distance |
| Space Opt | Use only needed states | Fibonacci, climbing stairs |

## DP Framework

1. **Define State** - What does dp[i] represent?
2. **Find Recurrence** - How to build dp[i] from previous states?
3. **Base Cases** - What are initial values?
4. **Compute Order** - Fill table in correct order
5. **Return Answer** - Usually dp[n] or dp[n][m]

## Common Mistakes

- Wrong state definition
- Incorrect recurrence relation
- Forgetting base cases
- Wrong iteration order
- Off-by-one errors in array indexing
- Not handling edge cases (empty array, zero target)