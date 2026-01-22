# HashMap

Common HashMap/Dictionary operations and patterns.

## Basic Operations

HashMap provides O(1) average case for insert, delete, lookup.

**Time Complexity:** O(1) average, O(n) worst | **Space Complexity:** O(n)

<CodeTabs>

```go
// HashMap operations in Go
func hashMapExample() {
    // Create and initialize
    m := make(map[string]int)
    
    // Insert
    m["apple"] = 5
    m["banana"] = 3
    
    // Get value with existence check
    if value, exists := m["apple"]; exists {
        fmt.Println(value) // 5
    }
    
    // Check if key exists
    _, exists := m["orange"]
    fmt.Println(exists) // false
    
    // Delete
    delete(m, "apple")
    
    // Iterate
    for key, value := range m {
        fmt.Printf("%s: %d\n", key, value)
    }
    
    // Get all keys
    keys := make([]string, 0, len(m))
    for key := range m {
        keys = append(keys, key)
    }
}
```

```rust
// HashMap operations in Rust
use std::collections::HashMap;

fn hash_map_example() {
    // Create and initialize
    let mut m: HashMap<&str, i32> = HashMap::new();
    
    // Insert
    m.insert("apple", 5);
    m.insert("banana", 3);
    
    // Get value
    if let Some(&value) = m.get("apple") {
        println!("{}", value); // 5
    }
    
    // Check if key exists
    println!("{}", m.contains_key("orange")); // false
    
    // Get with default
    let value = m.get("grape").unwrap_or(&0);
    
    // Delete
    m.remove("apple");
    
    // Iterate
    for (key, value) in &m {
        println!("{}: {}", key, value);
    }
    
    // Get all keys
    let keys: Vec<_> = m.keys().collect();
}
```

```python
# HashMap operations in Python
def hash_map_example():
    # Create and initialize
    m = {}
    
    # Insert
    m["apple"] = 5
    m["banana"] = 3
    
    # Get value
    value = m.get("apple")
    print(value)  # 5
    
    # Get with default
    value = m.get("orange", 0)
    print(value)  # 0
    
    # Check if key exists
    print("apple" in m)  # True
    print("orange" in m)  # False
    
    # Delete
    del m["apple"]
    m.pop("banana", None)
    
    # Iterate
    for key, value in m.items():
        print(f"{key}: {value}")
    
    # Get all keys
    keys = list(m.keys())
```

```javascript
// HashMap operations in JavaScript
function hashMapExample() {
    // Create and initialize
    const m = new Map();
    
    // Insert
    m.set("apple", 5);
    m.set("banana", 3);
    
    // Get value
    const value = m.get("apple");
    console.log(value); // 5
    
    // Check if key exists
    console.log(m.has("apple")); // true
    console.log(m.has("orange")); // false
    
    // Delete
    m.delete("apple");
    
    // Iterate
    for (const [key, value] of m.entries()) {
        console.log(`${key}: ${value}`);
    }
    
    // Get all keys
    const keys = Array.from(m.keys());
    
    // Using object (less recommended)
    const obj = {};
    obj["apple"] = 5;
    obj["banana"] = 3;
    console.log(obj["apple"]); // 5
    console.log("apple" in obj); // true
}
```

</CodeTabs>

---

## Frequency Counting

Count occurrences of elements in an array/string.

**Time Complexity:** O(n) | **Space Complexity:** O(n)

<CodeTabs>

```go
// Frequency count
func frequencyCount(arr []int) map[int]int {
    freq := make(map[int]int)
    for _, num := range arr {
        freq[num]++
    }
    return freq
}

// Find single number (all others appear twice)
func singleNumber(nums []int) int {
    freq := make(map[int]int)
    for _, num := range nums {
        freq[num]++
        if freq[num] == 2 {
            delete(freq, num)
        }
    }
    for num := range freq {
        return num
    }
    return -1
}
```

```rust
// Frequency count
use std::collections::HashMap;

fn frequency_count(arr: &[i32]) -> HashMap<i32, i32> {
    let mut freq: HashMap<i32, i32> = HashMap::new();
    for &num in arr {
        *freq.entry(num).or_insert(0) += 1;
    }
    freq
}

// Find single number (all others appear twice)
fn single_number(nums: &[i32]) -> i32 {
    let mut freq: HashMap<i32, i32> = HashMap::new();
    for &num in nums {
        let count = freq.entry(num).or_insert(0);
        *count += 1;
        if *count == 2 {
            freq.remove(&num);
        }
    }
    *freq.keys().next().unwrap()
}
```

```python
# Frequency count
def frequency_count(arr):
    freq = {}
    for num in arr:
        freq[num] = freq.get(num, 0) + 1
    return freq

# Find single number (all others appear twice)
def single_number(nums):
    freq = {}
    for num in nums:
        freq[num] = freq.get(num, 0) + 1
        if freq[num] == 2:
            del freq[num]
    return list(freq.keys())[0]
```

```javascript
// Frequency count
function frequencyCount(arr) {
    const freq = new Map();
    for (const num of arr) {
        freq.set(num, (freq.get(num) || 0) + 1);
    }
    return freq;
}

// Find single number (all others appear twice)
function singleNumber(nums) {
    const freq = new Map();
    for (const num of nums) {
        const count = (freq.get(num) || 0) + 1;
        freq.set(num, count);
        if (count === 2) {
            freq.delete(num);
        }
    }
    return freq.keys().next().value;
}
```

</CodeTabs>

**When to use:**
- Counting character/word frequencies
- Finding elements appearing unique number of times
- Grouping elements

---

## Two Sum

Find two numbers that sum to target using hashmap.

**Time Complexity:** O(n) | **Space Complexity:** O(n)

<CodeTabs>

```go
// Two sum
func twoSum(nums []int, target int) []int {
    numToIndex := make(map[int]int)
    
    for i, num := range nums {
        complement := target - num
        if idx, found := numToIndex[complement]; found {
            return []int{idx, i}
        }
        numToIndex[num] = i
    }
    
    return nil
}
```

```rust
// Two sum
use std::collections::HashMap;

fn two_sum(nums: &[i32], target: i32) -> Option<[usize; 2]> {
    let mut num_to_index: HashMap<i32, usize> = HashMap::new();
    
    for (i, &num) in nums.iter().enumerate() {
        let complement = target - num;
        if let Some(&idx) = num_to_index.get(&complement) {
            return Some([idx, i]);
        }
        num_to_index.insert(num, i);
    }
    
    None
}
```

```python
# Two sum
def two_sum(nums, target):
    num_to_index = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_to_index:
            return [num_to_index[complement], i]
        num_to_index[num] = i
    
    return None
```

```javascript
// Two sum
function twoSum(nums, target) {
    const numToIndex = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        const complement = target - num;
        if (numToIndex.has(complement)) {
            return [numToIndex.get(complement), i];
        }
        numToIndex.set(num, i);
    }
    
    return null;
}
```

</CodeTabs>

---

## Group Anagrams

Group strings that are anagrams of each other.

**Time Complexity:** O(n * k) where k is avg string length | **Space Complexity:** O(n * k)

<CodeTabs>

```go
// Group anagrams
import "sort"
import "strings"

func groupAnagrams(strs []string) [][]string {
    groups := make(map[string][]string)
    
    for _, s := range strs {
        chars := []rune(s)
        sort.Slice(chars, func(i, j int) bool {
            return chars[i] < chars[j]
        })
        sorted := string(chars)
        groups[sorted] = append(groups[sorted], s)
    }
    
    result := make([][]string, 0, len(groups))
    for _, group := range groups {
        result = append(result, group)
    }
    
    return result
}
```

```rust
// Group anagrams
use std::collections::HashMap;

fn group_anagrams(strs: Vec<String>) -> Vec<Vec<String>> {
    let mut groups: HashMap<String, Vec<String>> = HashMap::new();
    
    for s in strs {
        let mut chars: Vec = s.chars().collect();
        chars.sort();
        let sorted: String = chars.iter().collect();
        groups.entry(sorted).or_insert(Vec::new()).push(s);
    }
    
    groups.into_values().collect()
}
```

```python
# Group anagrams
from collections import defaultdict

def group_anagrams(strs):
    groups = defaultdict(list)
    
    for s in strs:
        sorted_s = ''.join(sorted(s))
        groups[sorted_s].append(s)
    
    return list(groups.values())
```

```javascript
// Group anagrams
function groupAnagrams(strs) {
    const groups = new Map();
    
    for (const s of strs) {
        const sorted = s.split('').sort().join('');
        if (!groups.has(sorted)) {
            groups.set(sorted, []);
        }
        groups.get(sorted).push(s);
    }
    
    return Array.from(groups.values());
}
```

</CodeTabs>

---

## Longest Consecutive Sequence

Find length of longest consecutive elements sequence.

**Time Complexity:** O(n) | **Space Complexity:** O(n)

<CodeTabs>

```go
// Longest consecutive sequence
func longestConsecutive(nums []int) int {
    numSet := make(map[int]bool)
    for _, num := range nums {
        numSet[num] = true
    }
    
    longest := 0
    
    for num := range numSet {
        // Only start if num-1 is not present
        if !numSet[num-1] {
            currentNum := num
            currentStreak := 1
            
            for numSet[currentNum+1] {
                currentNum++
                currentStreak++
            }
            
            if currentStreak > longest {
                longest = currentStreak
            }
        }
    }
    
    return longest
}
```

```rust
// Longest consecutive sequence
use std::collections::HashSet;

fn longest_consecutive(nums: Vec<i32>) -> i32 {
    let num_set: HashSet = nums.iter().cloned().collect();
    let mut longest = 0;
    
    for &num in &num_set {
        // Only start if num-1 is not present
        if !num_set.contains(&(num - 1)) {
            let mut current_num = num;
            let mut current_streak = 1;
            
            while num_set.contains(&(current_num + 1)) {
                current_num += 1;
                current_streak += 1;
            }
            
            longest = longest.max(current_streak);
        }
    }
    
    longest
}
```

```python
# Longest consecutive sequence
def longest_consecutive(nums):
    num_set = set(nums)
    longest = 0
    
    for num in num_set:
        # Only start if num-1 is not present
        if num - 1 not in num_set:
            current_num = num
            current_streak = 1
            
            while current_num + 1 in num_set:
                current_num += 1
                current_streak += 1
            
            longest = max(longest, current_streak)
    
    return longest
```

```javascript
// Longest consecutive sequence
function longestConsecutive(nums) {
    const numSet = new Set(nums);
    let longest = 0;
    
    for (const num of numSet) {
        // Only start if num-1 is not present
        if (!numSet.has(num - 1)) {
            let currentNum = num;
            let currentStreak = 1;
            
            while (numSet.has(currentNum + 1)) {
                currentNum++;
                currentStreak++;
            }
            
            longest = Math.max(longest, currentStreak);
        }
    }
    
    return longest;
}
```

</CodeTabs>

---

## When to Use HashMap

- **Frequency counting** - Count occurrences of elements
- **Grouping** - Group related elements (anagrams, same value)
- **Two Sum problems** - Find pairs with specific property
- **Lookup optimization** - O(1) access vs O(n) for array
- **Caching/Memoization** - Store computed results
- **Deduplication** - Track seen elements
- **Relationships** - Map one thing to another (user → permissions)