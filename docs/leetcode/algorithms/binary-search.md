# Binary Search

Efficiently find elements in sorted array by repeatedly dividing search space in half.

## Overview

Binary search works on **sorted** arrays. It compares target with middle element, then discards half of the array.

**Key Requirements:**
- Array/list must be sorted
- Can be iterative or recursive

**Time Complexity:** O(log n) | **Space Complexity:** O(1) iterative, O(log n) recursive

## When to Use

- Searching in sorted arrays
- Finding first/last occurrence in sorted array
- Finding element close to target in sorted array
- Binary search on answer (range queries)

---

## Standard Binary Search

Find target in sorted array, return index or -1.

**Time Complexity:** O(log n) | **Space Complexity:** O(1)

<CodeTabs>

```go
// Binary search - return index of target
func binarySearch(nums []int, target int) int {
    left, right := 0, len(nums)-1
    
    for left <= right {
        mid := left + (right-left)/2
        
        if nums[mid] == target {
            return mid
        } else if nums[mid] < target {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    
    return -1
}

// Binary search with recursion
func binarySearchRecursive(nums []int, target, left, right int) int {
    if left > right {
        return -1
    }
    
    mid := left + (right-left)/2
    
    if nums[mid] == target {
        return mid
    } else if nums[mid] < target {
        return binarySearchRecursive(nums, target, mid+1, right)
    } else {
        return binarySearchRecursive(nums, target, left, mid-1)
    }
}
```

```rust
// Binary search - return index of target
fn binary_search(nums: &[i32], target: i32) -> Option {
    let mut left = 0;
    let mut right = nums.len() - 1;
    
    while left <= right {
        let mid = left + (right - left) / 2;
        
        if nums[mid] == target {
            return Some(mid);
        } else if nums[mid] < target {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    None
}

// Binary search with recursion
fn binary_search_recursive(nums: &[i32], target: i32, left: usize, right: i32) -> Option {
    if left > right as usize {
        return None;
    }
    
    let mid = left + (right - left as usize) / 2;
    
    if nums[mid] == target {
        Some(mid)
    } else if nums[mid] < target {
        binary_search_recursive(nums, target, mid + 1, right)
    } else {
        binary_search_recursive(nums, target, left, mid as i32 - 1)
    }
}
```

```python
# Binary search - return index of target
def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Binary search with recursion
def binary_search_recursive(nums, target, left=0, right=None):
    if right is None:
        right = len(nums) - 1
    
    if left > right:
        return -1
    
    mid = left + (right - left) // 2
    
    if nums[mid] == target:
        return mid
    elif nums[mid] < target:
        return binary_search_recursive(nums, target, mid + 1, right)
    else:
        return binary_search_recursive(nums, target, left, mid - 1)
```

```javascript
// Binary search - return index of target
function binarySearch(nums, target) {
    let left = 0, right = nums.length - 1;
    
    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        
        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}

// Binary search with recursion
function binarySearchRecursive(nums, target, left = 0, right = nums.length - 1) {
    if (left > right) {
        return -1;
    }
    
    const mid = left + Math.floor((right - left) / 2);
    
    if (nums[mid] === target) {
        return mid;
    } else if (nums[mid] < target) {
        return binarySearchRecursive(nums, target, mid + 1, right);
    } else {
        return binarySearchRecursive(nums, target, left, mid - 1);
    }
}
```

</CodeTabs>

---

## Lower Bound / First Occurrence

Find first position where element >= target.

**Time Complexity:** O(log n) | **Space Complexity:** O(1)

<CodeTabs>

```go
// Lower bound - first element >= target
func lowerBound(nums []int, target int) int {
    left, right := 0, len(nums)
    
    for left < right {
        mid := left + (right-left)/2
        if nums[mid] < target {
            left = mid + 1
        } else {
            right = mid
        }
    }
    
    return left
}

// First occurrence of target
func firstOccurrence(nums []int, target int) int {
    idx := lowerBound(nums, target)
    if idx < len(nums) && nums[idx] == target {
        return idx
    }
    return -1
}
```

```rust
// Lower bound - first element >= target
fn lower_bound(nums: &[i32], target: i32) -> usize {
    let mut left = 0;
    let mut right = nums.len();
    
    while left < right {
        let mid = left + (right - left) / 2;
        if nums[mid] < target {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    
    left
}

// First occurrence of target
fn first_occurrence(nums: &[i32], target: i32) -> Option {
    let idx = lower_bound(nums, target);
    if idx < nums.len() && nums[idx] == target {
        Some(idx)
    } else {
        None
    }
}
```

```python
# Lower bound - first element >= target
def lower_bound(nums, target):
    left, right = 0, len(nums)
    
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid
    
    return left

# First occurrence of target
def first_occurrence(nums, target):
    idx = lower_bound(nums, target)
    if idx < len(nums) and nums[idx] == target:
        return idx
    return -1
```

```javascript
// Lower bound - first element >= target
function lowerBound(nums, target) {
    let left = 0, right = nums.length;
    
    while (left < right) {
        const mid = left + Math.floor((right - left) / 2);
        if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    
    return left;
}

// First occurrence of target
function firstOccurrence(nums, target) {
    const idx = lowerBound(nums, target);
    if (idx < nums.length && nums[idx] === target) {
        return idx;
    }
    return -1;
}
```

</CodeTabs>

---

## Upper Bound / Last Occurrence

Find first position where element > target.

**Time Complexity:** O(log n) | **Space Complexity:** O(1)

<CodeTabs>

```go
// Upper bound - first element > target
func upperBound(nums []int, target int) int {
    left, right := 0, len(nums)
    
    for left < right {
        mid := left + (right-left)/2
        if nums[mid] <= target {
            left = mid + 1
        } else {
            right = mid
        }
    }
    
    return left
}

// Last occurrence of target
func lastOccurrence(nums []int, target int) int {
    idx := upperBound(nums, target) - 1
    if idx >= 0 && nums[idx] == target {
        return idx
    }
    return -1
}
```

```rust
// Upper bound - first element > target
fn upper_bound(nums: &[i32], target: i32) -> usize {
    let mut left = 0;
    let mut right = nums.len();
    
    while left < right {
        let mid = left + (right - left) / 2;
        if nums[mid] <= target {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    
    left
}

// Last occurrence of target
fn last_occurrence(nums: &[i32], target: i32) -> Option {
    let idx = upper_bound(nums, target).saturating_sub(1);
    if nums.get(idx) == Some(&target) {
        Some(idx)
    } else {
        None
    }
}
```

```python
# Upper bound - first element > target
def upper_bound(nums, target):
    left, right = 0, len(nums)
    
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] <= target:
            left = mid + 1
        else:
            right = mid
    
    return left

# Last occurrence of target
def last_occurrence(nums, target):
    idx = upper_bound(nums, target) - 1
    if idx >= 0 and nums[idx] == target:
        return idx
    return -1
```

```javascript
// Upper bound - first element > target
function upperBound(nums, target) {
    let left = 0, right = nums.length;
    
    while (left < right) {
        const mid = left + Math.floor((right - left) / 2);
        if (nums[mid] <= target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    
    return left;
}

// Last occurrence of target
function lastOccurrence(nums, target) {
    const idx = upperBound(nums, target) - 1;
    if (idx >= 0 && nums[idx] === target) {
        return idx;
    }
    return -1;
}
```

</CodeTabs>

---

## Binary Search on Rotated Sorted Array

Find element in sorted array rotated at some pivot.

**Time Complexity:** O(log n) | **Space Complexity:** O(1)

<CodeTabs>

```go
// Search in rotated sorted array
func searchRotated(nums []int, target int) int {
    left, right := 0, len(nums)-1
    
    for left <= right {
        mid := left + (right-left)/2
        
        if nums[mid] == target {
            return mid
        }
        
        // Left half is sorted
        if nums[left] <= nums[mid] {
            if nums[left] <= target && target < nums[mid] {
                right = mid - 1
            } else {
                left = mid + 1
            }
        } else {
            // Right half is sorted
            if nums[mid] < target && target <= nums[right] {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }
    }
    
    return -1
}
```

```rust
// Search in rotated sorted array
fn search_rotated(nums: &[i32], target: i32) -> Option {
    let mut left = 0;
    let mut right = nums.len() - 1;
    
    while left <= right {
        let mid = left + (right - left) / 2;
        
        if nums[mid] == target {
            return Some(mid);
        }
        
        // Left half is sorted
        if nums[left] <= nums[mid] {
            if nums[left] <= target && target < nums[mid] {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            // Right half is sorted
            if nums[mid] < target && target <= nums[right] {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    
    None
}
```

```python
# Search in rotated sorted array
def search_rotated(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return mid
        
        # Left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            # Right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    
    return -1
```

```javascript
// Search in rotated sorted array
function searchRotated(nums, target) {
    let left = 0, right = nums.length - 1;
    
    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        
        if (nums[mid] === target) {
            return mid;
        }
        
        // Left half is sorted
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            // Right half is sorted
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    
    return -1;
}
```

</CodeTabs>

---

## Binary Search on Answer

Use binary search to find answer in a range.

**Time Complexity:** O(log(max_val) * check_time) | **Space Complexity:** O(1)

<CodeTabs>

```go
// Find minimum number of pages to allocate
func allocateBooks(pages []int, m int) int {
    if m > len(pages) {
        return 0
    }
    
    low, high := pages[0], 0
    for _, page := range pages {
        high += page
        if page > low {
            low = page
        }
    }
    
    for low < high {
        mid := low + (high-low)/2
        if canAllocate(pages, m, mid) {
            high = mid
        } else {
            low = mid + 1
        }
    }
    
    return low
}

func canAllocate(pages []int, m, limit int) bool {
    required := 1
    current := 0
    
    for _, page := range pages {
        if current + page > limit {
            required++
            current = page
        } else {
            current += page
        }
        
        if required > m {
            return false
        }
    }
    
    return true
}
```

```rust
// Find minimum number of pages to allocate
fn allocate_books(pages: &[i32], m: usize) -> usize {
    if m > pages.len() {
        return 0;
    }
    
    let low = *pages.iter().max().unwrap();
    let high: usize = pages.iter().sum();
    
    let mut left = low;
    let mut right = high;
    
    while left < right {
        let mid = left + (right - left) / 2;
        if can_allocate(pages, m, mid) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    
    left
}

fn can_allocate(pages: &[i32], m: usize, limit: usize) -> bool {
    let mut required = 1;
    let mut current = 0;
    
    for &page in pages {
        if current + page > limit {
            required += 1;
            current = page;
        } else {
            current += page;
        }
        
        if required > m {
            return false;
        }
    }
    
    true
}
```

```python
# Find minimum number of pages to allocate
def allocate_books(pages, m):
    if m > len(pages):
        return 0
    
    low, high = max(pages), sum(pages)
    
    while low < high:
        mid = (low + high) // 2
        if can_allocate(pages, m, mid):
            high = mid
        else:
            low = mid + 1
    
    return low

def can_allocate(pages, m, limit):
    required = 1
    current = 0
    
    for page in pages:
        if current + page > limit:
            required += 1
            current = page
        else:
            current += page
        
        if required > m:
            return False
    
    return True
```

```javascript
// Find minimum number of pages to allocate
function allocateBooks(pages, m) {
    if (m > pages.length) {
        return 0;
    }
    
    const low = Math.max(...pages);
    const high = pages.reduce((a, b) => a + b, 0);
    
    let left = low, right = high;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (canAllocate(pages, m, mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    
    return left;
}

function canAllocate(pages, m, limit) {
    let required = 1, current = 0;
    
    for (const page of pages) {
        if (current + page > limit) {
            required++;
            current = page;
        } else {
            current += page;
        }
        
        if (required > m) {
            return false;
        }
    }
    
    return true;
}
```

</CodeTabs>

---

## Common Patterns

| Pattern | Use Case | Example |
|---------|----------|---------|
| Standard search | Find exact element | Binary search |
| Lower bound | First >= element | Insert position |
| Upper bound | First > element | Insert after duplicates |
| Rotated array | Search in rotated sorted | Search rotated |
| On answer | Find in range | Allocate books |
| Count range | Count elements in [L, R] | upper(R) - lower(L) |

## Tips

1. **Mid calculation** - Use `left + (right-left)/2` to avoid overflow
2. **Loop condition** - `left <= right` for inclusive, `left < right` for exclusive
3. **Off-by-one** - Careful with +/- 1 in boundaries
4. **Infinite loop** - Ensure mid moves towards boundaries
5. **Sorted requirement** - Only works on sorted data

## Common Mistakes

- Using `mid = (left + right) / 2` - overflow risk
- Off-by-one errors in boundary conditions
- Infinite loop when mid doesn't change
- Forgetting to check if element exists after binary search
- Wrong loop condition (inclusive vs exclusive)