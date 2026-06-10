// Pandas — Beginner to Advanced (15 lessons)
// Generated from "Pandas Beginer - advanced material.docx" — content copied as-is.
// Diagrams are ASCII (rendered as text code blocks); no external images.

const pandasContent: Record<number, string> = {
1: `# Introduction to Pandas

**In this lesson:** What is Pandas? · Why use Pandas? · Pandas vs NumPy vs Excel vs SQL · Installation · Importing · Core data structures · Pandas + NumPy relationship

## What is Pandas?

Pandas (Panel Data + Python Data Analysis Library) is the most popular Python library for working with structured, tabular data. Created by Wes McKinney in 2008 while working at AQR Capital Management, Pandas was open-sourced in 2009 and has since become the standard tool for data analysis, manipulation, and exploration in Python.

Think of Pandas as Excel inside Python — but with the full power of programming: loops, functions, machine learning integration, and processing millions of rows in milliseconds.

### VISUAL DIAGRAM: Pandas in the Ecosystem

\`\`\`text
  PANDAS — The Data Analysis Ecosystem
  ─────────────────────────────────────────────────────────────────

  Raw Data Sources:
  CSV  ──┐
  Excel ─┤
  JSON  ─┤── pd.read_*() ──► Pandas DataFrame ──► Analysis
  SQL   ─┤                        │                    │
  URL   ─┘                        │              Visualization
                                  │              (Matplotlib)
                              Operations:        Machine Learning
                              • filter/sort      (scikit-learn)
                              • group/aggregate  Statistics
                              • merge/join       (SciPy)
                              • clean/transform
                              • reshape
                                  │
                              Output:
                              CSV / Excel / JSON / Database / Plot

  Pandas sits at the CENTER of the Python data science stack.
\`\`\`

## Why Pandas? — Key Advantages
- Handles heterogeneous data — each column can have a different type (int, float, str, datetime)
- Labelled axes — rows and columns have meaningful names, not just positions
- Built-in data alignment — operations automatically align on index labels
- Missing data handling — NaN support built into every operation
- Powerful I/O — read/write CSV, Excel, JSON, SQL, Parquet, Feather, HTML
- Groupby engine — split-apply-combine operations on large datasets
- Time series support — date ranges, resampling, rolling windows
- Tight NumPy integration — underlying arrays are NumPy, all operations vectorized

## Pandas vs NumPy vs Excel vs SQL

Choosing the right tool depends on your data and task. Here is a comprehensive comparison:

| Feature | Pandas | NumPy | Excel | SQL |
| --- | --- | --- | --- | --- |
| Data type | Tabular (2D) | N-Dim arrays | Spreadsheet | Relational tables |
| Mixed types | ✅ Yes | ❌ Homogeneous | ✅ Yes | ✅ Yes |
| Row labels | ✅ Named index | ❌ Integer only | ❌ Row numbers | ✅ Primary keys |
| Max rows | 100M+ (RAM) | 100M+ (RAM) | ~1M rows | Billions (disk) |
| Missing data | ✅ Native NaN | Partial support | ✅ Empty cells | ✅ NULL |
| Programming | ✅ Full Python | ✅ Full Python | ❌ Limited VBA | ❌ Query only |
| Speed | Fast (C backend) | Fastest | Slow (large data) | Fast (indexed) |
| Visualization | Via Matplotlib | Via Matplotlib | ✅ Built-in charts | ❌ External tools |
| File I/O | CSV,XLS,JSON,SQL | Limited | CSV,XLS | SQL dumps |
| Best for | Data analysis | Math/science | Quick reports | Large stored data |

## Installing Pandas

Pandas can be installed using pip, conda, or as part of the Anaconda distribution. Installing with pip also installs NumPy and other required dependencies automatically.

### 📦 Installing Pandas

\`\`\`bash
# Method 1: pip (most common)
pip install pandas

# Method 2: Install with common data stack
pip install pandas numpy matplotlib seaborn openpyxl

# Method 3: Upgrade existing installation
pip install --upgrade pandas

# Method 4: conda (Anaconda/Miniconda)
conda install pandas

# Method 5: inside a virtual environment (recommended)
python -m venv myenv
source myenv/bin/activate      # Windows: myenv\\Scripts\\activate
pip install pandas

# Verify installation
python -c "import pandas as pd; print(pd.__version__)"
\`\`\`

\`\`\`output
2.2.2
\`\`\`

:::insight
For reading Excel files, you also need: pip install openpyxl (for .xlsx) or pip install xlrd (for .xls). For SQL databases: pip install sqlalchemy. For Parquet files: pip install pyarrow.
:::

## Importing Pandas

The universal convention is to import pandas as pd. This two-letter alias is used by every textbook, tutorial, documentation, and production codebase in the world.

### 📥 Importing Pandas

\`\`\`python
# Standard import — ALWAYS use this alias
import pandas as pd

# Almost always import NumPy alongside Pandas
import numpy as np

# Verify versions
print("Pandas:", pd.__version__)
print("NumPy: ", np.__version__)

# Quick test: create a tiny DataFrame
df = pd.DataFrame({"A":[1,2,3], "B":[4,5,6]})
print(df)
\`\`\`

\`\`\`output
Pandas: 2.2.2
NumPy:  1.26.4

   A  B
0  1  4
1  2  5
2  3  6
\`\`\`

## Core Data Structures Overview

Pandas has two core data structures. Everything you do in Pandas is built on top of these two objects:

### VISUAL DIAGRAM: Pandas Data Structures

\`\`\`text
  PANDAS CORE DATA STRUCTURES
  ─────────────────────────────────────────────────────────────────

  1. SERIES — 1-Dimensional labelled array
     ┌───────────────┐
     │  Index │ Value│
     │────────┼──────│
     │   0    │  85  │
     │   1    │  92  │
     │   2    │  78  │
     │   3    │  95  │
     └───────────────┘
     Like a single column with row labels.
     pd.Series([85, 92, 78, 95])

  2. DATAFRAME — 2-Dimensional labelled table
     ┌───────────────────────────────────┐
     │        Name    Math  Science  Age  │
     │  Index ──────────────────────────  │
     │    0   Alice     85       92   20  │
     │    1   Bob       78       88   21  │
     │    2   Charlie   91       95   22  │
     └───────────────────────────────────┘
     Like a spreadsheet / database table.
     Each column is a Series. All columns share the same Index.

  Index — The row labels shared by all columns in a DataFrame.
          Can be integers (default), strings, dates, etc.
\`\`\`

## Pandas + NumPy Relationship

Pandas is built ON TOP of NumPy. Every column in a DataFrame is internally a NumPy array. This is why NumPy operations and Pandas operations are compatible and can be mixed freely.

### 📌 Example 1 — Pandas & NumPy Relationship

\`\`\`python
import pandas as pd
import numpy as np

# Pandas Series wraps a NumPy array
s = pd.Series([10, 20, 30, 40, 50])

# Access the underlying NumPy array
print("Underlying NumPy array:", s.values)
print("Type of .values:", type(s.values))

# NumPy functions work directly on Pandas
print("np.mean:", np.mean(s))
print("np.sqrt:", np.sqrt(s).values)

# Create Series from NumPy array
arr = np.array([5, 10, 15, 20])
series_from_np = pd.Series(arr)
print("From NumPy:", series_from_np.values)

# DataFrame column is a NumPy array
df = pd.DataFrame({"score": [85, 92, 78]})
print("Column dtype:", df["score"].dtype)
print("Column values:", df["score"].values)
print("Type:", type(df["score"].values))
\`\`\`

\`\`\`output
Underlying NumPy array: [10 20 30 40 50]
Type of .values: <class "numpy.ndarray">

np.mean: 30.0
np.sqrt: [3.162 4.472 5.477 6.325 7.071]

From NumPy: [ 5 10 15 20]

Column dtype: int64
Column values: [85 92 78]
Type: <class "numpy.ndarray">
\`\`\`

:::tip
PANDAS MENTAL MODEL: Series = NumPy array + index labels. DataFrame = dictionary of Series objects all sharing the same index. Every Pandas operation is ultimately vectorized NumPy under the hood.
:::`,

2: `# Series — The 1D Data Structure

**In this lesson:** Creating a Series · Index & Values · Series Attributes · Accessing Elements · Vectorized Operations · Custom Index

## What is a Pandas Series?

A Series is a one-dimensional labelled array that can hold any data type — integers, floats, strings, booleans, Python objects. Every element has a corresponding label called an index. The Series is the building block for all Pandas data structures.

### VISUAL DIAGRAM: Series Anatomy

\`\`\`text
  SERIES ANATOMY
  ─────────────────────────────────────────────────────────────────
  pd.Series([85, 92, 78, 95, 88], name="Math Scores")

  Index │ Value
  ──────┼───────
    0   │  85   ← index 0, value 85
    1   │  92   ← index 1, value 92
    2   │  78   ← index 2, value 78
    3   │  95   ← index 3, value 95
    4   │  88   ← index 4, value 88
  Name: Math Scores, dtype: int64

  ┌─────────────────────────────────────────────────────────┐
  │  .index  →  RangeIndex(start=0, stop=5, step=1)        │
  │  .values →  array([85, 92, 78, 95, 88])                │
  │  .dtype  →  int64                                       │
  │  .name   →  "Math Scores"                               │
  │  .shape  →  (5,)                                        │
  │  .size   →  5                                           │
  └─────────────────────────────────────────────────────────┘
\`\`\`

## Creating a Series — Four Ways

### From a Python List

### 📌 Example 2 — Series from List

\`\`\`python
import pandas as pd
import numpy as np

# ── Method 1: From a Python list ──
scores = pd.Series([85, 92, 78, 95, 88])
print("From list:")
print(scores)
print()

# With a name
named = pd.Series([85, 92, 78, 95, 88], name="Math Scores")
print("With name:")
print(named)

# With a specific dtype
floats = pd.Series([1, 2, 3, 4], dtype=float)
print("\\nWith dtype=float:")
print(floats)
\`\`\`

\`\`\`output
From list:
0    85
1    92
2    78
3    95
4    88
dtype: int64

With name:
0    85
1    92
2    78
3    95
4    88
Name: Math Scores, dtype: int64

With dtype=float:
0    1.0
1    2.0
2    3.0
3    4.0
dtype: float64
\`\`\`

### From a Dictionary

When you create a Series from a dictionary, the keys become the index labels and the values become the data. This is the most natural way to create a Series with meaningful labels.

### 📌 Example 3 — Series from Dictionary

\`\`\`python
import pandas as pd

# ── Method 2: From a dictionary ──
# Keys become index labels, values become data
city_pop = pd.Series({
    "Mumbai":    20667656,
    "Delhi":     32941000,
    "Bengaluru":  8443675,
    "Hyderabad":  6809970,
    "Chennai":    7088000,
})
print("City populations:")
print(city_pop)
print()

# You can also pass a dict + custom index to filter/reorder
temps = {"Mon":28, "Tue":30, "Wed":27, "Thu":31, "Fri":29}
week  = pd.Series(temps)
print("Weekly temps:")
print(week)
\`\`\`

\`\`\`output
City populations:
Mumbai      20667656
Delhi       32941000
Bengaluru    8443675
Hyderabad    6809970
Chennai      7088000
dtype: int64

Weekly temps:
Mon    28
Tue    30
Wed    27
Thu    31
Fri    29
dtype: int64
\`\`\`

### From a Scalar and NumPy Array

### 📌 Example 4 — Series from Scalar and NumPy

\`\`\`python
import pandas as pd
import numpy as np

# ── Method 3: From a scalar (single value repeated) ──
constant = pd.Series(42, index=["a","b","c","d"])
print("Scalar series:")
print(constant)

# ── Method 4: From a NumPy array ──
arr = np.linspace(0, 1, 5)
from_np = pd.Series(arr, name="Probabilities")
print("\\nFrom NumPy array:")
print(from_np)

# From NumPy random
rng = np.random.default_rng(42)
random_s = pd.Series(rng.integers(50, 100, 6), name="Random Scores")
print("\\nFrom NumPy random:")
print(random_s)
\`\`\`

\`\`\`output
Scalar series:
a    42
b    42
c    42
d    42
dtype: int64

From NumPy array:
0    0.00
1    0.25
2    0.50
3    0.75
4    1.00
Name: Probabilities, dtype: float64

From NumPy random:
0    77
1    92
2    63
3    88
4    71
5    95
Name: Random Scores, dtype: int64
\`\`\`

## Series Attributes — Key Properties

### 📌 Example 5 — Series Attributes

\`\`\`python
import pandas as pd

s = pd.Series([85, 92, 78, 95, 88, 72], name="Exam Scores")

# ── Core Attributes ──
print("dtype:  ", s.dtype)       # Data type of values
print("name:   ", s.name)        # Series name
print("shape:  ", s.shape)       # Tuple (n,)
print("size:   ", s.size)        # Number of elements
print("ndim:   ", s.ndim)        # Number of dimensions (always 1)
print("nbytes: ", s.nbytes)      # Memory in bytes

# ── Index & Values ──
print("\\nindex:  ", s.index)
print("values: ", s.values)

# ── Quick statistics ──
print("\\ncount:  ", s.count())   # Non-null count
print("sum:    ", s.sum())
print("mean:   ", s.mean())
print("std:    ", s.std().round(2))
print("min:    ", s.min())
print("max:    ", s.max())

# ── .describe() — full summary in one call ──
print("\\n.describe():")
print(s.describe())
\`\`\`

\`\`\`output
dtype:   int64
name:    Exam Scores
shape:   (6,)
size:    6
ndim:    1
nbytes:  48

index:   RangeIndex(start=0, stop=6, step=1)
values:  [85 92 78 95 88 72]

count:   6
sum:     510
mean:    85.0
std:     8.28
min:     72
max:     95

.describe():
count     6.000000
mean     85.000000
std       8.276473
min      72.000000
25%      80.250000
50%      86.500000
75%      91.500000
max      95.000000
Name: Exam Scores, dtype: float64
\`\`\`

## Accessing Elements — Indexing a Series

Pandas provides multiple ways to access elements in a Series. Understanding the difference between label-based and integer-based access is crucial to avoid bugs.

### VISUAL DIAGRAM: Label vs Position Indexing

\`\`\`text
  SERIES INDEXING — Label vs Position
  ─────────────────────────────────────────────────────────────────
  s = pd.Series([85,92,78,95], index=["Alice","Bob","Charlie","Diana"])

  Index labels:  "Alice"  "Bob"  "Charlie"  "Diana"
  Position:        0        1       2          3
  Values:          85      92       78         95

  ┌──────────────────────────────────────────────────────────┐
  │  s["Alice"]    → 85    (label-based — safe)             │
  │  s[0]          → 85    (integer position — deprecated!) │
  │  s.loc["Bob"]  → 92    (explicit label-based — BEST)   │
  │  s.iloc[1]     → 92    (explicit position-based — BEST)│
  └──────────────────────────────────────────────────────────┘

  Best practice: ALWAYS use .loc[] or .iloc[] for clarity
\`\`\`

### 📌 Example 6 — Accessing Series Elements

\`\`\`python
import pandas as pd

# Series with string labels
s = pd.Series(
    [85, 92, 78, 95, 88],
    index=["Alice","Bob","Charlie","Diana","Eve"],
    name="Scores"
)

# ── Label-based access ──
print("s[Alice]:", s["Alice"])          # 85
print("s.loc[Bob]:", s.loc["Bob"])       # 92 — preferred

# ── Integer position access ──
print("s.iloc[0]:", s.iloc[0])           # 85 — first element
print("s.iloc[-1]:", s.iloc[-1])         # 88 — last element

# ── Slice with .loc (INCLUSIVE both ends) ──
print("\\ns.loc[Alice:Charlie]:")
print(s.loc["Alice":"Charlie"])

# ── Slice with .iloc (EXCLUSIVE end — like Python) ──
print("s.iloc[0:3]:")
print(s.iloc[0:3])

# ── Select multiple labels ──
print("\\nMultiple labels:")
print(s.loc[["Alice","Diana","Eve"]])

# ── Boolean mask on Series ──
print("\\nScores >= 90:")
print(s[s >= 90])
\`\`\`

\`\`\`output
s[Alice]: 85
s.loc[Bob]: 92
s.iloc[0]: 85
s.iloc[-1]: 88

s.loc[Alice:Charlie]:
Alice      85
Bob        92
Charlie    78
Name: Scores, dtype: int64

s.iloc[0:3]:
Alice    85
Bob      92
Charlie  78
Name: Scores, dtype: int64

Multiple labels:
Alice    85
Diana    95
Eve      88
Name: Scores, dtype: int64

Scores >= 90:
Bob      92
Diana    95
Name: Scores, dtype: int64
\`\`\`

:::mistake
s.loc["Alice":"Charlie"] is INCLUSIVE at both ends (both Alice and Charlie are included). This is different from Python list slicing where the end is exclusive. s.iloc[0:3] follows normal Python rules — exclusive at the end (positions 0, 1, 2).
:::

## Vectorized Operations on Series

Like NumPy arrays, Pandas Series support vectorized operations — applying a function to every element without writing a loop. Operations on two Series automatically align on the index.

### 📌 Example 7 — Vectorized Operations

\`\`\`python
import pandas as pd

math    = pd.Series({"Alice":85,"Bob":72,"Charlie":91,"Diana":88})
science = pd.Series({"Alice":90,"Bob":78,"Charlie":85,"Diana":92})

# ── Arithmetic — vectorized, no loops ──
print("math + 5:")
print(math + 5)

print("\\nmath * 2:")
print(math * 2)

# ── Operations between two Series — auto-align on index ──
total = math + science
print("\\nmath + science (auto-aligned):")
print(total)

avg = (math + science) / 2
print("\\nAverage of math and science:")
print(avg)

# ── Comparison — returns boolean Series ──
print("\\nmath > 85:")
print(math > 85)

# ── Math functions ──
import numpy as np
print("\\nlog(math):")
print(np.log(math).round(3))

# ── String methods via .str ──
names = pd.Series(["alice smith","bob jones","charlie brown"])
print("\\nUpper:", names.str.upper().tolist())
print("Title:", names.str.title().tolist())
print("Length:", names.str.len().tolist())
\`\`\`

\`\`\`output
math + 5:
Alice      90
Bob        77
Charlie    96
Diana      93
dtype: int64

math + science (auto-aligned):
Alice      175
Bob        150
Charlie    176
Diana      180
dtype: int64

Average:
Alice      87.5
Bob        75.0
Charlie    88.0
Diana      90.0
dtype: float64

math > 85:
Alice      False
Bob        False
Charlie     True
Diana       True
dtype: bool

Upper: ["ALICE SMITH", "BOB JONES", "CHARLIE BROWN"]
\`\`\`

:::insight
When you add/subtract/multiply two Series with different index labels, Pandas aligns them automatically. Any label that does not exist in both Series produces NaN (missing value). This is called "automatic alignment" — one of Pandas most powerful features.
:::`,

3: `# DataFrame — The 2D Data Structure

**In this lesson:** Creating a DataFrame · DataFrame Attributes · head/tail/sample · Adding & Removing Columns · Renaming Columns · Column dtypes

## What is a DataFrame?

A DataFrame is a two-dimensional, size-mutable, heterogeneous tabular data structure with labelled axes (rows and columns). Think of it as a spreadsheet, a SQL table, or a dictionary of Series objects that all share the same index.

### VISUAL DIAGRAM: DataFrame Anatomy

\`\`\`text
  DATAFRAME ANATOMY
  ─────────────────────────────────────────────────────────────────

                    COLUMNS
          ┌──────────────────────────────┐
          │   Name    Math  Science  Age  │
  R  ─────┼──────────────────────────────┤
  O    0  │   Alice    85      92    20   │
  W  ─────┼──────────────────────────────┤
  S    1  │   Bob      72      78    21   │
     ─────┼──────────────────────────────┤
  I    2  │   Charlie  91      85    19   │
  N  ─────┼──────────────────────────────┤
  D    3  │   Diana    88      92    22   │
  E  ─────┴──────────────────────────────┘
  X   ▲
       RangeIndex(0,1,2,3)

  • Each column = a pd.Series with the same index
  • df["Math"] returns the Math column as a Series
  • Columns can have DIFFERENT dtypes (Name=str, Math=int)
  • All columns share the SAME index
\`\`\`

## Creating a DataFrame — Four Methods

### Method 1: From a Dictionary of Lists

### 📌 Example 8 — DataFrame from Dictionary

\`\`\`python
import pandas as pd

# Most common way: dict keys → columns, lists → column values
df = pd.DataFrame({
    "Name":    ["Alice","Bob","Charlie","Diana","Eve"],
    "Math":    [85, 72, 91, 88, 76],
    "Science": [92, 78, 85, 92, 80],
    "Age":     [20, 21, 19, 22, 20],
})

print(df)
\`\`\`

\`\`\`output
      Name  Math  Science  Age
0    Alice    85       92   20
1      Bob    72       78   21
2  Charlie    91       85   19
3    Diana    88       92   22
4      Eve    76       80   20
\`\`\`

### Method 2: From a List of Dictionaries

### 📌 Example 9 — DataFrame from List of Dicts

\`\`\`python
import pandas as pd

# Each dict = one row. Keys = column names.
records = [
    {"Name":"Alice",   "Math":85, "Science":92, "Age":20},
    {"Name":"Bob",     "Math":72, "Science":78, "Age":21},
    {"Name":"Charlie", "Math":91, "Science":85, "Age":19},
    {"Name":"Diana",   "Math":88, "Science":92, "Age":22},
]

df2 = pd.DataFrame(records)
print(df2)
\`\`\`

\`\`\`output
      Name  Math  Science  Age
0    Alice    85       92   20
1      Bob    72       78   21
2  Charlie    91       85   19
3    Diana    88       92   22
\`\`\`

### Method 3: From a NumPy Array + Custom Index/Columns

### 📌 Example 10 — DataFrame from NumPy Array

\`\`\`python
import pandas as pd
import numpy as np

# From 2D NumPy array
data = np.array([
    [85, 92, 20],
    [72, 78, 21],
    [91, 85, 19],
    [88, 92, 22],
])

df3 = pd.DataFrame(
    data,
    columns=["Math","Science","Age"],
    index=["Alice","Bob","Charlie","Diana"]
)
print(df3)
\`\`\`

\`\`\`output
         Math  Science  Age
Alice      85       92   20
Bob        72       78   21
Charlie    91       85   19
Diana      88       92   22
\`\`\`

### Method 4: From a Dictionary of Series

### 📌 Example 11 — DataFrame from Series

\`\`\`python
import pandas as pd

# Each Series becomes a column; index is shared
df4 = pd.DataFrame({
    "Math":    pd.Series([85,72,91], index=["Alice","Bob","Charlie"]),
    "Science": pd.Series([92,78,85], index=["Alice","Bob","Charlie"]),
    "Age":     pd.Series([20,21,19], index=["Alice","Bob","Charlie"]),
})
print(df4)

# pd.DataFrame() also accepts:
# • List of tuples
# • CSV string via io.StringIO
# • Clipboard via pd.read_clipboard()
\`\`\`

\`\`\`output
         Math  Science  Age
Alice      85       92   20
Bob        72       78   21
Charlie    91       85   19
\`\`\`

## DataFrame Attributes — Know Your Data

### 📌 Example 12 — DataFrame Attributes

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Name":    ["Alice","Bob","Charlie","Diana","Eve"],
    "Math":    [85, 72, 91, 88, 76],
    "Science": [92.0, 78.0, 85.0, 92.0, 80.0],
    "Pass":    [True, True, True, True, False],
    "Grade":   ["A","C","A","B","C"],
})

# ── Shape and size ──
print("shape:  ", df.shape)       # (5, 5) — rows, columns
print("size:   ", df.size)        # 25 — total elements
print("ndim:   ", df.ndim)        # 2

# ── Columns and index ──
print("columns:", df.columns.tolist())
print("index:  ", df.index.tolist())

# ── Data types of each column ──
print("\\ndtypes:")
print(df.dtypes)

# ── .info() — most useful quick overview ──
print("\\n.info():")
df.info()

# ── .describe() — statistics of numeric columns ──
print("\\n.describe():")
print(df.describe())
\`\`\`

\`\`\`output
shape:   (5, 5)
size:    25
ndim:    2
columns: ["Name","Math","Science","Pass","Grade"]
index:   [0, 1, 2, 3, 4]

dtypes:
Name        object
Math         int64
Science    float64
Pass          bool
Grade       object
dtype: object

.info():
RangeIndex: 5 entries, 0 to 4
Data columns (total 5 columns):
 #   Column   Non-Null Count  Dtype
 0   Name     5 non-null      object
 1   Math     5 non-null      int64
 2   Science  5 non-null      float64
 3   Pass     5 non-null      bool
 4   Grade    5 non-null      object
dtypes: bool(1), float64(1), int64(1), object(2)
memory usage: 341.0+ bytes

.describe():
             Math    Science
count    5.000000   5.000000
mean    82.400000  85.400000
std      7.635444   6.427064
min     72.000000  78.000000
25%     76.000000  80.000000
50%     85.000000  85.000000
75%     88.000000  92.000000
max     91.000000  92.000000
\`\`\`

:::insight
.info() is your first call when you receive a new dataset. It shows column names, data types, non-null counts, and memory usage — everything you need to understand what you are working with.
:::

## Viewing Data — head(), tail(), sample()

### SYNTAX — Viewing methods

\`\`\`python
df.head(n=5)      # First n rows (default 5)
df.tail(n=5)      # Last n rows (default 5)
df.sample(n=1)    # n random rows
df.sample(frac=0.3) # Fraction of rows (30%)
df.sample(frac=1)   # All rows shuffled
\`\`\`

### 📌 Example 13 — head(), tail(), sample()

\`\`\`python
import pandas as pd
import numpy as np

# Create a larger dataset
rng = np.random.default_rng(42)
df = pd.DataFrame({
    "ID":    range(1, 11),
    "Score": rng.integers(50, 100, 10),
    "Grade": rng.choice(["A","B","C","D"], 10),
})

print("df.head(3):")
print(df.head(3))

print("\\ndf.tail(3):")
print(df.tail(3))

print("\\ndf.sample(3, random_state=1):")
print(df.sample(3, random_state=1))
\`\`\`

\`\`\`output
df.head(3):
   ID  Score Grade
0   1     77     B
1   2     92     A
2   3     63     C

df.tail(3):
    ID  Score Grade
7    8     84     A
8    9     71     C
9   10     95     B

df.sample(3, random_state=1):
   ID  Score Grade
5   6     58     D
2   3     63     C
8   9     71     C
\`\`\`

## Adding & Removing Columns

### Adding Columns

### 📌 Example 14 — Adding Columns

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Name":    ["Alice","Bob","Charlie","Diana"],
    "Math":    [85, 72, 91, 88],
    "Science": [92, 78, 85, 92],
})

# ── Add column via assignment ──
df["Average"] = (df["Math"] + df["Science"]) / 2
print("After adding Average column:")
print(df)

# ── Add constant column ──
df["Year"] = 2024

# ── Add conditional column ──
df["Pass"] = df["Average"] >= 80

# ── Add with pd.Series ──
df["Rank"] = pd.Series([2, 4, 1, 3])   # Aligns on index

print("\\nAll new columns:")
print(df)
\`\`\`

\`\`\`output
After adding Average column:
      Name  Math  Science  Average
0    Alice    85       92     88.5
1      Bob    72       78     75.0
2  Charlie    91       85     88.0
3    Diana    88       92     90.0

All new columns:
      Name  Math  Science  Average  Year   Pass  Rank
0    Alice    85       92     88.5  2024   True     2
1      Bob    72       78     75.0  2024  False     4
2  Charlie    91       85     88.0  2024   True     1
3    Diana    88       92     90.0  2024   True     3
\`\`\`

### Removing Columns and Rows — drop()

### SYNTAX — drop()

\`\`\`python
df.drop("col_name", axis=1)              # Drop one column
df.drop(["col1","col2"], axis=1)         # Drop multiple columns
df.drop(0, axis=0)                       # Drop row by label
df.drop([0, 2], axis=0)                  # Drop multiple rows

# inplace=True modifies the original (default is False — returns copy)
df.drop("col", axis=1, inplace=True)

# axis=1 means columns. axis=0 means rows. OR use:
df.drop(columns=["col1","col2"])         # Cleaner syntax
df.drop(index=[0, 1])                    # Cleaner for rows
\`\`\`

### 📌 Example 15 — drop()

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Name":    ["Alice","Bob","Charlie","Diana"],
    "Math":    [85, 72, 91, 88],
    "Science": [92, 78, 85, 92],
    "Age":     [20, 21, 19, 22],
    "Temp":    [0, 0, 0, 0],       # Placeholder to remove
})

# Drop one column
df1 = df.drop("Temp", axis=1)
print("After dropping Temp:")
print(df1)

# Drop multiple columns
df2 = df.drop(columns=["Temp","Age"])
print("\\nAfter dropping Temp and Age:")
print(df2)

# Drop rows by index label
df3 = df.drop(index=[1, 3])   # Remove Bob and Diana
print("\\nAfter dropping rows 1 and 3:")
print(df3)

# inplace — modify original
df.drop("Temp", axis=1, inplace=True)
print("\\ndf after inplace drop Temp:")
print(df.columns.tolist())
\`\`\`

\`\`\`output
After dropping Temp:
      Name  Math  Science  Age
0    Alice    85       92   20
1      Bob    72       78   21
2  Charlie    91       85   19
3    Diana    88       92   22

After dropping Temp and Age:
      Name  Math  Science
0    Alice    85       92
1      Bob    72       78
2  Charlie    91       85
3    Diana    88       92

After dropping rows 1 and 3:
      Name  Math  Science  Age  Temp
0    Alice    85       92   20     0
2  Charlie    91       85   19     0

df after inplace drop Temp:
["Name", "Math", "Science", "Age"]
\`\`\`

## Renaming Columns — rename()

### SYNTAX — rename()

\`\`\`python
df.rename(columns={"old":"new"})                # Rename one column
df.rename(columns={"old1":"new1","old2":"new2"}) # Rename multiple
df.rename(columns=str.upper)                    # Apply function to all names
df.rename(index={0:"row_a"})                    # Rename row index labels

df.columns = ["col1","col2","col3"]             # Replace all column names at once
\`\`\`

### 📌 Example 16 — rename()

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Name":    ["Alice","Bob","Charlie"],
    "math_sc": [85, 72, 91],
    "sci_sc":  [92, 78, 85],
    "yrs":     [20, 21, 19],
})
print("Before rename:")
print(df.columns.tolist())

# ── Rename specific columns ──
df = df.rename(columns={
    "math_sc": "Math Score",
    "sci_sc":  "Science Score",
    "yrs":     "Age",
})
print("After rename:")
print(df)

# ── Apply function to all column names ──
df_upper = df.rename(columns=str.upper)
print("\\nAll uppercase:")
print(df_upper.columns.tolist())

# ── Replace ALL column names at once ──
df_clean = df.copy()
df_clean.columns = ["Name","Math","Science","Age"]
print("\\nReplaced all names:")
print(df_clean.columns.tolist())
\`\`\`

\`\`\`output
Before rename: ["Name", "math_sc", "sci_sc", "yrs"]

After rename:
      Name  Math Score  Science Score  Age
0    Alice          85            92   20
1      Bob          72            78   21
2  Charlie          91            85   19

All uppercase: ["NAME", "MATH SCORE", "SCIENCE SCORE", "AGE"]

Replaced all names: ["Name", "Math", "Science", "Age"]
\`\`\``,

4: `# Reading & Writing Data

**In this lesson:** pd.read_csv() · pd.read_excel() · pd.read_json() · pd.read_sql() · Writing files · URLs · Encoding

## The I/O Workflow

### VISUAL DIAGRAM: Pandas I/O Overview

\`\`\`text
  PANDAS I/O — Reading and Writing Overview
  ─────────────────────────────────────────────────────────────────

  DATA SOURCES              PANDAS           OUTPUT FORMATS

  CSV file   ─────────────┐                 ┌─── CSV file
  Excel file ─────────────┤                 ├─── Excel file
  JSON file  ─────────────┤  pd.read_*()   ├─── JSON file
  SQL DB     ─────────────┤ ──────────────► │    DataFrame
  Web URL    ─────────────┤ ◄────────────── ├─── SQL table
  Clipboard  ─────────────┤  df.to_*()      ├─── Parquet
  Parquet    ─────────────┘                 └─── HTML table

  Read functions:  pd.read_csv()  pd.read_excel()  pd.read_json()
                   pd.read_sql()  pd.read_html()   pd.read_parquet()
                   pd.read_clipboard()  pd.read_feather()

  Write methods:   df.to_csv()  df.to_excel()  df.to_json()
                   df.to_sql()  df.to_parquet()  df.to_html()
\`\`\`

## pd.read_csv() — The Most Used Function

read_csv() is the most important Pandas function for data loading. It reads comma-separated values files (and many delimiter-separated files) into a DataFrame. Understanding its parameters will save you hours of manual data cleaning.

### SYNTAX — pd.read_csv()

\`\`\`python
pd.read_csv(filepath_or_buffer,
    sep=",",           # Delimiter. sep="\\t" for TSV, sep=";" for European CSV
    header=0,          # Row number to use as column names. None = no header
    index_col=None,    # Column to use as row index
    usecols=None,      # List of columns to load (skip the rest)
    nrows=None,        # Number of rows to read (useful for large files)
    skiprows=None,     # Row numbers to skip at the start
    dtype=None,        # Dict of column: dtype to force specific types
    na_values=None,    # Additional strings to treat as NaN
    keep_default_na=True,  # Whether to use default NaN values
    encoding="utf-8",  # File encoding
    parse_dates=False, # Columns to parse as datetime
    thousands=None,    # Thousands separator (e.g., ",")
    decimal=".",       # Decimal separator
)
\`\`\`

### 📌 Example 17 — pd.read_csv() Parameters

\`\`\`python
import pandas as pd

# ── Basic read ──
df = pd.read_csv("students.csv")
print(df.head())

# ── Read with specific separator (tab-separated) ──
df_tsv = pd.read_csv("data.tsv", sep="\\t")

# ── Read only specific columns ──
df_cols = pd.read_csv("students.csv", usecols=["Name","Math","Science"])
print("\\nOnly 3 columns:", df_cols.columns.tolist())

# ── Read first 100 rows only (for large files) ──
df_100 = pd.read_csv("students.csv", nrows=100)

# ── Use a column as the row index ──
df_idx = pd.read_csv("students.csv", index_col="Name")
print("\\nWith Name as index:")
print(df_idx.head(3))

# ── Force specific dtypes ──
df_typed = pd.read_csv("students.csv", dtype={
    "Math": float,
    "Age":  "int32",
})

# ── Treat custom strings as NaN ──
df_nan = pd.read_csv("students.csv",
    na_values=["N/A","n/a","--","missing","MISSING","?"])

# ── Read European CSV (semicolon separator, comma decimal) ──
df_eu = pd.read_csv("data_eu.csv", sep=";", decimal=",")

# ── Skip the first 2 rows ──
df_skip = pd.read_csv("students.csv", skiprows=2)

# ── File has no header row ──
df_no_hdr = pd.read_csv("students.csv",
    header=None, names=["Name","Math","Science","Age"])
\`\`\`

:::insight
For very large CSV files (>1GB), use chunksize parameter: for chunk in pd.read_csv("big.csv", chunksize=10000): process(chunk). This reads the file in batches and avoids memory overflow.
:::

### Creating a Sample CSV to Practise With

### 📌 Example 18 — Creating and Reading Sample CSV

\`\`\`python
import pandas as pd
import io

# Simulate a CSV string (you can write this to a file too)
csv_content = """Name,Math,Science,English,Age,Grade
Alice,85,92,88,20,A
Bob,72,78,75,21,C
Charlie,91,85,90,19,A
Diana,88,92,84,22,B
Eve,76,80,79,20,B
Frank,58,65,70,23,D
"""

# Read from string (simulates reading from a file)
df = pd.read_csv(io.StringIO(csv_content))
print("Loaded DataFrame:")
print(df)

print("\\nShape:", df.shape)
print("Dtypes:")
print(df.dtypes)
\`\`\`

\`\`\`output
Loaded DataFrame:
      Name  Math  Science  English  Age Grade
0    Alice    85       92       88   20     A
1      Bob    72       78       75   21     C
2  Charlie    91       85       90   19     A
3    Diana    88       92       84   22     B
4      Eve    76       80       79   20     B
5    Frank    58       65       70   23     D

Shape: (6, 6)
Dtypes:
Name       object
Math        int64
Science     int64
English     int64
Age         int64
Grade      object
\`\`\`

## pd.read_excel() — Excel Files

### SYNTAX — pd.read_excel()

\`\`\`python
pd.read_excel(io,
    sheet_name=0,      # Sheet name (str), index (int), or list
    header=0,          # Row number for column names
    index_col=None,
    usecols=None,      # Column letters: "A:C" or "A,C,E"
    skiprows=None,
    nrows=None,
    dtype=None,
)
\`\`\`

### 📌 Example 19 — pd.read_excel()

\`\`\`python
import pandas as pd

# ── Read first sheet (default) ──
df = pd.read_excel("students.xlsx")

# ── Read specific sheet by name ──
df_sheet = pd.read_excel("students.xlsx", sheet_name="Grade10")

# ── Read by sheet index (0-based) ──
df_idx = pd.read_excel("students.xlsx", sheet_name=1)

# ── Read ALL sheets → returns a dict of DataFrames ──
all_sheets = pd.read_excel("students.xlsx", sheet_name=None)
print("Sheet names:", list(all_sheets.keys()))

# ── Skip top 3 rows (report headers, logos, etc.) ──
df_skip = pd.read_excel("report.xlsx", skiprows=3)

# ── Select specific columns (Excel notation) ──
df_cols = pd.read_excel("students.xlsx", usecols="A,C,E")
\`\`\`

## pd.read_json() and pd.read_sql()

### 📌 Example 20 — read_json(), read_sql(), URLs

\`\`\`bash
import pandas as pd

# ── Read JSON ──
df_json = pd.read_json("students.json")

# From JSON string
import io
json_str = """[
    {"Name":"Alice","Math":85,"Age":20},
    {"Name":"Bob","Math":72,"Age":21},
    {"Name":"Charlie","Math":91,"Age":19}
]"""
df_j = pd.read_json(io.StringIO(json_str))
print("From JSON string:")
print(df_j)

# ── Read from SQL database ──
# Requires: pip install sqlalchemy
from sqlalchemy import create_engine

# Connect to SQLite database (or PostgreSQL, MySQL, etc.)
# engine = create_engine("sqlite:///school.db")
# df_sql = pd.read_sql("SELECT * FROM students", engine)
# df_sql = pd.read_sql("SELECT * FROM students WHERE Math > 80", engine)

# ── Read from URL (online CSV) ──
url = "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv"
# df_url = pd.read_csv(url)    # Works exactly like a file!
print("URL reading uses exact same syntax as file reading.")
\`\`\`

\`\`\`output
From JSON string:
      Name  Math  Age
0    Alice    85   20
1      Bob    72   21
2  Charlie    91   19

URL reading uses exact same syntax as file reading.
\`\`\`

## Writing Data — df.to_*()

### SYNTAX — to_csv / to_excel / to_json

\`\`\`python
df.to_csv("output.csv", index=False)       # index=False skips row numbers
df.to_csv("output.csv", sep=";")           # Custom separator
df.to_csv("output.csv.gz", compression="gzip")  # Compressed

df.to_excel("output.xlsx", sheet_name="Data", index=False)

df.to_json("output.json")
df.to_json("output.json", orient="records")  # List of row dicts
df.to_json("output.json", orient="index")    # Dict keyed by index
\`\`\`

### 📌 Example 21 — Writing Data

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Name":    ["Alice","Bob","Charlie","Diana"],
    "Math":    [85, 72, 91, 88],
    "Science": [92, 78, 85, 92],
})

# ── Write to CSV ──
df.to_csv("students_output.csv", index=False)
print("CSV saved! Preview:")

# Read it back to verify
check = pd.read_csv("students_output.csv")
print(check)

# ── Write to JSON ──
df.to_json("students.json", orient="records", indent=2)
print("\\nJSON saved!")

# ── Write to Excel (requires openpyxl) ──
# df.to_excel("students.xlsx", sheet_name="Results", index=False)

# ── Write multiple sheets to one Excel file ──
# with pd.ExcelWriter("report.xlsx") as writer:
#     df.to_excel(writer, sheet_name="Math Results", index=False)
#     df.to_excel(writer, sheet_name="Summary", index=False)
\`\`\`

\`\`\`output
CSV saved! Preview:
      Name  Math  Science
0    Alice    85       92
1      Bob    72       78
2  Charlie    91       85
3    Diana    88       92

JSON saved!
\`\`\`

## Handling Encoding Issues

Character encoding is a common source of errors when reading files with non-English characters (Hindi, Arabic, French accents, etc.). Always specify the encoding explicitly.

### 📌 Example 22 — Encoding Handling

\`\`\`bash
import pandas as pd

# ── Common encodings ──
# UTF-8:    International standard (recommended)
# UTF-16:   Windows international files
# latin-1:  Western European (also called ISO-8859-1)
# cp1252:   Windows Western European (common in Excel exports)

# Read a file with UTF-8 encoding (default)
df = pd.read_csv("data.csv", encoding="utf-8")

# If you get UnicodeDecodeError, try these:
df = pd.read_csv("data.csv", encoding="latin-1")
df = pd.read_csv("data.csv", encoding="cp1252")
df = pd.read_csv("data.csv", encoding="utf-16")

# ── Auto-detect encoding (requires chardet library) ──
# pip install chardet
import chardet
with open("data.csv","rb") as f:
    enc = chardet.detect(f.read())["encoding"]
print("Detected encoding:", enc)
df = pd.read_csv("data.csv", encoding=enc)

# ── Write with UTF-8 BOM (for Excel compatibility) ──
# Excel opens UTF-8 files correctly when BOM is present
df.to_csv("output.csv", encoding="utf-8-sig", index=False)
\`\`\`

:::insight
**Encoding Best Practice**
When in doubt with encoding, try encoding="utf-8" first, then "latin-1", then "cp1252". For saving files that will be opened in Excel on Windows, always use encoding="utf-8-sig" to include the BOM (Byte Order Mark) that Excel needs to detect UTF-8 correctly.
:::

## Lesson 4 — I/O Function Reference

| Function | Reads From | Key Parameters | Package Needed |
| --- | --- | --- | --- |
| pd.read_csv() | CSV / TSV / text | sep, usecols, nrows, dtype | (built-in) |
| pd.read_excel() | Excel .xlsx / .xls | sheet_name, skiprows | openpyxl / xlrd |
| pd.read_json() | JSON files/strings | orient, lines | (built-in) |
| pd.read_sql() | SQL databases | sql query, con (engine) | sqlalchemy |
| pd.read_html() | HTML tables on web | URL, match, index_col | lxml |
| pd.read_parquet() | Parquet columnar files | columns, filters | pyarrow / fastparquet |
| pd.read_clipboard() | System clipboard | header, sep | (built-in) |
| df.to_csv() | → CSV file | index=False, sep, encoding | (built-in) |
| df.to_excel() | → Excel file | sheet_name, index=False | openpyxl |
| df.to_json() | → JSON file | orient, indent | (built-in) |
| df.to_sql() | → SQL table | name, con, if_exists | sqlalchemy |`,

5: `# Basic Selection & Filtering

**In this lesson:** Column selection · loc[] label-based · iloc[] position-based · Boolean filtering · query() · isin() & between() · SettingWithCopyWarning

## Why Selection Matters

Real datasets have hundreds of columns and millions of rows. Efficient selection and filtering is how you zoom in on exactly the data you need. Pandas provides multiple selection mechanisms, each with a specific purpose.

### VISUAL DIAGRAM: Selection Toolkit Overview

\`\`\`text
  SELECTION TOOLKIT OVERVIEW
  ─────────────────────────────────────────────────────────────────

  df["col"]           → Select one column → returns Series
  df[["a","b","c"]]   → Select multiple columns → returns DataFrame

  df.loc[row, col]    → SELECT BY LABEL (names)
                        Labels are inclusive on both ends

  df.iloc[row, col]   → SELECT BY POSITION (integers)
                        Positions are exclusive at end (like Python)

  df[df["col"] > 5]   → BOOLEAN FILTER
                        Returns rows where condition is True

  df.query("col > 5") → QUERY STRING method (cleaner syntax)

  df["col"].isin([])  → IS-IN filter (membership test)
  df["col"].between() → BETWEEN filter (range test)
\`\`\`

## Column Selection

### 📌 Example 23 — Column Selection

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Name":    ["Alice","Bob","Charlie","Diana","Eve"],
    "Math":    [85, 72, 91, 88, 76],
    "Science": [92, 78, 85, 92, 80],
    "English": [88, 75, 90, 84, 79],
    "Age":     [20, 21, 19, 22, 20],
    "Grade":   ["A","C","A","B","B"],
})

# ── Select ONE column → returns Series ──
math_col = df["Math"]
print("Type:", type(math_col))    # <class "pandas.core.series.Series">
print(math_col)

# ── Select MULTIPLE columns → returns DataFrame ──
scores = df[["Name","Math","Science"]]
print("\\nType:", type(scores))    # <class "pandas.core.frame.DataFrame">
print(scores)

# ── Attribute access (only for simple column names) ──
print("\\ndf.Math:")
print(df.Math)      # Same as df["Math"]

# ── Reorder columns ──
reordered = df[["Grade","Name","Age","Math","Science","English"]]
print("\\nReordered columns:")
print(reordered.head(3))
\`\`\`

\`\`\`output
Type: <class "pandas.core.series.Series">
0    85
1    72
2    91
3    88
4    76
Name: Math, dtype: int64

Type: <class "pandas.core.frame.DataFrame">
      Name  Math  Science
0    Alice    85       92
1      Bob    72       78
2  Charlie    91       85
3    Diana    88       92
4      Eve    76       80
\`\`\`

:::mistake
NEVER use df.column_name for column access in production code. It fails when: (1) column name has spaces or special characters, (2) column name is the same as a DataFrame method (like "shape", "count"), (3) column does not exist. Always use df["column_name"].
:::

## loc[] — Label-Based Selection

.loc[] selects by label — row index labels and column names. Both ends of a slice are INCLUSIVE when using .loc[].

### SYNTAX — df.loc[]

\`\`\`python
df.loc[row_label]                    # Single row
df.loc[row_label, col_label]         # Single cell
df.loc[start:end]                    # Row slice (INCLUSIVE both ends)
df.loc[:, "col"]                     # All rows, one column
df.loc[:, "col1":"col3"]             # All rows, column range
df.loc[[r1,r2], ["col1","col2"]]    # Specific rows and columns
df.loc[boolean_mask]                 # Filter rows by condition
df.loc[boolean_mask, ["col1","col2"]] # Filter rows + select columns
\`\`\`

### 📌 Example 24 — df.loc[]

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Name":    ["Alice","Bob","Charlie","Diana","Eve"],
    "Math":    [85, 72, 91, 88, 76],
    "Science": [92, 78, 85, 92, 80],
    "English": [88, 75, 90, 84, 79],
    "Age":     [20, 21, 19, 22, 20],
})

# ── Select single row (returns Series) ──
print("Row 0:")
print(df.loc[0])

# ── Select single cell ──
print("\\ndf.loc[0, Name]:", df.loc[0, "Name"])
print("df.loc[2, Math]:", df.loc[2, "Math"])

# ── Row slice (BOTH ENDS INCLUSIVE) ──
print("\\nRows 1 to 3 (inclusive):")
print(df.loc[1:3])

# ── Select specific rows and columns ──
print("\\nRows 0,2,4 — Name and Math:")
print(df.loc[[0,2,4], ["Name","Math"]])

# ── All rows, specific columns ──
print("\\nAll rows, Math to English:")
print(df.loc[:, "Math":"English"])

# ── Condition + column selection ──
print("\\nHigh scorers (Math>80) — Name and Math:")
print(df.loc[df["Math"] > 80, ["Name","Math"]])
\`\`\`

\`\`\`output
Row 0:
Name       Alice
Math          85
Science       92
English       88
Age           20
Name: 0, dtype: object

df.loc[0, Name]: Alice
df.loc[2, Math]: 91

Rows 1 to 3 (inclusive):
      Name  Math  Science  English  Age
1      Bob    72       78       75   21
2  Charlie    91       85       90   19
3    Diana    88       92       84   22

High scorers (Math>80) — Name and Math:
      Name  Math
0    Alice    85
2  Charlie    91
3    Diana    88
\`\`\`

## iloc[] — Integer Position-Based Selection

.iloc[] selects by integer position — row number and column number (0-based). This is Python-style slicing — the end position is EXCLUSIVE.

### SYNTAX — df.iloc[]

\`\`\`python
df.iloc[0]                    # First row (as Series)
df.iloc[-1]                   # Last row
df.iloc[0, 0]                 # Cell at row 0, col 0
df.iloc[1:4]                  # Rows 1,2,3 (EXCLUSIVE end)
df.iloc[:, 0]                 # All rows, first column
df.iloc[:, 0:3]               # All rows, first 3 columns
df.iloc[[0,2,4], [0,1]]       # Specific rows and column positions
df.iloc[-3:, :]               # Last 3 rows, all columns
\`\`\`

### 📌 Example 25 — df.iloc[]

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Name":    ["Alice","Bob","Charlie","Diana","Eve"],
    "Math":    [85, 72, 91, 88, 76],
    "Science": [92, 78, 85, 92, 80],
    "English": [88, 75, 90, 84, 79],
    "Age":     [20, 21, 19, 22, 20],
})

# ── Select by position ──
print("First row  (iloc[0]):", df.iloc[0, 0], df.iloc[0, 1])
print("Last row   (iloc[-1]):", df.iloc[-1, 0], df.iloc[-1, 1])

# ── Row slices (EXCLUSIVE end) ──
print("\\nRows 0,1,2 (iloc[0:3]):")
print(df.iloc[0:3])

# ── Last 2 rows ──
print("\\nLast 2 rows (iloc[-2:]):")
print(df.iloc[-2:])

# ── Specific rows and column positions ──
print("\\nRows 0,2,4 — columns 0,1 (Name, Math):")
print(df.iloc[[0,2,4], [0,1]])

# ── All rows, first 3 columns ──
print("\\nFirst 3 columns:")
print(df.iloc[:, :3])
\`\`\`

\`\`\`output
First row  (iloc[0]): Alice 85
Last row   (iloc[-1]): Eve 76

Rows 0,1,2 (iloc[0:3]):
      Name  Math  Science  English  Age
0    Alice    85       92       88   20
1      Bob    72       78       75   21
2  Charlie    91       85       90   19

Last 2 rows (iloc[-2:]):
   Name  Math  Science  English  Age
3  Diana    88       92       84   22
4    Eve    76       80       79   20

Rows 0,2,4 — columns 0,1:
      Name  Math
0    Alice    85
2  Charlie    91
4      Eve    76
\`\`\`

## loc vs iloc — Side-by-Side Comparison

| Aspect | df.loc[] — Label-based | df.iloc[] — Position-based |
| --- | --- | --- |
| Uses | Row/column NAMES (labels) | Row/column NUMBERS (integers) |
| Syntax | df.loc[label, col_name] | df.iloc[num, col_num] |
| Slicing end | INCLUSIVE (start:end both included) | EXCLUSIVE (like Python lists) |
| Use when | You know the labels | You know the positions |
| Boolean mask | ✅ Works with loc[] | ❌ Use loc[] for conditions |
| Example | df.loc[0,"Math"] | df.iloc[0, 1] |
| Range example | df.loc[0:3] → rows 0,1,2,3 | df.iloc[0:3] → rows 0,1,2 |
| Missing label | Raises KeyError | Raises IndexError |

## Boolean Filtering — Conditional Row Selection

Boolean filtering is the most powerful and commonly used way to select rows. You create a condition that evaluates to True/False for each row, then pass that boolean Series to the DataFrame to get only the matching rows.

### VISUAL DIAGRAM: Boolean Filter Flow

\`\`\`text
  HOW BOOLEAN FILTERING WORKS
  ─────────────────────────────────────────────────────────────────
  df["Math"] > 80

  Row │ Math │ df["Math"] > 80
   0  │  85  │ True   ← kept
   1  │  72  │ False  ← dropped
   2  │  91  │ True   ← kept
   3  │  88  │ True   ← kept
   4  │  76  │ False  ← dropped

  df[df["Math"] > 80]
  →  Returns only rows where condition is True:
      Name  Math  Science  ...
  0  Alice    85       92  ...
  2  Charlie  91       85  ...
  3  Diana    88       92  ...
\`\`\`

### 📌 Example 26 — Boolean Filtering

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Name":    ["Alice","Bob","Charlie","Diana","Eve","Frank"],
    "Math":    [85, 72, 91, 88, 76, 58],
    "Science": [92, 78, 85, 92, 80, 65],
    "Age":     [20, 21, 19, 22, 20, 23],
    "Grade":   ["A","C","A","B","B","D"],
})

# ── Single condition ──
print("Math > 80:")
print(df[df["Math"] > 80])

# ── AND condition ( & ) ──
print("\\nMath > 80 AND Science > 88:")
print(df[(df["Math"] > 80) & (df["Science"] > 88)])

# ── OR condition ( | ) ──
print("\\nMath < 70 OR Grade == D:")
print(df[(df["Math"] < 70) | (df["Grade"] == "D")])

# ── NOT condition ( ~ ) ──
print("\\nNOT Grade A:")
print(df[~(df["Grade"] == "A")])

# ── String condition ──
print("\\nNames starting with A or C:")
print(df[df["Name"].str.startswith(("A","C"))])
\`\`\`

\`\`\`output
Math > 80:
      Name  Math  Science  Age Grade
0    Alice    85       92   20     A
2  Charlie    91       85   19     A
3    Diana    88       92   22     B

Math > 80 AND Science > 88:
     Name  Math  Science  Age Grade
0   Alice    85       92   20     A
3   Diana    88       92   22     B

Math < 70 OR Grade == D:
    Name  Math  Science  Age Grade
5  Frank    58       65   23     D

NOT Grade A:
    Name  Math  Science  Age Grade
1    Bob    72       78   21     C
3  Diana    88       92   22     B
4    Eve    76       80   20     B
5  Frank    58       65   23     D
\`\`\`

## query() Method — Readable Filtering

The query() method lets you filter rows using an SQL-like string expression. It is especially readable for complex multi-condition filters and works great with method chaining.

### 📌 Example 27 — query() Method

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Name":    ["Alice","Bob","Charlie","Diana","Eve","Frank"],
    "Math":    [85, 72, 91, 88, 76, 58],
    "Science": [92, 78, 85, 92, 80, 65],
    "Age":     [20, 21, 19, 22, 20, 23],
    "Grade":   ["A","C","A","B","B","D"],
})

# ── Basic query ──
print("Math > 80:")
print(df.query("Math > 80"))

# ── Multiple conditions ──
print("\\nMath > 80 and Science > 85:")
print(df.query("Math > 80 and Science > 85"))

# ── Using OR ──
print("\\nGrade == A or Grade == B:")
print(df.query("Grade == @grade_list or Grade == B",
               local_dict={"grade_list":"A"}))

# ── Using Python variable in query with @ ──
min_score = 80
print("\\nMath > min_score (using @variable):")
print(df.query("Math > @min_score"))

# ── Complex query (equivalent to multi-condition filter) ──
result = df.query("Math > 75 and Science > 80 and Age <= 21")
print("\\nMath>75, Science>80, Age<=21:")
print(result)
\`\`\`

\`\`\`output
Math > 80:
      Name  Math  Science  Age Grade
0    Alice    85       92   20     A
2  Charlie    91       85   19     A
3    Diana    88       92   22     B

Math > 80 and Science > 85:
     Name  Math  Science  Age Grade
0   Alice    85       92   20     A
3   Diana    88       92   22     B

Math > min_score (using @variable):
      Name  Math  Science  Age Grade
0    Alice    85       92   20     A
2  Charlie    91       85   19     A
3    Diana    88       92   22     B
\`\`\`

:::insight
Use query() when filtering with 3+ conditions — it is much more readable than chained & | conditions. Use the @ prefix to reference Python variables inside the query string: df.query("Score > @minimum")
:::

## isin() and between() — Range and Membership Filters

### 📌 Example 28 — isin() and between()

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Name":    ["Alice","Bob","Charlie","Diana","Eve","Frank"],
    "Math":    [85, 72, 91, 88, 76, 58],
    "Science": [92, 78, 85, 92, 80, 65],
    "Grade":   ["A","C","A","B","B","D"],
    "City":    ["Mumbai","Delhi","Mumbai","Hyderabad","Bengaluru","Delhi"],
})

# ── isin() — check membership in a list ──
print("Students in Mumbai or Delhi:")
print(df[df["City"].isin(["Mumbai","Delhi"])])

# ── NOT isin() ──
print("\\nStudents NOT in Grade A or B:")
print(df[~df["Grade"].isin(["A","B"])])

# ── between() — inclusive range filter ──
print("\\nMath score between 75 and 90 (inclusive):")
print(df[df["Math"].between(75, 90)])

# ── Combine isin and between ──
result = df[
    df["City"].isin(["Mumbai","Hyderabad"]) &
    df["Math"].between(80, 100)
]
print("\\nMumbai/Hyderabad AND Math 80-100:")
print(result)
\`\`\`

\`\`\`output
Students in Mumbai or Delhi:
      Name  Math  Science Grade      City
0    Alice    85       92     A    Mumbai
1      Bob    72       78     C     Delhi
2  Charlie    91       85     A    Mumbai
5    Frank    58       65     D     Delhi

Students NOT in Grade A or B:
    Name  Math  Science Grade   City
1    Bob    72       78     C  Delhi
5  Frank    58       65     D  Delhi

Math score between 75 and 90 (inclusive):
     Name  Math  Science Grade       City
0   Alice    85       92     A     Mumbai
3   Diana    88       92     B  Hyderabad
4     Eve    76       80     B  Bengaluru

Mumbai/Hyderabad AND Math 80-100:
     Name  Math  Science Grade       City
0   Alice    85       92     A     Mumbai
2 Charlie    91       85     A     Mumbai
3   Diana    88       92     B  Hyderabad
\`\`\`

## SettingWithCopyWarning — The Important Warning

SettingWithCopyWarning is one of the most misunderstood Pandas warnings. It appears when you try to modify a DataFrame that might be a copy of another. Understanding this saves you from silent bugs where your modifications are silently lost.

### VISUAL DIAGRAM: SettingWithCopyWarning

\`\`\`text
  SETTINGWITHCOPYWARNING — Why It Happens
  ─────────────────────────────────────────────────────────────────

  PROBLEM — Chained indexing creates an uncertain copy:
  df[df["Math"] > 80]["Score"] = 100   ← WRONG!
        │                  │
        │                  └── sets on COPY (lost!)
        └── creates a copy or view (uncertain)

  Step 1: df[df["Math"] > 80]  → creates filtered view/copy
  Step 2: ["Score"] = 100      → sets on that view/copy
  Result: Original df is NOT modified! Warning is raised.

  SOLUTION 1 — Use .loc[] in a single step:
  df.loc[df["Math"] > 80, "Score"] = 100  ← CORRECT!

  SOLUTION 2 — Assign to a new variable with .copy():
  subset = df[df["Math"] > 80].copy()
  subset["Score"] = 100                    ← CORRECT!
\`\`\`

### 📌 Example 29 — Avoiding SettingWithCopyWarning

\`\`\`python
import pandas as pd
import warnings

df = pd.DataFrame({
    "Name":    ["Alice","Bob","Charlie","Diana","Eve"],
    "Math":    [85, 72, 91, 88, 76],
    "Grade":   ["A","C","A","B","B"],
    "Bonus":   [0, 0, 0, 0, 0],
})

# ── WRONG — chained indexing (triggers warning) ──
# df[df["Math"] > 80]["Bonus"] = 10  # WARNING! May not work!

# ── CORRECT Method 1: Use loc[] ──
df.loc[df["Math"] > 80, "Bonus"] = 10
print("After .loc[] assignment:")
print(df)

# ── CORRECT Method 2: .copy() then modify ──
a_students = df[df["Grade"] == "A"].copy()   # Explicit copy
a_students["Bonus"] = 20                      # Safe to modify
print("\\nA students subset (modified safely):")
print(a_students)

# ── CORRECT Method 3: query() + copy ──
high_math = df.query("Math > 85").copy()
high_math["Rank"] = ["Gold","Silver"]
print("\\nHigh math students with rank:")
print(high_math)
\`\`\`

\`\`\`output
After .loc[] assignment:
      Name  Math Grade  Bonus
0    Alice    85     A     10
1      Bob    72     C      0
2  Charlie    91     A     10
3    Diana    88     B     10
4      Eve    76     B      0

A students subset (modified safely):
      Name  Math Grade  Bonus
0    Alice    85     A     20
2  Charlie    91     A     20

High math students with rank:
      Name  Math Grade  Bonus   Rank
2  Charlie    91     A     10   Gold
3    Diana    88     B     10  Silver
\`\`\`

:::mistake
Golden Rule: NEVER use chained indexing (df[condition][column] = value) to modify data. ALWAYS use df.loc[condition, column] = value for assignment. This is the single most important selection rule in Pandas.
:::

## Lesson 5 — Complete Selection Reference

| Operation | Syntax | Returns | Notes |
| --- | --- | --- | --- |
| Single column | df["col"] | Series | Always use bracket notation |
| Multiple columns | df[["a","b"]] | DataFrame | Double brackets |
| Single row (label) | df.loc[0] | Series | Label-based |
| Single cell (label) | df.loc[0,"col"] | Scalar | Label row + label col |
| Row range (label) | df.loc[1:3] | DataFrame | INCLUSIVE both ends |
| Filter (label) | df.loc[mask,"col"] | DataFrame | Best for assignment |
| Single row (pos) | df.iloc[0] | Series | Position-based |
| Single cell (pos) | df.iloc[0,1] | Scalar | Position row + col |
| Row range (pos) | df.iloc[1:4] | DataFrame | EXCLUSIVE end |
| Boolean filter | df[df["col"]>5] | DataFrame | Most common pattern |
| Query string | df.query("col>5") | DataFrame | Readable complex filters |
| Membership | df[df["c"].isin([])] | DataFrame | Multiple value match |
| Range filter | df[df["c"].between(a,b)] | DataFrame | Inclusive range |

## Quick Reference Cheat Sheet

*Lessons 1–5: Series, DataFrame, I/O, Selection*

### L1: Setup & Structures

\`\`\`text
import pandas as pd
import numpy as np
pd.__version__
pd.Series([1,2,3])
pd.DataFrame({...})
df.shape / df.dtypes
df.info() / df.describe()
\`\`\`

### L2: Series

\`\`\`text
pd.Series([1,2,3])
pd.Series({k:v,...})
pd.Series(42,index=[...])
s.dtype / s.name / s.shape
s.index / s.values
s.describe()
s.loc["label"] / s.iloc[0]
\`\`\`

### L3: DataFrame

\`\`\`text
pd.DataFrame({col:[...],})
pd.DataFrame([{...},{...}])
df.head(n) / df.tail(n)
df.sample(n, random_state=1)
df["col"] = values
df.drop("col",axis=1)
df.drop(index=[0,1])
df.rename(columns={old:new})
\`\`\`

### L4: Reading & Writing

\`\`\`text
pd.read_csv("file.csv")
pd.read_csv(url)
sep="\\t"  usecols=[]
nrows=100  index_col=0
dtype={}  na_values=[]
encoding="utf-8"
pd.read_excel("f.xlsx")
df.to_csv("f.csv",index=False)
\`\`\`

### L5: Selection & Filtering

\`\`\`text
df["col"]         → Series
df[["a","b"]]     → DataFrame
df.loc[0,"col"]   → by label
df.loc[0:3]       → INCLUSIVE
df.loc[mask,"col"]→ filter+col
df.iloc[0,1]      → by position
df.iloc[0:3]      → EXCLUSIVE
\`\`\`

\`\`\`text
df[df["x"] > 5]   → filter rows
(a>5) & (b<10)   → AND
(a>5) | (b<10)   → OR
~mask             → NOT
df.query("x > @var")
df["c"].isin([v1,v2,v3])
df["c"].between(lo, hi)
df.loc[mask,"c"]=v  (SAFE!)
\`\`\`

:::tip
BEGINNER CHECKLIST: 1) Always import as pd 2) Use df.info() and df.describe() on every new dataset 3) Always use .loc[]/.iloc[] — never chained indexing for assignment 4) Use .copy() when creating a subset you plan to modify 5) Specify index=False in to_csv() to avoid saving row numbers.
:::

:::challenge
**NEXT STEPS**
Practice datasets: Iris (pd.read_csv seaborn-data), Titanic (pd.read_csv GitHub), or create your own with pd.DataFrame(). The best way to learn Pandas is to work with real data — pick any CSV file you care about and start exploring!
:::`,

6: `# Handling Missing Data

**In this lesson:** What is NaN? · isnull/notnull · dropna() · fillna() · interpolate() · replace() · Missing patterns

## What is NaN in Pandas?

NaN (Not a Number) is how Pandas represents missing, null, or undefined values. Unlike databases which use NULL, Pandas uses the IEEE 754 floating-point NaN standard. Every real-world dataset has missing values — mastering how to detect, remove, or fill them is the most critical data-cleaning skill.

### VISUAL DIAGRAM: Missing Data in DataFrames

\`\`\`text
  MISSING DATA — How It Appears in Pandas
  ────────────────────────────────────────────────────────────────
   Name     Score   Grade   City
0  Alice      85      A     Mumbai
1  Bob        NaN     C     NaN      <-- missing Score and City
2  Charlie    91      NaN   Delhi    <-- missing Grade
3  Diana      88      B     NaN      <-- missing City
4  NaN        76      A     Chennai  <-- missing Name

  NaN Sources in Real Data:
  - CSV has empty cells              -> read as NaN automatically
  - CSV has "N/A","n/a","?","--"    -> use na_values parameter
  - Outer join produces no match    -> NaN in unmatched rows
  - Sensor malfunction              -> missing readings
  - Survey skipped questions        -> unanswered = NaN

  NaN type is float64 -- adding NaN to int column promotes to float!
\`\`\`

## isnull(), notnull(), isna(), notna()

These four functions detect missing values. isnull() and isna() are identical aliases. notnull() and notna() are their inverses. All return boolean arrays of the same shape.

### 📌 Example 1 — Detecting Missing Values

\`\`\`python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    "Name":  ["Alice", "Bob", "Charlie", "Diana", "Eve"],
    "Score": [85, np.nan, 91, 88, np.nan],
    "Grade": ["A", "C", np.nan, "B", "A"],
    "City":  ["Mumbai", np.nan, "Delhi", np.nan, "Chennai"],
})

print("DataFrame:")
print(df)

# --- Detect missing values ---
print("\\nisnull():")
print(df.isnull())

# --- Count missing per column ---
print("\\nMissing count per column:")
print(df.isnull().sum())

# --- Percentage missing ---
print("\\nMissing % per column:")
print((df.isnull().sum() / len(df) * 100).round(1))

# --- Any missing in each row? ---
print("\\nAny missing per row:")
print(df.isnull().any(axis=1))

# --- Total missing in entire DataFrame ---
print("\\nTotal missing cells:", df.isnull().sum().sum())

# --- Rows with NO missing values ---
complete_rows = df[df.notnull().all(axis=1)]
print("\\nComplete rows only:")
print(complete_rows)
\`\`\`

\`\`\`output
DataFrame:
      Name  Score Grade     City
0    Alice   85.0     A   Mumbai
1      Bob    NaN     C      NaN
2  Charlie   91.0   NaN    Delhi
3    Diana   88.0     B      NaN
4      Eve    NaN     A  Chennai

isnull():
    Name  Score  Grade   City
0  False  False  False  False
1  False   True  False   True
2  False  False   True  False
3  False  False  False   True
4  False   True  False  False

Missing count per column:
Name     0
Score    2
Grade    1
City     2

Missing % per column:
Name     0.0
Score   40.0
Grade   20.0
City    40.0

Total missing cells: 5

Complete rows only:
    Name  Score Grade    City
0  Alice   85.0     A  Mumbai
\`\`\`

## dropna() — Removing Missing Values

dropna() removes rows or columns that contain missing values. It offers fine-grained control through its parameters.

### SYNTAX — dropna()

\`\`\`python
df.dropna()
    axis=0,        # 0=drop rows (default), 1=drop columns
    how="any",     # "any"=drop if ANY NaN, "all"=drop if ALL NaN
    thresh=None,   # Keep rows with at least thresh non-NaN values
    subset=None,   # Check NaN only in these columns
    inplace=False  # Modify original (True) or return copy (False)
\`\`\`

### 📌 Example 2 — dropna() Parameters

\`\`\`python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    "Name":  ["Alice","Bob","Charlie","Diana","Eve"],
    "Score": [85, np.nan, 91, 88, np.nan],
    "Grade": ["A","C",np.nan,"B","A"],
    "City":  ["Mumbai",np.nan,"Delhi",np.nan,"Chennai"],
})

# --- Drop rows with ANY missing value (default) ---
print("dropna() -- drop any row with NaN:")
print(df.dropna())

# --- Drop rows where ALL values are NaN ---
print("\\ndropna(how=all):")
print(df.dropna(how="all"))

# --- Keep rows with at least 3 non-NaN values ---
print("\\ndropna(thresh=3):")
print(df.dropna(thresh=3))

# --- Drop based only on specific columns ---
print("\\ndropna(subset=[Score]):")
print(df.dropna(subset=["Score"]))

# --- Drop COLUMNS with any NaN ---
print("\\ndropna(axis=1):")
print(df.dropna(axis=1))
\`\`\`

\`\`\`output
dropna() -- drop any row with NaN:
    Name  Score Grade    City
0  Alice   85.0     A  Mumbai

dropna(how=all): (all 5 rows -- none are ALL NaN)

dropna(thresh=3): rows with at least 3 valid values
      Name  Score Grade     City
0    Alice   85.0     A   Mumbai
2  Charlie   91.0   NaN    Delhi
3    Diana   88.0     B      NaN
4      Eve    NaN     A  Chennai

dropna(subset=[Score]):
      Name  Score Grade     City
0    Alice   85.0     A   Mumbai
2  Charlie   91.0   NaN    Delhi
3    Diana   88.0     B      NaN

dropna(axis=1): only Name column survives
      Name
0    Alice
1      Bob
2  Charlie
3    Diana
4      Eve
\`\`\`

## fillna() — Filling Missing Values

fillna() replaces NaN values with a specified value or strategy. It is the most common missing-data treatment in real-world pipelines.

### SYNTAX — fillna()

\`\`\`python
df.fillna(value)                  # Fill all NaN with scalar
df.fillna({"col1": v1, "col2": v2}) # Different value per column
df.fillna(method="ffill")         # Forward fill (propagate last valid)
df.fillna(method="bfill")         # Backward fill (propagate next valid)
df.fillna(method="ffill", limit=1) # Max 1 consecutive NaN filled
series.fillna(series.mean())      # Fill with column mean
\`\`\`

### 📌 Example 3 — fillna() Strategies

\`\`\`python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    "Name":  ["Alice","Bob","Charlie","Diana","Eve"],
    "Score": [85.0, np.nan, 91.0, np.nan, np.nan],
    "Grade": ["A","C",np.nan,"B","A"],
    "City":  ["Mumbai",np.nan,"Delhi",np.nan,"Chennai"],
})

# --- Fill all NaN with a scalar ---
print("fillna(0):")
print(df.fillna(0))

# --- Fill different columns with different values ---
print("\\nfillna per column:")
filled = df.fillna({"Score": df["Score"].mean(), "Grade": "Unknown", "City": "N/A"})
print(filled)

# --- Forward Fill: use last valid value ---
print("\\nffill (forward fill):")
print(df.fillna(method="ffill"))

# --- Backward Fill: use next valid value ---
print("\\nbfill (backward fill):")
print(df.fillna(method="bfill"))

# --- Forward fill with limit ---
scores = pd.Series([1.0, np.nan, np.nan, np.nan, 5.0])
print("\\nffill limit=1:", scores.fillna(method="ffill", limit=1).tolist())
print("ffill limit=2:", scores.fillna(method="ffill", limit=2).tolist())
\`\`\`

\`\`\`output
fillna(0):
      Name  Score Grade      City
0    Alice   85.0     A    Mumbai
1      Bob    0.0     C         0
2  Charlie   91.0     0     Delhi
3    Diana    0.0     B         0
4      Eve    0.0     A   Chennai

fillna per column:
      Name  Score    Grade      City
0    Alice   85.0        A    Mumbai
1      Bob   88.0        C       N/A
2  Charlie   91.0  Unknown     Delhi
3    Diana   88.0        B       N/A
4      Eve   88.0        A   Chennai

ffill (forward fill):
      Name  Score Grade     City
0    Alice   85.0     A   Mumbai
1      Bob   85.0     C   Mumbai
2  Charlie   91.0     C    Delhi
3    Diana   91.0     B    Delhi
4      Eve   91.0     A  Chennai

ffill limit=1: [1.0, 1.0, nan, nan, 5.0]
ffill limit=2: [1.0, 1.0, 1.0, nan, 5.0]
\`\`\`

## interpolate() — Estimate Missing Values

interpolate() estimates missing values by fitting a curve through known data points. It is ideal for time series, sensor readings, or any data where values should change smoothly over time.

### VISUAL DIAGRAM: Interpolation Concept

\`\`\`text
  INTERPOLATE — Filling Between Known Points
  ────────────────────────────────────────────────────────────────
  Known: 10, NaN, NaN, 40
  ffill: 10, 10,  10,  40   (repeats last known)
  interpolate: 10, 20,  30,  40   (linear between 10 and 40)

  method="linear" -- straight line between known points
  method="time"   -- weighted by actual time gaps
  method="cubic"  -- smooth curve (requires scipy)
  method="nearest"-- nearest known value
\`\`\`

### 📌 Example 4 — interpolate()

\`\`\`python
import pandas as pd
import numpy as np

# Sensor temperature readings with gaps
temps = pd.Series([22.0, np.nan, np.nan, np.nan, 30.0, np.nan, 28.0])
print("Original:", temps.tolist())

# Linear interpolation
linear = temps.interpolate(method="linear")
print("linear: ", [round(x,2) for x in linear])

# Pad (same as ffill)
pad = temps.interpolate(method="pad")
print("pad:    ", [round(x,2) for x in pad])

# DataFrame interpolation
df = pd.DataFrame({
    "Day":   [1,2,3,4,5,6,7],
    "Sales": [100.0, np.nan, np.nan, 280.0, np.nan, 350.0, 400.0],
})
df["Sales_filled"] = df["Sales"].interpolate(method="linear")
print("\\nSales with interpolation:")
print(df)
\`\`\`

\`\`\`output
Original: [22.0, nan, nan, nan, 30.0, nan, 28.0]
linear:  [22.0, 24.0, 26.0, 28.0, 30.0, 29.0, 28.0]
pad:     [22.0, 22.0, 22.0, 22.0, 30.0, 30.0, 28.0]

Sales with interpolation:
   Day  Sales  Sales_filled
0    1  100.0         100.0
1    2    NaN         160.0
2    3    NaN         220.0
3    4  280.0         280.0
4    5    NaN         315.0
5    6  350.0         350.0
6    7  400.0         400.0
\`\`\`

## replace() — Replacing Arbitrary Values

replace() substitutes specific values (not just NaN) with new values. Use it to clean sentinel values, fix typos, standardise categories, or convert codes to labels.

### 📌 Example 5 — replace()

\`\`\`python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    "Grade":  ["A","B","A","D","C","B","F"],
    "Status": ["pass","PASS","Pass","fail","pass","pass","fail"],
    "Score":  [85, 92, 78, -999, 80, 88, -999],
})

# --- Replace single value ---
print("Replace -999 with NaN:")
print(df["Score"].replace(-999, np.nan).tolist())

# --- Replace multiple values with one replacement ---
print("\\nNormalise Status (all to lowercase pass/fail):")
status_fixed = df["Status"].replace(["PASS","Pass"], "pass")
print(status_fixed.tolist())

# --- Replace with a dict (different replacement per value) ---
grade_map = {"A": 4.0, "B": 3.0, "C": 2.0, "D": 1.0, "F": 0.0}
print("\\nGrade to GPA:")
print(df["Grade"].replace(grade_map).tolist())

# --- Replace using regex ---
df2 = pd.DataFrame({"Phone": ["123-456-7890","(123)456-7890","123.456.7890"]})
df2["Phone_clean"] = df2["Phone"].replace(r"[^0-9]", "", regex=True)
print("\\nPhone cleaned:")
print(df2)
\`\`\`

\`\`\`output
Replace -999 with NaN:
[85, 92, 78, nan, 80, 88, nan]

Normalise Status:
["pass", "pass", "pass", "fail", "pass", "pass", "fail"]

Grade to GPA:
[4.0, 3.0, 4.0, 1.0, 2.0, 3.0, 0.0]

Phone cleaned:
           Phone Phone_clean
0  123-456-7890  1234567890
1 (123)456-7890  1234567890
2  123.456.7890  1234567890
\`\`\`

:::insight
Use replace() before dropna() or fillna() when your dataset has sentinel values like -999, -1, 9999, "N/A", "n/a", "none", "." etc. Convert them to real NaN first, then apply your missing-value strategy.
:::

## Lesson 6 — Missing Data Function Reference

| Function | Purpose | Key Parameters | Returns |
| --- | --- | --- | --- |
| isnull() / isna() | Detect NaN | — | Bool DataFrame/Series |
| notnull() / notna() | Detect non-NaN | — | Bool DataFrame/Series |
| .isnull().sum() | Count NaN per column | — | Series of counts |
| dropna() | Remove NaN rows/cols | axis, how, thresh, subset | DataFrame |
| fillna() | Fill NaN with value | value, method, limit | DataFrame/Series |
| interpolate() | Estimate NaN values | method, limit | DataFrame/Series |
| replace() | Replace any value | to_replace, value, regex | DataFrame/Series |
| ffill() / bfill() | Forward/backward fill | limit | DataFrame/Series |`,

7: `# Data Transformation

**In this lesson:** apply() · map() · applymap()/DataFrame.map() · Lambda functions · transform() · pipe() · assign()

## apply() — Row-Wise and Column-Wise

apply() is the Swiss Army knife of Pandas transformation. It applies a function along an axis of a DataFrame or to every element of a Series. Understanding its axis parameter is the most important thing.

### VISUAL DIAGRAM: apply() axis direction

\`\`\`text
  APPLY — axis=0 vs axis=1
  ────────────────────────────────────────────────────────────────
       Math  Science  English
  A:    85      92      88      <- axis=1: func receives this ROW
  B:    72      78      75
  C:    91      85      90
        |       |       |
      axis=0  axis=0  axis=0   <- func receives each COLUMN

  df.apply(func, axis=0)  -> function gets each column (Series)
                             returns one result per column
  df.apply(func, axis=1)  -> function gets each row (Series)
                             returns one result per row
\`\`\`

### 📌 Example 6 — apply()

\`\`\`python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    "Math":    [85, 72, 91, 88, 76],
    "Science": [92, 78, 85, 92, 80],
    "English": [88, 75, 90, 84, 79],
}, index=["Alice","Bob","Charlie","Diana","Eve"])

# --- axis=0: function receives each COLUMN ---
print("Column ranges (max-min), axis=0:")
print(df.apply(lambda col: col.max() - col.min()))

# --- axis=1: function receives each ROW ---
print("\\nRow averages, axis=1:")
print(df.apply(lambda row: row.mean(), axis=1))

# --- apply with named function ---
def grade(score):
    if score >= 90: return "A"
    elif score >= 80: return "B"
    elif score >= 70: return "C"
    else: return "D"

print("\\nGrade for Math:")
print(df["Math"].apply(grade))

# --- apply returning a Series expands to columns ---
def stats(row):
    return pd.Series({"Min":row.min(),"Max":row.max(),"Range":row.max()-row.min()})

print("\\nRow stats (min/max/range):")
print(df.apply(stats, axis=1))
\`\`\`

\`\`\`output
Column ranges (max-min), axis=0:
Math      19
Science   14
English   15
dtype: int64

Row averages, axis=1:
Alice      88.333333
Bob        75.000000
Charlie    88.666667
Diana      88.000000
Eve        78.333333

Grade for Math:
Alice      B
Bob        C
Charlie    A
Diana      B
Eve        C

Row stats:
         Min  Max  Range
Alice     85   92      7
Bob       72   78      6
Charlie   85   91      6
\`\`\`

## map() — Element-Wise Mapping on Series

map() transforms each element of a Series by applying a function, dictionary, or another Series. It only works on Series (not DataFrames). It is perfect for label substitution and value lookup.

### 📌 Example 7 — map()

\`\`\`python
import pandas as pd

grades = pd.Series(["A","B","A","C","D","B","F","A"])

# --- map with a dict ---
gpa_map = {"A":4.0, "B":3.0, "C":2.0, "D":1.0, "F":0.0}
print("Grade to GPA (dict):")
print(grades.map(gpa_map))

# --- map with a function ---
print("\\nGrade length (func):")
print(grades.map(len))

# --- map with a Series (lookup) ---
grade_desc = pd.Series({
    "A":"Excellent","B":"Good","C":"Average","D":"Below Avg","F":"Fail"
})
print("\\nGrade descriptions:")
print(grades.map(grade_desc))

# --- Practical: country code to name ---
df = pd.DataFrame({
    "Name":    ["Alice","Bob","Charlie"],
    "Country": ["IN","US","UK"],
})
country_names = {"IN":"India","US":"United States","UK":"United Kingdom"}
df["Country_Name"] = df["Country"].map(country_names)
print("\\nCountry expanded:")
print(df)
\`\`\`

\`\`\`output
Grade to GPA:
0    4.0
1    3.0
2    4.0
3    2.0
4    1.0
5    3.0
6    0.0
7    4.0

Grade descriptions:
0    Excellent
1         Good
2    Excellent
3      Average
4    Below Avg
5         Good
6         Fail
7    Excellent

Country expanded:
      Name Country   Country_Name
0    Alice      IN          India
1      Bob      US  United States
2  Charlie      UK United Kingdom
\`\`\`

## applymap() / DataFrame.map() — Element-Wise on DataFrame

applymap() (deprecated in Pandas 2.1) and its replacement DataFrame.map() apply a function to every single element of a DataFrame. Use it for formatting, type conversion, or cell-level transformation.

### 📌 Example 8 — DataFrame.map()

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Math":    [85.5, 72.3, 91.1, 88.9],
    "Science": [92.4, 78.6, 85.2, 92.7],
    "English": [88.1, 75.8, 90.3, 84.5],
})

# --- DataFrame.map (Pandas 2.1+) ---
# Apply rounding to EVERY cell
rounded = df.map(round)
print("All values rounded:")
print(rounded)

# --- Apply formatting ---
formatted = df.map(lambda x: f"{x:.1f}%")
print("\\nFormatted as percentages:")
print(formatted)

# --- Classify each cell ---
classify = df.map(lambda x: "High" if x >= 88 else "Low")
print("\\nHigh/Low classification:")
print(classify)
\`\`\`

\`\`\`output
All values rounded:
   Math  Science  English
0    86       92       88
1    72       79       76
2    91       85       90
3    89       93       85

Formatted as percentages:
    Math Science English
0  85.5%   92.4%   88.1%
1  72.3%   78.6%   75.8%
2  91.1%   85.2%   90.3%
3  88.9%   92.7%   84.5%

High/Low classification:
   Math Science English
0  Low    High    High
1  Low     Low     Low
2  High    Low    High
3  High   High    Low
\`\`\`

## transform() — Apply Without Reducing Shape

transform() applies a function but always returns a result with the SAME shape as the input. Unlike apply() which can reduce dimensions, transform() guarantees shape preservation. This makes it perfect for adding computed columns derived from group statistics.

### 📌 Example 9 — transform()

\`\`\`python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    "Name":    ["Alice","Bob","Charlie","Diana","Eve"],
    "Math":    [85, 72, 91, 88, 76],
    "Science": [92, 78, 85, 92, 80],
})

# --- transform on whole DataFrame ---
# Z-score normalization (subtract mean, divide by std)
z_scored = df[["Math","Science"]].transform(
    lambda x: (x - x.mean()) / x.std()
)
print("Z-score normalized:")
print(z_scored.round(3))

# --- Shape is preserved ---
print("\\nOriginal shape:", df.shape)
print("Transformed shape:", z_scored.shape)

# --- Multiple functions at once ---
result = df[["Math"]].transform(["mean","std","max"])
print("\\nMultiple transforms:")
print(result)
\`\`\`

\`\`\`output
Z-score normalized:
      Math  Science
0    0.314    1.118
1   -1.099   -0.901
2    1.256    0.000
3    0.628    1.118
4   -1.099   -1.336

Original shape: (5, 4)
Transformed shape: (5, 2)

Multiple transforms:
   Math
   mean   std  max
0  82.4  7.76   91
1  82.4  7.76   91
2  82.4  7.76   91
\`\`\`

## pipe() — Clean Method Chaining

pipe() lets you apply a function to a DataFrame using method-chain syntax. Instead of nested function calls (hard to read), you chain .pipe() calls (easy to read). It is the key to building readable data pipelines.

### 📌 Example 10 — pipe()

\`\`\`python
import pandas as pd
import numpy as np

# Define pipeline steps as functions
def drop_missing(df, threshold=0.5):
    """Drop columns with more than threshold fraction missing"""
    return df.dropna(thresh=int(len(df)*threshold), axis=1)

def normalise_scores(df, cols):
    """Min-max normalise specified columns"""
    df = df.copy()
    for col in cols:
        mn, mx = df[col].min(), df[col].max()
        df[col] = (df[col] - mn) / (mx - mn)
    return df

def add_average(df, cols, name="Average"):
    """Add row average of specified columns"""
    df[name] = df[cols].mean(axis=1)
    return df

df = pd.DataFrame({
    "Name":    ["Alice","Bob","Charlie","Diana"],
    "Math":    [85, 72, 91, 88],
    "Science": [92, 78, 85, 92],
    "English": [88, 75, 90, 84],
})

# --- Without pipe: deeply nested, hard to read ---
# result = add_average(normalise_scores(drop_missing(df), ["Math","Science","English"]), [...])

# --- With pipe: clean, readable left-to-right ---
result = (
    df
    .pipe(drop_missing, threshold=0.5)
    .pipe(normalise_scores, cols=["Math","Science","English"])
    .pipe(add_average, cols=["Math","Science","English"])
)
print("Pipeline result:")
print(result.round(3))
\`\`\`

\`\`\`output
Pipeline result:
      Name   Math  Science  English  Average
0    Alice  0.684    1.000    0.800    0.828
1      Bob  0.000    0.000    0.067    0.022
2  Charlie  1.000    0.500    1.000    0.833
3    Diana  0.842    1.000    0.600    0.814
\`\`\`

## assign() — Add Computed Columns Cleanly

assign() adds new columns to a DataFrame and returns a new DataFrame. Unlike direct assignment (df["col"]=...), assign() works perfectly in method chains and does not modify the original.

### 📌 Example 11 — assign()

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Name":    ["Alice","Bob","Charlie","Diana"],
    "Math":    [85, 72, 91, 88],
    "Science": [92, 78, 85, 92],
})

# --- Add single column ---
df2 = df.assign(Average=lambda x: (x.Math + x.Science)/2)
print("With Average:")
print(df2)

# --- Add multiple columns in one call ---
df3 = df.assign(
    Average = lambda x: (x.Math + x.Science)/2,
    Total   = lambda x: x.Math + x.Science,
    Grade   = lambda x: x.Math.apply(
        lambda s: "A" if s>=90 else "B" if s>=80 else "C"
    ),
)
print("\\nMultiple assigns:")
print(df3)

# --- assign inside a chain ---
result = (
    df
    .assign(Total=df.Math + df.Science)
    .assign(PassFail=lambda x: x.Total >= 160)
    .sort_values("Total", ascending=False)
)
print("\\nChained assigns:")
print(result)
\`\`\`

\`\`\`output
With Average:
      Name  Math  Science  Average
0    Alice    85       92     88.5
1      Bob    72       78     75.0
2  Charlie    91       85     88.0
3    Diana    88       92     90.0

Multiple assigns:
      Name  Math  Science  Average  Total Grade
0    Alice    85       92     88.5    177     B
1      Bob    72       78     75.0    150     C
2  Charlie    91       85     88.0    176     A
3    Diana    88       92     90.0    180     B

Chained assigns:
      Name  Math  Science  Total  PassFail
3    Diana    88       92    180      True
0    Alice    85       92    177      True
2  Charlie    91       85    176      True
1      Bob    72       78    150     False
\`\`\``,

8: `# GroupBy — Split-Apply-Combine

**In this lesson:** groupby() basics · Aggregation functions · agg() · Named aggregations · transform() · filter() · apply() on groups

## The Split-Apply-Combine Pattern

GroupBy implements the Split-Apply-Combine strategy: split the DataFrame into groups, apply a function to each group independently, then combine the results back into a single structure. This is how virtually all summary statistics and business reporting is done.

### VISUAL DIAGRAM: Split-Apply-Combine Flow

\`\`\`text
  SPLIT → APPLY → COMBINE
  ────────────────────────────────────────────────────────────────
  Original DataFrame:
  City     Score    City     Score    City     Score
  Mumbai    85  --SPLIT--> Mumbai    85  Mumbai    92
  Delhi     91             Delhi     91  Delhi     88
  Mumbai    92
  Delhi     88
                --APPLY--> mean(85,92)  mean(91,88)
                             = 88.5       = 89.5
  COMBINE:
  City     Score_mean
  Delhi        89.5
  Mumbai       88.5

  df.groupby("City")["Score"].mean()
\`\`\`

## groupby() Basics

### 📌 Example 12 — groupby() Basics

\`\`\`python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    "Name":    ["Alice","Bob","Charlie","Diana","Eve","Frank","Grace"],
    "Dept":    ["IT","HR","IT","Finance","HR","Finance","IT"],
    "City":    ["Mumbai","Delhi","Mumbai","Hyderabad","Delhi","Hyderabad","Mumbai"],
    "Salary":  [75000,55000,82000,90000,60000,85000,70000],
    "Score":   [88, 72, 91, 95, 78, 89, 84],
})

# --- Single key groupby ---
g = df.groupby("Dept")
print("Groups:", list(g.groups.keys()))
print("\\nMean salary per dept:")
print(g["Salary"].mean())

# --- Multiple key groupby ---
print("\\nMean score by Dept AND City:")
print(df.groupby(["Dept","City"])["Score"].mean())

# --- Group size ---
print("\\nHeadcount per dept:")
print(df.groupby("Dept").size())

# --- Iterate over groups ---
print("\\n--- IT department members ---")
it_group = g.get_group("IT")
print(it_group[["Name","Salary","Score"]])
\`\`\`

\`\`\`output
Groups: ["Finance", "HR", "IT"]

Mean salary per dept:
Dept
Finance    87500.0
HR         57500.0
IT         75666.7
Name: Salary, dtype: float64

Mean score by Dept AND City:
Dept     City
Finance  Hyderabad    89.0
HR       Delhi        75.0
IT       Mumbai       87.7

Headcount per dept:
Dept
Finance    2
HR         2
IT         3

--- IT department members ---
      Name  Salary  Score
0    Alice   75000     88
2  Charlie   82000     91
6    Grace   70000     84
\`\`\`

## Aggregation Functions

### 📌 Example 13 — Aggregation Functions

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Dept":   ["IT","HR","IT","Finance","HR","Finance","IT"],
    "Salary": [75000,55000,82000,90000,60000,85000,70000],
    "Score":  [88,72,91,95,78,89,84],
})

g = df.groupby("Dept")

# --- Standard aggregations ---
print("Sum:")
print(g["Salary"].sum())

print("\\nMean:")
print(g["Salary"].mean().round(0))

print("\\nCount:")
print(g["Salary"].count())

print("\\nMin / Max:")
print(g["Score"].agg(["min","max"]))

print("\\nStd:")
print(g["Score"].std().round(2))

# --- Multiple columns at once ---
print("\\nDescriptive stats for all numeric cols:")
print(g[["Salary","Score"]].mean().round(1))
\`\`\`

\`\`\`output
Sum:
Dept
Finance    175000
HR         115000
IT         227000

Mean:
Dept
Finance    87500.0
HR         57500.0
IT         75667.0

Count:
Finance    2
HR         2
IT         3

Min / Max:
         min  max
Dept
Finance   89   95
HR        72   78
IT        84   91
\`\`\`

## agg() — Multiple Functions at Once

agg() (short for aggregate) applies multiple functions simultaneously, returning a multi-level column result. It is the fastest way to build a summary table.

### 📌 Example 14 — agg() and Named Aggregations

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Dept":   ["IT","HR","IT","Finance","HR","Finance","IT"],
    "Salary": [75000,55000,82000,90000,60000,85000,70000],
    "Score":  [88,72,91,95,78,89,84],
})

# --- Multiple functions on one column ---
print("Salary stats per dept:")
print(df.groupby("Dept")["Salary"].agg(["mean","min","max","std","count"]))

# --- Different functions per column ---
print("\\nCustom agg per column:")
print(df.groupby("Dept").agg({
    "Salary": ["mean","max"],
    "Score":  ["mean","min"],
}))

# --- Named aggregations (Pandas 0.25+) ---
print("\\nNamed aggregations:")
result = df.groupby("Dept").agg(
    Avg_Salary  = ("Salary", "mean"),
    Max_Salary  = ("Salary", "max"),
    Avg_Score   = ("Score",  "mean"),
    Headcount   = ("Salary", "count"),
)
print(result.round(1))
\`\`\`

\`\`\`output
Salary stats per dept:
                mean    min    max          std  count
Dept
Finance      87500   85000  90000  3535.533906      2
HR           57500   55000  60000  3535.533906      2
IT           75666   70000  82000  6027.713610      3

Named aggregations:
         Avg_Salary  Max_Salary  Avg_Score  Headcount
Dept
Finance     87500.0       90000       92.0          2
HR          57500.0       60000       75.0          2
IT          75666.7       82000       87.7          3
\`\`\`

## transform() with Groups — Broadcast Group Stats

transform() used with groupby is a superpower: it computes per-group statistics but returns results aligned with the ORIGINAL DataFrame shape. Every row gets the statistic of its own group, making it perfect for adding comparison columns.

### 📌 Example 15 — transform() with GroupBy

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Name":   ["Alice","Bob","Charlie","Diana","Eve","Frank"],
    "Dept":   ["IT","HR","IT","Finance","HR","Finance"],
    "Salary": [75000,55000,82000,90000,60000,85000],
})

# --- Add dept mean salary to each row ---
df["Dept_Mean_Salary"] = df.groupby("Dept")["Salary"].transform("mean")

# --- How much above/below dept average? ---
df["vs_Avg"] = df["Salary"] - df["Dept_Mean_Salary"]

# --- Dept rank ---
df["Dept_Rank"] = df.groupby("Dept")["Salary"].rank(ascending=False)

print(df.sort_values("Dept"))
\`\`\`

\`\`\`output
      Name     Dept  Salary  Dept_Mean_Salary  vs_Avg  Dept_Rank
3    Diana  Finance   90000           87500.0  2500.0        1.0
5    Frank  Finance   85000           87500.0 -2500.0        2.0
1      Bob       HR   55000           57500.0 -2500.0        2.0
4      Eve       HR   60000           57500.0  2500.0        1.0
0    Alice       IT   75000           75666.7   -666.7       2.0
2  Charlie       IT   82000           75666.7   6333.3       1.0
\`\`\`

## filter() — Keep or Drop Entire Groups

filter() keeps or removes ENTIRE groups based on a condition evaluated per group. Unlike boolean indexing which works row-by-row, filter() either keeps or removes all rows of a group together.

### 📌 Example 16 — filter() with GroupBy

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Dept":   ["IT","HR","IT","Finance","HR","Finance","IT","HR"],
    "Score":  [88,72,91,95,78,89,84,65],
    "Name":   ["A","B","C","D","E","F","G","H"],
})

# Keep only departments with mean score >= 85
print("Depts with mean score >= 85:")
high_scoring = df.groupby("Dept").filter(lambda g: g["Score"].mean() >= 85)
print(high_scoring)

# Keep only depts with at least 3 members
print("\\nDepts with >= 3 members:")
large_depts = df.groupby("Dept").filter(lambda g: len(g) >= 3)
print(large_depts)
\`\`\`

\`\`\`output
Depts with mean score >= 85:
     Dept  Score Name
2      IT     91    C
3  Finance     95    D
5  Finance     89    F
6      IT     84    G
0      IT     88    A

Depts with >= 3 members:
  Dept  Score Name
1   HR     72    B
4   HR     78    E
7   HR     65    H
0   IT     88    A
2   IT     91    C
6   IT     84    G
\`\`\`

:::insight
transform() returns the same shape as the input (good for adding columns). agg() reduces to one row per group (good for summary tables). filter() keeps or drops whole groups. apply() is the most flexible but slowest — use agg/transform when possible.
:::

## Lesson 8 — GroupBy Quick Reference

| Method | Purpose | Returns Shape | Example |
| --- | --- | --- | --- |
| groupby("col") | Split into groups | GroupBy object | df.groupby("Dept") |
| .sum() | Sum per group | One row per group | g["Salary"].sum() |
| .mean() | Mean per group | One row per group | g["Score"].mean() |
| .count() | Non-null count | One row per group | g["Name"].count() |
| .agg([]) | Multiple functions | One row per group | g.agg(["mean","max"]) |
| .agg({col:func}) | Custom per column | One row per group | g.agg({"Sal":"mean"}) |
| Named agg | Clean column names | One row per group | g.agg(Avg=("S","mean")) |
| .transform() | Broadcast group stats | Same as input | g["S"].transform("mean") |
| .filter(func) | Drop/keep groups | Subset of input | g.filter(lambda g:...) |
| .apply(func) | Custom per group | Flexible | g.apply(custom_fn) |`,

9: `# Merging, Joining & Concatenating

**In this lesson:** pd.merge() · Join types · Merge on index · pd.concat() · DataFrame.join() · merge_asof()

## Combining DataFrames — Overview

### VISUAL DIAGRAM: Combine Strategy Overview

\`\`\`text
  THREE WAYS TO COMBINE DataFrames
  ────────────────────────────────────────────────────────────────

  1. pd.merge()  -- Join on shared KEY COLUMN (like SQL JOIN)
     Left:  ID, Name       Right: ID, Score
     Result: ID, Name, Score  (matched on ID)
     Use when: two tables share a common column (foreign key)

  2. pd.concat() -- Stack vertically (add rows) or horizontally (add cols)
     axis=0: Stack A on top of B (append rows)
     axis=1: Put A and B side by side (add columns)
     Use when: tables have same structure and you want to combine

  3. df.join()   -- Join on INDEX
     Left index matches Right index (or specified column)
     Use when: DataFrames share meaningful row indices
\`\`\`

## pd.merge() — SQL-Style Joins

merge() is Pandas most powerful combining tool. It works exactly like SQL JOINs, matching rows across two DataFrames based on a shared key column.

### VISUAL DIAGRAM: SQL JOIN Types

\`\`\`text
  FOUR JOIN TYPES — Visual
  ────────────────────────────────────────────────────────────────
  Left    Right   INNER     LEFT      RIGHT     OUTER
  ID Name ID Score matched   all left  all right all rows
   1  A    1   85    1 A 85   1 A  85   1  A  85  1 A 85
   2  B    2   92    2 B 92   2 B  92   2  B  92  2 B 92
   3  C    4   78    only     3 C NaN   4 NaN  78  3 C NaN
              5   91  matched  5 B NaN   5 NaN  91  4 NaN 78
                             keep all    keep     5 NaN 91
                             left rows   right

  how="inner"  -- Only rows present in BOTH tables
  how="left"   -- All left rows, NaN where right has no match
  how="right"  -- All right rows, NaN where left has no match
  how="outer"  -- ALL rows from BOTH tables, NaN where no match
\`\`\`

### 📌 Example 17 — pd.merge() Four Join Types

\`\`\`python
import pandas as pd

students = pd.DataFrame({
    "ID":   [1, 2, 3, 4],
    "Name": ["Alice","Bob","Charlie","Diana"],
    "Dept": ["IT","HR","IT","Finance"],
})

scores = pd.DataFrame({
    "ID":    [1, 2, 5, 6],
    "Score": [88, 72, 91, 85],
    "Exam":  ["Math","Math","Science","Math"],
})

# --- INNER join: only matching IDs (1 and 2) ---
print("INNER join:")
print(pd.merge(students, scores, on="ID", how="inner"))

# --- LEFT join: all students, NaN if no score ---
print("\\nLEFT join:")
print(pd.merge(students, scores, on="ID", how="left"))

# --- RIGHT join: all scores, NaN if no student ---
print("\\nRIGHT join:")
print(pd.merge(students, scores, on="ID", how="right"))

# --- OUTER join: everything ---
print("\\nOUTER join:")
print(pd.merge(students, scores, on="ID", how="outer"))
\`\`\`

\`\`\`output
INNER join (IDs 1 and 2 only):
   ID   Name Dept  Score  Exam
0   1  Alice   IT     88  Math
1   2    Bob   HR     72  Math

LEFT join (all 4 students):
   ID     Name     Dept  Score  Exam
0   1    Alice       IT   88.0  Math
1   2      Bob       HR   72.0  Math
2   3  Charlie       IT    NaN   NaN
3   4    Diana  Finance    NaN   NaN

RIGHT join (all 4 scores):
    ID   Name  Dept  Score     Exam
0    1  Alice    IT     88     Math
1    2    Bob    HR     72     Math
2    5    NaN   NaN     91  Science
3    6    NaN   NaN     85     Math

OUTER join (6 unique rows):
    ID     Name     Dept  Score     Exam
0    1    Alice       IT   88.0     Math
1    2      Bob       HR   72.0     Math
2    3  Charlie       IT    NaN      NaN
3    4    Diana  Finance    NaN      NaN
4    5      NaN      NaN   91.0  Science
5    6      NaN      NaN   85.0     Math
\`\`\`

## Merge on Multiple Keys and with Suffixes

### 📌 Example 18 — Multiple Keys and Suffixes

\`\`\`python
import pandas as pd

# --- Merge on multiple keys ---
df1 = pd.DataFrame({
    "Name": ["Alice","Alice","Bob","Bob"],
    "Year": [2023, 2024, 2023, 2024],
    "Sales": [100, 120, 80, 95],
})
df2 = pd.DataFrame({
    "Name": ["Alice","Alice","Bob","Bob"],
    "Year": [2023, 2024, 2023, 2024],
    "Target": [110, 115, 85, 100],
})

merged = pd.merge(df1, df2, on=["Name","Year"])
print("Merge on multiple keys:")
print(merged)

# --- Suffixes when column names overlap ---
df_a = pd.DataFrame({"ID":[1,2,3], "Score":[88,72,91], "Name":["A","B","C"]})
df_b = pd.DataFrame({"ID":[1,2,3], "Score":[90,75,85], "Name":["A","B","C"]})

print("\\nWith suffixes:")
print(pd.merge(df_a, df_b, on="ID", suffixes=("_Midterm","_Final")))
\`\`\`

\`\`\`output
Merge on multiple keys:
    Name  Year  Sales  Target
0  Alice  2023    100     110
1  Alice  2024    120     115
2    Bob  2023     80      85
3    Bob  2024     95     100

With suffixes:
   ID  Score_Midterm Name_Midterm  Score_Final Name_Final
0   1             88            A           90          A
1   2             72            B           75          B
2   3             91            C           85          C
\`\`\`

## pd.concat() — Stacking DataFrames

concat() stacks DataFrames along an axis. axis=0 stacks vertically (adds rows). axis=1 stacks horizontally (adds columns). It is simpler than merge() but does not do any key-matching.

### 📌 Example 19 — pd.concat()

\`\`\`python
import pandas as pd

df1 = pd.DataFrame({"Name":["Alice","Bob"], "Score":[88,72]}, index=[0,1])
df2 = pd.DataFrame({"Name":["Charlie","Diana"], "Score":[91,85]}, index=[2,3])
df3 = pd.DataFrame({"Name":["Eve"], "Score":[79]}, index=[4])

# --- Stack rows (axis=0) ---
print("Vertical concat (axis=0):")
print(pd.concat([df1, df2, df3]))

# --- Reset index after concat ---
stacked = pd.concat([df1, df2, df3], ignore_index=True)
print("\\nWith ignore_index=True:")
print(stacked)

# --- concat keys to track source ---
labeled = pd.concat([df1, df2], keys=["Batch1","Batch2"])
print("\\nWith keys (multi-index):")
print(labeled)

# --- Horizontal concat (axis=1) ---
names = pd.DataFrame({"Name":["Alice","Bob","Charlie"]})
scores = pd.DataFrame({"Math":[85,72,91],"Science":[92,78,85]})
print("\\nHorizontal concat (axis=1):")
print(pd.concat([names, scores], axis=1))
\`\`\`

\`\`\`output
Vertical concat:
      Name  Score
0    Alice     88
1      Bob     72
2  Charlie     91
3    Diana     85
4      Eve     79

With ignore_index=True (fresh 0-4 index)

With keys:
              Name  Score
Batch1 0    Alice     88
       1      Bob     72
Batch2 2  Charlie     91
       3    Diana     85

Horizontal concat:
      Name  Math  Science
0    Alice    85       92
1      Bob    72       78
2  Charlie    91       85
\`\`\`

## DataFrame.join() and merge_asof()

### 📌 Example 20 — join() and merge_asof()

\`\`\`python
import pandas as pd

# --- join() -- index-based ---
left = pd.DataFrame({
    "Math":[85,72,91]
}, index=["Alice","Bob","Charlie"])

right = pd.DataFrame({
    "Science":[92,78,85],
    "English":[88,75,90]
}, index=["Alice","Bob","Charlie"])

print("join() on index:")
print(left.join(right))

# --- merge_asof: nearest-match (great for time series) ---
trades = pd.DataFrame({
    "time":  pd.to_datetime(["09:01","09:05","09:10","09:15"]),
    "price": [100.1, 100.5, 101.2, 100.8],
})
quotes = pd.DataFrame({
    "time": pd.to_datetime(["09:00","09:03","09:08","09:12"]),
    "bid":  [99.9, 100.2, 101.0, 100.6],
})

print("\\nmerge_asof (match each trade to last quote):")
print(pd.merge_asof(trades, quotes, on="time"))
\`\`\`

\`\`\`output
join() on index:
         Math  Science  English
Alice      85       92       88
Bob        72       78       75
Charlie    91       85       90

merge_asof (nearest-match):
                  time  price    bid
0  2024-01-01 09:01:00  100.1   99.9
1  2024-01-01 09:05:00  100.5  100.2
2  2024-01-01 09:10:00  101.2  101.0
3  2024-01-01 09:15:00  100.8  100.6
\`\`\`

## Lesson 9 — Combining Functions Reference

| Function | Strategy | Matches On | Best Use Case |
| --- | --- | --- | --- |
| pd.merge(how="inner") | SQL INNER JOIN | Key column | Only common rows |
| pd.merge(how="left") | SQL LEFT JOIN | Key column | Keep all left rows |
| pd.merge(how="right") | SQL RIGHT JOIN | Key column | Keep all right rows |
| pd.merge(how="outer") | SQL FULL OUTER | Key column | Keep all rows both sides |
| pd.concat(axis=0) | Vertical stack | Column names | Append more rows |
| pd.concat(axis=1) | Horizontal stack | Row index | Add columns side-by-side |
| df.join() | Index join | Row index | Shared index tables |
| pd.merge_asof() | Nearest match | Sorted key | Time series, sensor data |
| pd.merge_ordered() | Ordered merge | Key column | Time-ordered fill |`,

10: `# Sorting, Ranking & Aggregation

**In this lesson:** sort_values() · sort_index() · rank() · nlargest/nsmallest · value_counts() · unique/nunique · cumulative functions

## sort_values() — Sort by Column Values

### SYNTAX — sort_values()

\`\`\`python
df.sort_values("col")
df.sort_values("col", ascending=False)    # Descending
df.sort_values(["col1","col2"])            # Multi-column sort
df.sort_values(["col1","col2"], ascending=[True, False])
df.sort_values("col", na_position="last") # NaN at end (default)
df.sort_values("col", na_position="first")# NaN at start
df.sort_values("col", inplace=True)       # Modify original
\`\`\`

### 📌 Example 21 — sort_values()

\`\`\`python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    "Name":   ["Alice","Bob","Charlie","Diana","Eve","Frank"],
    "Dept":   ["IT","HR","IT","Finance","HR","Finance"],
    "Score":  [88, 72, 91, 95, np.nan, 85],
    "Salary": [75000,55000,82000,90000,60000,85000],
})

# --- Single column sort ---
print("Sort by Score descending:")
print(df.sort_values("Score", ascending=False))

# --- Multi-column sort ---
print("\\nSort by Dept ASC then Score DESC:")
print(df.sort_values(["Dept","Score"], ascending=[True,False]))

# --- NaN handling ---
print("\\nNaN first:")
print(df.sort_values("Score", na_position="first")[["Name","Score"]])
\`\`\`

\`\`\`output
Sort by Score descending:
      Name     Dept  Score  Salary
3    Diana  Finance   95.0   90000
2  Charlie       IT   91.0   82000
0    Alice       IT   88.0   75000
5    Frank  Finance   85.0   85000
1      Bob       HR   72.0   55000
4      Eve       HR    NaN   60000

Sort by Dept ASC then Score DESC:
      Name     Dept  Score  Salary
3    Diana  Finance   95.0   90000
5    Frank  Finance   85.0   85000
1      Bob       HR   72.0   55000
4      Eve       HR    NaN   60000
2  Charlie       IT   91.0   82000
0    Alice       IT   88.0   75000
\`\`\`

## sort_index() — Sort by Index

### 📌 Example 22 — sort_index()

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Score": [88,72,91,95,85]
}, index=["Charlie","Alice","Eve","Bob","Diana"])

# Sort by row index alphabetically
print("Sort by row index:")
print(df.sort_index())

# Sort columns alphabetically
df2 = pd.DataFrame({"Zebra":[1,2],"Apple":[3,4],"Mango":[5,6]})
print("\\nSort columns (axis=1):")
print(df2.sort_index(axis=1))

# Reverse index order
print("\\nReverse index:")
print(df.sort_index(ascending=False))
\`\`\`

\`\`\`output
Sort by row index:
         Score
Alice       72
Bob         95
Charlie     88
Diana       85
Eve         91

Sort columns:
   Apple  Mango  Zebra
0      3      5      1
1      4      6      2
\`\`\`

## rank() — Rank Values Within a Series

rank() assigns a rank to each value. When values are equal (ties), it handles them according to the method parameter. This is essential for leaderboards, percentiles, and competition scoring.

### SYNTAX — rank()

\`\`\`python
series.rank(method="average")   # Average rank of tied values (default)
series.rank(method="min")       # Lowest rank for ties
series.rank(method="max")       # Highest rank for ties
series.rank(method="first")     # First occurrence gets lower rank
series.rank(method="dense")     # No gaps in ranks (1,2,2,3 not 1,2,2,4)
series.rank(ascending=False)    # Rank 1 = highest value
\`\`\`

### 📌 Example 23 — rank()

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Name":  ["Alice","Bob","Charlie","Diana","Eve","Frank"],
    "Score": [88, 72, 91, 91, 85, 72],
})

# Various rank methods
df["rank_avg"]   = df["Score"].rank(method="average", ascending=False)
df["rank_min"]   = df["Score"].rank(method="min",     ascending=False)
df["rank_dense"] = df["Score"].rank(method="dense",   ascending=False)
df["rank_first"] = df["Score"].rank(method="first",   ascending=False)

print(df.sort_values("rank_avg"))

# Rank within group using transform
df2 = pd.DataFrame({
    "Name":  ["Alice","Bob","Charlie","Diana","Eve"],
    "Dept":  ["IT","HR","IT","HR","IT"],
    "Score": [88, 72, 91, 85, 84],
})
df2["Dept_Rank"] = df2.groupby("Dept")["Score"].rank(ascending=False)
print("\\nRank within department:")
print(df2.sort_values(["Dept","Dept_Rank"]))
\`\`\`

\`\`\`output
      Name  Score  rank_avg  rank_min  rank_dense  rank_first
2  Charlie     91       1.0       1.0         1.0         1.0
3    Diana     91       1.0       1.0         1.0         2.0  <- tie handled
0    Alice     88       3.0       3.0         2.0         3.0
4      Eve     85       4.0       4.0         3.0         4.0
1      Bob     72       5.5       5.0         4.0         5.0  <- tie handled
5    Frank     72       5.5       5.0         4.0         6.0

Rank within department:
      Name Dept  Score  Dept_Rank
1      Bob   HR     72        2.0
3    Diana   HR     85        1.0
0    Alice   IT     88        2.0
4      Eve   IT     84        3.0
2  Charlie   IT     91        1.0
\`\`\`

## nlargest() and nsmallest()

nlargest() and nsmallest() return the n rows with the highest or lowest values in a column. They are much faster than sort_values().head(n) for large datasets.

### 📌 Example 24 — nlargest() and nsmallest()

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Name":   ["Alice","Bob","Charlie","Diana","Eve","Frank","Grace"],
    "Salary": [75000,55000,82000,90000,60000,85000,70000],
    "Score":  [88, 72, 91, 95, 78, 89, 84],
})

# Top 3 salaries
print("Top 3 salaries:")
print(df.nlargest(3, "Salary"))

# Bottom 3 scores
print("\\nBottom 3 scores:")
print(df.nsmallest(3, "Score"))

# On a Series
print("\\nTop 3 scores (Series):")
print(df["Score"].nlargest(3))
\`\`\`

\`\`\`output
Top 3 salaries:
     Name  Salary  Score
3   Diana   90000     95
5   Frank   85000     89
2  Charlie   82000     91

Bottom 3 scores:
    Name  Salary  Score
1    Bob   55000     72
4    Eve   60000     78
6  Grace   70000     84

Top 3 scores (Series):
3    95
2    91
5    89
Name: Score, dtype: int64
\`\`\`

## value_counts() — Frequency Counting

value_counts() counts how often each unique value appears. It is the fastest way to understand the distribution of a categorical column.

### 📌 Example 25 — value_counts()

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Grade":  ["A","B","A","C","A","B","D","A","C","B"],
    "Dept":   ["IT","HR","IT","Finance","HR","IT","Finance","IT","HR","HR"],
})

# --- Basic frequency count ---
print("Grade counts:")
print(df["Grade"].value_counts())

# --- Normalise to proportions ---
print("\\nGrade proportions:")
print(df["Grade"].value_counts(normalize=True).round(3))

# --- Sort by index (alphabetical) ---
print("\\nAlphabetical order:")
print(df["Grade"].value_counts().sort_index())

# --- Count NaN too ---
import numpy as np
df2 = pd.Series(["A","B",np.nan,"A","B","B",np.nan])
print("\\nWith dropna=False:")
print(df2.value_counts(dropna=False))

# --- value_counts as crosstab ---
print("\\nGrade vs Dept crosstab:")
print(pd.crosstab(df["Grade"], df["Dept"]))
\`\`\`

\`\`\`output
Grade counts:
A    4
B    3
C    2
D    1
Name: Grade, dtype: int64

Grade proportions:
A    0.4
B    0.3
C    0.2
D    0.1

Alphabetical order:
A    4
B    3
C    2
D    1

With dropna=False:
B      3
A      2
NaN    2

Grade vs Dept crosstab:
Dept    Finance  HR  IT
Grade
A             0   1   3
B             0   3   1
C             1   1   0
D             1   0   0
\`\`\`

## unique() and nunique()

### 📌 Example 26 — unique() and nunique()

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Grade": ["A","B","A","C","A","B","D","A"],
    "Dept":  ["IT","HR","IT","Finance","HR","IT","Finance","IT"],
})

# --- unique(): get distinct values as array ---
print("Unique grades:", df["Grade"].unique())
print("Unique depts: ", df["Dept"].unique())

# --- nunique(): count of distinct values ---
print("\\nNumber of unique grades:", df["Grade"].nunique())
print("Number of unique depts: ", df["Dept"].nunique())

# --- Per-column unique counts ---
print("\\nnunique per column:")
print(df.nunique())

# --- nunique with dropna ---
import numpy as np
col = pd.Series(["A","B",np.nan,"A","C",np.nan])
print("nunique (no NaN):", col.nunique())
print("nunique (with NaN):", col.nunique(dropna=False))
\`\`\`

\`\`\`output
Unique grades: ["A" "B" "C" "D"]
Unique depts:  ["IT" "HR" "Finance"]

Number of unique grades: 4
Number of unique depts:  3

nunique per column:
Grade    4
Dept     3
dtype: int64

nunique (no NaN): 3
nunique (with NaN): 4
\`\`\`

## Cumulative Functions — cumsum, cumprod, cummax, cummin

Cumulative functions compute running totals, products, maximums, and minimums across a Series or DataFrame. They are invaluable for tracking running balances, stock prices, records, and progress over time.

### 📌 Example 27 — Cumulative Functions

\`\`\`python
import pandas as pd

monthly_sales = pd.DataFrame({
    "Month": ["Jan","Feb","Mar","Apr","May","Jun"],
    "Sales": [100, 150, 120, 200, 180, 220],
    "Units": [10, 15, 12, 20, 18, 22],
})

# --- cumsum: running total ---
monthly_sales["Running_Sales"] = monthly_sales["Sales"].cumsum()

# --- cumprod: running product (e.g., compounding growth rate) ---
growth = pd.Series([1.05, 1.08, 0.97, 1.12, 1.03])
monthly_sales["Growth_Rate_cumsum"] = growth.cumprod().tolist() + [None]

# --- cummax: running highest value so far ---
monthly_sales["Best_Month_So_Far"] = monthly_sales["Sales"].cummax()

# --- cummin: running lowest value so far ---
monthly_sales["Worst_Month_So_Far"] = monthly_sales["Sales"].cummin()

print("Sales analytics:")
print(monthly_sales[["Month","Sales","Running_Sales","Best_Month_So_Far","Worst_Month_So_Far"]])
\`\`\`

\`\`\`output
Sales analytics:
  Month  Sales  Running_Sales  Best_Month_So_Far  Worst_Month_So_Far
0   Jan    100            100                100                 100
1   Feb    150            250                150                 100
2   Mar    120            370                150                 100
3   Apr    200            570                200                 100
4   May    180            750                200                 100
5   Jun    220            970                220                 100
\`\`\`

## Lesson 10 — Complete Reference

| Function | Purpose | Key Parameter | Use Case |
| --- | --- | --- | --- |
| sort_values(col) | Sort by column value | ascending, na_position | Leaderboard, ranking |
| sort_index() | Sort by index label | axis, ascending | Alphabetical index |
| rank() | Assign rank numbers | method, ascending | Competition scoring |
| nlargest(n, col) | Top n rows by column | — | Top-N reports |
| nsmallest(n, col) | Bottom n rows | — | Bottom-N reports |
| value_counts() | Frequency of each value | normalize, dropna | Category distribution |
| unique() | Distinct values as array | — | Category labels list |
| nunique() | Count of distinct values | dropna | Cardinality check |
| cumsum() | Running total | axis | Running balance, YTD |
| cumprod() | Running product | axis | Compounding interest |
| cummax() | Running maximum | axis | All-time high tracker |
| cummin() | Running minimum | axis | Record low tracker |

## Quick Reference Cheat Sheet

*Lessons 6–10: Missing Data, Transform, GroupBy, Merge, Sort*

### L6: Missing Data

\`\`\`text
isnull() / isna()
notnull() / notna()
isnull().sum() -- count per col
dropna() -- remove rows/cols
dropna(how="all")
dropna(thresh=n, subset=[])
fillna(value) / fillna(mean)
fillna(method="ffill"/"bfill")
interpolate(method="linear")
replace(-999, np.nan)
\`\`\`

### L7: Data Transformation

\`\`\`text
df.apply(func, axis=0) -- col
df.apply(func, axis=1) -- row
s.map(dict/func) -- element
df.map(func) -- every cell
df.transform(func) -- same shape
df.pipe(func, args) -- chain
df.assign(col=lambda x:...)
assign multiple cols at once
lambda: quick inline function
\`\`\`

### L8: GroupBy

\`\`\`text
df.groupby("col")
g["col"].mean()/sum()/count()
g.agg(["mean","max"])
g.agg(Avg=("col","mean"))
g.transform("mean") -- broadcast
g.filter(lambda g: len(g)>2)
g.apply(custom_func)
groupby(as_index=False)
g.size() -- group counts
\`\`\`

### L9: Merging & Concat

\`\`\`text
pd.merge(l,r,on="id")
pd.merge(..., how="inner")
pd.merge(..., how="left")
pd.merge(..., how="outer")
pd.merge(on=["a","b"])
suffixes=("_x","_y")
pd.concat([df1,df2])
pd.concat(axis=1)
pd.concat(ignore_index=True)
df.join(other) -- index join
\`\`\`

### L10: Sorting, Ranking & Aggregation

\`\`\`text
sort_values("col")
sort_values("col", ascending=False)
sort_values(["a","b"])
sort_index() -- by label
sort_index(axis=1) -- cols
\`\`\`

\`\`\`text
rank(method="dense")
rank(ascending=False) -- highest=1
nlargest(5, "col")
nsmallest(5, "col")
value_counts(normalize=True)
unique() / nunique()
cumsum() / cumprod()
cummax() / cummin()
\`\`\`

:::tip
INTERMEDIATE CHECKLIST: 1) Always investigate missing data first with isnull().sum() 2) Use agg() with named aggregations for clean summary tables 3) Prefer merge() over concat() when matching on keys 4) Use transform() to add group stats back to original shape 5) value_counts(normalize=True) for quick category distributions.
:::

:::challenge
**WHAT COMES NEXT**
Next steps: Lesson 11 (Reshaping: pivot_table, melt, stack, unstack), Lesson 12 (Time Series: DatetimeIndex, resample, rolling), Lesson 13 (String operations), Lesson 14 (Categorical data), Lesson 15 (Performance and real-world pipelines).
:::`,

11: `# Advanced Indexing & MultiIndex

**In this lesson:** set_index() · reset_index() · MultiIndex · xs() · IndexSlice · stack() · unstack() · swaplevel()

## set_index() and reset_index()

By default Pandas assigns a RangeIndex (0, 1, 2 ...) as row labels. set_index() promotes one or more data columns to become the index. reset_index() reverses this, converting the index back into regular columns.

### SYNTAX — set_index / reset_index

\`\`\`python
df.set_index("col")                     # One column as index
df.set_index(["col1","col2"])            # MultiIndex from two cols
df.set_index("col", drop=True)          # Remove col from data (default)
df.set_index("col", drop=False)         # Keep col in data too
df.set_index("col", inplace=True)

df.reset_index()                        # Index -> column, fresh RangeIndex
df.reset_index(drop=True)               # Discard the index (do not keep)
df.reset_index(level=0)                 # Reset only one level of MultiIndex
\`\`\`

### 📌 Example 1 — set_index() and reset_index()

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "ID":    [101, 102, 103, 104],
    "Name":  ["Alice","Bob","Charlie","Diana"],
    "Dept":  ["IT","HR","IT","Finance"],
    "Score": [88, 72, 91, 95],
})

# --- Set single column as index ---
df1 = df.set_index("Name")
print("Name as index:")
print(df1)

# --- Access by index label ---
print("\\nAlice row:")
print(df1.loc["Alice"])

# --- Reset: bring Name back as column ---
df2 = df1.reset_index()
print("\\nAfter reset_index:")
print(df2.columns.tolist())

# --- Set multiple columns -> MultiIndex ---
df3 = df.set_index(["Dept","Name"])
print("\\nMultiIndex (Dept, Name):")
print(df3)
\`\`\`

\`\`\`output
Name as index:
          ID Dept  Score
Name
Alice    101   IT     88
Bob      102   HR     72
Charlie  103   IT     91
Diana    104  Finance  95

Alice row:
ID        101
Dept       IT
Score      88

After reset_index: ["Name","ID","Dept","Score"]

MultiIndex (Dept, Name):
                  ID  Score
Dept    Name
Finance Diana    104     95
HR      Bob      102     72
IT      Alice    101     88
        Charlie  103     91
\`\`\`

## MultiIndex — Hierarchical Indexing

A MultiIndex (hierarchical index) lets you have multiple levels of row or column labels. This is essential for panel data, grouped data, and any structure where a single index is not sufficient to uniquely identify rows.

### VISUAL DIAGRAM: MultiIndex Structure

\`\`\`text
  MULTIINDEX ANATOMY
  ────────────────────────────────────────────────────────────────
                       Score  Salary
  Level 0  Level 1
  (Dept)   (Name)
  Finance  Diana       95    90000
  HR       Bob         72    55000
           Eve         78    60000
  IT       Alice       88    75000
           Charlie     91    82000

  df.loc["IT"]              -> all IT rows
  df.loc[("IT","Alice")]    -> single row: Alice in IT
  df.loc["IT":"HR"]         -> slice between outer levels
  df.xs("Alice", level=1)   -> cross-section: Alice across all depts
  df.index.get_level_values(0) -> [Finance, HR, HR, IT, IT]
\`\`\`

### 📌 Example 2 — MultiIndex

\`\`\`python
import pandas as pd

# --- Build MultiIndex DataFrame ---
data = {
    "Score":  [95, 72, 78, 88, 91],
    "Salary": [90000,55000,60000,75000,82000],
}
idx = pd.MultiIndex.from_tuples([
    ("Finance","Diana"),
    ("HR","Bob"),
    ("HR","Eve"),
    ("IT","Alice"),
    ("IT","Charlie"),
], names=["Dept","Name"])

df = pd.DataFrame(data, index=idx)
print("MultiIndex DataFrame:")
print(df)

# --- Access outer level ---
print("\\nAll IT rows:")
print(df.loc["IT"])

# --- Access specific cell ---
print("\\nAlice score:", df.loc[("IT","Alice"), "Score"])

# --- get_level_values ---
print("\\nLevel 0 values:", df.index.get_level_values(0).tolist())
print("Level 1 values:", df.index.get_level_values("Name").tolist())
\`\`\`

\`\`\`output
MultiIndex DataFrame:
                    Score  Salary
Dept    Name
Finance Diana          95   90000
HR      Bob            72   55000
        Eve            78   60000
IT      Alice          88   75000
        Charlie        91   82000

All IT rows:
         Score  Salary
Name
Alice       88   75000
Charlie     91   82000

Alice score: 88

Level 0: ["Finance","HR","HR","IT","IT"]
Level 1: ["Diana","Bob","Eve","Alice","Charlie"]
\`\`\`

## xs() and IndexSlice

### 📌 Example 3 — xs() and IndexSlice

\`\`\`python
import pandas as pd
import numpy as np

idx = pd.MultiIndex.from_tuples([
    ("IT","Alice",2023),("IT","Alice",2024),
    ("IT","Bob",2023),("IT","Bob",2024),
    ("HR","Carol",2023),("HR","Carol",2024),
], names=["Dept","Name","Year"])

df = pd.DataFrame({"Score": [88,91,72,75,85,87], "Bonus": [5,8,2,3,6,7]}, index=idx)
print("3-level MultiIndex:")
print(df)

# --- xs: cross-section at a specific level ---
print("\\nxs: Year=2024 (cross-section across all depts/names):")
print(df.xs(2024, level="Year"))

print("\\nxs: Name=Alice (across all years):")
print(df.xs("Alice", level="Name"))

# --- IndexSlice for clean MultiIndex slicing ---
idx_sl = pd.IndexSlice
print("\\nIndexSlice IT dept, all names, 2024:")
print(df.loc[idx_sl["IT", :, 2024], :])
\`\`\`

\`\`\`output
xs: Year=2024:
               Score  Bonus
Dept Name
IT   Alice        91      8
     Bob          75      3
HR   Carol        87      7

xs: Name=Alice:
             Score  Bonus
Dept Year
IT   2023       88      5
     2024       91      8

IndexSlice IT / 2024:
              Score  Bonus
Dept Name Year
IT   Alice 2024  91      8
     Bob   2024  75      3
\`\`\`

## stack() and unstack() — Reshaping Along Index

stack() moves the innermost column level into the row index (columns -> rows). unstack() does the reverse (rows -> columns). Together they let you pivot between wide and long formats while preserving the MultiIndex structure.

### VISUAL DIAGRAM: stack vs unstack

\`\`\`text
  STACK vs UNSTACK
  ────────────────────────────────────────────────────────────────
  WIDE (unstacked):           LONG (stacked):
  Name   Math  Science        Name      Subject  Score
  Alice   85      92    ===>  Alice     Math       85
  Bob     72      78          Alice     Science    92
                              Bob       Math       72
                              Bob       Science    78

  df.stack()   -> columns become innermost row index level
  df.unstack() -> innermost row index level becomes columns

  stack()   WIDE -> LONG   (more rows, fewer columns)
  unstack() LONG -> WIDE   (fewer rows, more columns)
\`\`\`

### 📌 Example 4 — stack() and unstack()

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Math":    [85,72,91],
    "Science": [92,78,85],
    "English": [88,75,90],
}, index=["Alice","Bob","Charlie"])

print("Original (wide):")
print(df)

# --- stack: wide -> long ---
stacked = df.stack()
print("\\nAfter stack():")
print(stacked)
print("Type:", type(stacked))

# --- unstack: long -> wide ---
unstacked = stacked.unstack()
print("\\nAfter unstack() (back to wide):")
print(unstacked)

# --- Practical: unstack on MultiIndex GroupBy result ---
data = pd.DataFrame({
    "Dept":  ["IT","IT","HR","HR","Finance","Finance"],
    "Year":  [2023,2024,2023,2024,2023,2024],
    "Score": [85,88,72,75,91,95],
})
pivot = data.groupby(["Dept","Year"])["Score"].mean().unstack("Year")
print("\\nGroupBy + unstack (Dept x Year table):")
print(pivot)
\`\`\`

\`\`\`output
Original (wide):
         Math  Science  English
Alice      85       92       88
Bob        72       78       75
Charlie    91       85       90

After stack():
Alice    Math       85
         Science    92
         English    88
Bob      Math       72
         Science    78
         English    75
Charlie  Math       91
...

GroupBy + unstack:
Year      2023  2024
Dept
Finance     91    95
HR          72    75
IT          85    88
\`\`\`

## swaplevel() and reorder_levels()

### 📌 Example 5 — swaplevel()

\`\`\`python
import pandas as pd

idx = pd.MultiIndex.from_tuples([
    ("IT","Alice"),("IT","Bob"),("HR","Carol"),("HR","Dave"),
], names=["Dept","Name"])
df = pd.DataFrame({"Score":[88,72,85,79]}, index=idx)

print("Original (Dept, Name):")
print(df)

# --- swaplevel: swap two index levels ---
swapped = df.swaplevel()
print("\\nAfter swaplevel (Name, Dept):")
print(swapped)

# --- sort after swap (often needed) ---
print("\\nSorted:")
print(swapped.sort_index())

# --- reorder_levels with specific order ---
print("\\nreorder_levels([Name,Dept]):")
print(df.swaplevel().sort_index())
\`\`\`

\`\`\`output
Original (Dept, Name):
              Score
Dept Name
IT   Alice       88
     Bob         72
HR   Carol       85
     Dave        79

After swaplevel:
              Score
Name  Dept
Alice IT         88
Bob   IT         72
Carol HR         85
Dave  HR         79
\`\`\``,

12: `# Reshaping & Pivoting

**In this lesson:** pivot() · pivot_table() · melt() · crosstab() · get_dummies() · pd.cut() · pd.qcut()

## pivot() — Long to Wide

pivot() reshapes a long-format DataFrame into wide format using values from one column as new column headers. It requires unique row/column combinations — if duplicates exist, use pivot_table() instead.

### VISUAL DIAGRAM: Long vs Wide Format

\`\`\`text
  LONG FORMAT vs WIDE FORMAT
  ────────────────────────────────────────────────────────────────
  LONG (tidy, one row per observation):
  Name     Subject   Score
  Alice    Math        85
  Alice    Science     92
  Bob      Math        72
  Bob      Science     78

  WIDE (one row per entity, one col per variable):
  Name   Math  Science
  Alice    85       92
  Bob      72       78

  Long -> Wide: pivot() or pivot_table()
  Wide -> Long: melt()

  Long format is preferred for plotting and analysis.
  Wide format is easier for humans to read and compare.
\`\`\`

### 📌 Example 6 — pivot()

\`\`\`python
import pandas as pd

# Long format data
df_long = pd.DataFrame({
    "Name":    ["Alice","Alice","Alice","Bob","Bob","Bob"],
    "Subject": ["Math","Science","English","Math","Science","English"],
    "Score":   [85, 92, 88, 72, 78, 75],
})
print("Long format:")
print(df_long)

# --- pivot: long -> wide ---
df_wide = df_long.pivot(index="Name", columns="Subject", values="Score")
print("\\nWide format (pivot):")
print(df_wide)

# Clean column names after pivot
df_wide.columns.name = None
df_wide = df_wide.reset_index()
print("\\nCleaned:")
print(df_wide)
\`\`\`

\`\`\`output
Long format:
    Name  Subject  Score
0  Alice     Math     85
1  Alice  Science     92
2  Alice  English     88
3    Bob     Math     72
4    Bob  Science     78
5    Bob  English     75

Wide format:
Subject  English  Math  Science
Name
Alice         88    85       92
Bob           75    72       78

Cleaned:
    Name  English  Math  Science
0  Alice       88    85       92
1    Bob       75    72       78
\`\`\`

## pivot_table() — Pivot with Aggregation

pivot_table() is the powerful version of pivot(). It handles duplicate values by aggregating them, supports multiple aggregation functions, fills NaN with fill_value, and adds subtotals with margins=True.

### 📌 Example 7 — pivot_table()

\`\`\`python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    "Name":  ["Alice","Alice","Bob","Bob","Alice","Bob"],
    "Year":  [2023,2024,2023,2024,2023,2024],
    "Dept":  ["IT","IT","HR","HR","IT","HR"],
    "Score": [85, 91, 72, 75, 88, 78],
})

# --- Basic pivot_table ---
pt = df.pivot_table(values="Score", index="Name", columns="Year", aggfunc="mean")
print("pivot_table (mean score per person per year):")
print(pt)

# --- Multiple aggregation functions ---
pt2 = df.pivot_table(values="Score", index="Dept",
    aggfunc={"Score": ["mean","count","max"]})
print("\\nMultiple agg functions:")
print(pt2)

# --- margins=True: add subtotals ---
pt3 = df.pivot_table(values="Score", index="Name",
    columns="Dept", aggfunc="mean",
    margins=True, margins_name="Total",
    fill_value=0)
print("\\nWith margins (subtotals):")
print(pt3.round(1))
\`\`\`

\`\`\`output
pivot_table:
Year    2023   2024
Name
Alice   86.5   91.0
Bob     72.0   76.5

Multiple agg functions:
        Score
        count   max      mean
Dept
HR          3    78   75.000
IT          3    91   88.000

With margins:
Dept     HR     IT  Total
Name
Alice   0.0   88.0   88.0
Bob    75.0    0.0   75.0
Total  75.0   88.0   82.0
\`\`\`

## melt() — Wide to Long (Unpivot)

melt() is the inverse of pivot(). It transforms a wide DataFrame into a long (tidy) format by converting column headers into values. This is essential for preparing data for plotting with seaborn or for machine learning pipelines.

### SYNTAX — melt()

\`\`\`python
df.melt(
    id_vars=["Name"],      # Columns to keep as identifier
    value_vars=["Math","Science"],  # Columns to unpivot
    var_name="Subject",    # Name of the new variable column
    value_name="Score"     # Name of the new value column
)
\`\`\`

### 📌 Example 8 — melt()

\`\`\`python
import pandas as pd

# Wide format
df_wide = pd.DataFrame({
    "Name":    ["Alice","Bob","Charlie"],
    "Math":    [85, 72, 91],
    "Science": [92, 78, 85],
    "English": [88, 75, 90],
})
print("Wide:")
print(df_wide)

# --- melt: wide -> long ---
df_long = df_wide.melt(
    id_vars=["Name"],
    value_vars=["Math","Science","English"],
    var_name="Subject",
    value_name="Score"
)
print("\\nLong (melted):")
print(df_long.sort_values(["Name","Subject"]).reset_index(drop=True))

# --- melt all non-id columns ---
df_all = df_wide.melt(id_vars=["Name"])
print("\\nMelt all columns:")
print(df_all.head(6))
\`\`\`

\`\`\`output
Wide:
      Name  Math  Science  English
0    Alice    85       92       88
1      Bob    72       78       75
2  Charlie    91       85       90

Long (melted):
       Name  Subject  Score
0     Alice  English     88
1     Alice     Math     85
2     Alice  Science     92
3       Bob  English     75
4       Bob     Math     72
5       Bob  Science     78
6   Charlie  English     90
7   Charlie     Math     91
8   Charlie  Science     85
\`\`\`

## crosstab() — Cross-Tabulation

### 📌 Example 9 — crosstab()

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Dept":  ["IT","HR","IT","Finance","HR","Finance","IT","HR"],
    "Grade": ["A","C","A","B","A","A","C","B"],
    "Score": [88,72,91,85,78,92,80,75],
})

# --- Basic crosstab ---
print("Crosstab (Dept x Grade):")
print(pd.crosstab(df["Dept"], df["Grade"]))

# --- Normalise (proportions) ---
print("\\nNormalised (row %):")
print(pd.crosstab(df["Dept"], df["Grade"], normalize="index").round(2))

# --- With margins ---
print("\\nWith row and column totals:")
print(pd.crosstab(df["Dept"], df["Grade"], margins=True))

# --- With aggregation ---
print("\\nMean score by Dept x Grade:")
print(pd.crosstab(df["Dept"], df["Grade"], values=df["Score"], aggfunc="mean").round(1))
\`\`\`

\`\`\`output
Crosstab (Dept x Grade):
Grade    A  B  C
Dept
Finance  1  1  0
HR       1  1  1
IT       2  0  1

Normalised (row %):
Grade     A     B     C
Dept
Finance  0.5  0.5  0.00
HR       0.33 0.33 0.33
IT       0.67 0.00 0.33

With margins:
Grade    A  B  C  All
Dept
Finance  1  1  0    2
HR       1  1  1    3
IT       2  0  1    3
All      4  2  2    8
\`\`\`

## get_dummies() — One-Hot Encoding

get_dummies() converts categorical columns into binary (0/1) indicator columns. This is the most common feature-engineering step before feeding data into machine learning models.

### 📌 Example 10 — get_dummies()

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Name":  ["Alice","Bob","Charlie","Diana"],
    "Grade": ["A","B","A","C"],
    "Dept":  ["IT","HR","IT","Finance"],
    "Score": [88, 72, 91, 85],
})

# --- One-hot encode Grade ---
dummies = pd.get_dummies(df["Grade"], prefix="Grade")
print("One-hot encoded Grade:")
print(dummies)

# --- Add to DataFrame ---
df_enc = pd.concat([df[["Name","Score"]], dummies], axis=1)
print("\\nWith dummies:")
print(df_enc)

# --- Encode multiple columns at once ---
df_full = pd.get_dummies(df, columns=["Grade","Dept"], drop_first=False)
print("\\nMultiple columns encoded:")
print(df_full)

# --- drop_first=True avoids dummy variable trap ---
df_nodrop = pd.get_dummies(df, columns=["Grade"], drop_first=True)
print("\\ndrop_first=True (A dropped, B and C kept):")
print(df_nodrop)
\`\`\`

\`\`\`output
One-hot encoded Grade:
   Grade_A  Grade_B  Grade_C
0     True    False    False
1    False     True    False
2     True    False    False
3    False    False     True

With dummies:
      Name  Score  Grade_A  Grade_B  Grade_C
0    Alice     88     True    False    False
1      Bob     72    False     True    False
2  Charlie     91     True    False    False
3    Diana     85    False    False     True
\`\`\`

## pd.cut() and pd.qcut() — Binning Continuous Data

Binning converts continuous numerical data into discrete categories. pd.cut() bins by fixed value ranges. pd.qcut() bins by quantiles so each bin has approximately the same number of observations.

### 📌 Example 11 — pd.cut() and pd.qcut()

\`\`\`python
import pandas as pd
import numpy as np

scores = pd.Series([45, 55, 62, 71, 78, 82, 88, 91, 95, 99])

# --- pd.cut: fixed boundaries ---
bins = [0, 60, 70, 80, 90, 100]
labels = ["F","D","C","B","A"]
grade_cut = pd.cut(scores, bins=bins, labels=labels, right=True)
print("pd.cut (fixed ranges):")
print(pd.DataFrame({"Score": scores, "Grade": grade_cut}))

# --- pd.qcut: equal-frequency bins ---
qbins = pd.qcut(scores, q=4, labels=["Q1","Q2","Q3","Q4"])
print("\\npd.qcut (quartiles):")
print(pd.DataFrame({"Score": scores, "Quartile": qbins}))

# --- Include bin intervals in result ---
intervals = pd.cut(scores, bins=4)
print("\\nAuto bins with intervals:")
print(pd.DataFrame({"Score": scores, "Bin": intervals}))

# --- Count per bin ---
print("\\nCount per grade band:")
print(grade_cut.value_counts().sort_index())
\`\`\`

\`\`\`output
pd.cut (fixed ranges):
   Score Grade
0     45     F
1     55     F
2     62     D
3     71     C
4     78     C
5     82     B
6     88     B
7     91     A
8     95     A
9     99     A

pd.qcut (quartiles):
   Score Quartile
0     45       Q1
1     55       Q1
2     62       Q2
3     71       Q2
4     78       Q3
5     82       Q3
6     88       Q4
7     91       Q4
8     95       Q4
9     99       Q4

Count per grade band:
F    2
D    1
C    2
B    2
A    3
\`\`\``,

13: `# Time Series in Pandas

**In this lesson:** DatetimeIndex · pd.to_datetime() · pd.date_range() · resample() · rolling() · expanding() · shift() · diff() · Timezones · DateOffset

## DatetimeIndex and pd.to_datetime()

Pandas has first-class support for time series data. The DatetimeIndex stores timestamps as the row index, enabling powerful time-based selection, resampling, and rolling calculations.

### 📌 Example 12 — DatetimeIndex and to_datetime()

\`\`\`python
import pandas as pd
import numpy as np

# --- Parse dates from strings ---
dates_str = ["2024-01-15","2024-02-20","2024-03-10","2024-04-05"]
dt = pd.to_datetime(dates_str)
print("Parsed dates:", dt)
print("Type:", type(dt))

# --- Various date formats ---
formats = ["15/01/2024","Jan 15 2024","20240115","01-15-2024"]
for fmt in formats:
    parsed = pd.to_datetime(fmt, dayfirst=True)
    print(f"  {fmt!r:20} -> {parsed.date()}")

# --- Create DatetimeIndex from a column ---
df = pd.DataFrame({
    "date":  ["2024-01-01","2024-01-02","2024-01-03","2024-01-04"],
    "sales": [100, 150, 130, 180],
})
df["date"] = pd.to_datetime(df["date"])
df = df.set_index("date")
print("\\nTime-indexed DataFrame:")
print(df)

# --- Extract datetime components ---
df["year"]    = df.index.year
df["month"]   = df.index.month
df["weekday"] = df.index.day_name()
print("\\nWith extracted components:")
print(df)
\`\`\`

\`\`\`output
Parsed dates: DatetimeIndex(["2024-01-15","2024-02-20","2024-03-10","2024-04-05"])

Time-indexed DataFrame:
            sales
date
2024-01-01    100
2024-01-02    150
2024-01-03    130
2024-01-04    180

With extracted components:
            sales  year  month  weekday
2024-01-01    100  2024      1   Monday
2024-01-02    150  2024      1  Tuesday
2024-01-03    130  2024      1  Wednesday
2024-01-04    180  2024      1  Thursday
\`\`\`

## pd.date_range() — Generate Date Sequences

### SYNTAX — pd.date_range()

\`\`\`python
pd.date_range(start, end, freq="D")   # Daily between two dates
pd.date_range(start, periods=30, freq="D")  # 30 days from start

Useful freq strings:
  "D"  = calendar day     "B"  = business day
  "W"  = weekly           "ME" = month end
  "MS" = month start      "QE" = quarter end
  "YE" = year end         "h"  = hourly
  "T" or "min" = minute   "s"  = second
\`\`\`

### 📌 Example 13 — pd.date_range()

\`\`\`python
import pandas as pd
import numpy as np

# --- Daily date range ---
daily = pd.date_range("2024-01-01", "2024-01-07", freq="D")
print("Daily:", daily.tolist())

# --- Business days only ---
bdays = pd.date_range("2024-01-01", periods=5, freq="B")
print("Business days:", [str(d.date()) for d in bdays])

# --- Monthly (month start) ---
monthly = pd.date_range("2024-01-01", periods=6, freq="MS")
print("Monthly:", [str(d.date()) for d in monthly])

# --- Create a full sales time series ---
rng = np.random.default_rng(42)
dates = pd.date_range("2024-01-01", periods=365, freq="D")
sales = pd.Series(
    rng.integers(100, 500, 365) + np.sin(np.arange(365) * 2*np.pi/7) * 50,
    index=dates, name="Sales"
)
print("\\n365-day sales series:")
print(sales.head())
print("...", sales.tail())
\`\`\`

\`\`\`output
Daily: [2024-01-01, 2024-01-02, 2024-01-03, ..., 2024-01-07]
Business days: ["2024-01-01","2024-01-02","2024-01-03","2024-01-04","2024-01-05"]
Monthly: ["2024-01-01","2024-02-01","2024-03-01","2024-04-01","2024-05-01","2024-06-01"]

365-day sales series:
2024-01-01    316.0
2024-01-02    342.1
2024-01-03    388.7
2024-01-04    401.2
2024-01-05    283.5
Freq: D, Name: Sales, dtype: float64
\`\`\`

## resample() — Downsample and Upsample

resample() groups time series data by a time frequency and aggregates each group. Downsampling reduces frequency (daily -> weekly). Upsampling increases frequency (daily -> hourly), creating NaN that you then fill.

### 📌 Example 14 — resample()

\`\`\`python
import pandas as pd
import numpy as np

rng = np.random.default_rng(42)
dates = pd.date_range("2024-01-01", periods=90, freq="D")
daily = pd.Series(rng.integers(100, 500, 90), index=dates, name="Sales")

# --- Downsample: daily -> weekly (sum) ---
weekly = daily.resample("W").sum()
print("Weekly totals (first 4):")
print(weekly.head(4))

# --- Downsample: daily -> monthly (mean) ---
monthly = daily.resample("ME").mean().round(1)
print("\\nMonthly averages:")
print(monthly)

# --- Multiple stats ---
stats = daily.resample("ME").agg(["sum","mean","min","max"])
print("\\nMonthly stats:")
print(stats.round(1))

# --- Upsample: daily -> hourly (fill forward) ---
hourly = daily.resample("h").ffill()
print("\\nUpsampled to hourly (first 3):")
print(hourly.head(3))
\`\`\`

\`\`\`output
Weekly totals (first 4):
2024-01-07    1842
2024-01-14    2156
2024-01-21    1978
2024-01-28    2341
Freq: W-SUN, Name: Sales

Monthly averages:
2024-01-31    291.7
2024-02-29    298.4
2024-03-31    305.2

Monthly stats:
              sum   mean  min  max
2024-01-31   9043  291.7  104  496
2024-02-29   8654  298.4  112  489
2024-03-31   9464  305.2  108  498
\`\`\`

## rolling() — Rolling Window Calculations

rolling() computes moving (rolling) statistics over a sliding window. It is fundamental for smoothing noisy data, computing moving averages, and detecting trends in time series.

### VISUAL DIAGRAM: Rolling Window

\`\`\`text
  ROLLING WINDOW CONCEPT
  ────────────────────────────────────────────────────────────────
  Data: [100, 120, 110, 140, 130, 160, 150]
  Window size = 3

  Position 0: [100]              NaN   (not enough data)
  Position 1: [100,120]          NaN   (not enough data)
  Position 2: [100,120,110] mean = 110.0
  Position 3: [120,110,140] mean = 123.3
  Position 4: [110,140,130] mean = 126.7
  Position 5: [140,130,160] mean = 143.3
  Position 6: [130,160,150] mean = 146.7

  min_periods=1: compute even with fewer than window data points
\`\`\`

### 📌 Example 15 — rolling()

\`\`\`python
import pandas as pd
import numpy as np

dates = pd.date_range("2024-01-01", periods=10, freq="D")
prices = pd.Series([100,105,102,108,112,109,115,118,114,120], index=dates)

# --- 3-day rolling mean ---
prices_df = pd.DataFrame({"Price": prices})
prices_df["MA3"]  = prices.rolling(window=3).mean().round(2)
prices_df["MA5"]  = prices.rolling(window=5).mean().round(2)
prices_df["Std3"] = prices.rolling(window=3).std().round(2)
print("Price with rolling statistics:")
print(prices_df)

# --- min_periods: compute even with less data ---
prices_df["MA3_minper"] = prices.rolling(3, min_periods=1).mean().round(2)
print("\\nWith min_periods=1 (no NaN at start):")
print(prices_df[["Price","MA3","MA3_minper"]].head(5))
\`\`\`

\`\`\`output
Price with rolling statistics:
            Price    MA3    MA5  Std3
2024-01-01    100    NaN    NaN   NaN
2024-01-02    105    NaN    NaN   NaN
2024-01-03    102  102.3    NaN  2.52
2024-01-04    108  105.0    NaN  3.06
2024-01-05    112  107.3  105.4  5.03
2024-01-06    109  109.7  107.2  2.08
2024-01-07    115  112.0  109.2  3.00
2024-01-08    118  114.0  112.4  4.58
2024-01-09    114  115.7  113.6  2.08
2024-01-10    120  117.3  115.2  3.06
\`\`\`

## expanding(), shift() and diff()

### 📌 Example 16 — expanding(), shift(), diff()

\`\`\`python
import pandas as pd

dates = pd.date_range("2024-01", periods=6, freq="ME")
sales = pd.Series([100,130,115,160,145,180], index=dates)

# --- expanding: cumulative statistics (window grows) ---
df = pd.DataFrame({"Sales": sales})
df["Running_Max"]  = sales.expanding().max()
df["Running_Mean"] = sales.expanding().mean().round(1)
print("Expanding window stats:")
print(df)

# --- shift: lag (previous period comparison) ---
df["Prev_Month"]  = sales.shift(1)         # Lag 1
df["Next_Month"]  = sales.shift(-1)         # Lead 1
print("\\nWith shift (lag/lead):")
print(df[["Sales","Prev_Month","Next_Month"]])

# --- diff: period-over-period change ---
df["MoM_Change"] = sales.diff()             # month-over-month absolute
df["MoM_Pct"]    = sales.pct_change().mul(100).round(1)  # percentage
print("\\nMonth-over-Month changes:")
print(df[["Sales","MoM_Change","MoM_Pct"]])
\`\`\`

\`\`\`output
Expanding window stats:
            Sales  Running_Max  Running_Mean
2024-01-31    100        100.0         100.0
2024-02-29    130        130.0         115.0
2024-03-31    115        130.0         115.0
2024-04-30    160        160.0         126.3
2024-05-31    145        160.0         130.0
2024-06-30    180        180.0         138.3

Month-over-Month changes:
            Sales  MoM_Change  MoM_Pct
2024-01-31    100         NaN      NaN
2024-02-29    130        30.0     30.0
2024-03-31    115       -15.0    -11.5
2024-04-30    160        45.0     39.1
2024-05-31    145       -15.0     -9.4
2024-06-30    180        35.0     24.1
\`\`\`

## Time Zone Handling and DateOffset

### 📌 Example 17 — Time Zones and DateOffset

\`\`\`python
import pandas as pd

# --- Timezone localize and convert ---
dates = pd.date_range("2024-06-01", periods=3, freq="D")
s = pd.Series([100,200,300], index=dates)

# Localize naive datetime to a timezone
s_utc   = s.tz_localize("UTC")
s_ist   = s_utc.tz_convert("Asia/Kolkata")
s_est   = s_utc.tz_convert("US/Eastern")

print("UTC:    ", s_utc.index[0])
print("IST:    ", s_ist.index[0])
print("Eastern:", s_est.index[0])

# --- DateOffset arithmetic ---
today = pd.Timestamp("2024-06-15")
print("\\nToday:         ", today)
print("+1 month:      ", today + pd.DateOffset(months=1))
print("+2 business:   ", today + pd.offsets.BusinessDay(2))
print("Next Mon end:  ", today + pd.offsets.MonthEnd(1))
print("Quarter end:   ", today + pd.offsets.QuarterEnd(1))

# --- Period Index ---
pi = pd.period_range("2024-Q1", periods=4, freq="Q")
print("\\nQuarterly periods:")
ps = pd.Series([100,120,115,140], index=pi)
print(ps)
\`\`\`

\`\`\`output
UTC:     2024-06-01 00:00:00+00:00
IST:     2024-06-01 05:30:00+05:30
Eastern: 2024-05-31 20:00:00-04:00

Today:          2024-06-15 00:00:00
+1 month:       2024-07-15 00:00:00
+2 business:    2024-06-19 00:00:00
Next Mon end:   2024-06-30 00:00:00
Quarter end:    2024-09-30 00:00:00

Quarterly periods:
2024Q1    100
2024Q2    120
2024Q3    115
2024Q4    140
Freq: Q-DEC, dtype: int64
\`\`\``,

14: `# Performance & Memory Optimization

**In this lesson:** memory_usage() · dtype downcast · category dtype · pd.eval() · query() · chunksize · Vectorized ops

## Memory Usage — Know Your DataFrame Size

### 📌 Example 18 — memory_usage()

\`\`\`python
import pandas as pd
import numpy as np

rng = np.random.default_rng(42)
df = pd.DataFrame({
    "ID":     rng.integers(1, 10000, 100000),
    "Name":   rng.choice(["Alice","Bob","Charlie","Diana","Eve"], 100000),
    "Score":  rng.random(100000) * 100,
    "Grade":  rng.choice(["A","B","C","D","F"], 100000),
    "Pass":   rng.random(100000) > 0.3,
})

# --- memory_usage ---
mem = df.memory_usage(deep=True)
print("Memory per column (bytes):")
print(mem)
total_mb = mem.sum() / 1024**2
print(f"\\nTotal: {total_mb:.2f} MB")

# --- dtypes overview ---
print("\\nCurrent dtypes:")
print(df.dtypes)
\`\`\`

\`\`\`output
Memory per column (bytes):
Index       128
ID       800000
Name    5900000   <- object dtype is expensive!
Score    800000
Grade   5800000   <- object dtype is expensive!
Pass     100000

Total: 12.78 MB

Current dtypes:
ID        int64
Name     object
Score   float64
Grade    object
Pass       bool
\`\`\`

## dtype Downcast — Shrink Numeric Columns

### 📌 Example 19 — dtype Downcast and category

\`\`\`python
import pandas as pd
import numpy as np

rng = np.random.default_rng(42)
df = pd.DataFrame({
    "ID":    rng.integers(1, 10000, 100000),
    "Score": rng.random(100000) * 100,
    "Grade": rng.choice(["A","B","C","D","F"], 100000),
    "Dept":  rng.choice(["IT","HR","Finance","Sales"], 100000),
})

before_mb = df.memory_usage(deep=True).sum() / 1024**2
print(f"Before: {before_mb:.2f} MB")

# --- Downcast integers ---
df["ID"] = pd.to_numeric(df["ID"], downcast="integer")
print("ID dtype after downcast:", df["ID"].dtype)

# --- Downcast floats ---
df["Score"] = pd.to_numeric(df["Score"], downcast="float")
print("Score dtype after downcast:", df["Score"].dtype)

# --- category dtype: biggest win for low-cardinality strings ---
df["Grade"] = df["Grade"].astype("category")
df["Dept"]  = df["Dept"].astype("category")

after_mb = df.memory_usage(deep=True).sum() / 1024**2
print(f"\\nAfter:  {after_mb:.2f} MB")
print(f"Saved:  {before_mb - after_mb:.2f} MB ({(1-after_mb/before_mb)*100:.0f}% reduction!)")

print("\\nNew dtypes:")
print(df.dtypes)
\`\`\`

\`\`\`output
Before: 10.68 MB
ID dtype after downcast: int16
Score dtype after downcast: float32

After:  2.31 MB
Saved:  8.37 MB (78% reduction!)

New dtypes:
ID        int16
Score   float32
Grade  category  <- huge savings for repeated strings
Dept   category  <- stores index + lookup, not full strings
\`\`\`

:::insight
The category dtype is the single biggest memory win in Pandas. Any column with fewer than ~50% unique values benefits massively. Typical savings: 10x-90x for string columns with repeated values (city names, departments, grades, status codes).
:::

## pd.eval() and query() — Fast Expression Evaluation

pd.eval() evaluates string expressions using numpy under the hood, avoiding Python interpreter overhead and temporary DataFrame copies. It is especially fast on large DataFrames (>10K rows).

### 📌 Example 20 — pd.eval()

\`\`\`python
import pandas as pd
import numpy as np
import time

rng = np.random.default_rng(42)
n = 1_000_000
df = pd.DataFrame({
    "A": rng.random(n),
    "B": rng.random(n),
    "C": rng.random(n),
})

# --- Standard Pandas (creates temp copies) ---
t0 = time.perf_counter()
result1 = df["A"] + df["B"] * df["C"] - df["B"]**2
t1 = time.perf_counter()

# --- pd.eval (optimised, no temp arrays) ---
t2 = time.perf_counter()
result2 = pd.eval("df.A + df.B * df.C - df.B**2")
t3 = time.perf_counter()

print(f"Standard Pandas: {(t1-t0)*1000:.1f} ms")
print(f"pd.eval:         {(t3-t2)*1000:.1f} ms")
print(f"Results match:   {result1.round(6).equals(result2.round(6))}")

# --- eval as method on DataFrame ---
df_small = pd.DataFrame({"Math":[85,72,91],"Science":[92,78,85]})
df_small = df_small.eval("Average = (Math + Science) / 2")
df_small = df_small.eval("Pass = Average >= 80")
print("\\neval on DataFrame:")
print(df_small)
\`\`\`

\`\`\`output
Standard Pandas: 18.4 ms
pd.eval:          9.1 ms
Results match:   True

eval on DataFrame:
   Math  Science  Average   Pass
0    85       92     88.5   True
1    72       78     75.0  False
2    91       85     88.0   True
\`\`\`

## Chunking Large Files

When a CSV file is too large to fit in RAM, use chunksize to read it in batches. Each chunk is a normal DataFrame you process independently, then aggregate results.

### 📌 Example 21 — Chunking Large Files

\`\`\`python
import pandas as pd

# --- Read in chunks (does not load entire file into RAM) ---
chunk_results = []

# Simulate reading a large CSV in 10000-row chunks
for chunk in pd.read_csv("large_data.csv", chunksize=10000):
    # Process each chunk
    chunk_sum  = chunk["Sales"].sum()
    chunk_rows = len(chunk)
    chunk_results.append({"sum": chunk_sum, "rows": chunk_rows})

# Aggregate across all chunks
summary = pd.DataFrame(chunk_results)
total_sales = summary["sum"].sum()
total_rows  = summary["rows"].sum()
print(f"Total sales: {total_sales:,.0f}")
print(f"Total rows:  {total_rows:,}")

# --- Alternative: use iterator ---
reader = pd.read_csv("large_data.csv", chunksize=50000, iterator=True)
chunk1 = next(reader)
print("\\nFirst chunk shape:", chunk1.shape)

# --- Filter while chunking (memory-efficient) ---
filtered_chunks = []
for chunk in pd.read_csv("large_data.csv", chunksize=10000):
    filtered = chunk[chunk["Score"] > 80]
    filtered_chunks.append(filtered)
result = pd.concat(filtered_chunks, ignore_index=True)
\`\`\`

## Vectorized String Ops vs apply()

String operations via the .str accessor are vectorized and far faster than using apply() with a lambda. Always prefer .str methods over apply() for string transformations.

### 📌 Example 22 — Vectorized String Ops

\`\`\`python
import pandas as pd
import time

n = 500_000
names = pd.Series(["alice smith","bob jones","charlie brown"] * (n // 3))

# --- Slow: apply with lambda ---
t0 = time.perf_counter()
result1 = names.apply(lambda x: x.title())
print(f"apply(lambda): {(time.perf_counter()-t0)*1000:.1f} ms")

# --- Fast: vectorized .str method ---
t0 = time.perf_counter()
result2 = names.str.title()
print(f"str.title():   {(time.perf_counter()-t0)*1000:.1f} ms")

# --- More .str examples ---
emails = pd.Series(["Alice@Gmail.com","bob@YAHOO.com","charlie@outlook.com"])
print("\\nLowercase:  ", emails.str.lower().tolist())
print("Domain:     ", emails.str.split("@").str[1].tolist())
print("Contains G: ", emails.str.contains("Gmail", case=False).tolist())
print("Length:     ", emails.str.len().tolist())
\`\`\`

\`\`\`output
apply(lambda): 312.4 ms
str.title():    18.7 ms   <- 17x faster!

Lowercase:  ["alice@gmail.com","bob@yahoo.com","charlie@outlook.com"]
Domain:     ["Gmail.com","YAHOO.com","outlook.com"]
Contains G: [True, False, False]
Length:     [16, 13, 19]
\`\`\`

## Lesson 14 — Performance Tips Reference

| Technique | Benefit | When to Use | Typical Saving |
| --- | --- | --- | --- |
| category dtype | Less RAM for strings | Repeated string cols (<50% unique) | 10x-90x memory |
| int8/int16 downcast | Smaller integers | IDs, counts, scores < 32768 | 4x-8x memory |
| float32 instead of float64 | Half float memory | ML features, scores | 2x memory |
| pd.eval() | Faster arithmetic | Complex expressions, >10K rows | 2x-5x speed |
| query() over boolean | Less temp memory | Large DataFrames, complex filters | 2x speed |
| chunksize reading | Process > RAM files | Files > available RAM | Enables impossibles |
| .str accessor | Vectorized strings | Any string transformation | 10x-20x over apply |
| inplace=False | Return copy (safe) | Chain operations cleanly | Code quality |
| SparseArray | Sparse data savings | >90% zeros or NaN | Up to 10x memory |`,

15: `# Real-World Pandas

**In this lesson:** str accessor · regex · explode() · json_normalize() · SQL integration · df.style · Matplotlib · EDA Pipeline

## String Operations — The .str Accessor

The .str accessor exposes all Python string methods as vectorized operations on a Series. It works on object and string dtype columns and is the correct tool for any string cleaning or extraction task.

### 📌 Example 23 — .str Accessor

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Name":  ["  Alice Smith  ","bob JONES","CHARLIE Brown","diana lee"],
    "Email": ["alice@gmail.com","bob@yahoo.com","charlie@outlook.com","diana@gmail.com"],
    "Phone": ["123-456-7890","(987) 654-3210","123.456.7890","9876543210"],
    "Code":  ["DEPT_IT_L1","DEPT_HR_L2","DEPT_FIN_L1","DEPT_IT_L3"],
})

# --- Clean names ---
df["Name_clean"] = df["Name"].str.strip().str.title()
print("Cleaned names:", df["Name_clean"].tolist())

# --- Extract domain from email ---
df["Domain"] = df["Email"].str.split("@").str[1]
print("Domains:", df["Domain"].tolist())

# --- Check contains ---
gmail_mask = df["Email"].str.contains("gmail")
print("Gmail users:", df.loc[gmail_mask, "Name_clean"].tolist())

# --- Replace using str.replace ---
df["Phone_clean"] = df["Phone"].str.replace(r"[^0-9]", "", regex=True)
print("Phones:", df["Phone_clean"].tolist())

# --- Split Code column into parts ---
split = df["Code"].str.split("_", expand=True)
split.columns = ["prefix","dept","level"]
print("\\nCode split:")
print(split)

# --- str methods summary ---
s = pd.Series(["Hello World","Pandas is Fun","Data Science"])
print("\\nupper:    ", s.str.upper().tolist())
print("lower:    ", s.str.lower().tolist())
print("len:      ", s.str.len().tolist())
print("startswith:", s.str.startswith("P").tolist())
print("count a:  ", s.str.count("a").tolist())
\`\`\`

\`\`\`output
Cleaned names: ["Alice Smith","Bob Jones","Charlie Brown","Diana Lee"]
Domains: ["gmail.com","yahoo.com","outlook.com","gmail.com"]
Gmail users: ["Alice Smith","Diana Lee"]
Phones: ["1234567890","9876543210","1234567890","9876543210"]

Code split:
  prefix dept level
0   DEPT   IT    L1
1   DEPT   HR    L2
2   DEPT  FIN    L1
3   DEPT   IT    L3
\`\`\`

## Regular Expressions in Pandas

### 📌 Example 24 — regex with Pandas

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Text": [
        "Call us at 022-12345678 or 9876543210",
        "Email: support@company.com for help",
        "Price: Rs 1,250.50 (discounted from Rs 2,000)",
        "Date of birth: 15-08-1990 (format DD-MM-YYYY)",
    ]
})

# --- str.extract: capture first match ---
df["Phone"] = df["Text"].str.extract(r"(d{10})")
print("Extracted phone:", df["Phone"].tolist())

# --- str.findall: get all matches ---
df["All_numbers"] = df["Text"].str.findall(r"d+")
print("All numbers:", df["All_numbers"].tolist())

# --- str.match: check start of string ---
df["Starts_Call"] = df["Text"].str.match(r"^Call")
print("Starts with Call:", df["Starts_Call"].tolist())

# --- str.extractall: multiple groups ---
prices = pd.Series(["Rs 1,250.50","Rs 2,000.00","Rs 750"])
amounts = prices.str.extractall(r"Rss+([d,]+.?d*)")
print("\\nExtracted amounts:")
print(amounts)
\`\`\`

\`\`\`output
Extracted phone: [nan, nan, nan, "9876543210"]
All numbers: [["022","12345678","9876543210"], ["support"], ...]
Starts with Call: [True, False, False, False]

Extracted amounts:
         0
  match
0 0      1,250.50
1 0      2,000.00
2 0      750
\`\`\`

## explode() and pd.json_normalize()

### 📌 Example 25 — explode() and json_normalize()

\`\`\`python
import pandas as pd

# --- explode: expand list-valued cells into rows ---
df = pd.DataFrame({
    "Name":   ["Alice","Bob","Charlie"],
    "Hobbies":["reading,coding".split(","),
               "gaming,cooking,hiking".split(","),
               "music".split(",")],
})
print("Before explode:")
print(df)

df_exp = df.explode("Hobbies").reset_index(drop=True)
print("\\nAfter explode:")
print(df_exp)

# --- pd.json_normalize: flatten nested JSON/dict ---
records = [
    {"id":1,"name":"Alice","address":{"city":"Mumbai","pin":"400001"},"score":88},
    {"id":2,"name":"Bob",  "address":{"city":"Delhi", "pin":"110001"},"score":72},
]

flat = pd.json_normalize(records)
print("\\nFlattened JSON:")
print(flat)

# With custom separator
flat2 = pd.json_normalize(records, sep=".")
print("\\nWith sep=.:")
print(flat2.columns.tolist())
\`\`\`

\`\`\`output
Before explode:
      Name              Hobbies
0    Alice    [reading, coding]
1      Bob  [gaming, cooking, hiking]
2  Charlie                [music]

After explode:
      Name  Hobbies
0    Alice  reading
1    Alice   coding
2      Bob   gaming
3      Bob  cooking
4      Bob   hiking
5  Charlie    music

Flattened JSON:
   id   name address.city address.pin  score
0   1  Alice       Mumbai      400001     88
1   2    Bob        Delhi      110001     72
\`\`\`

## DataFrame Styling — df.style

The Styler API lets you apply conditional formatting, color gradients, bar charts, and custom CSS styles to DataFrames for presentation in Jupyter notebooks or exported to Excel/HTML.

### 📌 Example 26 — df.style Styling

\`\`\`python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    "Name":    ["Alice","Bob","Charlie","Diana","Eve"],
    "Math":    [85, 72, 91, 88, 56],
    "Science": [92, 78, 85, 92, 61],
    "English": [88, 75, 90, 84, 70],
})

# --- Highlight max in each column ---
styled = df.style.highlight_max(subset=["Math","Science","English"],
    color="lightgreen")

# --- Highlight min ---
styled = styled.highlight_min(subset=["Math","Science","English"],
    color="lightcoral")

# --- Color gradient (heatmap) ---
styled2 = df.style.background_gradient(
    subset=["Math","Science","English"],
    cmap="RdYlGn", vmin=50, vmax=100
)

# --- Bar chart inside cells ---
styled3 = df.style.bar(
    subset=["Math"], color=["#d65f5f","#5fba7d"],
    vmin=50, vmax=100
)

# --- Custom function-based formatting ---
def highlight_fail(val):
    return "background-color: #ffcccc" if val < 70 else ""

styled4 = df.style.applymap(highlight_fail,
    subset=["Math","Science","English"])

# --- Format numbers ---
styled5 = df.style.format({
    "Math":    "{:.1f}",
    "Science": "{:.1f}",
    "English": "{:.1f}",
})

# --- Export styled DataFrame to Excel ---
# styled.to_excel("styled_report.xlsx", engine="openpyxl", index=False)
print("Styler ready (render in Jupyter or export to Excel)")
print("Methods: highlight_max/min, background_gradient, bar, format, applymap")
\`\`\`

## Integration: Matplotlib, NumPy, SQL, Pickle

### 📌 Example 27 — Matplotlib, NumPy, SQL, Pickle

\`\`\`python
import pandas as pd
import numpy as np

# ===============================================
# Matplotlib / Seaborn integration
# ===============================================
import matplotlib.pyplot as plt

df = pd.DataFrame({
    "Month":   ["Jan","Feb","Mar","Apr","May","Jun"],
    "Sales":   [120, 150, 130, 180, 160, 200],
    "Expenses":[80,  95,  85,  110, 100, 120],
})

# df.plot() wraps matplotlib seamlessly
ax = df.plot(x="Month", y=["Sales","Expenses"],
             kind="line", title="Monthly P&L",
             figsize=(8,4), marker="o")
plt.tight_layout()
# plt.savefig("monthly_pnl.png", dpi=150)

# ===============================================
# NumPy integration
# ===============================================
data = pd.DataFrame({"A":[1,2,3],"B":[4,5,6]})

# DataFrame to NumPy
arr = data.to_numpy()
print("to_numpy:", arr)

# NumPy ufuncs work directly on DataFrame
print("np.log:", np.log(data).round(3))

# ===============================================
# SQL integration (SQLAlchemy)
# ===============================================
# from sqlalchemy import create_engine
# engine = create_engine("postgresql://user:pass@host/db")
# df = pd.read_sql("SELECT * FROM students WHERE score > 80", engine)
# df.to_sql("results", engine, if_exists="replace", index=False)

# ===============================================
# Pickle (fast binary serialization)
# ===============================================
df.to_pickle("dataframe.pkl")
df_loaded = pd.read_pickle("dataframe.pkl")
print("\\nPickle round-trip OK:", df.equals(df_loaded))
\`\`\`

\`\`\`output
to_numpy: [[1 4] [2 5] [3 6]]

np.log:
       A      B
0  0.000  1.386
1  0.693  1.609
2  1.099  1.792

Pickle round-trip OK: True
\`\`\`

## Real-World Mini Project — Full EDA Pipeline

A complete Exploratory Data Analysis (EDA) pipeline applying all 15 lessons. This is what a professional data analyst runs on every new dataset.

### 📌 Example 28 — Full EDA Pipeline (All 15 Lessons)

\`\`\`python
import pandas as pd
import numpy as np

# ====================================================
# STEP 0: Generate realistic student dataset
# ====================================================
rng = np.random.default_rng(42)
n = 500

df_raw = pd.DataFrame({
    "StudentID": range(1001, 1001+n),
    "Name":      rng.choice(["Alice","Bob","Charlie","Diana","Eve","Frank"], n),
    "Dept":      rng.choice(["IT","HR","Finance","Marketing"], n),
    "City":      rng.choice(["Mumbai","Delhi","Bengaluru","Hyderabad"], n),
    "JoinDate":  pd.date_range("2020-01-01", periods=n, freq="3D"),
    "Math":      rng.integers(40, 100, n).astype(float),
    "Science":   rng.integers(40, 100, n).astype(float),
    "English":   rng.integers(40, 100, n).astype(float),
})
# Inject missing values
for col in ["Math","Science","English"]:
    df_raw.loc[rng.choice(n, 20, replace=False), col] = np.nan

# ====================================================
# STEP 1: Shape and dtypes overview (L3, L14)
# ====================================================
print("=" * 55)
print("STEP 1: DATASET OVERVIEW")
print("=" * 55)
print(f"Shape: {df_raw.shape}")
print(f"Memory: {df_raw.memory_usage(deep=True).sum()/1024:.1f} KB")
print("Dtypes:\\n", df_raw.dtypes.to_string())

# ====================================================
# STEP 2: Missing data analysis (L6)
# ====================================================
print("\\n" + "=" * 55)
print("STEP 2: MISSING DATA")
print("=" * 55)
missing = df_raw.isnull().sum()
missing_pct = (missing / len(df_raw) * 100).round(1)
print(pd.DataFrame({"Count": missing, "Pct%": missing_pct})[missing > 0])

# ====================================================
# STEP 3: Clean and transform (L6, L7, L12)
# ====================================================
df = df_raw.copy()

# Fill NaN with column medians
for col in ["Math","Science","English"]:
    df[col] = df[col].fillna(df[col].median())

# Convert types
df["Dept"] = df["Dept"].astype("category")
df["City"] = df["City"].astype("category")

# Feature engineering (L7)
df = df.assign(
    Average  = lambda x: x[["Math","Science","English"]].mean(axis=1).round(1),
    Grade    = lambda x: pd.cut(x.Average, bins=[0,50,60,70,80,101],
                                labels=["F","D","C","B","A"]),
    PassFail = lambda x: x.Average >= 60,
    TenureYr = lambda x: (pd.Timestamp("2024-12-31") - x.JoinDate).dt.days / 365,
)

# ====================================================
# STEP 4: GroupBy summary (L8)
# ====================================================
print("\\n" + "=" * 55)
print("STEP 4: DEPARTMENT SUMMARY")
print("=" * 55)
dept_summary = df.groupby("Dept", observed=True).agg(
    Students  = ("StudentID","count"),
    Avg_Math  = ("Math","mean"),
    Avg_Score = ("Average","mean"),
    Pass_Rate = ("PassFail","mean"),
)
dept_summary["Pass_Rate"] = dept_summary["Pass_Rate"].mul(100).round(1)
print(dept_summary.round(1))

# ====================================================
# STEP 5: Pivot table (L12)
# ====================================================
print("\\n" + "=" * 55)
print("STEP 5: GRADE DISTRIBUTION BY DEPT")
print("=" * 55)
grade_pivot = pd.crosstab(df["Dept"], df["Grade"], margins=True)
print(grade_pivot)

# ====================================================
# STEP 6: Time trend (L13)
# ====================================================
print("\\n" + "=" * 55)
print("STEP 6: AVERAGE SCORE BY QUARTER")
print("=" * 55)
df_ts = df.set_index("JoinDate")["Average"]
quarterly = df_ts.resample("QE").mean().round(1)
print(quarterly.to_string())

# ====================================================
# STEP 7: Top performers (L10)
# ====================================================
print("\\n" + "=" * 55)
print("STEP 7: TOP 5 STUDENTS")
print("=" * 55)
top5 = df.nlargest(5, "Average")[["Name","Dept","Average","Grade"]]
top5["Rank"] = range(1, 6)
print(top5.to_string(index=False))

print("\\n=== EDA COMPLETE ===")
\`\`\`

\`\`\`output
======================================================
STEP 1: DATASET OVERVIEW
======================================================
Shape: (500, 9)
Memory: 82.4 KB

======================================================
STEP 2: MISSING DATA
======================================================
         Count  Pct%
Math        20   4.0
Science     20   4.0
English     20   4.0

======================================================
STEP 4: DEPARTMENT SUMMARY
======================================================
           Students  Avg_Math  Avg_Score  Pass_Rate
Dept
Finance         127      70.1       70.5       82.7
HR              127      70.3       70.2       82.7
IT              118      69.1       69.5       81.4
Marketing       128      69.5       69.8       82.0

======================================================
STEP 7: TOP 5 STUDENTS
======================================================
   Name   Dept  Average Grade  Rank
  Alice     IT     97.7     A     1
    Eve Finance     97.0     A     2
    Bob     HR     96.3     A     3

=== EDA COMPLETE ===
\`\`\`

## Quick Reference Cheat Sheet

*Lessons 11–15: MultiIndex, Pivot, Time Series, Performance, Real-World*

### L11: Advanced Indexing

\`\`\`text
df.set_index("col")
df.set_index(["a","b"]) -> MultiIndex
df.reset_index()
df.loc[("lvl0","lvl1")]
df.xs(val, level="name")
pd.IndexSlice[...]
df.stack()  wide->long
df.unstack() long->wide
df.swaplevel()
idx.get_level_values(0)
\`\`\`

### L12: Reshaping

\`\`\`text
df.pivot(idx,cols,vals)
df.pivot_table(aggfunc=...)
margins=True, fill_value=0
df.melt(id_vars=[], var_name=..)
pd.crosstab(df.a, df.b)
crosstab(normalize="index")
pd.get_dummies(df, cols=[])
drop_first=True
pd.cut(s, bins, labels=[])
pd.qcut(s, q=4)
\`\`\`

### L13: Time Series

\`\`\`text
pd.to_datetime(series)
pd.date_range(start,periods,freq)
freq: D B W ME MS QE YE h
df.set_index("date")
series.resample("ME").mean()
series.rolling(7).mean()
series.expanding().max()
series.shift(1)  # lag
series.diff()    # change
tz_localize("UTC")
tz_convert("Asia/Kolkata")
\`\`\`

### L14: Performance

\`\`\`text
df.memory_usage(deep=True)
col.astype("category")
pd.to_numeric(col,downcast="int")
col.astype("float32")
pd.eval("df.A + df.B")
df.eval("col = A + B")
df.query("Score > @var")
pd.read_csv(chunksize=10000)
col.str.method()  NOT apply()
df.to_pickle("f.pkl")
pd.read_pickle("f.pkl")
\`\`\`

### L15: Real-World Pandas

\`\`\`text
s.str.strip().str.title()
s.str.split("@").str[1]
s.str.contains("pat")
s.str.replace(r"[^0-9]","",regex=True)
s.str.extract(r"(d+)")
s.str.findall(r"d+")
\`\`\`

\`\`\`text
df.explode("list_col")
pd.json_normalize(records)
df.style.highlight_max()
df.style.background_gradient()
df.style.format("{:.1f}")
df.plot(kind="line")
df.to_numpy() / np ufuncs
pd.read_sql(query, engine)
df.to_sql(name, engine)
\`\`\`

:::tip
ADVANCED CHECKLIST: 1) Use MultiIndex for panel data and groupby+unstack for cross-tabs 2) Always pivot_table over pivot when duplicates exist 3) Set DatetimeIndex before resample/rolling 4) Convert string cols to category before analysis 5) Profile memory with memory_usage(deep=True) before optimising 6) Use .str accessor never apply() for string ops.
:::

:::challenge
**WHAT NEXT**
You have now completed all 15 Pandas lessons. Real mastery comes from applying these skills to real datasets. Try: Kaggle datasets, government open data portals, or your own work data. Build a full EDA notebook combining every technique from all 15 lessons.
:::`,

}

export default pandasContent
