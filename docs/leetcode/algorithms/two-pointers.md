# Two Pointers

Use two pointers to traverse data structures efficiently.

## Overview

Two pointers technique uses two (or more) pointers to iterate through arrays, strings, or linked lists.

**Key Patterns:**
1. **Opposite ends** - Start from both ends, move towards each other
2. **Same direction** - Both move forward, one may move faster
3. **Different arrays** - One pointer per array

## When to Use

- Working with sorted arrays
- Finding pairs with specific sum/property
- Checking palindromes
- Merging sorted structures
- Removing elements in-place

---

## Opposite Ends (Same Input)

Start pointers at both ends, move towards center.

**Time Complexity:** O(n) | **Space Complexity:** O(1)

<CodeTabs>

```go
// Two sum with sorted array
func twoSumSorted(nums []int, target int) []int {
    left, right := 0, len(nums)-1
    
    for left < right {
        sum := nums[left] + nums[right]
        if sum == target {
            return []int{left + 1, right + 1}
        } else if sum < target {
            left++
        } else {
            right--
        }
    }
    
    return nil
}

// Container with most water
func maxArea(height []int) int {
    left, right := 0, len(height)-1
    maxArea := 0
    
    for left < right {
        width := right - left
        h := min(height[left], height[right])
        area := width * h
        maxArea = max(maxArea, area)
        
        if height[left] < height[right] {
            left++
        } else {
            right--
        }
    }
    
    return maxArea
}
```

```rust
// Two sum with sorted array
fn two_sum_sorted(nums: &[i32], target: i32) -> Option<[usize; 2]> {
    let mut left = 0;
    let mut right = nums.len() - 1;
    
    while left < right {
        let sum = nums[left] + nums[right];
        if sum == target {
            return Some([left, right]);
        } else if sum < target {
            left += 1;
        } else {
            right -= 1;
        }
    }
    
    None
}

// Container with most water
fn max_area(height: &[i32]) -> i32 {
    let mut left = 0;
    let mut right = height.len() - 1;
    let mut max_area = 0;
    
    while left < right {
        let width = right - left;
        let h = height[left].min(height[right]);
        let area = width * h;
        max_area = max_area.max(area);
        
        if height[left] < height[right] {
            left += 1;
        } else {
            right -= 1;
        }
    }
    
    max_area
}
```

```python
# Two sum with sorted array
def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    
    while left < right:
        sum_val = nums[left] + nums[right]
        if sum_val == target:
            return [left + 1, right + 1]
        elif sum_val < target:
            left += 1
        else:
            right -= 1
    
    return None

# Container with most water
def max_area(height):
    left, right = 0, len(height) - 1
    max_area = 0
    
    while left < right:
        width = right - left
        h = min(height[left], height[right])
        area = width * h
        max_area = max(max_area, area)
        
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_area
```

```javascript
// Two sum with sorted array
function twoSumSorted(nums, target) {
    let left = 0, right = nums.length - 1;
    
    while (left < right) {
        const sum = nums[left] + nums[right];
        if (sum === target) {
            return [left + 1, right + 1];
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return null;
}

// Container with most water
function maxArea(height) {
    let left = 0, right = height.length - 1;
    let maxArea = 0;
    
    while (left < right) {
        const width = right - left;
        const h = Math.min(height[left], height[right]);
        const area = width * h;
        maxArea = Math.max(maxArea, area);
        
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxArea;
}
```

</CodeTabs>

---

## Same Direction (Fast & Slow)

Both move forward, one may move faster. Useful for cycle detection, finding middle.

**Time Complexity:** O(n) | **Space Complexity:** O(1)

<CodeTabs>

```go
// Remove duplicates from sorted array
func removeDuplicates(nums []int) int {
    if len(nums) == 0 {
        return 0
    }
    
    slow := 1
    for fast := 1; fast < len(nums); fast++ {
        if nums[fast] != nums[slow-1] {
            nums[slow] = nums[fast]
            slow++
        }
    }
    
    return slow
}

// Move zeros to end
func moveZeroes(nums []int) {
    slow := 0
    for fast := 0; fast < len(nums); fast++ {
        if nums[fast] != 0 {
            nums[slow], nums[fast] = nums[fast], nums[slow]
            slow++
        }
    }
}
```

```rust
// Remove duplicates from sorted array
fn remove_duplicates(nums: &mut Vec<i32>) -> i32 {
    if nums.is_empty() {
        return 0;
    }
    
    let mut slow = 1;
    for fast in 1..nums.len() {
        if nums[fast] != nums[slow - 1] {
            nums[slow] = nums[fast];
            slow += 1;
        }
    }
    
    slow as i32
}

// Move zeros to end
fn move_zeroes(nums: &mut Vec<i32>) {
    let mut slow = 0;
    for fast in 0..nums.len() {
        if nums[fast] != 0 {
            nums.swap(slow, fast);
            slow += 1;
        }
    }
}
```

```python
# Remove duplicates from sorted array
def remove_duplicates(nums):
    if not nums:
        return 0
    
    slow = 1
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow - 1]:
            nums[slow] = nums[fast]
            slow += 1
    
    return slow

# Move zeros to end
def move_zeroes(nums):
    slow = 0
    for fast in range(len(nums)):
        if nums[fast] != 0:
            nums[slow], nums[fast] = nums[fast], nums[slow]
            slow += 1
```

```javascript
// Remove duplicates from sorted array
function removeDuplicates(nums) {
    if (nums.length === 0) {
        return 0;
    }
    
    let slow = 1;
    for (let fast = 1; fast < nums.length; fast++) {
        if (nums[fast] !== nums[slow - 1]) {
            nums[slow] = nums[fast];
            slow++;
        }
    }
    
    return slow;
}

// Move zeros to end
function moveZeroes(nums) {
    let slow = 0;
    for (let fast = 0; fast < nums.length; fast++) {
        if (nums[fast] !== 0) {
            [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
            slow++;
        }
    }
}
```

</CodeTabs>

---

## Two Inputs (Exhaust Both)

One pointer for each input array, both move to end.

**Time Complexity:** O(n + m) | **Space Complexity:** O(1)

<CodeTabs>

```go
// Intersection of two arrays
func intersection(nums1, nums2 []int) []int {
    sort.Ints(nums1)
    sort.Ints(nums2)
    
    result := []int{}
    i, j := 0, 0
    
    for i < len(nums1) && j < len(nums2) {
        if nums1[i] == nums2[j] {
            if len(result) == 0 || result[len(result)-1] != nums1[i] {
                result = append(result, nums1[i])
            }
            i++
            j++
        } else if nums1[i] < nums2[j] {
            i++
        } else {
            j++
        }
    }
    
    return result
}

// Find median of two sorted arrays
func findMedianSortedArrays(nums1, nums2 []int) float64 {
    i, j := 0, 0
    merged := []int{}
    
    for i < len(nums1) && j < len(nums2) {
        if nums1[i] <= nums2[j] {
            merged = append(merged, nums1[i])
            i++
        } else {
            merged = append(merged, nums2[j])
            j++
        }
    }
    
    merged = append(merged, nums1[i:]...)
    merged = append(merged, nums2[j:]...)
    
    n := len(merged)
    if n%2 == 1 {
        return float64(merged[n/2])
    }
    
    return float64(merged[n/2-1]+merged[n/2]) / 2.0
}
```

```rust
// Intersection of two arrays
fn intersection(mut nums1: Vec<i32>, mut nums2: Vec<i32>) -> Vec<i32> {
    nums1.sort();
    nums2.sort();
    
    let mut result = Vec::new();
    let (mut i, mut j) = (0, 0);
    
    while i < nums1.len() && j < nums2.len() {
        if nums1[i] == nums2[j] {
            if result.is_empty() || result.last() != Some(&nums1[i]) {
                result.push(nums1[i]);
            }
            i += 1;
            j += 1;
        } else if nums1[i] < nums2[j] {
            i += 1;
        } else {
            j += 1;
        }
    }
    
    result
}

// Find median of two sorted arrays
fn find_median_sorted_arrays(nums1: &[i32], nums2: &[i32]) -> f64 {
    let mut merged = Vec::new();
    let (mut i, mut j) = (0, 0);
    
    while i < nums1.len() && j < nums2.len() {
        if nums1[i] <= nums2[j] {
            merged.push(nums1[i]);
            i += 1;
        } else {
            merged.push(nums2[j]);
            j += 1;
        }
    }
    
    merged.extend_from_slice(&nums1[i..]);
    merged.extend_from_slice(&nums2[j..]);
    
    let n = merged.len();
    if n % 2 == 1 {
        merged[n / 2] as f64
    } else {
        (merged[n / 2 - 1] + merged[n / 2]) as f64 / 2.0
    }
}
```

```python
# Intersection of two arrays
def intersection(nums1, nums2):
    nums1.sort()
    nums2.sort()
    
    result = []
    i, j = 0, 0
    
    while i < len(nums1) and j < len(nums2):
        if nums1[i] == nums2[j]:
            if not result or result[-1] != nums1[i]:
                result.append(nums1[i])
            i += 1
            j += 1
        elif nums1[i] < nums2[j]:
            i += 1
        else:
            j += 1
    
    return result

# Find median of two sorted arrays
def find_median_sorted_arrays(nums1, nums2):
    i, j = 0, 0
    merged = []
    
    while i < len(nums1) and j < len(nums2):
        if nums1[i] <= nums2[j]:
            merged.append(nums1[i])
            i += 1
        else:
            merged.append(nums2[j])
            j += 1
    
    merged.extend(nums1[i:])
    merged.extend(nums2[j:])
    
    n = len(merged)
    if n % 2 == 1:
        return merged[n // 2]
    
    return (merged[n // 2 - 1] + merged[n // 2]) / 2
```

```javascript
// Intersection of two arrays
function intersection(nums1, nums2) {
    nums1.sort((a, b) => a - b);
    nums2.sort((a, b) => a - b);
    
    const result = [];
    let i = 0, j = 0;
    
    while (i < nums1.length && j < nums2.length) {
        if (nums1[i] === nums2[j]) {
            if (result.length === 0 || result[result.length - 1] !== nums1[i]) {
                result.push(nums1[i]);
            }
            i++;
            j++;
        } else if (nums1[i] < nums2[j]) {
            i++;
        } else {
            j++;
        }
    }
    
    return result;
}

// Find median of two sorted arrays
function findMedianSortedArrays(nums1, nums2) {
    let i = 0, j = 0;
    const merged = [];
    
    while (i < nums1.length && j < nums2.length) {
        if (nums1[i] <= nums2[j]) {
            merged.push(nums1[i]);
            i++;
        } else {
            merged.push(nums2[j]);
            j++;
        }
    }
    
    merged.push(...nums1.slice(i), ...nums2.slice(j));
    
    const n = merged.length;
    if (n % 2 === 1) {
        return merged[Math.floor(n / 2)];
    }
    
    return (merged[n / 2 - 1] + merged[n / 2]) / 2;
}
```

</CodeTabs>

---

## Common Patterns

| Pattern | Use Case | Example |
|---------|----------|---------|
| Opposite ends | Sorted array, palindrome check | Two sum, container with most water |
| Fast & slow | Cycle detection, finding middle | Detect cycle in linked list |
| Same direction | Remove duplicates, partition | Remove duplicates from sorted array |
| Two inputs | Merge, compare, intersection | Merge sorted arrays |
| Three pointers | Trapping water, rain | Trapping rain water |