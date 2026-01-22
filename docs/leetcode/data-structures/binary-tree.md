# Binary Tree

Common binary tree operations and traversals.

## Overview

Binary tree is a tree data structure where each node has at most two children (left and right).

**Key Patterns:**
1. **Traversal** - In-order, Pre-order, Post-order, Level-order
2. **Properties** - Check BST, find max/min, calculate height
3. **Search** - Find node, find common ancestor

## Node Definition

<CodeTabs>

```go
// Binary tree node definition
type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}

func NewTreeNode(val int) *TreeNode {
    return &TreeNode{
        Val:   val,
        Left:  nil,
        Right: nil,
    }
}
```

```rust
// Binary tree node definition
pub struct TreeNode {
    pub val: i32,
    pub left: Option<Box<TreeNode>>,
    pub right: Option<Box<TreeNode>>,
}

impl TreeNode {
    pub fn new(val: i32) -> Self {
        TreeNode {
            val,
            left: None,
            right: None,
        }
    }
}
```

```python
# Binary tree node definition
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
```

```javascript
// Binary tree node definition
class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}
```

</CodeTabs>

---

## Tree Traversals

### In-Order Traversal

Left → Root → Right (yields sorted order for BST)

**Time Complexity:** O(n) | **Space Complexity:** O(h)

<CodeTabs>

```go
// In-order traversal (recursive)
func inorderTraversal(root *TreeNode) []int {
    result := []int{}
    inorderHelper(root, &result)
    return result
}

func inorderHelper(node *TreeNode, result *[]int) {
    if node == nil {
        return
    }
    inorderHelper(node.Left, result)
    *result = append(*result, node.Val)
    inorderHelper(node.Right, result)
}

// In-order traversal (iterative with stack)
func inorderTraversalIterative(root *TreeNode) []int {
    result := []int{}
    stack := []*TreeNode{}
    curr := root
    
    for curr != nil || len(stack) > 0 {
        for curr != nil {
            stack = append(stack, curr)
            curr = curr.Left
        }
        curr = stack[len(stack)-1]
        stack = stack[:len(stack)-1]
        result = append(result, curr.Val)
        curr = curr.Right
    }
    
    return result
}
```

```rust
// In-order traversal (recursive)
fn inorder_traversal(root: Option<Box<TreeNode>>>) -> Vec<i32> {
    let mut result = Vec::new();
    inorder_helper(&root, &mut result);
    result
}

fn inorder_helper(node: &Option<Box<TreeNode>>>, result: &mut Vec<i32>) {
    if let Some(n) = node {
        inorder_helper(&n.left, result);
        result.push(n.val);
        inorder_helper(&n.right, result);
    }
}

// In-order traversal (iterative with stack)
fn inorder_traversal_iterative(root: Option<Box<TreeNode>>>) -> Vec<i32> {
    let mut result = Vec::new();
    let mut stack: Vec> = Vec::new();
    let mut curr = root;
    
    while curr.is_some() || !stack.is_empty() {
        while let Some(node) = curr {
            stack.push(node);
            curr = node.as_ref().left.clone();
        }
        curr = stack.pop();
        result.push(curr.as_ref().unwrap().val);
        curr = curr.as_ref().unwrap().right.clone();
    }
    
    result
}
```

```python
# In-order traversal (recursive)
def inorder_traversal(root):
    result = []
    inorder_helper(root, result)
    return result

def inorder_helper(node, result):
    if not node:
        return
    inorder_helper(node.left, result)
    result.append(node.val)
    inorder_helper(node.right, result)

# In-order traversal (iterative with stack)
def inorder_traversal_iterative(root):
    result = []
    stack = []
    curr = root
    
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        result.append(curr.val)
        curr = curr.right
    
    return result
```

```javascript
// In-order traversal (recursive)
function inorderTraversal(root) {
    const result = [];
    inorderHelper(root, result);
    return result;
}

function inorderHelper(node, result) {
    if (!node) {
        return;
    }
    inorderHelper(node.left, result);
    result.push(node.val);
    inorderHelper(node.right, result);
}

// In-order traversal (iterative with stack)
function inorderTraversalIterative(root) {
    const result = [];
    const stack = [];
    let curr = root;
    
    while (curr || stack.length > 0) {
        while (curr) {
            stack.push(curr);
            curr = curr.left;
        }
        curr = stack.pop();
        result.push(curr.val);
        curr = curr.right;
    }
    
    return result;
}
```

</CodeTabs>

---

## Validate BST

Check if tree is valid binary search tree.

**Time Complexity:** O(n) | **Space Complexity:** O(h)

<CodeTabs>

```go
// Validate BST
func isValidBST(root *TreeNode) bool {
    return validateHelper(root, math.MinInt64, math.MaxInt64)
}

func validateHelper(node *TreeNode, min, max int64) bool {
    if node == nil {
        return true
    }
    
    if int64(node.Val) <= min || int64(node.Val) >= max {
        return false
    }
    
    return validateHelper(node.Left, min, int64(node.Val)) &&
           validateHelper(node.Right, int64(node.Val), max)
}
```

```rust
// Validate BST
pub fn is_valid_bst(root: Option<Box<TreeNode>>>) -> bool {
    validate_helper(&root, i64::MIN, i64::MAX)
}

fn validate_helper(node: &Option<Box<TreeNode>>>, min: i64, max: i64) -> bool {
    if let Some(n) = node {
        if n.val as i64 <= min || n.val as i64 >= max {
            return false;
        }
        return validate_helper(&n.left, min, n.val as i64) &&
               validate_helper(&n.right, n.val as i64, max);
    }
    true
}
```

```python
# Validate BST
def is_valid_bst(root):
    return validate_helper(root, float('-inf'), float('inf'))

def validate_helper(node, min_val, max_val):
    if not node:
        return True
    
    if node.val <= min_val or node.val >= max_val:
        return False
    
    return (validate_helper(node.left, min_val, node.val) and
            validate_helper(node.right, node.val, max_val))
```

```javascript
// Validate BST
function isValidBST(root) {
    return validateHelper(root, -Infinity, Infinity);
}

function validateHelper(node, min, max) {
    if (!node) {
        return true;
    }
    
    if (node.val <= min || node.val >= max) {
        return false;
    }
    
    return validateHelper(node.left, min, node.val) &&
           validateHelper(node.right, node.val, max);
}
```

</CodeTabs>

---

## Maximum Depth

Find the maximum depth/height of binary tree.

**Time Complexity:** O(n) | **Space Complexity:** O(h)

<CodeTabs>

```go
// Maximum depth (recursive)
func maxDepth(root *TreeNode) int {
    if root == nil {
        return 0
    }
    
    leftDepth := maxDepth(root.Left)
    rightDepth := maxDepth(root.Right)
    
    return 1 + max(leftDepth, rightDepth)
}

// Maximum depth (BFS/Level-order)
func maxDepthBFS(root *TreeNode) int {
    if root == nil {
        return 0
    }
    
    queue := []*TreeNode{root}
    depth := 0
    
    for len(queue) > 0 {
        levelSize := len(queue)
        depth++
        
        for i := 0; i < levelSize; i++ {
            node := queue[0]
            queue = queue[1:]
            
            if node.Left != nil {
                queue = append(queue, node.Left)
            }
            if node.Right != nil {
                queue = append(queue, node.Right)
            }
        }
    }
    
    return depth
}
```

```rust
// Maximum depth (recursive)
fn max_depth(root: Option<Box<TreeNode>>>) -> usize {
    match root {
        None => 0,
        Some(node) => {
            let left_depth = max_depth(node.left.clone());
            let right_depth = max_depth(node.right.clone());
            1 + left_depth.max(right_depth)
        }
    }
}

// Maximum depth (BFS/Level-order)
use std::collections::VecDeque;

fn max_depth_bfs(root: Option<Box<TreeNode>>>) -> usize {
    let root = match root {
        Some(r) => r,
        None => return 0,
    };
    
    let mut queue = VecDeque::new();
    queue.push_back(root);
    let mut depth = 0;
    
    while !queue.is_empty() {
        let level_size = queue.len();
        depth += 1;
        
        for _ in 0..level_size {
            let node = queue.pop_front().unwrap();
            
            if let Some(left) = node.left {
                queue.push_back(left);
            }
            if let Some(right) = node.right {
                queue.push_back(right);
            }
        }
    }
    
    depth
}
```

```python
# Maximum depth (recursive)
def max_depth(root):
    if not root:
        return 0
    
    left_depth = max_depth(root.left)
    right_depth = max_depth(root.right)
    
    return 1 + max(left_depth, right_depth)

# Maximum depth (BFS/Level-order)
from collections import deque

def max_depth_bfs(root):
    if not root:
        return 0
    
    queue = deque([root])
    depth = 0
    
    while queue:
        level_size = len(queue)
        depth += 1
        
        for _ in range(level_size):
            node = queue.popleft()
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return depth
```

```javascript
// Maximum depth (recursive)
function maxDepth(root) {
    if (!root) {
        return 0;
    }
    
    const leftDepth = maxDepth(root.left);
    const rightDepth = maxDepth(root.right);
    
    return 1 + Math.max(leftDepth, rightDepth);
}

// Maximum depth (BFS/Level-order)
function maxDepthBFS(root) {
    if (!root) {
        return 0;
    }
    
    const queue = [root];
    let depth = 0;
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        depth++;
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            
            if (node.left) {
                queue.push(node.left);
            }
            if (node.right) {
                queue.push(node.right);
            }
        }
    }
    
    return depth;
}
```

</CodeTabs>

---

## Level Order Traversal (BFS)

Traverse tree level by level from top to bottom.

**Time Complexity:** O(n) | **Space Complexity:** O(w) where w is max width

<CodeTabs>

```go
// Level order traversal (BFS)
func levelOrder(root *TreeNode) [][]int {
    if root == nil {
        return [][]int{}
    }
    
    result := [][]int{}
    queue := []*TreeNode{root}
    
    for len(queue) > 0 {
        levelSize := len(queue)
        currentLevel := []int{}
        
        for i := 0; i < levelSize; i++ {
            node := queue[0]
            queue = queue[1:]
            currentLevel = append(currentLevel, node.Val)
            
            if node.Left != nil {
                queue = append(queue, node.Left)
            }
            if node.Right != nil {
                queue = append(queue, node.Right)
            }
        }
        
        result = append(result, currentLevel)
    }
    
    return result
}
```

```rust
// Level order traversal (BFS)
use std::collections::VecDeque;

fn level_order(root: Option<Box<TreeNode>>>) -> Vec<Vec<i32>> {
    let root = match root {
        Some(r) => r,
        None => return vec![],
    };
    
    let mut result = Vec::new();
    let mut queue = VecDeque::new();
    queue.push_back(root);
    
    while !queue.is_empty() {
        let level_size = queue.len();
        let mut current_level = Vec::new();
        
        for _ in 0..level_size {
            let node = queue.pop_front().unwrap();
            current_level.push(node.val);
            
            if let Some(left) = node.left {
                queue.push_back(left);
            }
            if let Some(right) = node.right {
                queue.push_back(right);
            }
        }
        
        result.push(current_level);
    }
    
    result
}
```

```python
# Level order traversal (BFS)
from collections import deque

def level_order(root):
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(current_level)
    
    return result
```

```javascript
// Level order traversal (BFS)
function levelOrder(root) {
    if (!root) {
        return [];
    }
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node.val);
            
            if (node.left) {
                queue.push(node.left);
            }
            if (node.right) {
                queue.push(node.right);
            }
        }
        
        result.push(currentLevel);
    }
    
    return result;
}
```

</CodeTabs>

---

## Invert Binary Tree

Flip the binary tree horizontally (swap left and right for all nodes).

**Time Complexity:** O(n) | **Space Complexity:** O(h) for recursive, O(w) for iterative

<CodeTabs>

```go
// Invert binary tree (recursive)
func invertTree(root *TreeNode) *TreeNode {
    if root == nil {
        return nil
    }
    
    // Swap children
    root.Left, root.Right = root.Right, root.Left
    
    // Recurse
    invertTree(root.Left)
    invertTree(root.Right)
    
    return root
}

// Invert binary tree (BFS)
func invertTreeBFS(root *TreeNode) *TreeNode {
    if root == nil {
        return nil
    }
    
    queue := []*TreeNode{root}
    
    for len(queue) > 0 {
        node := queue[0]
        queue = queue[1:]
        
        // Swap children
        node.Left, node.Right = node.Right, node.Left
        
        if node.Left != nil {
            queue = append(queue, node.Left)
        }
        if node.Right != nil {
            queue = append(queue, node.Right)
        }
    }
    
    return root
}
```

```rust
// Invert binary tree (recursive)
pub fn invert_tree(root: Option<Box<TreeNode>>>) -> Option<Box<TreeNode>>> {
    match root {
        None => None,
        Some(mut node) => {
            // Swap children
            let left = node.left.take();
            let right = node.right.take();
            node.left = right;
            node.right = left;
            
            // Recurse
            node.left = invert_tree(node.left);
            node.right = invert_tree(node.right);
            
            Some(node)
        }
    }
}

// Invert binary tree (BFS)
use std::collections::VecDeque;

pub fn invert_tree_bfs(root: Option<Box<TreeNode>>>) -> Option<Box<TreeNode>>> {
    let root = match root {
        Some(r) => r,
        None => return None,
    };
    
    let mut queue = VecDeque::new();
    queue.push_back(root);
    
    while !queue.is_empty() {
        let mut node = queue.pop_front().unwrap();
        
        // Swap children
        let left = node.left.take();
        let right = node.right.take();
        node.left = right;
        node.right = left;
        
        if let Some(ref l) = node.left {
            queue.push_back(l.clone());
        }
        if let Some(ref r) = node.right {
            queue.push_back(r.clone());
        }
    }
    
    Some(node)
}
```

```python
# Invert binary tree (recursive)
def invert_tree(root):
    if not root:
        return None
    
    # Swap children
    root.left, root.right = root.right, root.left
    
    # Recurse
    invert_tree(root.left)
    invert_tree(root.right)
    
    return root

# Invert binary tree (BFS)
from collections import deque

def invert_tree_bfs(root):
    if not root:
        return None
    
    queue = deque([root])
    
    while queue:
        node = queue.popleft()
        
        # Swap children
        node.left, node.right = node.right, node.left
        
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    
    return root
```

```javascript
// Invert binary tree (recursive)
function invertTree(root) {
    if (!root) {
        return null;
    }
    
    // Swap children
    [root.left, root.right] = [root.right, root.left];
    
    // Recurse
    invertTree(root.left);
    invertTree(root.right);
    
    return root;
}

// Invert binary tree (BFS)
function invertTreeBFS(root) {
    if (!root) {
        return null;
    }
    
    const queue = [root];
    
    while (queue.length > 0) {
        const node = queue.shift();
        
        // Swap children
        [node.left, node.right] = [node.right, node.left];
        
        if (node.left) {
            queue.push(node.left);
        }
        if (node.right) {
            queue.push(node.right);
        }
    }
    
    return root;
}
```

</CodeTabs>

---

## Common Operations

| Operation | Go | Rust | Python | JS |
|-----------|----|----|----|-----|
| Create node | `&TreeNode{Val: v}` | `TreeNode::new(v)` | `TreeNode(v)` | `new TreeNode(v)` |
| Check null | `node == nil` | `node.is_none()` | `not node` | `!node` |
| Get depth | Recursive count | Recursive count | Recursive count | Recursive count |
| Leaf node | `node.Left == nil && node.Right == nil` | Same check | Same check | Same check |

## Traversal Comparison

| Traversal | Order | Use Case |
|-----------|-------|----------|
| Pre-order | Root → Left → Right | Copy tree, get prefix expression |
| In-order | Left → Root → Right | Sorted output from BST |
| Post-order | Left → Right → Root | Delete tree, get postfix expression |
| Level-order | Top to bottom, left to right | Shortest path, BFS |
| Reverse in-order | Right → Root → Left | Sorted descending from BST |