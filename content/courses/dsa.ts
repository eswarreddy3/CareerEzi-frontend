// DSA — Beginner to Advanced (22 lessons, PDF order)
// Images served from /DSA%20images/dimg*.png

const dsaContent: Record<number, string> = {

// ─────────────────────────────────────────────────────────────────
1: `# Data Structure Introduction

:::scenario
A librarian stores 10,000 books. Without a system, finding one book takes hours. With a proper shelving and cataloguing system, it takes seconds. **Data Structures** are that system — for computers.
:::

## What is a Data Structure?

A **Data Structure** is a way of **organizing, storing, and managing data** in a computer so that it can be accessed and used efficiently.

Every program you write uses data. The question is: how do you store that data so operations on it are fast?

\`\`\`
Without Data Structure:    With Data Structure:
[random pile of data]  →  [organized, indexed, searchable]
Search: O(n)           →  Search: O(log n) or O(1)
\`\`\`

## Why Data Structures Matter

:::insight
Two programs solving the same problem can differ by **10,000×** in speed — purely based on the data structure chosen. Google's search returns results in milliseconds for billions of pages because of the right data structures, not just fast hardware.
:::

| Task | Bad Choice | Good Choice | Speedup |
|------|-----------|-------------|---------|
| Find user by ID | Scan list | Hash Map | 1,000,000× |
| Find shortest route | Brute force | Graph + Dijkstra | 10,000× |
| Autocomplete word | Scan all words | Trie | 1,000× |
| Priority task | Sort every time | Heap | 100× |

## Data vs Information

- **Data** — raw facts: 85, "Arjun", true
- **Information** — data with meaning: Student Arjun scored 85%, is placed: true
- **Data Structure** — organized container that gives data meaning and makes it usable

## Operations on Data Structures

Every data structure supports some combination of:

| Operation | Description |
|-----------|-------------|
| **Insert** | Add new data |
| **Delete** | Remove data |
| **Search** | Find data |
| **Access** | Retrieve data at a position |
| **Traverse** | Visit all elements |
| **Sort** | Arrange in order |
| **Merge** | Combine two structures |

The **speed** of each operation varies by data structure — that's what makes choosing the right one so important.

## Real-World Data Structure Usage

| Application | Data Structure Used |
|-------------|-------------------|
| Browser history (Back button) | Stack |
| Printer queue | Queue |
| File system (folders) | Tree |
| Google Maps routing | Graph |
| Database index | B-Tree |
| Cache (most recent) | Hash Map + Linked List |
| Autocomplete | Trie |
| Priority scheduling | Heap |

:::tip
Learning data structures is not about memorizing code. It's about building **intuition** for when to use which structure. Every interview question, system design, and performance problem comes back to this choice.
:::

:::challenge
**Think:** When you open Swiggy and search for "Pizza", what data structures are likely being used to:
1. Return search results instantly?
2. Show your past orders?
3. Rank restaurants by rating?
4. Find the nearest restaurant?

(Hash Map, Stack/Array, Heap, Graph)
:::`,

// ─────────────────────────────────────────────────────────────────
2: `# Classification of Data Structures

## The Complete Map

Data structures are organized into a clear hierarchy. Understanding this map tells you exactly where each structure fits and why.

![Data Structures Classification Tree](/DSA%20images/dimg1.png)

## Primitive Data Structures

These are the basic building blocks — directly supported by the programming language, stored as single values in memory.

| Primitive | Description | Example Values |
|-----------|-------------|----------------|
| **int** | Whole numbers | 0, 42, -5, 1000 |
| **char** | Single character | 'A', 'z', '9' |
| **float** | Decimal (single precision) | 3.14, -0.5 |
| **double** | Decimal (double precision) | 3.14159265358979 |
| **pointer** | Stores a memory address | 0x7fff5fbff8a0 |

\`\`\`c
int age = 21;
char grade = 'A';
float cgpa = 8.75;
double pi = 3.14159265358979;
int* ptr = &age;   // pointer to age's address
\`\`\`

## Non-Primitive Data Structures

Built from primitives. Divided into **Linear** and **Non-Linear**.

### Linear — Elements in a Sequence

Each element has exactly one predecessor and one successor (except the first and last).

**Static (fixed size):**
- **Array** — contiguous memory, fixed size, O(1) access

**Dynamic (variable size):**
- **Linked List** — nodes connected by pointers, grows/shrinks
- **Stack** — LIFO (Last In, First Out)
- **Queue** — FIFO (First In, First Out)

### Non-Linear — Elements in a Hierarchy/Network

One element can connect to multiple others. No single sequence.

![Non-Linear Tree — Each node can have multiple children](/DSA%20images/dimg2.png)

- **Tree** — hierarchical structure, one root, parent-child relationships
- **Graph** — network structure, nodes connected by edges (any pattern)

## Static vs Dynamic

| | Static | Dynamic |
|-|--------|---------|
| Size | Fixed at compile time | Grows/shrinks at runtime |
| Memory allocation | At program start | As needed (heap) |
| Flexibility | Low | High |
| Speed | Faster (no allocation overhead) | Slightly slower |
| Example | Array | Linked List, Stack, Queue |

## Linear vs Non-Linear

| | Linear | Non-Linear |
|-|--------|------------|
| Arrangement | Sequential | Hierarchical/Network |
| Traversal | Single pass | Multiple paths |
| Memory | Efficient | More complex |
| Relationships | One-to-one | One-to-many, Many-to-many |
| Examples | Array, LL, Stack, Queue | Tree, Graph |

## Choosing the Right Data Structure

\`\`\`
Need fast access by index?          → Array
Need fast insert/delete anywhere?   → Linked List
Need LIFO (undo, call stack)?       → Stack
Need FIFO (scheduling, BFS)?        → Queue
Need hierarchical data?             → Tree
Need network/relationship data?     → Graph
Need fastest key lookup?            → Hash Map
Need sorted + fast search?          → BST / AVL Tree
\`\`\`

:::tip
The classification tree above is the single most important diagram in DSA. Every structure you'll study fits somewhere in it. Memorize the map — not individual facts, but the **relationships and trade-offs** between each category.
:::`,

// ─────────────────────────────────────────────────────────────────
3: `# Introduction to Algorithms

:::scenario
Two chefs are given the same ingredients to make a dish. Chef A has a recipe — clear steps, in order, guaranteed to produce the dish. Chef B improvises. Chef A finishes in 30 minutes consistently. Chef B sometimes takes 2 hours, sometimes fails. An **algorithm** is the recipe.
:::

## What is an Algorithm?

An **Algorithm** is a **finite, step-by-step set of instructions** to solve a problem or accomplish a task.

Requirements for a valid algorithm:
1. **Input** — takes zero or more inputs
2. **Output** — produces at least one output
3. **Definiteness** — each step is clearly defined
4. **Finiteness** — terminates after a finite number of steps
5. **Effectiveness** — each step is basic enough to be executed

## Algorithm vs Program

| Algorithm | Program |
|-----------|---------|
| Language-independent | Written in a specific language |
| Design phase | Implementation phase |
| Like a recipe | Like the cooked dish |
| Can be on paper | Must run on a computer |

## Algorithm Properties

\`\`\`
Algorithm: Find Maximum in Array
─────────────────────────────────
Input:  Array arr[], integer n (size)
Output: Maximum value in arr

Steps:
  1. Set max = arr[0]
  2. For i = 1 to n-1:
       If arr[i] > max:
           Set max = arr[i]
  3. Return max
\`\`\`

## How to Write an Algorithm (Pseudocode)

Pseudocode is an informal, English-like notation for algorithms — not tied to any language.

\`\`\`
Algorithm: Linear Search
Input:  Array A[0..n-1], target value key
Output: Index of key in A, or -1 if not found

BEGIN
  FOR i = 0 TO n-1 DO
    IF A[i] = key THEN
      RETURN i
    END IF
  END FOR
  RETURN -1
END
\`\`\`

## Algorithm Analysis — Two Dimensions

When evaluating an algorithm, we measure:

### Time Complexity
How many **operations** does it perform as input size grows?

### Space Complexity
How much **extra memory** does it use as input size grows?

\`\`\`python
# Example 1: O(n) time, O(1) space
def find_max(arr):
    max_val = arr[0]        # 1 variable — O(1) space
    for x in arr:           # n iterations — O(n) time
        if x > max_val:
            max_val = x
    return max_val

# Example 2: O(n) time, O(n) space
def copy_array(arr):
    result = []             # grows with n — O(n) space
    for x in arr:           # n iterations — O(n) time
        result.append(x)
    return result
\`\`\`

## Types of Algorithm Analysis

| Type | When | Description |
|------|------|-------------|
| **Best Case** | Most favorable input | Lower bound on time |
| **Worst Case** | Most unfavorable input | Upper bound on time |
| **Average Case** | Random input | Expected time |

Most commonly, we analyze **worst case** — it gives the guarantee.

## Common Algorithm Strategies

| Strategy | Idea | Example |
|----------|------|---------|
| **Brute Force** | Try all possibilities | Linear search |
| **Divide & Conquer** | Split, solve, combine | Merge sort, Binary search |
| **Greedy** | Best local choice at each step | Dijkstra's, Huffman |
| **Dynamic Programming** | Store sub-problem results | Fibonacci, Knapsack |
| **Backtracking** | Try, fail, undo, try again | Sudoku, N-Queens |
| **Recursion** | Function calls itself | Tree traversal, Factorial |

:::insight
**Algorithm efficiency matters more than hardware speed.**

A O(n²) algorithm on a supercomputer will be beaten by an O(n log n) algorithm on a laptop once n is large enough. For n = 1,000,000:
- O(n log n) = 20,000,000 operations
- O(n²) = 1,000,000,000,000 operations

No amount of hardware closes that gap.
:::`,

// ─────────────────────────────────────────────────────────────────
4: `# Asymptotic Analysis — Big O, Ω, Θ

:::scenario
You're interviewing at Google. The interviewer asks: "What's the time complexity of your solution?" They don't want exact milliseconds — they want to know how your algorithm **scales**. That's asymptotic analysis.
:::

**Asymptotic Analysis** describes how an algorithm's resource usage grows as input size **n → ∞**. We drop constants and lower-order terms because they become irrelevant at large scale.

## The Three Notations

### Big O — Upper Bound (Worst Case)

**O(g(n))** — the algorithm takes **at most** this long.

![Big O — Upper Bound](/DSA%20images/dimg3.png)

The graph shows g(n) always stays **above** f(n) after n₀. No matter the input, f(n) never exceeds c·g(n).

**Formal definition:** f(n) = O(g(n)) if there exist constants c > 0 and n₀ > 0 such that:
\`\`\`
f(n) ≤ c · g(n)   for all n ≥ n₀
\`\`\`

This is the most commonly used notation in practice — it gives a **guarantee** on worst-case performance.

### Big Omega — Lower Bound (Best Case)

**Ω(g(n))** — the algorithm takes **at least** this long.

![Big Omega — Lower Bound](/DSA%20images/dimg4.png)

f(n) stays **above** g(n) after n₀. The algorithm cannot be faster than this.

**Formal definition:** f(n) = Ω(g(n)) if:
\`\`\`
f(n) ≥ c · g(n)   for all n ≥ n₀
\`\`\`

### Big Theta — Tight Bound (Average Case)

**Θ(g(n))** — the algorithm grows **exactly** at this rate.

![Big Theta — Tight Bound (Upper + Lower)](/DSA%20images/dimg5.png)

f(n) is **sandwiched** between c₁·g(n) and c₂·g(n). It's both O(g(n)) and Ω(g(n)).

**Formal definition:** f(n) = Θ(g(n)) if:
\`\`\`
c₁ · g(n) ≤ f(n) ≤ c₂ · g(n)   for all n ≥ n₀
\`\`\`

## Common Time Complexities

| Notation | Name | Example | n=1,000 ops |
|----------|------|---------|-------------|
| O(1) | Constant | arr[i], hash lookup | 1 |
| O(log n) | Logarithmic | Binary search | ~10 |
| O(n) | Linear | Linear search | 1,000 |
| O(n log n) | Log-linear | Merge sort | ~10,000 |
| O(n²) | Quadratic | Bubble sort | 1,000,000 |
| O(n³) | Cubic | Matrix multiply (naive) | 1,000,000,000 |
| O(2ⁿ) | Exponential | Recursive Fibonacci | 2^1000 |
| O(n!) | Factorial | Permutations | n! |

## Rules for Calculating Big O

**Rule 1 — Drop constants:**
\`\`\`python
# O(2n) → O(n)
for i in range(n):
    print(i)
for j in range(n):
    print(j)
\`\`\`

**Rule 2 — Drop lower-order terms:**
\`\`\`python
# O(n² + n) → O(n²)
for i in range(n):           # O(n²)
    for j in range(n):
        print(i, j)
for k in range(n):           # O(n) — dominated by n²
    print(k)
\`\`\`

**Rule 3 — Sequential steps add:**
\`\`\`python
# O(a) + O(b) = O(a + b)
def process(arr_a, arr_b):
    for x in arr_a:   # O(a)
        print(x)
    for y in arr_b:   # O(b)
        print(y)
# Total: O(a + b)
\`\`\`

**Rule 4 — Nested loops multiply:**
\`\`\`python
# O(n) × O(m) = O(n·m)
for i in range(n):
    for j in range(m):
        print(i, j)
# Total: O(n·m) → O(n²) if n == m
\`\`\`

**Rule 5 — Halving → logarithm:**
\`\`\`python
# Halve the input each time → O(log n)
i = n
while i > 1:
    i = i // 2
\`\`\`

## Space Complexity

\`\`\`python
def reverse(arr):
    return arr[::-1]    # creates new array → O(n) space

def reverse_inplace(arr):
    left, right = 0, len(arr)-1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1; right -= 1
    # no new array → O(1) space
\`\`\`

:::tip
In interviews, always mention **both** time and space complexity. "O(n log n) time, O(n) space" is a complete answer. "O(n log n)" alone is incomplete.
:::

:::challenge
Calculate the Big O:
1. \`for i in range(n): for j in range(i): print(j)\` → ?
2. Binary search on n items → ?
3. Three nested loops over n → ?
4. One loop + one binary search → ?

Answers: O(n²), O(log n), O(n³), O(n)
:::`,

// ─────────────────────────────────────────────────────────────────
5: `# DS — Pointers

:::scenario
You rent a house. The house is the **data**. Your address book entry for that house is the **pointer** — it doesn't hold the house, it tells you exactly where the house is. Pointers are address book entries for memory locations.
:::

## What is a Pointer?

A **Pointer** is a variable that stores the **memory address** of another variable — not the value itself, but the **location** of the value in memory.

\`\`\`
Memory:
Address  │ Value
─────────┼───────
1000     │  42       ← int x = 42
1004     │ 1000      ← int* ptr = &x  (ptr stores address 1000)
\`\`\`

## Pointers in C/C++

\`\`\`c
#include <stdio.h>

int main() {
    int x = 42;        // normal variable, stored at some address
    int* ptr = &x;     // ptr holds the ADDRESS of x

    printf("Value of x:       %d\n", x);       // 42
    printf("Address of x:     %p\n", &x);       // 0x7fff...
    printf("Value of ptr:     %p\n", ptr);       // 0x7fff... (same address)
    printf("Value at ptr:     %d\n", *ptr);      // 42 (dereferencing)

    *ptr = 100;        // change x through the pointer
    printf("New value of x:   %d\n", x);        // 100
    return 0;
}
\`\`\`

**Key operators:**
- \`&\` — **address-of** operator: gets the address of a variable
- \`*\` — **dereference** operator: gets the value at an address

## Pointer Arithmetic

Pointers can be incremented/decremented — they move by the **size of the data type**:

\`\`\`c
int arr[] = {10, 20, 30, 40, 50};
int* ptr = arr;    // points to arr[0]

printf("%d\n", *ptr);       // 10
ptr++;                       // move to next int (4 bytes ahead)
printf("%d\n", *ptr);       // 20
ptr += 2;                    // skip 2 ints
printf("%d\n", *ptr);       // 40
\`\`\`

This is why arrays and pointers are tightly connected in C — array name IS a pointer to the first element.

## Null Pointer

A pointer that points to **nothing** (address 0). Always initialize pointers to NULL if not assigned:

\`\`\`c
int* ptr = NULL;   // safe — doesn't point to random memory

if (ptr != NULL) {
    printf("%d", *ptr);    // only dereference if not NULL
}
// Dereferencing NULL → Segmentation Fault (crash)
\`\`\`

## Pointers and Data Structures

Pointers are the backbone of all dynamic data structures:

\`\`\`c
// Linked List Node — uses a pointer to the next node
struct Node {
    int data;
    struct Node* next;   // pointer to next node
};

// Tree Node — uses two pointers
struct TreeNode {
    int val;
    struct TreeNode* left;
    struct TreeNode* right;
};
\`\`\`

Without pointers, **Linked Lists, Trees, Graphs, and Heaps cannot exist** — they all depend on nodes pointing to each other.

## Pointers in Python

Python doesn't expose raw pointers, but **every variable is a reference** (essentially a pointer):

\`\`\`python
a = [1, 2, 3]
b = a              # b points to the SAME list — not a copy!

b.append(4)
print(a)           # [1, 2, 3, 4] — a also changed!

# To copy:
c = a.copy()       # c is a separate object
c.append(5)
print(a)           # [1, 2, 3, 4] — a unchanged
\`\`\`

\`\`\`python
# id() returns the memory address in Python
x = 42
y = x
print(id(x) == id(y))   # True — same object!

x = 100
print(id(x) == id(y))   # False — x now points to new object
\`\`\`

:::tip
Understanding pointers is essential for:
- Linked Lists (next pointer)
- Trees (left/right pointers)
- Graphs (adjacency pointers)
- Dynamic memory allocation
- Passing large objects efficiently (pass by reference, not value)
:::

:::mistake
**Common Pointer Mistakes:**
1. **Dangling pointer** — pointer to freed/deleted memory → use after free crash
2. **Memory leak** — allocate memory, lose the pointer, never free it
3. **NULL dereference** — accessing \`*ptr\` when ptr is NULL → segfault
4. **Double free** — freeing same memory twice → undefined behavior
:::`,

// ─────────────────────────────────────────────────────────────────
6: `# DS — Structures

:::scenario
A student has a name, roll number, CGPA, branch, and placement status. Storing these in 5 separate variables works for 1 student. For 500 students, you'd need 2,500 variables. A **Structure** groups all of a student's data into one named unit.
:::

## What is a Structure?

A **Structure** (struct) is a **user-defined data type** that groups together variables of **different types** under a single name.

Unlike arrays (same type only), structs can hold mixed types:

\`\`\`c
// Without struct — scattered variables (bad)
char name1[50] = "Arjun";
float cgpa1 = 8.75;
int year1 = 2025;

char name2[50] = "Priya";
float cgpa2 = 9.1;
int year2 = 2024;
// Gets chaotic with 500 students...

// With struct — organized (good)
struct Student {
    char name[50];
    float cgpa;
    int passout_year;
    char branch[20];
    int is_placed;
};
\`\`\`

## Defining and Using Structs in C

\`\`\`c
#include <stdio.h>
#include <string.h>

struct Student {
    char name[50];
    float cgpa;
    int passout_year;
    char branch[20];
};

int main() {
    // Declare and initialize
    struct Student s1;
    strcpy(s1.name, "Arjun Sharma");
    s1.cgpa = 8.75;
    s1.passout_year = 2025;
    strcpy(s1.branch, "CSE");

    // Access with dot operator
    printf("Name: %s\n", s1.name);
    printf("CGPA: %.2f\n", s1.cgpa);

    // Initialize at declaration
    struct Student s2 = {"Priya Patel", 9.1, 2024, "ECE"};
    printf("Name: %s\n", s2.name);
    return 0;
}
\`\`\`

## Array of Structures

\`\`\`c
struct Student batch[500];   // 500 students

// Fill data
for (int i = 0; i < 500; i++) {
    printf("Enter name: ");
    scanf("%s", batch[i].name);
    printf("Enter CGPA: ");
    scanf("%f", &batch[i].cgpa);
}

// Find highest CGPA
float max_cgpa = 0;
int topper_idx = 0;
for (int i = 0; i < 500; i++) {
    if (batch[i].cgpa > max_cgpa) {
        max_cgpa = batch[i].cgpa;
        topper_idx = i;
    }
}
printf("Topper: %s with CGPA %.2f\n", batch[topper_idx].name, max_cgpa);
\`\`\`

## Pointer to Structure

\`\`\`c
struct Student s1 = {"Arjun", 8.75, 2025, "CSE"};
struct Student* ptr = &s1;

// Two ways to access members via pointer:
printf("%s\n", (*ptr).name);   // dereference then dot
printf("%s\n", ptr->name);     // arrow operator (preferred)
printf("%.2f\n", ptr->cgpa);   // arrow operator
\`\`\`

The \`->\` **arrow operator** is shorthand for \`(*ptr).member\` — used extensively in linked lists and trees.

## Nested Structures

\`\`\`c
struct Address {
    char city[30];
    char state[30];
    int pincode;
};

struct Student {
    char name[50];
    float cgpa;
    struct Address home_address;   // struct inside struct
};

struct Student s;
strcpy(s.name, "Rahul");
strcpy(s.home_address.city, "Mumbai");
s.home_address.pincode = 400001;
\`\`\`

## Structures in Python — Classes / Dataclasses

Python uses **classes** or **dataclasses** instead of C structs:

\`\`\`python
from dataclasses import dataclass

@dataclass
class Student:
    name: str
    cgpa: float
    passout_year: int
    branch: str
    is_placed: bool = False

s1 = Student("Arjun Sharma", 8.75, 2025, "CSE")
s2 = Student("Priya Patel", 9.1, 2024, "ECE", True)

print(s1.name)      # Arjun Sharma
print(s2.cgpa)      # 9.1

# Array of students
batch = [
    Student("Arjun", 8.75, 2025, "CSE"),
    Student("Priya", 9.1, 2024, "ECE"),
    Student("Rahul", 7.5, 2025, "ME"),
]

# Find topper
topper = max(batch, key=lambda s: s.cgpa)
print(f"Topper: {topper.name} — {topper.cgpa}")
\`\`\`

## Struct Memory Layout

\`\`\`
struct Student {      Memory layout (example):
    char name[4];  →  [n][a][m][e]      4 bytes
    int age;       →  [  ][  ][  ][  ]  4 bytes
    float cgpa;    →  [  ][  ][  ][  ]  4 bytes
};                    Total: 12 bytes (may have padding)
\`\`\`

:::insight
Structures (and their object-oriented cousin, classes) are the foundation of **all complex data structures**. A linked list node IS a struct. A tree node IS a struct. Understanding structs means understanding how all data structures are built at the memory level.
:::`,

// ─────────────────────────────────────────────────────────────────
7: `# DS — Arrays

:::scenario
You need to store 100 student scores and find the average. You could declare 100 separate variables — or one array. The array stores all values in consecutive memory, letting you access any score in one step.
:::

## What is an Array?

An **Array** is a collection of elements of the **same data type** stored in **contiguous (adjacent) memory locations**, accessed via a numeric **index**.

## Memory Layout

![Array Visualization — Contiguous Memory](/DSA%20images/dimg6.png)

From the diagram:
- **arr[0] = 10** stored at base address **1000**
- **arr[1] = 20** stored at address **1004** (4 bytes for int)
- **arr[2] = 30** stored at **1008**
- **arr[3] = 40** stored at **1012**
- **arr[4] = 50** stored at **1016**

**Address formula:**
\`\`\`
Address of arr[i] = Base Address + (i × size_of_datatype)
Address of arr[3] = 1000 + (3 × 4) = 1012  ✓
\`\`\`

This is why **access is O(1)** — no searching needed, just math.

## Declaration & Initialization

\`\`\`c
// C — fixed size, must declare upfront
int scores[5];                    // uninitialized
int scores[5] = {85, 92, 78, 95, 88};  // initialized
int scores[]  = {85, 92, 78, 95, 88};  // size inferred

printf("%d\n", scores[0]);   // 85
printf("%d\n", scores[4]);   // 88
printf("%d\n", scores[5]);   // UNDEFINED — out of bounds!
\`\`\`

\`\`\`python
# Python — dynamic, no fixed size
scores = [85, 92, 78, 95, 88]
names  = ["Arjun", "Priya", "Raj"]

# Access
print(scores[0])     # 85  (first)
print(scores[-1])    # 88  (last)
print(scores[1:4])   # [92, 78, 95] (slice)
\`\`\`

## Core Operations & Complexity

| Operation | Code | Time | Why |
|-----------|------|------|-----|
| Access arr[i] | \`arr[3]\` | **O(1)** | Direct address calculation |
| Search (unsorted) | scan all | **O(n)** | May check every element |
| Search (sorted) | binary search | **O(log n)** | Divide and conquer |
| Insert at end | \`append(x)\` | **O(1)** amortized | No shifting |
| Insert at middle | \`insert(i, x)\` | **O(n)** | Shift elements right |
| Delete at middle | \`pop(i)\` | **O(n)** | Shift elements left |
| Update arr[i] | \`arr[i] = x\` | **O(1)** | Direct address |

\`\`\`python
arr = [10, 20, 30, 40, 50]

# Insert at index 2 — shifts 30, 40, 50 right
arr.insert(2, 25)   # [10, 20, 25, 30, 40, 50]  O(n)

# Delete index 1 — shifts everything left
arr.pop(1)          # [10, 25, 30, 40, 50]       O(n)

# Append at end — no shifting
arr.append(60)      # [10, 25, 30, 40, 50, 60]   O(1)
\`\`\`

## 2D Arrays

\`\`\`c
// C — 2D array (matrix)
int marks[3][3] = {
    {85, 90, 78},   // student 0
    {92, 88, 95},   // student 1
    {70, 75, 80}    // student 2
};
printf("%d\n", marks[1][2]);  // 95 — student 1, subject 2

// Traverse: O(n²)
for (int i = 0; i < 3; i++)
    for (int j = 0; j < 3; j++)
        printf("%d ", marks[i][j]);
\`\`\`

\`\`\`python
# Python
matrix = [[1,2,3],[4,5,6],[7,8,9]]
print(matrix[1][2])   # 6

# Using list comprehension for n×n
n = 3
grid = [[0]*n for _ in range(n)]
\`\`\`

## Advantages & Disadvantages

:::compare
✓ O(1) random access — fastest possible lookup
✓ Cache-friendly — contiguous memory = CPU cache hits
✓ Simple syntax, universal in all languages
✓ Best for numeric/mathematical operations
✗ Fixed size in low-level languages (C, Java primitive arrays)
✗ Insert/delete at middle is O(n) — costly
✗ Must declare size upfront (C/Java)
✗ Wasted memory if sparsely filled
:::

:::tip
In Python, use **NumPy arrays** for heavy math: 10–100× faster than Python lists for numerical operations. All of machine learning (TensorFlow, PyTorch, scikit-learn) is built on NumPy arrays internally.
\`\`\`python
import numpy as np
arr = np.array([85, 92, 78, 95, 88])
print(arr.mean())   # 87.6 — vectorized, fast
print(arr * 2)      # [170, 184, 156, 190, 176]
\`\`\`
:::`,

// ─────────────────────────────────────────────────────────────────
8: `# DS — Linked List

:::scenario
Arrays are great but inserting into the middle requires shifting millions of elements. A linked list solves this: each element holds a pointer to the next. Inserting anywhere is just a pointer change — O(1).
:::

## What is a Linked List?

A **Linked List** is a sequence of **nodes**, where each node contains:
1. **Data** — the actual value
2. **Next pointer** — the memory address of the next node

Nodes are **not stored in contiguous memory** — they're scattered, linked by pointers.

## Visualization

![Linked List — Node Structure and Chain](/DSA%20images/dimg7.png)

From the diagram:
- **HEAD** → first node (data=10, address=4900)
- Node 4900: data=10, next=5000
- Node 5000: data=15, next=5008
- Node 5008: data=5, next=... → eventually NULL
- Last node: **next = NULL** (marks the end)

Chain: **10 → 15 → 5 → 20 → NULL**

## Implementation

\`\`\`python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None   # pointer to next node

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        """Add node at end — O(n)"""
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:        # walk to last node
            current = current.next
        current.next = new_node

    def prepend(self, data):
        """Add node at start — O(1)"""
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    def delete(self, data):
        """Delete first node with given data — O(n)"""
        if not self.head:
            return
        if self.head.data == data:
            self.head = self.head.next
            return
        current = self.head
        while current.next:
            if current.next.data == data:
                current.next = current.next.next   # skip the node
                return
            current = current.next

    def display(self):
        current = self.head
        while current:
            print(current.data, end=" → ")
            current = current.next
        print("NULL")

ll = LinkedList()
ll.append(10)
ll.append(15)
ll.append(5)
ll.append(20)
ll.display()     # 10 → 15 → 5 → 20 → NULL
ll.prepend(1)
ll.display()     # 1 → 10 → 15 → 5 → 20 → NULL
ll.delete(15)
ll.display()     # 1 → 10 → 5 → 20 → NULL
\`\`\`

## Types of Linked Lists

### 1. Singly Linked List
Each node has one pointer: **next**. Traversal is forward-only.

### 2. Doubly Linked List
Each node has two pointers: **next** and **prev**. Traverse in both directions.

\`\`\`python
class DNode:
    def __init__(self, data):
        self.data = data
        self.next = None
        self.prev = None    # extra back pointer
\`\`\`

### 3. Circular Linked List
Last node's **next** points back to **head** (no NULL). Used in round-robin CPU scheduling.

\`\`\`
1 → 2 → 3 → 4
↑___________↓   (4.next = head = 1)
\`\`\`

## Operations & Complexity

| Operation | Singly LL | Doubly LL |
|-----------|-----------|-----------|
| Access by index | O(n) | O(n) |
| Search | O(n) | O(n) |
| Insert at head | **O(1)** | **O(1)** |
| Insert at tail | O(n) | **O(1)** (with tail ptr) |
| Insert at middle | O(n) to find + O(1) | O(n) to find + O(1) |
| Delete at head | **O(1)** | **O(1)** |
| Delete at tail | O(n) | **O(1)** (with tail ptr) |

## Array vs Linked List

| | Array | Linked List |
|-|-------|-------------|
| Memory | Contiguous | Scattered |
| Access arr[i] | **O(1)** | O(n) |
| Insert at start | O(n) | **O(1)** |
| Insert at end | O(1) amortized | O(n) / O(1) w/ tail |
| Cache performance | Excellent | Poor |
| Size | Fixed / expensive resize | Dynamic |
| Extra memory | None | 1 pointer per node |

:::insight
**When to choose Linked List over Array:**
- Frequent insertions/deletions at the **front**
- Unknown size at compile time
- Implementing stacks and queues
- When you never need random access by index
:::`,

// ─────────────────────────────────────────────────────────────────
9: `# DS — Skip List

:::scenario
A linked list search is O(n) — you must walk every node. Binary search on a sorted linked list is impossible (can't jump to the middle). **Skip List** solves this by adding express lanes — like a multi-lane highway over a single road.
:::

## What is a Skip List?

A **Skip List** is a probabilistic data structure built on a sorted linked list that uses **multiple layers** of linked lists to skip large portions of the data, achieving O(log n) search.

## Structure

![Skip List Search — Express Lanes](/DSA%20images/dimg8.png)

From the diagram:
- **L1 (base layer):** every element — 10, 20, 30... all 11 elements
- **L2 (express 1):** every ~2nd element — skip smaller portions
- **L3 (express 2):** every ~4th element — skip large portions

**Searching for 50:**
- Start at the highest level (express)
- Jump far right, skip multiple elements
- Drop down when you overshoot
- Only **4 comparisons** instead of scanning all 11 elements

## How It Works

\`\`\`
Level 3 (fastest):  1 ─────────────────────── 50 ─── NULL
Level 2 (medium):   1 ──────── 20 ─────────── 50 ─── NULL
Level 1 (base):     1 ─ 5 ─ 10 ─ 15 ─ 20 ─ 30 ─ 40 ─ 50 ─ NULL
\`\`\`

**Search 30:**
1. L3: jump to 50 → 50 > 30, drop to L2
2. L2: jump to 20 → 20 < 30, jump right → 50 > 30, drop to L1
3. L1: from 20 → 30 → **FOUND**!

Only 4 steps instead of 8.

## Implementation

\`\`\`python
import random

class SkipNode:
    def __init__(self, key, level):
        self.key = key
        self.forward = [None] * (level + 1)  # pointers for each level

class SkipList:
    MAX_LEVEL = 4
    P = 0.5   # probability of adding a level

    def __init__(self):
        self.header = SkipNode(-1, self.MAX_LEVEL)
        self.level = 0

    def random_level(self):
        lvl = 0
        while random.random() < self.P and lvl < self.MAX_LEVEL:
            lvl += 1
        return lvl

    def insert(self, key):
        update = [None] * (self.MAX_LEVEL + 1)
        current = self.header

        for i in range(self.level, -1, -1):
            while current.forward[i] and current.forward[i].key < key:
                current = current.forward[i]
            update[i] = current

        lvl = self.random_level()
        if lvl > self.level:
            for i in range(self.level + 1, lvl + 1):
                update[i] = self.header
            self.level = lvl

        new_node = SkipNode(key, lvl)
        for i in range(lvl + 1):
            new_node.forward[i] = update[i].forward[i]
            update[i].forward[i] = new_node

    def search(self, key):
        current = self.header
        for i in range(self.level, -1, -1):
            while current.forward[i] and current.forward[i].key < key:
                current = current.forward[i]
        current = current.forward[0]
        return current and current.key == key
\`\`\`

## Complexity

| Operation | Average | Worst |
|-----------|---------|-------|
| Search | **O(log n)** | O(n) |
| Insert | **O(log n)** | O(n) |
| Delete | **O(log n)** | O(n) |
| Space | **O(n log n)** | O(n log n) |

The **average case is probabilistically guaranteed** — with high probability, operations are O(log n).

## Skip List vs BST

| | Skip List | BST (AVL/RB) |
|-|-----------|-------------|
| Search | O(log n) avg | O(log n) |
| Insert | O(log n) avg | O(log n) |
| Implementation | Simpler | Complex rotations |
| Ordering | Natural | Natural |
| Concurrent access | Easier to make thread-safe | Harder |
| Used in | Redis (sorted sets) | Most DBs |

:::insight
**Redis** — the most popular in-memory database — uses **Skip Lists** for its Sorted Set data type (ZADD, ZRANK). Why skip list over BST? Simpler concurrent access patterns for a database that handles millions of requests per second.
:::`,

// ─────────────────────────────────────────────────────────────────
10: `# DS — Stack

:::scenario
You press Ctrl+Z to undo in VS Code. The last action reverses. Press again — the second-to-last reverses. Actions undo in **reverse order** of how they happened. That's a Stack: last action done = first to undo.
:::

## What is a Stack?

A **Stack** is a linear data structure following **LIFO — Last In, First Out**.

Like a stack of plates: you always **add and remove from the top**.

## Stack Operations Visualized

![Stack Operations — PUSH and POP](/DSA%20images/dimg9.png)

From the diagram:
- **PUSH 10** → [10], top=10
- **PUSH 20** → [10, 20], top=20
- **PUSH 30** → [10, 20, 30], **[FULL]**
- **POP** → removes 30, returns to [10, 20]

| Operation | Description | Time |
|-----------|-------------|------|
| **push(x)** | Add element to top | O(1) |
| **pop()** | Remove & return top | O(1) |
| **peek()** | View top without removing | O(1) |
| **isEmpty()** | Check if empty | O(1) |
| **size()** | Number of elements | O(1) |

## Implementation

\`\`\`python
class Stack:
    def __init__(self):
        self._data = []

    def push(self, item):
        self._data.append(item)

    def pop(self):
        if self.is_empty():
            raise IndexError("Stack underflow")
        return self._data.pop()

    def peek(self):
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self._data[-1]

    def is_empty(self):
        return len(self._data) == 0

    def size(self):
        return len(self._data)

s = Stack()
s.push(10); s.push(20); s.push(30)
print(s.peek())   # 30 (top, not removed)
print(s.pop())    # 30 (removed)
print(s.pop())    # 20
print(s.size())   # 1
\`\`\`

## Real-World Applications

### 1. Undo/Redo
\`\`\`python
undo_stack = Stack()
redo_stack = Stack()

def do_action(action):
    undo_stack.push(action)
    redo_stack._data.clear()  # new action clears redo

def undo():
    if not undo_stack.is_empty():
        redo_stack.push(undo_stack.pop())

def redo():
    if not redo_stack.is_empty():
        undo_stack.push(redo_stack.pop())
\`\`\`

### 2. Balanced Parentheses
\`\`\`python
def is_balanced(s):
    stack = Stack()
    match = {')':'(', '}':'{', ']':'['}
    for ch in s:
        if ch in '({[':
            stack.push(ch)
        elif ch in ')}]':
            if stack.is_empty() or stack.pop() != match[ch]:
                return False
    return stack.is_empty()

print(is_balanced("({[]})"))   # True
print(is_balanced("({[})"))    # False
\`\`\`

### 3. Function Call Stack

Every function call pushes a **stack frame** onto the call stack. Returns pop it off. Infinite recursion = stack overflow.

\`\`\`python
def factorial(n):
    # factorial(4) → factorial(3) → factorial(2) → factorial(1)
    # Each call is pushed; returns pop in reverse
    if n == 0: return 1
    return n * factorial(n - 1)
\`\`\`

### 4. Browser History
\`\`\`
visit(google.com)   → stack: [google]
visit(youtube.com)  → stack: [google, youtube]
visit(github.com)   → stack: [google, youtube, github]
back()              → pop github, current = youtube
back()              → pop youtube, current = google
\`\`\`

:::tip
Python's built-in list works perfectly as a stack — \`append()\` for push, \`pop()\` for pop. Both are O(1). For thread-safe use, use \`queue.LifoQueue\`.
:::`,

// ─────────────────────────────────────────────────────────────────
11: `# DS — Queue

:::scenario
Customers at a bank counter. First person to arrive is first to be served. New arrivals join the back. No jumping the line. That's a **Queue** — the fairest data structure.
:::

## What is a Queue?

A **Queue** is a linear data structure following **FIFO — First In, First Out**.

- Add (enqueue) at the **REAR**
- Remove (dequeue) from the **FRONT**

## Queue Operations Visualized

![Queue Operations — Enqueue and Dequeue](/DSA%20images/dimg10.png)

From the diagram:
- Initial: FRONT=[10], REAR=[50] → queue: 10, 20, 30, 40, 50
- **Enqueue(60)** at rear: ... 40, 50, 60
- **Dequeue()** from front: removes 10, new FRONT=20

| Operation | Description | Time |
|-----------|-------------|------|
| **enqueue(x)** | Add to rear | O(1) |
| **dequeue()** | Remove from front | O(1) |
| **front()** | View front | O(1) |
| **isEmpty()** | Check if empty | O(1) |

## Implementation

\`\`\`python
from collections import deque

class Queue:
    def __init__(self):
        self._data = deque()

    def enqueue(self, item):
        self._data.append(item)       # add to right (rear)

    def dequeue(self):
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self._data.popleft()   # remove from left (front)

    def front(self):
        return self._data[0]

    def is_empty(self):
        return len(self._data) == 0

q = Queue()
q.enqueue(10); q.enqueue(20); q.enqueue(30)
print(q.dequeue())   # 10 (FIFO — first in, first out)
print(q.front())     # 20 (peek)
\`\`\`

## The Linear Queue Problem

![Linear Queue — False Overflow Problem](/DSA%20images/dimg11.png)

The diagram shows the classic problem:
- Array positions 0, 1, 2 are empty (already dequeued)
- But rear has reached MAX, so the queue **thinks it's full**
- Empty space at front is wasted — **False Overflow**

**Solution: Circular Queue** — when rear reaches end, wrap to position 0.

\`\`\`python
class CircularQueue:
    def __init__(self, capacity):
        self.capacity = capacity
        self.data = [None] * capacity
        self.front = self.rear = -1

    def enqueue(self, item):
        if self.is_full():
            raise Exception("Queue full")
        if self.is_empty():
            self.front = 0
        self.rear = (self.rear + 1) % self.capacity   # wrap!
        self.data[self.rear] = item

    def dequeue(self):
        if self.is_empty():
            raise Exception("Queue empty")
        val = self.data[self.front]
        if self.front == self.rear:
            self.front = self.rear = -1       # last element
        else:
            self.front = (self.front + 1) % self.capacity
        return val

    def is_full(self):
        return (self.rear + 1) % self.capacity == self.front

    def is_empty(self):
        return self.front == -1
\`\`\`

## Types of Queues

| Type | Insert | Remove | Use Case |
|------|--------|--------|----------|
| **Linear Queue** | Rear | Front | Basic scheduling |
| **Circular Queue** | Rear (wraps) | Front (wraps) | CPU scheduling, buffer |
| **Deque** | Both ends | Both ends | Sliding window |
| **Priority Queue** | By priority | Highest priority | Hospital emergency, Dijkstra |

## Applications
- **CPU Scheduling** — processes queue for CPU time
- **Print Spooler** — print jobs served in order
- **BFS** — graph level-order traversal
- **Web Server** — HTTP requests queued
- **Keyboard Buffer** — keystrokes processed in order

:::tip
Always use **\`collections.deque\`** in Python — never use list for queues. \`list.pop(0)\` is O(n) because it shifts all elements. \`deque.popleft()\` is **O(1)**. This single change can make BFS 100× faster on large graphs.
:::`,


// ─────────────────────────────────────────────────────────────────
12: `# DS — Trees

:::scenario
Your file system: C:/Users/Arjun/Documents/Projects/CareerEzi. Folders inside folders inside folders. A flat list can't represent this — you need a structure where one node can have many children. That's a **Tree**.
:::

## What is a Tree?

A **Tree** is a hierarchical non-linear data structure with:
- One **root** node at the top
- Each node has zero or more **children**
- Every node (except root) has exactly **one parent**
- **No cycles** — no way to loop back

## Tree Structure — Visual

![Non-Linear Tree — Multiple Children](/DSA%20images/dimg2.png)

Node **1** is the root. It connects to **2** and **3**. Node **2** connects to **4** and **5**. Each node can have **multiple children** — that's what makes it non-linear.

## Tree Terminology

![Tree Structure — Levels, Leaf Nodes, Edges](/DSA%20images/dimg12.png)

From the diagram:
- **Node [1]** = ROOT (Level 0)
- **Nodes [2],[3]** = Level 1
- **Nodes [4],[5],[6]** = Level 2
- **Node [8]** = LEAF node (Level 3, no children)
- **7 edges** for **8 nodes** — Rule: n nodes → always n-1 edges

| Term | Definition |
|------|-----------|
| **Root** | Top node — no parent |
| **Leaf** | Node with no children |
| **Parent/Child** | Direct above/below relationship |
| **Sibling** | Same parent |
| **Height** | Longest root-to-leaf path |
| **Depth** | Distance from root to node |
| **Subtree** | A node and all its descendants |
| **Degree** | Number of children a node has |

## Basic Binary Tree

Each node has **at most 2 children** (left and right):

\`\`\`python
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

#        1
#       / \\
#      2   3
#     / \\
#    4   5

root = TreeNode(1)
root.left  = TreeNode(2)
root.right = TreeNode(3)
root.left.left  = TreeNode(4)
root.left.right = TreeNode(5)
\`\`\`

## Tree Traversals

### Inorder — Left → Node → Right

![Inorder Traversal — LNR gives sorted output for BST](/DSA%20images/dimg13.png)

\`\`\`python
def inorder(node):
    if node is None: return
    inorder(node.left)
    print(node.val, end=" ")
    inorder(node.right)
# Output: 1 2 3 4 6 7
\`\`\`

### Preorder — Node → Left → Right

\`\`\`python
def preorder(node):
    if node is None: return
    print(node.val, end=" ")
    preorder(node.left)
    preorder(node.right)
# Output: 4 2 1 3 6 7
\`\`\`

### Postorder — Left → Right → Node

\`\`\`python
def postorder(node):
    if node is None: return
    postorder(node.left)
    postorder(node.right)
    print(node.val, end=" ")
# Output: 1 3 2 7 6 4
\`\`\`

### Level Order (BFS)

\`\`\`python
from collections import deque

def level_order(root):
    queue = deque([root])
    while queue:
        node = queue.popleft()
        print(node.val, end=" ")
        if node.left:  queue.append(node.left)
        if node.right: queue.append(node.right)
# Output: 4 2 6 1 3 7
\`\`\`

| Traversal | Order | Key Use |
|-----------|-------|---------|
| Inorder | L→N→R | Sorted output from BST |
| Preorder | N→L→R | Copy / serialize tree |
| Postorder | L→R→N | Delete tree, evaluate expressions |
| Level Order | Level by level | BFS, shortest path |

:::tip
**Memory trick:** Pre/In/Post refers to where the **Node** is visited relative to Left and Right.
- **Pre** = Node **first**
- **In** = Node **middle**
- **Post** = Node **last**
:::`,

// ─────────────────────────────────────────────────────────────────
13: `# Types of Trees

## Binary Search Tree (BST)

A BST is a binary tree where: **left subtree < node < right subtree** at every node.

![Binary Search Tree — Search Example](/DSA%20images/dimg14.png)

From the diagram (root=50):
- Left: {20,30,40} — all < 50 ✓
- Right: {60,70,80} — all > 50 ✓
- **Search 40:** 50→30→40 ✅ FOUND (3 steps)
- **Search 45:** 50→30→40→NULL ✗ NOT FOUND

\`\`\`python
def bst_search(node, key):
    if not node: return False
    if key == node.val: return True
    elif key < node.val: return bst_search(node.left, key)
    else: return bst_search(node.right, key)

def bst_insert(node, key):
    if not node: return TreeNode(key)
    if key < node.val: node.left = bst_insert(node.left, key)
    elif key > node.val: node.right = bst_insert(node.right, key)
    return node
\`\`\`

**Complexity:** O(log n) average, O(n) worst (skewed tree).

---

## AVL Tree (Self-Balancing BST)

Ensures height stays O(log n) by **rotating** after every insert/delete.

**Balance Factor = height(left) − height(right)** must be −1, 0, or +1.

### Right Rotation — LL Case

![AVL Right Rotation — LL Case](/DSA%20images/dimg15.png)

When the left subtree of the left child is too tall, perform a **right rotation**: y becomes the new root, z moves right.

### All Four Rotation Cases

![AVL — All 4 Rotation Types](/DSA%20images/dimg16.png)

| Case | Problem | Fix |
|------|---------|-----|
| **LL** | Left of Left | Single Right Rotation |
| **RR** | Right of Right | Single Left Rotation |
| **LR** | Right of Left | Left on child, then Right |
| **RL** | Left of Right | Right on child, then Left |

\`\`\`python
def get_balance(node):
    if not node: return 0
    return get_height(node.left) - get_height(node.right)

# After insert, check balance and rotate if needed:
bf = get_balance(node)
if bf > 1 and key < node.left.key:   return right_rotate(node)  # LL
if bf < -1 and key > node.right.key: return left_rotate(node)   # RR
if bf > 1 and key > node.left.key:                               # LR
    node.left = left_rotate(node.left)
    return right_rotate(node)
if bf < -1 and key < node.right.key:                             # RL
    node.right = right_rotate(node.right)
    return left_rotate(node)
\`\`\`

---

## Heap

A **complete binary tree** where every parent satisfies the heap property.

![Max-Heap and Min-Heap with Array Representation](/DSA%20images/dimg17.png)

- **Max-Heap** (left): root = 90 (maximum), every parent ≥ children
- **Min-Heap** (right): root = 10 (minimum), every parent ≤ children
- **Array representation** (1-indexed): parent(i)=i//2, left=2i, right=2i+1

\`\`\`python
import heapq
heap = []
heapq.heappush(heap, 30)
heapq.heappush(heap, 10)
heapq.heappush(heap, 20)
print(heapq.heappop(heap))  # 10 — min-heap, smallest first
\`\`\`

**Operations:** Insert O(log n), Extract-min/max O(log n), Peek O(1).
**Use:** Priority queues, heap sort, Dijkstra's algorithm.

---

## Trie (Prefix Tree)

A tree where each path from root to a node spells out a string prefix.

![Trie — Prefix Tree for String Searching](/DSA%20images/dimg18.png)

Trie for {cat, can, car, dog, do}:
- **Search 'can':** ROOT→c→a→n→[END] — just **3 comparisons**, success!
- **Autocomplete 'ca':** returns cat, can, car instantly

\`\`\`python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self): self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children: return False
            node = node.children[ch]
        return node.is_end

    def starts_with(self, prefix):
        node = self.root
        for ch in prefix:
            if ch not in node.children: return False
            node = node.children[ch]
        return True
\`\`\`

**Complexity:** Insert/Search/Prefix — all **O(k)** where k = word length.
**Use:** Autocomplete, spell check, IP routing.

---

## Tree Types Summary

| Tree | Key Property | Search | Use Case |
|------|-------------|--------|----------|
| Binary Tree | ≤2 children | O(n) | General hierarchy |
| BST | left<node<right | O(log n) avg | Sorted data |
| AVL Tree | Balanced BST | **O(log n) always** | Frequent lookups |
| Heap | Parent≥/≤children | O(1) peek | Priority queue |
| Trie | Char-per-node paths | O(k) | String prefix search |`,

// ─────────────────────────────────────────────────────────────────
14: `# DS — Graphs

:::scenario
Google Maps: cities are nodes, roads are edges. Facebook: users are nodes, friendships are edges. The Internet: web pages are nodes, hyperlinks are edges. All of these are **Graphs** — the most powerful and general data structure.
:::

## What is a Graph?

A **Graph G = (V, E)** consists of:
- **V** — set of vertices (nodes)
- **E** — set of edges (connections between vertices)

## Undirected vs Directed

### Undirected Graph
Edges have **no direction** — A-B means A connects to B AND B connects to A.

![Undirected Graph — Bidirectional Edges](/DSA%20images/dimg19.png)

Vertices: A, B, C, D, E. All edges are bidirectional.

### Directed Graph (Digraph)
Edges have a **direction** (arrow) — A→B does NOT mean B→A.

![Directed Graph — One-Way Edges](/DSA%20images/dimg20.png)

A→B, A→C, B→D, D→A, D→C, D→E (one-way connections).

## Graph Representation 1 — Adjacency Matrix

![Adjacency Matrix — V×V grid](/DSA%20images/dimg21.png)

A **V×V** array where **matrix[i][j] = 1** if edge i→j exists.

From the diagram (graph A-B, A-C, B-D, C-D, D-E):
\`\`\`
    A  B  C  D  E
A [ 0, 1, 1, 0, 0 ]
B [ 1, 0, 0, 1, 0 ]
C [ 1, 0, 0, 1, 0 ]
D [ 0, 1, 1, 0, 1 ]
E [ 0, 0, 0, 1, 0 ]
\`\`\`

- **Edge check:** O(1) — instant
- **Space:** O(V²) — wastes memory for sparse graphs

## Graph Representation 2 — Adjacency List

![Graph — Adjacency List Example](/DSA%20images/dimg22.png)

Each vertex stores **only its actual neighbours**:

\`\`\`python
# Adjacency List — much more memory efficient
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C', 'E'],
    'E': ['D']
}
# Space: O(V + E) — only stores existing edges
\`\`\`

## Comparison

| | Adjacency Matrix | Adjacency List |
|-|-----------------|----------------|
| Space | O(V²) | **O(V+E)** |
| Edge check | **O(1)** | O(degree) |
| All neighbors | O(V) | **O(degree)** |
| Best for | Dense (E≈V²) | **Sparse (E≈V)** — most real graphs |

## Graph Terminology

| Term | Meaning |
|------|---------|
| **Degree** | Number of edges at a vertex |
| **In-degree** | Edges coming IN (directed) |
| **Out-degree** | Edges going OUT (directed) |
| **Path** | Sequence of vertices via edges |
| **Cycle** | Path that returns to start |
| **Connected** | Path exists between every pair |
| **Weighted** | Edges carry values (distance, cost) |
| **DAG** | Directed Acyclic Graph — no cycles |

## Graph Implementation

\`\`\`python
from collections import defaultdict

class Graph:
    def __init__(self, directed=False):
        self.adj = defaultdict(list)
        self.directed = directed

    def add_edge(self, u, v, weight=1):
        self.adj[u].append((v, weight))
        if not self.directed:
            self.adj[v].append((u, weight))  # undirected: both ways

    def neighbors(self, u):
        return self.adj[u]

g = Graph()
g.add_edge('A', 'B')
g.add_edge('A', 'C')
g.add_edge('B', 'D')
print(g.neighbors('A'))   # [('B',1), ('C',1)]
\`\`\`

:::insight
**Real-world graphs are almost always SPARSE** — Facebook has 3 billion users but each person has ~300 friends. V=3B, E≈900B but V²=9×10^18. Adjacency matrix would need 9 quintillion cells. Adjacency list uses only V+E ≈ 903 billion — 10 million times less.
:::`,

// ─────────────────────────────────────────────────────────────────
15: `# Graph Traversal — BFS & DFS

Two fundamental algorithms for visiting every node in a graph. Every graph problem — shortest path, cycle detection, connected components, topological sort — uses one of these.

---

## BFS — Breadth First Search

Explores the graph **level by level** using a **Queue (FIFO)**.

### Step-by-Step

![BFS — Level-by-Level Traversal](/DSA%20images/dimg23.png)

Starting at A:
- **Level 0:** Visit A → enqueue B, C
- **Level 1:** Dequeue B (visit, enqueue D,E), Dequeue C (visit, enqueue F)
- **Level 2:** Dequeue D, E, F (visit each)

**BFS Order: A → B → C → D → E → F**

### Implementation

\`\`\`python
from collections import deque

def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    order = []

    while queue:
        node = queue.popleft()    # FIFO
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order
\`\`\`

### Shortest Path (BFS)

BFS guarantees the **shortest path** (fewest edges) in an unweighted graph:

\`\`\`python
def shortest_path(graph, start, end):
    queue = deque([[start]])
    visited = {start}
    while queue:
        path = queue.popleft()
        node = path[-1]
        if node == end: return path
        for n in graph[node]:
            if n not in visited:
                visited.add(n)
                queue.append(path + [n])
    return None
\`\`\`

---

## DFS — Depth First Search

Explores as **deep as possible** along each branch before backtracking. Uses a **Stack** (or recursion).

### Step-by-Step

![DFS — Graph Example](/DSA%20images/dimg24.png)

![DFS — Full Traversal Order](/DSA%20images/dimg25.png)

From the diagram, starting at A:
1. Visit A → go deep to B
2. From B → go deep to D
3. D: dead end → backtrack to B
4. From B → visit E → backtrack
5. Back to A → visit C

**DFS Order: A → B → D → E → C**

### Implementation — Recursive

\`\`\`python
def dfs(graph, node, visited=None):
    if visited is None: visited = set()
    visited.add(node)
    print(node, end=" ")
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
\`\`\`

### Implementation — Iterative

\`\`\`python
def dfs_iterative(graph, start):
    visited, stack, order = set(), [start], []
    while stack:
        node = stack.pop()    # LIFO
        if node in visited: continue
        visited.add(node)
        order.append(node)
        for n in reversed(graph[node]):
            if n not in visited:
                stack.append(n)
    return order
\`\`\`

### DFS Applications

\`\`\`python
# Cycle Detection
def has_cycle(graph, node, visited, parent):
    visited.add(node)
    for n in graph[node]:
        if n not in visited:
            if has_cycle(graph, n, visited, node): return True
        elif n != parent:    # back edge = cycle
            return True
    return False

# Topological Sort (for DAGs)
def topo_sort(graph):
    visited, stack = set(), []
    def dfs(node):
        visited.add(node)
        for n in graph.get(node, []):
            if n not in visited: dfs(n)
        stack.append(node)
    for node in graph:
        if node not in visited: dfs(node)
    return stack[::-1]
\`\`\`

---

## BFS vs DFS

| | BFS | DFS |
|-|-----|-----|
| Data structure | Queue | Stack |
| Explores | Level by level | Branch by branch |
| Shortest path | **✅ Guarantees** | ❌ No |
| Memory | O(V) — wider | O(h) — depth |
| Use for | Shortest path, level-order | Cycle detection, topological sort, maze |
| Time complexity | O(V+E) | O(V+E) |

:::tip
**Interview rule:** When problem says "shortest path" or "minimum steps" → BFS. When problem says "all paths", "exists a path", "topological order" → DFS.
:::`,

// ─────────────────────────────────────────────────────────────────
16: `# Searching

:::scenario
You have a database of 1 million records. A user types a search query. You need to find matching records. How you search determines whether the response takes 0.001 seconds or 10 seconds. **Searching algorithms** are the difference.
:::

## What is Searching?

**Searching** is the process of finding a particular element (key) in a collection of data. It is one of the most fundamental operations in computing.

## Types of Searching

### By Data Requirement

| Type | Requires Sorting? | Examples |
|------|-------------------|---------|
| **Sequential / Linear** | No | Linear Search |
| **Interval-based** | Yes (sorted) | Binary Search, Jump Search |
| **Hashing** | No (special structure) | Hash Map lookup |
| **Tree-based** | No (tree structure) | BST Search, Trie |

### By Strategy

| Strategy | How It Works | Complexity |
|----------|-------------|------------|
| **Brute Force** | Check every element | O(n) |
| **Divide & Conquer** | Halve search space | O(log n) |
| **Hashing** | Direct address calculation | O(1) average |

## Factors for Choosing a Search Algorithm

\`\`\`
1. Is data SORTED?
   Yes → Binary Search O(log n), Jump Search O(√n)
   No  → Linear Search O(n), or sort first then binary

2. How often will you SEARCH?
   Once  → Linear O(n) is fine (sorting costs more)
   Many  → Sort once, binary search many times

3. What DATA TYPE?
   Numbers/strings → any algorithm
   Objects by key  → hash map O(1)
   Prefix match    → Trie O(k)

4. Is data in MEMORY or on DISK?
   Memory → Binary Search is best
   Disk   → B-Tree or Jump Search (fewer seeks)
\`\`\`

## Comparison of Search Algorithms

| Algorithm | Time | Space | Sorted? | Best Use |
|-----------|------|-------|---------|----------|
| Linear Search | O(n) | O(1) | No | Small/unsorted data |
| Binary Search | O(log n) | O(1) | **Yes** | Large sorted array |
| Jump Search | O(√n) | O(1) | **Yes** | Disk-based sorted data |
| Interpolation Search | O(log log n) | O(1) | Yes (uniform) | Uniformly distributed data |
| Hash Lookup | **O(1)** avg | O(n) | No | Key-value lookup |
| BST Search | O(log n) avg | O(n) | — (tree) | Dynamic sorted data |
| Trie Search | **O(k)** | O(n·k) | — (tree) | String prefix search |

## Internal vs External Searching

**Internal Searching:** All data fits in RAM (most common)
- Use binary search, hash maps, BSTs

**External Searching:** Data is on disk (databases, file systems)
- Use B-Trees (databases), Jump Search
- Minimize disk I/O — random access is expensive

## The Cost of Searching at Scale

\`\`\`
n = 1,000,000,000 (1 billion records — like a real database)

Linear Search:    1,000,000,000 comparisons → ~1 second
Binary Search:    30 comparisons            → 0.00003 ms
Hash Map:         1 comparison              → instant
\`\`\`

:::insight
**This is why databases use indexes.** Without an index, every query is O(n) — scan every row. With a B-Tree index, every query is O(log n). Adding an index on a 100M row table can turn a 30-second query into a 0.1ms query. Same data, different structure.
:::`,

// ─────────────────────────────────────────────────────────────────
17: `# Searching Algorithms with Examples

Detailed walkthroughs of the three key searching algorithms, with step-by-step diagrams.

---

## 1. Linear Search

Check each element one by one from left to right.

![Linear Search — Step-by-Step Example](/DSA%20images/dimg26.png)

**Searching for 22** in [64, 25, 12, 22, 11]:
- Step 1: 64 ≠ 22 ❌
- Step 2: 25 ≠ 22 ❌
- Step 3: 12 ≠ 22 ❌
- Step 4: **22 = 22** ✅ Found at index 3

\`\`\`python
def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1

print(linear_search([64,25,12,22,11], 22))   # 3
print(linear_search([64,25,12,22,11], 99))   # -1
\`\`\`

**Complexity:** O(n) time, O(1) space. Works on **unsorted** arrays.

---

## 2. Binary Search

Repeatedly halve the search space. **Requires sorted array.**

![Binary Search — 3-Iteration Example](/DSA%20images/dimg27.png)

**Searching for 23** in sorted [2,5,8,12,16,23,38,42,56,72]:

- **Iteration 1:** low=0, high=9, mid=4 → arr[4]=16 < 23 → search right (low=5)
- **Iteration 2:** low=5, high=9, mid=7 → arr[7]=42 > 23 → search left (high=6)
- **Iteration 3:** low=5, high=6, mid=5 → arr[5]=23 = 23 ✅ **FOUND at index 5!**

Only **3 comparisons** vs 6 for linear. For 1 billion items: **30 comparisons** vs 1 billion!

\`\`\`python
def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:   return mid
        elif arr[mid] < target:  low = mid + 1
        else:                    high = mid - 1
    return -1

arr = [2, 5, 8, 12, 16, 23, 38, 42, 56, 72]
print(binary_search(arr, 23))   # 5
print(binary_search(arr, 7))    # -1
\`\`\`

**Complexity:** O(log n) time, O(1) space. **Must be sorted.**

---

## 3. Jump Search

Jump in fixed blocks of **√n**, then linear search backwards.

![Jump Search — Block Jumping then Linear Phase](/DSA%20images/dimg28.png)

**Searching for 19** in 16-element sorted array. Block size = √16 = 4:
- Jump 1: arr[0]=1 < 19 ✓
- Jump 2: arr[4]=9 < 19 ✓
- Jump 3: arr[8]=17 < 19 ✓
- Jump 4: arr[12]=25 > 19 ✗ **OVERSHOT** → go back to index 8
- **Linear phase:** arr[8]=17, arr[9]=19 ✅ **FOUND at index 9!**

\`\`\`python
import math

def jump_search(arr, target):
    n = len(arr)
    step = int(math.sqrt(n))
    prev = 0

    # Jump forward until overshoot
    while arr[min(step, n) - 1] < target:
        prev = step
        step += int(math.sqrt(n))
        if prev >= n: return -1

    # Linear search backwards in the identified block
    while arr[prev] < target:
        prev += 1
        if prev == min(step, n): return -1

    return prev if arr[prev] == target else -1

arr = [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31]
print(jump_search(arr, 19))   # 9
\`\`\`

**Complexity:** O(√n) time, O(1) space. **Must be sorted.**

---

## Summary Comparison

| Algorithm | Array | Time | Best For |
|-----------|-------|------|----------|
| Linear | Unsorted/sorted | O(n) | Small data, one-time search |
| Binary | **Must be sorted** | **O(log n)** | Large sorted data in memory |
| Jump | **Must be sorted** | **O(√n)** | Large sorted data on disk |

:::tip
**Python Built-ins:**
\`\`\`python
# Linear: Python's 'in' operator
print(22 in [64, 25, 12, 22, 11])   # True — O(n)

# Binary: bisect module
import bisect
arr = [2, 5, 8, 12, 16, 23, 38]
i = bisect.bisect_left(arr, 16)     # O(log n)
print(arr[i] == 16)                 # True
\`\`\`
:::`,

// ─────────────────────────────────────────────────────────────────
18: `# Sorting Algorithms

:::scenario
A leaderboard must show 10,000 students ranked by score. An unsorted list is useless. A sorted list unlocks binary search, better display, analytics. Sorting is one of the most studied problems in computer science — because it comes up everywhere.
:::

## What is Sorting?

**Sorting** is arranging elements in a defined order (ascending/descending) so data can be accessed more efficiently.

## Why Sorting Matters

- Enables **binary search** (O(log n) vs O(n))
- Required for **merge operations**, removing duplicates
- Improves **readability** of output (leaderboards, reports)
- Prerequisite for many **greedy algorithms**
- Foundation for **database query optimization**

## Key Properties of Sorting Algorithms

### Stable vs Unstable
- **Stable:** Equal elements maintain their original relative order
- **Unstable:** Equal elements may swap positions

\`\`\`
Original: [(Arjun,85), (Priya,85), (Raj,90)]

Stable sort by score:    [(Arjun,85), (Priya,85), (Raj,90)]  ← Arjun before Priya ✓
Unstable sort by score:  [(Priya,85), (Arjun,85), (Raj,90)]  ← order may flip
\`\`\`

### In-Place vs Out-of-Place
- **In-place:** Sorts within the original array, O(1) extra space
- **Out-of-place:** Creates a new array, O(n) extra space

### Adaptive vs Non-Adaptive
- **Adaptive:** Faster when data is already partially sorted
- **Non-adaptive:** Same performance regardless of input order

## Sorting Algorithm Overview

| Algorithm | Best | Average | Worst | Space | Stable | Adaptive |
|-----------|------|---------|-------|-------|--------|----------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ | ✅ |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | ❌ | ❌ |
| Insertion Sort | **O(n)** | O(n²) | O(n²) | O(1) | ✅ | ✅ |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ | ❌ |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ | ❌ |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | ❌ | ❌ |

## When to Use Which Algorithm

\`\`\`
Small array (n < 20):           Insertion Sort — low overhead
Nearly sorted array:            Insertion Sort — O(n) best case
General purpose, speed:         Quick Sort — fastest in practice
Guaranteed worst case:          Merge Sort — always O(n log n)
Memory constrained:             Heap Sort — O(1) space, O(n log n)
Stability required:             Merge Sort or Insertion Sort
Linked list:                    Merge Sort — no random access needed
External sort (disk):           Merge Sort — sequential access
\`\`\`

## How Python Sorts

Python uses **Timsort** — a hybrid of merge sort and insertion sort:
- Uses insertion sort for small chunks (n < 64) — low overhead
- Uses merge sort for larger chunks — O(n log n) guaranteed
- **Detects existing runs** (sorted sequences) — nearly sorted → O(n)
- **Stable:** equal elements preserve relative order

\`\`\`python
# Python sort — Timsort, O(n log n) worst, O(n) best
arr = [85, 92, 78, 95, 88]
arr.sort()                    # in-place
sorted_arr = sorted(arr)      # returns new list

# Custom sort key
students = [("Arjun",85), ("Priya",92), ("Raj",78)]
students.sort(key=lambda s: s[1], reverse=True)
# [("Priya",92), ("Arjun",85), ("Raj",78)]
\`\`\`

:::insight
**Sorting is a solved problem for general use.** Always use your language's built-in sort in production — Python's Timsort, Java's dual-pivot QuickSort, C++'s introsort are all heavily optimized. You implement sorting algorithms to understand the underlying concepts, not to replace built-ins.
:::`,

// ─────────────────────────────────────────────────────────────────
19: `# Sorting Algorithm Implementations

Step-by-step walkthroughs of all five major sorting algorithms with diagrams.

---

## 1. Bubble Sort

Repeatedly swap adjacent elements if out of order. Largest "bubbles up" to the end each pass.

![Bubble Sort — Full Step-by-Step on 7 Elements](/DSA%20images/dimg29.png)

Original: [64,34,25,12,22,11,90]. After 6 passes → **[11,12,22,25,34,64,90]** ✅

\`\`\`python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(n - i - 1):     # last i elements already sorted
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = True
        if not swapped: break           # already sorted — O(n) best case
    return arr
\`\`\`
**Time:** O(n²) avg/worst, O(n) best | **Space:** O(1) | **Stable:** ✅

---

## 2. Selection Sort

Find minimum, place at front. Repeat for remaining subarray.

![Selection Sort — Find Minimum, Swap to Front](/DSA%20images/dimg30.png)

Original [64,25,12,22,11]:
- Pass 1: Min=11 → swap index 0↔4 → [11,25,12,22,64]
- Pass 2: Min=12 → swap index 1↔2 → [11,12,25,22,64]
- Pass 3: Min=22 → swap index 2↔3 → [11,12,22,25,64]
- Pass 4: No swap needed → SORTED ✅

\`\`\`python
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr
\`\`\`
**Time:** O(n²) all cases | **Space:** O(1) | **Stable:** ❌ | **Min swaps:** O(n)

---

## 3. Insertion Sort

Pick next element, insert it into its correct position among already-sorted elements.

![Insertion Sort — Pick and Insert into Sorted Portion](/DSA%20images/dimg31.png)

Array [12,11,13,5,6]:
- i=1, key=11: shift 12 right → insert 11 → [11,12,13,5,6]
- i=2, key=13: 13>12, in place → [11,12,13,5,6]
- i=3, key=5: shift 13,12,11 right → [5,11,12,13,6]
- i=4, key=6: shift 13,12,11 right → [5,6,11,12,13] ✅

\`\`\`python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j+1] = arr[j]    # shift right
            j -= 1
        arr[j+1] = key           # insert
    return arr
\`\`\`
**Time:** O(n) best, O(n²) avg/worst | **Space:** O(1) | **Stable:** ✅ | **Adaptive:** ✅

---

## 4. Merge Sort

Divide array in half recursively, then merge sorted halves.

![Merge Sort — Divide and Conquer Visualization](/DSA%20images/dimg32.png)

[38,27,43,3,9,82,10] → divide until single elements → merge back:
- [27,38] [3,43] [9,82] [10] → [3,27,38,43] [9,10,82] → **[3,9,10,27,38,43,82]** ✅

\`\`\`python
def merge_sort(arr):
    if len(arr) <= 1: return arr
    mid = len(arr) // 2
    left  = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:]); result.extend(right[j:])
    return result
\`\`\`
**Time:** O(n log n) all cases | **Space:** O(n) | **Stable:** ✅ | **Guaranteed worst case**

---

## 5. Quick Sort

Pick a pivot, partition into < pivot and > pivot, recursively sort both sides.

![Quick Sort — Partition Step and Recursive Sorting](/DSA%20images/dimg33.png)

[10,80,30,90,40,50,70], pivot=70:
- Left (< 70): 10,30,40,50
- Right (> 70): 90,80
- Place pivot: [10,30,40,50,**70**,90,80] → **70 at correct position**
- Recursively sort left [10,30,40,50] and right [90,80]
- Final: [10,30,40,50,70,80,90] ✅

\`\`\`python
def quick_sort(arr, low=0, high=None):
    if high is None: high = len(arr)-1
    if low < high:
        p = partition(arr, low, high)
        quick_sort(arr, low, p-1)
        quick_sort(arr, p+1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i+1
\`\`\`
**Time:** O(n log n) avg, O(n²) worst | **Space:** O(log n) | **Fastest in practice**

---

## Final Comparison

| | Bubble | Selection | Insertion | Merge | Quick |
|-|--------|-----------|-----------|-------|-------|
| Best | O(n) | O(n²) | **O(n)** | O(n log n) | O(n log n) |
| Avg | O(n²) | O(n²) | O(n²) | O(n log n) | **O(n log n)** |
| Worst | O(n²) | O(n²) | O(n²) | **O(n log n)** | O(n²) |
| Space | O(1) | O(1) | O(1) | O(n) | O(log n) |
| Stable | ✅ | ❌ | ✅ | ✅ | ❌ |`,

// ─────────────────────────────────────────────────────────────────
20: `# DS Interview Questions — 50 Q&A

The 50 most commonly asked DSA interview questions at top companies (Google, Amazon, Microsoft, Flipkart), with clear concise answers.

---

## Arrays

**Q1. What is the time complexity of accessing an element in an array?**
O(1) — direct address calculation: base + index × size.

**Q2. Why is inserting at the middle of an array O(n)?**
All elements after the insertion point must shift right by one position.

**Q3. What is the difference between an array and a linked list?**
Array: contiguous memory, O(1) access, O(n) insert/delete. Linked list: scattered memory, O(n) access, O(1) insert/delete at head.

**Q4. When would you prefer an array over a linked list?**
When you need frequent random access by index, cache performance matters, or the size is known upfront.

**Q5. What is a dynamic array? How does it resize?**
A dynamic array (like Python list or Java ArrayList) doubles its capacity when full. The amortized insert cost is O(1) — occasional O(n) resizes average out.

---

## Linked Lists

**Q6. What is a circular linked list? Where is it used?**
Last node points back to head. Used in round-robin CPU scheduling, circular buffers, and multiplayer game turns.

**Q7. How do you detect a cycle in a linked list?**
Floyd's cycle detection (two pointers): slow moves 1 step, fast moves 2. If they meet, there's a cycle. O(n) time, O(1) space.

\`\`\`python
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast: return True
    return False
\`\`\`

**Q8. How do you reverse a linked list?**
\`\`\`python
def reverse(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev, curr = curr, nxt
    return prev
\`\`\`

**Q9. How do you find the middle of a linked list?**
Slow/fast pointers: slow moves 1 step, fast moves 2. When fast reaches end, slow is at the middle.

**Q10. Difference between singly and doubly linked list?**
Singly: one pointer (next), forward traversal only. Doubly: two pointers (next + prev), bidirectional traversal, easier deletion.

---

## Stacks & Queues

**Q11. What are the applications of a stack?**
Function call stack, undo/redo, balanced parentheses, expression evaluation, browser history, DFS traversal.

**Q12. How do you implement a queue using two stacks?**
Push to stack1. For dequeue: if stack2 is empty, pop all from stack1 into stack2, then pop from stack2. Amortized O(1).

**Q13. What is a priority queue? How is it implemented?**
Elements dequeued by priority, not arrival order. Implemented using a heap. Enqueue/Dequeue O(log n), Peek O(1).

**Q14. Difference between stack and queue?**
Stack: LIFO (last in, first out). Queue: FIFO (first in, first out).

**Q15. What is a deque?**
Double-ended queue — insert and delete at both front and rear. Python's \`collections.deque\` implements this efficiently.

---

## Trees

**Q16. What is the height of a binary tree?**
Length of longest root-to-leaf path (number of edges). A single node has height 0.

**Q17. What is the difference between height and depth?**
Depth of node = distance from root to that node. Height of node = distance from that node to the deepest leaf.

**Q18. How many nodes in a perfect binary tree of height h?**
2^(h+1) - 1 nodes. At height 3: 2^4 - 1 = 15 nodes.

**Q19. What is a balanced binary tree?**
Height of left and right subtrees of every node differs by at most 1. Guarantees O(log n) operations.

**Q20. Why is BST search O(log n) only on average?**
In the worst case (sorted insertion), BST degenerates into a linked list with height n, making operations O(n). AVL trees fix this.

**Q21. What is an AVL tree? Why use it over BST?**
AVL is a self-balancing BST. It maintains |height(left) − height(right)| ≤ 1 at every node, guaranteeing O(log n) for all operations even in worst case.

**Q22. What is a heap? Max-heap vs min-heap?**
Complete binary tree with heap property. Max-heap: parent ≥ children (root = max). Min-heap: parent ≤ children (root = min).

**Q23. How does heapify work?**
Start from last non-leaf node, sift down each node. Building a heap from an array is O(n) (not O(n log n) as it might seem).

**Q24. What is a trie? When do you use it?**
Prefix tree where each character is a node. Use when you need prefix search, autocomplete, or spell checking. O(k) operations where k = word length.

**Q25. Inorder traversal of a BST gives what?**
Elements in sorted ascending order. This is the fastest way to check if a binary tree is a valid BST.

---

## Graphs

**Q26. Difference between BFS and DFS?**
BFS uses a queue, explores level by level, finds shortest path in unweighted graphs. DFS uses a stack/recursion, goes deep first, better for cycle detection and topological sort.

**Q27. When does BFS guarantee shortest path?**
Only in unweighted graphs (all edges have equal cost). For weighted graphs, use Dijkstra's.

**Q28. What is a DAG? Where is it used?**
Directed Acyclic Graph — directed graph with no cycles. Used in task scheduling, build systems (make, webpack), course prerequisites, spreadsheet dependencies.

**Q29. What is topological sorting?**
Linear ordering of vertices such that for every edge u→v, u comes before v. Only possible on DAGs. Used for dependency resolution.

**Q30. Adjacency list vs adjacency matrix?**
Matrix: O(V²) space, O(1) edge check — good for dense graphs. List: O(V+E) space, O(degree) edge check — good for sparse graphs (most real graphs).

---

## Searching & Sorting

**Q31. Why does binary search require sorted input?**
It relies on comparing midpoint to target and eliminating half — this only works if elements are in order.

**Q32. What is the worst case of quicksort and how to avoid it?**
O(n²) when pivot is always smallest or largest (sorted/reverse-sorted input). Fix: random pivot selection or "median of three".

**Q33. Why is merge sort preferred for linked lists?**
Linked lists don't support random access, so merge sort's sequential access pattern works well. Quicksort's partition step needs random access.

**Q34. What is a stable sort? Name stable sorting algorithms.**
Preserves relative order of equal elements. Stable: Bubble, Insertion, Merge Sort. Unstable: Selection, Quick, Heap Sort.

**Q35. What is the best sorting algorithm?**
Depends on context. Quick Sort fastest in practice for random data; Merge Sort for guaranteed O(n log n) and stability; Insertion Sort for small/nearly-sorted data; Timsort (Python) is optimal for real-world data.

---

## Complexity & General

**Q36. What is the difference between O(1) and O(n)?**
O(1): constant time — same regardless of input size. O(n): linear time — doubles when input doubles.

**Q37. What is amortized time complexity?**
Average time per operation over a sequence of operations. A dynamic array append is O(1) amortized — most appends are O(1), occasional O(n) resizes spread out.

**Q38. What is space complexity?**
Amount of extra memory an algorithm uses as a function of input size. O(1) = constant extra space. O(n) = space grows with input.

**Q39. What is the difference between best, average, and worst case?**
Best: most favorable input (already sorted for insertion sort → O(n)). Worst: most unfavorable (reverse-sorted). Average: expected over all possible inputs.

**Q40. What does "in-place" sorting mean?**
Sorting using O(1) extra space — rearranges within the original array. Bubble, Selection, Insertion, and Heap Sort are in-place. Merge Sort is not.

---

## Advanced

**Q41. What is a hash table/hash map?**
Data structure that maps keys to values using a hash function. Average O(1) for insert, delete, search. Handles collisions via chaining or open addressing.

**Q42. What is a collision in hashing?**
When two different keys hash to the same index. Handled by chaining (linked list at each slot) or open addressing (probe for next empty slot).

**Q43. What is dynamic programming?**
Technique to solve problems by breaking into overlapping sub-problems and storing results (memoization/tabulation) to avoid recomputation. Examples: Fibonacci, 0/1 Knapsack, Longest Common Subsequence.

**Q44. What is the difference between recursion and iteration?**
Recursion: function calls itself, uses call stack. Iteration: uses loops. Recursion is more elegant for tree/graph problems but risks stack overflow. Iteration is more memory-efficient.

**Q45. What is a segment tree?**
Tree data structure for range queries (range sum, range min/max) and point updates. O(log n) for both operations. Used in competitive programming and databases.

**Q46. What is a union-find (disjoint set)?**
Data structure tracking which elements are in the same set. Supports union and find operations in O(α(n)) ≈ O(1). Used in Kruskal's MST, cycle detection.

**Q47. Difference between BFS and Dijkstra's?**
BFS finds shortest path in unweighted graphs (O(V+E)). Dijkstra's finds shortest path in weighted graphs (O((V+E)log V) with heap).

**Q48. What is the difference between a tree and a graph?**
A tree is a connected, acyclic graph with n nodes and n-1 edges. A graph can have cycles, multiple components, and any number of edges.

**Q49. When would you use a min-heap vs max-heap?**
Min-heap: find/extract minimum quickly (Dijkstra's, Prim's). Max-heap: find/extract maximum quickly (heap sort, top-K largest elements).

**Q50. What is the time complexity of building a heap?**
O(n) — not O(n log n) as commonly assumed. Building from the bottom up (heapify) takes O(n) because lower levels do less work.`,

// ─────────────────────────────────────────────────────────────────
21: `# Data Structure Coding Questions

Practice these 20 classic coding problems. Each is a staple in technical interviews at top companies.

---

## Arrays

### 1. Two Sum
Find two indices in an array that add up to a target.
\`\`\`python
def two_sum(nums, target):
    seen = {}                          # value → index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

print(two_sum([2,7,11,15], 9))    # [0,1]
print(two_sum([3,2,4], 6))        # [1,2]
\`\`\`
**Complexity:** O(n) time, O(n) space.

---

### 2. Maximum Subarray (Kadane's Algorithm)
Find contiguous subarray with the largest sum.
\`\`\`python
def max_subarray(nums):
    max_sum = curr_sum = nums[0]
    for num in nums[1:]:
        curr_sum = max(num, curr_sum + num)
        max_sum = max(max_sum, curr_sum)
    return max_sum

print(max_subarray([-2,1,-3,4,-1,2,1,-5,4]))  # 6 → [4,-1,2,1]
\`\`\`

---

### 3. Rotate Array by K
\`\`\`python
def rotate(nums, k):
    n = len(nums)
    k %= n
    nums.reverse()           # reverse all
    nums[:k] = nums[:k][::-1]    # reverse first k
    nums[k:] = nums[k:][::-1]    # reverse rest

nums = [1,2,3,4,5,6,7]
rotate(nums, 3)
print(nums)   # [5,6,7,1,2,3,4]
\`\`\`

---

## Linked Lists

### 4. Reverse a Linked List
\`\`\`python
def reverse_list(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev, curr = curr, nxt
    return prev   # new head
\`\`\`

---

### 5. Find Middle of Linked List
\`\`\`python
def find_middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow   # slow is at middle
\`\`\`

---

### 6. Detect Cycle (Floyd's Algorithm)
\`\`\`python
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast: return True
    return False
\`\`\`

---

## Stacks

### 7. Valid Parentheses
\`\`\`python
def is_valid(s):
    stack = []
    pairs = {')':'(', '}':'{', ']':'['}
    for ch in s:
        if ch in '({[': stack.append(ch)
        elif not stack or stack[-1] != pairs[ch]: return False
        else: stack.pop()
    return not stack

print(is_valid("()[]{}"))   # True
print(is_valid("(]"))       # False
\`\`\`

---

### 8. Next Greater Element
\`\`\`python
def next_greater(arr):
    result = [-1] * len(arr)
    stack = []
    for i, num in enumerate(arr):
        while stack and arr[stack[-1]] < num:
            result[stack.pop()] = num
        stack.append(i)
    return result

print(next_greater([4,5,2,10,8]))  # [5,10,10,-1,-1]
\`\`\`

---

## Trees

### 9. Maximum Depth of Binary Tree
\`\`\`python
def max_depth(root):
    if not root: return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))
\`\`\`

---

### 10. Check if Binary Tree is Balanced
\`\`\`python
def is_balanced(root):
    def height(node):
        if not node: return 0
        lh = height(node.left)
        rh = height(node.right)
        if lh == -1 or rh == -1: return -1
        if abs(lh - rh) > 1: return -1
        return 1 + max(lh, rh)
    return height(root) != -1
\`\`\`

---

### 11. Lowest Common Ancestor (BST)
\`\`\`python
def lca(root, p, q):
    if p.val < root.val and q.val < root.val:
        return lca(root.left, p, q)
    if p.val > root.val and q.val > root.val:
        return lca(root.right, p, q)
    return root   # split point = LCA
\`\`\`

---

### 12. Level Order Traversal
\`\`\`python
from collections import deque
def level_order(root):
    if not root: return []
    result, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:  queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result
\`\`\`

---

## Graphs

### 13. Number of Islands
\`\`\`python
def num_islands(grid):
    count = 0
    def dfs(r, c):
        if r<0 or r>=len(grid) or c<0 or c>=len(grid[0]) or grid[r][c]!='1':
            return
        grid[r][c] = '0'    # mark visited
        for dr,dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            dfs(r+dr, c+dc)
    for r in range(len(grid)):
        for c in range(len(grid[0])):
            if grid[r][c] == '1':
                dfs(r, c); count += 1
    return count
\`\`\`

---

### 14. Shortest Path in Grid (BFS)
\`\`\`python
from collections import deque
def shortest_path(grid):
    rows, cols = len(grid), len(grid[0])
    queue = deque([(0,0,1)])   # (row, col, distance)
    visited = {(0,0)}
    while queue:
        r, c, dist = queue.popleft()
        if r == rows-1 and c == cols-1: return dist
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<rows and 0<=nc<cols and grid[nr][nc]==0 and (nr,nc) not in visited:
                visited.add((nr,nc))
                queue.append((nr,nc,dist+1))
    return -1
\`\`\`

---

## Searching & Sorting

### 15. Binary Search
\`\`\`python
def binary_search(arr, target):
    low, high = 0, len(arr)-1
    while low <= high:
        mid = (low+high)//2
        if arr[mid] == target: return mid
        elif arr[mid] < target: low = mid+1
        else: high = mid-1
    return -1
\`\`\`

---

### 16. Find First and Last Position (sorted array with duplicates)
\`\`\`python
import bisect
def search_range(nums, target):
    left  = bisect.bisect_left(nums, target)
    right = bisect.bisect_right(nums, target) - 1
    if left <= right and nums[left] == target:
        return [left, right]
    return [-1, -1]
\`\`\`

---

### 17. Sort Colors (Dutch National Flag)
\`\`\`python
def sort_colors(nums):
    low, mid, high = 0, 0, len(nums)-1
    while mid <= high:
        if nums[mid] == 0:   nums[low], nums[mid] = nums[mid], nums[low]; low+=1; mid+=1
        elif nums[mid] == 1: mid += 1
        else:                nums[mid], nums[high] = nums[high], nums[mid]; high -= 1
\`\`\`

---

### 18. Merge Intervals
\`\`\`python
def merge_intervals(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged
\`\`\`

---

### 19. Top K Frequent Elements
\`\`\`python
import heapq
from collections import Counter
def top_k_frequent(nums, k):
    count = Counter(nums)
    return heapq.nlargest(k, count.keys(), key=count.get)

print(top_k_frequent([1,1,1,2,2,3], 2))   # [1, 2]
\`\`\`

---

### 20. Longest Increasing Subsequence
\`\`\`python
def lis(nums):
    if not nums: return 0
    dp = [1] * len(nums)
    for i in range(1, len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j]+1)
    return max(dp)

print(lis([10,9,2,5,3,7,101,18]))   # 4 → [2,3,7,101]
\`\`\`

:::tip
**Practice strategy:**
1. Read problem carefully — identify what DS is needed
2. Start with brute force — state the complexity
3. Optimize — ask "can I trade space for time?"
4. Code it — clean variable names, handle edge cases
5. Test — empty input, single element, duplicates, negatives
:::`,

// ─────────────────────────────────────────────────────────────────
22: `# Quick Reference Cheat Sheet

A complete reference for all data structures, time complexities, and key algorithms covered in this course.

---

## Data Structure Complexities

| Structure | Access | Search | Insert | Delete | Space |
|-----------|--------|--------|--------|--------|-------|
| **Array** | O(1) | O(n) | O(n) | O(n) | O(n) |
| **Dynamic Array** | O(1) | O(n) | O(1) amort | O(n) | O(n) |
| **Linked List (Singly)** | O(n) | O(n) | O(1) head | O(1) head | O(n) |
| **Linked List (Doubly)** | O(n) | O(n) | O(1) | O(1) | O(n) |
| **Skip List** | O(log n) | O(log n) | O(log n) | O(log n) | O(n log n) |
| **Stack** | O(n) | O(n) | O(1) | O(1) | O(n) |
| **Queue** | O(n) | O(n) | O(1) | O(1) | O(n) |
| **Hash Map** | — | O(1) avg | O(1) avg | O(1) avg | O(n) |
| **BST** | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| **AVL Tree** | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| **Heap** | O(1) peek | O(n) | O(log n) | O(log n) | O(n) |
| **Trie** | O(k) | O(k) | O(k) | O(k) | O(n·k) |

---

## Sorting Algorithm Complexities

| Algorithm | Best | Average | Worst | Space | Stable |
|-----------|------|---------|-------|-------|--------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | ❌ |
| Insertion Sort | **O(n)** | O(n²) | O(n²) | O(1) | ✅ |
| Merge Sort | O(n log n) | O(n log n) | **O(n log n)** | O(n) | ✅ |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | **O(1)** | ❌ |
| **Timsort (Python)** | **O(n)** | O(n log n) | O(n log n) | O(n) | ✅ |

---

## Searching Algorithm Complexities

| Algorithm | Time | Space | Requires |
|-----------|------|-------|---------|
| Linear Search | O(n) | O(1) | Nothing |
| Binary Search | O(log n) | O(1) | Sorted array |
| Jump Search | O(√n) | O(1) | Sorted array |
| Hash Lookup | O(1) avg | O(n) | Hash table |
| BST Search | O(log n) avg | O(1) | BST structure |
| Trie Search | O(k) | O(1) | Trie structure |

---

## Big O Complexity Order

\`\`\`
O(1) < O(log n) < O(√n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2ⁿ) < O(n!)
FAST ─────────────────────────────────────────────────────────────────► SLOW
\`\`\`

---

## Graph Algorithms

| Algorithm | Purpose | Time | Space |
|-----------|---------|------|-------|
| BFS | Shortest path (unweighted) | O(V+E) | O(V) |
| DFS | Cycle detection, topo sort | O(V+E) | O(V) |
| Dijkstra's | Shortest path (weighted) | O((V+E)log V) | O(V) |
| Kruskal's | Minimum spanning tree | O(E log E) | O(V) |
| Prim's | Minimum spanning tree | O((V+E)log V) | O(V) |

---

## Tree & Heap Operations

| Operation | BST avg | AVL | Heap |
|-----------|---------|-----|------|
| Insert | O(log n) | O(log n) | O(log n) |
| Delete | O(log n) | O(log n) | O(log n) |
| Search | O(log n) | O(log n) | O(n) |
| Min/Max | O(n)/O(log n) | O(log n) | **O(1)** |
| Build from n items | — | — | **O(n)** |

---

## When to Use Which Data Structure

\`\`\`
NEED FAST ACCESS BY INDEX?          → Array / Dynamic Array
NEED FAST INSERT/DELETE AT FRONT?   → Linked List / Deque
NEED LIFO (undo, call stack)?       → Stack
NEED FIFO (scheduling, BFS)?        → Queue
NEED FASTEST KEY LOOKUP?            → Hash Map — O(1)
NEED SORTED DATA + FAST SEARCH?     → BST / AVL Tree
NEED PRIORITY-BASED ACCESS?         → Heap
NEED PREFIX SEARCH / AUTOCOMPLETE?  → Trie
NEED SHORTEST PATH (unweighted)?    → BFS
NEED SHORTEST PATH (weighted)?      → Dijkstra's
NEED DEPENDENCY ORDER?              → Topological Sort (DFS)
NEED HIERARCHICAL DATA?             → Tree
NEED NETWORK / RELATIONSHIP DATA?   → Graph
\`\`\`

---

## Common Patterns in Interview Problems

| Pattern | Data Structure | Example Problems |
|---------|---------------|-----------------|
| Sliding Window | Array + Two Pointers | Max sum subarray, Longest substring |
| Two Pointers | Array | Two sum, Palindrome check |
| Fast & Slow Pointers | Linked List | Cycle detection, Middle node |
| BFS Level Order | Queue + Tree | Level order traversal, Shortest path |
| DFS Backtracking | Stack + Tree | Subsets, Permutations, N-Queens |
| Monotonic Stack | Stack | Next greater element, Histogram |
| Top K Elements | Heap | Kth largest, Top K frequent |
| Merge Intervals | Array + Sort | Meeting rooms, Calendar |
| Prefix Sum | Array | Subarray sum, Range queries |
| Union-Find | Disjoint Set | Connected components, Cycle in graph |

---

## Python Quick Reference

\`\`\`python
# Array / List
arr = [1,2,3]
arr.append(4)         # O(1) — add at end
arr.insert(1, 9)      # O(n) — insert at index
arr.pop()             # O(1) — remove last
arr.pop(0)            # O(n) — remove first (use deque!)

# Stack (using list)
stack = []
stack.append(x)       # push O(1)
stack.pop()           # pop O(1)
stack[-1]             # peek O(1)

# Queue (use deque, NOT list)
from collections import deque
q = deque()
q.append(x)           # enqueue O(1)
q.popleft()           # dequeue O(1)

# Heap
import heapq
h = []
heapq.heappush(h, x)  # O(log n)
heapq.heappop(h)       # O(log n) — min element
h[0]                   # O(1) — peek min

# Hash Map
d = {}
d[key] = val          # O(1) insert
d[key]                # O(1) access
key in d              # O(1) search
del d[key]            # O(1) delete

# Set
s = set()
s.add(x)              # O(1)
x in s                # O(1)
s.remove(x)           # O(1)

# Sorting
arr.sort()                         # O(n log n) in-place
sorted(arr)                        # O(n log n) new list
arr.sort(key=lambda x: x[1])       # sort by key
arr.sort(reverse=True)             # descending
\`\`\`

:::tip
**Final Advice for DSA Mastery:**
1. Understand the **trade-offs** — every structure trades time for space or vice versa
2. Practice identifying **which structure** solves a problem before writing code
3. Master **BFS/DFS** — they underlie 60% of graph/tree interview questions
4. Know **Big O by heart** — you'll be asked in every interview
5. Code in your chosen language daily — speed comes from muscle memory
6. After solving any problem, ask: "Can I do better?" — then actually try

The best data structure is the one that makes the impossible possible. 🚀
:::`,

}

export default dsaContent

