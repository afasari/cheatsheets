# Heap

Priority queue data structure with O(1) access to min/max element.

## Overview

Heap is a specialized tree-based data structure that satisfies the heap property:

**Types:**
- **Min-Heap** - Parent ≤ children (root is minimum)
- **Max-Heap** - Parent ≥ children (root is maximum)

**Common Operations:**
- **Insert** - Add element: O(log n)
- **Extract Min/Max** - Remove and return root: O(log n)
- **Peek** - Get root without removing: O(1)

## Heap as Array

Efficiently represent heap as array (0-indexed):

**Parent/Child Indexing:**
- Parent of i: `(i - 1) / 2`
- Left child of i: `2 * i + 1`
- Right child of i: `2 * i + 2`

---

## Min-Heap Implementation

Basic operations for min-heap.

**Time Complexity:** Insert O(log n), Extract O(log n), Peek O(1)

<CodeTabs>

```go
// Min-Heap implementation
type MinHeap struct {
    data []int
}

func NewMinHeap() *MinHeap {
    return &MinHeap{data: []int{}}
}

func (h *MinHeap) Insert(val int) {
    h.data = append(h.data, val)
    h.heapifyUp(len(h.data) - 1)
}

func (h *MinHeap) ExtractMin() int {
    if len(h.data) == 0 {
        return 0
    }
    
    min := h.data[0]
    h.data[0] = h.data[len(h.data)-1]
    h.data = h.data[:len(h.data)-1]
    h.heapifyDown(0)
    return min
}

func (h *MinHeap) Peek() int {
    if len(h.data) == 0 {
        return 0
    }
    return h.data[0]
}

func (h *MinHeap) Size() int {
    return len(h.data)
}

func (h *MinHeap) IsEmpty() bool {
    return len(h.data) == 0
}

func (h *MinHeap) heapifyUp(index int) {
    for index > 0 {
        parent := (index - 1) / 2
        if h.data[parent] > h.data[index] {
            h.data[parent], h.data[index] = h.data[index], h.data[parent]
            index = parent
        } else {
            break
        }
    }
}

func (h *MinHeap) heapifyDown(index int) {
    size := len(h.data)
    for {
        left := 2*index + 1
        right := 2*index + 2
        smallest := index
        
        if left < size && h.data[left] < h.data[smallest] {
            smallest = left
        }
        
        if right < size && h.data[right] < h.data[smallest] {
            smallest = right
        }
        
        if smallest != index {
            h.data[index], h.data[smallest] = h.data[smallest], h.data[index]
            index = smallest
        } else {
            break
        }
    }
}
```

```rust
// Min-Heap implementation
pub struct MinHeap {
    data: Vec<i32>,
}

impl MinHeap {
    pub fn new() -> Self {
        MinHeap { data: Vec::new() }
    }
    
    pub fn insert(&mut self, val: i32) {
        self.data.push(val);
        self.heapify_up(self.data.len() - 1);
    }
    
    pub fn extract_min(&mut self) -> Option<i32> {
        if self.data.is_empty() {
            return None;
        }
        
        let min = self.data[0];
        let last = self.data.pop().unwrap();
        if !self.data.is_empty() {
            self.data[0] = last;
            self.heapify_down(0);
        }
        Some(min)
    }
    
    pub fn peek(&self) -> Option<i32> {
        self.data.first().copied()
    }
    
    pub fn size(&self) -> usize {
        self.data.len()
    }
    
    pub fn is_empty(&self) -> bool {
        self.data.is_empty()
    }
    
    fn heapify_up(&mut self, index: usize) {
        let mut i = index;
        while i > 0 {
            let parent = (i - 1) / 2;
            if self.data[parent] > self.data[i] {
                self.data.swap(parent, i);
                i = parent;
            } else {
                break;
            }
        }
    }
    
    fn heapify_down(&mut self, mut index: usize) {
        let size = self.data.len();
        loop {
            let left = 2 * index + 1;
            let right = 2 * index + 2;
            let mut smallest = index;
            
            if left < size && self.data[left] < self.data[smallest] {
                smallest = left;
            }
            
            if right < size && self.data[right] < self.data[smallest] {
                smallest = right;
            }
            
            if smallest != index {
                self.data.swap(index, smallest);
                index = smallest;
            } else {
                break;
            }
        }
    }
}
```

```python
# Min-Heap implementation
class MinHeap:
    def __init__(self):
        self.data = []
    
    def insert(self, val):
        self.data.append(val)
        self._heapify_up(len(self.data) - 1)
    
    def extract_min(self):
        if not self.data:
            return None
        
        min_val = self.data[0]
        self.data[0] = self.data[-1]
        self.data.pop()
        self._heapify_down(0)
        return min_val
    
    def peek(self):
        return self.data[0] if self.data else None
    
    def size(self):
        return len(self.data)
    
    def is_empty(self):
        return len(self.data) == 0
    
    def _heapify_up(self, index):
        while index > 0:
            parent = (index - 1) // 2
            if self.data[parent] > self.data[index]:
                self.data[parent], self.data[index] = self.data[index], self.data[parent]
                index = parent
            else:
                break
    
    def _heapify_down(self, index):
        size = len(self.data)
        while True:
            left = 2 * index + 1
            right = 2 * index + 2
            smallest = index
            
            if left < size and self.data[left] < self.data[smallest]:
                smallest = left
            if right < size and self.data[right] < self.data[smallest]:
                smallest = right
            
            if smallest != index:
                self.data[index], self.data[smallest] = self.data[smallest], self.data[index]
                index = smallest
            else:
                break
```

```javascript
// Min-Heap implementation
class MinHeap {
    constructor() {
        this.data = [];
    }
    
    insert(val) {
        this.data.push(val);
        this.heapifyUp(this.data.length - 1);
    }
    
    extractMin() {
        if (this.data.length === 0) {
            return undefined;
        }
        
        const min = this.data[0];
        this.data[0] = this.data[this.data.length - 1];
        this.data.pop();
        this.heapifyDown(0);
        return min;
    }
    
    peek() {
        return this.data.length > 0 ? this.data[0] : undefined;
    }
    
    size() {
        return this.data.length;
    }
    
    isEmpty() {
        return this.data.length === 0;
    }
    
    heapifyUp(index) {
        while (index > 0) {
            const parent = Math.floor((index - 1) / 2);
            if (this.data[parent] > this.data[index]) {
                [this.data[parent], this.data[index]] = [this.data[index], this.data[parent]];
                index = parent;
            } else {
                break;
            }
        }
    }
    
    heapifyDown(index) {
        const size = this.data.length;
        while (true) {
            const left = 2 * index + 1;
            const right = 2 * index + 2;
            let smallest = index;
            
            if (left < size && this.data[left] < this.data[smallest]) {
                smallest = left;
            }
            
            if (right < size && this.data[right] < this.data[smallest]) {
                smallest = right;
            }
            
            if (smallest !== index) {
                [this.data[index], this.data[smallest]] = [this.data[smallest], this.data[index]];
                index = smallest;
            } else {
                break;
            }
        }
    }
}
```

</CodeTabs>

---

## Max-Heap Implementation

Basic operations for max-heap (useful for priority queues).

<CodeTabs>

```go
// Max-Heap implementation
type MaxHeap struct {
    data []int
}

func NewMaxHeap() *MaxHeap {
    return &MaxHeap{data: []int{}}
}

func (h *MaxHeap) Insert(val int) {
    h.data = append(h.data, val)
    h.heapifyUp(len(h.data) - 1)
}

func (h *MaxHeap) ExtractMax() int {
    if len(h.data) == 0 {
        return 0
    }
    
    max := h.data[0]
    h.data[0] = h.data[len(h.data)-1]
    h.data = h.data[:len(h.data)-1]
    h.heapifyDown(0)
    return max
}

func (h *MaxHeap) Peek() int {
    if len(h.data) == 0 {
        return 0
    }
    return h.data[0]
}

func (h *MaxHeap) heapifyUp(index int) {
    for index > 0 {
        parent := (index - 1) / 2
        if h.data[parent] < h.data[index] {
            h.data[parent], h.data[index] = h.data[index], h.data[parent]
            index = parent
        } else {
            break
        }
    }
}

func (h *MaxHeap) heapifyDown(index int) {
    size := len(h.data)
    for {
        left := 2*index + 1
        right := 2*index + 2
        largest := index
        
        if left < size && h.data[left] > h.data[largest] {
            largest = left
        }
        
        if right < size && h.data[right] > h.data[largest] {
            largest = right
        }
        
        if largest != index {
            h.data[index], h.data[largest] = h.data[largest], h.data[index]
            index = largest
        } else {
            break
        }
    }
}
```

```rust
// Max-Heap implementation
pub struct MaxHeap {
    data: Vec<i32>,
}

impl MaxHeap {
    pub fn new() -> Self {
        MaxHeap { data: Vec::new() }
    }
    
    pub fn insert(&mut self, val: i32) {
        self.data.push(val);
        self.heapify_up(self.data.len() - 1);
    }
    
    pub fn extract_max(&mut self) -> Option<i32> {
        if self.data.is_empty() {
            return None;
        }
        
        let max = self.data[0];
        let last = self.data.pop().unwrap();
        if !self.data.is_empty() {
            self.data[0] = last;
            self.heapify_down(0);
        }
        Some(max)
    }
    
    pub fn peek(&self) -> Option<i32> {
        self.data.first().copied()
    }
    
    fn heapify_up(&mut self, index: usize) {
        let mut i = index;
        while i > 0 {
            let parent = (i - 1) / 2;
            if self.data[parent] < self.data[i] {
                self.data.swap(parent, i);
                i = parent;
            } else {
                break;
            }
        }
    }
    
    fn heapify_down(&mut self, mut index: usize) {
        let size = self.data.len();
        loop {
            let left = 2 * index + 1;
            let right = 2 * index + 2;
            let mut largest = index;
            
            if left < size && self.data[left] > self.data[largest] {
                largest = left;
            }
            
            if right < size && self.data[right] > self.data[largest] {
                largest = right;
            }
            
            if largest != index {
                self.data.swap(index, largest);
                index = largest;
            } else {
                break;
            }
        }
    }
}
```

```python
# Max-Heap implementation
class MaxHeap:
    def __init__(self):
        self.data = []
    
    def insert(self, val):
        self.data.append(val)
        self._heapify_up(len(self.data) - 1)
    
    def extract_max(self):
        if not self.data:
            return None
        
        max_val = self.data[0]
        self.data[0] = self.data[-1]
        self.data.pop()
        self._heapify_down(0)
        return max_val
    
    def peek(self):
        return self.data[0] if self.data else None
    
    def _heapify_up(self, index):
        while index > 0:
            parent = (index - 1) // 2
            if self.data[parent] < self.data[index]:
                self.data[parent], self.data[index] = self.data[index], self.data[parent]
                index = parent
            else:
                break
    
    def _heapify_down(self, index):
        size = len(self.data)
        while True:
            left = 2 * index + 1
            right = 2 * index + 2
            largest = index
            
            if left < size and self.data[left] > self.data[largest]:
                largest = left
            if right < size and self.data[right] > self.data[largest]:
                largest = right
            
            if largest != index:
                self.data[index], self.data[largest] = self.data[largest], self.data[index]
                index = largest
            else:
                break
```

```javascript
// Max-Heap implementation
class MaxHeap {
    constructor() {
        this.data = [];
    }
    
    insert(val) {
        this.data.push(val);
        this.heapifyUp(this.data.length - 1);
    }
    
    extractMax() {
        if (this.data.length === 0) {
            return undefined;
        }
        
        const max = this.data[0];
        this.data[0] = this.data[this.data.length - 1];
        this.data.pop();
        this.heapifyDown(0);
        return max;
    }
    
    peek() {
        return this.data.length > 0 ? this.data[0] : undefined;
    }
    
    heapifyUp(index) {
        while (index > 0) {
            const parent = Math.floor((index - 1) / 2);
            if (this.data[parent] < this.data[index]) {
                [this.data[parent], this.data[index]] = [this.data[index], this.data[parent]];
                index = parent;
            } else {
                break;
            }
        }
    }
    
    heapifyDown(index) {
        const size = this.data.length;
        while (true) {
            const left = 2 * index + 1;
            const right = 2 * index + 2;
            let largest = index;
            
            if (left < size && this.data[left] > this.data[largest]) {
                largest = left;
            }
            
            if (right < size && this.data[right] > this.data[largest]) {
                largest = right;
            }
            
            if (largest !== index) {
                [this.data[index], this.data[largest]] = [this.data[largest], this.data[index]];
                index = largest;
            } else {
                break;
            }
        }
    }
}
```

</CodeTabs>

---

## Kth Largest Element

Find Kth largest element using heap.

**Time Complexity:** O(n log k) | **Space Complexity:** O(k)

<CodeTabs>

```go
// Kth largest element using min-heap of size K
func findKthLargest(nums []int, k int) int {
    if k > len(nums) {
        return -1
    }
    
    heap := NewMinHeap()
    
    // Build heap with first K elements
    for i := 0; i < k; i++ {
        heap.Insert(nums[i])
    }
    
    // Process remaining elements
    for i := k; i < len(nums); i++ {
        if nums[i] > heap.Peek() {
            heap.ExtractMin()
            heap.Insert(nums[i])
        }
    }
    
    return heap.Peek()
}
```

```rust
// Kth largest element using min-heap of size K
fn find_kth_largest(nums: &[i32], k: usize) -> Option<i32> {
    if k > nums.len() {
        return None;
    }
    
    let mut heap = MinHeap::new();
    
    // Build heap with first K elements
    for i in 0..k {
        heap.insert(nums[i]);
    }
    
    // Process remaining elements
    for i in k..nums.len() {
        if nums[i] > heap.peek().unwrap() {
            heap.extract_min();
            heap.insert(nums[i]);
        }
    }
    
    heap.peek()
}
```

```python
# Kth largest element using min-heap of size K
import heapq

def find_kth_largest(nums, k):
    if k > len(nums):
        return None
    
    # Use Python's heapq for min-heap
    heap = nums[:k]
    heapq.heapify(heap)
    
    # Process remaining elements
    for num in nums[k:]:
        if num > heap[0]:
            heapq.heapreplace(heap, num)
    
    return heap[0]
```

```javascript
// Kth largest element using min-heap of size K
function findKthLargest(nums, k) {
    if (k > nums.length) {
        return undefined;
    }
    
    const heap = new MinHeap();
    
    // Build heap with first K elements
    for (let i = 0; i < k; i++) {
        heap.insert(nums[i]);
    }
    
    // Process remaining elements
    for (let i = k; i < nums.length; i++) {
        if (nums[i] > heap.peek()) {
            heap.extractMin();
            heap.insert(nums[i]);
        }
    }
    
    return heap.peek();
}
```

</CodeTabs>

---

## Merge K Sorted Lists

Merge K sorted linked lists using heap.

**Time Complexity:** O(n log k) | **Space Complexity:** O(k)

<CodeTabs>

```go
// Merge K sorted linked lists using heap
import "container/heap"

type ListNode struct {
    Val  int
    Next *ListNode
}

type HeapNode struct {
    node *ListNode
}

func mergeKLists(lists []*ListNode) *ListNode {
    h := &[]HeapNode{}
    heap.Init(h)
    
    // Push all list heads into heap
    for _, list := range lists {
        if list != nil {
            heap.Push(h, &HeapNode{node: list})
        }
    }
    
    dummy := &ListNode{}
    curr := dummy
    
    for h.Len() > 0 {
        min := heap.Pop(h).(*HeapNode)
        curr.Next = min.node
        curr = curr.Next
        
        if min.node.Next != nil {
            heap.Push(h, &HeapNode{node: min.node.Next})
        }
    }
    
    return dummy.Next
}

func (h HeapNode) Less(i, j HeapNode) bool {
    return i.node.Val < j.node.Val
}
```

```rust
// Merge K sorted linked lists using heap
use std::collections::BinaryHeap;
use std::cmp::Reverse;

pub struct ListNode {
    pub val: i32,
    pub next: Option<Box<ListNode>>,
}

#[derive(Eq, PartialEq, PartialOrd, Ord)]
struct HeapNode {
    node: *ListNode,
}

impl PartialOrd for HeapNode {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.node.val.cmp(&other.node.val))
    }
}

impl Ord for HeapNode {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        self.node.val.cmp(&other.node.val)
    }
}

pub fn merge_k_lists(lists: Vec<Option<Box<ListNode>>>> -> Option<Box<ListNode>>> {
    let mut heap = BinaryHeap::new();
    
    // Push all list heads into heap
    for list in lists {
        if let Some(node) = list {
            heap.push(HeapNode { node: &node });
        }
    }
    
    let dummy = ListNode::new(0);
    let mut curr = &dummy;
    
    while !heap.is_empty() {
        let min = heap.pop().unwrap();
        curr.next = Some(Box::new(unsafe { (*min.node).clone() }));
        curr = curr.next.as_mut().unwrap();
        
        if min.node.next.is_some() {
            heap.push(HeapNode { node: &min.node.next.as_ref().unwrap() });
        }
    }
    
    dummy.next.take()
}
```

```python
# Merge K sorted linked lists using heap
import heapq
from typing import List, Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_k_lists(lists: List[Optional[ListNode]]]) -> Optional[ListNode]:
    heap = []
    
    # Push all list heads into heap
    for lst in lists:
        if lst:
            heapq.heappush(heap, (lst.val, id(lst), lst))
    
    dummy = ListNode(0)
    curr = dummy
    
    while heap:
        val, _, node = heapq.heappop(heap)
        curr.next = ListNode(val)
        curr = curr.next
        
        if node.next:
            heapq.heappush(heap, (node.next.val, id(node.next), node.next))
    
    return dummy.next
```

```javascript
// Merge K sorted linked lists using heap
function mergeKLists(lists) {
    const heap = [];
    
    // Push all list heads into heap
    for (const list of lists) {
        if (list !== null) {
            heap.push([list.val, list]);
        }
    }
    
    const dummy = new ListNode(0);
    let curr = dummy;
    
    // Build min-heap
    heap.sort((a, b) => a[0] - b[0]);
    
    while (heap.length > 0) {
        const [val, node] = heap.shift();
        curr.next = new ListNode(val);
        curr = curr.next;
        
        if (node.next !== null) {
            heap.push([node.next.val, node.next]);
            heap.sort((a, b) => a[0] - b[0]);
        }
    }
    
    return dummy.next;
}
```

</CodeTabs>

---

## When to Use Heap

- **Top K elements** - Find K largest/smallest elements
- **Priority Queue** - Task scheduling, Dijkstra's algorithm
- **Stream processing** - Find median from stream
- **Merge sorted streams** - Merge K sorted arrays/lists
- **Memory management** - Allocate resources based on priority

## Common Operations

| Operation | Time | Space | Use Case |
|-----------|------|--------|----------|
| Insert | O(log n) | O(1) amortized | Add element |
| Extract Min/Max | O(log n) | O(1) amortized | Get and remove |
| Peek | O(1) | O(1) | Get without remove |
| Build Heap | O(n) | O(n) | Heapify array |
| Search | O(n) | O(1) | Not common operation |

## Common Mistakes

- Using wrong comparison (min vs max heap)
- Off-by-one errors in parent/child calculation
- Not handling empty heap case
- Incorrect heapify direction (up vs down)
- Using O(n) operations in loop (use heap for efficiency)