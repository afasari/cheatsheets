# Array

Common array operations and patterns.

## Two Pointers: One Input, Opposite Ends

Use two pointers starting from opposite ends of an array. Useful for palindrome checks, two-sum with sorted arrays.

**Time Complexity:** O(n) | **Space Complexity:** O(1)

<CodeTabs>

```go
// Check if array is palindrome
func isPalindrome(s string) bool {
    left, right := 0, len(s)-1
    for left < right {
        if s[left] != s[right] {
            return false
        }
        left++
        right--
    }
    return true
}
```

```rust
// Check if array is palindrome
fn is_palindrome(s: &[char]) -> bool {
    let mut left = 0;
    let mut right = s.len() - 1;
    while left < right {
        if s[left] != s[right] {
            return false;
        }
        left += 1;
        right -= 1;
    }
    true
}
```

```python
# Check if array is palindrome
def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True
```

```javascript
// Check if array is palindrome
function isPalindrome(s) {
    let left = 0, right = s.length - 1;
    while (left < right) {
        if (s[left] !== s[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}
```

</CodeTabs>

**When to use:**
- Working with sorted arrays
- Finding pairs that sum to a target
- Checking palindromes
- Trapping rain water problems

---

## Two Pointers: Two Inputs, Exhaust Both

Use two pointers, one for each input array. Both pointers move to end.

**Time Complexity:** O(n + m) | **Space Complexity:** O(1)

<CodeTabs>

```go
// Merge two sorted arrays
func mergeSorted(arr1, arr2 []int) []int {
    result := []int{}
    i, j := 0, 0
    for i < len(arr1) && j < len(arr2) {
        if arr1[i] < arr2[j] {
            result = append(result, arr1[i])
            i++
        } else {
            result = append(result, arr2[j])
            j++
        }
    }
    // Append remaining elements
    result = append(result, arr1[i:]...)
    result = append(result, arr2[j:]...)
    return result
}
```

```rust
// Merge two sorted arrays
fn merge_sorted(arr1: &[i32], arr2: &[i32]) -> Vec<i32> {
    let mut result = Vec::new();
    let (mut i, mut j) = (0, 0);
    while i < arr1.len() && j < arr2.len() {
        if arr1[i] < arr2[j] {
            result.push(arr1[i]);
            i += 1;
        } else {
            result.push(arr2[j]);
            j += 1;
        }
    }
    // Append remaining elements
    result.extend_from_slice(&arr1[i..]);
    result.extend_from_slice(&arr2[j..]);
    result
}
```

```python
# Merge two sorted arrays
def merge_sorted(arr1, arr2):
    result = []
    i, j = 0, 0
    while i < len(arr1) and j < len(arr2):
        if arr1[i] < arr2[j]:
            result.append(arr1[i])
            i += 1
        else:
            result.append(arr2[j])
            j += 1
    # Append remaining elements
    result.extend(arr1[i:])
    result.extend(arr2[j:])
    return result
```

```javascript
// Merge two sorted arrays
function mergeSorted(arr1, arr2) {
    const result = [];
    let i = 0, j = 0;
    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] < arr2[j]) {
            result.push(arr1[i]);
            i++;
        } else {
            result.push(arr2[j]);
            j++;
        }
    }
    // Append remaining elements
    return [...result, ...arr1.slice(i), ...arr2.slice(j)];
}
```

</CodeTabs>

**When to use:**
- Merging sorted arrays/lists
- Finding intersection of two arrays
- Comparing two sequences

---

## Sliding Window: Fixed Size

Maintain a window of fixed size K, slide through array.

**Time Complexity:** O(n) | **Space Complexity:** O(K) or O(1)

<CodeTabs>

```go
// Maximum sum of any subarray of size k
func maxSumSubarray(arr []int, k int) int {
    windowSum := 0
    maxSum := 0
    // Calculate first window
    for i := 0; i < k; i++ {
        windowSum += arr[i]
    }
    maxSum = windowSum
    // Slide the window
    for i := k; i < len(arr); i++ {
        windowSum = windowSum - arr[i-k] + arr[i]
        maxSum = max(maxSum, windowSum)
    }
    return maxSum
}
```

```rust
// Maximum sum of any subarray of size k
fn max_sum_subarray(arr: &[i32], k: usize) -> i32 {
    let mut window_sum: i32 = arr[0..k].iter().sum();
    let mut max_sum = window_sum;
    for i in k..arr.len() {
        window_sum = window_sum - arr[i - k] + arr[i];
        max_sum = max_sum.max(window_sum);
    }
    max_sum
}
```

```python
# Maximum sum of any subarray of size k
def max_sum_subarray(arr, k):
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for i in range(k, len(arr)):
        window_sum = window_sum - arr[i - k] + arr[i]
        max_sum = max(max_sum, window_sum)
    return max_sum
```

```javascript
// Maximum sum of any subarray of size k
function maxSumSubarray(arr, k) {
    let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0);
    let maxSum = windowSum;
    for (let i = k; i < arr.length; i++) {
        windowSum = windowSum - arr[i - k] + arr[i];
        maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}
```

</CodeTabs>

**When to use:**
- Find maximum/minimum of subarrays of fixed size
- Count elements in windows
- Average of subarrays

---

## Sliding Window: Variable Size

Window size grows/shrinks based on conditions. Two pointers maintain window boundaries.

**Time Complexity:** O(n) | **Space Complexity:** O(1)

<CodeTabs>

```go
// Longest substring without repeating characters
func lengthOfLongestSubstring(s string) int {
    charIndex := make(map[rune]int)
    left := 0
    maxLen := 0
    for right, char := range s {
        if idx, found := charIndex[char]; found && idx >= left {
            left = idx + 1
        }
        charIndex[char] = right
        if right - left + 1 > maxLen {
            maxLen = right - left + 1
        }
    }
    return maxLen
}
```

```rust
// Longest substring without repeating characters
fn length_of_longest_substring(s: &str) -> usize {
    use std::collections::HashMap;
    let mut char_index: HashMap<char, usize> = HashMap::new();
    let mut left = 0;
    let mut max_len = 0;
    for (right, char) in s.chars().enumerate() {
        if let Some(&idx) = char_index.get(&char) {
            if idx >= left {
                left = idx + 1;
            }
        }
        char_index.insert(char, right);
        max_len = max_len.max(right - left + 1);
    }
    max_len
}
```

```python
# Longest substring without repeating characters
def length_of_longest_substring(s):
    char_index = {}
    left = 0
    max_len = 0
    for right, char in enumerate(s):
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        char_index[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len
```

```javascript
// Longest substring without repeating characters
function lengthOfLongestSubstring(s) {
    const charIndex = new Map();
    let left = 0, maxLen = 0;
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        if (charIndex.has(char) && charIndex.get(char) >= left) {
            left = charIndex.get(char) + 1;
        }
        charIndex.set(char, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
```

</CodeTabs>

**When to use:**
- Find longest/shortest substring meeting conditions
- Count subarrays with constraints
- Problems with conditions on window contents

---

## Prefix Sum

Precompute cumulative sums to answer range sum queries in O(1).

**Time Complexity:** Build O(n), Query O(1) | **Space Complexity:** O(n)

<CodeTabs>

```go
// Range sum queries using prefix sum
type PrefixSum struct {
    prefix []int
}

func NewPrefixSum(arr []int) *PrefixSum {
    prefix := make([]int, len(arr)+1)
    for i := 0; i < len(arr); i++ {
        prefix[i+1] = prefix[i] + arr[i]
    }
    return &PrefixSum{prefix}
}

func (ps *PrefixSum) RangeSum(left, right int) int {
    return ps.prefix[right+1] - ps.prefix[left]
}
```

```rust
// Range sum queries using prefix sum
struct PrefixSum {
    prefix: Vec<i32>,
}

impl PrefixSum {
    fn new(arr: &[i32]) -> Self {
        let mut prefix = vec![0];
        for &val in arr {
            prefix.push(prefix.last().unwrap() + val);
        }
        PrefixSum { prefix }
    }

    fn range_sum(&self, left: usize, right: usize) -> i32 {
        self.prefix[right + 1] - self.prefix[left]
    }
}
```

```python
# Range sum queries using prefix sum
class PrefixSum:
    def __init__(self, arr):
        self.prefix = [0]
        for val in arr:
            self.prefix.append(self.prefix[-1] + val)

    def range_sum(self, left, right):
        return self.prefix[right + 1] - self.prefix[left]
```

```javascript
// Range sum queries using prefix sum
class PrefixSum {
    constructor(arr) {
        this.prefix = [0];
        for (const val of arr) {
            this.prefix.push(this.prefix[this.prefix.length - 1] + val);
        }
    }

    rangeSum(left, right) {
        return this.prefix[right + 1] - this.prefix[left];
    }
}
```

</CodeTabs>

**When to use:**
- Multiple range sum queries on static array
- Finding subarrays with specific sum
- 2D range queries (2D prefix sum)

---

## String Building

Efficient string concatenation to avoid O(n²) complexity.

**Time Complexity:** O(n) | **Space Complexity:** O(n)

<CodeTabs>

```go
// Efficient string building using strings.Builder
func buildString(parts []string) string {
    var builder strings.Builder
    for _, part := range parts {
        builder.WriteString(part)
    }
    return builder.String()
}
```

```rust
// Efficient string building
fn build_string(parts: &[&str]) -> String {
    parts.join("")
}
```

```python
# Efficient string building using join
def build_string(parts):
    return "".join(parts)
```

```javascript
// Efficient string building using array and join
function buildString(parts) {
    return parts.join('');
}
```

</CodeTabs>

**When to use:**
- Concatenating many strings in a loop
- Building large strings from parts
- Avoid string concatenation in loops (O(n²) in many languages)

---

## Common Array Operations

| Operation | Go | Rust | Python | JS |
|-----------|----|----|----|-----|
| Get length | `len(arr)` | `arr.len()` | `len(arr)` | `arr.length` |
| Append | `append(arr, val)` | `arr.push(val)` | `arr.append(val)` | `arr.push(val)` |
| Remove last | `arr = arr[:len(arr)-1]` | `arr.pop()` | `arr.pop()` | `arr.pop()` |
| Slice | `arr[start:end]` | `&arr[start..end]` | `arr[start:end]` | `arr.slice(start, end)` |
| Sort | `sort.Ints(arr)` | `arr.sort()` | `arr.sort()` | `arr.sort()` |