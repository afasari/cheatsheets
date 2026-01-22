# Bit Manipulation

Operations that manipulate individual bits in integers.

## Overview

Bit manipulation works with binary representation of numbers, enabling O(1) operations.

**Common Operations:**
- **AND (&)** - Bitwise AND
- **OR (|)** - Bitwise OR
- **XOR (^)** - Bitwise XOR
- **NOT (~)** - Bitwise NOT
- **Shift (<<, >>)** - Left/Right shift

## Basic Bit Operations

<CodeTabs>

```go
// Basic bit operations
func basicBitOps(a, b int) {
    // Bitwise AND
    and := a & b
    
    // Bitwise OR
    or := a | b
    
    // Bitwise XOR
    xor := a ^ b
    
    // Bitwise NOT (complement)
    not := ^a
    
    // Left shift
    leftShift := a << 2
    
    // Right shift (arithmetic)
    rightShift := a >> 1
    
    // Check if bit is set
    bitSet := (a & (1 << 2)) != 0
    
    // Set bit
    setBit := a | (1 << 2)
    
    // Clear bit
    clearBit := a &^ (1 << 2)
    
    // Toggle bit
    toggleBit := a ^ (1 << 2)
    
    // Get least significant bit
    lsb := a & -a
    
    // Count set bits (Brian Kernighan's algorithm)
    count := 0
    n := a
    for n != 0 {
        n = n & (n - 1)
        count++
    }
}
```

```rust
// Basic bit operations
fn basic_bit_ops(a: i32, b: i32) {
    // Bitwise AND
    let and_val = a & b;
    
    // Bitwise OR
    let or_val = a | b;
    
    // Bitwise XOR
    let xor_val = a ^ b;
    
    // Bitwise NOT (complement)
    let not = !a;
    
    // Left shift
    let left_shift = a << 2;
    
    // Right shift (arithmetic)
    let right_shift = a >> 1;
    
    // Check if bit is set
    let bit_set = (a & (1 << 2)) != 0;
    
    // Set bit
    let set_bit = a | (1 << 2);
    
    // Clear bit
    let clear_bit = a & !(1 << 2);
    
    // Toggle bit
    let toggle_bit = a ^ (1 << 2);
    
    // Get least significant set bit
    let lsb = a & -a;
    
    // Count set bits (Brian Kernighan's algorithm)
    let mut count = 0;
    let mut n = a;
    while n != 0 {
        n = n & (n - 1);
        count += 1;
    }
}
```

```python
# Basic bit operations
def basic_bit_ops(a, b):
    # Bitwise AND
    and_val = a & b
    
    # Bitwise OR
    or_val = a | b
    
    # Bitwise XOR
    xor_val = a ^ b
    
    # Bitwise NOT (complement)
    not_val = ~a
    
    # Left shift
    left_shift = a << 2
    
    # Right shift (arithmetic)
    right_shift = a >> 1
    
    # Check if bit is set
    bit_set = (a & (1 << 2)) != 0
    
    # Set bit
    set_bit = a | (1 << 2)
    
    # Clear bit
    clear_bit = a & ~(1 << 2)
    
    # Toggle bit
    toggle_bit = a ^ (1 << 2)
    
    # Get least significant set bit
    lsb = a & -a
    
    # Count set bits (Brian Kernighan's algorithm)
    count = 0
    n = a
    while n != 0:
        n = n & (n - 1)
        count += 1
```

```javascript
// Basic bit operations
function basicBitOps(a, b) {
    // Bitwise AND
    const and = a & b;
    
    // Bitwise OR
    const or = a | b;
    
    // Bitwise XOR
    const xor = a ^ b;
    
    // Bitwise NOT (complement)
    const not = ~a;
    
    // Left shift
    const leftShift = a << 2;
    
    // Right shift (arithmetic)
    const rightShift = a >> 1;
    
    // Check if bit is set
    const bitSet = (a & (1 << 2)) !== 0;
    
    // Set bit
    const setBit = a | (1 << 2);
    
    // Clear bit
    const clearBit = a & ~(1 << 2);
    
    // Toggle bit
    const toggleBit = a ^ (1 << 2);
    
    // Get least significant set bit
    const lsb = a & -a;
    
    // Count set bits (Brian Kernighan's algorithm)
    let count = 0;
    let n = a;
    while (n !== 0) {
        n = n & (n - 1);
        count++;
    }
}
```

</CodeTabs>

---

## Common Bit Tricks

### Check if Number is Power of 2

**Time Complexity:** O(1) | **Space Complexity:** O(1)

<CodeTabs>

```go
// Check power of 2
func isPowerOfTwo(n int) bool {
    return n > 0 && (n & (n-1)) == 0
}
```

```rust
// Check power of 2
fn is_power_of_two(n: i32) -> bool {
    n > 0 && (n & (n - 1)) == 0
}
```

```python
# Check power of 2
def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0
```

```javascript
// Check power of 2
function isPowerOfTwo(n) {
    return n > 0 && (n & (n - 1)) === 0;
}
```

</CodeTabs>

---

### Count Total Bits

Count number of bits needed to represent a number.

**Time Complexity:** O(1) | **Space Complexity:** O(1)

<CodeTabs>

```go
// Count total bits
func countBits(n int) int {
    if n == 0 {
        return 1
    }
    count := 0
    for n != 0 {
        count++
        n = n >> 1
    }
    return count
}
```

```rust
// Count total bits
fn count_bits(n: i32) -> u32 {
    if n == 0 {
        return 1;
    }
    let mut count = 0;
    let mut n = n;
    while n != 0 {
        count += 1;
        n >>= 1;
    }
    count
}
```

```python
# Count total bits
def count_bits(n):
    if n == 0:
        return 1
    
    count = 0
    while n != 0:
        count += 1
        n >>= 1
    
    return count
```

```javascript
// Count total bits
function countBits(n) {
    if (n === 0) {
        return 1;
    }
    
    let count = 0;
    while (n !== 0) {
        count++;
        n >>= 1;
    }
    
    return count;
}
```

</CodeTabs>

---

### Swap Two Numbers

Swap two numbers without temporary variable using XOR.

**Time Complexity:** O(1) | **Space Complexity:** O(1)

<CodeTabs>

```go
// Swap using XOR
func swapWithXOR(a, b *int) {
    if a != nil && b != nil && a != b {
        *a = *a ^ *b
        *b = *a ^ *b
        *a = *a ^ *b
    }
}
```

```rust
// Swap using XOR
fn swap_with_xor(a: &mut i32, b: &mut i32) {
    if a as *mut i32 != b as *mut i32 {
        *a = *a ^ *b;
        *b = *a ^ *b;
        *a = *a ^ *b;
    }
}
```

```python
# Swap using XOR
def swap_with_xor(a, b):
    return a ^ b, a ^ b ^ a, a ^ a ^ b

# Usage
x, y = 5, 10
y, x = swap_with_xor(x, y)
```

```javascript
// Swap using XOR
function swapWithXOR(a, b) {
    if (a !== b) {
        a = a ^ b;
        b = a ^ b;
        a = a ^ b;
    }
}

// Usage with object
function swapNumbers(a, b) {
    return [a ^ b ^ a, a ^ b ^ a];
}
```

</CodeTabs>

---

### Single Number

Find number that appears once while others appear twice using XOR.

**Time Complexity:** O(n) | **Space Complexity:** O(1)

<CodeTabs>

```go
// Single number (others appear twice)
func singleNumber(nums []int) int {
    result := 0
    for _, num := range nums {
        result ^= num
    }
    return result
}
```

```rust
// Single number (others appear twice)
fn single_number(nums: &[i32]) -> i32 {
    nums.iter().fold(0, |acc, &x| acc ^ x)
}
```

```python
# Single number (others appear twice)
from functools import reduce

def single_number(nums):
    return reduce(lambda x, y: x ^ y, nums)
```

```javascript
// Single number (others appear twice)
function singleNumber(nums) {
    return nums.reduce((acc, x) => acc ^ x, 0);
}
```

</CodeTabs>

---

### Reverse Bits

Reverse bits of a 32-bit unsigned integer.

**Time Complexity:** O(32) = O(1) | **Space Complexity:** O(1)

<CodeTabs>

```go
// Reverse bits
func reverseBits(n uint32) uint32 {
    var result uint32
    
    for i := 0; i < 32; i++ {
        result = result << 1
        result |= n & 1
        n >>= 1
    }
    
    return result
}
```

```rust
// Reverse bits
fn reverse_bits(n: u32) -> u32 {
    let mut result: u32 = 0;
    
    for _ in 0..32 {
        result = result << 1;
        result |= n & 1;
        n >>= 1;
    }
    
    result
}
```

```python
# Reverse bits
def reverse_bits(n):
    result = 0
    
    for _ in range(32):
        result = result << 1
        result |= n & 1
        n >>= 1
    
    return result
```

```javascript
// Reverse bits
function reverseBits(n) {
    let result = 0;
    
    for (let i = 0; i < 32; i++) {
        result = result << 1;
        result |= n & 1;
        n >>= 1;
    }
    
    return result;
}
```

</CodeTabs>

---

## Bitwise Patterns

| Pattern | Description | Use Case |
|---------|-------------|----------|
| `n & (n-1) == 0` | Power of 2 | Check if power of 2 |
| `n & -n` | Least significant bit | Get LSB |
| `n & ~(n-1)` | Clear lowest set bit | Next power of 2 |
| `n ^ (n >> 1)` | Toggle LSB | Flip lowest bit |
| `n | (n + 1)` | Set lowest zero | Make number odd |

## Bitwise Operators Reference

| Operator | Name | Example | Description |
|----------|------|--------|-------------|
| `&` | AND | `5 & 3 = 1` | Bitwise AND |
| `|` | OR | `5 | 3 = 7` | Bitwise OR |
| `^` | XOR | `5 ^ 3 = 6` | Bitwise XOR |
| `~` | NOT | `~5 = -6` | Bitwise NOT |
| `<<` | Left Shift | `5 << 2 = 20` | Shift bits left |
| `>>` | Right Shift | `5 >> 1 = 2` | Shift bits right (arithmetic) |
| `>>>` | Unsigned Right Shift | `5 >>> 1 = 2` | Shift bits right (logical) |

## Common Bit Masks

| Operation | Mask | Example |
|-----------|------|--------|
| Get bit i | `1 << i` | `(n & (1 << i)) != 0` |
| Set bit i | `n | (1 << i)` | `n = n | (1 << i)` |
| Clear bit i | `n & ~(1 << i)` | `n = n & ~(1 << i)` |
| Toggle bit i | `n ^ (1 << i)` | `n = n ^ (1 << i)` |
| Get lowest set bit | `n & -n` | `lsb = n & -n` |
| Clear lowest set bit | `n & (n - 1)` | `n = n & (n - 1)` |

## Tips

1. **Use bit manipulation for optimization** - Often faster than arithmetic
2. **Learn common patterns** - Power of 2, single number, reverse bits
3. **Careful with overflow** - Be mindful of language-specific behavior
4. **Understand signed vs unsigned** - Right shift behaves differently
5. **Use parentheses** - Bit operations have lower precedence

## Common Mistakes

- Confusing `&` with `&&`
- Off-by-one errors in bit positions
- Not considering signed number representation
- Using wrong shift direction
- Forgetting operator precedence
- Integer overflow in bit operations