// NumPy — Beginner to Advanced (15 lessons)
// Generated from "Numpy Beiggner-Advanced material.docx" — content copied as-is.
// Images served from /numpy imges/npimg*.png

const numpyContent: Record<number, string> = {
1: `# Introduction to NumPy

Everything you need to know before writing your first line

## What You Will Learn
- What NumPy is and the history behind it (2006, Travis Oliphant)
- Why NumPy is dramatically faster than Python lists — 3 reasons explained
- Memory diagrams: Python list pointers vs NumPy contiguous bytes
- Speed benchmark: sum 1 million numbers with Python, NumPy, and a for loop
- The Python ecosystem powered by NumPy: Pandas, Matplotlib, SciPy, sklearn, TF, PyTorch
- How to install NumPy: pip, conda, Colab, virtual environments
- How to import NumPy and check its version
- The ndarray: shape, dtype, ndim, size, strides, itemsize, nbytes

## 1.1 What is NumPy?

NumPy stands for Numerical Python. It is a free, open-source Python library first released in 2006 by Travis Oliphant. NumPy is the foundation of nearly every scientific, data science, and machine learning library in Python.

At its heart, NumPy provides one central object: the ndarray (N-dimensional array). This is a powerful, fixed-type, multi-dimensional array that allows you to store and process large amounts of numerical data at C-compiled speed.

:::insight
**NumPy in One Sentence**
NumPy gives Python the ability to work with large numerical datasets as fast as C code — without writing a single line of C.
It stores data in contiguous memory blocks, uses fixed data types, and calls pre-compiled C routines — making it 10-200x faster than native Python for numerical work.
:::

### Brief History of NumPy

| Year | Event | Significance |
| --- | --- | --- |
| 1995 | Numeric library created | First attempt at fast arrays in Python |
| 2001 | SciPy founded | Built on Numeric for science/engineering |
| 2005 | Numarray released | Alternative, better for large arrays |
| 2006 | NumPy born (Travis Oliphant) | Unified Numeric + Numarray into NumPy |
| 2011 | NumPy 1.6 release | Major performance improvements |
| 2020 | NumPy paper in Nature | Academic recognition — cited 11,000+ times |
| 2023+ | NumPy 1.25 / 2.x | Continuous improvements, Python 3 only |

### 1.2  The NumPy Ecosystem — Libraries That Depend on NumPy

NumPy is not just one tool — it is the foundation on which the entire Python data science stack is built:

| Library | Purpose | Uses NumPy For |
| --- | --- | --- |
| Pandas | Data manipulation & analysis | DataFrames are built on ndarrays |
| Matplotlib | Data visualisation | Plot data from NumPy arrays directly |
| SciPy | Scientific computing | FFT, integration, stats — all use ndarray |
| scikit-learn | Machine learning | All datasets and models use ndarray |
| TensorFlow | Deep learning | Tensors are NumPy-compatible arrays |
| PyTorch | Deep learning | torch.Tensor converts to/from ndarray |
| OpenCV | Computer vision | Images stored as (H, W, 3) NumPy arrays |
| Statsmodels | Statistical modelling | Input/output is ndarray |

## 1.3  Why NumPy is Faster Than Python Lists

This is the most important concept in all of NumPy. To understand it, we need to look at how Python stores data versus how NumPy stores it.

### How Python Lists Store Data in Memory

A Python list does NOT store the actual values side-by-side. Instead, it stores POINTERS (memory addresses) that each point to a separate Python object scattered in RAM. Each integer object has overhead: a type tag, a reference count, and the value.

### PYTHON LIST (SLOW)

\`\`\`text
ptr[0] -> obj   ptr[1] -> obj   ptr[2] -> obj   ptr[3] -> obj   ptr[4] -> obj
\`\`\`

List buffer (contiguous) — each slot is a pointer, NOT the value itself

\`\`\`text
PyObj int:10   (empty)   PyObj int:20   PyObj int:30   (empty)
\`\`\`

Actual Python integer objects — scattered in RAM. Each takes ~28 bytes.

Each Python integer uses ~28 bytes. For 1,000,000 integers, a Python list uses ~28 MB just for the integer objects, plus ~8 MB for pointers = 36 MB total.

### How NumPy Stores Data in Memory

NumPy stores ALL values as a single contiguous block of raw C-type bytes. No Python object wrappers, no type tags per element, no scattered memory. All values sit side-by-side in RAM.

### NUMPY ARRAY (FAST)

\`\`\`text
10 int64   20 int64   30 int64   40 int64   50 int64
\`\`\`

All values packed together — exactly 8 bytes each (int64) — perfect CPU cache utilisation

For 1,000,000 integers as int64, NumPy uses exactly 8 MB — about 4x less than Python. The CPU cache can load 8-16 values at once.

### Three Reasons NumPy is Faster

**1. Contiguous Memory**
All elements sit next to each other in RAM. The CPU cache line loads 8-16 integers at once. Python lists chase pointers across memory (cache misses = very slow).

**2. Fixed dtype**
Every NumPy array has one dtype (e.g., int64). NumPy calls optimised C/Fortran routines that know the byte layout. Python checks each element's type before every operation.

**3. Vectorisation**
Instead of a Python for-loop, NumPy calls compiled C routines that process the whole array in one shot. The loop runs in C, not Python — 10-200x faster.

### Real-World Speed Comparison

### Speed Test — Sum 1 Million Numbers

\`\`\`python
import numpy as np
import time

n = 1_000_000

# --- Python list built-in sum ---
py_list = list(range(n))
t = time.time()
total = sum(py_list)
print(f'Python sum: {(time.time()-t)*1000:.2f} ms')

# --- NumPy compiled sum ---
np_arr = np.arange(n)
t = time.time()
total = np_arr.sum()
print(f'NumPy sum:  {(time.time()-t)*1000:.2f} ms')

# --- Manual Python loop (worst) ---
t = time.time()
total = 0
for x in py_list:
    total += x
print(f'Loop sum:   {(time.time()-t)*1000:.2f} ms')
\`\`\`

:::insight
**Explanation**
Python sum()  ->  ~20-40 ms   (Python interpreter overhead per element)
NumPy .sum()  ->   ~1-2 ms   (single C call across the entire array)
Python loop   -> ~80-150 ms  (slowest — full Python overhead every element)
NumPy is typically 20-150x faster depending on the operation.
:::

\`\`\`output

Python sum: 28.43 ms
NumPy sum:   1.12 ms
Loop sum:  134.67 ms
\`\`\`

## 1.4  Installing NumPy

Before using NumPy, you must install it. There are several methods depending on your Python setup.

### Method 1: pip (Standard Python Package Manager)

\`\`\`bash
# Check pip is installed
pip --version

# Install NumPy
pip install numpy

# Install a specific version
pip install numpy==1.26.4

# Upgrade existing NumPy
pip install --upgrade numpy

# Recommended: use a virtual environment first
python -m venv myenv
source myenv/bin/activate     # Linux/Mac
myenv\\Scripts\\activate        # Windows
pip install numpy
\`\`\`

### Method 2: conda (Anaconda / Miniconda)

\`\`\`bash
# Install with conda
conda install numpy

# Specific environment
conda install -n myenv numpy

# Via conda-forge (more up-to-date builds)
conda install -c conda-forge numpy

# Update
conda update numpy
\`\`\`

### Method 3: Google Colab / Jupyter

\`\`\`bash
# NumPy is pre-installed on Colab — just verify
import numpy as np
print(np.__version__)     # e.g. 1.26.4

# If not installed, run in a cell:
!pip install numpy
\`\`\`

| Method | Command | Best For |
| --- | --- | --- |
| pip | pip install numpy | Individual Python, virtual environments |
| conda | conda install numpy | Anaconda users, data science setups |
| Google Colab | Pre-installed | Cloud-based learning |
| Jupyter | Usually pre-installed | Interactive learning |

:::mistake
**Common Installation Errors**
pip not recognized  ->  Python not in PATH. Reinstall Python, tick 'Add to PATH'.
Permission denied   ->  Use 'pip install --user numpy' on Linux/Mac.
ModuleNotFoundError ->  NumPy installed for a different Python. Check 'which python'.
:::

## 1.5  Importing NumPy

The universal convention — used everywhere — is to import NumPy with the alias 'np'.

### Correct Way to Import NumPy

\`\`\`python
# THE standard import — always use this form
import numpy as np

# Check version
print('NumPy version:', np.__version__)

# Check installation path
print('Location:', np.__file__)
\`\`\`

:::insight
**Explanation**
import numpy as np  ->  loads NumPy and gives it the shorthand 'np'.
Never use 'from numpy import *' — pollutes the namespace with 400+ names.
The alias 'np' is universal — every textbook, tutorial, and codebase uses it.
:::

| Import Style | Example Use | Verdict |
| --- | --- | --- |
| import numpy as np | np.array([1,2,3]) | CORRECT — use always |
| import numpy | numpy.array([1,2,3]) | Verbose but works |
| from numpy import array | array([1,2,3]) | OK for one function |
| from numpy import * | array([1,2,3]) | NEVER — bad practice |

## 1.6  Understanding the ndarray

The ndarray (N-dimensional array) is NumPy's central object. Every operation revolves around it. Understanding it deeply is the key to mastering NumPy.

**ndarray**
An ndarray is a grid of values, all of the same type, indexed by a tuple of non-negative integers. The number of dimensions is the rank. The shape is a tuple giving the size of each dimension.

### Internal Structure of an ndarray

| Component | What It Stores | Example Value |
| --- | --- | --- |
| data pointer | Memory address of the raw data buffer | 0x7f8a3c2d0080 |
| dtype | Data type descriptor (int, float, etc.) | dtype('int64') |
| shape | Tuple of sizes per dimension | (3, 4) |
| strides | Bytes to skip per dimension to get next | (32, 8) for 2D int64 |
| ndim | Number of dimensions | 2 |
| size | Total number of elements | 12 (= 3 x 4) |
| itemsize | Bytes per single element | 8 (for int64) |
| flags | Read-only? C-contiguous? etc. | C_CONTIGUOUS: True |

### Your Very First ndarray — Inspecting All Attributes

\`\`\`python
import numpy as np

arr = np.array([100, 200, 300, 400, 500])

print('Array:      ', arr)
print('type():     ', type(arr))
print('Shape:      ', arr.shape)     # (5,)
print('Dimensions: ', arr.ndim)      # 1
print('Size:       ', arr.size)      # 5
print('Dtype:      ', arr.dtype)     # int64
print('Item size:  ', arr.itemsize)  # 8 bytes
print('Total bytes:', arr.nbytes)    # 40 bytes
print('Strides:    ', arr.strides)   # (8,)
\`\`\`

:::insight
**Explanation**
np.array([...])  ->  converts a Python list to an ndarray.
type(arr)        ->  <class 'numpy.ndarray'>
shape (5,)       ->  one dimension with 5 elements. The comma shows it is a 1-element tuple.
itemsize 8       ->  each int64 element takes exactly 8 bytes.
nbytes 40        ->  5 elements x 8 bytes = 40 bytes total RAM.
strides (8,)     ->  move 8 bytes forward to reach the next element.
:::

\`\`\`output

Array:       [100 200 300 400 500]
type():      <class 'numpy.ndarray'>
Shape:       (5,)
Dimensions:  1
Size:        5
Dtype:       int64
Item size:   8
Total bytes: 40
Strides:     (8,)
\`\`\`

:::tip
**Lesson 1 Summary**
NumPy (Numerical Python, 2006) is the foundation of Python data science.
Python lists store pointers -> slow. NumPy stores contiguous bytes -> fast.
3 speed advantages: contiguous memory, fixed dtype, vectorisation (C-compiled).
Install: pip install numpy  OR  conda install numpy
Import: always use  import numpy as np
ndarray core attributes: .shape, .dtype, .ndim, .size, .itemsize, .nbytes, .strides
NumPy powers: Pandas, Matplotlib, SciPy, scikit-learn, TensorFlow, PyTorch, OpenCV.
:::`,

2: `# NumPy Arrays & Attributes

Creating 1D, 2D, 3D arrays and exploring their properties

## What You Will Learn
- How to create 1D (vector), 2D (matrix), and 3D (tensor) arrays
- What shape means and how to read it for any number of dimensions
- All dtype options: int8 to int64, uint8, float16 to float64, bool, str_
- How ndim, size, and nbytes are calculated
- How to cast dtype with .astype()
- Memory comparison: float64 vs float32
- Real-world use cases for each dimension

## 2.1  Array Dimensions — 1D, 2D, 3D

NumPy supports arrays with any number of dimensions. The three most common are 1D (vectors), 2D (matrices), and 3D (tensors).

| 1D Array (Vector) | 2D Array (Matrix) | 3D Array (Tensor) |
| --- | --- | --- |
| [ 1 2 3 4 5 ] ndim = 1 shape = (5,) size = 5 | [[1 2 3] [4 5 6] [7 8 9]] ndim = 2 shape = (3, 3) size = 9 | [[[1 2][3 4]] [[5 6][7 8]]] ndim = 3 shape=(2,2,2) size = 8 |
| Real-world uses: - List of stock prices - Temperatures over time - Single CSV column | Real-world uses: - Spreadsheet / table - Grayscale image pixels - Linear algebra matrix | Real-world uses: - RGB colour images - Video frames (time axis) - Batch of ML samples |
| np.array([ ]) | np.array([[ ], [ ]]) | np.array([[[ ]]]) |

### Creating 1D Arrays

### 1D Array — All Variations
- Contains a single row of elements
- Has only one axis

\`\`\`python
import numpy as np

# From a Python list
a = np.array([10, 20, 30, 40, 50])
print('From list:  ', a)          # [10 20 30 40 50]
print('shape:', a.shape)          # (5,)

# From a tuple
b = np.array((1, 2, 3, 4))
print('From tuple: ', b)          # [1 2 3 4]

# Float array (explicit dtype)
c = np.array([1.0, 2.0, 3.0])
print('Float array:', c)          # [1. 2. 3.]
print('dtype:      ', c.dtype)    # float64

# Force float32 (half the memory of float64)
d = np.array([1, 2, 3], dtype=np.float32)
print('float32:    ', d)          # [1. 2. 3.]
print('itemsize:   ', d.itemsize) # 4 bytes
\`\`\`

:::insight
**Explanation**
np.array([...])          ->  most common way to create a 1D array.
shape (5,)               ->  the trailing comma shows it is a 1-element tuple.
dtype=np.float32         ->  forces 32-bit float (4 bytes vs 8 for float64).
1D arrays represent vectors in linear algebra.
:::

\`\`\`output

From list:   [10 20 30 40 50]
shape: (5,)
From tuple:  [1 2 3 4]
Float array: [1. 2. 3.]
dtype:       float64
float32:     [1. 2. 3.]
itemsize:    4
\`\`\`

### Creating 2D Arrays

### 2D Array — Matrix Creation
- Contains rows and columns
-   Has two axes

\`\`\`python
import numpy as np

mat = np.array([[1,  2,  3,  4],
                [5,  6,  7,  8],
                [9, 10, 11, 12]])

print('Matrix:')
print(mat)
print('shape:  ', mat.shape)   # (3, 4) -- 3 rows, 4 cols
print('ndim:   ', mat.ndim)    # 2
print('size:   ', mat.size)    # 12
print('dtype:  ', mat.dtype)   # int64

# Accessing elements
print('Row 0:    ', mat[0])        # [1 2 3 4]
print('Col 2:    ', mat[:, 2])     # [3 7 11]
print('Element [1,3]:', mat[1,3])  # 8
\`\`\`

:::insight
**Explanation**
List of lists   ->  outer list = rows, inner lists = columns.
shape (3, 4)    ->  ALWAYS reads (rows, columns).
3 rows x 4 cols = 12 total elements = .size.
mat[0]          ->  first row.
mat[:,2]        ->  all rows, column 2 (zero-indexed).
:::

\`\`\`output

Matrix:
[[ 1  2  3  4]
 [ 5  6  7  8]
 [ 9 10 11 12]]
shape:   (3, 4)
ndim:    2
size:    12
dtype:   int64
Row 0:   [1 2 3 4]
Col 2:   [ 3  7 11]
Element [1,3]: 8
\`\`\`

### Creating 3D Arrays

### 3D Array — Batch / Tensor
- Contains multiple 2D arrays
-   Has three axes

\`\`\`python
import numpy as np

# 3D: 2 matrices (2 exam papers, 3 students, 4 questions)
tensor = np.array([[[1,  2,  3,  4],
                    [5,  6,  7,  8],
                    [9, 10, 11, 12]],
                   [[13, 14, 15, 16],
                    [17, 18, 19, 20],
                    [21, 22, 23, 24]]])

print('3D shape:', tensor.shape)   # (2, 3, 4)
print('ndim:    ', tensor.ndim)    # 3
print('size:    ', tensor.size)    # 24

# Reading shape (2, 3, 4):
# 2 = depth (number of matrices)
# 3 = rows per matrix
# 4 = cols per matrix

print('First matrix:')
print(tensor[0])
\`\`\`

:::insight
**Explanation**
shape (2, 3, 4)  ->  2 blocks, each with 3 rows and 4 columns.
Think of 3D as a stack of 2D matrices — like pages in a book.
RGB image = (height, width, 3) — 3 colour channels.
A batch of 32 images 64x64 = shape (32, 64, 64, 3) — a 4D array!
:::

\`\`\`output

3D shape: (2, 3, 4)
ndim:     3
size:     24
First matrix:
[[ 1  2  3  4]
 [ 5  6  7  8]
 [ 9 10 11 12]]
\`\`\`

## 2.2  The .dtype Attribute

Every NumPy array has exactly one dtype. Choosing the right dtype matters for correctness and memory efficiency.

The dtype determines:
- How data is stored in memory
- The amount of memory used
- The type of operations performed on the array

**A NumPy array can store only one data type at a time.**

Choosing the correct dtype improves:
- Memory efficiency
- Performance
- Accuracy of computations

| dtype | Python type | Bytes | Range / Precision |
| --- | --- | --- | --- |
| int8 | int | 1 | -128 to 127 |
| int16 | int | 2 | -32768 to 32767 |
| int32 | int | 4 | ~-2.1B to 2.1B |
| int64 | int | 8 | ~-9.2E18 to 9.2E18 |
| uint8 | int (unsigned) | 1 | 0 to 255 (images!) |
| float16 | float | 2 | ~3 decimal digits |
| float32 | float | 4 | ~7 decimal digits |
| float64 | float | 8 | ~15 decimal digits |
| bool | bool | 1 | True or False only |
| complex64 | complex | 8 | 32-bit real + imag |
| str_ (U...) | str | variable | Fixed-width Unicode |

### Working with dtypes

\`\`\`python
import numpy as np

# NumPy auto-infers dtype
a = np.array([1, 2, 3])             # int64
b = np.array([1.0, 2.0, 3.0])       # float64
c = np.array([True, False, True])    # bool
d = np.array(['cat', 'dog', 'fox'])  # <U3
print(a.dtype, b.dtype, c.dtype, d.dtype)

# Mixed types -- NumPy upcasts to widest
e = np.array([1, 2.5, 3])     # int + float -> float64
print('mixed:', e.dtype)       # float64
print('values:', e)            # [1.  2.5 3. ]

# Cast with .astype()
f = np.array([1.9, 2.7, 3.1])
g = f.astype(np.int32)         # TRUNCATES (not rounds)!
print('cast:', g)              # [1 2 3]

# Memory comparison
x64 = np.ones(1000000, dtype=np.float64)
x32 = np.ones(1000000, dtype=np.float32)
print(f'float64: {x64.nbytes/1e6:.1f} MB')
print(f'float32: {x32.nbytes/1e6:.1f} MB')
\`\`\`

:::insight
**Explanation**
NumPy auto-infers the smallest type that fits all values.
Mixed int+float -> float64 (widening, no precision lost).
.astype(np.int32) TRUNCATES: 1.9 becomes 1, not 2. Use np.round() first if rounding needed.
float64 = 8 MB for 1M elements. float32 = 4 MB. Use float32 in ML to save memory.
:::

\`\`\`output

int64 float64 bool <U3
mixed: float64
values: [1.  2.5 3. ]
cast: [1 2 3]
float64: 8.0 MB
float32: 4.0 MB
\`\`\`

:::tip
**Lesson 2 Summary**
1D (vector): shape=(n,).  Use for lists of values, timeseries, single columns.
2D (matrix): shape=(rows, cols).  Use for tables, grayscale images, ML datasets.
3D (tensor): shape=(depth, rows, cols).  RGB images, batches, video frames.
.shape  ->  tuple of sizes. Product of all values = .size.
.dtype  ->  data type. Default int64 or float64. Choose wisely for memory.
.ndim   ->  number of dimensions (rank).
.astype(dtype)  ->  converts dtype. TRUNCATES on float->int (does NOT round).
float32 uses half the memory of float64 — important for large ML models.
:::`,

3: `# Array Creation Methods

8 essential ways to build NumPy arrays without typing every value

## 3.1  Overview — Which Function to Use?

| Function | Creates | Use When |
| --- | --- | --- |
| np.array(obj) | ndarray from list/tuple | You have existing Python data |
| np.zeros(shape) | All 0.0 | Initialising weights, placeholders |
| np.ones(shape) | All 1.0 | Bias terms, mask arrays |
| np.full(shape,val) | All same value | Custom constant fill, np.nan, np.inf |
| np.arange(s,e,step) | Range with step | You know the step size |
| np.linspace(s,e,n) | Exactly n evenly-spaced | Plotting, interpolation |
| np.random.rand(...) | Uniform floats [0,1) | Weight init, simulations |
| np.random.randint(...) | Random integers | Test data, dice rolls |
| np.eye(n) | Identity matrix | Linear algebra |
| np.empty(shape) | Uninitialised array | Fast placeholder — fill before use! |

## 3.2  np.array()

**np.array() is the most flexible NumPy array constructor used to convert Python sequences such as lists, tuples, or nested sequences into a NumPy ndarray.**

It allows control over:
- Data type (dtype)
- Minimum dimensions (ndmin)
- Copy behavior (copy)

This function is commonly used to create arrays from existing Python data structures.

**Syntax:**

np.array(object, dtype=None, copy=True, ndmin=0)

### np.array() — All Variations

\`\`\`python
import numpy as np

# From list
a = np.array([1, 2, 3, 4, 5])
print('list:', a)

# From nested lists -> 2D
c = np.array([[1,2,3],[4,5,6]])
print('2D:', c)

# With explicit dtype
d = np.array([1, 2, 3], dtype=np.float64)
print('float64:', d)           # [1. 2. 3.]

# From range
e = np.array(range(0, 10, 2))
print('from range:', e)         # [0 2 4 6 8]

# ndmin forces minimum dimensions
f = np.array([1,2,3], ndmin=2)
print('ndmin=2:', f)            # [[1 2 3]]
print('shape:', f.shape)        # (1, 3)
\`\`\`

:::insight
**Explanation**
np.array([...])   ->  1D from flat list.
np.array([[...],[...]])  ->  2D from list of lists.
ndmin=2  ->  ensures at least 2 dimensions (useful in functions requiring 2D input).
:::

\`\`\`output

list: [1 2 3 4 5]
2D: [[1 2 3]  [4 5 6]]
float64: [1. 2. 3.]
from range: [0 2 4 6 8]
ndmin=2: [[1 2 3]]
shape: (1, 3)
\`\`\`

## 3.3  np.zeros() and np.ones()

## np.zeros():

## A NumPy function used to create an array filled with zeros (0) of a specified shape and data type.

## Syntax: np.zeros(shape, dtype)

## np.ones():

## A NumPy function used to create an array filled with ones (1) of a specified shape and data type.

## Syntax: np.ones(shape, dtype)

### np.zeros() — Zero-Filled Arrays

\`\`\`python
import numpy as np

a = np.zeros(6)
print('1D:', a)                    # [0. 0. 0. 0. 0. 0.]

b = np.zeros((3, 4))
print('2D zeros:')
print(b)

# Integer zeros
c = np.zeros((2, 3), dtype=int)
print('int zeros:', c)

# 3D zeros (2 grayscale 4x4 images)
d = np.zeros((2, 4, 4))
print('3D shape:', d.shape)        # (2, 4, 4)
\`\`\`

:::insight
**Explanation**
np.zeros(6)      ->  1D with 6 zeros. Default dtype is float64.
np.zeros((3,4))  ->  2D 3x4 matrix of 0.0.
dtype=int        ->  integer 0 (not 0.0).
Use case: initialising neural network weight matrices before training.
:::

\`\`\`output

1D: [0. 0. 0. 0. 0. 0.]
2D zeros:
[[0. 0. 0. 0.]
 [0. 0. 0. 0.]
 [0. 0. 0. 0.]]
int zeros: [[0 0 0]  [0 0 0]]
3D shape: (2, 4, 4)
\`\`\`

### np.ones() — One-Filled Arrays

\`\`\`python
import numpy as np

a = np.ones(5)
print('1D ones:', a)          # [1. 1. 1. 1. 1.]

b = np.ones((3, 3))
print('3x3 ones:', b)

# Multiply to fill with any value
fives = np.ones((2, 4)) * 5
print('fives:', fives)

# Boolean mask -- all True
mask = np.ones((3,), dtype=bool)
print('bool mask:', mask)     # [ True  True  True]
\`\`\`

:::insight
**Explanation**
np.ones(5) * 5  ->  fills with 5.0 (but np.full is clearer and preferred).
dtype=bool      ->  creates [True, True, True] — useful as 'include all' mask.
:::

\`\`\`output

1D ones: [1. 1. 1. 1. 1.]
3x3 ones: [[1. 1. 1.]  [1. 1. 1.]  [1. 1. 1.]]
fives: [[5. 5. 5. 5.]  [5. 5. 5. 5.]]
bool mask: [ True  True  True]
\`\`\`

## 3.4  np.full()

**np.full() is a NumPy function used to create an array filled entirely with a specified value.**

It allows you to:
- Define the shape of the array
- Set a custom fill value
- Specify the data type if needed

This function is useful when all elements in an array must contain the same constant value.

**Syntax:**

np.full(shape, fill_value, dtype=None)

### np.full() — Constant Arrays Including nan and inf

\`\`\`python
import numpy as np

# Fill with 7
a = np.full(5, 7)
print('sevens:', a)              # [7 7 7 7 7]

# Fill 3x3 with pi
b = np.full((3, 3), 3.14159)
print('pi matrix:')
print(b)

# Infinity -- initial value for shortest-path problems
d = np.full((3,), np.inf)
print('inf:', d)                 # [inf inf inf]

# NaN -- marks missing values
e = np.full((2, 3), np.nan)
print('NaN matrix:')
print(e)
\`\`\`

:::insight
**Explanation**
np.full(5, 7)         ->  [7, 7, 7, 7, 7].
np.full((3,3), 3.14159) ->  all 9 elements = pi.
np.inf  ->  infinity. Used as initial 'best cost' in graph/pathfinding algorithms.
np.nan  ->  Not a Number. Standard for missing/invalid values in NumPy/Pandas.
:::

\`\`\`output

sevens: [7 7 7 7 7]
pi matrix:
[[3.14159 3.14159 3.14159]  [3.14159 3.14159 3.14159]  [3.14159 3.14159 3.14159]]
inf: [inf inf inf]
NaN matrix:
[[nan nan nan]  [nan nan nan]]
\`\`\`

## 3.5  np.arange()

**np.arange() is a NumPy function used to create an array containing a sequence of evenly spaced values within a specified range.**

It allows you to define:
- Starting value
- Ending value
- Step size between values

This function is commonly used for generating numerical sequences.

**Syntax:**

np.arange(start, stop, step, dtype=None)

### np.arange() — Range Arrays

\`\`\`python
import numpy as np

print(np.arange(10))           # [0 1 2 3 4 5 6 7 8 9]
print(np.arange(2, 10))        # [2 3 4 5 6 7 8 9]
print(np.arange(0, 51, 5))     # [ 0  5 10 15 20 25 30 35 40 45 50]
print(np.arange(10, 0, -2))    # [10  8  6  4  2]
print(np.arange(0.0, 1.0, 0.2))# [0.  0.2 0.4 0.6 0.8]

# Most common pattern: arange then reshape
mat = np.arange(12).reshape(3, 4)
print('Reshaped:')
print(mat)
\`\`\`

:::insight
**Explanation**
np.arange(10)    ->  stop-only, starts at 0, step 1.
Negative step    ->  counts down: arange(10,0,-2) -> [10,8,6,4,2].
Float steps work but floating-point rounding can cause off-by-one. Prefer linspace for floats.
.reshape(3,4)    ->  rearranges 12 elements into 3x4 matrix (same data, new shape).
:::

\`\`\`output

[0 1 2 3 4 5 6 7 8 9]
[2 3 4 5 6 7 8 9]
[ 0  5 10 15 20 25 30 35 40 45 50]
[10  8  6  4  2]
[0.  0.2 0.4 0.6 0.8]
Reshaped:
[[ 0  1  2  3]  [ 4  5  6  7]  [ 8  9 10 11]]
\`\`\`

## 3.6  np.linspace()

**np.linspace() is a NumPy function used to create an array of evenly spaced values between a specified start and end value.**

Unlike np.arange(), it generates a fixed number of values instead of using a step size.

This function is commonly used in:
- Plotting graphs
- Mathematical computations
- Interpolation
- Scientific calculations

**Syntax:**

np.linspace(start, stop, num=50, endpoint=True, dtype=None)

### np.linspace() — Evenly Spaced Points

\`\`\`python
import numpy as np

# 5 points from 0 to 1
a = np.linspace(0, 1, 5)
print('5 pts:', a)             # [0.   0.25 0.5  0.75 1.  ]

# 11 points 0-100
b = np.linspace(0, 100, 11)
print('0-100:', b)

# Exclude endpoint
c = np.linspace(0, 1, 5, endpoint=False)
print('no end:', c)            # [0.  0.2 0.4 0.6 0.8]

# Get step size
d, step = np.linspace(0, 10, 5, retstep=True)
print(f'vals: {d}  step: {step}')

# Classic: x-axis for sine wave plot
import numpy as np
x = np.linspace(0, 2 * np.pi, 100)
y = np.sin(x)
print(f'x: {x[0]:.4f} to {x[-1]:.4f}, n={len(x)}')
\`\`\`

:::insight
**Explanation**
linspace(0,1,5)  ->  exactly 5 values: 0, 0.25, 0.5, 0.75, 1.0.
endpoint=True (default) -> stop is included.
endpoint=False  ->  5 values of step 0.2 without reaching 1.0.
retstep=True    ->  returns (array, step_size) as a tuple.
Plotting: linspace is ideal for x-axis. x = linspace(0, 2*pi, 100) gives 100 smooth points.
:::

\`\`\`output

5 pts: [0.   0.25 0.5  0.75 1.  ]
0-100: [  0.  10.  20.  30.  40.  50.  60.  70.  80.  90. 100.]
no end: [0.  0.2 0.4 0.6 0.8]
vals: [ 0.   2.5  5.   7.5 10. ]  step: 2.5
x: 0.0000 to 6.2832, n=100
\`\`\`

:::mistake
**arange vs linspace — Decision Guide**
Use np.arange()   when: you know the STEP SIZE  (e.g., every 2 units, every 0.5).
Use np.linspace() when: you know the COUNT of values  (e.g., 100 points for a smooth plot).
Pitfall: np.arange(0, 1.0, 0.1) may give 9 OR 10 values due to floating-point rounding.
linspace guarantees exactly num values — always safe for plotting and interpolation.
:::

## 3.7 np.random.rand() and np.random.randint()

np.random.rand():

np.random.rand() is a NumPy function used to generate random floating-point numbers between 0 and 1.

It is commonly used in:

Simulations

Machine learning

Random initialization

Statistical computations

Syntax : np.random.rand(d0, d1, ..., dn)

EX: np.random.rand() — Random Floats in [0, 1)

\`\`\`python
import numpy as np
np.random.seed(42)             # fix seed for reproducibility!

# 1D -- 5 random floats
a = np.random.rand(5)
print('1D:', a.round(3))

# 2D -- 3x4 matrix
b = np.random.rand(3, 4)
print('2D:', b.round(3))

# Scale to [low, high): low + (high-low) * rand()
low, high = 5, 10
c = low + (high - low) * np.random.rand(5)
print('5-10:', c.round(3))

# Confirm uniform distribution
s = np.random.rand(100000)
print(f'mean: {s.mean():.4f}  min: {s.min():.4f}  max: {s.max():.4f}')
\`\`\`

EXPLANATION:

rand(5)     ->  1D, 5 floats in [0, 1). Arguments are dimensions, NOT a tuple!

rand(3, 4)  ->  2D 3x4 matrix. Pass shape as separate args.

seed(42)    ->  same output every run. Essential for reproducible experiments.

Scaling formula: low + (high-low) * rand() maps [0,1) to [low, high).

\`\`\`output

1D: [0.374 0.951 0.732 0.599 0.156]
2D: [[0.058 0.866 0.709 0.021]  [0.970 0.832 0.212 0.182]  [0.183 0.304 0.524 0.431]]
5-10: [8.72  8.94  6.52  7.38  9.01]
mean: 0.4998  min: 0.0000  max: 0.9999
\`\`\`

np.random.randint()

np.random.randint() is a NumPy function used to generate random integer values within a specified range.

It allows control over:

Lower limit

Upper limit

Size of the output array

This function is useful for:

Test data generation

Random sampling

Games and simulations

Syntax: np.random.randint(low, high=None, size=None, dtype=int)

EX: np.random.randint() — Random Integers

\`\`\`python
import numpy as np
np.random.seed(0)

# 5 integers 0-9
a = np.random.randint(0, 10, size=5)
print('0 to 9:', a)

# 3x4 matrix integers 1-100
b = np.random.randint(1, 101, size=(3, 4))
print('matrix:', b)

# Dice roll simulation (1 to 6)
rolls = np.random.randint(1, 7, size=10000)
for face in range(1, 7):
    pct = np.sum(rolls == face) / 10000 * 100
    print(f'Face {face}: {pct:.1f}%')
\`\`\`

EXPLANATION:

randint(0, 10, size=5)  ->  5 integers from 0 to 9. 10 is EXCLUDED!

size=(3, 4)             ->  returns a 3x4 matrix.

randint(1, 7)           ->  dice roll: 1, 2, 3, 4, 5, or 6.

10,000 rolls -> each face ~16.7% -- law of large numbers demonstrated.

\`\`\`output

0 to 9: [5 0 3 3 7]
matrix: [[51 92 14 71]  [60 20 82 86]  [74 74 87 99]]
Face 1: 16.8%
Face 2: 16.6%
Face 3: 16.6%
Face 4: 16.7%
Face 5: 16.7%
Face 6: 16.6%
\`\`\`

## 3.8  Bonus: eye(), diag(), empty(), zeros_like()

\`\`\`python
np.eye()
np.eye() is a NumPy function used to create an identity matrix, where diagonal elements are 1 and all other elements are 0.
It is commonly used in:
Linear algebra
Matrix operations
Machine learning mathematics
Syntax: np.eye(N, M=None, k=0, dtype=float)

np.diag()
np.diag() is a NumPy function used to:
Create a diagonal matrix from a 1D array
Extract diagonal elements from a 2D array
It is useful in matrix manipulation and mathematical computations.
Syntax : np.diag(v, k=0)

np.empty()
np.empty() is a NumPy function used to create an array without initializing its values.
The array contains random existing memory values until they are assigned.
It is faster than zeros() and ones() because no initialization is performed.
Syntax : np.empty(shape, dtype=float)

np.zeros_like():
np.zeros_like() is a NumPy function used to create an array filled with zeros having the same shape and data type as another array.
It is useful when creating matching arrays for calculations or placeholders.
Syntax: np.zeros_like(a, dtype=None)

EX: Identity, Diagonal, and Utility Functions
import numpy as np

# Identity matrix (diagonal 1s, rest 0s)
I = np.eye(4)
print('Identity 4x4:')
print(I)

# Diagonal matrix from 1D array
d = np.diag([5, 10, 15, 20])
print('Diagonal matrix:', d)

# Extract diagonal from 2D array
arr = np.array([[1,2,3],[4,5,6],[7,8,9]])
print('Main diagonal:', np.diag(arr))  # [1 5 9]

# empty -- fast but UNINITIALIZED (garbage values!)
e = np.empty((2, 3))
print('empty (fill before use):', e)

# zeros_like / ones_like -- match another array
template = np.array([[1.0, 2.0],[3.0, 4.0]])
z = np.zeros_like(template)
print('zeros_like:', z)    # [[0. 0.]                             #  [0. 0.]]
EXPLANATION:
np.eye(4)      ->  4x4 identity matrix. Essential for linear algebra.
np.diag([...]) ->  creates diagonal matrix from a 1D list.
np.diag(arr2D) ->  when given a 2D array, EXTRACTS the main diagonal.
np.empty()     ->  fastest creation -- no initialisation. Values are garbage. ALWAYS fill before use.
zeros_like()   ->  matches shape AND dtype of another array automatically.
\`\`\`

\`\`\`output

Identity 4x4:
[[1. 0. 0. 0.]  [0. 1. 0. 0.]  [0. 0. 1. 0.]  [0. 0. 0. 1.]]
Diagonal matrix: [[ 5  0  0  0]  [ 0 10  0  0]  [ 0  0 15  0]  [ 0  0  0 20]]
Main diagonal: [1 5 9]
zeros_like: [[0. 0.]  [0. 0.]]
\`\`\`

:::tip
**Lesson 3 Summary**
np.array(list)       ->  universal converter. Most flexible.
np.zeros(shape)      ->  fill with 0. Default float64.
np.ones(shape)       ->  fill with 1. Default float64.
np.full(shape, val)  ->  fill with any constant. Supports np.nan and np.inf.
np.arange(s,e,step)  ->  range array. Step-based. stop is EXCLUDED.
np.linspace(s,e,n)   ->  exactly n evenly-spaced values. Best for plotting.
np.random.rand(d0,..)  ->  uniform [0,1) floats. Set np.random.seed() first!
np.random.randint(l,h,size)  ->  random integers. h is EXCLUDED.
np.eye(n)            ->  identity matrix. np.diag() for diagonal.
:::`,

4: `# Indexing & Slicing

Selecting, extracting, and modifying any part of an array

:::insight
**Indexing Golden Rules**
Rule 1: Indexing is 0-based. First element = index 0, NOT 1.
Rule 2: Negative index -1 = last, -2 = second-to-last, etc.
Rule 3: Slicing: arr[start:stop:step]. start INCLUDED, stop EXCLUDED.
Rule 4: Omitting start defaults to 0. Omitting stop defaults to end.
Rule 5: Slicing returns a VIEW (not a copy) — modifying it changes original!
Rule 6: Boolean indexing always returns a COPY — safe to modify freely.
:::

### Visualising Indices

\`\`\`text
10 0/-8   20 1/-7   30 2/-6   40 3/-5   50 4/-4   60 5/-3   70 6/-2   80 7/-1
\`\`\`

Positive: 0,1,2,... (left to right)    |    Negative: -1,-2,... (right to left)

## 4.1 Basic Indexing — 1D Arrays

Basic indexing in a 1D NumPy array is used to access individual elements using their position (index).
- Indexing starts from 0
- Positive indexing accesses elements from left to right
- Negative indexing accesses elements from right to left

**Syntax: array[index]**

### Single Element Access and Modification

\`\`\`python
import numpy as np

arr = np.array([10, 20, 30, 40, 50, 60, 70, 80])

# Positive indexing
print(arr[0])    # 10  -- first element
print(arr[3])    # 40  -- fourth element
print(arr[7])    # 80  -- last element

# Negative indexing
print(arr[-1])   # 80  -- last element
print(arr[-2])   # 70  -- second to last

# Modify single element
arr[0] = 999
print('After modify:', arr)

# Out-of-bounds raises error
# arr[10]  -> IndexError: index 10 is out of bounds for size 8
\`\`\`

:::insight
**Explanation**
arr[0]   ->  first element (always 0-indexed).
arr[-1]  ->  last element. Same as arr[len(arr)-1].
arr[i] = val  ->  modifies array in place.
Out-of-bounds access raises IndexError.
:::

\`\`\`output

10
40
80
80
70
After modify: [999  20  30  40  50  60  70  80]
\`\`\`

## 4.2  Slicing — arr[start:stop:step]

Slicing is used to access a range of elements from a 1D array.

start → Beginning index

stop → Ending index (not included)

step → Interval between elements

Syntax: arr[start:stop:step]

EX: Slicing Examples — All Patterns

\`\`\`python
import numpy as np

arr = np.array([0, 10, 20, 30, 40, 50, 60, 70, 80, 90])
#               0   1   2   3   4   5   6   7   8   9

# Basic slice
print(arr[2:6])     # [20 30 40 50]

# Omit start
print(arr[:4])      # [0 10 20 30]

# Omit stop
print(arr[7:])      # [70 80 90]

# Negative slice
print(arr[-3:])     # [70 80 90]
print(arr[:-2])     # [0 10 20 30 40 50 60 70]

# Step slicing
print(arr[::2])     # [0 20 40 60 80]  every 2nd
print(arr[1::2])    # [10 30 50 70 90] every 2nd from 1

# Reverse with -1 step
print(arr[::-1])    # [90 80 70 60 50 40 30 20 10 0]
print(arr[8:2:-2])  # [80 60 40]
EXPLANATION:
arr[2:6]  ->  indices 2,3,4,5. Index 6 NOT included.
arr[:4]   ->  same as arr[0:4] -- first 4 elements.
arr[-3:]  ->  last 3 elements counting from end.
arr[::2]  ->  every 2nd element.
arr[::-1] ->  REVERSES the array. Very common and important trick!
\`\`\`

\`\`\`output

[20 30 40 50]
[ 0 10 20 30]
[70 80 90]
[70 80 90]
[ 0 10 20 30 40 50 60 70]
[ 0 20 40 60 80]
[10 30 50 70 90]
[90 80 70 60 50 40 30 20 10  0]
[80 60 40]
\`\`\`

## 4.3  Views vs Copies — CRITICAL

In NumPy, arrays can either share data with another array or store completely separate data.

Understanding the difference between views and copies is very important because it affects memory usage and data modification.

View

A view does not create new data.

It only creates another way to access the same original array data.

Shares memory with the original array

Changes in the view affect the original array

More memory efficient

NumPy slicing usually creates a view.

Syntax: arr.view()

Copy

A copy creates a completely independent array with its own memory.

Does not share memory with the original array

Changes do not affect the original array

Uses additional memory

Syntax: arr.copy()

EX: Slices Return Views — Not Copies

\`\`\`python
import numpy as np

original = np.array([1, 2, 3, 4, 5])

# Slice = VIEW (points to same memory!)
view = original[1:4]
print('Before:', original)

view[0] = 99              # changes ORIGINAL too!
print('After view change:', original)
# [ 1 99  3  4  5] -- original was modified!

# Check: is it a view?
print('Is view:', view.base is original)   # True

# .copy() creates independent array
original2 = np.array([1, 2, 3, 4, 5])
copy = original2[1:4].copy()
copy[0] = 99
print('Original2:', original2)  # [1 2 3 4 5] -- unchanged!
\`\`\`

EXPLANATION:

Slicing returns a VIEW -- it shares memory with the original array.

Changing a view CHANGES THE ORIGINAL -- a common source of subtle bugs!

View advantage: no memory copied -> fast and memory-efficient.

Use .copy() when you need an independent array that can be modified safely.

Boolean indexing ALWAYS returns a copy -- safe to modify freely.

\`\`\`output

Before: [1 2 3 4 5]
After view change: [ 1 99  3  4  5]
Is view: True
Original2: [1 2 3 4 5]
\`\`\`

## 4.4  Multi-Dimensional Indexing — 2D

**Multi-dimensional indexing is used to access elements in a 2D NumPy array using both row and column positions.**

A 2D array is organized like a table:
- Rows represent the first dimension
- Columns represent the second dimension

Indexing in 2D arrays allows access to:
- Single elements
- Entire rows
- Entire columns
- Specific sections of the array

**Syntax:  arr[row, col]  or  arr[row_slice, col_slice]**

### 2D Indexing — Rows, Columns, Submatrices

\`\`\`python
import numpy as np

mat = np.array([[ 1,  2,  3,  4,  5],
                [ 6,  7,  8,  9, 10],
                [11, 12, 13, 14, 15],
                [16, 17, 18, 19, 20]])

# Single element: row 1, col 3
print(mat[1, 3])        # 9

# Entire row
print(mat[2])           # [11 12 13 14 15]

# Entire column
print(mat[:, 1])        # [ 2  7 12 17]

# Sub-matrix: rows 1-2, cols 2-4
print(mat[1:3, 2:5])

# Last 2 rows, first 3 cols
print(mat[-2:, :3])

# Every other row and column
print(mat[::2, ::2])
\`\`\`

:::insight
**Explanation**
mat[1, 3]    ->  row 1, column 3 (comma separates dimensions).
mat[2]       ->  entire row 2.
mat[:, 1]    ->  colon = all rows, then column 1.
mat[1:3,2:5] ->  rows 1 and 2, columns 2,3,4 -> 2x3 submatrix.
mat[::2,::2] ->  every other row and column -- downsample.
:::

\`\`\`output

9
[11 12 13 14 15]
[ 2  7 12 17]
[[ 8  9 10]  [13 14 15]]
[[11 12 13]  [16 17 18]]
[[ 1  3  5]  [11 13 15]]
\`\`\`

## 4.5  Boolean Indexing (Masking)

Boolean indexing, also called masking, is used to filter or select elements from a NumPy array based on conditions.

A Boolean mask is an array containing:

True

False

Elements corresponding to True are selected, while elements corresponding to False are ignored.

This technique is commonly used for:

Data filtering

Conditional selection

Data cleaning

Numerical analysis

Syntax: arr[condition]

EX: Boolean Indexing — Filter and Modify

\`\`\`python
import numpy as np

scores = np.array([45, 82, 67, 90, 55, 78, 92, 40, 88, 73])

# Create mask
mask = scores >= 70
print('Mask:   ', mask)

# Apply mask
passing = scores[mask]
print('Passing:', passing)

# One-liner
failing = scores[scores < 70]
print('Failing:', failing)

# Multiple conditions: & (AND)  | (OR)
good = scores[(scores >= 70) & (scores < 90)]
print('70-89: ', good)

# Assign to filtered elements
scores[scores < 50] = 50   # boost all below 50
print('After boost:', scores)

print(f'{np.sum(scores >= 70)} students pass')
EXPLANATION:
scores >= 70  ->  element-wise comparison -> boolean array (mask).
scores[mask]  ->  selects elements where mask is True. Returns a COPY.
(cond1) & (cond2)  ->  both True. Use & not 'and' with NumPy arrays!
(cond1) | (cond2)  ->  either True. Use | not 'or'.
scores[scores<50] = 50  ->  assign to all matching elements in-place.
\`\`\`

\`\`\`output

Mask:   [False  True False  True False  True  True False  True  True]
Passing: [82 90 78 92 88 73]
Failing: [45 67 55 40]
70-89:   [82 78 88 73]
After boost: [50 82 67 90 55 78 92 50 88 73]
6 students pass
\`\`\`

## 4.6  np.where() — Conditional Selection

np.where() is a NumPy function used for conditional selection in arrays.

It checks a condition and returns values based on whether the condition is:

True

False

This function is commonly used for:

Filtering data

Replacing values

Conditional operations

Element-wise comparisons

Syntax : np.where(condition, x, y)

EX: np.where() — Element-Wise If/Else

\`\`\`python
import numpy as np

scores = np.array([45, 82, 67, 90, 55, 78, 92])

# If >= 70 return 'PASS', else 'FAIL'
labels = np.where(scores >= 70, 'PASS', 'FAIL')
print('Labels:', labels)

# Boost failing scores by 10%
adjusted = np.where(scores < 60, scores * 1.1, scores)
print('Adjusted:', adjusted.round(1))

# Nested np.where (like elif chain)
grades = np.where(scores >= 90, 'A',
         np.where(scores >= 80, 'B',
         np.where(scores >= 70, 'C',
         np.where(scores >= 60, 'D', 'F'))))
print('Grades:', grades)

# With ONE arg: returns indices where True
idx = np.where(scores >= 80)
print('High scorer indices:', idx[0])
print('Values:', scores[idx])
EXPLANATION:
np.where(cond, x, y)  ->  if cond True -> x, else -> y. All element-wise.
Nested np.where       ->  chain multiple conditions like if/elif/elif/else.
scores * 1.1  ->  10% boost for failing only; high scorers keep their score.
np.where(cond) with one argument  ->  returns tuple of indices where cond is True.
\`\`\`

\`\`\`output

Labels: ['FAIL' 'PASS' 'FAIL' 'PASS' 'FAIL' 'PASS' 'PASS']
Adjusted: [49.5 82.  73.7 90.  60.5 78.  92. ]
Grades: ['F' 'B' 'D' 'A' 'F' 'C' 'A']
High scorer indices: [1 3 6]
Values: [82 90 92]
\`\`\`

## 4.7  Fancy Indexing

Fancy indexing is a NumPy technique used to access multiple elements of an array using arrays or lists of indices instead of single index values.

It allows selection of:

Specific elements

Multiple rows or columns

Custom index patterns

Fancy indexing creates a copy of the data, not a view.

This method is commonly used in:

Data analysis

Rearranging data

Advanced filtering

Machine learning operations

Syntax: arr[[index1, index2, index3]]

EX: Select Non-Contiguous Elements

\`\`\`python
import numpy as np

arr = np.array([10, 20, 30, 40, 50, 60, 70, 80])

# Select specific indices
print(arr[[0, 2, 5, 7]])       # [10 30 60 80]

# Repeat indices
print(arr[[3, 3, 1, 0]])       # [40 40 20 10]

# 2D: select rows
mat = np.array([[1,2,3],[4,5,6],[7,8,9]])
print(mat[[0, 2]])             # rows 0 and 2

# Row-column pairs (like zip)
rows = [0, 1, 2]
cols = [2, 0, 1]
print(mat[rows, cols])         # [3 4 8] -> (0,2)=3 (1,0)=4 (2,1)=8
EXPLANATION:
arr[[0,2,5,7]]  ->  selects elements at those specific indices in any order.
arr[[3,3,1,0]]  ->  can REPEAT indices — unlike slicing.
Fancy indexing always returns a COPY — safe to modify.
mat[rows, cols] ->  pairs (row[i], col[i]) -> selects those specific cells.
\`\`\`

\`\`\`output

[10 30 60 80]
[40 40 20 10]
[[1 2 3]  [7 8 9]]
[3 4 8]
\`\`\`

:::tip
**Lesson 4 Summary**
0-based indexing. arr[0] = first. arr[-1] = last.
Slicing: arr[start:stop:step]. Start included, stop excluded.
arr[::-1]  ->  reverse an array.
2D: arr[row, col]. Use : for all. Combine slices for submatrices.
Slices = VIEWS (share memory). Use .copy() when you need independence.
Boolean: arr[arr>5] returns COPY. Use & (not 'and'), | (not 'or').
np.where(cond, x, y)  ->  element-wise conditional replacement.
Fancy: arr[[0,2,5]] selects non-contiguous elements. Returns copy.
:::`,

5: `# Basic Array Operations

Element-wise ops, math functions, aggregates, and broadcasting

## 5.1  Element-Wise Arithmetic

## Element-wise arithmetic in NumPy means mathematical operations are performed on corresponding elements of arrays.

## Operations are applied individually to each element without using loops.

## NumPy supports:

## Addition

## Subtraction

## Multiplication

## Division

## Modulus

## Power operations

## For element-wise operations:

## Arrays should usually have the same shape

## Broadcasting rules may also apply

## This feature makes NumPy:

## Faster

## More efficient

## Easier for numerical computations

## Syntax:

## arr1 + arr2

## arr1 - arr2

## arr1 * arr2

## arr1 / arr2

:::insight
**Element-Wise = No For Loops**
Python:  c = [a[i]+b[i] for i in range(len(a))]  <- slow Python loop
NumPy:   c = a + b                               <- fast compiled C
NumPy runs the loop in compiled C code -- 10-100x faster than Python loops.
:::

### All Arithmetic Operators

\`\`\`python
import numpy as np

a = np.array([10, 20, 30, 40, 50])
b = np.array([ 3,  4,  5,  8, 10])

print('a + b  =', a + b)    # element-wise add
print('a - b  =', a - b)    # subtract
print('a * b  =', a * b)    # multiply
print('a / b  =', a / b)    # true division (float)
print('a // b =', a // b)   # floor division
print('a % b  =', a % b)    # modulo (remainder)
print('a ** 2 =', a ** 2)   # square every element
print('a ** b =', a ** b)   # a[i]^b[i]
\`\`\`

:::insight
**Explanation**
a + b   ->  [10+3, 20+4, 30+5, 40+8, 50+10] = [13, 24, 35, 48, 60].
a / b   ->  true division, ALWAYS returns float64.
a // b  ->  floor division: 10//3=3, 20//4=5.
a % b   ->  modulo: 10%3=1, 20%4=0.
Both arrays must have the same shape (or be broadcast-compatible).
:::

\`\`\`output

a + b  = [13 24 35 48 60]
a - b  = [ 7 16 25 32 40]
a * b  = [ 30  80 150 320 500]
a / b  = [3.333 5.    6.    5.    5.   ]
a // b = [3 5 6 5 5]
a % b  = [1 0 0 0 0]
a ** 2 = [ 100  400  900 1600 2500]
\`\`\`

## 5.2  Scalar Operations

## Scalar operations in NumPy involve performing mathematical operations between an array and a single value (scalar).

## The scalar value is applied to every element of the array individually.

## NumPy supports scalar operations such as:

## Addition

## Subtraction

## Multiplication

## Division

## Power operations

## Scalar operations are useful for:

## Data transformation

## Normalization

## Scaling values

## Mathematical computations

## Syntax:

## arr + scalar

## arr – scalar

## arr * scalar

## arr / scalar

### Scalar Operations — Real-World Uses

\`\`\`python
import numpy as np

arr = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

# Apply to all elements
print(arr + 100)     # [101 102 ... 110]
print(arr * 3)       # [3 6 9 12 ... 30]
print(arr ** 2)      # [1 4 9 16 ... 100]

# Comparison -> boolean array
print(arr > 5)       # [F F F F F T T T T T]

# Celsius to Fahrenheit conversion
celsius = np.array([0, 20, 37, 100])
fahrenheit = celsius * 9/5 + 32
print('Fahrenheit:', fahrenheit)

# Normalise to [0, 1]
data = np.array([5, 10, 15, 20, 25])
norm = (data - data.min()) / (data.max() - data.min())
print('Normalised:', norm)
\`\`\`

:::insight
**Explanation**
arr + 100   ->  adds 100 to every element in one operation.
arr > 5     ->  returns boolean array [F, F, F, F, F, T, T, T, T, T].
Celsius->Fahrenheit formula applied to ALL elements simultaneously.
Normalisation: (x-min)/(max-min) maps values to [0, 1] range.
:::

\`\`\`output

[101 102 103 104 105 106 107 108 109 110]
[ 3  6  9 12 15 18 21 24 27 30]
[  1   4   9  16  25  36  49  64  81 100]
[False False False False False  True  True  True  True  True]
Fahrenheit: [ 32.   68.   98.6 212. ]
Normalised: [0.   0.25 0.5  0.75 1.  ]
\`\`\`

## 5.3  Universal Functions (ufuncs)

Universal functions, called ufuncs, are built-in NumPy functions that perform element-wise operations on arrays efficiently and quickly.

Ufuncs automatically operate on each element of an array without using explicit loops.

They support:
- Mathematical operations
- Trigonometric functions
- Statistical calculations
- Logical operations

Ufuncs provide:
- Fast execution
- Efficient memory usage
- Broadcasting support

Common ufunc categories include:
- Arithmetic functions
- Trigonometric functions
- Exponential and logarithmic functions
- Comparison functions

**Syntax : np.function_name(array)**

### Mathematical ufuncs — sqrt, log, exp, sin, round

\`\`\`python
import numpy as np

arr = np.array([1, 4, 9, 16, 25, 36, 49])

# Square root
print('sqrt:', np.sqrt(arr))   # [1. 2. 3. 4. 5. 6. 7.]

# Absolute value
neg = np.array([-3, 4, -7, 2, -1])
print('abs:', np.abs(neg))      # [3 4 7 2 1]

# Logarithms
print('log:  ', np.log(arr).round(3))
print('log2: ', np.log2(arr).round(3))
print('log10:', np.log10(arr).round(3))

# Exponential
print('exp:', np.exp(np.array([0,1,2,3])).round(3))

# Trig (angles in RADIANS!)
angles = np.linspace(0, np.pi/2, 5)
print('sin:', np.sin(angles).round(3))
print('cos:', np.cos(angles).round(3))

# Rounding
vals = np.array([-2.7, -1.3, 0.5, 1.4, 2.6])
print('round:', np.round(vals))
print('floor:', np.floor(vals))
print('ceil: ', np.ceil(vals))
\`\`\`

:::insight
**Explanation**
np.sqrt()  ->  square root element-wise.
np.abs()   ->  absolute value. Works on all negatives.
np.log()   ->  natural log (base e). np.log2() base 2. np.log10() base 10.
np.exp()   ->  e^x for each element.
Trig angles MUST be in radians. Convert: deg * np.pi / 180.
np.floor() always rounds down. np.ceil() always rounds up. np.round() rounds to nearest.
:::

\`\`\`output

sqrt: [1. 2. 3. 4. 5. 6. 7.]
abs: [3 4 7 2 1]
log:   [0.    1.386 2.197 2.773 3.219 3.584 3.892]
log2:  [0.    2.    3.170 4.    4.644 5.170 5.615]
log10: [0.    0.602 0.954 1.204 1.398 1.556 1.690]
exp: [ 1.     2.718  7.389 20.086]
sin: [0.    0.383 0.707 0.924 1.   ]
cos: [1.    0.924 0.707 0.383 0.   ]
round: [-3. -1.  0.  1.  3.]
floor: [-3. -2.  0.  1.  2.]
ceil:  [-2. -1.  1.  2.  3.]
\`\`\`

## 5.4  Aggregate Functions with axis

## Aggregate functions in NumPy are used to perform operations on array elements and return summarized results.

## Common aggregate functions include:

## sum()

## mean()

## min()

## max()

## std()

## var()

## The axis parameter controls the direction in which the operation is performed.

## Understanding axis

## In a 2D array:

## axis=0 → Operation is performed column-wise

## axis=1 → Operation is performed row-wise

## Using axis helps in analyzing data across rows or columns separately.

## Syntax: np.function_name(arr, axis=value)

:::insight
**Understanding the axis Parameter**
axis=None  ->  collapse EVERYTHING into one global value.
axis=0     ->  collapse along ROWS (operate DOWN each column). Result drops dimension 0.
axis=1     ->  collapse along COLUMNS (operate ACROSS each row). Result drops dimension 1.
Mnemonic: axis=0 = compress rows (result has row axis removed).
:::

### Aggregates — sum, mean, min, max, std, argmax

\`\`\`python
import numpy as np

# 3 students, 4 exams
scores = np.array([[85, 92, 78, 90],
                   [75, 88, 95, 82],
                   [92, 79, 85, 88]])

# Global
print('Total sum: ', scores.sum())
print('Grand mean:', scores.mean())
print('Overall std:', scores.std().round(2))

# axis=0: one value per column (avg per exam)
print('Mean per exam:   ', scores.mean(axis=0))

# axis=1: one value per row (avg per student)
print('Mean per student:', scores.mean(axis=1))

# argmax: index of the maximum value
print('Best exam per student:', scores.argmax(axis=1))

# cumsum: running total
flat = np.array([1, 2, 3, 4, 5])
print('Cumsum:', np.cumsum(flat))
\`\`\`

:::insight
**Explanation**
scores.mean(axis=0) -> avg across 3 students per exam -> shape (4,).
scores.mean(axis=1) -> avg across 4 exams per student -> shape (3,).
argmax(axis=1) -> index of max value per row (0=Math, 1=Physics, 2=Chem, 3=Bio).
cumsum -> running total: [1, 3, 6, 10, 15].
:::

\`\`\`output

Total sum:  1029
Grand mean: 85.75
Overall std: 5.87
Mean per exam:    [84.   86.33 86.   86.67]
Mean per student: [86.25 85.   86.  ]
Best exam per student: [1 2 0]
Cumsum: [ 1  3  6 10 15]
\`\`\`

## 5.5  Broadcasting

:::insight
**The Three Broadcasting Rules**
Broadcasting is a NumPy mechanism that allows arrays of different shapes to perform element-wise operations automatically without explicitly reshaping them.
It improves:
Code simplicity 
Performance 
Memory efficiency 
Broadcasting works by automatically expanding smaller arrays to match the shape of larger arrays when possible.

The Three Broadcasting Rules
Rule 1: Match Dimensions
If arrays have different numbers of dimensions (ndim), NumPy adds dimensions of size 1 to the left side of the smaller shape.
Example:
(3,) becomes (1,3) when combined with (4,3) 

Rule 2: Stretch Dimensions of Size 1
If a dimension size is 1, NumPy stretches it to match the corresponding dimension of the other array.
Example:
(1,3) stretches to (4,3) 

Rule 3: Dimensions Must Be Compatible
Two dimensions are compatible only when:
Their sizes are equal 
OR one of them is 1 
Otherwise, NumPy raises a ValueError.

Syntax: array1 + array2
:::

### Broadcasting — 4 Cases

\`\`\`python
import numpy as np

# CASE 1: Scalar + Array
arr = np.array([1, 2, 3, 4, 5])
print(arr + 10)    # [11 12 13 14 15]

# CASE 2: 1D + 2D (row broadcast)
matrix = np.array([[1,2,3],[4,5,6],[7,8,9]])
row    = np.array([10, 20, 30])   # (3,) -> treated as (1,3)
print('row broadcast:', matrix + row)

# CASE 3: Column vector + 2D
col = np.array([[100],[200],[300]])  # shape (3,1)
print('col broadcast:', matrix + col)

# CASE 4: Outer product style
r = np.array([[1],[2],[3]])    # shape (3,1)
c = np.array([10, 20, 30, 40]) # shape (4,)
print('outer:', r + c)          # shape (3,4)
\`\`\`

:::insight
**Explanation**
Case 1: scalar -> (1,) -> stretches to (5,).
Case 2: row (3,) -> (1,3) -> stretches to (3,3). Each matrix row gets +[10,20,30].
Case 3: col (3,1) -> stretches to (3,3). Each matrix column gets +[100,200,300].
Case 4: (3,1) + (4,) = (3,4). Creates every combination -- outer product!
No data is copied during broadcasting -- NumPy simulates it with strides.
:::

\`\`\`output

[11 12 13 14 15]
row broadcast: [[11 22 33]  [14 25 36]  [17 28 39]]
col broadcast: [[101 102 103]  [204 205 206]  [307 308 309]]
outer: [[11 21 31 41]  [12 22 32 42]  [13 23 33 43]]
\`\`\`

## 5.6  Array Manipulation

## Array manipulation in NumPy refers to operations used to modify the structure, shape, or arrangement of arrays without changing the actual data.

## These operations help in:

## Reshaping arrays

## Joining arrays

## Splitting arrays

## Rearranging elements

## Expanding or reducing dimensions

## Array manipulation is important in:

## Data preprocessing

## Machine learning

## Scientific computing

## Matrix operations

## Common array manipulation operations include:

## reshape()

## flatten()

## ravel()

## transpose()

## concatenate()

## split()

## stack()

## General Syntax: array.function_name()

### reshape, flatten, ravel, transpose

\`\`\`python
import numpy as np

arr = np.arange(24)

# reshape -- same data, new shape
a = arr.reshape(4, 6)
b = arr.reshape(2, 3, 4)
print('4x6:', a.shape, '  2x3x4:', b.shape)

# -1 means 'calculate automatically'
c = arr.reshape(6, -1)    # 6 rows, 4 cols
print('-1 reshape:', c.shape)

# flatten -- always a COPY
mat = np.array([[1,2,3],[4,5,6]])
print('flatten:', mat.flatten())

# ravel -- VIEW if possible (faster)
print('ravel:', mat.ravel())

# Transpose -- swap rows and columns
print('original:', mat.shape)    # (2, 3)
print('transposed:', mat.T.shape) # (3, 2)
print(mat.T)
\`\`\`

:::insight
**Explanation**
.reshape(4,6)  ->  same 24 elements, 4 rows x 6 cols.
.reshape(6,-1) ->  6 rows, NumPy calculates cols = 24/6 = 4.
.flatten()     ->  always a 1D COPY. Safe to modify.
.ravel()       ->  1D VIEW (no copy). Faster when modification not needed.
.T             ->  transpose. Rows become columns. Essential in linear algebra.
:::

\`\`\`output

4x6: (4, 6)   2x3x4: (2, 3, 4)
-1 reshape: (6, 4)
flatten: [1 2 3 4 5 6]
ravel: [1 2 3 4 5 6]
original: (2, 3)
transposed: (3, 2)
[[1 4]  [2 5]  [3 6]]
\`\`\`

## 5.7  Complete Real-World Example

### Student Marks Analysis — Everything in One

\`\`\`python
import numpy as np

# 5 students, 4 subjects
marks = np.array([[78, 85, 72, 90],
                  [92, 88, 95, 76],
                  [55, 62, 70, 68],
                  [95, 99, 88,100],
                  [40, 55, 48, 60]])

names    = ['Alice','Bob','Carol','Dave','Eve']
subjects = ['Math','Physics','Chemistry','Biology']

# 1. Average per student (axis=1)
avg = marks.mean(axis=1)
print('Averages:', avg.round(1))

# 2. Pass/Fail (>= 60)
pf = np.where(marks >= 60, 'P', 'F')
print('Pass/Fail:'); print(pf)

# 3. Best student per subject
best = marks.argmax(axis=0)
for i,sub in enumerate(subjects):
    print(f'Best {sub}: {names[best[i]]} ({marks[best[i],i]})')

# 4. Students above class average
above = np.sum(avg > marks.mean())
print(f'{above} students above class average ({marks.mean():.1f})')
\`\`\`

:::insight
**Explanation**
marks.mean(axis=1) -> 5 averages, one per student.
np.where(marks>=60,'P','F') -> element-wise conditional string replacement.
argmax(axis=0) -> index of top student per subject.
Everything done without a single explicit for-loop -- pure vectorised NumPy.
:::

\`\`\`output

Averages: [81.2 87.8 63.8 95.5 50.8]
Pass/Fail:
[['P' 'P' 'P' 'P']  ['P' 'P' 'P' 'P']  ['F' 'P' 'P' 'P']  ['P' 'P' 'P' 'P']  ['F' 'F' 'F' 'P']]
Best Math: Dave (95)
Best Physics: Dave (99)
Best Chemistry: Bob (95)
Best Biology: Dave (100)
3 students above class average (75.9)
\`\`\`

:::tip
**Lesson 5 Summary**
Element-wise: a+b, a-b, a*b, a/b, a//b, a%b, a**b. Same-shape pairs, no loops.
Scalar: arr + 5, arr * 2 -> broadcasts to all elements automatically.
ufuncs: np.sqrt, np.log, np.exp, np.sin, np.abs, np.round -- compiled C speed.
Aggregates: .sum(), .mean(), .min(), .max(), .std(), .argmax().
axis=0 collapses rows (per-column). axis=1 collapses columns (per-row).
Broadcasting: smaller arrays stretch to match larger. No data copied.
.reshape(), .flatten(), .ravel(), .T for manipulation.
Vectorise: replace Python for-loops with NumPy operations for speed.
:::

## Complete Summary & Cheat Sheet

*NumPy Beginner Guide -- Lessons 1-5*

**Lesson 1
Introduction**
NumPy=Numerical Python (2006). Lists store pointers->slow. NumPy stores contiguous bytes->fast. 3 reasons: contiguous memory, fixed dtype, vectorisation. Install: pip install numpy. Import: import numpy as np. Core: ndarray.

**Lesson 2
Arrays**
1D (n,)=vector. 2D (rows,cols)=matrix. 3D (d,r,c)=tensor. .shape=sizes. .dtype=type. .ndim=rank. .size=total elements. .astype() converts. float32 uses half memory of float64.

**Lesson 3
Creation**
array() from list. zeros()/ones()/full() constants. full() supports nan/inf. arange(s,e,step) step-based. linspace(s,e,n) count-based. rand() uniform floats. randint() integers. eye() identity. Always set seed!

**Lesson 4
Indexing**
0-based. arr[-1]=last. arr[s:e:step] stop excluded. arr[::-1] reverses. 2D: arr[r,c]. arr[:,2]=col 2. Slices=VIEWS. Boolean=COPY. & not 'and'. np.where(c,x,y).

**Lesson 5
Operations**
a+b element-wise. Scalar arr+5. ufuncs: sqrt log exp sin abs. Aggregates: sum mean max std argmax. axis=0 per-column, axis=1 per-row. Broadcasting. reshape flatten .T.

### Syntax Cheat Sheet

| Category / Syntax | Category / Syntax |
| --- | --- |
| IMPORT: import numpy as np \\| np.__version__ \\| np.random.seed(42) | CREATION: np.array([1,2,3]) \\| np.zeros((3,4)) \\| np.ones((2,3)) |
| CREATION 2: np.full((3,),7) \\| np.arange(0,10,2) \\| np.linspace(0,1,5) | RANDOM: np.random.rand(3,4) \\| np.random.randint(0,10,size=(3,)) |
| ATTRIBUTES: arr.shape \\| arr.dtype \\| arr.ndim \\| arr.size \\| arr.nbytes | CAST: .astype(np.float32) \\| np.array([1,2], dtype=np.uint8) |
| INDEXING: arr[0] \\| arr[-1] \\| arr[1:4] \\| arr[::2] \\| arr[::-1] | 2D: mat[r,c] \\| mat[1,:] \\| mat[:,2] \\| mat[0:2,1:3] |
| BOOLEAN: arr[arr>5] \\| arr[(arr>2)&(arr<8)] \\| np.where(c,x,y) | MATH: a+b \\| a-b \\| a*b \\| a/b \\| a//b \\| a%b \\| a**2 |
| UFUNCS: np.sqrt() \\| np.abs() \\| np.log() \\| np.exp() \\| np.sin() | AGGREGATE: .sum() \\| .mean() \\| .min() \\| .max() \\| .std() \\| .argmax() |
| AXIS: .sum(axis=0) col-wise \\| .mean(axis=1) row-wise | RESHAPE: .reshape(3,4) \\| .flatten() \\| .ravel() \\| .T \\| .reshape(-1) |`,

6: `# Broadcasting — Deep Dive

**In this lesson:** Broadcasting Rules · Compatible Shapes · Visual Examples · Practical Applications

## What is Broadcasting?

Broadcasting is NumPy's powerful mechanism that allows arithmetic operations to be performed on arrays of different shapes and sizes. Instead of requiring arrays to be exactly the same shape, NumPy "broadcasts" (virtually expands) the smaller array across the larger one to perform element-wise operations.

Without broadcasting, you would need to manually reshape or tile arrays to make them compatible — a tedious and memory-inefficient process. Broadcasting eliminates this entirely.

![What is Broadcasting?](/numpy%20imges/npimg1.png)

## The 3 Broadcasting Rules

NumPy has exactly THREE rules that determine whether two arrays can be broadcast together. Learn these rules and you will never be confused about broadcasting again.

| Rule | Name | Description |
| --- | --- | --- |
| Rule 1 | Pad Dimensions | If arrays have different ndim, prepend 1s to the shape of the smaller array until both shapes have the same length. |
| Rule 2 | Stretch Ones | In any dimension where one array has size 1 and the other has size > 1, the array with size 1 is virtually stretched to match. |
| Rule 3 | Check Compatibility | If arrays disagree on a dimension size and neither size is 1, a ValueError is raised — the shapes are incompatible. |

## Applying the Rules — Step-by-Step

![Applying the Rules — Step-by-Step](/numpy%20imges/npimg2.png)

### ample 2 — Scalar Broadcasting

\`\`\`python
import numpy as np

A = np.array([[1, 2, 3],
              [4, 5, 6]])
B = 10

result = A + B
print(result)

# NumPy adds 10 to EVERY element — no loop needed!
print(f"A shape: {A.shape}")    # (2, 3)
print(f"B shape: scalar")       # ()
\`\`\`

\`\`\`output

[[11 12 13]
 [14 15 16]]
A shape: (2, 3)
B shape: scalar
\`\`\`

![Applying the Rules — Step-by-Step](/numpy%20imges/npimg3.png)

### ample 3 — 1D Array + 2D Array

\`\`\`python
import numpy as np

A = np.array([[1, 2, 3],
              [4, 5, 6]])
B = np.array([10, 20, 30])

print("A shape:", A.shape)    # (2, 3)
print("B shape:", B.shape)    # (3,)

result = A + B
print("Result:", result)
print("Result shape:", result.shape)
\`\`\`

\`\`\`output

A shape: (2, 3)
B shape: (3,)
Result: [[11 22 33]
         [14 25 36]]
Result shape: (2, 3)
\`\`\`

### Case 3: Column Vector + Row Vector (Classic Broadcasting)

![Case 3: Column Vector + Row Vector (Classic Broadcasting)](/numpy%20imges/npimg4.png)

### ample 4 — Outer Sum via Broadcasting

\`\`\`python
import numpy as np

# Column vector — shape (3, 1)
col = np.array([[1], [2], [3]])

# Row vector — shape (1, 3)
row = np.array([[10, 20, 30]])

print("col shape:", col.shape)    # (3, 1)
print("row shape:", row.shape)    # (1, 3)

result = col + row
print("Result:")
print(result)
print("Result shape:", result.shape)   # (3, 3)

# This is the same as np.add.outer(col.ravel(), row.ravel())
# Great for creating multiplication tables!
mult_table = np.arange(1,6).reshape(5,1) * np.arange(1,6)
print("Multiplication table 5x5:")
print(mult_table)
\`\`\`

\`\`\`output

col shape: (3, 1)
row shape: (1, 3)
Result:
[[11 21 31]
 [12 22 32]
 [13 23 33]]
Result shape: (3, 3)
Multiplication table 5x5:
[[ 1  2  3  4  5]
 [ 2  4  6  8 10]
 [ 3  6  9 12 15]
 [ 4  8 12 16 20]
 [ 5 10 15 20 25]]
\`\`\`

## Compatible Shapes — Quick Reference

Use this table to quickly determine whether two shapes will broadcast successfully.

| Shape A | Shape B | Result Shape | Compatible? |
| --- | --- | --- | --- |
| (5,) | (5,) | (5,) | ✅ Yes — same shape |
| (3, 5) | (5,) | (3, 5) | ✅ Yes — 1D matches last dim |
| (3, 5) | (3, 1) | (3, 5) | ✅ Yes — 1 is stretched |
| (3, 1) | (1, 5) | (3, 5) | ✅ Yes — both stretched |
| (2, 3, 4) | (3, 4) | (2, 3, 4) | ✅ Yes — prepend 1 to (3,4) |
| (2, 3, 4) | (1, 3, 4) | (2, 3, 4) | ✅ Yes — first dim stretched |
| (3, 5) | (3, 4) | N/A | ❌ No — 5 ≠ 4, neither is 1 |
| (2, 1, 4) | (3, 4) | N/A | ❌ No — 2 ≠ 3, neither is 1 |

## Real-World Applications of Broadcasting

### ample 5 — Real-World Broadcasting Applications

\`\`\`python
import numpy as np

# ── Application 1: Normalize a dataset (mean=0, std=1) ──
data = np.array([[10, 20, 30],
                 [40, 50, 60],
                 [70, 80, 90]], dtype=float)

mean = data.mean(axis=0)       # Shape: (3,)
std  = data.std(axis=0)        # Shape: (3,)

# Broadcasting: (3,3) - (3,) divides by (3,)
normalized = (data - mean) / std
print("Normalized dataset:")
print(normalized.round(2))

# ── Application 2: Euclidean distance matrix ──
points = np.array([[1,2],[3,4],[5,6]])

# (3,1,2) - (1,3,2) → (3,3,2)
diff = points[:, np.newaxis, :] - points[np.newaxis, :, :]
dist_matrix = np.sqrt((diff**2).sum(axis=-1))
print("Distance matrix:")
print(dist_matrix.round(2))

# ── Application 3: Add bias to each row in neural net ──
weights = np.random.randn(4, 3)   # (4 samples, 3 features)
bias = np.array([0.1, 0.2, 0.3])  # (3,) — one bias per feature
\`\`\`

\`\`\`output

\`\`\`

\`\`\`python
print("With bias added:")
print(output.round(2))
\`\`\`

\`\`\`output

Normalized dataset:
[[-1.22 -1.22 -1.22]
 [ 0.    0.    0.  ]
 [ 1.22  1.22  1.22]]

Distance matrix:
[[0.   2.83 5.66]
 [2.83 0.   2.83]
 [5.66 2.83 0.  ]]
\`\`\`

:::mistake
**⚠  IMPORTANT**
Broadcasting Error: "ValueError: operands could not be broadcast together with shapes..." — This means two dimensions are incompatible (both > 1 but not equal). Fix it by reshaping one array using reshape() or np.newaxis.
:::

### Fixing Broadcasting Errors

\`\`\`python
# How to fix broadcasting errors with np.newaxis
a = np.array([1, 2, 3])       # shape (3,)
b = np.array([10, 20])        # shape (2,)

# This FAILS: (3,) and (2,) incompatible
# a + b  → ValueError!

# Fix: Convert to column vector → outer operation
result = a[:, np.newaxis] + b  # (3,1) + (2,) → (3,2)
print(result)
# [[11, 21],
#  [12, 22],
#  [13, 23]]
\`\`\``,

7: `# Array Manipulation

**In this lesson:** reshape() · ravel() & flatten() · Transpose (.T) · np.newaxis · squeeze() & expand_dims()

## Why Reshape Arrays?

Array manipulation is at the heart of data science workflows. Machine learning models expect data in specific shapes. Images must be reshaped before processing. Matrix operations require compatible dimensions. Mastering these functions gives you full control over your data's structure.

## reshape() — Change Shape Without Changing Data

The reshape() function returns a new array with the same data but a different shape. The total number of elements must remain the same.

### reshape()

\`\`\`python
array.reshape(new_shape)
np.reshape(array, new_shape)

new_shape  — tuple specifying new dimensions
            Use -1 for NumPy to auto-calculate that dimension
\`\`\`

![reshape() — Change Shape Without Changing Data](/numpy%20imges/npimg5.png)

### ample 6 — reshape()

\`\`\`python
import numpy as np

# Create a 1D array of 12 elements
arr = np.arange(12)
print("Original:", arr)          # [ 0  1  2  3  4  5  6  7  8  9 10 11]
print("Shape:", arr.shape)       # (12,)

# Reshape to 2D — 3 rows, 4 columns
m1 = arr.reshape(3, 4)
print("\\n3×4 Matrix:")
print(m1)

# Reshape to 2D — 4 rows, 3 columns
m2 = arr.reshape(4, 3)
print("\\n4×3 Matrix:")
print(m2)

# Using -1 — let NumPy figure out one dimension
m3 = arr.reshape(2, -1)      # 2 rows, auto-calculate cols = 6
print("\\n2×? (auto=6):", m3.shape)

m4 = arr.reshape(-1, 3)      # auto rows = 4, 3 cols
print("?×3 (auto=4):", m4.shape)

# Reshape to 3D tensor
t = arr.reshape(2, 2, 3)
print("\\n3D Tensor shape:", t.shape)   # (2, 2, 3)
print(t)
\`\`\`

\`\`\`output

Original: [ 0  1  2  3  4  5  6  7  8  9 10 11]
Shape: (12,)

3×4 Matrix:
[[ 0  1  2  3]
 [ 4  5  6  7]
 [ 8  9 10 11]]

4×3 Matrix:
[[ 0  1  2]
 [ 3  4  5]
 [ 6  7  8]
 [ 9 10 11]]

2×? (auto=6): (2, 6)
?×3 (auto=4): (4, 3)

3D Tensor shape: (2, 2, 3)
[[[ 0  1  2]  [ 3  4  5]]
 [[ 6  7  8]  [ 9 10 11]]]
\`\`\`

:::insight
**💡 TIP**
Use reshape(-1) to flatten any array to 1D. Use reshape(-1, n) when you know the number of columns but not rows (common in machine learning pipelines).
:::

## ravel() and flatten() — Flattening Arrays

Both ravel() and flatten() convert a multi-dimensional array into a 1D array. They differ in one critical way: ravel() returns a view when possible, while flatten() always returns a copy.

| ravel() | flatten() |
| --- | --- |
| Returns a view (when possible) | Always returns a copy |
| Changes affect original array | Changes do NOT affect original |
| More memory efficient | Uses more memory (new allocation) |
| arr.ravel() or np.ravel(arr) | arr.flatten() only |
| Default: C-order (row by row) | Default: C-order (row by row) |
| Faster — no memory copy | Safer — independent copy |

### ample 7 — ravel() vs flatten()

\`\`\`python
import numpy as np

matrix = np.array([[1, 2, 3],
                   [4, 5, 6]])
print("Original:")
print(matrix)

# ravel() — returns VIEW
r = matrix.ravel()
print("\\nravel():", r)           # [1 2 3 4 5 6]

r[0] = 999                        # Modify the ravel result
print("matrix[0,0] after modifying r:", matrix[0,0])   # 999! (shared memory)

# Reset
matrix = np.array([[1, 2, 3],[4, 5, 6]])

# flatten() — returns COPY
f = matrix.flatten()
print("\\nflatten():", f)          # [1 2 3 4 5 6]

f[0] = 999                        # Modify the flatten result
print("matrix[0,0] after modifying f:", matrix[0,0])   # 1 (unchanged!)

# Order options: C (row-major) vs F (column-major)
print("\\nC order (default):", matrix.ravel(order="C"))   # rows first
print("F order (Fortran): ", matrix.ravel(order="F"))   # cols first
\`\`\`

\`\`\`output

Original:
[[1 2 3]
 [4 5 6]]

ravel(): [1 2 3 4 5 6]
matrix[0,0] after modifying r: 999   ← (shared memory!)

flatten(): [1 2 3 4 5 6]
matrix[0,0] after modifying f: 1     ← (independent copy)

C order (default): [1 2 3 4 5 6]
F order (Fortran):  [1 4 2 5 3 6]
\`\`\`

:::mistake
**⚠  IMPORTANT**
ravel() returns a view — modifying it modifies the original array! Use flatten() when you need a completely independent copy of the flattened data.
:::

## Transpose — .T and np.transpose()

Transposing an array flips its axes. For a 2D matrix, rows become columns and columns become rows. For higher-dimensional arrays, you can specify a custom axis order.

![Transpose — .T and np.transpose()](/numpy%20imges/npimg6.png)

### .T and np.transpose()

\`\`\`python
array.T                              # Shorthand transpose
np.transpose(array)                  # Same as .T
np.transpose(array, axes=(2,0,1))    # Custom axis order for 3D+
\`\`\`

### ample 8 — Transpose Operations

\`\`\`python
import numpy as np

# 2D Transpose
m = np.array([[1, 2, 3],
              [4, 5, 6]])

print("Original shape:", m.shape)     # (2, 3)
print("Transposed shape:", m.T.shape) # (3, 2)
print(m.T)

# Transpose is a VIEW — same data, different layout
print("Is view?", np.shares_memory(m, m.T))  # True

# 3D Transpose — rearrange axes
t = np.arange(24).reshape(2, 3, 4)
print("\\nOriginal 3D shape:", t.shape)          # (2, 3, 4)

t2 = np.transpose(t, axes=(1, 0, 2))            # swap axis 0 and 1
print("After transpose(1,0,2):", t2.shape)       # (3, 2, 4)

# Common use: Matrix multiplication requires shape alignment
A = np.random.randn(5, 3)
B = np.random.randn(5, 3)
# A @ B would fail — need to transpose B
result = A @ B.T        # (5,3) @ (3,5) → (5,5)
print("\\nA @ B.T shape:", result.shape)   # (5, 5)
\`\`\`

\`\`\`output

Original shape: (2, 3)
Transposed shape: (3, 2)
[[1 4]
 [2 5]
 [3 6]]
Is view? True

Original 3D shape: (2, 3, 4)
After transpose(1,0,2): (3, 2, 4)

A @ B.T shape: (5, 5)
\`\`\`

## np.newaxis — Adding Dimensions

np.newaxis is used to insert a new axis into an array, increasing its dimensionality by 1. It is especially useful for broadcasting compatibility.

### ample 9 — np.newaxis

\`\`\`python
import numpy as np

arr = np.array([1, 2, 3, 4, 5])
print("Original:", arr.shape)            # (5,)

# Add axis at position 0 — becomes column vector
col = arr[:, np.newaxis]
print("As column:", col.shape)           # (5, 1)
print(col)

# Add axis at position 1 — becomes row vector
row = arr[np.newaxis, :]
print("As row:", row.shape)              # (1, 5)

# CRITICAL USE: Enable broadcasting between (5,) and (3,)
a = np.array([1, 2, 3, 4, 5])
b = np.array([10, 20, 30])

# outer addition using newaxis
outer = a[:, np.newaxis] + b[np.newaxis, :]
print("\\nOuter addition shape:", outer.shape)  # (5, 3)
print(outer)
\`\`\`

\`\`\`output

Original: (5,)
As column: (5, 1)
[[1] [2] [3] [4] [5]]
As row: (1, 5)

Outer addition shape: (5, 3)
[[11 21 31]
 [12 22 32]
 [13 23 33]
 [14 24 34]
 [15 25 35]]
\`\`\`

## Lesson 7 — Quick Reference

| Function | Purpose | Returns | Key Note |
| --- | --- | --- | --- |
| arr.reshape(s) | Change shape | View or copy | Total elements must match |
| arr.ravel() | Flatten to 1D | View (usually) | Modifying changes original |
| arr.flatten() | Flatten to 1D | Always a copy | Safe — independent copy |
| arr.T | Transpose axes | View | Rows ↔ columns |
| np.transpose(a,ax) | Custom axis reorder | View | Specify axis order tuple |
| arr[:,np.newaxis] | Add new axis | View | Increases ndim by 1 |`,

8: `# Combining & Splitting Arrays

**In this lesson:** vstack() · hstack() · column_stack() · concatenate() · split() / hsplit() / vsplit()

## Why Combine Arrays?

Data rarely comes in a single perfectly formatted array. You may need to combine datasets from multiple sources, append new records, add feature columns, or split data for training/testing. NumPy provides a rich set of stacking and splitting functions for every scenario.

## vstack() — Vertical Stacking (Along Rows)

vstack() (vertical stack) stacks arrays vertically — one on top of another along axis=0. It is equivalent to concatenation along the first axis for 2D arrays.

![vstack() — Vertical Stacking (Along Rows)](/numpy%20imges/npimg7.png)

### vstack()

\`\`\`python
np.vstack([arr1, arr2, arr3, ...])
np.vstack((arr1, arr2))                # also works with tuple

Requirement: All arrays must have same number of columns
\`\`\`

### ample 10 — np.vstack()

\`\`\`python
import numpy as np

A = np.array([[1, 2, 3],
              [4, 5, 6]])

B = np.array([[7,  8,  9],
              [10, 11, 12]])

stacked = np.vstack([A, B])
print("A shape:", A.shape)          # (2, 3)
print("B shape:", B.shape)          # (2, 3)
print("Stacked shape:", stacked.shape)  # (4, 3)
print(stacked)

# Stack a 1D array with a 2D array
C = np.array([100, 200, 300])       # 1D — treated as a row
result = np.vstack([A, C])
print("\\nWith 1D row:")
print(result)
print("Shape:", result.shape)       # (3, 3)

# Stack multiple arrays at once
multi = np.vstack([A, B, A])
print("\\nTriple stack shape:", multi.shape)  # (6, 3)
\`\`\`

\`\`\`output

A shape: (2, 3)
B shape: (2, 3)
Stacked shape: (4, 3)
[[ 1  2  3]
 [ 4  5  6]
 [ 7  8  9]
 [10 11 12]]

With 1D row:
[[  1   2   3]
 [  4   5   6]
 [100 200 300]]
Shape: (3, 3)

Triple stack shape: (6, 3)
\`\`\`

## hstack() — Horizontal Stacking (Along Columns)

hstack() (horizontal stack) stacks arrays side by side — along axis=1 for 2D arrays. It adds new columns to your data.

![hstack() — Horizontal Stacking (Along Columns)](/numpy%20imges/npimg8.png)

### ample 11 — np.hstack()

\`\`\`python
import numpy as np

A = np.array([[1, 2],
              [3, 4]])

B = np.array([[5, 6, 7],
              [8, 9, 10]])

stacked = np.hstack([A, B])
print("A shape:", A.shape)           # (2, 2)
print("B shape:", B.shape)           # (2, 3)
print("Stacked shape:", stacked.shape)   # (2, 5)
print(stacked)

# With 1D arrays — hstack concatenates them as-is
x = np.array([1, 2, 3])
y = np.array([4, 5, 6])
print("\\n1D hstack:", np.hstack([x, y]))
# [1 2 3 4 5 6]

# Real-world: adding a new feature column
features = np.array([[5.1, 3.5],
                     [4.9, 3.0],
                     [6.2, 3.4]])
new_col = np.array([[1.4],[1.4],[5.4]])
extended = np.hstack([features, new_col])
print("\\nExtended features:", extended.shape)   # (3, 3)
print(extended)
\`\`\`

\`\`\`output

A shape: (2, 2)
B shape: (2, 3)
Stacked shape: (2, 5)
[[ 1  2  5  6  7]
 [ 3  4  8  9 10]]

1D hstack: [1 2 3 4 5 6]

Extended features: (3, 3)
[[5.1 3.5 1.4]
 [4.9 3.  1.4]
 [6.2 3.4 5.4]]
\`\`\`

## column_stack() — Stack 1D as Columns

column_stack() treats 1D arrays as columns and stacks them side by side. This is perfect for building a 2D matrix from multiple 1D arrays — like combining separate feature vectors.

### ample 12 — np.column_stack()

\`\`\`python
import numpy as np

# Three 1D arrays — treating each as a column
names  = np.array([1, 2, 3, 4])       # feature 1
height = np.array([170, 165, 180, 175])  # feature 2
weight = np.array([65, 60, 80, 70])      # feature 3

# column_stack makes each 1D array a column
data = np.column_stack([names, height, weight])
print("Stacked shape:", data.shape)   # (4, 3)
print(data)

# Compare: hstack with 1D treats them as rows → wrong!
wrong = np.hstack([names, height, weight])
print("\\nhstack with 1D (wrong for this):", wrong.shape)
# (12,) — concatenated flat!

# column_stack with 2D arrays behaves like hstack
A = np.array([[1],[2],[3]])
B = np.array([[4],[5],[6]])
print("\\nWith 2D:", np.column_stack([A, B]))
\`\`\`

\`\`\`output

Stacked shape: (4, 3)
[[  1 170  65]
 [  2 165  60]
 [  3 180  80]
 [  4 175  70]]

hstack with 1D (wrong for this): (12,)

With 2D: [[1 4]
          [2 5]
          [3 6]]
\`\`\`

:::insight
**📝 NOTE**
Use column_stack() when combining 1D arrays into a dataset table. Use hstack() when combining 2D arrays side by side.
:::

## np.concatenate() — Universal Stacking

concatenate() is the most flexible combining function. You explicitly specify the axis along which to join.

### ample 13 — np.concatenate()

\`\`\`python
import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

# axis=0 → vertical (like vstack)
v = np.concatenate([A, B], axis=0)
print("axis=0:", v.shape)    # (4, 2)
print(v)

# axis=1 → horizontal (like hstack)
h = np.concatenate([A, B], axis=1)
print("\\naxis=1:", h.shape)  # (2, 4)
print(h)
\`\`\`

\`\`\`output

axis=0: (4, 2)
[[1 2] [3 4] [5 6] [7 8]]

axis=1: (2, 4)
[[1 2 5 6] [3 4 7 8]]
\`\`\`

## Splitting Arrays — split(), vsplit(), hsplit()

Splitting is the inverse of stacking. NumPy provides several functions to divide an array into multiple sub-arrays.

| Function | Splits Along | Example Usage |
| --- | --- | --- |
| np.split(arr, n) | Any axis (default 0) | Split into n equal parts |
| np.vsplit(arr, n) | Axis 0 (rows) | Split into n row groups |
| np.hsplit(arr, n) | Axis 1 (cols) | Split into n column groups |
| np.array_split(arr, n) | Any axis | Like split but allows unequal sizes |

### ample 14 — Splitting Arrays

\`\`\`python
import numpy as np

arr = np.arange(1, 13).reshape(4, 3)
print("Original array:")
print(arr)

# vsplit — split into equal row groups
top, bottom = np.vsplit(arr, 2)   # Split into 2 equal parts
print("\\nTop half:")
print(top)
print("Bottom half:")
print(bottom)

# hsplit — split into equal column groups
left, mid, right = np.hsplit(arr, 3)
print("\\nLeft col:", left.ravel())
print("Mid col: ", mid.ravel())
print("Right col:", right.ravel())

# split with custom indices
row = np.arange(10)
parts = np.split(row, [3, 7])   # Split at indices 3 and 7
print("\\nSplit at [3,7]:", parts)

# array_split — unequal sizes allowed
unequal = np.array_split(np.arange(10), 3)
print("Unequal split:", [a.tolist() for a in unequal])
\`\`\`

\`\`\`output

Original array:
[[ 1  2  3]
 [ 4  5  6]
 [ 7  8  9]
 [10 11 12]]

Top half:  [[1 2 3][4 5 6]]
Bottom half: [[7 8 9][10 11 12]]

Left col: [ 1  4  7 10]
Mid col:  [ 2  5  8 11]
Right col: [ 3  6  9 12]

Split at [3,7]: [array([0,1,2]), array([3,4,5,6]), array([7,8,9])]
Unequal split: [[0,1,2,3], [4,5,6], [7,8,9]]
\`\`\`

## Combining & Splitting — Summary Diagram

![Combining & Splitting — Summary Diagram](/numpy%20imges/npimg9.png)`,

9: `# Mathematical & Statistical Functions

**In this lesson:** sum / mean / median · std / var · min / max / percentile · Axis-based Operations · Universal Functions (ufuncs)

## Understanding Axis-Based Operations

Almost every NumPy statistical function accepts an axis parameter. This is one of the most important — and commonly confused — concepts in NumPy.

![Understanding Axis-Based Operations](/numpy%20imges/npimg10.png)

## Sum, Mean, Median — Central Tendency

### sum / mean / median

\`\`\`python
np.sum(arr, axis=None)      # Sum of all (or along axis)
arr.sum(axis=0)             # Same using method style

np.mean(arr, axis=None)     # Arithmetic mean
np.median(arr, axis=None)   # Middle value when sorted
np.cumsum(arr, axis=None)   # Cumulative sum
\`\`\`

### ample 15 — Sum, Mean, Median

\`\`\`python
import numpy as np

scores = np.array([[85, 92, 78],   # Student 1: 3 subjects
                   [70, 88, 95],   # Student 2
                   [60, 75, 82],   # Student 3
                   [90, 91, 88]])  # Student 4

print("Scores matrix:", scores.shape)

# Sum
print("\\nTotal all scores:", np.sum(scores))         # scalar
print("Sum per subject (axis=0):", np.sum(scores, axis=0))  # (3,)
print("Sum per student (axis=1):", np.sum(scores, axis=1))  # (4,)

# Mean
print("\\nOverall mean:", np.mean(scores).round(2))
print("Subject avg (axis=0):", np.mean(scores, axis=0).round(2))
print("Student avg (axis=1):", np.mean(scores, axis=1).round(2))

# Median
print("\\nOverall median:", np.median(scores))
print("Subject median (axis=0):", np.median(scores, axis=0))

# Cumulative sum
row = np.array([10, 20, 30, 40, 50])
print("\\nCumsum:", np.cumsum(row))   # Running total
\`\`\`

\`\`\`output

Scores matrix: (4, 3)

Total all scores: 994
Sum per subject (axis=0): [305 346 343]
Sum per student (axis=1): [255 253 217 269]

Overall mean: 82.83
Subject avg (axis=0): [76.25 86.5  85.75]
Student avg (axis=1): [85.   84.33 72.33 89.67]

Overall median: 85.5
Subject median (axis=0): [77.5  90.  85. ]

Cumsum: [ 10  30  60 100 150]
\`\`\`

## Standard Deviation & Variance

Standard deviation (std) measures how spread out values are from the mean. Variance (var) is std squared. These are essential for understanding data distribution.

### Standard Deviation Concept

\`\`\`text
  Standard Deviation — Intuition
  ──────────────────────────────────────────────────────────
  Dataset A: [50, 50, 50, 50]   mean=50  std=0   (no spread)
  Dataset B: [40, 45, 55, 60]   mean=50  std≈7.9 (moderate)
  Dataset C: [10, 20, 80, 90]   mean=50  std≈30  (very spread)
  Formula:
  variance  = mean((x - mean)²)
  std       = sqrt(variance)
  ddof=0 (default) → Population standard deviation
  ddof=1           → Sample standard deviation (Bessel correction)
\`\`\`

### ample 16 — std() and var()

\`\`\`python
import numpy as np

scores = np.array([[85, 92, 78],
                   [70, 88, 95],
                   [60, 75, 82],
                   [90, 91, 88]])

# Standard deviation
print("Overall std:", np.std(scores).round(2))
print("Std per subject (axis=0):", np.std(scores, axis=0).round(2))
print("Std per student (axis=1):", np.std(scores, axis=1).round(2))

# Variance
print("\\nOverall var:", np.var(scores).round(2))
print("Var per subject (axis=0):", np.var(scores, axis=0).round(2))

# Sample std (ddof=1) — use for sample data
sample = np.array([4, 7, 13, 2, 1])
print("\\nPopulation std (ddof=0):", np.std(sample).round(4))
print("Sample std     (ddof=1):", np.std(sample, ddof=1).round(4))

# Interpret: student with highest variability
stds = np.std(scores, axis=1)
print("\\nStudent stds:", stds.round(2))
print("Most variable student index:", np.argmax(stds))
\`\`\`

\`\`\`output

Overall std: 10.24
Std per subject (axis=0): [11.04  7.04  6.77]
Std per student (axis=1): [ 5.73 10.4   9.07  1.25]

Overall var: 104.86
Var per subject (axis=0): [121.94  49.5   45.81]

Population std (ddof=0): 4.0866
Sample std     (ddof=1): 4.5717

Student stds: [ 5.73 10.4   9.07  1.25]
Most variable student index: 1
\`\`\`

## Min, Max, Percentile, and More

These statistical functions help analyze the spread, range, and distribution of data in NumPy arrays.

They are widely used in:
- Data analysis
- Machine learning
- Scientific computing
- Statistical calculations

**np.min()**

Returns the smallest value in the array.

**Syntax: np.min(arr, axis=None)**

**np.max()**

Returns the largest value in the array.

**Syntax: np.max(arr, axis=None)**

**np.percentile()**

Returns the value below which a given percentage of data falls.

Example concepts:
- 25th percentile
- 50th percentile (median)
- 75th percentile

Used for:
- Distribution analysis
- Quartiles
- Statistical summaries

**Syntax: np.percentile(arr, q, axis=None)**

**np.std()**

Calculates the standard deviation, which measures data spread around the mean.

**Syntax: np.std(arr, axis=None)**

**np.var()**

Calculates the variance of the dataset.

**Syntax: np.var(arr, axis=None)**

**np.argmin()**

Returns the index of the minimum value.

**Syntax: np.argmin(arr, axis=None)**

**np.argmax()**

Returns the index of the maximum value.

**Syntax: np.argmax(arr, axis=None)**

### ample 17 — Min, Max, Percentile, Clip

\`\`\`python
import numpy as np

data = np.array([[10, 50, 30],
                 [20, 40, 60],
                 [35, 15, 45]])

# Min and Max
print("Global min:", np.min(data))
print("Global max:", np.max(data))
print("Min per column (axis=0):", np.min(data, axis=0))
print("Max per row    (axis=1):", np.max(data, axis=1))

# Peak-to-peak range (max - min)
print("\\nRange per col (axis=0):", np.ptp(data, axis=0))

# Percentile — more robust than min/max
flat = data.ravel()
print("\\nFlat data:", flat)
print("25th percentile:", np.percentile(flat, 25))
print("50th percentile:", np.percentile(flat, 50))  # = median
print("75th percentile:", np.percentile(flat, 75))
print("IQR (75-25):", np.percentile(flat, 75) - np.percentile(flat, 25))

# Clip values to a range
print("\\nClipped to [20, 45]:", np.clip(flat, 20, 45))
\`\`\`

\`\`\`output

Global min: 10
Global max: 60
Min per column (axis=0): [10 15 30]
Max per row    (axis=1): [50 60 45]

Range per col (axis=0): [25 35 30]

Flat data: [10 50 30 20 40 60 35 15 45]
25th percentile: 20.0
50th percentile: 35.0
75th percentile: 45.0
IQR (75-25): 25.0

Clipped to [20, 45]: [20 45 30 20 40 45 35 20 45]
\`\`\`

## Complete Statistical Summary Example

### ample 18 — Full Statistical Analysis

\`\`\`python
import numpy as np

# Simulate exam scores for 5 students, 4 subjects
np.random.seed(42)
scores = np.random.randint(50, 101, size=(5, 4))

subjects = ["Math", "Science", "English", "History"]

print("=== EXAM SCORE ANALYSIS ===\\n")
print("Scores matrix (5 students x 4 subjects):")
print(scores)

print("\\n--- Per Subject (axis=0) ---")
for i, subj in enumerate(subjects):
    col = scores[:, i]
    print(f"{subj:10s}: Mean={col.mean():.1f} | Std={col.std():.1f} | "
          f"Min={col.min()} | Max={col.max()}")

print("\\n--- Per Student (axis=1) ---")
means = scores.mean(axis=1)
for i, m in enumerate(means):
    print(f"Student {i+1}: Average = {m:.2f} | Grade = ",
          "A" if m>=90 else "B" if m>=80 else "C" if m>=70 else "D")

print("\\n--- Class Statistics ---")
print(f"Class mean:   {scores.mean():.2f}")
print(f"Class median: {np.median(scores):.1f}")
print(f"Class std:    {scores.std():.2f}")
\`\`\`

\`\`\`output

=== EXAM SCORE ANALYSIS ===

Scores matrix (5 students x 4 subjects):
[[77 90 55 93]
 [95 68 76 74]
 [68 63 83 59]
 [80 91 79 87]
 [64 71 56 82]]

--- Per Subject (axis=0) ---
Math      : Mean=76.8 | Std=10.8 | Min=64 | Max=95
Science   : Mean=76.6 | Std=11.7 | Min=63 | Max=91
English   : Mean=69.8 | Std=12.0 | Min=55 | Max=83
History   : Mean=79.0 | Std=12.5 | Min=59 | Max=93

--- Per Student (axis=1) ---
Student 1: Average = 78.75 | Grade = C
Student 2: Average = 78.25 | Grade = C
Student 3: Average = 68.25 | Grade = D
Student 4: Average = 84.25 | Grade = B
Student 5: Average = 68.25 | Grade = D
\`\`\`

## Lesson 9 — Function Reference

| Function | Description | Returns | Axis Support |
| --- | --- | --- | --- |
| np.sum(a) | Sum of elements | scalar or array | Yes |
| np.mean(a) | Arithmetic mean | scalar or array | Yes |
| np.median(a) | Median value | scalar or array | Yes |
| np.std(a) | Standard deviation | scalar or array | Yes |
| np.var(a) | Variance | scalar or array | Yes |
| np.min(a) | Minimum value | scalar or array | Yes |
| np.max(a) | Maximum value | scalar or array | Yes |
| np.percentile(a,q) | q-th percentile | scalar or array | Yes |
| np.cumsum(a) | Cumulative sum | array | Yes |
| np.ptp(a) | Peak-to-peak (max-min) | scalar or array | Yes |
| np.clip(a,lo,hi) | Clip values to range | array | No |`,

10: `# Sorting & Searching

**In this lesson:** np.sort() · np.argsort() · np.where() · np.argmax() / np.argmin() · np.searchsorted()

## Sorting Arrays — np.sort()

np.sort() returns a sorted copy of an array. Unlike Python's built-in list.sort() which sorts in-place, np.sort() always returns a new array.

### np.sort()

\`\`\`python
np.sort(array, axis=-1, kind="quicksort")
array.sort(axis=-1, kind="quicksort")   # In-place sort!

axis   : -1 (last, default), 0 (along rows), 1 (along cols), None (flattened)
kind   : "quicksort" (default), "mergesort" (stable), "heapsort", "stable"
\`\`\`

### ample 19 — np.sort()

\`\`\`python
import numpy as np

# 1D Sort
arr = np.array([3, 1, 4, 1, 5, 9, 2, 6, 5, 3])
print("Original:", arr)
print("Sorted:  ", np.sort(arr))
print("Desc:    ", np.sort(arr)[::-1])    # Reverse for descending

# 2D Sort
matrix = np.array([[3, 1, 4],
                   [1, 5, 9],
                   [2, 6, 5]])

print("\\nOriginal:")
print(matrix)
print("\\nSorted along axis=1 (each row sorted):")
print(np.sort(matrix, axis=1))
print("\\nSorted along axis=0 (each column sorted):")
print(np.sort(matrix, axis=0))

# In-place sort (modifies original!)
arr2 = np.array([5, 2, 8, 1, 9])
arr2.sort()                             # No return value
print("\\nIn-place sort:", arr2)

# Sort structured data — sort rows by first column
data = np.array([[3, 70], [1, 85], [2, 60], [4, 90]])
sorted_by_id = data[data[:,0].argsort()]
print("\\nSorted by ID:", sorted_by_id)
\`\`\`

\`\`\`output

Original: [3 1 4 1 5 9 2 6 5 3]
Sorted:   [1 1 2 3 3 4 5 5 6 9]
Desc:     [9 6 5 5 4 3 3 2 1 1]

Original:
[[3 1 4]
 [1 5 9]
 [2 6 5]]

Sorted along axis=1 (each row sorted):
[[1 3 4]
 [1 5 9]
 [2 5 6]]

Sorted along axis=0 (each column sorted):
[[1 1 4]
 [2 5 5]
 [3 6 9]]

In-place sort: [1 2 5 8 9]

Sorted by ID: [[ 1 85][ 2 60][ 3 70][ 4 90]]
\`\`\`

## argsort() — Indirect Sorting

argsort() returns the indices that would sort the array. This is extremely useful when you need to sort one array while keeping another array's correspondence intact.

![argsort() — Indirect Sorting](/numpy%20imges/npimg12.png)

### ample 20 — np.argsort()

\`\`\`python
import numpy as np

# Basic argsort
arr = np.array([30, 10, 50, 20, 40])
idx = np.argsort(arr)
print("Array:   ", arr)
print("argsort: ", idx)          # [1 3 0 4 2]
print("Sorted:  ", arr[idx])     # [10 20 30 40 50]

# argsort descending
idx_desc = np.argsort(arr)[::-1]
print("Desc idx:", idx_desc)
print("Desc:    ", arr[idx_desc])

# Real use: Sort students by grade
students = np.array(["Alice", "Bob", "Charlie", "Dave", "Eve"])
grades   = np.array([82, 75, 91, 68, 88])

rank_idx = np.argsort(grades)[::-1]  # Sort descending (best first)
print("\\n=== Ranking (Best to Worst) ===")
for rank, i in enumerate(rank_idx, 1):
    print(f"Rank {rank}: {students[i]:10s}  Grade: {grades[i]}")

# argsort on 2D matrix — sort each row
m = np.array([[30, 10, 20],
              [9, 15, 3]])
print("\\n2D argsort (axis=1):")
print(np.argsort(m, axis=1))
\`\`\`

\`\`\`output

Array:    [30 10 50 20 40]
argsort:  [1 3 0 4 2]
Sorted:   [10 20 30 40 50]
Desc idx: [2 4 0 3 1]
Desc:     [50 40 30 20 10]

=== Ranking (Best to Worst) ===
Rank 1: Charlie     Grade: 91
Rank 2: Eve         Grade: 88
Rank 3: Alice       Grade: 82
Rank 4: Bob         Grade: 75
Rank 5: Dave        Grade: 68

2D argsort (axis=1):
[[1 2 0]
 [2 0 1]]
\`\`\`

## np.where() — Conditional Search & Replace

np.where() is one of the most powerful NumPy functions. It works in two modes: as a search function (finding indices where a condition is true) and as a vectorized if-else (replacing values conditionally).

### np.where()

\`\`\`python
# Mode 1: Find indices where condition is True
np.where(condition)

# Mode 2: Conditional element selection (vectorized if-else)
np.where(condition, value_if_true, value_if_false)
\`\`\`

### ample 21 — np.where()

\`\`\`python
import numpy as np

scores = np.array([72, 85, 91, 56, 78, 94, 63, 88, 71, 95])

# ── Mode 1: Find WHERE condition is True ──
indices = np.where(scores >= 80)
print("Indices where score >= 80:", indices)
print("Scores at those indices:", scores[indices])

# ── Mode 2: Vectorized if-else ──
# Label each score: PASS or FAIL
result = np.where(scores >= 70, "PASS", "FAIL")
print("\\nPass/Fail:", result)

# Assign letter grades
# Chain multiple np.where for multi-category
grades = np.where(scores >= 90, "A",
          np.where(scores >= 80, "B",
          np.where(scores >= 70, "C",
          np.where(scores >= 60, "D", "F"))))
print("Letter grades:", grades)

# Replace negative values with 0 (clipping)
data = np.array([-3, 5, -1, 8, -2, 4, 7])
cleaned = np.where(data < 0, 0, data)
print("\\nNegatives → 0:", cleaned)

# 2D example: mark outliers
m = np.array([[10, 200, 30],
              [40,  50, 500]])
marked = np.where(m > 100, -1, m)
print("\\nOutliers replaced with -1:")
print(marked)
\`\`\`

\`\`\`output

Indices where score >= 80: (array([1, 2, 5, 7, 9]),)
Scores at those indices: [85 91 94 88 95]

Pass/Fail: ["PASS" "PASS" "PASS" "FAIL" "PASS" "PASS" "FAIL" "PASS" "PASS" "PASS"]

Letter grades: ["C" "B" "A" "F" "C" "A" "D" "B" "C" "A"]

Negatives → 0: [0 5 0 8 0 4 7]

Outliers replaced with -1:
[[ 10  -1  30]
 [ 40  50  -1]]
\`\`\`

## argmax() and argmin() — Finding Extreme Positions

argmax() returns the index of the maximum value. argmin() returns the index of the minimum value. Unlike max() and min() which return the values, argmax/argmin tell you where those extremes are located.

### ample 22 — argmax() and argmin()

\`\`\`python
import numpy as np

# 1D examples
arr = np.array([3, 1, 4, 1, 5, 9, 2, 6, 5, 3])
print("Array:", arr)
print("Max value:", np.max(arr))          # 9
print("Max index:", np.argmax(arr))        # 5  (index of 9)
print("Min value:", np.min(arr))           # 1
print("Min index:", np.argmin(arr))        # 1  (index of first 1)

# 2D — axis-based
matrix = np.array([[10, 50, 30],
                   [40, 20, 60],
                   [35, 15, 45]])

print("\\nMatrix:")
print(matrix)

# axis=0: index of max in each COLUMN
print("argmax(axis=0):", np.argmax(matrix, axis=0))  # row index of max per col

# axis=1: index of max in each ROW
print("argmax(axis=1):", np.argmax(matrix, axis=1))  # col index of max per row

# Real use: Which student scored highest in each subject?
scores = np.array([[85, 92, 78],
                   [70, 88, 95],
                   [90, 75, 82]])
subjects = ["Math", "Science", "English"]
best = np.argmax(scores, axis=0)
print("\\nTop student per subject:")
for i, s in enumerate(subjects):
    print(f"  {s}: Student {best[i]+1} (score={scores[best[i],i]})")
\`\`\`

\`\`\`output

Array: [3 1 4 1 5 9 2 6 5 3]
Max value: 9
Max index: 5
Min value: 1
Min index: 1

Matrix:
[[10 50 30]
 [40 20 60]
 [35 15 45]]

argmax(axis=0): [1 0 1]  ← row 1 has max in cols 0,2; row 0 in col 1
argmax(axis=1): [1 2 0]  ← col 1 max in row 0; col 2 in row 1...

Top student per subject:
  Math:    Student 3 (score=90)
  Science: Student 1 (score=92)
  English: Student 2 (score=95)
\`\`\`

## np.searchsorted() — Binary Search

searchsorted() performs a binary search on a sorted array and returns the indices where elements should be inserted to maintain sorted order.

### ample 23 — np.searchsorted()

\`\`\`python
import numpy as np

sorted_arr = np.array([10, 20, 30, 40, 50])

# Find where to insert 25 to keep sorted
idx = np.searchsorted(sorted_arr, 25)
print("Insert 25 at index:", idx)      # 2 (between 20 and 30)

# Insert multiple values
indices = np.searchsorted(sorted_arr, [15, 25, 45])
print("Insert [15,25,45] at:", indices) # [1, 2, 4]

# side="right" — insert after existing matches
print("Insert 30 (left):", np.searchsorted(sorted_arr, 30, side="left"))
print("Insert 30 (right):", np.searchsorted(sorted_arr, 30, side="right"))
\`\`\`

\`\`\`output

Insert 25 at index: 2
Insert [15,25,45] at: [1 2 4]
Insert 30 (left): 2
Insert 30 (right): 3
\`\`\`

## Lesson 10 — Complete Reference

| Function | Description | Key Parameter |
| --- | --- | --- |
| np.sort(a) | Returns sorted copy | axis, kind |
| a.sort() | In-place sort | axis, kind |
| np.argsort(a) | Indices that sort a | axis, kind |
| np.argmax(a) | Index of maximum | axis |
| np.argmin(a) | Index of minimum | axis |
| np.max(a) | Maximum value | axis |
| np.min(a) | Minimum value | axis |
| np.where(cond) | Indices where True | — |
| np.where(c,x,y) | If-else element-wise | — |
| np.searchsorted(a,v) | Binary search insert pos | side |
| np.unique(a) | Unique sorted values | return_counts, return_index |
| np.nonzero(a) | Indices of non-zero elements | — |

## Quick Reference Cheat Sheet

*Lessons 6–10: All Key Functions at a Glance*

| L6: Broadcasting | L7: Array Manipulation |
| --- | --- |
| • Rule 1: Pad dims with 1s • Rule 2: Stretch size-1 dims • Rule 3: Else error • a + 10 → scalar broadcast • a[:,np.newaxis] + b → outer op • (3,1)+(1,3) → (3,3) | • arr.reshape(3,4) • arr.reshape(-1,4) # auto rows • arr.ravel() # view • arr.flatten() # copy • arr.T # transpose • np.transpose(a,(2,0,1)) |
| L8: Combining & Splitting | L9: Math & Statistics |
| • np.vstack([a,b]) # add rows • np.hstack([a,b]) # add cols • np.column_stack() # 1D→cols • np.concatenate([],axis=0) • np.vsplit(a, n) # split rows • np.hsplit(a, n) # split cols • np.array_split() # unequal | • np.sum(a, axis=0) • np.mean(a, axis=1) • np.median(a) • np.std(a, ddof=1) • np.var(a) • np.min/max(a, axis=0) • np.percentile(a, 75) • np.cumsum(a) • np.clip(a, lo, hi) |
| L10: Sorting & Searching |  |
| • np.sort(a) # sorted copy • a.sort() # in-place • np.argsort(a) # sort indices • np.sort(a)[::-1] # descending | • np.argmax(a) # index of max • np.argmin(a) # index of min • np.where(cond) # find indices • np.where(c, x, y) # if-else • np.searchsorted(a,v) # binary search • np.unique(a) # unique values |

:::tip
**🧠 MASTER TIP — The Axis Rule**
Remember the axis rule: axis=0 collapses rows (results have shape of columns), axis=1 collapses columns (results have shape of rows). When in doubt, check arr.shape before and after the operation.
:::

### HOW TO RUN THESE EXAMPLES

\`\`\`python
All examples in this guide use import numpy as np. Run them in any Python environment: Python IDLE, Jupyter Notebook, Google Colab, VS Code, or PyCharm. Install NumPy with: pip install numpy
\`\`\``,

11: `# Copying Arrays — Views, Copies & Memory

**In this lesson:** Shallow Copy (View) · Deep Copy · view() · copy() · Memory Sharing · Assignment vs Copy

## Why Does Copying Matter?

Understanding how NumPy handles memory is crucial for writing correct, efficient code. A simple assignment or operation may return a view that shares memory with the original — meaning changes propagate in both directions. Getting this wrong causes silent, hard-to-debug bugs.

![Why Does Copying Matter?](/numpy%20imges/npimg13.png)

## Assignment — NOT a Copy!

The most common mistake beginners make is assuming that b = arr creates a new array. It does not. It creates a new Python variable that points to the same NumPy object and the same memory block.

### ample 1 — Assignment is NOT a Copy

\`\`\`python
import numpy as np

arr = np.array([1, 2, 3, 4, 5])

# Assignment — SAME object, SAME memory
b = arr

print("b is arr:", b is arr)         # True — same object!
print("id(arr):", id(arr))
print("id(b):  ", id(b))             # IDENTICAL ids

# Modifying b modifies arr too!
b[0] = 999
print("\\nAfter b[0] = 999:")
print("arr:", arr)                   # [999  2  3  4  5] — CHANGED!
print("b:  ", b)                     # [999  2  3  4  5]

# Reshaping through assignment
arr2 = np.arange(6)
b2 = arr2
b2.shape = (2, 3)                    # Reshapes arr2 too!
print("\\narr2 shape:", arr2.shape)    # (2, 3) — both changed!
\`\`\`

\`\`\`output

b is arr: True
id(arr): 140234567891234
id(b):   140234567891234    ← SAME id!

After b[0] = 999:
arr: [999   2   3   4   5]  ← CHANGED without touching arr!
b:   [999   2   3   4   5]

arr2 shape: (2, 3)          ← Also changed!
\`\`\`

:::mistake
**⚠  WARNING**
Never use b = arr when you intend to work on a separate copy. This is the #1 most common NumPy bug. Always explicitly use arr.copy() or np.copy(arr) when independence is needed.
:::

## Shallow Copy — view()

A view is a new array object that looks at the same data in memory. The view has its own shape and metadata, but any change to the data in the view is immediately reflected in the original and vice versa.

Views are created by: slicing, arr.view(), transpose, reshape (usually), and many NumPy functions.

### view()

\`\`\`python
b = arr.view()              # Explicit view — new array object, shared data
b = arr[:]                  # Slice creates a view
b = arr[1:4]                # Partial slice — still a view
b = arr.reshape(2, 3)       # Usually a view (if contiguous)
b = arr.T                   # Transpose — always a view

# Check if two arrays share memory:
np.shares_memory(arr, b)    # → True if they share data
b.base is arr               # → True if b is a view of arr
b.base is None              # → True if b owns its data (is a copy)
\`\`\`

### ample 2 — view() and Slices

\`\`\`python
import numpy as np

arr = np.array([[1, 2, 3],
                [4, 5, 6]])

# ── Explicit view ──
v = arr.view()

print("v is arr:", v is arr)          # False — different objects
print("v.base is arr:", v.base is arr) # True  — shares data!
print("shares_memory:", np.shares_memory(arr, v))  # True

# View has its own shape metadata
v.shape = (3, 2)
print("v shape:", v.shape)   # (3, 2)
print("arr shape:", arr.shape) # (2, 3) — unchanged!

# But data is shared — changing value changes both
v[0, 0] = 999
print("\\narr after v[0,0]=999:")
print(arr)                    # [[999, 2, 3],[4, 5, 6]] — CHANGED!

# ── Slices are views ──
arr2 = np.arange(10)
slc  = arr2[2:7]             # Slice = view

print("\\nSlice is view:", np.shares_memory(arr2, slc))   # True
slc[0] = 100
print("arr2 after slc[0]=100:", arr2)
# [ 0  1 100  3  4  5  6  7  8  9] ← position 2 changed!
\`\`\`

\`\`\`output

v is arr: False
v.base is arr: True
shares_memory: True

v shape: (3, 2)
arr shape: (2, 3)   ← shape unchanged, data shared

arr after v[0,0]=999:
[[999   2   3]
 [  4   5   6]]

Slice is view: True
arr2 after slc[0]=100: [  0   1 100   3   4   5   6   7   8   9]
\`\`\`

## Deep Copy — copy()

A deep copy creates a completely new array with its own memory block. No data is shared — changes to the copy never affect the original. This is the safe choice when you need an independent copy.

### copy()

\`\`\`python
b = arr.copy()              # Always creates a full, independent copy
b = np.copy(arr)            # Same as arr.copy()
b = arr.copy(order="C")     # C-contiguous copy
b = arr.copy(order="F")     # Fortran-contiguous copy

# Verify independence:
b.base is None              # → True if b owns its data
np.shares_memory(arr, b)    # → False for true copies
\`\`\`

### ample 3 — copy() Deep Copy

\`\`\`python
import numpy as np

arr = np.array([[10, 20, 30],
                [40, 50, 60]])

# Deep copy — completely independent
c = arr.copy()

print("c is arr:", c is arr)           # False
print("c.base is None:", c.base is None)  # True — owns data
print("shares_memory:", np.shares_memory(arr, c))  # False

# Modifying c does NOT affect arr
c[0, 0] = 999
print("\\nc after c[0,0]=999:")
print(c)
print("arr (unchanged):")
print(arr)

# ── Practical comparison ──
original = np.array([1, 2, 3, 4, 5])

# WRONG — modify via view:
bad_copy = original[:]           # This is a VIEW
bad_copy[0] = 0
print("\\nWrong approach — original damaged:", original)

original = np.array([1, 2, 3, 4, 5])  # Reset
# CORRECT — true copy:
good_copy = original.copy()
good_copy[0] = 0
print("Correct approach — original safe:", original)
\`\`\`

\`\`\`output

c is arr: False
c.base is None: True
shares_memory: False

c after c[0,0]=999:
[[999  20  30]
 [ 40  50  60]]

arr (unchanged):
[[10 20 30]
 [40 50 60]]

Wrong approach — original damaged: [0 2 3 4 5]
Correct approach — original safe:  [1 2 3 4 5]
\`\`\`

## View vs Copy — Complete Comparison

| 👁 view() — Shallow Copy | 📋 copy() — Deep Copy |
| --- | --- |
| New Python object, shared data | New Python object, new data block |
| v.base is arr → True | c.base is None → True |
| np.shares_memory → True | np.shares_memory → False |
| Shape changes do NOT affect original | Shape changes do NOT affect original |
| Data changes DO affect original | Data changes NEVER affect original |
| Memory efficient (no duplication) | Uses extra memory (full copy) |
| Created by: slice, .T, reshape | Created by: .copy(), np.copy() |
| Use when: reading/reshaping only | Use when: independent modification needed |

## Checking Views and Ownership

### ample 4 — Diagnosing View vs Copy

\`\`\`python
import numpy as np

# Complete diagnostic toolkit
arr = np.arange(12).reshape(3, 4)

def check_copy_status(name, candidate, original):
    print(f"--- {name} ---")
    print(f"  is original:         {candidate is original}")
    print(f"  base is original:    {candidate.base is original}")
    print(f"  base is None:        {candidate.base is None}")
    print(f"  shares_memory:       {np.shares_memory(candidate, original)}")
    print(f"  dtype match:         {candidate.dtype == original.dtype}")
    print()

check_copy_status("Assignment (a=arr)", arr[:], arr)
check_copy_status("view()",             arr.view(), arr)
check_copy_status("Slice arr[1:]",      arr[1:], arr)
check_copy_status("Transpose .T",       arr.T, arr)
check_copy_status("copy()",             arr.copy(), arr)
check_copy_status("Fancy index arr[[0]]", arr[[0]], arr)
\`\`\`

\`\`\`output

--- Assignment (a=arr) ---
  is original:       False
  base is original:  True
  shares_memory:     True

--- view() ---
  base is original:  True
  shares_memory:     True

--- Slice arr[1:] ---
  base is original:  True
  shares_memory:     True

--- Transpose .T ---
  base is original:  True
  shares_memory:     True

--- copy() ---
  base is None:      True
  shares_memory:     False  ← Independent!

--- Fancy index arr[[0]] ---
  base is None:      True
  shares_memory:     False  ← Always a copy!
\`\`\`

:::insight
**💡  KEY RULE: Fancy Index = Copy**
Fancy indexing (using integer arrays or lists as indices) ALWAYS returns a copy, never a view. This is different from basic slicing. Keep this in mind when optimizing memory usage.
:::`,

12: `# Random Module — Distributions & Seeds

**In this lesson:** rand() · randn() · randint() · choice() · shuffle() · seed() · Default RNG (new API)

## Introduction to NumPy Random

The np.random module provides tools for random sampling, shuffling, and drawing from statistical distributions. It is essential for simulations, machine learning data generation, statistical testing, and reproducible experiments.

:::insight
**📝  NOTE**
NumPy 1.17+ introduced a new random Generator API (np.random.default_rng()) that is preferred for new code. The legacy API (np.random.seed()) still works but may be replaced in future versions. This guide covers both.
:::

## np.random.rand() — Uniform Distribution [0, 1)

rand() generates random floats uniformly distributed between 0 (inclusive) and 1 (exclusive). Pass the desired shape as separate arguments — NOT as a tuple.

### np.random.rand()

\`\`\`python
np.random.rand(d0, d1, ..., dn)   # Pass dimensions as separate args

np.random.rand()         # Single float
np.random.rand(5)        # 1D array of 5 values
np.random.rand(3, 4)     # 2D array shape (3,4)
np.random.rand(2, 3, 4)  # 3D array shape (2,3,4)
\`\`\`

### ample 5 — np.random.rand()

\`\`\`python
import numpy as np

# Single random float [0, 1)
print("Single float:", np.random.rand())

# 1D array of random floats
arr1d = np.random.rand(6)
print("1D array:", arr1d.round(3))

# 2D matrix of random floats
arr2d = np.random.rand(3, 4)
print("\\n2D matrix (3×4):")
print(arr2d.round(3))

# Scale to any range [a, b]: a + (b-a) * rand()
low, high = 5, 10
scaled = low + (high - low) * np.random.rand(4)
print(f"\\nScaled to [{low},{high}):", scaled.round(2))

# Statistical properties of uniform distribution
big = np.random.rand(100_000)
print(f"\\nMean (expect 0.5): {big.mean():.4f}")
print(f"Std  (expect 0.289): {big.std():.4f}")
\`\`\`

\`\`\`output

Single float: 0.37454012
1D array: [0.951 0.732 0.599 0.156 0.058 0.866]

2D matrix (3×4):
[[0.708 0.021 0.969 0.832]
 [0.212 0.182 0.183 0.304]
 [0.525 0.432 0.291 0.612]]

Scaled to [5,10): [7.32 8.91 5.48 9.12]

Mean (expect 0.5): 0.4999
Std  (expect 0.289): 0.2889
\`\`\`

## np.random.randn() — Standard Normal Distribution

randn() generates samples from the standard normal distribution (mean=0, standard deviation=1), also called the Gaussian distribution or "bell curve". This is the most common distribution in statistics.

![np.random.randn() — Standard Normal Distribution](/numpy%20imges/npimg14.png)

### np.random.randn()

\`\`\`python
np.random.randn(d0, d1, ...)      # Standard normal N(0,1)

# Scale to N(mean, std):
mean + std * np.random.randn(n)   # Custom normal distribution
\`\`\`

### ample 6 — np.random.randn()

\`\`\`python
import numpy as np

# Standard normal samples
samples = np.random.randn(8)
print("Samples N(0,1):", samples.round(3))

# 2D matrix of normal values
matrix = np.random.randn(3, 4)
print("\\nMatrix N(0,1):")
print(matrix.round(3))

# Scale to custom distribution: N(mean=100, std=15)
# (simulating IQ scores)
mean, std = 100, 15
iq_scores = mean + std * np.random.randn(10)
print(f"\\nSimulated IQ scores N({mean},{std}):")
print(iq_scores.round(1))

# Verify with large sample
big = np.random.randn(1_000_000)
print(f"\\nLarge sample — Mean: {big.mean():.4f}  Std: {big.std():.4f}")
# Should be close to 0 and 1

# Difference: rand vs randn
print("\\nrand() — uniform [0,1):", np.random.rand(5).round(3))
print("randn() — normal N(0,1):", np.random.randn(5).round(3))
\`\`\`

\`\`\`output

Samples N(0,1): [-0.234  1.574 -0.463  0.241  1.913 -0.553  0.124 -1.421]

Matrix N(0,1):
[[-0.217  1.033 -0.088  0.342]
 [ 0.712 -1.224  0.891 -0.445]
 [ 1.512  0.003 -2.013  0.773]]

Simulated IQ scores N(100,15):
[113.2  87.4 122.1  95.8 101.3 130.5  88.7  79.2 108.4 115.0]

Large sample — Mean: 0.0003  Std: 1.0001

rand() — uniform [0,1): [0.374 0.951 0.732 0.599 0.156]
randn() — normal N(0,1): [-1.234 0.234 0.891 -0.523 1.102]
\`\`\`

## np.random.randint() — Random Integers

### np.random.randint()

\`\`\`python
np.random.randint(low, high=None, size=None)

low    : Lowest integer (inclusive)
high   : Upper bound integer (EXCLUSIVE) — if None, range is [0, low)
size   : Output shape: int → 1D, tuple → nD
\`\`\`

### ample 7 — np.random.randint()

\`\`\`python
import numpy as np

# Single random integer [0, 10)
print("Single:", np.random.randint(10))

# Single integer [5, 15)
print("Range [5,15):", np.random.randint(5, 15))

# 1D array of 8 integers [1, 7)
dice_rolls = np.random.randint(1, 7, size=8)
print("Dice rolls (1-6):", dice_rolls)

# 2D array (matrix)
scores = np.random.randint(50, 101, size=(4, 3))
print("\\nRandom scores (4 students × 3 subjects):")
print(scores)

# ── Simulation: coin flip ──
# 0=Tails, 1=Heads
flips = np.random.randint(0, 2, size=10_000)
heads = np.sum(flips == 1)
print(f"\\n10,000 flips: {heads} Heads ({heads/100:.1f}%)  ",
      f"{10000-heads} Tails ({(10000-heads)/100:.1f}%)")

# Unique random integers (lottery numbers)
lottery = np.random.choice(np.arange(1, 50), size=6, replace=False)
print("Lottery numbers:", np.sort(lottery))
\`\`\`

\`\`\`output

Single: 7
Range [5,15): 11
Dice rolls (1-6): [3 1 6 4 2 6 5 3]

Random scores (4 students × 3 subjects):
[[ 82  91  78]
 [ 64  73  95]
 [ 88  56  70]
 [ 91  80  83]]

10,000 flips: 4987 Heads (49.9%)   5013 Tails (50.1%)

Lottery numbers: [ 4 13 19 31 37 48]
\`\`\`

## np.random.choice() — Sampling from Arrays

### ample 8 — choice() and shuffle()

\`\`\`python
import numpy as np

population = np.array(["Alice","Bob","Charlie","Dave","Eve","Frank"])

# With replacement (default) — same person can appear twice
sample_wr = np.random.choice(population, size=4)
print("With replacement:", sample_wr)

# Without replacement — unique picks only
sample_nr = np.random.choice(population, size=4, replace=False)
print("Without replacement:", sample_nr)

# Weighted probabilities
items = ["Rare","Uncommon","Common"]
probs = [0.1, 0.3, 0.6]          # Must sum to 1.0
draws = np.random.choice(items, size=20, p=probs)
unique, counts = np.unique(draws, return_counts=True)
print("\\nWeighted draws (n=20):")
for item, count in zip(unique, counts):
    print(f"  {item:10s}: {count:2d} ({count*5:.0f}%)")

# Shuffle in-place
arr = np.arange(1, 11)
print("\\nBefore shuffle:", arr)
np.random.shuffle(arr)
print("After shuffle: ", arr)
\`\`\`

\`\`\`output

With replacement: ["Bob" "Bob" "Eve" "Alice"]
Without replacement: ["Frank" "Alice" "Dave" "Charlie"]

Weighted draws (n=20):
  Common    : 12 (60%)
  Rare      :  2 (10%)
  Uncommon  :  6 (30%)

Before shuffle: [ 1  2  3  4  5  6  7  8  9 10]
After shuffle:  [ 7  3 10  1  5  8  4  9  2  6]
\`\`\`

## Setting Seeds — Reproducibility

A random seed initializes the random number generator to a fixed starting state. Given the same seed, NumPy always generates the same sequence of "random" numbers. This is essential for reproducible experiments, debugging, and sharing results.

![Setting Seeds — Reproducibility](/numpy%20imges/npimg15.png)

### ample 9 — np.random.seed() and default_rng()

\`\`\`python
import numpy as np

# ── Legacy API: np.random.seed() ──
np.random.seed(42)
print("Seed 42, run 1:", np.random.rand(4).round(3))

np.random.seed(42)   # Reset to same seed
print("Seed 42, run 2:", np.random.rand(4).round(3))   # SAME result!

np.random.seed(100)
print("Seed 100:     ", np.random.rand(4).round(3))    # Different

# ── Modern API: np.random.default_rng() — PREFERRED ──
rng = np.random.default_rng(seed=42)
print("\\nNew API, seed 42:", rng.random(4).round(3))

rng2 = np.random.default_rng(seed=42)
print("New API, seed 42:", rng2.random(4).round(3))    # SAME!

# New RNG has cleaner syntax and more distributions
rng3 = np.random.default_rng(seed=0)
print("\\nIntegers 1-10:", rng3.integers(1, 11, size=5))
print("Normal N(5,2):", rng3.normal(5, 2, size=5).round(2))
print("Uniform [3,8):", rng3.uniform(3, 8, size=5).round(2))
\`\`\`

\`\`\`output

Seed 42, run 1: [0.374 0.951 0.732 0.599]
Seed 42, run 2: [0.374 0.951 0.732 0.599]  ← IDENTICAL!
Seed 100:      [0.543 0.278 0.424 0.845]

New API, seed 42: [0.773 0.438 0.858 0.697]
New API, seed 42: [0.773 0.438 0.858 0.697]  ← IDENTICAL!

Integers 1-10: [6 1 4 4 8]
Normal N(5,2): [3.48 5.12 6.73 2.91 4.87]
Uniform [3,8): [6.14 3.89 7.42 5.21 4.03]
\`\`\`

:::insight
**💡 BEST PRACTICE: Use default_rng()**
Always use np.random.default_rng(seed) for new projects — it is thread-safe, faster, and statistically superior to the legacy np.random.seed() global state API.
:::

## Lesson 12 — Random Functions Quick Reference

| Function | Distribution | Range/Shape | Use Case |
| --- | --- | --- | --- |
| np.random.rand(d0,d1) | Uniform | [0, 1) | General randomness |
| np.random.randn(d0,d1) | Normal N(0,1) | (-∞, +∞) | ML weights, simulations |
| np.random.randint(lo,hi,n) | Discrete uniform | [lo, hi) | Dice, IDs, labels |
| np.random.choice(a, n) | From array | User-defined | Sampling, bootstrapping |
| np.random.shuffle(a) | — | In-place | Randomize order |
| np.random.seed(n) | — | — | Legacy reproducibility |
| rng.normal(μ,σ,n) | Normal N(μ,σ) | (-∞, +∞) | Custom normal dist |
| rng.uniform(lo,hi,n) | Uniform | [lo, hi) | Any range uniform |
| rng.integers(lo,hi,n) | Discrete | [lo, hi) | Modern randint |
| rng.binomial(n,p,sz) | Binomial | [0, n] | Coin flips, Bernoulli |
| rng.poisson(λ,sz) | Poisson | [0, ∞) | Event counts |`,

13: `# Data Type Handling — dtypes & Casting

**In this lesson:** NumPy dtype system · Checking dtype · astype() · Upcasting · Downcasting risks · Memory sizes

## NumPy Data Type (dtype) System

Every NumPy array has a single data type (dtype). Unlike Python lists which can hold mixed types, NumPy enforces homogeneous types. This homogeneity is what enables NumPy's blazing performance — the CPU can process elements of identical size in predictable memory locations.

![NumPy Data Type (dtype) System](/numpy%20imges/npimg16.png)

## Checking and Creating with Specific dtypes

### ample 10 — dtype Inspection

\`\`\`python
import numpy as np

# Check dtype of arrays
a = np.array([1, 2, 3])
b = np.array([1.0, 2.0, 3.0])
c = np.array([True, False, True])
d = np.array(["hello", "world"])

print(f"int list    → dtype: {a.dtype}")
print(f"float list  → dtype: {b.dtype}")
print(f"bool list   → dtype: {c.dtype}")
print(f"string list → dtype: {d.dtype}")

# Create with specific dtype
i8  = np.array([1, 2, 3], dtype=np.int8)
f32 = np.array([1.0, 2.0], dtype=np.float32)
u8  = np.array([0, 128, 255], dtype=np.uint8)

print(f"\\nint8  array: dtype={i8.dtype},  itemsize={i8.itemsize} byte")
print(f"float32 arr: dtype={f32.dtype}, itemsize={f32.itemsize} bytes")
print(f"uint8  arr: dtype={u8.dtype},  itemsize={u8.itemsize} byte")

# Memory comparison — dtype affects storage
n = 1_000_000
big_f64 = np.ones(n, dtype=np.float64)
big_f32 = np.ones(n, dtype=np.float32)
big_f16 = np.ones(n, dtype=np.float16)

print(f"\\nfloat64: {big_f64.nbytes:,} bytes")
print(f"float32: {big_f32.nbytes:,} bytes (half the memory!)")
print(f"float16: {big_f16.nbytes:,} bytes (quarter the memory!)")
\`\`\`

\`\`\`output

int list    → dtype: int64
float list  → dtype: float64
bool list   → dtype: bool
string list → dtype: <U5

int8  array: dtype=int8,    itemsize=1 byte
float32 arr: dtype=float32, itemsize=4 bytes
uint8  arr:  dtype=uint8,   itemsize=1 byte

float64: 8,000,000 bytes
float32: 4,000,000 bytes (half the memory!)
float16: 2,000,000 bytes (quarter the memory!)
\`\`\`

## astype() — Converting Data Types

astype() converts an array from one dtype to another. It ALWAYS returns a copy — the original is never modified. This is the standard, safe way to change dtypes.

### astype()

\`\`\`python
new_arr = arr.astype(dtype)
new_arr = arr.astype(np.int32)
new_arr = arr.astype("float64")
new_arr = arr.astype(np.float32, copy=False)  # avoid copy if already correct type

astype() always returns a NEW array (copy)
\`\`\`

### ample 11 — astype() Conversions

\`\`\`python
import numpy as np

# ── Integer to Float ──
ints = np.array([1, 2, 3, 4, 5])
floats = ints.astype(np.float64)
print("int → float64:", floats)
print("dtype:", floats.dtype)

# ── Float to Integer (truncates!) ──
f = np.array([1.7, 2.9, 3.1, -4.8])
i = f.astype(np.int32)
print("\\nfloat → int32 (truncated!):", i)
# Note: truncates toward zero, NOT rounding

# ── Integer to Boolean ──
nums = np.array([0, 1, 5, 0, -3, 0])
bools = nums.astype(bool)
print("int → bool:", bools)
# 0 → False, anything else → True

# ── Boolean to Integer ──
mask = np.array([True, False, True, True, False])
print("bool → int:", mask.astype(np.int32))

# ── String to Float/Int (common data loading scenario) ──
str_nums = np.array(["1.5", "2.3", "3.7", "4.1"])
nums2 = str_nums.astype(np.float64)
print("\\nstring → float64:", nums2)

# ── Precision downgrade for ML (saves GPU memory) ──
model_weights = np.random.randn(1000)
f64 = model_weights               # float64 default
f32 = model_weights.astype(np.float32)
print(f"\\nfloat64 nbytes: {f64.nbytes:,}  dtype: {f64.dtype}")
print(f"float32 nbytes: {f32.nbytes:,}  dtype: {f32.dtype}")
\`\`\`

\`\`\`output

int → float64: [1. 2. 3. 4. 5.]
dtype: float64

float → int32 (truncated!): [ 1  2  3 -4]
  Note: -4.8 → -4 (truncation, not rounding)

int → bool: [False  True  True False  True False]
bool → int: [1 0 1 1 0]

string → float64: [1.5 2.3 3.7 4.1]

float64 nbytes: 8,000  dtype: float64
float32 nbytes: 4,000  dtype: float32
\`\`\`

## Upcasting & Downcasting

When performing operations between arrays of different dtypes, NumPy automatically "upcasts" (promotes) to the larger, more general type to prevent data loss. Downcasting manually may cause silent data corruption.

![Upcasting & Downcasting](/numpy%20imges/npimg17.png)

### ample 12 — Upcasting & Downcasting

\`\`\`python
import numpy as np

# ── Auto-upcasting when mixing types ──
i = np.array([1, 2, 3], dtype=np.int32)
f = np.array([1.5, 2.5, 3.5], dtype=np.float32)

result = i + f
print("int32 + float32 → dtype:", result.dtype)  # float64
print("Result:", result)

# ── Downcasting — overflow danger ──
large = np.array([200, 300, 127, 128], dtype=np.int32)
small = large.astype(np.int8)   # int8 max = 127!
print("\\nDowncast int32 → int8 (OVERFLOW!):")
print("Original:", large)
print("Downcast: ", small)      # 128 wraps to -128!

# ── Float precision loss ──
precise = np.array([3.14159265358979], dtype=np.float64)
half   = precise.astype(np.float16)
print(f"\\nfloat64: {precise[0]}")
print(f"float16: {half[0]}")   # Severely rounded!

# ── Safe downcasting check ──
def safe_downcast(arr, new_dtype):
    info = np.iinfo(new_dtype)  # For int types
    if arr.min() >= info.min and arr.max() <= info.max:
        return arr.astype(new_dtype)
    else:
        raise ValueError(f"Data out of range for {new_dtype}")

data = np.array([10, 50, 100, 127])
safe = safe_downcast(data, np.int8)
print("Safe downcast:", safe)
\`\`\`

\`\`\`output

int32 + float32 → dtype: float64
Result: [2.5 4.5 6.5]

Downcast int32 → int8 (OVERFLOW!):
Original: [200 300 127 128]
Downcast: [ -56  44 127 -128]  ← Silent corruption!

float64: 3.14159265358979
float16: 3.14              ← Precision lost!

Safe downcast: [ 10  50 100 127]
\`\`\`

:::mistake
**⚠  WARNING**
Downcasting (int64→int8, float64→float16) can cause SILENT data corruption through overflow or precision loss. NumPy does NOT raise an error by default — it just silently wraps values. Always check ranges before downcasting.
:::

## Lesson 13 — dtype Quick Reference

| dtype | Size | Range / Precision | Use Case |
| --- | --- | --- | --- |
| bool | 1 byte | True / False | Masks, flags |
| int8 | 1 byte | −128 to 127 | Tiny integers, pixels |
| int16 | 2 bytes | −32,768 to 32,767 | Small integers |
| int32 | 4 bytes | −2.1B to 2.1B | General integers |
| int64 | 8 bytes | −9.2e18 to 9.2e18 | Default int, large IDs |
| uint8 | 1 byte | 0 to 255 | Image pixels (RGB) |
| float16 | 2 bytes | ~3-4 sig. digits | GPU memory saving |
| float32 | 4 bytes | ~7 sig. digits | ML models, PyTorch |
| float64 | 8 bytes | ~15 sig. digits | Default float, science |
| complex128 | 16 bytes | Two float64s | Signal processing, FFT |
| str (object) | varies | Any text | Text data (slow) |`,

14: `# Advanced NumPy Concepts

**In this lesson:** Vectorization · Advanced Broadcasting · Boolean Masking · Fancy Indexing · Conditional Extraction · Combining Masks

## Vectorization — Replacing Loops for Speed

Vectorization is the process of expressing operations on entire arrays instead of writing explicit Python loops. NumPy operations execute in optimized C code, making them 10x–1000x faster than equivalent Python loops.

![Vectorization — Replacing Loops for Speed](/numpy%20imges/npimg18.png)

### ample 13 — Vectorization

\`\`\`python
import numpy as np
import time

n = 1_000_000
data = np.random.rand(n)

# ── Bad: Python for loop ──
start = time.perf_counter()
result_loop = [x**2 + 2*x + 1 for x in data]
t_loop = time.perf_counter() - start

# ── Good: NumPy vectorized ──
start = time.perf_counter()
result_np = data**2 + 2*data + 1
t_np = time.perf_counter() - start

print(f"Loop:  {t_loop:.4f}s")
print(f"NumPy: {t_np:.4f}s")
print(f"NumPy is {t_loop/t_np:.0f}x faster!")

# ── More vectorization examples ──
arr = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

# Apply mathematical functions element-wise (NO loops needed)
print("sqrt:", np.sqrt(arr))
print("log: ", np.log(arr).round(3))
print("sin: ", np.sin(arr).round(3))
print("exp: ", np.exp(arr).round(3))

# Vectorized string operations
names = np.array(["alice", "bob", "charlie"])
print("\\nUpper:", np.char.upper(names))
print("Len:  ", np.char.str_len(names))
\`\`\`

\`\`\`output

Loop:  0.3521s
NumPy: 0.0021s
NumPy is 168x faster!

sqrt: [1.    1.414 1.732 2.    2.236 2.449 2.646 2.828 3.    3.162]
log:  [0.    0.693 1.099 1.386 1.609 1.792 1.946 2.079 2.197 2.303]
sin:  [0.841 0.909 0.141 -0.757 -0.959 -0.279 0.657 0.989 0.412 -0.544]

Upper: ["ALICE" "BOB" "CHARLIE"]
Len:   [5 3 7]
\`\`\`

## Boolean Masking — Filter Like a Pro

Boolean masking creates a boolean array (mask) from a condition, then uses that mask to select, replace, or count elements. It replaces loops with elegant, readable expressions.

![Boolean Masking — Filter Like a Pro](/numpy%20imges/npimg19.png)

### ample 14 — Boolean Masking

\`\`\`python
import numpy as np

scores = np.array([85, 42, 91, 78, 56, 95, 63, 88, 74, 39])

# ── Create masks ──
pass_mask = scores >= 60
fail_mask = scores < 60

print("Scores:", scores)
print("Pass mask:", pass_mask)

# ── Apply mask to extract values ──
passed = scores[pass_mask]
failed = scores[fail_mask]
print("\\nPassed:", passed)
print("Failed:", failed)

# ── Count using mask ──
print(f"\\n{pass_mask.sum()} students passed, {fail_mask.sum()} failed")

# ── Conditional assignment using mask ──
scores_copy = scores.copy()
scores_copy[fail_mask] = 0    # Zero out failing scores
print("Zeroed failures:", scores_copy)

# ── Combining conditions with & (AND), | (OR), ~ (NOT) ──
high_pass = (scores >= 80) & (scores < 90)
excellent = scores >= 90
not_failing = ~fail_mask

print("\\nGrade B (80-89):", scores[high_pass])
print("Grade A (>=90):", scores[excellent])
print("Any grade (not failing):", scores[not_failing])

# ── np.where with mask ──
grades = np.where(scores >= 90, "A",
          np.where(scores >= 80, "B",
          np.where(scores >= 70, "C",
          np.where(scores >= 60, "D", "F"))))
print("\\nGrade letters:", grades)
\`\`\`

\`\`\`output

Scores: [85 42 91 78 56 95 63 88 74 39]
Pass mask: [ True False  True  True False  True  True  True  True False]

Passed: [85 91 78 95 63 88 74]
Failed: [42 56 39]

7 students passed, 3 failed

Zeroed failures: [85  0 91 78  0 95 63 88 74  0]

Grade B (80-89): [85 88]
Grade A (>=90):  [91 95]
Any grade (not failing): [85 91 78 95 63 88 74]

Grade letters: ["B" "F" "A" "C" "F" "A" "D" "B" "C" "F"]
\`\`\`

:::mistake
**⚠  WARNING**
Always use & (bitwise AND) and | (bitwise OR) — NOT "and" and "or" — when combining conditions in NumPy. Python's "and"/"or" operate on the whole array as a single object and will raise an error.
:::

## Mask Arrays — np.ma Module

NumPy's masked array module (np.ma) creates arrays where specific values are "masked" (ignored) in operations. This is useful for datasets with invalid entries, missing values, or out-of-range data.

### ample 15 — Masked Arrays (np.ma)

\`\`\`python
import numpy as np

# Create masked array — mask True = invalid/hidden
data = np.array([10, -999, 30, -999, 50, 60])
mask = data == -999       # Mark sentinel values

masked = np.ma.array(data, mask=mask)
print("Masked array:", masked)
print("Valid data:", masked.compressed())   # Only valid values

# Statistics ignore masked values
print("\\nMean (ignoring masked):", masked.mean())
print("Sum  (ignoring masked):", masked.sum())

# Fill masked positions with a value
filled = masked.filled(fill_value=0)
print("Filled with 0:", filled)

# Real-world: sensor data with outliers
sensor = np.array([22.1, 23.0, 999.9, 21.5, 22.8, -50.0, 23.5])
outlier_mask = (sensor < 0) | (sensor > 100)
clean = np.ma.array(sensor, mask=outlier_mask)
print(f"\\nClean mean temp: {clean.mean():.2f}°C")
print(f"Clean std:       {clean.std():.2f}°C")
\`\`\`

\`\`\`output

Masked array: [10 -- 30 -- 50 60]
Valid data: [10 30 50 60]

Mean (ignoring masked): 37.5
Sum  (ignoring masked): 150

Filled with 0: [ 10   0  30   0  50  60]

Clean mean temp: 22.58°C
Clean std:       0.66°C
\`\`\`

## Fancy Indexing — Power Selections

Fancy indexing uses integer arrays or lists as indices to select non-contiguous elements in arbitrary order. Unlike basic slicing (which gives a view), fancy indexing ALWAYS returns a copy.

Fancy Indexing Concept

FANCY INDEXING vs BASIC SLICING

─────────────────────────────────────────────────────────────

\`\`\`python
  arr = [10, 20, 30, 40, 50, 60, 70, 80]
\`\`\`

Basic slicing:              Fancy indexing:

\`\`\`python
  arr[1:4] → [20, 30, 40]    arr[[1, 3, 6]] → [20, 40, 70]
\`\`\`

Contiguous range            Any arbitrary positions

Returns a VIEW              ALWAYS returns a COPY

O(1) — no data copy         O(k) — copies k elements

2D Fancy indexing:

\`\`\`python
  arr = [[1,2,3],[4,5,6],[7,8,9]]
  arr[[0, 2]] → rows 0 and 2: [[1,2,3],[7,8,9]]
  arr[[0,1],[0,2]] → pairs (0,0) and (1,2): [1, 6]
\`\`\`

### ample 16 — Fancy Indexing

\`\`\`python
import numpy as np

# 1D fancy indexing
arr = np.array([10, 20, 30, 40, 50, 60, 70, 80])

# Select by index list — any order
idx = np.array([1, 5, 3, 7, 0])
print("Fancy select:", arr[idx])    # [20, 60, 40, 80, 10]

# Repeat indices allowed
print("Repeated idx:", arr[[0, 0, 2, 2]])  # [10,10,30,30]

# 2D fancy indexing — select rows
matrix = np.array([[1,2,3],
                   [4,5,6],
                   [7,8,9],
                   [10,11,12]])

# Select rows 0, 2, 3 (skip row 1)
rows = matrix[[0, 2, 3]]
print("\\nSelected rows [0,2,3]:")
print(rows)

# Select specific (row, col) pairs
row_idx = np.array([0, 1, 2])
col_idx = np.array([0, 1, 2])
diagonal = matrix[row_idx, col_idx]   # diagonal elements
print("\\nDiagonal:", diagonal)    # [1, 5, 9]

# Anti-diagonal
anti = matrix[[0,1,2],[2,1,0]]
print("Anti-diagonal:", anti)      # [3, 5, 7]

# np.ix_() — all row/col combinations (outer indexing)
rows_sel = np.array([0, 2])
cols_sel = np.array([0, 2])
submatrix = matrix[np.ix_(rows_sel, cols_sel)]
print("\\n2×2 submatrix (rows 0,2 × cols 0,2):")
print(submatrix)
\`\`\`

\`\`\`output

Fancy select: [20 60 40 80 10]
Repeated idx: [10 10 30 30]

Selected rows [0,2,3]:
[[ 1  2  3]
 [ 7  8  9]
 [10 11 12]]

Diagonal: [1 5 9]
Anti-diagonal: [3 5 7]

2×2 submatrix (rows 0,2 × cols 0,2):
[[1 3]
 [7 9]]
\`\`\`

## Boolean Array Indexing — Conditional Extraction

### ample 17 — Boolean Array Indexing

\`\`\`python
import numpy as np

# 2D dataset: 5 students × 4 subjects
scores = np.array([[85, 92, 78, 90],
                   [45, 65, 72, 55],
                   [91, 88, 95, 82],
                   [60, 40, 55, 70],
                   [78, 83, 80, 88]])

# ── Boolean mask on 2D array ──
above_80 = scores > 80
print("Mask (>80):")
print(above_80.astype(int))

# Extract all scores above 80 (returns 1D array)
high_scores = scores[above_80]
print("\\nAll scores > 80:", high_scores)

# Count per student (axis=1) — how many subjects passed?
pass_per_student = (scores >= 60).sum(axis=1)
print("\\nSubjects passed per student:", pass_per_student)

# Select students who passed ALL subjects
all_pass = (scores >= 60).all(axis=1)
print("Students who passed all subjects:", np.where(all_pass)[0]+1)

# Select students who passed AT LEAST ONE
any_pass = (scores >= 60).any(axis=1)
print("Students who passed at least 1:", np.where(any_pass)[0]+1)

# Combined condition — score between 70 and 90
mid_range = (scores >= 70) & (scores <= 90)
print("\\nScores in 70-90 range:")
print(scores[mid_range])
\`\`\`

\`\`\`output

Mask (>80):
[[1 1 0 1]
 [0 0 0 0]
 [1 1 1 1]
 [0 0 0 0]
 [0 1 1 1]]

All scores > 80: [85 92 90 91 88 95 82 83 80 88]

Subjects passed per student: [4 1 4 2 4]

Students who passed all subjects: [1 3 5]
Students who passed at least 1: [1 2 3 4 5]

Scores in 70-90 range: [85 78 90 72 88 82 70 78 83 80 88]
\`\`\`

## Advanced Indexing — Comprehensive Example

### ample 18 — Advanced Combined Indexing

\`\`\`python
import numpy as np

# ── Combining fancy and boolean indexing ──
data = np.random.randint(0, 100, size=(6, 5))
np.random.seed(7)
data = np.random.randint(10, 99, size=(6, 5))

print("Data matrix (6×5):")
print(data)

# Select specific rows using boolean, then specific cols using fancy
row_mask = data[:, 0] > 50      # Rows where first col > 50
col_idx  = np.array([0, 2, 4])  # Columns 0, 2, 4 only

subset = data[row_mask][:, col_idx]
print("\\nRows with col0>50, columns [0,2,4]:")
print(subset)

# ── Index assignment using fancy/boolean ──
arr = np.arange(1, 11, dtype=float)
print("\\nOriginal:", arr)

# Set specific indices
arr[[1, 3, 5]] = -1
print("After arr[[1,3,5]]=-1:", arr)

# Set by condition
arr[arr > 0] *= 10
print("After multiply positives by 10:", arr)
\`\`\`

\`\`\`output

Data matrix (6×5):
[[38 76 62 83 15]
 [51 23 44 68 91]
 [73 42 88 17 55]
 [28 65 34 72 48]
 [82 51 67 29 73]
 [44 87 23 61 38]]

Rows with col0>50, columns [0,2,4]:
[[51 44 91]
 [73 88 55]
 [82 67 73]]

Original: [ 1.  2.  3.  4.  5.  6.  7.  8.  9. 10.]
After arr[[1,3,5]]=-1: [ 1. -1.  3. -1.  5. -1.  7.  8.  9. 10.]
After multiply positives by 10: [ 10.  -1.  30.  -1.  50.  -1.  70.  80.  90. 100.]
\`\`\`

## Lesson 14 — Advanced Indexing Summary

| Technique | Syntax | Returns | Notes |
| --- | --- | --- | --- |
| Boolean mask | arr[arr > 5] | Values (1D) | Extracts matching elements |
| 2D boolean | arr[mask2d] | Values (1D) | All matching elements flat |
| Fancy index 1D | arr[[1,3,5]] | Array | Always a copy |
| Fancy rows 2D | arr[[0,2]] | Rows | Select non-contiguous rows |
| Fancy pairs | arr[[0,1],[2,0]] | Elements | Select (row,col) pairs |
| np.ix_() | arr[np.ix_([0,2],[1,3])] | Submatrix | Cartesian row×col |
| Boolean assign | arr[arr<0]=0 | In-place | Modify matching elements |
| Fancy assign | arr[[1,3]]=99 | In-place | Modify by index list |
| all() axis | (arr>5).all(axis=1) | Bool 1D | All elements per row |
| any() axis | (arr>5).any(axis=0) | Bool 1D | Any element per col |`,

15: `# Professional & Real-World Topics

**In this lesson:** Linear Algebra · Memory Optimization · Structured Arrays · Missing Data (NaN) · NumPy ↔ Pandas Integration

## Linear Algebra — np.linalg

NumPy's np.linalg module provides comprehensive linear algebra operations backed by BLAS/LAPACK — the same high-performance libraries used in MATLAB and SciPy. These are foundational for machine learning, signal processing, and scientific computing.

### Matrix Multiplication — dot() and matmul()

### dot / matmul

\`\`\`python
np.dot(A, B)           # Dot product / matrix multiplication
A @ B                  # Same — preferred syntax (Python 3.5+)
np.matmul(A, B)        # Same for 2D; handles batches in 3D+

Shape rules:
  (m, k) @ (k, n) → (m, n)    ← inner dim k must match
  (n,)   · (n,)  → scalar     ← 1D dot product
\`\`\`

### ample 19 — Matrix Multiplication

\`\`\`python
import numpy as np

# ── 1D dot product ──
v1 = np.array([1, 2, 3])
v2 = np.array([4, 5, 6])
dot = np.dot(v1, v2)             # 1×4 + 2×5 + 3×6 = 32
print("1D dot product:", dot)

# ── 2D matrix multiplication ──
A = np.array([[1, 2],
              [3, 4],
              [5, 6]])
B = np.array([[7, 8, 9],
              [10, 11, 12]])

print("A shape:", A.shape)   # (3, 2)
print("B shape:", B.shape)   # (2, 3)

C = A @ B                        # (3,2) @ (2,3) → (3,3)
print("A @ B shape:", C.shape)
print(C)

# ── Vectorized batch matmul with matmul ──
# 3D: treat first dim as batch
batch = np.random.randn(5, 3, 2)  # 5 matrices of shape (3,2)
weights = np.random.randn(2, 4)   # weight matrix (2,4)
out = np.matmul(batch, weights)   # (5,3,2) @ (2,4) → (5,3,4)
print("\\nBatch matmul:", out.shape)
\`\`\`

\`\`\`output

1D dot product: 32

A shape: (3, 2)
B shape: (2, 3)
A @ B shape: (3, 3)
[[ 27  30  33]
 [ 61  68  75]
 [ 95 106 117]]

Batch matmul: (5, 3, 4)
\`\`\`

### Determinant, Inverse, Rank, Eigenvalues

### ample 20 — Determinant, Inverse, Rank, Eigenvalues, Solve

\`\`\`python
import numpy as np

# ── Determinant ──
# Measures "how much space" a matrix scales
# det = 0 means matrix is singular (no inverse)
A = np.array([[3, 1],
              [2, 4]])
det = np.linalg.det(A)
print(f"Determinant: {det:.2f}")   # 3×4 - 1×2 = 10

# ── Inverse ──
# A @ A_inv = Identity matrix
A_inv = np.linalg.inv(A)
print("\\nInverse:")
print(A_inv.round(4))

# Verify: A @ A_inv ≈ Identity
identity = A @ A_inv
print("A @ A_inv (should be ~I):")
print(identity.round(10))

# ── Matrix Rank ──
# Number of linearly independent rows/columns
B = np.array([[1, 2, 3],
              [4, 5, 6],
              [7, 8, 9]])
rank = np.linalg.matrix_rank(B)
print(f"\\nRank of B: {rank}")   # 2 (row 3 = row1+row2)

# ── Eigenvalues & Eigenvectors ──
# Av = λv  — core of PCA, spectral analysis
M = np.array([[4, 2],
              [1, 3]])
eigenvalues, eigenvectors = np.linalg.eig(M)
print(f"\\nEigenvalues: {eigenvalues}")
print("Eigenvectors (columns):")
print(eigenvectors.round(4))

# Verify: M @ v = λ × v
for i in range(len(eigenvalues)):
    lam = eigenvalues[i]
    vec = eigenvectors[:, i]
    Mv  = M @ vec
    lv  = lam * vec
    print(f"λ={lam:.1f}: Mv={Mv.round(3)}, λv={lv.round(3)} — match: {np.allclose(Mv, lv)}")

# ── Solve linear system Ax = b ──
A = np.array([[2, 1], [5, 3]])
b = np.array([4, 7])
x = np.linalg.solve(A, b)
print(f"\\nSolution x: {x}")    # Solves 2x+y=4, 5x+3y=7
print("Verify Ax=b:", np.allclose(A @ x, b))

# ── Norms ──
v = np.array([3, 4])
print(f"\\nL2 norm (length): {np.linalg.norm(v)}")    # 5.0
print(f"L1 norm:          {np.linalg.norm(v, ord=1)}")  # 7.0
\`\`\`

\`\`\`output

Determinant: 10.00

Inverse:
[[ 0.4  -0.1]
 [-0.2   0.3]]

A @ A_inv (should be ~I):
[[1. 0.]
 [0. 1.]]

Rank of B: 2

Eigenvalues: [5. 2.]
Eigenvectors (columns):
[[ 0.8944 -0.7071]
 [ 0.4472  0.7071]]

λ=5.0: Mv=[4.472 2.236], λv=[4.472 2.236] — match: True
λ=2.0: Mv=[-1.414 1.414], λv=[-1.414 1.414] — match: True

Solution x: [5. -6.]
Verify Ax=b: True

L2 norm (length): 5.0
L1 norm:          7.0
\`\`\`

## Memory & Performance Optimization

Writing high-performance NumPy code means understanding how arrays are stored in memory, avoiding unnecessary copies, and choosing the right operations.

### Contiguous Arrays — C and Fortran Order

### Memory Layout

\`\`\`text
  MEMORY LAYOUT — C vs Fortran Order
  ─────────────────────────────────────────────────────────────
  arr = [[1, 2, 3],
          [4, 5, 6]]
  C-order (row-major, default):      Fortran-order (col-major):
  Elements stored row by row:        Elements stored col by col:
  Memory: [1, 2, 3, 4, 5, 6]        Memory: [1, 4, 2, 5, 3, 6]
  arr[0] → reads [1,2,3] contiguously → FAST  (cache-friendly)
  arr.T  → columns no longer contiguous → SLOW for row ops
  Strides for (2,3) C-order:
    axis 0: stride = 3 elements × itemsize = 24 bytes
    axis 1: stride = 1 element  × itemsize = 8 bytes
  arr.flags.c_contiguous   → True if C-order
  arr.flags.f_contiguous   → True if Fortran-order
\`\`\`

### ample 21 — Memory Layout and Contiguous Arrays

\`\`\`python
import numpy as np

# Check memory layout
arr = np.arange(12).reshape(3, 4)
print("C-contiguous:", arr.flags["C_CONTIGUOUS"])   # True
print("F-contiguous:", arr.flags["F_CONTIGUOUS"])   # False
print("Strides:", arr.strides)   # (32, 8) for int64

# Transpose is NOT C-contiguous
arr_T = arr.T
print("\\nTranspose C-cont:", arr_T.flags["C_CONTIGUOUS"]) # False!

# Make contiguous copy when needed
arr_T_cont = np.ascontiguousarray(arr_T)
print("After ascontiguousarray:", arr_T_cont.flags["C_CONTIGUOUS"]) # True

# ── Avoid unnecessary copies ──
big = np.random.randn(1000, 1000)

# GOOD — in-place operations save memory
big += 1          # In-place — no copy
big *= 2          # In-place — no copy

# BAD — creates temporary arrays
# big = big + 1   # Creates a copy — wastes memory
# big = big * 2   # Another copy

# ── Choosing correct dtype reduces memory ──
n = 1_000_000
for dt in [np.float16, np.float32, np.float64]:
    a = np.ones(n, dtype=dt)
    print(f"{str(dt.__name__):10s}: {a.nbytes:,} bytes")
\`\`\`

\`\`\`output

C-contiguous: True
F-contiguous: False
Strides: (32, 8)

Transpose C-cont: False
After ascontiguousarray: True

float16   :  2,000,000 bytes
float32   :  4,000,000 bytes
float64   :  8,000,000 bytes
\`\`\`

### np.memmap — Memory-Mapped Files

memmap lets you work with arrays larger than RAM by mapping them to disk. NumPy reads only the portions you access — perfect for huge datasets in scientific computing or ML.

### ample 22 — np.memmap

\`\`\`python
import numpy as np
import os

# ── Create a memory-mapped file ──
filename = "/tmp/large_data.dat"

# Write mode — create a 1GB array on disk
fp = np.memmap(filename, dtype=np.float32,
               mode="w+", shape=(1000, 1000))

# Fill and operate (data stays on disk)
fp[:, :] = np.random.rand(1000, 1000)
fp[0, :] = 99.0   # Modify first row

print("Type:", type(fp))
print("Shape:", fp.shape)
print("dtype:", fp.dtype)
print(f"File size: {os.path.getsize(filename)/1e6:.1f} MB on disk")

# Flush changes to disk
fp.flush()
del fp   # Close the memory map

# ── Read from existing file ──
fp2 = np.memmap(filename, dtype=np.float32,
                mode="r", shape=(1000, 1000))
print("First row mean:", fp2[0, :5])  # Reads only what you need
del fp2
os.remove(filename)
\`\`\`

\`\`\`output

Type: <class "numpy.memmap">
Shape: (1000, 1000)
dtype: float32
File size: 4.0 MB on disk

First row mean: [99. 99. 99. 99. 99.]
\`\`\`

## Structured Arrays — Custom dtypes

Structured arrays let you create arrays where each element is a record with multiple named fields of different types. They are essentially a NumPy-native version of a database table or Pandas DataFrame.

### ample 23 — Structured Arrays

\`\`\`python
import numpy as np

# ── Define a custom dtype (record type) ──
student_dtype = np.dtype([
    ("id",    np.int32),
    ("name",  "U20"),      # Unicode string, max 20 chars
    ("grade", np.float32),
    ("pass_",  np.bool_)
])

# ── Create structured array ──
students = np.array([
    (1, "Alice",   91.5, True),
    (2, "Bob",     74.2, True),
    (3, "Charlie", 55.0, False),
    (4, "Diana",   88.7, True),
    (5, "Eve",     43.1, False),
], dtype=student_dtype)

print("All students:")
print(students)

# ── Access by field name ──
print("\\nAll names:", students["name"])
print("All grades:", students["grade"])

# ── Filter using structured array ──
passed = students[students["pass_"]]
print("\\nPassed students:")
for s in passed:
    print(f"  {s['name']:10s}  Grade: {s['grade']:.1f}")

# ── Sorting structured array ──
sorted_by_grade = np.sort(students, order="grade")[::-1]
print("\\nRanked by grade:")
for i, s in enumerate(sorted_by_grade, 1):
    print(f"  {i}. {s['name']:10s} → {s['grade']:.1f}")

# ── Statistics on fields ──
print(f"\\nAverage grade: {students['grade'].mean():.2f}")
print(f"Pass rate:     {students['pass_'].mean()*100:.1f}%")
\`\`\`

\`\`\`output

All students:
[(1, "Alice",   91.5, True) (2, "Bob",     74.2, True)
 (3, "Charlie", 55. , False)(4, "Diana",   88.7, True)
 (5, "Eve",     43.1, False)]

All names: ["Alice" "Bob" "Charlie" "Diana" "Eve"]
All grades: [91.5 74.2 55.  88.7 43.1]

Passed students:
  Alice       Grade: 91.5
  Bob         Grade: 74.2
  Diana       Grade: 88.7

Ranked by grade:
  1. Alice      → 91.5
  2. Diana      → 88.7
  3. Bob        → 74.2
  4. Charlie    → 55.0
  5. Eve        → 43.1

Average grade: 70.50
Pass rate:     60.0%
\`\`\`

## Handling Missing Data — NaN

NaN (Not a Number) is NumPy's representation of missing or undefined floating-point values. Understanding NaN behavior is critical for any real-world data processing pipeline.

### NaN Behavior

\`\`\`text
  NaN PROPERTIES — Surprising Behaviors
  ─────────────────────────────────────────────────────────────
  np.nan is a float                → type: float
  np.nan != np.nan  → True!        (NaN is not equal to itself)
  np.nan == np.nan  → False        (Use np.isnan() to detect NaN)
  Any arithmetic with NaN → NaN   (1 + NaN = NaN)
  np.sum([1, 2, np.nan]) = nan     ← one NaN contaminates!
  np.nansum([1, 2, np.nan]) = 3.0  ← nan-safe version
  Strategy 1: Detect  → np.isnan(arr)
  Strategy 2: Ignore  → np.nanmean(), np.nanstd(), etc.
  Strategy 3: Replace → arr[np.isnan(arr)] = value
  Strategy 4: Remove  → arr[~np.isnan(arr)]
\`\`\`

### ample 24 — Missing Data with NaN

\`\`\`python
import numpy as np

# ── NaN basics ──
print("np.nan:", np.nan)
print("nan == nan:", np.nan == np.nan)     # FALSE!
print("nan != nan:", np.nan != np.nan)     # TRUE

# ── Create array with NaN ──
data = np.array([1.0, 2.0, np.nan, 4.0, np.nan, 6.0, 7.0])

# ── Detect NaN ──
print("\\nisnan mask:", np.isnan(data))
print("Has NaN:", np.any(np.isnan(data)))
print("Count NaN:", np.sum(np.isnan(data)))

# ── NaN contaminates regular stats ──
print("\\nnp.mean (contaminated):", np.mean(data))   # nan!
print("np.sum  (contaminated):", np.sum(data))    # nan!

# ── NaN-safe functions ──
print("np.nanmean:", np.nanmean(data))
print("np.nansum: ", np.nansum(data))
print("np.nanstd: ", np.nanstd(data).round(3))
print("np.nanmin: ", np.nanmin(data))
print("np.nanmax: ", np.nanmax(data))

# ── Replace NaN with value ──
filled = data.copy()
filled[np.isnan(filled)] = 0              # Replace with 0
print("\\nNaN → 0:", filled)

# Replace with mean of valid values
mean_val = np.nanmean(data)
imputed = data.copy()
imputed[np.isnan(imputed)] = mean_val
print("NaN → mean:", imputed)

# ── Remove NaN entirely ──
clean = data[~np.isnan(data)]
print("NaN removed:", clean)

# ── Finite check (NaN and Inf) ──
mixed = np.array([1.0, np.nan, np.inf, -np.inf, 2.0])
print("\\nisfinite:", np.isfinite(mixed))
print("isinf:   ", np.isinf(mixed))
\`\`\`

\`\`\`output

np.nan: nan
nan == nan: False
nan != nan: True

isnan mask: [False False  True False  True False False]
Has NaN: True
Count NaN: 2

np.mean (contaminated): nan
np.sum  (contaminated): nan

np.nanmean: 4.0
np.nansum:  20.0
np.nanstd:  2.19
np.nanmin:  1.0
np.nanmax:  7.0

NaN → 0:    [1. 2. 0. 4. 0. 6. 7.]
NaN → mean: [1. 2. 4. 4. 4. 6. 7.]

NaN removed: [1. 2. 4. 6. 7.]

isfinite: [ True False False False  True]
isinf:    [False False  True  True False]
\`\`\`

## NumPy ↔ Pandas Integration

NumPy and Pandas are deeply integrated. Pandas DataFrames are built on top of NumPy arrays. Knowing how to convert between them and how to use NumPy operations within Pandas unlocks the best of both worlds.

### ample 25 — NumPy ↔ Pandas

\`\`\`python
import numpy as np
import pandas as pd

# ── NumPy array → Pandas DataFrame ──
arr = np.array([[85, 92, 78],
                [70, 88, 95],
                [60, 75, 82],
                [90, 91, 88]])

df = pd.DataFrame(arr,
    columns=["Math", "Science", "English"],
    index=["Alice","Bob","Charlie","Diana"])

print("DataFrame from NumPy array:")
print(df)

# ── Pandas DataFrame → NumPy array ──
back_to_np = df.to_numpy()
print("\\nBack to NumPy:")
print(back_to_np)
print("dtype:", back_to_np.dtype)

# Alternative: df.values (older style)
vals = df.values
print("Using .values:", vals.shape)

# ── Apply NumPy functions to Pandas ──
# NumPy ufuncs work directly on DataFrames
print("\\nLog of scores:")
print(np.log(df).round(2))

# NumPy aggregations
print("Mean per subject (np.mean on df):")
print(np.mean(df, axis=0))

# ── Create DataFrame from structured NumPy array ──
student_dtype = np.dtype([("name","U10"),("score",np.float32),("pass_",bool)])
structured = np.array([("Alice",91.5,True),("Bob",55.0,False)], dtype=student_dtype)
df2 = pd.DataFrame(structured)
print("\\nFrom structured array:")
print(df2)

# ── Share memory — zero copy ──
series = df["Math"]
np_view = series.to_numpy()          # Usually no copy in modern Pandas
print("\\nMath column as numpy:", np_view)
\`\`\`

\`\`\`output

DataFrame from NumPy array:
         Math  Science  English
Alice      85       92       78
Bob        70       88       95
Charlie    60       75       82
Diana      90       91       88

Back to NumPy:
[[85 92 78]
 [70 88 95]
 [60 75 82]
 [90 91 88]]
dtype: int64

Log of scores:
         Math  Science  English
Alice    4.44     4.52     4.36
Bob      4.25     4.48     4.55
...

Mean per subject: Math=76.25 Science=86.5 English=85.75

From structured array:
    name  score  pass_
0  Alice   91.5   True
1    Bob   55.0  False

Math column as numpy: [85 70 60 90]
\`\`\`

:::insight
**💡  Pandas ↔ NumPy Memory Tip**
When calling df.to_numpy() or df.values, you get a NumPy array that may or may not share memory with the DataFrame. For safety, use .copy() if you plan to modify the NumPy array and don't want to affect the original DataFrame.
:::

## Real-World Mini Project — Data Pipeline

Putting it all together: a complete data pipeline using Lessons 11–15 concepts.

### ample 26 — Complete Data Pipeline (Lessons 11–15)

\`\`\`python
import numpy as np

# ═══ COMPLETE DATA ANALYSIS PIPELINE ═══

# 1. Generate reproducible data (L12 — Random + seed)
rng = np.random.default_rng(seed=42)
raw = rng.normal(loc=70, scale=15, size=(100, 4)).astype(np.float32)  # L13

# 2. Introduce missing data
mask = rng.random((100, 4)) < 0.05   # 5% chance of missing
raw[mask] = np.nan

# 3. Deep copy for safety (L11)
data = raw.copy()

# 4. Handle missing values (L15 — NaN)
col_means = np.nanmean(data, axis=0)
for col in range(data.shape[1]):
    nan_mask = np.isnan(data[:, col])
    data[nan_mask, col] = col_means[col]    # Impute with column mean

# 5. Clip outliers (L9/L14 — masking + vectorization)
data = np.clip(data, 0, 100)

# 6. Normalize to [0, 1] (L6 — broadcasting)
col_min = data.min(axis=0)   # shape (4,)
col_max = data.max(axis=0)   # shape (4,)
normalized = (data - col_min) / (col_max - col_min)   # broadcast!

# 7. Boolean filter — top performers (L14)
mean_score = normalized.mean(axis=1)
top_students = mean_score > np.percentile(mean_score, 75)
top_data = normalized[top_students]

# 8. Linear algebra — correlation matrix (L15)
centered = normalized - normalized.mean(axis=0)
corr = (centered.T @ centered) / (len(centered) - 1)

# 9. Statistics report (L9)
subjects = ["Math","Science","English","History"]
print("=== PIPELINE RESULTS ===")
print(f"Imputed {mask.sum()} missing values")
print(f"Top 25% performers: {top_students.sum()} students")
print("\\nNormalized scores — subject averages:")
for s, m in zip(subjects, normalized.mean(axis=0)):
    print(f"  {s:10s}: {m:.3f}")
print("\\nCorrelation matrix (diagonal=1.0):")
print(np.round(corr, 2))
\`\`\`

\`\`\`output

=== PIPELINE RESULTS ===
Imputed 19 missing values
Top 25% performers: 25 students

Normalized scores — subject averages:
  Math      : 0.502
  Science   : 0.498
  English   : 0.501
  History   : 0.499

Correlation matrix (diagonal=1.0):
[[ 1.   -0.02  0.04 -0.01]
 [-0.02  1.    0.03  0.05]
 [ 0.04  0.03  1.   -0.02]
 [-0.01  0.05 -0.02  1.  ]]
\`\`\`

## Lesson 15 — np.linalg Quick Reference

| Function | Description | Returns |
| --- | --- | --- |
| np.dot(A, B) | Dot product / matrix multiply | Scalar or array |
| A @ B | Matrix multiplication (preferred) | Array |
| np.matmul(A, B) | Matrix multiply (handles 3D+) | Array |
| np.linalg.det(A) | Determinant | Float |
| np.linalg.inv(A) | Matrix inverse | Array (n,n) |
| np.linalg.solve(A, b) | Solve linear system Ax=b | Array (n,) |
| np.linalg.eig(A) | Eigenvalues & eigenvectors | (vals, vecs) |
| np.linalg.svd(A) | Singular value decomposition | (U, S, Vh) |
| np.linalg.norm(v) | Vector/matrix norm | Float |
| np.linalg.matrix_rank(A) | Matrix rank | Int |
| np.trace(A) | Diagonal sum | Float |
| np.linalg.cholesky(A) | Cholesky decomposition | Array |

## nan-safe Functions Reference

| Regular (NaN contaminates) | nan-safe Version | Purpose |
| --- | --- | --- |
| np.sum(a) | np.nansum(a) | Sum ignoring NaN |
| np.mean(a) | np.nanmean(a) | Mean ignoring NaN |
| np.std(a) | np.nanstd(a) | Std ignoring NaN |
| np.var(a) | np.nanvar(a) | Variance ignoring NaN |
| np.min(a) | np.nanmin(a) | Min ignoring NaN |
| np.max(a) | np.nanmax(a) | Max ignoring NaN |
| np.median(a) | np.nanmedian(a) | Median ignoring NaN |
| np.percentile(a,q) | np.nanpercentile(a,q) | Percentile ignoring NaN |
| np.cumsum(a) | np.nancumsum(a) | Cumulative sum ignoring NaN |
| np.argmax(a) | np.nanargmax(a) | Index of max ignoring NaN |
| np.argmin(a) | np.nanargmin(a) | Index of min ignoring NaN |

## Advanced Numpy — Quick Reference Cheat Sheet

*Lessons 11–15*

| L11: Copying Arrays | L12: Random Module |
| --- | --- |
| • a=arr → same object (NOT a copy) • arr.view() → shared data, new obj • arr[1:3] → slice is a view • arr.T → transpose is a view • arr.copy() → full independent copy • np.copy(arr) → same as copy() • shares_memory(a,b) → True=view • b.base is None → True=owns data • Fancy index → ALWAYS a copy | • rand(d0,d1) → uniform [0,1) • randn(d0,d1) → normal N(0,1) • randint(lo,hi,n) → integers • choice(a,n,p=...) → sampling • shuffle(a) → in-place • seed(42) → legacy repro • default_rng(42) → modern API • rng.normal(μ,σ,n) → any normal • rng.integers(lo,hi,n) |
| L13: Data Type Handling | L14: Advanced Concepts |
| • arr.dtype → check type • arr.astype(np.float32) → convert • astype always returns a COPY • int8: -128 to 127 • uint8: 0 to 255 • float16: 3-4 sig digits (GPU) • float32: 7 sig digits (ML) • float64: 15 digits (default) • int+float → upcasts to float • Downcast: risk overflow/loss! | • arr**2+2*arr → vectorized loop • No Python for loops on arrays! • arr[arr>80] → bool mask extract • arr[mask]=0 → assign by mask • (a>5)&(b<10) → combine & \\| ~ • arr[[0,2,5]] → fancy index • arr[np.ix_([0,2],[1,3])] • np.where(c,x,y) → vectorized if • (arr>5).all(axis=1) → per row |
| L15: Professional & Real-World |  |
| • np.dot(A,B) / A @ B • np.linalg.det(A) → determinant • np.linalg.inv(A) → inverse • np.linalg.solve(A,b) → Ax=b • np.linalg.eig(A) → eigenvalues • np.linalg.norm(v) → magnitude • np.linalg.matrix_rank(A) • np.memmap(file, dtype, shape) • ascontiguousarray(arr) | • np.isnan(arr) → detect NaN • np.nanmean/sum/std → ignore NaN • arr[np.isnan(arr)]=val → fill NaN • arr[~np.isnan(arr)] → remove NaN • np.isinf / np.isfinite • pd.DataFrame(arr, columns=[...]) • df.to_numpy() → back to array • df.values → older style • np.dtype([("name","U10"),...]) |

:::tip
**🧠  ADVANCED LEARNER CHECKLIST**
Master sequence: 1) Always copy() before modifying 2) Set seeds for reproducibility 3) Check dtypes before operations 4) Replace loops with vectorization 5) Use nan-safe functions for real data 6) Prefer @ over np.dot for clarity.
:::

:::challenge
**🚀  WHERE TO GO NEXT**
NumPy powers: Pandas, SciPy, Matplotlib, TensorFlow, PyTorch, scikit-learn, OpenCV, and almost every Python data science library. Mastering NumPy at this level makes you immediately productive in all of them.
:::`,

}

export default numpyContent
