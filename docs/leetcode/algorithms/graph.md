# Graph Algorithms

Common graph traversal and shortest path algorithms.

## Overview

Graph consists of vertices (nodes) connected by edges.

**Graph Types:**
- **Directed** - Edges have direction
- **Undirected** - Edges are bidirectional
- **Weighted** - Edges have weights/costs
- **Unweighted** - All edges equal

**Representations:**
- **Adjacency List** - Map/array of neighbors
- **Adjacency Matrix** - 2D matrix of edges

---

## Graph Representation

<CodeTabs>

```go
// Adjacency list representation
type Graph struct {
    vertices int
    edges     map[int][]int // vertex -> [neighbors]
}

func NewGraph(vertices int) *Graph {
    return &Graph{
        vertices: vertices,
        edges:     make(map[int][]int),
    }
}

func (g *Graph) AddEdge(u, v int, directed bool) {
    g.edges[u] = append(g.edges[u], v)
    if !directed {
        g.edges[v] = append(g.edges[v], u)
    }
}

func (g *Graph) GetNeighbors(v int) []int {
    return g.edges[v]
}
```

```rust
// Adjacency list representation
use std::collections::HashMap;

pub struct Graph {
    pub vertices: usize,
    pub edges: HashMap<usize, Vec<usize>>,
}

impl Graph {
    pub fn new(vertices: usize) -> Self {
        Graph {
            vertices,
            edges: HashMap::new(),
        }
    }
    
    pub fn add_edge(&mut self, u: usize, v: usize, directed: bool) {
        self.edges.entry(u).or_insert(Vec::new()).push(v);
        if !directed {
            self.edges.entry(v).or_insert(Vec::new()).push(u);
        }
    }
    
    pub fn get_neighbors(&self, v: usize) -> Option<&Vec<usize>> {
        self.edges.get(&v)
    }
}
```

```python
# Adjacency list representation
from collections import defaultdict

class Graph:
    def __init__(self, vertices):
        self.vertices = vertices
        self.edges = defaultdict(list)
    
    def add_edge(self, u, v, directed=False):
        self.edges[u].append(v)
        if not directed:
            self.edges[v].append(u)
    
    def get_neighbors(self, v):
        return self.edges[v]
```

```javascript
// Adjacency list representation
class Graph {
    constructor(vertices) {
        this.vertices = vertices;
        this.edges = new Map();
    }
    
    addEdge(u, v, directed = false) {
        if (!this.edges.has(u)) {
            this.edges.set(u, []);
        }
        if (!this.edges.has(v) && !directed) {
            this.edges.set(v, []);
        }
        this.edges.get(u).push(v);
        if (!directed) {
            this.edges.get(v).push(u);
        }
    }
    
    getNeighbors(v) {
        return this.edges.get(v) || [];
    }
}
```

</CodeTabs>

---

## Depth First Search (DFS)

Explore as deep as possible before backtracking. Good for path finding, cycle detection.

**Time Complexity:** O(V + E) | **Space Complexity:** O(V)

<CodeTabs>

```go
// DFS - Recursive
func dfs(graph *Graph, start int, visited *map[int]bool) {
    (*visited)[start] = true
    fmt.Printf("Visited: %d\n", start)
    
    for _, neighbor := range graph.GetNeighbors(start) {
        if !(*visited)[neighbor] {
            dfs(graph, neighbor, visited)
        }
    }
}

// DFS - Iterative with stack
func dfsIterative(graph *Graph, start int) []int {
    visited := make(map[int]bool)
    stack := []int{start}
    result := []int{}
    
    for len(stack) > 0 {
        node := stack[len(stack)-1]
        stack = stack[:len(stack)-1]
        
        if !visited[node] {
            visited[node] = true
            result = append(result, node)
            
            // Push neighbors in reverse order
            neighbors := graph.GetNeighbors(node)
            for i := len(neighbors) - 1; i >= 0; i-- {
                if !visited[neighbors[i]] {
                    stack = append(stack, neighbors[i])
                }
            }
        }
    }
    
    return result
}

// Detect cycle using DFS
func hasCycleDFS(graph *Graph) bool {
    visited := make(map[int]bool)
    recStack := make(map[int]bool)
    
    for v := 0; v < graph.vertices; v++ {
        if !visited[v] && hasCycleDFSHelper(graph, v, &visited, &recStack) {
            return true
        }
    }
    
    return false
}

func hasCycleDFSHelper(graph *Graph, v int, visited, recStack *map[int]bool) bool {
    (*visited)[v] = true
    (*recStack)[v] = true
    
    for _, neighbor := range graph.GetNeighbors(v) {
        if !(*visited)[neighbor] {
            if hasCycleDFSHelper(graph, neighbor, visited, recStack) {
                return true
            }
        } else if (*recStack)[neighbor] {
            return true
        }
    }
    
    (*recStack)[v] = false
    return false
}
```

```rust
// DFS - Recursive
fn dfs(graph: &Graph, start: usize, visited: &mut Vec<bool>) {
    visited[start] = true;
    println!("Visited: {}", start);
    
    if let Some(neighbors) = graph.get_neighbors(start) {
        for &neighbor in neighbors {
            if !visited[neighbor] {
                dfs(graph, neighbor, visited);
            }
        }
    }
}

// DFS - Iterative with stack
fn dfs_iterative(graph: &Graph, start: usize) -> Vec<usize> {
    let mut visited = vec![false; graph.vertices];
    let mut stack = vec![start];
    let mut result = Vec::new();
    
    while !stack.is_empty() {
        let node = stack.pop().unwrap();
        
        if !visited[node] {
            visited[node] = true;
            result.push(node);
            
            if let Some(neighbors) = graph.get_neighbors(node) {
                for &neighbor in neighbors.iter().rev() {
                    if !visited[neighbor] {
                        stack.push(neighbor);
                    }
                }
            }
        }
    }
    
    result
}

// Detect cycle using DFS
fn has_cycle_dfs(graph: &Graph) -> bool {
    let mut visited = vec![false; graph.vertices];
    let mut rec_stack = vec![false; graph.vertices];
    
    for v in 0..graph.vertices {
        if !visited[v] && has_cycle_dfs_helper(graph, v, &mut visited, &mut rec_stack) {
            return true;
        }
    }
    
    false
}

fn has_cycle_dfs_helper(graph: &Graph, v: usize, visited: &mut [bool], rec_stack: &mut [bool]) -> bool {
    visited[v] = true;
    rec_stack[v] = true;
    
    if let Some(neighbors) = graph.get_neighbors(v) {
        for &neighbor in neighbors {
            if !visited[neighbor] {
                if has_cycle_dfs_helper(graph, neighbor, visited, rec_stack) {
                    return true;
                }
            } else if rec_stack[neighbor] {
                return true;
            }
        }
    }
    
    rec_stack[v] = false;
    false
}
```

```python
# DFS - Recursive
def dfs(graph, start, visited):
    visited[start] = True
    print(f"Visited: {start}")
    
    for neighbor in graph.get_neighbors(start):
        if not visited[neighbor]:
            dfs(graph, neighbor, visited)

# DFS - Iterative with stack
def dfs_iterative(graph, start):
    visited = [False] * graph.vertices
    stack = [start]
    result = []
    
    while stack:
        node = stack.pop()
        
        if not visited[node]:
            visited[node] = True
            result.append(node)
            
            # Push neighbors in reverse order
            for neighbor in reversed(graph.get_neighbors(node)):
                if not visited[neighbor]:
                    stack.append(neighbor)
    
    return result

# Detect cycle using DFS
def has_cycle_dfs(graph):
    visited = [False] * graph.vertices
    rec_stack = [False] * graph.vertices
    
    for v in range(graph.vertices):
        if not visited[v] and has_cycle_dfs_helper(graph, v, visited, rec_stack):
            return True
    
    return False

def has_cycle_dfs_helper(graph, v, visited, rec_stack):
    visited[v] = True
    rec_stack[v] = True
    
    for neighbor in graph.get_neighbors(v):
        if not visited[neighbor]:
            if has_cycle_dfs_helper(graph, neighbor, visited, rec_stack):
                return True
        elif rec_stack[neighbor]:
            return True
    
    rec_stack[v] = False
    return False
```

```javascript
// DFS - Recursive
function dfs(graph, start, visited) {
    visited[start] = true;
    console.log(`Visited: ${start}`);
    
    for (const neighbor of graph.getNeighbors(start)) {
        if (!visited[neighbor]) {
            dfs(graph, neighbor, visited);
        }
    }
}

// DFS - Iterative with stack
function dfsIterative(graph, start) {
    const visited = new Array(graph.vertices).fill(false);
    const stack = [start];
    const result = [];
    
    while (stack.length > 0) {
        const node = stack.pop();
        
        if (!visited[node]) {
            visited[node] = true;
            result.push(node);
            
            // Push neighbors in reverse order
            for (let i = graph.getNeighbors(node).length - 1; i >= 0; i--) {
                const neighbor = graph.getNeighbors(node)[i];
                if (!visited[neighbor]) {
                    stack.push(neighbor);
                }
            }
        }
    }
    
    return result;
}

// Detect cycle using DFS
function hasCycleDFS(graph) {
    const visited = new Array(graph.vertices).fill(false);
    const recStack = new Array(graph.vertices).fill(false);
    
    for (let v = 0; v < graph.vertices; v++) {
        if (!visited[v] && hasCycleDFSHelper(graph, v, visited, recStack)) {
            return true;
        }
    }
    
    return false;
}

function hasCycleDFSHelper(graph, v, visited, recStack) {
    visited[v] = true;
    recStack[v] = true;
    
    for (const neighbor of graph.getNeighbors(v)) {
        if (!visited[neighbor]) {
            if (hasCycleDFSHelper(graph, neighbor, visited, recStack)) {
                return true;
            }
        } else if (recStack[neighbor]) {
            return true;
        }
    }
    
    recStack[v] = false;
    return false;
}
```

</CodeTabs>

---

## Breadth First Search (BFS)

Explore level by level. Good for shortest path in unweighted graphs.

**Time Complexity:** O(V + E) | **Space Complexity:** O(V)

<CodeTabs>

```go
// BFS - Queue-based
func bfs(graph *Graph, start int) []int {
    visited := make(map[int]bool)
    queue := []int{start}
    result := []int{}
    
    visited[start] = true
    
    for len(queue) > 0 {
        node := queue[0]
        queue = queue[1:]
        result = append(result, node)
        
        for _, neighbor := range graph.GetNeighbors(node) {
            if !visited[neighbor] {
                visited[neighbor] = true
                queue = append(queue, neighbor)
            }
        }
    }
    
    return result
}

// Shortest path in unweighted graph
func shortestPathBFS(graph *Graph, start, end int) []int {
    if start == end {
        return []int{start}
    }
    
    parent := make(map[int]int)
    visited := make(map[int]bool)
    queue := []int{start}
    
    visited[start] = true
    
    for len(queue) > 0 {
        node := queue[0]
        queue = queue[1:]
        
        for _, neighbor := range graph.GetNeighbors(node) {
            if neighbor == end {
                parent[neighbor] = node
                return reconstructPath(parent, start, end)
            }
            
            if !visited[neighbor] {
                visited[neighbor] = true
                parent[neighbor] = node
                queue = append(queue, neighbor)
            }
        }
    }
    
    return nil
}

func reconstructPath(parent map[int]int, start, end int) []int {
    path := []int{end}
    curr := end
    
    for curr != start {
        path = append([]int{parent[curr]}, path...)
        curr = parent[curr]
    }
    
    return path
}
```

```rust
// BFS - Queue-based
use std::collections::VecDeque;

fn bfs(graph: &Graph, start: usize) -> Vec<usize> {
    let mut visited = vec![false; graph.vertices];
    let mut queue = VecDeque::new();
    let mut result = Vec::new();
    
    queue.push_back(start);
    visited[start] = true;
    
    while !queue.is_empty() {
        let node = queue.pop_front().unwrap();
        result.push(node);
        
        if let Some(neighbors) = graph.get_neighbors(node) {
            for &neighbor in neighbors {
                if !visited[neighbor] {
                    visited[neighbor] = true;
                    queue.push_back(neighbor);
                }
            }
        }
    }
    
    result
}

// Shortest path in unweighted graph
fn shortest_path_bfs(graph: &Graph, start: usize, end: usize) -> Option<Vec<usize>> {
    if start == end {
        return Some(vec![start]);
    }
    
    let mut parent: HashMap<usize, usize> = HashMap::new();
    let mut visited = vec![false; graph.vertices];
    let mut queue = VecDeque::new();
    
    queue.push_back(start);
    visited[start] = true;
    
    while !queue.is_empty() {
        let node = queue.pop_front().unwrap();
        
        if let Some(neighbors) = graph.get_neighbors(node) {
            for &neighbor in neighbors {
                if neighbor == end {
                    parent.insert(neighbor, node);
                    return Some(reconstruct_path(&parent, start, end));
                }
                
                if !visited[neighbor] {
                    visited[neighbor] = true;
                    parent.insert(neighbor, node);
                    queue.push_back(neighbor);
                }
            }
        }
    }
    
    None
}

fn reconstruct_path(parent: &HashMap<usize, usize>, start: usize, end: usize) -> Vec<usize> {
    let mut path = vec![end];
    let mut curr = end;
    
    while curr != start {
        curr = parent.get(&curr).copied().unwrap();
        path.insert(0, curr);
    }
    
    path
}
```

```python
# BFS - Queue-based
from collections import deque

def bfs(graph, start):
    visited = [False] * graph.vertices
    queue = deque([start])
    result = []
    
    visited[start] = True
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        for neighbor in graph.get_neighbors(node):
            if not visited[neighbor]:
                visited[neighbor] = True
                queue.append(neighbor)
    
    return result

# Shortest path in unweighted graph
def shortest_path_bfs(graph, start, end):
    if start == end:
        return [start]
    
    parent = {}
    visited = [False] * graph.vertices
    queue = deque([start])
    
    visited[start] = True
    
    while queue:
        node = queue.popleft()
        
        for neighbor in graph.get_neighbors(node):
            if neighbor == end:
                parent[neighbor] = node
                return reconstruct_path(parent, start, end)
            
            if not visited[neighbor]:
                visited[neighbor] = True
                parent[neighbor] = node
                queue.append(neighbor)
    
    return None

def reconstruct_path(parent, start, end):
    path = [end]
    curr = end
    
    while curr != start:
        curr = parent[curr]
        path.insert(0, curr)
    
    return path
```

```javascript
// BFS - Queue-based
function bfs(graph, start) {
    const visited = new Array(graph.vertices).fill(false);
    const queue = [start];
    const result = [];
    
    visited[start] = true;
    
    while (queue.length > 0) {
        const node = queue.shift();
        result.push(node);
        
        for (const neighbor of graph.getNeighbors(node)) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                queue.push(neighbor);
            }
        }
    }
    
    return result;
}

// Shortest path in unweighted graph
function shortestPathBFS(graph, start, end) {
    if (start === end) {
        return [start];
    }
    
    const parent = new Map();
    const visited = new Array(graph.vertices).fill(false);
    const queue = [start];
    
    visited[start] = true;
    
    while (queue.length > 0) {
        const node = queue.shift();
        
        for (const neighbor of graph.getNeighbors(node)) {
            if (neighbor === end) {
                parent.set(neighbor, node);
                return reconstructPath(parent, start, end);
            }
            
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                parent.set(neighbor, node);
                queue.push(neighbor);
            }
        }
    }
    
    return null;
}

function reconstructPath(parent, start, end) {
    const path = [end];
    let curr = end;
    
    while (curr !== start) {
        curr = parent.get(curr);
        path.unshift(curr);
    }
    
    return path;
}
```

</CodeTabs>

---

## Topological Sort

Linear ordering of vertices in directed acyclic graph (DAG).

**Time Complexity:** O(V + E) | **Space Complexity:** O(V)

<CodeTabs>

```go
// Topological sort using DFS (Kahn's algorithm)
func topologicalSort(graph *Graph) []int {
    inDegree := make(map[int]int)
    
    // Calculate in-degrees
    for v := 0; v < graph.vertices; v++ {
        for _, neighbor := range graph.GetNeighbors(v) {
            inDegree[neighbor]++
        }
    }
    
    // Add nodes with 0 in-degree to queue
    queue := []int{}
    for v := 0; v < graph.vertices; v++ {
        if inDegree[v] == 0 {
            queue = append(queue, v)
        }
    }
    
    result := []int{}
    
    for len(queue) > 0 {
        node := queue[0]
        queue = queue[1:]
        result = append(result, node)
        
        for _, neighbor := range graph.GetNeighbors(node) {
            inDegree[neighbor]--
            if inDegree[neighbor] == 0 {
                queue = append(queue, neighbor)
            }
        }
    }
    
    // Check for cycle
    if len(result) != graph.vertices {
        return nil // Cycle detected
    }
    
    return result
}
```

```rust
// Topological sort using BFS (Kahn's algorithm)
use std::collections::VecDeque;

fn topological_sort(graph: &Graph) -> Option<Vec<usize>> {
    let mut in_degree = vec![0; graph.vertices];
    
    // Calculate in-degrees
    for v in 0..graph.vertices {
        if let Some(neighbors) = graph.get_neighbors(v) {
            for &neighbor in neighbors {
                in_degree[neighbor] += 1;
            }
        }
    }
    
    // Add nodes with 0 in-degree to queue
    let mut queue: VecDeque = VecDeque::new();
    for v in 0..graph.vertices {
        if in_degree[v] == 0 {
            queue.push_back(v);
        }
    }
    
    let mut result = Vec::new();
    
    while !queue.is_empty() {
        let node = queue.pop_front().unwrap();
        result.push(node);
        
        if let Some(neighbors) = graph.get_neighbors(node) {
            for &neighbor in neighbors {
                in_degree[neighbor] -= 1;
                if in_degree[neighbor] == 0 {
                    queue.push_back(neighbor);
                }
            }
        }
    }
    
    // Check for cycle
    if result.len() != graph.vertices {
        None // Cycle detected
    } else {
        Some(result)
    }
}
```

```python
# Topological sort using BFS (Kahn's algorithm)
from collections import deque

def topological_sort(graph):
    in_degree = [0] * graph.vertices
    
    # Calculate in-degrees
    for v in range(graph.vertices):
        for neighbor in graph.get_neighbors(v):
            in_degree[neighbor] += 1
    
    # Add nodes with 0 in-degree to queue
    queue = deque([v for v in range(graph.vertices) if in_degree[v] == 0])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        for neighbor in graph.get_neighbors(node):
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # Check for cycle
    if len(result) != graph.vertices:
        return None  # Cycle detected
    
    return result
```

```javascript
// Topological sort using BFS (Kahn's algorithm)
function topologicalSort(graph) {
    const inDegree = new Array(graph.vertices).fill(0);
    
    // Calculate in-degrees
    for (let v = 0; v < graph.vertices; v++) {
        for (const neighbor of graph.getNeighbors(v)) {
            inDegree[neighbor]++;
        }
    }
    
    // Add nodes with 0 in-degree to queue
    const queue = [];
    for (let v = 0; v < graph.vertices; v++) {
        if (inDegree[v] === 0) {
            queue.push(v);
        }
    }
    
    const result = [];
    
    while (queue.length > 0) {
        const node = queue.shift();
        result.push(node);
        
        for (const neighbor of graph.getNeighbors(node)) {
            inDegree[neighbor]--;
            if (inDegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    // Check for cycle
    if (result.length !== graph.vertices) {
        return null; // Cycle detected
    }
    
    return result;
}
```

</CodeTabs>

---

## Connected Components

Count number of connected components in undirected graph.

**Time Complexity:** O(V + E) | **Space Complexity:** O(V)

<CodeTabs>

```go
// Count connected components using DFS
func countComponents(graph *Graph) int {
    visited := make(map[int]bool)
    count := 0
    
    for v := 0; v < graph.vertices; v++ {
        if !visited[v] {
            dfs(graph, v, &visited)
            count++
        }
    }
    
    return count
}
```

```rust
// Count connected components using DFS
fn count_components(graph: &Graph) -> usize {
    let mut visited = vec![false; graph.vertices];
    let mut count = 0;
    
    for v in 0..graph.vertices {
        if !visited[v] {
            dfs(graph, v, &mut visited);
            count += 1;
        }
    }
    
    count
}
```

```python
# Count connected components using DFS
def count_components(graph):
    visited = [False] * graph.vertices
    count = 0
    
    for v in range(graph.vertices):
        if not visited[v]:
            dfs(graph, v, visited)
            count += 1
    
    return count
```

```javascript
// Count connected components using DFS
function countComponents(graph) {
    const visited = new Array(graph.vertices).fill(false);
    let count = 0;
    
    for (let v = 0; v < graph.vertices; v++) {
        if (!visited[v]) {
            dfs(graph, v, visited);
            count++;
        }
    }
    
    return count;
}
```

</CodeTabs>

---

## Common Patterns

| Pattern | Use Case | Algorithm |
|---------|----------|-----------|
| Path finding | Find path between two nodes | BFS (unweighted), DFS |
| Shortest path | Shortest path in unweighted | BFS |
| Cycle detection | Check if graph has cycle | DFS with recursion stack |
| Topological order | Linear ordering of DAG | Kahn's (BFS), DFS |
| Connected components | Find groups of connected nodes | DFS, BFS |
| Reachability | Which nodes can be reached | DFS, BFS |

## Graph Comparison

| Algorithm | Shortest Path | Cycle Detect | Topological | Connected |
|-----------|---------------|-------------|------------|-----------|
| BFS | ✓ (unweighted) | ✓ | ✗ | ✓ |
| DFS | ✗ | ✓ | ✓ | ✓ |
| Kahn's | ✗ | ✓ | ✓ | ✗ |

## Tips

1. **Choose right algorithm** - BFS for shortest path, DFS for path finding
2. **Handle cycles** - Track visited nodes to avoid infinite loops
3. **Representation matters** - Adjacency list for sparse, matrix for dense
4. **Use appropriate queue/stack** - BFS uses queue, DFS uses stack
5. **Return format** - Path (list of nodes), distance (number), boolean

## Common Mistakes

- Forgetting to mark nodes as visited
- Using wrong data structure (stack vs queue)
- Not handling disconnected graphs
- Incorrect cycle detection logic
- Mixing up directed vs undirected graph logic