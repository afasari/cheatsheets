# Linked List

Common linked list operations and patterns.

## Fast & Slow Pointers

Use two pointers moving at different speeds to detect cycles, find middle, etc.

**Time Complexity:** O(n) | **Space Complexity:** O(1)

<CodeTabs>

```go
// Detect cycle in linked list
type ListNode struct {
    Val  int
    Next *ListNode
}

func hasCycle(head *ListNode) bool {
    slow, fast := head, head
    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next
        if slow == fast {
            return true
        }
    }
    return false
}
```

```rust
// Detect cycle in linked list
pub struct ListNode {
    pub val: i32,
    pub next: Option<Box<ListNode>>,
}

impl ListNode {
    pub fn new(val: i32) -> Self {
        ListNode { val, next: None }
    }
}

pub fn has_cycle(head: Option<Box<ListNode>>) -> bool {
    let mut slow = &head;
    let mut fast = &head;
    while let Some(fast_node) = fast {
        if let Some(next_fast) = &fast_node.next {
            fast = next_fast;
            slow = &slow.as_ref().unwrap().next;
            if std::ptr::eq(slow, fast) {
                return true;
            }
        }
    }
    false
}
```

```python
# Detect cycle in linked list
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def has_cycle(head):
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False
```

```javascript
// Detect cycle in linked list
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function hasCycle(head) {
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) {
            return true;
        }
    }
    return false;
}
```

</CodeTabs>

**When to use:**
- Detecting cycles
- Finding middle element
- Detecting intersection of two lists

---

## Find Middle Node

Use slow/fast pointers to find middle element in one pass.

**Time Complexity:** O(n) | **Space Complexity:** O(1)

<CodeTabs>

```go
// Find middle of linked list
func findMiddle(head *ListNode) *ListNode {
    slow, fast := head, head
    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next
    }
    return slow
}
```

```rust
// Find middle of linked list
pub fn find_middle(mut head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
    let mut slow = &head;
    let mut fast = &head;
    while let Some(fast_node) = fast {
        if let Some(_) = fast_node.next {
            fast = fast_node.next;
            slow = &slow.as_ref().unwrap().next;
        }
    }
    slow.as_ref().map(|n| n.as_ref().unwrap().clone())
}
```

```python
# Find middle of linked list
def find_middle(head):
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow
```

```javascript
// Find middle of linked list
function findMiddle(head) {
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}
```

</CodeTabs>

---

## Reverse Linked List

Reverse the direction of pointers in a linked list.

**Time Complexity:** O(n) | **Space Complexity:** O(1)

<CodeTabs>

```go
// Reverse linked list iteratively
func reverseList(head *ListNode) *ListNode {
    var prev *ListNode
    curr := head
    for curr != nil {
        next := curr.Next
        curr.Next = prev
        prev = curr
        curr = next
    }
    return prev
}
```

```rust
// Reverse linked list iteratively
pub fn reverse_list(mut head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
    let mut prev = None;
    while let Some(mut node) = head {
        head = node.next.take();
        node.next = prev.take();
        prev = Some(node);
    }
    prev
}
```

```python
# Reverse linked list iteratively
def reverse_list(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev
```

```javascript
// Reverse linked list iteratively
function reverseList(head) {
    let prev = null, curr = head;
    while (curr) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}
```

</CodeTabs>

**When to use:**
- Reversing direction of traversal
- Checking palindrome (reverse and compare)
- Reordering operations

---

## Dummy Node Pattern

Use a dummy head to simplify edge cases when manipulating head.

**Time Complexity:** O(n) | **Space Complexity:** O(1)

<CodeTabs>

```go
// Remove elements with specific value
func removeElements(head *ListNode, val int) *ListNode {
    dummy := &ListNode{Next: head}
    curr := dummy
    for curr.Next != nil {
        if curr.Next.Val == val {
            curr.Next = curr.Next.Next
        } else {
            curr = curr.Next
        }
    }
    return dummy.Next
}
```

```rust
// Remove elements with specific value
pub fn remove_elements(mut head: Option<Box<ListNode>>, val: i32) -> Option<Box<ListNode>> {
    let mut dummy = ListNode { val: 0, next: head };
    let mut curr = &mut dummy;
    while let Some(ref next_node) = curr.next {
        if next_node.val == val {
            curr.next = next_node.next.take();
        } else {
            curr = curr.next.as_mut().unwrap();
        }
    }
    dummy.next.take()
}
```

```python
# Remove elements with specific value
def remove_elements(head, val):
    dummy = ListNode(0, head)
    curr = dummy
    while curr.next:
        if curr.next.val == val:
            curr.next = curr.next.next
        else:
            curr = curr.next
    return dummy.next
```

```javascript
// Remove elements with specific value
function removeElements(head, val) {
    const dummy = new ListNode(0, head);
    let curr = dummy;
    while (curr.next) {
        if (curr.next.val === val) {
            curr.next = curr.next.next;
        } else {
            curr = curr.next;
        }
    }
    return dummy.next;
}
```

</CodeTabs>

**When to use:**
- Removing nodes from head
- Inserting before head
- Any operation that modifies head

---

## Merge Two Sorted Lists

Merge two sorted linked lists into one sorted list.

**Time Complexity:** O(n + m) | **Space Complexity:** O(1)

<CodeTabs>

```go
// Merge two sorted lists
func mergeTwoLists(list1, list2 *ListNode) *ListNode {
    dummy := &ListNode{}
    curr := dummy
    
    for list1 != nil && list2 != nil {
        if list1.Val <= list2.Val {
            curr.Next = list1
            list1 = list1.Next
        } else {
            curr.Next = list2
            list2 = list2.Next
        }
        curr = curr.Next
    }
    
    if list1 != nil {
        curr.Next = list1
    } else {
        curr.Next = list2
    }
    
    return dummy.Next
}
```

```rust
// Merge two sorted lists
pub fn merge_two_lists(
    list1: Option<Box<ListNode>>,
    list2: Option<Box<ListNode>>
) -> Option<Box<ListNode>> {
    let mut dummy = ListNode::new(0);
    let mut curr = &mut dummy;
    let mut l1 = list1;
    let mut l2 = list2;
    
    while l1.is_some() && l2.is_some() {
        if l1.as_ref().unwrap().val <= l2.as_ref().unwrap().val {
            curr.next = l1.take();
            curr = curr.next.as_mut().unwrap();
            l1 = curr.next.take();
        } else {
            curr.next = l2.take();
            curr = curr.next.as_mut().unwrap();
            l2 = curr.next.take();
        }
    }
    
    curr.next = if l1.is_some() { l1 } else { l2 };
    dummy.next.take()
}
```

```python
# Merge two sorted lists
def merge_two_lists(list1, list2):
    dummy = ListNode(0)
    curr = dummy
    
    while list1 and list2:
        if list1.val <= list2.val:
            curr.next = list1
            list1 = list1.next
        else:
            curr.next = list2
            list2 = list2.next
        curr = curr.next
    
    curr.next = list1 if list1 else list2
    return dummy.next
```

```javascript
// Merge two sorted lists
function mergeTwoLists(list1, list2) {
    const dummy = new ListNode(0);
    let curr = dummy;
    
    while (list1 && list2) {
        if (list1.val <= list2.val) {
            curr.next = list1;
            list1 = list1.next;
        } else {
            curr.next = list2;
            list2 = list2.next;
        }
        curr = curr.next;
    }
    
    curr.next = list1 || list2;
    return dummy.next;
}
```

</CodeTabs>

---

## Common Operations

| Operation | Go | Rust | Python | JS |
|-----------|----|----|----|-----|
| Get length | Iterate and count | Iterate and count | `len(head)` (if custom) | Iterate and count |
| Find node | Traverse list | Traverse list | Traverse list | Traverse list |
| Delete node | Update pointers | Update pointers | Update pointers | Update pointers |
| Insert at head | `newNode.Next = head` | `newNode.next = head` | `newNode.next = head` | `newNode.next = head` |