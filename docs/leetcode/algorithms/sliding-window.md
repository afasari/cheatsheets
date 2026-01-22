# Sliding Window

Maintain a window of elements and slide through array/string.

## Overview

Sliding window technique uses two pointers to maintain a window of elements. The window size can be:
- **Fixed size** - Window has constant size K
- **Variable size** - Window grows/shrinks based on conditions

## When to Use

- Finding subarrays/substrings meeting conditions
- Longest/shortest with constraints
- Counting elements in range
- Optimizing with previous computation reuse

---

## Fixed Size Window

Maintain window of exact size K.

**Time Complexity:** O(n) | **Space Complexity:** O(1) or O(K)

<CodeTabs>

```go
// Maximum sum of subarray of size K
func maxSumSubarrayK(arr []int, k int) int {
    if len(arr) < k {
        return 0
    }
    
    windowSum := 0
    for i := 0; i < k; i++ {
        windowSum += arr[i]
    }
    maxSum := windowSum
    
    for i := k; i < len(arr); i++ {
        windowSum = windowSum - arr[i-k] + arr[i]
        maxSum = max(maxSum, windowSum)
    }
    
    return maxSum
}

// Count of negative numbers in each K-sized window
func countNegatives(arr []int, k int) []int {
    result := []int{}
    count := 0
    
    for i := 0; i < k; i++ {
        if arr[i] < 0 {
            count++
        }
    }
    result = append(result, count)
    
    for i := k; i < len(arr); i++ {
        if arr[i-k] < 0 {
            count--
        }
        if arr[i] < 0 {
            count++
        }
        result = append(result, count)
    }
    
    return result
}
```

```rust
// Maximum sum of subarray of size K
fn max_sum_subarray_k(arr: &[i32], k: usize) -> i32 {
    if arr.len() < k {
        return 0;
    }
    
    let mut window_sum: i32 = arr[0..k].iter().sum();
    let mut max_sum = window_sum;
    
    for i in k..arr.len() {
        window_sum = window_sum - arr[i - k] + arr[i];
        max_sum = max_sum.max(window_sum);
    }
    
    max_sum
}

// Count of negative numbers in each K-sized window
fn count_negatives(arr: &[i32], k: usize) -> Vec<i32> {
    let mut result = Vec::new();
    let mut count = 0;
    
    for i in 0..k {
        if arr[i] < 0 {
            count += 1;
        }
    }
    result.push(count);
    
    for i in k..arr.len() {
        if arr[i - k] < 0 {
            count -= 1;
        }
        if arr[i] < 0 {
            count += 1;
        }
        result.push(count);
    }
    
    result
}
```

```python
# Maximum sum of subarray of size K
def max_sum_subarray_k(arr, k):
    if len(arr) < k:
        return 0
    
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    for i in range(k, len(arr)):
        window_sum = window_sum - arr[i - k] + arr[i]
        max_sum = max(max_sum, window_sum)
    
    return max_sum

# Count of negative numbers in each K-sized window
def count_negatives(arr, k):
    result = []
    count = 0
    
    for i in range(k):
        if arr[i] < 0:
            count += 1
    result.append(count)
    
    for i in range(k, len(arr)):
        if arr[i - k] < 0:
            count -= 1
        if arr[i] < 0:
            count += 1
        result.append(count)
    
    return result
```

```javascript
// Maximum sum of subarray of size K
function maxSumSubarrayK(arr, k) {
    if (arr.length < k) {
        return 0;
    }
    
    let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0);
    let maxSum = windowSum;
    
    for (let i = k; i < arr.length; i++) {
        windowSum = windowSum - arr[i - k] + arr[i];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}

// Count of negative numbers in each K-sized window
function countNegatives(arr, k) {
    const result = [];
    let count = 0;
    
    for (let i = 0; i < k; i++) {
        if (arr[i] < 0) {
            count++;
        }
    }
    result.push(count);
    
    for (let i = k; i < arr.length; i++) {
        if (arr[i - k] < 0) {
            count--;
        }
        if (arr[i] < 0) {
            count++;
        }
        result.push(count);
    }
    
    return result;
}
```

</CodeTabs>

---

## Variable Size Window

Window grows/shrinks based on conditions.

**Time Complexity:** O(n) | **Space Complexity:** O(n) for hashmap, O(1) otherwise

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

// Smallest subarray with sum >= target
func minSubArrayLen(target int, nums []int) int {
    left := 0
    sum := 0
    minLen := len(nums) + 1
    
    for right := 0; right < len(nums); right++ {
        sum += nums[right]
        
        for sum >= target {
            if right - left + 1 < minLen {
                minLen = right - left + 1
            }
            sum -= nums[left]
            left++
        }
    }
    
    if minLen == len(nums) + 1 {
        return 0
    }
    return minLen
}
```

```rust
// Longest substring without repeating characters
use std::collections::HashMap;

fn length_of_longest_substring(s: &str) -> usize {
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

// Smallest subarray with sum >= target
fn min_sub_array_len(target: i32, nums: &[i32]) -> usize {
    let mut left = 0;
    let mut sum = 0;
    let mut min_len = nums.len() + 1;
    
    for (right, &num) in nums.iter().enumerate() {
        sum += num;
        
        while sum >= target {
            if right - left + 1 < min_len {
                min_len = right - left + 1;
            }
            sum -= nums[left];
            left += 1;
        }
    }
    
    if min_len == nums.len() + 1 {
        0
    } else {
        min_len
    }
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

# Smallest subarray with sum >= target
def min_sub_array_len(target, nums):
    left = 0
    window_sum = 0
    min_len = len(nums) + 1
    
    for right in range(len(nums)):
        window_sum += nums[right]
        
        while window_sum >= target:
            if right - left + 1 < min_len:
                min_len = right - left + 1
            window_sum -= nums[left]
            left += 1
    
    return 0 if min_len == len(nums) + 1 else min_len
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

// Smallest subarray with sum >= target
function minSubArrayLen(target, nums) {
    let left = 0, sum = 0;
    let minLen = nums.length + 1;
    
    for (let right = 0; right < nums.length; right++) {
        sum += nums[right];
        
        while (sum >= target) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
            }
            sum -= nums[left];
            left++;
        }
    }
    
    return minLen === nums.length + 1 ? 0 : minLen;
}
```

</CodeTabs>

---

## Longest Subarray with Condition

Find longest subarray where all elements meet condition.

**Time Complexity:** O(n) | **Space Complexity:** O(n)

<CodeTabs>

```go
// Longest subarray with ones after flipping K zeros
func longestOnes(nums []int, k int) int {
    left := 0
    zeroCount := 0
    maxLen := 0
    
    for right := 0; right < len(nums); right++ {
        if nums[right] == 0 {
            zeroCount++
        }
        
        for zeroCount > k {
            if nums[left] == 0 {
                zeroCount--
            }
            left++
        }
        
        if right - left + 1 > maxLen {
            maxLen = right - left + 1
        }
    }
    
    return maxLen
}
```

```rust
// Longest subarray with ones after flipping K zeros
fn longest_ones(nums: &[i32], k: i32) -> usize {
    let mut left = 0;
    let mut zero_count = 0;
    let mut max_len = 0;
    
    for (right, &num) in nums.iter().enumerate() {
        if num == 0 {
            zero_count += 1;
        }
        
        while zero_count > k {
            if nums[left] == 0 {
                zero_count -= 1;
            }
            left += 1;
        }
        
        max_len = max_len.max(right - left + 1);
    }
    
    max_len
}
```

```python
# Longest subarray with ones after flipping K zeros
def longest_ones(nums, k):
    left = 0
    zero_count = 0
    max_len = 0
    
    for right in range(len(nums)):
        if nums[right] == 0:
            zero_count += 1
        
        while zero_count > k:
            if nums[left] == 0:
                zero_count -= 1
            left += 1
        
        max_len = max(max_len, right - left + 1)
    
    return max_len
```

```javascript
// Longest subarray with ones after flipping K zeros
function longestOnes(nums, k) {
    let left = 0, zeroCount = 0, maxLen = 0;
    
    for (let right = 0; right < nums.length; right++) {
        if (nums[right] === 0) {
            zeroCount++;
        }
        
        while (zeroCount > k) {
            if (nums[left] === 0) {
                zeroCount--;
            }
            left++;
        }
        
        maxLen = Math.max(maxLen, right - left + 1);
    }
    
    return maxLen;
}
```

</CodeTabs>

---

## Common Patterns

| Pattern | Window Size | Use Case |
|---------|-------------|----------|
| Fixed size | Constant K | Maximum/minimum in each K-sized subarray |
| Variable size | Dynamic | Longest/shortest meeting conditions |
| With hashmap | Dynamic with uniqueness | Longest without repeating, longest with constraints |
| Left pointer moves | Shrinking | Find smallest with condition |

## Tips

1. **Start small** - Begin with fixed size, then adapt to variable
2. **Reuse computation** - Update window sum/count, don't recalculate
3. **Shrink properly** - Move left pointer until condition satisfied
4. **Handle edge cases** - Empty array, K larger than array
5. **Track best** - Keep track of best/longest/smallest found

## Common Mistakes

- Not updating window sum/count correctly when shrinking
- Forgetting to handle edge cases (empty, K > length)
- Using O(n) lookup instead of O(1) hashmap
- Not shrinking window when condition violated
- Not tracking maximum/minimum correctly