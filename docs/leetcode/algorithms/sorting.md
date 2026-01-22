# Sorting Algorithms

Common sorting algorithms with time and space complexity.

## Overview

Sorting rearranges elements in ascending/descending order.

**Stability:**
- **Stable** - Equal elements maintain relative order
- **Unstable** - Equal elements may change relative order

**In-place vs Out-of-place:**
- **In-place** - Uses O(1) extra space
- **Out-of-place** - Uses O(n) extra space

## Bubble Sort

Repeatedly swap adjacent elements if they're in wrong order.

**Time Complexity:** O(n²) | **Space Complexity:** O(1) | **Stable:** Yes

<CodeTabs>

```go
// Bubble sort
func bubbleSort(nums []int) {
    n := len(nums)
    for i := 0; i < n-1; i++ {
        for j := 0; j < n-i-1; j++ {
            if nums[j] > nums[j+1] {
                nums[j], nums[j+1] = nums[j+1], nums[j]
            }
        }
    }
}
```

```rust
// Bubble sort
pub fn bubble_sort(nums: &mut [i32]) {
    let n = nums.len();
    for i in 0..n-1 {
        for j in 0..n-i-1 {
            if nums[j] > nums[j+1] {
                nums.swap(j, j+1);
            }
        }
    }
}
```

```python
# Bubble sort
def bubble_sort(nums):
    n = len(nums)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if nums[j] > nums[j + 1]:
                nums[j], nums[j + 1] = nums[j + 1], nums[j]
```

```javascript
// Bubble sort
function bubbleSort(nums) {
    const n = nums.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (nums[j] > nums[j + 1]) {
                [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]];
            }
        }
    }
}
```

</CodeTabs>

---

## Selection Sort

Find minimum in unsorted portion, swap with first unsorted element.

**Time Complexity:** O(n²) | **Space Complexity:** O(1) | **Stable:** No

<CodeTabs>

```go
// Selection sort
func selectionSort(nums []int) {
    n := len(nums)
    for i := 0; i < n-1; i++ {
        minIdx := i
        for j := i + 1; j < n; j++ {
            if nums[j] < nums[minIdx] {
                minIdx = j
            }
        }
        nums[i], nums[minIdx] = nums[minIdx], nums[i]
    }
}
```

```rust
// Selection sort
pub fn selection_sort(nums: &mut [i32]) {
    let n = nums.len();
    for i in 0..n-1 {
        let mut min_idx = i;
        for j in (i+1)..n {
            if nums[j] < nums[min_idx] {
                min_idx = j;
            }
        }
        nums.swap(i, min_idx);
    }
}
```

```python
# Selection sort
def selection_sort(nums):
    n = len(nums)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if nums[j] < nums[min_idx]:
                min_idx = j
        nums[i], nums[min_idx] = nums[min_idx], nums[i]
```

```javascript
// Selection sort
function selectionSort(nums) {
    const n = nums.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (nums[j] < nums[minIdx]) {
                minIdx = j;
            }
        }
        [nums[i], nums[minIdx]] = [nums[minIdx], nums[i]];
    }
}
```

</CodeTabs>

---

## Insertion Sort

Build sorted array one element at a time by inserting each element at correct position.

**Time Complexity:** O(n²) average, O(n) best | **Space Complexity:** O(1) | **Stable:** Yes

<CodeTabs>

```go
// Insertion sort
func insertionSort(nums []int) {
    for i := 1; i < len(nums); i++ {
        key := nums[i]
        j := i - 1
        
        for j >= 0 && nums[j] > key {
            nums[j+1] = nums[j]
            j--
        }
        nums[j+1] = key
    }
}
```

```rust
// Insertion sort
pub fn insertion_sort(nums: &mut [i32]) {
    for i in 1..nums.len() {
        let key = nums[i];
        let mut j = i as i32 - 1;
        
        while j >= 0 && nums[j as usize] > key {
            nums[(j + 1) as usize] = nums[j as usize];
            j -= 1;
        }
        nums[(j + 1) as usize] = key;
    }
}
```

```python
# Insertion sort
def insertion_sort(nums):
    for i in range(1, len(nums)):
        key = nums[i]
        j = i - 1
        
        while j >= 0 and nums[j] > key:
            nums[j + 1] = nums[j]
            j -= 1
        
        nums[j + 1] = key
```

```javascript
// Insertion sort
function insertionSort(nums) {
    for (let i = 1; i < nums.length; i++) {
        const key = nums[i];
        let j = i - 1;
        
        while (j >= 0 && nums[j] > key) {
            nums[j + 1] = nums[j];
            j--;
        }
        nums[j + 1] = key;
    }
}
```

</CodeTabs>

---

## Merge Sort

Divide array in half, sort each half, then merge sorted halves.

**Time Complexity:** O(n log n) | **Space Complexity:** O(n) | **Stable:** Yes

<CodeTabs>

```go
// Merge sort
func mergeSort(nums []int) []int {
    if len(nums) <= 1 {
        return nums
    }
    
    mid := len(nums) / 2
    left := mergeSort(nums[:mid])
    right := mergeSort(nums[mid:])
    return merge(left, right)
}

func merge(left, right []int) []int {
    result := []int{}
    i, j := 0, 0
    
    for i < len(left) && j < len(right) {
        if left[i] <= right[j] {
            result = append(result, left[i])
            i++
        } else {
            result = append(result, right[j])
            j++
        }
    }
    
    result = append(result, left[i:]...)
    result = append(result, right[j:]...)
    return result
}
```

```rust
// Merge sort
pub fn merge_sort(nums: &mut [i32]) -> Vec<i32> {
    if nums.len() <= 1 {
        return nums.to_vec();
    }
    
    let mid = nums.len() / 2;
    let left = merge_sort(&mut nums[..mid]);
    let right = merge_sort(&mut nums[mid..]);
    merge(&mut left, &mut right)
}

fn merge(left: &mut Vec<i32>, right: &mut Vec<i32>) -> Vec<i32> {
    let mut result = Vec::with_capacity(left.len() + right.len());
    let (mut i, mut j) = (0, 0);
    
    while i < left.len() && j < right.len() {
        if left[i] <= right[j] {
            result.push(left[i]);
            i += 1;
        } else {
            result.push(right[j]);
            j += 1;
        }
    }
    
    result.extend_from_slice(&left[i..]);
    result.extend_from_slice(&right[j..]);
    result
}
```

```python
# Merge sort
def merge_sort(nums):
    if len(nums) <= 1:
        return nums
    
    mid = len(nums) // 2
    left = merge_sort(nums[:mid])
    right = merge_sort(nums[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i, j = 0, 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result
```

```javascript
// Merge sort
function mergeSort(nums) {
    if (nums.length <= 1) {
        return nums;
    }
    
    const mid = Math.floor(nums.length / 2);
    const left = mergeSort(nums.slice(0, mid));
    const right = mergeSort(nums.slice(mid));
    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }
    
    result.push(...left.slice(i), ...right.slice(j));
    return result;
}
```

</CodeTabs>

---

## Quick Sort

Pick pivot, partition array around pivot, recursively sort partitions.

**Time Complexity:** O(n log n) average, O(n²) worst | **Space Complexity:** O(log n) | **Stable:** No (can be made stable)

<CodeTabs>

```go
// Quick sort (Lomuto partition scheme)
func quickSort(nums []int) {
    if len(nums) <= 1 {
        return
    }
    
    pivotIndex := partition(nums, 0, len(nums)-1)
    quickSort(nums[0:pivotIndex])
    quickSort(nums[pivotIndex+1:])
}

func partition(nums []int, low, high int) int {
    pivot := nums[high]
    i := low - 1
    
    for j := low; j < high; j++ {
        if nums[j] < pivot {
            i++
            nums[i], nums[j] = nums[j], nums[i]
        }
    }
    
    nums[i+1], nums[high] = nums[high], nums[i+1]
    return i + 1
}
```

```rust
// Quick sort (Lomuto partition scheme)
pub fn quick_sort(nums: &mut [i32]) {
    if nums.len() <= 1 {
        return;
    }
    
    let pivot_index = partition(nums, 0, nums.len() - 1);
    quick_sort(&mut nums[..pivot_index]);
    quick_sort(&mut nums[pivot_index + 1..]);
}

fn partition(nums: &mut [i32], low: usize, high: i32) -> usize {
    let pivot = nums[high as usize];
    let mut i = low as i32 - 1;
    
    for j in low..high {
        if nums[j] < pivot {
            i += 1;
            nums.swap(i as usize, j);
        }
    }
    
    nums.swap((i + 1) as usize, high as usize);
    (i + 1) as usize
}
```

```python
# Quick sort (Lomuto partition scheme)
def quick_sort(nums):
    if len(nums) <= 1:
        return nums
    
    pivot_index = partition(nums, 0, len(nums) - 1)
    return quick_sort(nums[:pivot_index]) + quick_sort(nums[pivot_index + 1:])

def partition(nums, low, high):
    pivot = nums[high]
    i = low - 1
    
    for j in range(low, high):
        if nums[j] < pivot:
            i += 1
            nums[i], nums[j] = nums[j], nums[i]
    
    nums[i + 1], nums[high] = nums[high], nums[i + 1]
    return i + 1
```

```javascript
// Quick sort (Lomuto partition scheme)
function quickSort(nums) {
    if (nums.length <= 1) {
        return nums;
    }
    
    const pivotIndex = partition(nums, 0, nums.length - 1);
    return [...quickSort(nums.slice(0, pivotIndex)), ...quickSort(nums.slice(pivotIndex + 1))];
}

function partition(nums, low, high) {
    const pivot = nums[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (nums[j] < pivot) {
            i++;
            [nums[i], nums[j]] = [nums[j], nums[i]];
        }
    }
    
    [nums[i + 1], nums[high]] = [nums[high], nums[i + 1]];
    return i + 1;
}
```

</CodeTabs>

---

## Comparison

| Algorithm | Time (Avg) | Time (Best) | Time (Worst) | Space | Stable |
|-----------|------------|------------|-------------|--------|--------|
| Bubble Sort | O(n²) | O(n) | O(n²) | O(1) | Yes |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | No |
| Insertion Sort | O(n²) | O(n) | O(n²) | O(1) | Yes |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |

## When to Use

| Algorithm | Best Use Case |
|-----------|--------------|
| Bubble Sort | Educational, nearly sorted data |
| Selection Sort | When writes are expensive |
| Insertion Sort | Small arrays, nearly sorted |
| Merge Sort | Stable sort needed, worst case guarantee |
| Quick Sort | General purpose, in-memory sorting |

## Built-in Sort

In practice, use built-in sort functions which are highly optimized:

<CodeTabs>

```go
// Built-in sort
import "sort"
func sortBuiltIn(nums []int) {
    sort.Ints(nums)
}
```

```rust
// Built-in sort
nums.sort();
```

```python
# Built-in sort
nums.sort()  # In-place, returns None
nums_sorted = sorted(nums)  # Returns new sorted list
```

```javascript
// Built-in sort
nums.sort((a, b) => a - b);  // In-place
nums_sorted = [...nums].sort((a, b) => a - b);  // Returns new sorted array
```

</CodeTabs>

## Tips

1. **Use built-in sorts** - They're optimized and battle-tested
2. **Choose algorithm based on data** - Insertion sort for small/sorted data
3. **Consider stability** - Merge sort when stability matters
4. **Space constraints** - Use in-place algorithms when memory limited
5. **Pattern recognition** - Recognize when sorting is useful

## Common Mistakes

- Using O(n²) sort for large datasets
- Not considering stability requirement
- Wrong partition logic in quick sort
- Off-by-one errors in loops
- Not handling edge cases (empty, single element)