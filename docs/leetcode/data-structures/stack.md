# Stack

Common stack operations and patterns.

## Basic Stack Operations

Stack follows LIFO (Last In, First Out) principle.

**Time Complexity:** All O(1) | **Space Complexity:** O(n)

<CodeTabs>

```go
// Stack implementation in Go
type Stack struct {
    items []interface{}
}

func NewStack() *Stack {
    return &Stack{items: []interface{}{}}
}

func (s *Stack) Push(item interface{}) {
    s.items = append(s.items, item)
}

func (s *Stack) Pop() interface{} {
    if len(s.items) == 0 {
        return nil
    }
    item := s.items[len(s.items)-1]
    s.items = s.items[:len(s.items)-1]
    return item
}

func (s *Stack) Peek() interface{} {
    if len(s.items) == 0 {
        return nil
    }
    return s.items[len(s.items)-1]
}

func (s *Stack) IsEmpty() bool {
    return len(s.items) == 0
}
```

```rust
// Stack implementation in Rust
pub struct Stack {
    items: Vec,
}

impl Stack {
    pub fn new() -> Self {
        Stack { items: Vec::new() }
    }
    
    pub fn push(&mut self, item: T) {
        self.items.push(item);
    }
    
    pub fn pop(&mut self) -> Option {
        self.items.pop()
    }
    
    pub fn peek(&self) -> Option<&T> {
        self.items.last()
    }
    
    pub fn is_empty(&self) -> bool {
        self.items.is_empty()
    }
}
```

```python
# Stack implementation in Python
class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
    
    def pop(self):
        if self.is_empty():
            return None
        return self.items.pop()
    
    def peek(self):
        if self.is_empty():
            return None
        return self.items[-1]
    
    def is_empty(self):
        return len(self.items) == 0
```

```javascript
// Stack implementation in JavaScript
class Stack {
    constructor() {
        this.items = [];
    }
    
    push(item) {
        this.items.push(item);
    }
    
    pop() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items.pop();
    }
    
    peek() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.items.length - 1];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
}
```

</CodeTabs>

---

## Valid Parentheses

Use stack to check matching pairs.

**Time Complexity:** O(n) | **Space Complexity:** O(n)

<CodeTabs>

```go
// Valid parentheses check
func isValid(s string) bool {
    stack := []rune{}
    pairs := map[rune]rune{')': '(', '}': '{', ']': '['}
    
    for _, char := range s {
        if char == '(' || char == '{' || char == '[' {
            stack = append(stack, char)
        } else if char == ')' || char == '}' || char == ']' {
            if len(stack) == 0 {
                return false
            }
            top := stack[len(stack)-1]
            if pairs[char] != top {
                return false
            }
            stack = stack[:len(stack)-1]
        }
    }
    
    return len(stack) == 0
}
```

```rust
// Valid parentheses check
pub fn is_valid(s: &str) -> bool {
    let mut stack: Vec = Vec::new();
    let pairs: std::collections::HashMap = [
        (')', '('),
        ('}', '{'),
        (']', '['),
    ].iter().cloned().collect();
    
    for char in s.chars() {
        match char {
            '(' | '{' | '[' => stack.push(char),
            ')' | '}' | ']' => {
                if let Some(&top) = stack.last() {
                    if pairs.get(&char) == Some(&top) {
                        stack.pop();
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            _ => {}
        }
    }
    
    stack.is_empty()
}
```

```python
# Valid parentheses check
def is_valid(s):
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in '({[':
            stack.append(char)
        elif char in ')}]':
            if not stack:
                return False
            if pairs[char] != stack.pop():
                return False
    
    return len(stack) == 0
```

```javascript
// Valid parentheses check
function isValid(s) {
    const stack = [];
    const pairs = { ')': '(', '}': '{', ']': '[' };
    
    for (const char of s) {
        if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
        } else if (char === ')' || char === '}' || char === ']') {
            if (stack.length === 0) {
                return false;
            }
            if (pairs[char] !== stack.pop()) {
                return false;
            }
        }
    }
    
    return stack.length === 0;
}
```

</CodeTabs>

---

## Next Greater Element

Use stack to find next greater element for each position.

**Time Complexity:** O(n) | **Space Complexity:** O(n)

<CodeTabs>

```go
// Next greater element
func nextGreaterElement(nums []int) []int {
    n := len(nums)
    result := make([]int, n)
    for i := range result {
        result[i] = -1
    }
    stack := []int{} // stores indices
    
    for i := 0; i < n; i++ {
        for len(stack) > 0 && nums[i] > nums[stack[len(stack)-1]] {
            idx := stack[len(stack)-1]
            result[idx] = nums[i]
            stack = stack[:len(stack)-1]
        }
        stack = append(stack, i)
    }
    
    return result
}
```

```rust
// Next greater element
pub fn next_greater_element(nums: &[i32]) -> Vec<i32> {
    let n = nums.len();
    let mut result = vec![-1; n];
    let mut stack: Vec = Vec::new();
    
    for i in 0..n {
        while let Some(&top) = stack.last() {
            if nums[i] > nums[top] {
                result[top] = nums[i];
                stack.pop();
            } else {
                break;
            }
        }
        stack.push(i);
    }
    
    result
}
```

```python
# Next greater element
def next_greater_element(nums):
    n = len(nums)
    result = [-1] * n
    stack = []
    
    for i in range(n):
        while stack and nums[i] > nums[stack[-1]]:
            idx = stack.pop()
            result[idx] = nums[i]
        stack.append(i)
    
    return result
```

```javascript
// Next greater element
function nextGreaterElement(nums) {
    const n = nums.length;
    const result = new Array(n).fill(-1);
    const stack = [];
    
    for (let i = 0; i < n; i++) {
        while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
            const idx = stack.pop();
            result[idx] = nums[i];
        }
        stack.push(i);
    }
    
    return result;
}
```

</CodeTabs>

---

## Min Stack

Get minimum element in O(1) time.

**Time Complexity:** All O(1) | **Space Complexity:** O(n)

<CodeTabs>

```go
// Min Stack implementation
type MinStack struct {
    stack []int
    min   []int
}

func NewMinStack() *MinStack {
    return &MinStack{stack: []int{}, min: []int{}}
}

func (ms *MinStack) Push(val int) {
    ms.stack = append(ms.stack, val)
    if len(ms.min) == 0 || val <= ms.min[len(ms.min)-1] {
        ms.min = append(ms.min, val)
    } else {
        ms.min = append(ms.min, ms.min[len(ms.min)-1])
    }
}

func (ms *MinStack) Pop() {
    ms.stack = ms.stack[:len(ms.stack)-1]
    ms.min = ms.min[:len(ms.min)-1]
}

func (ms *MinStack) Top() int {
    return ms.stack[len(ms.stack)-1]
}

func (ms *MinStack) GetMin() int {
    return ms.min[len(ms.min)-1]
}
```

```rust
// Min Stack implementation
pub struct MinStack {
    stack: Vec,
    min: Vec,
}

impl MinStack {
    pub fn new() -> Self {
        MinStack { stack: Vec::new(), min: Vec::new() }
    }
    
    pub fn push(&mut self, val: i32) {
        self.stack.push(val);
        let current_min = *self.min.last().unwrap_or(&i32::MAX);
        self.min.push(current_min.min(val));
    }
    
    pub fn pop(&mut self) {
        self.stack.pop();
        self.min.pop();
    }
    
    pub fn top(&self) -> i32 {
        *self.stack.last().unwrap()
    }
    
    pub fn get_min(&self) -> i32 {
        *self.min.last().unwrap()
    }
}
```

```python
# Min Stack implementation
class MinStack:
    def __init__(self):
        self.stack = []
        self.min = []
    
    def push(self, val):
        self.stack.append(val)
        if not self.min or val <= self.min[-1]:
            self.min.append(val)
        else:
            self.min.append(self.min[-1])
    
    def pop(self):
        self.stack.pop()
        self.min.pop()
    
    def top(self):
        return self.stack[-1]
    
    def get_min(self):
        return self.min[-1]
```

```javascript
// Min Stack implementation
class MinStack {
    constructor() {
        this.stack = [];
        this.min = [];
    }
    
    push(val) {
        this.stack.push(val);
        if (this.min.length === 0 || val <= this.min[this.min.length - 1]) {
            this.min.push(val);
        } else {
            this.min.push(this.min[this.min.length - 1]);
        }
    }
    
    pop() {
        this.stack.pop();
        this.min.pop();
    }
    
    top() {
        return this.stack[this.stack.length - 1];
    }
    
    getMin() {
        return this.min[this.min.length - 1];
    }
}
```

</CodeTabs>

---

## When to Use Stack

- **Parentheses matching** - Check balanced brackets, HTML tags
- **Next Greater/Smaller** - Find next greater/smaller element
- **Expression evaluation** - Evaluate postfix expressions
- **Backtracking** - Store state, undo operations
- **Function calls** - Call stack in programming
- **Undo/Redo** - Store operations history
- **Depth-first search** - Track visited nodes