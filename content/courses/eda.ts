// Seaborn — Data Visualization Library (9 topics)
// Extracted verbatim from EDA.docx. Plots served from /public/EDA_images/simg*.png
// Course id: "eda"  →  registered in content/index.ts

const edaContent: Record<number, string> = {
1: `# TOPIC 1: Introduction & Setup

## 1.1  What is Seaborn and How It Relates to Matplotlib

Seaborn is a Python library used for creating beautiful and informative statistical graphics (charts and graphs). It is built on top of Matplotlib, which means it uses Matplotlib's drawing engine but makes it much easier and faster to create good-looking visualizations.

:::definition
**Seaborn**
Seaborn is a high-level Python data visualization library based on Matplotlib. It provides a simpler interface for drawing attractive statistical graphs with less code.
:::

:::definition
**Matplotlib**
Matplotlib is the foundational Python plotting library. It gives you very fine-grained control over every element of a graph, but requires more code for complex visualizations.
:::

### Relationship Between Seaborn and Matplotlib

Think of it this way: Matplotlib is like a raw toolkit (hammer, nails, paint). Seaborn is like a pre-built furniture set — it uses the same tools underneath but gives you ready-made, polished results quickly.

| Feature | Matplotlib | Seaborn |
|---|---|---|
| Level | Low-level (manual control) | High-level (automatic styling) |
| Code needed | More lines of code | Fewer lines of code |
| Default look | Plain / basic style | Polished / attractive style |
| Statistical plots | Must build manually | Built-in (boxplot, violin, etc.) |
| DataFrames support | Limited direct support | Excellent (uses pandas directly) |
| Built on | Core plotting engine | Built on top of Matplotlib |

:::insight
Seaborn does NOT replace Matplotlib. They work together.
You can always customize a Seaborn plot using Matplotlib functions.
import matplotlib.pyplot as plt is almost always used alongside Seaborn.
:::

## 1.2  Installing Seaborn — pip install seaborn

Before you can use Seaborn, you need to install it. Installation is done using pip, Python's package manager. You run this command in your terminal or command prompt (NOT inside a Python file).

### Installation Command

**Run in Terminal / Command Prompt / Anaconda Prompt**

\`\`\`bash
pip install seaborn
\`\`\`

This command downloads and installs Seaborn along with its dependencies (Matplotlib, NumPy, Pandas, SciPy).

### Checking if Seaborn is Already Installed

\`\`\`bash
pip show seaborn
\`\`\`

\`\`\`output
Name: seaborn
Version: 0.13.2
Summary: Statistical data visualization
Home-page: https://seaborn.pydata.org
Author: Michael Waskom
Location: /usr/local/lib/python3.11/site-packages
\`\`\`

The output shows the version of Seaborn installed and where it is located. If you see this, Seaborn is ready to use.

### Upgrading Seaborn

\`\`\`bash
pip install --upgrade seaborn
\`\`\`

:::note
For Anaconda/Conda users: use  conda install seaborn  instead of pip.
:::

### Installing All Required Libraries Together

\`\`\`bash
pip install seaborn matplotlib pandas numpy
\`\`\`

## 1.3  Importing Seaborn — import seaborn as sns

After installation, you import Seaborn at the top of every Python script or Jupyter Notebook where you want to use it. The standard alias is sns — this is a convention used by all Python programmers worldwide.

### Standard Import Block for Seaborn Projects

**Always write these imports at the top of your Python file**

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
\`\`\`

### What Each Import Does

| Import Statement | Alias | Purpose |
|---|---|---|
| import seaborn as sns | sns | The main Seaborn library — used to create all plots |
| import matplotlib.pyplot as plt | plt | Used to show, save, and customize plots |
| import pandas as pd | pd | Used to work with DataFrames (tables of data) |
| import numpy as np | np | Used for numerical operations and arrays |

### Why is the alias 'sns'?

The alias sns stands for Samuel Norman Seaborn, a character from the TV show 'The West Wing'. The creator of Seaborn chose this name as a fun reference. All documentation, tutorials, and books use sns, so you should too.

### Verifying Seaborn Version Inside Python

\`\`\`python
import seaborn as sns

print(sns.__version__)
\`\`\`

\`\`\`output
0.13.2
\`\`\`

This tells you which version of Seaborn is running in your Python environment.

## 1.4  Loading Built-in Datasets — sns.load_dataset()

Seaborn comes with several built-in datasets that you can load instantly for practice and learning. These are real datasets from famous statistical studies. You do not need to download any files — Seaborn fetches them automatically from the internet (or from cache if already downloaded).

:::definition
**sns.load_dataset()**
A function in Seaborn that loads a sample dataset as a Pandas DataFrame. It is used for practice and demonstration purposes.
:::

### Syntax

\`\`\`python
sns.load_dataset(name, cache=True, data_home=None, **kws)
\`\`\`

| Parameter | Type | Description |
|---|---|---|
| name | string | Name of the dataset to load (e.g., 'tips', 'iris', 'titanic') |
| cache | bool | If True, saves the dataset locally after first download. Default: True |
| data_home | string | Folder to store cached datasets. Default: ~/seaborn-data |

### List of All Available Built-in Datasets

\`\`\`python
import seaborn as sns

# See all available datasets
print(sns.get_dataset_names())
\`\`\`

\`\`\`output
['anagrams', 'anscombe', 'attention', 'brain_networks', 'car_crashes',
 'diamonds', 'dots', 'dowjones', 'exercise', 'flights', 'fmri',
 'geyser', 'glue', 'healthexp', 'iris', 'mpg', 'penguins',
 'planets', 'seaice', 'taxis', 'tips', 'titanic']
\`\`\`

### Most Commonly Used Datasets

| Dataset | Description | Columns |
|---|---|---|
| tips | Restaurant tip data — how much customers tip | total_bill, tip, sex, smoker, day, time, size |
| iris | Flower measurements for 3 species of Iris | sepal_length, sepal_width, petal_length, petal_width, species |
| titanic | Survival data from the Titanic ship disaster | survived, pclass, sex, age, fare, class, embark_town |
| penguins | Body measurements of 3 penguin species | species, island, bill_length_mm, flipper_length_mm, body_mass_g, sex |
| flights | Number of airline passengers from 1949–1960 | year, month, passengers |
| mpg | Fuel efficiency data for cars | mpg, cylinders, horsepower, weight, acceleration, name |

### Loading and Exploring a Dataset — Full Example

\`\`\`python
import seaborn as sns
import pandas as pd

# Load the 'tips' dataset
df = sns.load_dataset('tips')

# Check the shape (rows, columns)
print('Shape:', df.shape)

# Show first 5 rows
print(df.head())

# Show column names and data types
print(df.dtypes)
\`\`\`

\`\`\`output
Shape: (244, 7)

   total_bill   tip     sex smoker  day    time  size
0       16.99  1.01  Female     No  Sun  Dinner     2
1       10.34  1.66    Male     No  Sun  Dinner     3
2       21.01  3.50    Male     No  Sun  Dinner     3
3       23.68  3.31    Male     No  Sun  Dinner     2
4       24.59  3.61  Female     No  Sun  Dinner     4

total_bill    float64
tip           float64
sex          category
smoker       category
day          category
time         category
size            int64
\`\`\`

### Output Explanation

- Shape: (244, 7) — The dataset has 244 rows (customers) and 7 columns (features).
- head() — Shows first 5 rows so you can quickly see what the data looks like.
- total_bill — Amount billed to the customer in dollars.
- tip — Tip amount given by the customer in dollars.
- sex, smoker, day, time — Categorical columns (stored as 'category' type in pandas).
- size — Number of people at the table (integer).

### Loading Other Datasets

\`\`\`python
# Load iris dataset
iris = sns.load_dataset('iris')
print(iris.head())

# Load penguins dataset
penguins = sns.load_dataset('penguins')
print(penguins.head())

# Load titanic dataset
titanic = sns.load_dataset('titanic')
print(titanic.head())
\`\`\`

**Output:**
![Seaborn output](/EDA_images/simg1.png)

## 1.5  Figure-level vs Axes-level Functions

This is one of the most important concepts in Seaborn. All Seaborn functions fall into one of two categories: Figure-level functions or Axes-level functions. Understanding the difference helps you choose the right function and customize your plots correctly.

### What is a Figure and what is an Axes?

Imagine a physical painting scenario:
- Figure = The entire canvas (the full picture frame).
- Axes = Individual painting area on the canvas (where the actual graph is drawn).
- A single Figure can contain one or many Axes (subplots).

:::definition
**Figure-level Function**
A Seaborn function that creates its own Figure (the full canvas) and manages the entire layout. It can create multiple subplots automatically. Examples: sns.displot(), sns.catplot(), sns.relplot(), sns.lmplot().
:::

:::definition
**Axes-level Function**
A Seaborn function that draws onto an existing Axes (single plot area). It can be embedded into any Matplotlib figure. Examples: sns.histplot(), sns.boxplot(), sns.scatterplot(), sns.heatmap().
:::

### Visual Representation

| — | Figure-level Functions | Axes-level Functions |
|---|---|---|
| Creates own Figure? | Yes — automatically | No — uses existing Axes |
| Returns | FacetGrid object | Matplotlib Axes object |
| Multiple subplots? | Yes — using col= and row= | No — only one subplot |
| How to show | g.fig or plt.show() | plt.show() |
| How to save | g.savefig('file.png') | plt.savefig('file.png') |
| Examples | displot, catplot, relplot, lmplot | histplot, boxplot, scatterplot |

### Example 1 — Axes-level Function

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# axes-level: draws onto current Axes
sns.histplot(data=df, x='total_bill')

plt.title('Distribution of Total Bill')
plt.xlabel('Total Bill ($)')
plt.ylabel('Count')
plt.show()
\`\`\`

**Explanation**
- The **Seaborn** library is used to create the histogram, while **Matplotlib** is used to add the title and axis labels.
- The **tips** dataset is loaded, which contains information about restaurant bills and tips.
- A **histogram** is created using the total_bill column.
- The histogram groups similar bill amounts into ranges (bins) and shows **how many bills fall into each range**.
- Finally, a title and labels are added to make the chart easy to understand, and the graph is displayed.

Output:
![Seaborn output](/EDA_images/simg2.png)

### Example 2 — Figure-level Function

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# figure-level: creates its own figure with multiple subplots
g = sns.displot(data=df, x='total_bill', col='time', row='sex')

g.fig.suptitle('Bill Distribution by Time and Sex', y=1.02)
plt.show()
\`\`\`

**Explanation**
This program creates a **distribution plot (displot)** of the **total bill** values from the tips dataset.
- The **tips** dataset is loaded, which contains restaurant billing information.
- **displot()** creates histograms to show how the total_bill values are distributed.
- The data is divided into **multiple subplots**:
- ↳ **Columns (col='time')** separate the data into **Lunch** and **Dinner**.
- ↳ **Rows (row='sex')** separate the data into **Male** and **Female** customers.
- This results in **four histograms**, making it easy to compare bill distributions across different groups.
- A title is added to the entire figure, and the plots are displayed.

**Output Explanation**
The output contains **four histograms**:
- **Male - Lunch**
- **Male - Dinner**
- **Female - Lunch**
- **Female - Dinner**
Each histogram shows:
- The **X-axis** represents the **Total Bill Amount ($)**.
- The **Y-axis** represents the **Number of Bills (Count)**.
Using these four graphs, you can easily compare:
- Whether lunch or dinner bills are generally higher.
- How bill amounts differ between male and female customers.
- Which bill ranges occur most frequently in each group.

![Seaborn output](/EDA_images/simg3.png)

:::tip
Use Axes-level functions when you need one plot. Use Figure-level functions when you want to automatically split data across multiple subplots using col= or row=.
:::

### Quick Reference Table — All Major Functions

| Category | Figure-level (wrapper) | Axes-level (individual) |
|---|---|---|
| Distribution | sns.displot() | sns.histplot(), sns.kdeplot(), sns.ecdfplot(), sns.rugplot() |
| Categorical | sns.catplot() | sns.boxplot(), sns.barplot(), sns.stripplot(), sns.violinplot() |
| Relational | sns.relplot() | sns.scatterplot(), sns.lineplot() |
| Regression | sns.lmplot() | sns.regplot(), sns.residplot() |
| Matrix | (none) | sns.heatmap(), sns.clustermap() |`,

2: `# TOPIC 2: Distribution Plots

Distribution plots are used to understand how data is spread or distributed. For example: Are most bill amounts around $15 or $40? Is the data symmetric or skewed? Distribution plots answer these questions visually.

:::definition
**Distribution**
A distribution shows how often different values appear in a dataset. It reveals the shape, center, spread, and outliers of the data.
:::

## 2.1  sns.histplot() — Histogram with Optional KDE

:::definition
**Histogram**
A histogram divides data into equal-width bins (intervals) and counts how many data points fall in each bin. The height of each bar represents the frequency (count) of that bin.
:::

### Syntax

\`\`\`python
sns.histplot(
    data=None,       # DataFrame or array
    x=None,          # Column name for x-axis (required)
    y=None,          # Column name for y-axis (for 2D histogram)
    hue=None,        # Column to color-code groups
    weights=None,    # Weight each observation
    stat='count',    # 'count', 'frequency', 'density', 'probability'
    bins='auto',     # Number of bins or a list of bin edges
    binwidth=None,   # Width of each bin (alternative to bins)
    kde=False,       # Overlay a KDE curve on the histogram
    cumulative=False,# Make histogram cumulative
    multiple='layer',# 'layer', 'dodge', 'stack', 'fill' for hue groups
    element='bars',  # 'bars', 'step', 'poly' shape of histogram
    fill=True,       # Whether bars are filled
    palette=None,    # Color palette for hue
    color=None,      # Single color for bars
    alpha=0.7,       # Transparency (0=invisible, 1=solid)
    ax=None,         # Matplotlib Axes to draw on
)
\`\`\`

### Parameter Explanations

| Parameter | Values / Type | What It Does |
|---|---|---|
| data | DataFrame | The dataset to use. Almost always a pandas DataFrame. |
| x | column name (string) | The column whose distribution you want to plot on x-axis. |
| hue | column name (string) | Colors each bar group differently based on a category column. |
| stat | 'count','density','probability' | Changes what the y-axis represents. |
| bins | int or 'auto' | 'auto' lets Seaborn choose the best number of bins. You can also pass a specific number like bins=20. |
| kde | True / False | If True, draws a smooth KDE curve on top of the histogram bars. |
| color | color string or hex | Sets the bar color. E.g., color='blue' or color='#2E6DA4'. |
| alpha | float 0–1 | Controls transparency. 0.5 makes bars 50% transparent. |
| multiple | 'layer','stack','dodge' | Controls how multiple hue groups overlap. 'dodge' places bars side by side. |

### Example 1 — Basic Histogram

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

# Load dataset
df = sns.load_dataset('tips')

# Simple histogram of total_bill column
sns.histplot(data=df, x='total_bill')

plt.title('Distribution of Total Bill Amounts')
plt.xlabel('Total Bill (in $)')
plt.ylabel('Number of Customers')
plt.show()
\`\`\`

**Explanation**
This program creates a **histogram** to display the distribution of **total bill amounts** in the tips dataset.
- The **tips** dataset is loaded, which contains information about restaurant bills and tips.
- A **histogram** is created using the total_bill column.
- The histogram groups similar bill amounts into ranges (bins) and shows how many customers have bills in each range.
- A title and axis labels are added to make the graph easy to understand.
- Finally, the histogram is displayed.

**Output Explanation**
The output is a **histogram** where:
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Number of Customers (Count).

![Seaborn output](/EDA_images/simg4.png)

### Example 2 — Histogram with KDE Curve

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# Histogram with KDE curve overlay
sns.histplot(
    data=df,
    x='total_bill',
    kde=True,          # adds smooth curve on top
    bins=20,           # use 20 bins
    color='steelblue', # bar color
    alpha=0.7,         # 70% opacity
)

plt.title('Total Bill with KDE Curve')
plt.xlabel('Total Bill ($)')
plt.show()
\`\`\`

**Explanation**
This program creates a **histogram** of the **total bill** values and adds a **KDE (Kernel Density Estimate) curve** on top.
- The **tips** dataset is loaded.
- A histogram is created using the total_bill column.
- The data is divided into **20 bins** to show the frequency of bill amounts.
- A **KDE curve** is added, which is a smooth line showing the overall distribution of the data.
- The bars are colored **steel blue** with slight transparency.
- A title and X-axis label are added, and the graph is displayed.

**Output Explanation**
The output shows a **histogram with a smooth KDE curve**.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Number of Customers (Count).
- **Bars:** Show how many bills fall within each bill amount range.
- **KDE Curve:** Shows the overall pattern of the bill amounts in a smooth, continuous form

![Seaborn output](/EDA_images/simg5.png)

### Example 3 — Histogram with Hue (Color Groups)

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# Compare bill distribution between male and female customers
sns.histplot(
    data=df,
    x='total_bill',
    hue='sex',         # color by sex column
    multiple='dodge',  # bars side by side (not overlapping)
    bins=15,
    palette='Set2',
)

plt.title('Bill Distribution by Gender')
plt.xlabel('Total Bill ($)')
plt.show()
\`\`\`

**Explanation**
This program creates a **histogram** to compare the **total bill distribution** between **male** and **female** customers.
- The **tips** dataset is loaded.
- A histogram is created using the total_bill column.
- The **sex** column is used to give different colors to male and female customers.
- The bars are displayed **side by side** (multiple='dodge') for easy comparison.
- The data is divided into **15 bins**.
- A title and X-axis label are added, and the graph is displayed.

**Output Explanation**
The output is a **grouped histogram** with separate bars for **Male** and **Female** customers.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Number of Customers (Count).
- **Different Colors:** Represent male and female customers.
- **Side-by-side Bars:** Make it easy to compare the number of customers in each bill amount range.

![Seaborn output](/EDA_images/simg6.png)

### Example 4 — Histogram with Density Statistic

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

sns.histplot(
    data=df,
    x='total_bill',
    stat='density',  # y-axis = probability density (not count)
    kde=True,
)

plt.title('Density Histogram')
plt.show()
\`\`\`

**Explanation**
This program creates a **density histogram** of the **total bill** values from the tips dataset.
- The **tips** dataset is loaded.
- A histogram is created using the total_bill column.
- The **stat='density'** option changes the Y-axis from **Count** to **Probability Density**.
- A **KDE (Kernel Density Estimate)** curve is added to show the overall distribution of the data with a smooth line.
- A title is added, and the graph is displayed.

**Output Explanation**
The output is a **density histogram with a KDE curve**.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Probability Density (instead of the number of customers).
- **Bars:** Show the relative distribution of bill amounts.
- **KDE Curve:** Displays the overall pattern of the data as a smooth curve.

![Seaborn output](/EDA_images/simg7.png)

:::note
stat='density' changes the y-axis from 'count' to 'probability density'. This is useful when comparing distributions with different sample sizes.
:::

## 2.2  sns.kdeplot() — Kernel Density Estimation

:::definition
**Kernel Density Estimation (KDE)**
KDE is a technique to estimate the probability density function (smooth curve) of a dataset. Instead of showing count bars like a histogram, it shows a smooth continuous curve. The curve shows where data points are concentrated.
:::

### Why Use KDE Instead of Histogram?

- Histograms are sensitive to bin size — a different bin size gives a different-looking chart.
- KDE gives a smooth, continuous curve that better represents the true distribution shape.
- KDE is especially useful when comparing multiple distributions on the same plot.

### Syntax

\`\`\`python
sns.kdeplot(
    data=None,         # DataFrame or array
    x=None,            # Column name for x-axis
    y=None,            # Column for y-axis (2D KDE)
    hue=None,          # Color-code by category
    weights=None,
    palette=None,
    color=None,
    fill=False,        # Fill area under the curve
    multiple='layer',  # How to draw multiple hue groups
    common_norm=True,  # Normalize all groups together
    bw_adjust=1,       # Bandwidth adjustment (smoothness)
    cut=3,             # How far to extend the curve
    cumulative=False,  # Make it cumulative
    linestyle='-',     # Line style
    linewidth=1,       # Line thickness
    alpha=1,
    ax=None,
)
\`\`\`

### Key Parameter — bw_adjust

bw_adjust controls the smoothness of the KDE curve. It adjusts the bandwidth (how wide each 'kernel' is).

| bw_adjust value | Effect | When to Use |
|---|---|---|
| < 1 (e.g., 0.5) | Less smooth, more wiggly | When you want to see more detail/peaks in data |
| = 1 (default) | Default smoothness | Good starting point for most data |
| > 1 (e.g., 2) | More smooth, wider curve | When data is noisy and you want a general shape |

### Example 1 — Basic KDE Plot

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# Simple KDE plot
sns.kdeplot(data=df, x='total_bill')

plt.title('KDE Plot of Total Bill')
plt.xlabel('Total Bill ($)')
plt.ylabel('Density')
plt.show()
\`\`\`

**Explanation**
This program creates a **KDE (Kernel Density Estimate) plot** for the **total bill** values in the tips dataset.
- The **tips** dataset is loaded.
- A **KDE plot** is created using the total_bill column.
- Unlike a histogram, a KDE plot **does not use bars**. Instead, it draws a **smooth curve** to show how the data is distributed.
- A title and axis labels are added to make the graph easy to understand.
- Finally, the graph is displayed.

**Output Explanation**
The output is a **smooth density curve**.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Density (shows the relative concentration of data).
![Seaborn output](/EDA_images/simg8.png)

### Example 2 — KDE with Fill and Hue

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

sns.kdeplot(
    data=df,
    x='total_bill',
    hue='sex',         # separate curves for Male and Female
    fill=True,         # shade area under each curve
    alpha=0.4,         # 40% transparency for overlap
    palette='husl',
)

plt.title('KDE of Bills by Gender')
plt.show()
\`\`\`

**Explanation**
This program creates a **KDE (Kernel Density Estimate) plot** to compare the **total bill distribution** between **male** and **female** customers.
- The **tips** dataset is loaded.
- A KDE plot is created using the total_bill column.
- The **sex** column is used to create separate density curves for male and female customers.
- The area under each curve is **filled with color** to make the distributions easier to see.
- Slight transparency is applied so overlapping areas are visible.
- Different colors are used for each gender.
- A title is added, and the graph is displayed.

**Output Explanation**
The output shows **two smooth KDE curves**, one for **Male** and one for **Female** customers.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Density.
- **Colored Curves:** Represent the bill distributions for male and female customers.
- **Shaded Areas:** Make it easier to compare the distributions
![Seaborn output](/EDA_images/simg9.png)

### Example 3 — Bandwidth Adjustment Comparison

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# Under-smoothed
sns.kdeplot(data=df, x='total_bill', bw_adjust=0.3,
            ax=axes[0], color='red')
axes[0].set_title('bw_adjust=0.3 (Wiggly)')

# Default
sns.kdeplot(data=df, x='total_bill', bw_adjust=1,
            ax=axes[1], color='blue')
axes[1].set_title('bw_adjust=1.0 (Default)')

# Over-smoothed
sns.kdeplot(data=df, x='total_bill', bw_adjust=3,
            ax=axes[2], color='green')
axes[2].set_title('bw_adjust=3.0 (Very Smooth)')

plt.suptitle('Effect of bw_adjust on KDE Smoothness')
plt.tight_layout()
plt.show()
\`\`\`

**Explanation**
This program demonstrates how the **bw_adjust (bandwidth adjustment)** parameter changes the **smoothness of a KDE plot**.
- The **tips** dataset is loaded.
- Three KDE plots are created side by side using the total_bill column.
- Each plot uses a different **bw_adjust** value:
- ↳ **0.3:** Less smoothing, producing a more detailed and wavy curve.
- ↳ **1.0:** Default smoothing, giving a balanced and natural-looking curve.
- ↳ **3.0:** More smoothing, producing a very smooth curve with fewer details.
- Titles are added to each plot and an overall title is added to compare the three graphs.

**Output Explanation**
The output contains **three KDE plots**:
1. **bw_adjust = 0.3 (Wiggly)**
- ↳ The curve has many small peaks and valleys.
- ↳ Shows more details but may also show noise.
2. **bw_adjust = 1.0 (Default)**
- ↳ The curve is balanced and smooth.
- ↳ This is the standard KDE appearance.
3. **bw_adjust = 3.0 (Very Smooth)**
- ↳ The curve is very smooth with fewer peaks.
- ↳ It highlights the overall trend but hides small details.
![Seaborn output](/EDA_images/simg10.png)

### Example 4 — 2D KDE (Bivariate)

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# 2D KDE showing relationship between two variables
sns.kdeplot(
    data=df,
    x='total_bill',
    y='tip',
    fill=True,
    cmap='Blues',
)

plt.title('2D KDE: Bill vs Tip')
plt.xlabel('Total Bill ($)')
plt.ylabel('Tip ($)')
plt.show()
\`\`\`

**Explanation**
This program creates a **2D KDE (Kernel Density Estimate) plot** to show the relationship between **Total Bill** and **Tip** in the tips dataset.
- The **tips** dataset is loaded.
- A **2D KDE plot** is created using the total_bill column on the X-axis and the tip column on the Y-axis.
- The **filled** option colors the density regions, making areas with more data points easier to identify.
- The **Blues** color map is used to display different density levels.
- A title and axis labels are added, and the graph is displayed.

**Output Explanation**
The output is a **2D density plot**.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Tip Amount (in dollars).
- **Shaded Regions:** Show where the data points are most concentrated.
- **Darker Areas:** Represent higher density (more observations).
- **Lighter Areas:** Represent lower density (fewer observations).
![Seaborn output](/EDA_images/simg11.png)

## 2.3  sns.ecdfplot() — Empirical Cumulative Distribution Function

:::definition
**ECDF (Empirical Cumulative Distribution Function)**
An ECDF plot shows, for any value x, what percentage of data points are less than or equal to x. It goes from 0% (no data) to 100% (all data). It is a step function that climbs up as x increases.
:::

### Why Use ECDF?

- It does not require you to choose bin sizes (unlike histograms).
- It shows the exact percentile of any value.
- It is great for comparing two distributions to see which is 'larger' overall.

### Syntax

\`\`\`python
sns.ecdfplot(
    data=None,
    x=None,             # Variable to plot
    y=None,
    hue=None,           # Color groups
    weights=None,
    stat='proportion',  # 'proportion' (0–1) or 'count' (0–n)
    complementary=False,# If True: shows P(X > x) instead of P(X <= x)
    palette=None,
    color=None,
    linestyle='-',
    linewidth=1,
    ax=None,
)
\`\`\`

### Example 1 — Basic ECDF Plot

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

sns.ecdfplot(data=df, x='total_bill')

plt.title('ECDF of Total Bill')
plt.xlabel('Total Bill ($)')
plt.ylabel('Proportion of Customers')
plt.show()
\`\`\`

**Explanation**
This program creates an **ECDF (Empirical Cumulative Distribution Function) plot** for the **total bill** values in the tips dataset.
- The **tips** dataset is loaded.
- An **ECDF plot** is created using the total_bill column.
- The ECDF plot shows the **cumulative proportion** of customers whose total bill is **less than or equal to** a given bill amount.
- A title and axis labels are added, and the graph is displayed.

**Output Explanation**
The output is a **step-like ECDF curve**.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Proportion of Customers (from 0 to 1).
![Seaborn output](/EDA_images/simg12.png)

### Example 2 — ECDF with Hue (Comparing Groups)

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

sns.ecdfplot(
    data=df,
    x='total_bill',
    hue='day',          # One curve per day
    palette='tab10',
)

plt.title('ECDF of Bills by Day of Week')
plt.xlabel('Total Bill ($)')
plt.ylabel('Proportion')
plt.show()
\`\`\`

**Explanation**
This program creates an **ECDF (Empirical Cumulative Distribution Function) plot** to compare the **total bill distribution** across different **days of the week**.
- The **tips** dataset is loaded.
- An ECDF plot is created using the total_bill column.
- The **day** column is used to draw a separate ECDF curve for each day (Thur, Fri, Sat, and Sun).
- Different colors are used to distinguish the days.
- A title and axis labels are added, and the graph is displayed.

**Output Explanation**
The output shows **four ECDF curves**, one for each day of the week.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Proportion of Customers (from 0 to 1).
- **Different Colored Curves:** Represent different days of the week.
![Seaborn output](/EDA_images/simg12.png)

### Example 3 — Complementary ECDF

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# Complementary ECDF shows P(X > x)
sns.ecdfplot(
    data=df,
    x='total_bill',
    complementary=True,
)

plt.title('Complementary ECDF (Survival Function)')
plt.xlabel('Total Bill ($)')
plt.ylabel('P(bill > x)')
plt.show()
\`\`\`

**Explanation**
This program creates a **Complementary ECDF (Empirical Cumulative Distribution Function)** plot for the **total bill** values in the tips dataset.
- The **tips** dataset is loaded.
- A **Complementary ECDF** is created using the total_bill column.
- The **complementary=True** option shows the probability of customers having a bill **greater than** a given value.
- A title and axis labels are added, and the graph is displayed.

**Output Explanation**
The output is a **descending step-like curve**.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Probability **P(bill > x)** (from 1 to 0).
![Seaborn output](/EDA_images/simg13.png)

## 2.4  sns.rugplot() — Marginal Rug

:::definition
**Rug Plot**
A rug plot adds tiny vertical tick marks (like a rug fringe) at the bottom of a plot, each mark representing one data point. It shows the exact location of each individual data value.
:::

### Why Use Rug Plots?

- Rug plots show the actual raw data positions — you can see where data is clustered or sparse.
- They are almost always combined with KDE or histogram plots to give extra detail.
- Very useful when you have a small dataset and want to see every single observation.

### Syntax

\`\`\`python
sns.rugplot(
    data=None,
    x=None,          # Column for x-axis rug marks
    y=None,          # Column for y-axis rug marks
    hue=None,        # Color groups
    height=0.025,    # Height of rug marks (as fraction of axes)
    expand_margins=True, # Expand plot margins to fit rug
    palette=None,
    color=None,
    alpha=None,
    ax=None,
)
\`\`\`

### Example 1 — Rug Plot Alone

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

sns.rugplot(data=df, x='total_bill')

plt.title('Rug Plot of Total Bill')
plt.xlabel('Total Bill ($)')
plt.show()
\`\`\`

**Explanation**
This program creates a **Rug Plot** for the **total bill** values in the tips dataset.
- The **tips** dataset is loaded.
- A **rug plot** is created using the total_bill column.
- Each data value is represented by a **small vertical line (tick)** on the X-axis.
- A title and X-axis label are added, and the graph is displayed.

**Output Explanation**
The output is a **rug plot**.
- **X-axis:** Total Bill Amount (in dollars).
- **Small Vertical Lines:** Each line represents one customer's total bill.
![Seaborn output](/EDA_images/simg14.png)
image14

### Example 2 — KDE + Rug (Most Common Usage)

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# KDE curve + rug at the bottom
sns.kdeplot(data=df, x='total_bill', fill=True, color='steelblue')
sns.rugplot(data=df, x='total_bill', color='red', height=0.05)

plt.title('KDE with Rug Plot')
plt.xlabel('Total Bill ($)')
plt.ylabel('Density')
plt.show()
\`\`\`

**Explanation**
This program combines a **KDE plot** and a **Rug Plot** to visualize the **total bill** values in the tips dataset.
- The **tips** dataset is loaded.
- A **KDE plot** is created using the total_bill column to show the overall distribution with a smooth curve.
- A **Rug Plot** is added at the bottom of the graph.
- Each small red line in the rug plot represents one individual bill value.
- A title and axis labels are added, and the graph is displayed.

**Output Explanation**
The output is a **KDE plot with a Rug Plot**.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Density.
- **Blue KDE Curve:** Shows the overall distribution of the bill amounts.
- **Red Rug Lines:** Represent the individual bill values.

![Seaborn output](/EDA_images/simg15.png)

### Example 3 — 2D Rug Plot

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# Scatter plot with rug on both axes
sns.scatterplot(data=df, x='total_bill', y='tip', alpha=0.5)
sns.rugplot(data=df, x='total_bill', y='tip', color='purple', height=0.03)

plt.title('Scatter + Rug on Both Axes')
plt.show()
\`\`\`

**Explanation**
This program creates a **scatter plot** to show the relationship between **Total Bill** and **Tip**, and adds a **rug plot** on both the X-axis and Y-axis.
- The **tips** dataset is loaded.
- A **scatter plot** is created using total_bill on the X-axis and tip on the Y-axis.
- Each point represents one customer's bill and tip.
- A **rug plot** is added, showing small purple lines along both axes to indicate the exact positions of the data values.
- A title is added, and the graph is displayed.

**Output Explanation**
The output is a **scatter plot with rug plots**.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Tip Amount (in dollars).
- **Scatter Points:** Represent individual customers' total bills and tips.
- **Purple Rug Lines:** Show the exact values of the bill amounts (X-axis) and tip amounts (Y-axis).
![Seaborn output](/EDA_images/simg16..png)

### Summary: All Distribution Plot Functions

| Function | What It Shows | Best Used For |
|---|---|---|
| sns.histplot() | Count/frequency per bin | Quick overview of distribution shape |
| sns.kdeplot() | Smooth density curve | Comparing distributions, continuous view |
| sns.ecdfplot() | Cumulative % up to each value | Finding percentiles, comparing two groups |
| sns.rugplot() | Exact position of each data point | Always used with other plots for detail |`,

3: `# TOPIC 3: Categorical Plots (Basic)

:::definition
**Categorical Data**
Categorical data consists of values that belong to named groups or categories, such as 'Male/Female', 'Monday/Tuesday/Wednesday', or 'Smoker/Non-Smoker'. Categorical plots compare values across these groups.
:::

When your data has groups (categories) and you want to compare values between those groups, you use categorical plots. For example: 'Do male customers tip more than female customers?' or 'Which day has the most orders?'

## 3.1  sns.barplot() — Mean + Confidence Intervals

:::definition
**Bar Plot (Statistical)**
A Seaborn bar plot shows the mean (average) of a numeric variable for each category. It also automatically draws error bars that represent the 95% confidence interval — a range that shows uncertainty in the estimate.
:::

### Syntax

\`\`\`python
sns.barplot(
    data=None,
    x=None,            # Categorical column (x-axis groups)
    y=None,            # Numeric column (y-axis values)
    hue=None,          # Sub-group coloring
    estimator='mean',  # 'mean','median','sum','std','var','count'
    errorbar=('ci',95),# Error bar: ('ci',95), 'sd', None
    n_boot=1000,       # Bootstrap samples for CI
    order=None,        # Order of categories on x-axis
    hue_order=None,
    orient=None,       # 'v' (vertical) or 'h' (horizontal)
    color=None,
    palette=None,
    saturation=0.75,
    width=0.8,         # Width of bars
    dodge=True,        # Separate bars for hue groups
    capsize=0,         # Width of error bar caps
    ax=None,
)
\`\`\`

### Important Parameters Explained

| Parameter | Meaning |
|---|---|
| estimator | The statistic to compute for each category. Default is 'mean'. Can be 'median', 'sum', etc. |
| errorbar | Controls error bars. ('ci', 95) = 95% confidence interval. 'sd' = standard deviation. None = no bars. |
| order | A list that controls the order of bars. E.g., order=['Sun','Mon','Tue'] |
| capsize | Adds horizontal caps to error bars. E.g., capsize=0.1 makes the error bar look like a T. |
| orient | 'v' = vertical bars (default). 'h' = horizontal bars (swap x and y). |

### Example 1 — Basic Bar Plot

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# Average tip amount per day
sns.barplot(data=df, x='day', y='tip')

plt.title('Average Tip by Day of Week')
plt.xlabel('Day')
plt.ylabel('Average Tip ($)')
plt.show()
\`\`\`

**Explanation**
This program creates a **bar plot** to show the **average tip amount** for each day of the week.
- The **tips** dataset is loaded.
- A **bar plot** is created using the day column on the X-axis and the tip column on the Y-axis.
- Seaborn automatically calculates the **average tip** for each day and displays it as a bar.
- A title and axis labels are added, and the graph is displayed.

**Output Explanation**
The output is a **bar plot**.
- **X-axis:** Days of the Week (Thur, Fri, Sat, Sun).
- **Y-axis:** Average Tip Amount (in dollars).
- **Bars:** Represent the average tip for each day.

![Seaborn output](/EDA_images/simg17.png)

### Example 2 — Bar Plot with Hue

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# Compare tips by day AND by gender
sns.barplot(
    data=df,
    x='day',
    y='tip',
    hue='sex',
    palette='Set1',
    capsize=0.1,       # Add caps to error bars
)

plt.title('Average Tip by Day and Gender')
plt.xlabel('Day')
plt.ylabel('Average Tip ($)')
plt.legend(title='Gender')
plt.show()
\`\`\`

**Explanation**
This program creates a **grouped bar plot** to compare the **average tip amount** by **day of the week** and **gender**.
- The **tips** dataset is loaded.
- A **bar plot** is created using the day column on the X-axis and the tip column on the Y-axis.
- The **sex** column is used to create separate bars for **Male** and **Female** customers.
- Different colors are used to distinguish the two groups.
- Small **error bars with caps** are added to show the variation in the average tip values.
- A title, axis labels, and a legend are added, and the graph is displayed.

**Output Explanation**
The output is a **grouped bar plot**.
- **X-axis:** Days of the Week (Thur, Fri, Sat, Sun).
- **Y-axis:** Average Tip Amount (in dollars).
- **Different Colored Bars:** Represent Male and Female customers.
- **Error Bars:** Show the variation in the average tip values.

![Seaborn output](/EDA_images/simg18.png)

### Example 3 — Horizontal Bar Plot with Custom Order

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

sns.barplot(
    data=df,
    x='tip',
    y='day',
    orient='h',                          # horizontal
    order=['Sun', 'Sat', 'Fri', 'Thur'], # custom order
    color='coral',
)

plt.title('Average Tip by Day (Horizontal)')
plt.xlabel('Average Tip ($)')
plt.show()
\`\`\`

**Explanation**
This program creates a **horizontal bar plot** to show the **average tip amount** for each day of the week.
- The **tips** dataset is loaded.
- A **horizontal bar plot** is created using the tip column on the X-axis and the day column on the Y-axis.
- Seaborn automatically calculates the **average tip** for each day.
- The days are displayed in a **custom order**: **Sun, Sat, Fri, Thur**.
- The bars are colored **coral**.
- A title and X-axis label are added, and the graph is displayed.

**Output Explanation**
The output is a **horizontal bar plot**.
- **X-axis:** Average Tip Amount (in dollars).
- **Y-axis:** Days of the Week (Sun, Sat, Fri, Thur).
- **Horizontal Bars:** Represent the average tip for each day.
![Seaborn output](/EDA_images/simg19.png)

## 3.2  sns.countplot() — Count of Categories

:::definition
**Count Plot**
A count plot shows the number of observations (rows) for each category in a column. It is like a histogram but for categorical data — the y-axis always shows the count of data points.
:::

### Syntax

\`\`\`python
sns.countplot(
    data=None,
    x=None,         # Categorical column to count
    y=None,         # Use this for horizontal count plot
    hue=None,       # Sub-group coloring
    order=None,     # Order categories
    hue_order=None,
    orient=None,
    color=None,
    palette=None,
    saturation=0.75,
    width=0.8,
    dodge=True,
    ax=None,
    stat='count',  # 'count' or 'percent'
)
\`\`\`

### Example 1 — Basic Count Plot

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# How many customers on each day?
sns.countplot(data=df, x='day')

plt.title('Number of Customers per Day')
plt.xlabel('Day')
plt.ylabel('Count')
plt.show()
\`\`\`

This program creates a **count plot** to show the **number of customers** for each day of the week.
- The **tips** dataset is loaded.
- A **count plot** is created using the day column.
- The plot counts how many records (customers) belong to each day.
- A title and axis labels are added, and the graph is displayed.

**Output Explanation**
The output is a **count plot**.
- **X-axis:** Days of the Week (Thur, Fri, Sat, Sun).
- **Y-axis:** Number of Customers (Count).
- **Bars:** Represent the total number of customers on each day.
![Seaborn output](/EDA_images/simg20.png)

### Example 2 — Count Plot with Hue

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# Count customers per day, split by smoker status
sns.countplot(
    data=df,
    x='day',
    hue='smoker',
    palette='pastel',
)

plt.title('Customer Count by Day and Smoker Status')
plt.xlabel('Day')
plt.ylabel('Count')
plt.legend(title='Smoker')
plt.show()
\`\`\`

**Explanation**
This program creates a **count plot** to compare the **number of customers** by **day of the week** and **smoker status**.
- The **tips** dataset is loaded.
- A **count plot** is created using the day column.
- The **smoker** column is used to create separate bars for **Smokers** and **Non-Smokers**.
- Different colors are used to distinguish the two groups.
- A title, axis labels, and a legend are added, and the graph is displayed.

**Output Explanation**
The output is a **grouped count plot**.
- **X-axis:** Days of the Week (Thur, Fri, Sat, Sun).
- **Y-axis:** Number of Customers (Count).
- **Different Colored Bars:** Represent **Smokers** and **Non-Smokers**.
![Seaborn output](/EDA_images/simg21.png)

### Example 3 — Count Plot with Percentage

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# Show percentage instead of count
sns.countplot(
    data=df,
    x='day',
    stat='percent',   # y-axis in percentage
    color='skyblue',
)

plt.title('% of Customers per Day')
plt.ylabel('Percentage (%)')
plt.show()
\`\`\`

**Explanation**
This program creates a **count plot** to show the **percentage of customers** for each day of the week instead of the actual count.
- The **tips** dataset is loaded.
- A **count plot** is created using the day column.
- The **stat='percent'** option displays the Y-axis as **percentages** instead of counts.
- The bars are colored **sky blue**.
- A title and Y-axis label are added, and the graph is displayed.

**Output Explanation**
The output is a **count plot with percentages**.
- **X-axis:** Days of the Week (Thur, Fri, Sat, Sun).
- **Y-axis:** Percentage of Customers (%).
- **Bars:** Represent the percentage of customers who visited on each day.
![Seaborn output](/EDA_images/simg22.png)

## 3.3  sns.boxplot() — Box-and-Whisker Plot

:::definition
**Box Plot (Box-and-Whisker)**
A box plot shows the distribution of a numeric variable using 5 key statistics: minimum, Q1 (25th percentile), median (50th percentile), Q3 (75th percentile), and maximum. Points beyond the whiskers are shown as individual dots (outliers).
:::

### Understanding the Box Plot Structure

| Part of Box Plot | What It Represents |
|---|---|
| Bottom of box (Q1) | 25th percentile — 25% of data is below this value |
| Middle line (median) | 50th percentile — exactly half the data is below this |
| Top of box (Q3) | 75th percentile — 75% of data is below this value |
| Box height (IQR) | Q3 - Q1 = Interquartile Range. Shows the middle 50% spread. |
| Lower whisker | Q1 - 1.5×IQR (or the minimum if no outliers) |
| Upper whisker | Q3 + 1.5×IQR (or the maximum if no outliers) |
| Dots beyond whiskers | Outliers — unusual data points far from the main group |

### Syntax

\`\`\`python
sns.boxplot(
    data=None,
    x=None,            # Categorical column (groups)
    y=None,            # Numeric column (values)
    hue=None,          # Sub-group coloring
    order=None,        # Order of categories
    hue_order=None,
    orient=None,       # 'v' or 'h'
    color=None,
    palette=None,
    saturation=0.75,
    width=0.8,
    dodge=True,
    fliersize=5,       # Size of outlier dots
    linewidth=None,    # Thickness of box lines
    whis=1.5,          # Whisker length multiplier of IQR
    showfliers=True,   # Show/hide outlier dots
    ax=None,
)
\`\`\`

### Example 1 — Basic Box Plot

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# Box plot of tips per day
sns.boxplot(data=df, x='day', y='tip')

plt.title('Tip Distribution per Day')
plt.xlabel('Day')
plt.ylabel('Tip Amount ($)')
plt.show()
\`\`\`

**Explanation**
This program creates a **box plot** to show the **distribution of tip amounts** for each day of the week.
- The **tips** dataset is loaded.
- A **box plot** is created using the day column on the X-axis and the tip column on the Y-axis.
- Each box summarizes the distribution of tip amounts for a particular day.
- A title and axis labels are added, and the graph is displayed.

**Output Explanation**
The output is a **box plot**.
- **X-axis:** Days of the Week (Thur, Fri, Sat, Sun).
- **Y-axis:** Tip Amount (in dollars).
- **Each Box:** Shows the spread of tip amounts for that day.
- **Middle Line:** Represents the **median (middle value)**.
- **Box:** Represents the middle 50% of the tip values.
- **Whiskers:** Show the range of most tip values.
- **Points Outside the Whiskers:** Represent **outliers** (unusually high or low tip amounts).
![Seaborn output](/EDA_images/simg23.png)

### Example 2 — Box Plot with Hue

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

sns.boxplot(
    data=df,
    x='day',
    y='total_bill',
    hue='smoker',
    palette='Set3',
)

plt.title('Bill Distribution by Day and Smoking Status')
plt.legend(title='Smoker')
plt.show()
\`\`\`

**Explanation**
This program creates a **grouped box plot** to compare the **distribution of total bill amounts** by **day of the week** and **smoking status**.
- The **tips** dataset is loaded.
- A **box plot** is created using the day column on the X-axis and the total_bill column on the Y-axis.
- The **smoker** column is used to create separate box plots for **Smokers** and **Non-Smokers**.
- Different colors are used to distinguish the two groups.
- A title and legend are added, and the graph is displayed.

**Output Explanation**
The output is a **grouped box plot**.
- **X-axis:** Days of the Week (Thur, Fri, Sat, Sun).
- **Y-axis:** Total Bill Amount (in dollars).
- **Different Colored Boxes:** Represent **Smokers** and **Non-Smokers**.
- **Middle Line:** Represents the **median (middle value)**.
- **Box:** Represents the middle 50% of the bill amounts.
- **Whiskers:** Show the range of most bill values.
- **Points Outside the Whiskers:** Represent **outliers** (unusually high or low bill amounts).

![Seaborn output](/EDA_images/simg24.png)

### Example 3 — Removing Outliers

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# Hide outlier dots
sns.boxplot(
    data=df,
    x='day',
    y='tip',
    showfliers=False,  # Don't show outliers
    color='lightcoral',
)

plt.title('Tip Distribution (Outliers Hidden)')
plt.show()
\`\`\`

**Explanation**
This program creates a **box plot** to show the **distribution of tip amounts** for each day of the week, while **hiding the outlier values**.
- The **tips** dataset is loaded.
- A **box plot** is created using the day column on the X-axis and the tip column on the Y-axis.
- The **showfliers=False** option hides the outlier points from the graph.
- The boxes are colored **light coral**.
- A title is added, and the graph is displayed.

**Output Explanation**
The output is a **box plot without outliers**.
- **X-axis:** Days of the Week (Thur, Fri, Sat, Sun).
- **Y-axis:** Tip Amount (in dollars).
- **Middle Line:** Represents the **median (middle value)**.
- **Box:** Represents the middle 50% of the tip values.
- **Whiskers:** Show the range of most tip values.
- **Outlier Points:** Are **not displayed**.

![Seaborn output](/EDA_images/simg25.png)

:::note
Use showfliers=False when you want a cleaner look. But be careful — hiding outliers removes important information about extreme values.
:::

## 3.4  sns.stripplot() — Jittered Data Points

:::definition
**Strip Plot**
A strip plot shows each individual data point as a dot. Points in the same category are placed along the same vertical position. 'Jitter' adds a small random horizontal shift to each point so they don't all stack exactly on top of each other and become visible.
:::

### Syntax

\`\`\`python
sns.stripplot(
    data=None,
    x=None,
    y=None,
    hue=None,
    order=None,
    hue_order=None,
    jitter=True,       # Add random horizontal scatter
    dodge=False,       # Separate hue groups side by side
    orient=None,
    color=None,
    palette=None,
    size=5,            # Dot size in points
    edgecolor='gray',  # Dot border color
    linewidth=0,       # Dot border thickness
    alpha=None,
    ax=None,
)
\`\`\`

### Example 1 — Basic Strip Plot

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# Show every data point
sns.stripplot(data=df, x='day', y='tip')

plt.title('All Tip Values by Day')
plt.xlabel('Day')
plt.ylabel('Tip ($)')
plt.show()
\`\`\`

**Explanation**
This program creates a **strip plot** to display **every individual tip value** for each day of the week.
- The **tips** dataset is loaded.
- A **strip plot** is created using the day column on the X-axis and the tip column on the Y-axis.
- Each **dot** represents the tip amount of one customer.
- The plot shows all data points without summarizing them.
- A title and axis labels are added, and the graph is displayed.

**Output Explanation**
The output is a **strip plot**.
- **X-axis:** Days of the Week (Thur, Fri, Sat, Sun).
- **Y-axis:** Tip Amount (in dollars).
- **Dots:** Each dot represents one customer's tip amount.

![Seaborn output](/EDA_images/simg26.png)

### Example 2 — Box Plot + Strip Plot Combined

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# Draw box plot first
sns.boxplot(
    data=df, x='day', y='tip',
    palette='pastel',
    width=0.5,
    showfliers=False,  # hide boxplot's outliers (stripplot shows them)
)

# Then overlay strip plot
sns.stripplot(
    data=df, x='day', y='tip',
    color='black',
    size=4,
    alpha=0.4,
    jitter=True,
)

plt.title('Tip Distribution (Box + Strip)')
plt.show()
\`\`\`

**Explanation**
This program combines a **box plot** and a **strip plot** to show the **distribution of tip amounts** for each day of the week.
- The **tips** dataset is loaded.
- A **box plot** is created first to summarize the distribution of tip amounts for each day.
- The box plot **hides outlier points** because the strip plot will display all individual values.
- A **strip plot** is then added on top of the box plot.
- Each black dot represents one customer's tip amount, and **jitter** spreads the dots slightly to prevent overlapping.
- A title is added, and the graph is displayed.

**Output Explanation**
The output is a **box plot with a strip plot overlay**.
- **X-axis:** Days of the Week (Thur, Fri, Sat, Sun).
- **Y-axis:** Tip Amount (in dollars).
- **Box Plot:** Shows the median, spread, and distribution of tip amounts.
- **Black Dots:** Represent individual tip values for each customer.

![Seaborn output](/EDA_images/simg27.png)

:::tip
Combining boxplot + stripplot is a very popular technique. The box shows summary statistics, while the strip shows all individual data points. Together they give the most complete picture.
:::

### Summary — Basic Categorical Plots

| Function | Shows | Best For |
|---|---|---|
| sns.barplot() | Mean + CI per category | Comparing average values between groups |
| sns.countplot() | Count of records per category | Showing frequency of each category |
| sns.boxplot() | Q1, Median, Q3, Whiskers, Outliers | Understanding spread and outliers per group |
| sns.stripplot() | Every individual data point | Seeing raw data distribution, small datasets |`,

4: `# TOPIC 4: Relational Plots (Basic)

Relational plots show the relationship (connection) between two or more numeric variables. For example: 'Does a higher bill always mean a higher tip?' or 'How do passenger numbers change over time?'

:::definition
**Relational Plot**
A plot that visualizes the relationship between two numeric (continuous) variables — typically one on the x-axis and one on the y-axis.
:::

## 4.1  sns.scatterplot() — x, y with hue/size/style

:::definition
**Scatter Plot**
A scatter plot places each data point as a dot on a 2D plane. The x-position represents one variable, and the y-position represents another. It is used to detect trends, clusters, and correlations between two variables.
:::

### Syntax

\`\`\`python
sns.scatterplot(
    data=None,
    x=None,          # Numeric column for x-axis
    y=None,          # Numeric column for y-axis
    hue=None,        # Color-code dots by category
    size=None,       # Size of dots by numeric column
    style=None,      # Marker shape by category
    palette=None,
    hue_order=None,
    hue_norm=None,
    sizes=None,      # (min_size, max_size) tuple
    size_order=None,
    size_norm=None,
    markers=True,    # True = default markers
    legend='auto',   # 'auto', 'brief', 'full', False
    ax=None,
    color=None,
    alpha=None,
)
\`\`\`

### hue, size, style — The Power Trio

| Parameter | Controls | Column Type | Example |
|---|---|---|---|
| hue | Dot color | Categorical or numeric | hue='sex' → Male=blue, Female=orange |
| size | Dot size | Numeric | size='size' → larger table = bigger dot |
| style | Dot shape/marker | Categorical | style='smoker' → Yes=circle, No=square |

### Example 1 — Basic Scatter Plot

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# Does tip go up with total bill?
sns.scatterplot(data=df, x='total_bill', y='tip')

plt.title('Tip vs Total Bill')
plt.xlabel('Total Bill ($)')
plt.ylabel('Tip ($)')
plt.show()
\`\`\`

**Explanation**
This program creates a **scatter plot** to show the **relationship between the total bill amount and the tip amount**.
- The **tips** dataset is loaded.
- A **scatter plot** is created using the total_bill column on the X-axis and the tip column on the Y-axis.
- Each **dot** represents one customer's total bill and the corresponding tip.
- A title and axis labels are added, and the graph is displayed.

**Output Explanation**
The output is a **scatter plot**.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Tip Amount (in dollars).
- **Dots:** Each dot represents one customer's bill and tip.

![Seaborn output](/EDA_images/simg28.png)

### Example 2 — Scatter with Hue and Style

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

sns.scatterplot(
    data=df,
    x='total_bill',
    y='tip',
    hue='sex',         # Color by gender
    style='smoker',    # Shape by smoker status
    palette='Set1',
    alpha=0.7,
)

plt.title('Tip vs Bill (by Gender and Smoker Status)')
plt.legend(title='Attributes')
plt.show()
\`\`\`

**Explanation**
This program creates a **scatter plot** to show the **relationship between the total bill and tip amount**, while also comparing **gender** and **smoker status**.
- The **tips** dataset is loaded.
- A **scatter plot** is created using total_bill on the X-axis and tip on the Y-axis.
- The **sex** column is used to color the points based on gender.
- The **smoker** column is used to display different point shapes for smokers and non-smokers.
- Slight transparency is added to make overlapping points easier to see.
- A title and legend are added, and the graph is displayed.

**Output Explanation**
The output is a **scatter plot**.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Tip Amount (in dollars).
- **Different Colors:** Represent **Male** and **Female** customers.
- **Different Shapes:** Represent **Smokers** and **Non-Smokers**.
- **Each Point:** Represents one customer's total bill and tip.
![Seaborn output](/EDA_images/simg29.png)

### Example 3 — Scatter with Hue + Size (3 Variables)

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

sns.scatterplot(
    data=df,
    x='total_bill',
    y='tip',
    hue='day',         # Color by day
    size='size',       # Dot size by party size
    sizes=(30, 200),   # Min and max dot size in pixels
    palette='tab10',
    alpha=0.8,
)

plt.title('Tip vs Bill (Color=Day, Size=Party Size)')
plt.legend(title='Legend', bbox_to_anchor=(1, 1))
plt.tight_layout()
plt.show()
\`\`\`

**Explanation**
This program creates a **scatter plot** to show the **relationship between the total bill and tip amount**, while also displaying the **day of the week** and **party size**.
- The **tips** dataset is loaded.
- A **scatter plot** is created using total_bill on the X-axis and tip on the Y-axis.
- The **day** column is used to color the points based on the day of the week.
- The **size** column is used to change the size of each dot according to the number of people in the party.
- Different colors and dot sizes make it easier to compare the data.
- A title and legend are added, and the graph is displayed.

**Output Explanation**
The output is a **scatter plot**.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Tip Amount (in dollars).
- **Different Colors:** Represent different days of the week (Thur, Fri, Sat, Sun).
- **Different Dot Sizes:** Represent different party sizes.
- **Each Point:** Represents one customer's bill and tip.

![Seaborn output](/EDA_images/simg30.png)

### Example 4 — Using a Numeric Column for Hue

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# Use a continuous column as hue (color gradient)
sns.scatterplot(
    data=df,
    x='total_bill',
    y='tip',
    hue='size',        # party size (numeric 1-6)
    palette='coolwarm',
    size='size',
    sizes=(40, 160),
)

plt.title('Scatter: Party Size as Color and Size')
plt.colorbar()  # This won't work directly — use legend
plt.show()
\`\`\`

**Explanation**
This program creates a **scatter plot** to show the **relationship between the total bill and tip amount**, while using **party size** to control both the **color** and **size** of the points.
- The **tips** dataset is loaded.
- A **scatter plot** is created using total_bill on the X-axis and tip on the Y-axis.
- The **size** column is used to assign a **color gradient** and **dot size** based on the number of people in the party.
- Larger parties appear as **larger dots**, and different colors represent different party sizes.
- A title is added, and the graph is displayed.
- **Note:** plt.colorbar() does **not work** with Seaborn's scatterplot; the **legend** is used instead to show the color and size information.

**Output Explanation**
The output is a **scatter plot**.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Tip Amount (in dollars).
- **Dot Color:** Represents the **party size** using a color gradient.
- **Dot Size:** Also represents the **party size** (larger party → larger dot).
- **Each Point:** Represents one customer's total bill and tip.

![Seaborn output](/EDA_images/simg31.png)

:::note
When hue is a numeric column, Seaborn creates a color gradient (sequential palette) instead of distinct colors. Use palette='coolwarm', 'viridis', or 'Blues' for numeric hue.
:::

## 4.2  sns.lineplot() — Line with Confidence Interval Band

:::definition
**Line Plot**
A line plot connects data points in order of the x-axis variable. It is used to show trends over time or ordered categories. If there are multiple y values for the same x value, Seaborn automatically shows the mean and a shaded confidence interval band.
:::

### Syntax

\`\`\`python
sns.lineplot(
    data=None,
    x=None,             # x-axis column (often time/order)
    y=None,             # y-axis numeric column
    hue=None,           # Different line per category
    size=None,          # Line thickness by variable
    style=None,         # Line dash style by category
    palette=None,
    hue_order=None,
    hue_norm=None,
    sizes=None,
    dashes=True,        # Whether to use dashes for style groups
    markers=False,      # Show data point markers on line
    estimator='mean',   # How to aggregate multiple y values
    errorbar=('ci',95), # Shaded band: ('ci',95),'sd',None
    n_boot=1000,
    seed=None,
    orient='x',
    sort=True,          # Sort x values before plotting
    err_style='band',   # 'band' (shaded) or 'bars' (error bars)
    ax=None,
)
\`\`\`

### Example 1 — Basic Line Plot with CI Band

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('flights')

# Average passengers per year (aggregated across all months)
sns.lineplot(data=df, x='year', y='passengers')

plt.title('Average Passengers per Year (with 95% CI)')
plt.xlabel('Year')
plt.ylabel('Number of Passengers')
plt.show()
\`\`\`

![Seaborn output](/EDA_images/simg32.png)

**Explanation**
This program creates a **line plot** to show the **average number of passengers** for each year using the flights dataset.
- The **flights** dataset is loaded.
- A **line plot** is created using the year column on the X-axis and the passengers column on the Y-axis.
- Seaborn automatically calculates the **average number of passengers** for each year (across all months).
- By default, a **95% Confidence Interval (CI)** is displayed around the line to show the uncertainty in the average.
- A title and axis labels are added, and the graph is displayed.

**Output Explanation**
The output is a **line plot**.
- **X-axis:** Year.
- **Y-axis:** Average Number of Passengers.
- **Line:** Represents the average number of passengers for each year.
- **Shaded Area (95% CI):** Shows the confidence interval around the average.

### Example 2 — Line Plot with Hue (Multiple Lines)

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('flights')

# Separate line per month
sns.lineplot(
    data=df,
    x='year',
    y='passengers',
    hue='month',       # One line per month
    palette='tab20',   # 12 distinct colors
    legend='full',     # Show all 12 months in legend
)

plt.title('Monthly Passengers from 1949 to 1960')
plt.legend(title='Month', bbox_to_anchor=(1.01, 1),
           loc='upper left', fontsize=8)
plt.tight_layout()
plt.show()
\`\`\`

**Explanation**
This program creates a **line plot** to show the **number of passengers** over the years for **each month**.
- The **flights** dataset is loaded.
- A **line plot** is created using the year column on the X-axis and the passengers column on the Y-axis.
- The **month** column is used to draw a separate line for each month.
- Different colors are used to distinguish the 12 months.
- A legend is added to identify each month's line.
- A title is added, and the graph is displayed.

**Output Explanation**
The output is a **multi-line plot**.
- **X-axis:** Year (1949–1960).
- **Y-axis:** Number of Passengers.
- **Different Colored Lines:** Represent different months (January to December).
![Seaborn output](/EDA_images/simg33.png)

### Example 3 — Line Plot with Style and Markers

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset(‘fmri’)

# fmri dataset: brain signal over time for different events/regions
sns.lineplot(
    data=df,
    x=’timepoint’,
    y=’signal’,
    hue=’event’,       # Color by event type
    style=’event’,     # Line style by event type
    markers=True,      # Add markers on each data point
)

plt.title(‘Brain Signal Over Time by Event Type’)
plt.xlabel(‘Time Point’)
plt.ylabel(‘Signal Strength’)
plt.show()
\`\`\`

**Explanation**
This program creates a **line plot** to show how the **brain signal changes over time** for different **event types** using the fmri dataset.
- The **fmri** dataset is loaded.
- A **line plot** is created using the timepoint column on the X-axis and the signal column on the Y-axis.
- The **event** column is used to create separate lines for different event types.
- Different **colors** and **line styles** are used to distinguish each event type.
- **Markers** are added to show the individual data points.
- A title and axis labels are added, and the graph is displayed.

**Output Explanation**
The output is a **multi-line plot**.
- **X-axis:** Time Point.
- **Y-axis:** Signal Strength.
- **Different Colored and Styled Lines:** Represent different event types.
- **Markers:** Represent the signal value at each time point.

![Seaborn output](/EDA_images/simg34.png)

### Disabling the CI Band

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('flights')

# Remove the confidence interval shading
sns.lineplot(
    data=df,
    x='year',
    y='passengers',
    errorbar=None,     # Removes CI band entirely
    color='tomato',
    linewidth=2.5,
)

plt.title('Passengers per Year (No CI)')
plt.show()
\`\`\`

**Explanation**
This program creates a **line plot** to show the **average number of passengers** for each year without displaying the **confidence interval (CI)**.
- The **flights** dataset is loaded.
- A **line plot** is created using the year column on the X-axis and the passengers column on the Y-axis.
- Seaborn calculates the **average number of passengers** for each year.
- The **errorbar=None** option removes the default confidence interval (shaded area).
- The line is displayed in **tomato** color with a thicker width for better visibility.
- A title is added, and the graph is displayed.

**Output Explanation**
The output is a **line plot**.
- **X-axis:** Year.
- **Y-axis:** Average Number of Passengers.
- **Red Line:** Represents the average number of passengers for each year.
- **No Shaded Area:** The confidence interval is removed.

![Seaborn output](/EDA_images/simg35.png)

### Summary — Relational Plots

| Function | Best For | Key Parameters |
|---|---|---|
| sns.scatterplot() | Relationship between two numeric variables | hue, size, style — encode extra variables |
| sns.lineplot() | Trends over time or ordered sequences | errorbar — controls CI band, style — line pattern |`,

5: `# TOPIC 5: Themes & Aesthetics (Basic)

Seaborn makes it very easy to make your plots look professional and visually appealing. Themes control the background and grid style, while palettes control the colors used. Setting good aesthetics is important for readability and presentation.

## 5.1  sns.set_theme() — Overall Theme

:::definition
**Theme**
A theme in Seaborn is a combination of a style (background + grid lines) and a context (element sizes). Setting a theme applies it to all subsequent plots in your notebook or script.
:::

### Syntax

\`\`\`python
sns.set_theme(
    context='notebook', # 'paper', 'notebook', 'talk', 'poster'
    style='darkgrid',   # 'darkgrid','whitegrid','dark','white','ticks'
    palette='deep',     # Color palette name
    font='sans-serif',  # Font family
    font_scale=1,       # Scale all font sizes
    color_codes=True,   # Allow 'b','r','g' shorthand colors
    rc=None,            # Additional matplotlib rcParams dict
)
\`\`\`

### context parameter — Adjusts Size for Output Type

| Context | Use Case | Effect |
|---|---|---|
| 'paper' | Academic papers, printed documents | Smallest elements, minimal ink |
| 'notebook' | Jupyter Notebooks (default) | Balanced sizes for screen |
| 'talk' | Presentations, slides | Larger text and elements |
| 'poster' | Conference posters, large displays | Largest elements for viewing at distance |

### Example — Setting Theme

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

# Set theme once at the start — applies to ALL plots after this
sns.set_theme(
    context='notebook',
    style='whitegrid',
    palette='muted',
    font_scale=1.2,    # Make all text 20% larger
)

df = sns.load_dataset('tips')
sns.boxplot(data=df, x='day', y='tip')
plt.title('Tips per Day (whitegrid theme)')
plt.show()
\`\`\`

**Explanation**
This program sets a **Seaborn theme** and then creates a **box plot** to show the **distribution of tip amounts** for each day of the week.
- The **theme** is set at the beginning, and it applies to all plots created afterward.
- The theme uses a **white grid background**, a **muted color palette**, and **slightly larger text** for better readability.
- The **tips** dataset is loaded.
- A **box plot** is created using the day column on the X-axis and the tip column on the Y-axis.
- A title is added, and the graph is displayed.

**Output Explanation**
The output is a **box plot with the whitegrid theme**.
- **X-axis:** Days of the Week (Thur, Fri, Sat, Sun).
- **Y-axis:** Tip Amount (in dollars).
- **Box Plot:** Shows the distribution of tip amounts for each day.
- **White Grid Background:** Makes it easier to read and compare values.
- **Larger Text:** Improves the readability of the title and labels.

![Seaborn output](/EDA_images/simg36.png)

## 5.2  Seaborn Styles — darkgrid, whitegrid, dark, white, ticks

Seaborn has 5 built-in styles. A style controls the background color and whether grid lines are shown. You can set a style using sns.set_theme(style='...') or sns.set_style('...').

| Style Name | Background | Grid Lines | Best For |
|---|---|---|---|
| 'darkgrid' | Dark gray | Yes (white) | Default — general purpose, easy to read |
| 'whitegrid' | White | Yes (light gray) | Reports, publications, clean look |
| 'dark' | Dark gray | No | Presentations with dark theme |
| 'white' | White | No | Minimal, clean look (no distractions) |
| 'ticks' | White | No (only tick marks) | Academic papers, formal reports |

### Example — All 5 Styles Side by Side

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

styles = ['darkgrid', 'whitegrid', 'dark', 'white', 'ticks']
df = sns.load_dataset('tips')

fig, axes = plt.subplots(1, 5, figsize=(20, 4))

for ax, style in zip(axes, styles):
    with sns.axes_style(style):  # Temporarily apply style
        sns.boxplot(data=df, x='day', y='tip', ax=ax)
        ax.set_title(f"style='{style}'")
        ax.set_xlabel('')

plt.suptitle('Comparison of Seaborn Styles', y=1.02, fontsize=14)
plt.tight_layout()
plt.show()
\`\`\`

**Explanation**
This program compares **five different Seaborn styles** by displaying the same **box plot** with each style.
- The **tips** dataset is loaded.
- Five styles are used: **darkgrid, whitegrid, dark, white, and ticks**.
- A row of **five subplots** is created.
- Each box plot uses the same data but applies a different Seaborn style temporarily.
- A title is added to each subplot showing the style name.
- An overall title is added, and all plots are displayed together.

**Output Explanation**
The output contains **five box plots**, each with a different Seaborn style.
- **X-axis:** Days of the Week (Thur, Fri, Sat, Sun).
- **Y-axis:** Tip Amount (in dollars).
- **Each Plot:** Shows the same tip distribution but with a different visual style.
![Seaborn output](/EDA_images/simg37.png)

:::note
Use  sns.axes_style(style)  as a context manager (with block) to apply a style to just one plot without affecting others.
:::

### sns.reset_defaults() and sns.reset_orig()

\`\`\`python
# Reset to Seaborn defaults
sns.reset_defaults()

# Reset to original Matplotlib defaults (removes all Seaborn styling)
sns.reset_orig()
\`\`\`

## 5.3  sns.set_palette() and color_palette()

:::definition
**Color Palette**
A color palette is a set of colors used to visually distinguish different categories or data points in a plot. Seaborn has many built-in palettes optimized for different use cases.
:::

### Setting a Palette

\`\`\`python
# Method 1: Set palette globally (all subsequent plots use it)
sns.set_palette('Set2')

# Method 2: Pass palette directly to a specific plot
sns.boxplot(data=df, x='day', y='tip', palette='Set2')

# Method 3: Create a palette object and inspect it
pal = sns.color_palette('Set2', n_colors=8)
sns.palplot(pal)  # Displays the palette as color swatches
plt.show()
\`\`\`

**Explanation**
This program demonstrates **three different ways to use color palettes in Seaborn**.
- **Method 1:** Sets the **Set2** color palette as the default, so all plots created afterward use these colors.
- **Method 2:** Applies the **Set2** palette only to a specific **box plot** showing the distribution of tips by day.
- **Method 3:** Creates a **palette object** with 8 colors and displays those colors as a palette using palplot().

**Output Explanation**
The output contains **two visualizations**.
1. **Box Plot**
- ↳ **X-axis:** Days of the Week (Thur, Fri, Sat, Sun).
- ↳ **Y-axis:** Tip Amount (in dollars).
- ↳ The boxes are colored using the **Set2** color palette.
2. **Color Palette Display**
- ↳ A row of **8 colored blocks** is displayed.
- ↳ Each block represents one color from the **Set2** palette.

![Seaborn output](/EDA_images/simg38.png)
![Seaborn output](/EDA_images/simg39.png)
Image 38,39

## 5.4  Qualitative, Sequential, and Diverging Palettes

Seaborn has three types of palettes for different kinds of data. Choosing the right type makes your visualization much easier to understand.

### Type 1 — Qualitative (Categorical) Palettes

:::definition
**Qualitative Palette**
Used for categorical data where categories have no order or ranking. Each color is distinct and different — like coloring Male vs Female, or Monday vs Tuesday.
:::

| Palette Name | Colors | Best For |
|---|---|---|
| 'deep' | 6 rich, distinct colors | Default Seaborn palette — general use |
| 'muted' | 6 softer versions of deep | Professional reports, less saturated look |
| 'bright' | 6 bright vivid colors | High contrast, presentations |
| 'pastel' | 6 light pastel colors | Gentle look, overlapping transparency |
| 'dark' | 6 dark versions | When background is light |
| 'colorblind' | 6 colors safe for color blindness | Accessible charts for all audiences |
| 'Set1' | 9 bold, distinct colors | Up to 9 categories |
| 'Set2' | 8 soft colors | Up to 8 categories |
| 'Set3' | 12 light colors | Up to 12 categories |
| 'tab10' | 10 colors (Tableau style) | Exact Tableau/Power BI look |
| 'tab20' | 20 distinct colors | Many categories |

### Type 2 — Sequential Palettes

:::definition
**Sequential Palette**
Used for numeric data that goes from low to high. Colors progress from light to dark (or one color to another). Used when hue represents a numeric value.
:::

| Palette Name | Color Range | Best For |
|---|---|---|
| 'Blues' | Light to dark blue | Temperature, counts, scores |
| 'Greens' | Light to dark green | Growth, positive values |
| 'Reds' | Light to dark red | Risk, intensity |
| 'viridis' | Purple → green → yellow | Perceptually uniform — scientific plots |
| 'plasma' | Blue → purple → yellow | Alternative to viridis |
| 'magma' | Black → red → white | Heatmaps, dark themes |
| 'coolwarm' | Blue → white → red | Temperature deviation maps |

### Type 3 — Diverging Palettes

:::definition
**Diverging Palette**
Used when data has a meaningful center point (like zero or a median). Colors diverge from a neutral center color (white/light) to two contrasting ends. Used for correlation matrices, deviation from average.
:::

| Palette Name | Colors | Best For |
|---|---|---|
| 'RdBu' | Red ← white → Blue | Correlation matrices, positive/negative deviation |
| 'RdYlGn' | Red ← yellow → Green | Good/bad scales, traffic light coding |
| 'coolwarm' | Blue ← white → Red | Temperature, deviation from mean |
| 'BrBG' | Brown ← white → Green | Environmental data, dry/wet scale |
| 'PuOr' | Purple ← white → Orange | When you need non-typical contrast |

### Example — Displaying All Three Palette Types

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

fig, axes = plt.subplots(3, 1, figsize=(10, 4))

# Qualitative
sns.palplot(sns.color_palette('Set2', 8))
plt.title('Qualitative: Set2')

# Sequential
sns.palplot(sns.color_palette('Blues', 8))
plt.title('Sequential: Blues')

# Diverging
sns.palplot(sns.color_palette('RdBu', 11))
plt.title('Diverging: RdBu')

plt.show()
\`\`\`

**Explanation**
This program displays **three different types of Seaborn color palettes**.
- A figure is created to display multiple palette examples.
- A **Qualitative palette (Set2)** is shown, which is suitable for distinguishing different categories.
- A **Sequential palette (Blues)** is shown, which is useful for representing values from low to high.
- A **Diverging palette (RdBu)** is shown, which is useful for showing values that move away from a central point in two directions.
- Each palette is displayed as a row of colored blocks with its own title.

**Output Explanation**
The output displays **three color palette examples**.
1. **Qualitative: Set2**
- ↳ Shows different distinct colors.
- ↳ Best for **categorical data**.
2. **Sequential: Blues**
- ↳ Shows shades from **light blue to dark blue**.
- ↳ Best for **continuous data** with increasing values.
3. **Diverging: RdBu**
- ↳ Shows colors changing from **red through a neutral color to blue**.
- ↳ Best for data with a **middle reference value**, such as positive vs. negative values.
![Seaborn output](/EDA_images/simg40.png)
![Seaborn output](/EDA_images/simg41.png)
![Seaborn output](/EDA_images/simg42.png)
![Seaborn output](/EDA_images/simg43.png)
Image 40,41,42,43

### Example — Using a Custom Color Palette

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# Create a custom 4-color palette from hex codes
custom_palette = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12']

sns.barplot(
    data=df,
    x='day',
    y='tip',
    palette=custom_palette,
)

plt.title('Tips by Day (Custom Palette)')
plt.show()
\`\`\`

**Explanation**
This program creates a **bar plot** using a **custom color palette**.
- The **tips** dataset is loaded.
- A **custom palette** is created using four hexadecimal (Hex) color codes.
- A **bar plot** is created using the day column on the X-axis and the tip column on the Y-axis.
- Seaborn calculates the **average tip** for each day and colors each bar using the custom palette.
- A title is added, and the graph is displayed.

**Output Explanation**
The output is a **bar plot**.
- **X-axis:** Days of the Week (Thur, Fri, Sat, Sun).
- **Y-axis:** Average Tip Amount (in dollars).
- **Bars:** Represent the average tip for each day.
- **Different Colors:** Each bar uses one color from the custom palette.

![Seaborn output](/EDA_images/simg44.png)

### Quick Palette Cheat Sheet

| Use Case | Recommended Palette |
|---|---|
| Different categories (no order) | Set2, tab10, colorblind, deep |
| Low-to-high numeric values | viridis, Blues, YlOrRd |
| Positive and negative values | RdBu, coolwarm, diverging |
| Print-friendly / colorblind-safe | colorblind, viridis |
| Presentations (high contrast) | bright, tab10, Set1 |`,

6: `# TOPIC 6: Distribution Plots (Intermediate)

In Topic 2, we learned the basic distribution plot functions. Now we explore more advanced features: the figure-level wrapper displot(), bivariate distributions, multiple distributions together, bandwidth control, and cumulative KDE plots.

## 6.1  sns.displot() — Figure-level Distribution Wrapper

:::definition
**sns.displot()**
displot() is the figure-level version of distribution plots. It wraps histplot, kdeplot, and ecdfplot into one function and can create multi-panel grids using col= and row= parameters. It returns a FacetGrid object instead of Axes.
:::

### Syntax

\`\`\`python
sns.displot(
    data=None,
    x=None,
    y=None,
    hue=None,
    row=None,          # Split into rows by this column
    col=None,          # Split into columns by this column
    weights=None,
    kind='hist',       # 'hist', 'kde', 'ecdf'
    rug=False,         # Overlay rug plot
    rug_kws=None,      # Extra kwargs passed to rugplot
    bins='auto',
    binwidth=None,
    kde=False,         # Overlay KDE on histogram (when kind='hist')
    col_wrap=None,     # Wrap columns after this many
    height=5,          # Height of each subplot
    aspect=1,          # Width = height * aspect
    palette=None,
    fill=None,
    multiple='layer',
    bw_adjust=1,
    log_scale=False,
    facet_kws=None,    # Extra kwargs for FacetGrid
)
\`\`\`

### Example 1 — Basic displot (kind='hist')

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

g = sns.displot(data=df, x='total_bill', kind='hist', bins=20)

g.set_axis_labels('Total Bill ($)', 'Count')
g.figure.suptitle('displot — Histogram', y=1.02)
plt.show()
\`\`\`

**Explanation**
This program creates a **histogram** using Seaborn's **displot()** to show the distribution of **total bill amounts**.
- The **tips** dataset is loaded.
- A **histogram** is created using the total_bill column with **20 bins**.
- The X-axis and Y-axis labels are customized.
- An overall title is added to the figure.
- The graph is displayed.

**Output Explanation**
The output is a **histogram**.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Count (Number of Customers).
- **Bars:** Represent how many customers have total bills within each bill range.

![Seaborn output](/EDA_images/simg45.png)

### Example 2 — displot with col= (Multi-Panel)

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# One histogram per 'time' category (Lunch vs Dinner)
g = sns.displot(
    data=df,
    x='total_bill',
    col='time',          # Create 2 panels: Lunch | Dinner
    hue='sex',           # Color by sex within each panel
    kind='hist',
    bins=15,
    height=4,
    aspect=1.2,
)

g.set_axis_labels('Total Bill ($)', 'Count')
g.figure.suptitle('Bill Distribution by Meal Time and Gender', y=1.02)
plt.show()
\`\`\`

**Explanation**
This program creates a **histogram** using **displot()** to compare the **distribution of total bill amounts** by **meal time** and **gender**.
- The **tips** dataset is loaded.
- Separate histogram panels are created for **Lunch** and **Dinner** using the time column.
- Within each panel, different colors represent **Male** and **Female** customers.
- Each histogram uses **15 bins** to group the bill amounts.
- Axis labels and an overall title are added, and the graphs are displayed.

**Output Explanation**
The output contains **two histograms**.
- **Left Panel:** Lunch customers.
- **Right Panel:** Dinner customers.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Count (Number of Customers).
- **Different Colored Bars:** Represent **Male** and **Female** customers.

![Seaborn output](/EDA_images/simg46.png)

### Example 3 — displot with kind='kde'

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

g = sns.displot(
    data=df,
    x='total_bill',
    hue='smoker',
    col='day',           # One panel per day
    col_wrap=2,          # Wrap after 2 columns
    kind='kde',
    fill=True,
    height=3,
    aspect=1.4,
)

g.figure.suptitle('KDE of Bills by Day and Smoker Status', y=1.02)
plt.show()
\`\`\`

**Explanation**
This program creates **KDE (Kernel Density Estimation) plots** to compare the **distribution of total bill amounts** by **day of the week** and **smoker status**.
- The **tips** dataset is loaded.
- A separate **KDE plot** is created for each day using the day column.
- The plots are arranged in **two columns**.
- Within each plot, different colors represent **Smokers** and **Non-Smokers**.
- The area under each KDE curve is filled for better visualization.
- An overall title is added, and the graphs are displayed.

**Output Explanation**
The output contains **four KDE plots**, one for each day (Thur, Fri, Sat, Sun).
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Density.
- **Different Colored Curves:** Represent **Smokers** and **Non-Smokers**.
- **Filled Curves:** Make the distribution easier to compare.

![Seaborn output](/EDA_images/simg47.png)

## 6.2  Bivariate Distributions with kind='kde'

A bivariate distribution shows the joint distribution of TWO variables at the same time using contour lines or filled regions. It shows where combinations of x and y values are most common.

### Example — 2D KDE with displot

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

g = sns.displot(
    data=df,
    x='total_bill',
    y='tip',
    kind='kde',
    fill=True,
    cmap='Blues',
)

g.figure.suptitle('2D KDE: Bill vs Tip', y=1.02)
plt.show()
\`\`\`

**Explanation**
This program creates a **2D KDE (Kernel Density Estimation) plot** to show the **relationship between the total bill amount and the tip amount**.
- The **tips** dataset is loaded.
- A **2D KDE plot** is created using the total_bill column on the X-axis and the tip column on the Y-axis.
- The density areas are **filled** with shades of blue.
- Darker shades represent areas where more data points are concentrated.
- An overall title is added, and the graph is displayed.

**Output Explanation**
The output is a **2D KDE plot**.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Tip Amount (in dollars).
- **Blue Shaded Regions:** Represent the density of data points.
- **Darker Areas:** Indicate where many customers have similar bill and tip values.
- **Lighter Areas:** Indicate fewer customers.

![Seaborn output](/EDA_images/simg48.png)

### Example — 2D Histogram

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

g = sns.displot(
    data=df,
    x='total_bill',
    y='tip',
    kind='hist',    # 2D histogram
    cbar=True,      # Color bar legend
)

g.figure.suptitle('2D Histogram: Bill vs Tip', y=1.02)
plt.show()
\`\`\`

**Explanation**
This program creates a **2D histogram** to show the **relationship between the total bill amount and the tip amount**.
- The **tips** dataset is loaded.
- A **2D histogram** is created using the total_bill column on the X-axis and the tip column on the Y-axis.
- The graph divides the data into rectangular bins.
- The **color bar** indicates how many data points fall into each bin.
- An overall title is added, and the graph is displayed.

**Output Explanation**
The output is a **2D histogram**.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Tip Amount (in dollars).
- **Colored Boxes:** Represent groups of bill and tip values.
- **Color Bar:** Shows the number of customers in each box.
- ↳ **Darker colors:** More customers.
- ↳ **Lighter colors:** Fewer customers.

![Seaborn output](/EDA_images/simg49.png)

## 6.3  Multiple Distributions on One Plot

Sometimes you want to compare the distribution of a variable across multiple groups on the same plot. This is done using the hue= parameter with multiple= to control how groups overlap.

### multiple= parameter values

| Value | Effect | When to Use |
|---|---|---|
| 'layer' | Distributions drawn on top of each other (default) | Overlapping KDE or histogram |
| 'dodge' | Bars placed side-by-side per group | Side-by-side histograms |
| 'stack' | Bars stacked on top of each other | Showing composition |
| 'fill' | Bars fill entire height (normalized to 100%) | Showing proportions |

### Example — Four multiple= values

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')
multiples = ['layer', 'dodge', 'stack', 'fill']

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
axes = axes.flatten()

for ax, m in zip(axes, multiples):
    sns.histplot(
        data=df,
        x='total_bill',
        hue='sex',
        multiple=m,
        ax=ax,
        bins=12,
        palette='Set1',
    )
    ax.set_title(f"multiple='{m}'")
    ax.set_xlabel('Total Bill ($)')

plt.suptitle('Effect of multiple= Parameter', y=1.01, fontsize=14)
plt.tight_layout()
plt.show()
\`\`\`

**Explanation**
This program compares the different **multiple** options available in Seaborn's **histplot()**.
- The **tips** dataset is loaded.
- Four histograms are created using the same data.
- The **sex** column is used to separate the data into **Male** and **Female** groups.
- Each histogram uses a different **multiple** option:
- ↳ **layer** – Histograms overlap each other.
- ↳ **dodge** – Histograms are shown side by side.
- ↳ **stack** – Histograms are stacked on top of each other.
- ↳ **fill** – Histograms are stacked and normalized to show proportions (100%).
- An overall title is added, and all four plots are displayed together.

**Output Explanation**
The output contains **four histograms**.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Count (or proportion for fill).
- **Different Colors:** Represent **Male** and **Female** customers.

![Seaborn output](/EDA_images/simg50.png)

## 6.4  Bandwidth Adjustment — bw_adjust in kdeplot

This was introduced in Topic 2. Here we go deeper. The bandwidth in KDE is like a 'window' used to smooth the data. A larger window = smoother curve (loses fine detail). A smaller window = more detailed curve (shows every bump in data).

### Advanced bw_adjust Example — Finding the Right Smoothness

\`\`\`python
import seaborn as sns
import numpy as np
import matplotlib.pyplot as plt

# Create bimodal data (two separate groups)
np.random.seed(42)
data = np.concatenate([
    np.random.normal(loc=10, scale=1.5, size=200),  # Group 1
    np.random.normal(loc=20, scale=2, size=200),    # Group 2
])

import pandas as pd
df = pd.DataFrame({'value': data})

fig, axes = plt.subplots(1, 3, figsize=(15, 4), sharey=True)
bw_values = [0.2, 1.0, 4.0]

for ax, bw in zip(axes, bw_values):
    sns.kdeplot(data=df, x='value', bw_adjust=bw,
                ax=ax, fill=True, color='steelblue')
    ax.set_title(f'bw_adjust = {bw}')
    ax.set_xlabel('Value')

axes[0].set_ylabel('Density')
plt.suptitle('bw_adjust on Bimodal Distribution', y=1.02)
plt.tight_layout()
plt.show()
\`\`\`

**Explanation**
This program demonstrates how the **bw_adjust** parameter changes the **smoothness of a KDE plot** using a dataset with **two groups of values (bimodal distribution)**.
- A dataset with **two separate groups** of values is created.
- The data is stored in a DataFrame.
- Three **KDE plots** are created using different **bw_adjust** values: **0.2, 1.0, and 4.0**.
- All three plots are displayed side by side to compare the effect of different smoothing levels.
- An overall title is added, and the graphs are displayed.

**Output Explanation**
The output contains **three KDE plots**.
- **X-axis:** Value.
- **Y-axis:** Density.
- **Blue Filled Curve:** Shows the distribution of the data.

![Seaborn output](/EDA_images/simg51.png)

:::tip
For most data: start with bw_adjust=1 (default). If your data has clear groups, try 0.5 to 0.8. If data is noisy, try 1.5 to 2.0.
:::

## 6.5  Cumulative KDE Plots

A cumulative KDE shows the running total of density as you move from left to right. It reaches 1.0 (100%) at the rightmost value. Similar to ECDF but smooth (because it's based on KDE, not raw data steps).

### Example — Cumulative KDE

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# Regular KDE
sns.kdeplot(
    data=df,
    x='total_bill',
    hue='sex',
    fill=True,
    alpha=0.4,
    ax=axes[0],
)
axes[0].set_title('Regular KDE')

# Cumulative KDE
sns.kdeplot(
    data=df,
    x='total_bill',
    hue='sex',
    cumulative=True,   # Cumulative!
    ax=axes[1],
)
axes[1].set_title('Cumulative KDE')
axes[1].set_ylabel('Cumulative Density')

plt.suptitle('Regular vs Cumulative KDE', y=1.02)
plt.tight_layout()
plt.show()
\`\`\`

**Explanation**
This program compares a **Regular KDE plot** and a **Cumulative KDE plot** using the **total bill** values for **Male** and **Female** customers.
- The **tips** dataset is loaded.
- Two plots are created side by side.
- The **first plot** shows a **Regular KDE**, which displays the distribution of total bill amounts.
- The **second plot** shows a **Cumulative KDE**, which displays the cumulative density of total bill amounts.
- Different colors represent **Male** and **Female** customers.
- Titles are added to both plots, and the graphs are displayed.

**Output Explanation**
The output contains **two KDE plots**.

**1. Regular KDE**
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Density.
- **Colored Curves:** Represent Male and Female customers.
From this graph, you can observe:
- The overall distribution of total bill amounts.
- Which bill amounts are more common for each gender.

**2. Cumulative KDE**
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Cumulative Density.
- **Colored Curves:** Represent Male and Female customers.
![Seaborn output](/EDA_images/simg52.png)`,

7: `# TOPIC 7: Categorical Plots (Intermediate)

Building on the basic categorical plots, this topic covers more advanced categorical visualizations that give richer information about data distributions within groups.

## 7.1  sns.violinplot() — Distribution Shape

:::definition
**Violin Plot**
A violin plot combines a box plot with a KDE (kernel density estimate). The shape of the 'violin' shows the distribution of data — wide areas have more data points, narrow areas have fewer. It gives more detail about distribution shape than a box plot.
:::

### Syntax

\`\`\`python
sns.violinplot(
    data=None,
    x=None,
    y=None,
    hue=None,
    order=None,
    hue_order=None,
    orient=None,
    color=None,
    palette=None,
    saturation=0.75,
    width=0.8,
    dodge=True,
    inner='box',       # 'box','quart','point','stick', None
    split=False,       # Split hue groups into half-violins
    scale='area',      # 'area','count','width'
    scale_hue=True,
    gridsize=100,
    bw='scott',        # Bandwidth method: 'scott' or 'silverman'
    cut=2,
    linewidth=None,
    ax=None,
)
\`\`\`

### inner= parameter — What is Shown Inside the Violin

| Value | Shows Inside | Best For |
|---|---|---|
| 'box' | Mini box plot (Q1, median, Q3, whiskers) | Default — shows summary statistics |
| 'quart' | Three quartile lines (Q1, median, Q3) | Clean quartile display |
| 'point' | All individual data points as dots | Small datasets — see every observation |
| 'stick' | All individual data points as lines | Small datasets — line version |
| None | Empty interior | Minimalist look — shape only |

### Example 1 — Basic Violin Plot

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

sns.violinplot(data=df, x='day', y='tip')

plt.title('Tip Distribution by Day (Violin Plot)')
plt.xlabel('Day')
plt.ylabel('Tip ($)')
plt.show()
\`\`\`

**Explanation**
This program creates a **violin plot** to show the **distribution of tip amounts** for each day of the week.
- The **tips** dataset is loaded.
- A **violin plot** is created using the day column on the X-axis and the tip column on the Y-axis.
- The width of each violin represents how **densely the tip values are distributed**.
- A title and axis labels are added, and the graph is displayed.

**Output Explanation**
The output is a **violin plot**.
- **X-axis:** Days of the Week (Thur, Fri, Sat, Sun).
- **Y-axis:** Tip Amount (in dollars).
- **Violin Shape:** Shows the distribution of tip amounts.
- ↳ **Wider sections:** More customers gave tips in that range.
- ↳ **Narrower sections:** Fewer customers gave tips in that range.

![Seaborn output](/EDA_images/simg53.png)

### Example 2 — Split Violin (hue with split=True)

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# Split violin: left half = Female, right half = Male
sns.violinplot(
    data=df,
    x='day',
    y='tip',
    hue='sex',
    split=True,          # Each hue gets half the violin
    palette='Set1',
    inner='quart',       # Show quartile lines
)

plt.title('Split Violin: Male vs Female Tip Distributions')
plt.legend(title='Gender')
plt.show()
\`\`\`

**Explanation**
This program creates a **split violin plot** to compare the **distribution of tip amounts** for **Male** and **Female** customers on each day of the week.
- The **tips** dataset is loaded.
- A **violin plot** is created using the day column on the X-axis and the tip column on the Y-axis.
- The **sex** column is used to split each violin into **Female** and **Male** halves.
- The **split=True** option displays both groups in a single violin.
- The **inner='quart'** option shows the quartile lines inside each violin.
- Different colors represent **Male** and **Female** customers.
- A title and legend are added, and the graph is displayed.

**Output Explanation**
The output is a **split violin plot**.
- **X-axis:** Days of the Week (Thur, Fri, Sat, Sun).
- **Y-axis:** Tip Amount (in dollars).
- **Left Half of Each Violin:** Female customers.
- **Right Half of Each Violin:** Male customers.
- **Violin Width:** Shows how common the tip amounts are.
- **Quartile Lines:** Show the spread of the data.

![Seaborn output](/EDA_images/simg54.png)

## 7.2  sns.swarmplot() — Non-overlapping Points

:::definition
**Swarm Plot**
A swarm plot shows each individual data point as a dot, but arranges them so they do NOT overlap. Points are placed side-by-side when they would otherwise overlap. This gives a clearer picture of the actual distribution compared to a strip plot.
:::

### Difference: Stripplot vs Swarmplot

| — | sns.stripplot() | sns.swarmplot() |
|---|---|---|
| Point overlap | Uses random jitter — some may overlap | No overlap — points move to avoid each other |
| Distribution accuracy | Less accurate (random scatter) | More accurate (positions reflect density) |
| Large datasets | Works well | Gets crowded — use for smaller datasets (<500 rows) |
| Speed | Fast | Slower (needs to compute positions) |

### Syntax

\`\`\`python
sns.swarmplot(
    data=None,
    x=None,
    y=None,
    hue=None,
    order=None,
    hue_order=None,
    dodge=False,       # Separate hue groups side by side
    orient=None,
    color=None,
    palette=None,
    size=5,            # Dot size
    edgecolor='gray',
    linewidth=0,
    warn_thresh=0.05,  # Warns if >5% of points overlap
    ax=None,
)
\`\`\`

### Example — Violin + Swarm Combined

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# Violin plot shows distribution shape
sns.violinplot(
    data=df, x='day', y='tip',
    palette='muted',
    inner=None,        # No inner marks — swarm will show data
    width=0.8,
)

# Swarm plot shows individual points
sns.swarmplot(
    data=df, x='day', y='tip',
    color='black',
    size=4,
    alpha=0.7,
)

plt.title('Violin + Swarm: Tip Distribution by Day')
plt.show()
\`\`\`

**Explanation**
This program combines a **violin plot** and a **swarm plot** to show the **distribution of tip amounts** and the **individual tip values** for each day.
- The **tips** dataset is loaded.
- A **violin plot** is created to show the overall distribution of tip amounts for each day.
- The **inner=None** option removes the internal lines because the swarm plot will show the individual data points.
- A **swarm plot** is placed on top of the violin plot.
- Each black dot represents one customer's tip amount and is arranged to avoid overlapping.
- A title is added, and the graph is displayed.

**Output Explanation**
The output is a **combined violin plot and swarm plot**.
- **X-axis:** Days of the Week (Thur, Fri, Sat, Sun).
- **Y-axis:** Tip Amount (in dollars).
- **Violin Shape:** Shows the overall distribution of tip amounts.
- ↳ **Wider sections:** More customers gave tips in that range.
- ↳ **Narrower sections:** Fewer customers gave tips in that range.
- **Black Dots:** Represent the individual tip values for each customer.

![Seaborn output](/EDA_images/simg70.png)

## 7.3  sns.boxenplot() — Letter-Value Plot

:::definition
**Boxen Plot (Letter-Value Plot)**
A boxen plot is an enhanced box plot that shows multiple quantile levels. While a regular box plot only shows Q1, median, and Q3, a boxen plot adds additional boxes for the 12.5th, 6.25th, 3.125th percentiles and more. It is better for large datasets with many outliers.
:::

### When to Use Boxen Plot

- Use boxen plot when your dataset is large (1000+ rows) and box plot looks too simple.
- It shows more of the data's tail behavior — you can see how extreme values are distributed.
- Better than box plot for detecting heavy-tailed distributions.

### Example — Box Plot vs Boxen Plot

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

# Use diamonds dataset (large dataset with ~54,000 rows)
df = sns.load_dataset('diamonds')

fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Standard box plot
sns.boxplot(
    data=df, x='cut', y='price',
    palette='viridis', ax=axes[0]
)
axes[0].set_title('Box Plot (shows 5 stats)')

# Enhanced boxen plot
sns.boxenplot(
    data=df, x='cut', y='price',
    palette='viridis', ax=axes[1]
)
axes[1].set_title('Boxen Plot (shows many quantiles)')

plt.suptitle('Box vs Boxen Plot — Diamond Price by Cut', y=1.02)
plt.tight_layout()
plt.show()
\`\`\`

**Explanation**
This program compares a **Box Plot** and a **Boxen Plot** to show the **distribution of diamond prices** for different **diamond cut categories**.
- The **diamonds** dataset is loaded.
- Two plots are created side by side.
- The **Box Plot** summarizes the price distribution using the median, quartiles, and whiskers.
- The **Boxen Plot** shows more detailed information by displaying multiple quantiles, making it useful for large datasets.
- Both plots use the same data and color palette for easy comparison.
- An overall title is added, and the graphs are displayed.

**Output Explanation**
The output contains **two plots**.

**1. Box Plot**
- **X-axis:** Diamond Cut (Fair, Good, Very Good, Premium, Ideal).
- **Y-axis:** Diamond Price.
- **Box:** Shows the middle 50% of prices.
- **Middle Line:** Represents the median price.
- **Whiskers:** Show the range of most prices.

**2. Boxen Plot**
- **X-axis:** Diamond Cut.
- **Y-axis:** Diamond Price.
- **Multiple Boxes:** Show many quantiles of the data, providing a more detailed view of the price distribution.
![Seaborn output](/EDA_images/simg55.png)

## 7.4  sns.catplot() — Figure-level Categorical Wrapper

:::definition
**sns.catplot()**
catplot() is the figure-level function for ALL categorical plots. It wraps barplot, countplot, boxplot, violinplot, stripplot, swarmplot, and boxenplot into one function. It can create multi-panel grids with col= and row=.
:::

### Syntax

\`\`\`python
sns.catplot(
    data=None,
    x=None,
    y=None,
    hue=None,
    row=None,          # Create rows of subplots
    col=None,          # Create columns of subplots
    col_wrap=None,
    kind='strip',      # 'strip','swarm','box','violin',
                       # 'boxen','bar','count','point'
    estimator='mean',
    errorbar=('ci',95),
    n_boot=1000,
    order=None,
    hue_order=None,
    height=5,          # Height of each panel
    aspect=1,
    palette=None,
    legend='auto',
    sharex=True,       # Share x-axis across panels
    sharey=True,
    margin_titles=False,
    facet_kws=None,
)
\`\`\`

### Example — catplot with Multiple Panels

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

g = sns.catplot(
    data=df,
    x='day',
    y='tip',
    hue='sex',
    col='time',         # Separate columns for Lunch/Dinner
    kind='box',
    palette='Set2',
    height=4,
    aspect=1.2,
)

g.set_axis_labels('Day', 'Tip Amount ($)')
g.set_titles(col_template='{col_name} Meal')
g.figure.suptitle('Tip Distributions (by Meal Time)', y=1.02)
plt.show()
\`\`\`

**Explanation**
This program creates a **categorical box plot (catplot)** to compare the **distribution of tip amounts** by **day**, **gender**, and **meal time**.
- The **tips** dataset is loaded.
- A **box plot** is created using catplot().
- The **day** column is shown on the X-axis and the **tip** column on the Y-axis.
- The **sex** column is used to create separate colored box plots for **Male** and **Female** customers.
- The **time** column creates **two separate panels**: one for **Lunch** and one for **Dinner**.
- Axis labels, panel titles, and an overall title are added, and the graphs are displayed.

**Output Explanation**
The output contains **two box plots**.
- **Left Panel:** Lunch Meal.
- **Right Panel:** Dinner Meal.
- **X-axis:** Days of the Week (Thur, Fri, Sat, Sun).
- **Y-axis:** Tip Amount (in dollars).
- **Different Colored Boxes:** Represent **Male** and **Female** customers.

![Seaborn output](/EDA_images/simg56.png)

## 7.5  Combining Violin + Strip (inner='points')

A very powerful technique: draw a violin plot but instead of showing a mini box inside, show the actual data points. This combines the smooth KDE shape with all individual data.

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# inner='stick' shows all data points as lines inside the violin
sns.violinplot(
    data=df,
    x='day',
    y='total_bill',
    inner='stick',     # Data points as lines inside violin
    palette='husl',
    linewidth=0.8,
)

plt.title('Violin with Inner Data Points (inner=stick)')
plt.show()
\`\`\`

**Explanation**
This program creates a **violin plot** to show the **distribution of total bill amounts** for each day of the week, while displaying the **individual data points as small lines** inside each violin.
- The **tips** dataset is loaded.
- A **violin plot** is created using the day column on the X-axis and the total_bill column on the Y-axis.
- The **inner='stick'** option displays each individual data point as a small vertical line inside the violin.
- Different colors are used for each violin.
- A title is added, and the graph is displayed.

**Output Explanation**
The output is a **violin plot with inner sticks**.
- **X-axis:** Days of the Week (Thur, Fri, Sat, Sun).
- **Y-axis:** Total Bill Amount (in dollars).
- **Violin Shape:** Shows the overall distribution of total bill amounts.
- ↳ **Wider sections:** More customers have bills in that range.
- ↳ **Narrower sections:** Fewer customers have bills in that range.
- **Small Lines Inside the Violin:** Represent the individual bill values of each customer.

![Seaborn output](/EDA_images/simg57.png)

## 7.6  Hue Grouping and dodge Parameter

The hue= parameter adds a grouping color dimension to any categorical plot. The dodge= parameter controls whether hue groups are shown side-by-side (dodge=True) or overlaid (dodge=False).

### Example — dodge=True vs dodge=False

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# dodge=True: groups separated side by side (default)
sns.boxplot(
    data=df, x='day', y='tip', hue='sex',
    dodge=True, palette='Set1', ax=axes[0]
)
axes[0].set_title('dodge=True (Side by Side)')
axes[0].legend(title='Gender')

# dodge=False: groups on same x position (overlapping)
sns.boxplot(
    data=df, x='day', y='tip', hue='sex',
    dodge=False, palette='Set1', ax=axes[1]
)
axes[1].set_title('dodge=False (Overlapping)')
axes[1].legend(title='Gender')

plt.suptitle('Effect of dodge= Parameter', y=1.02)
plt.tight_layout()
plt.show()
\`\`\`

**Explanation**
This program compares the effect of the **dodge** parameter in a **box plot**.
- The **tips** dataset is loaded.
- Two **box plots** are created side by side.
- Both plots use the day column on the X-axis, the tip column on the Y-axis, and the sex column to separate **Male** and **Female** customers.
- The **first plot** uses dodge=True, which places the Male and Female box plots **side by side**.
- The **second plot** uses dodge=False, which places both box plots at the **same position**, causing them to overlap.
- Titles and legends are added, and the graphs are displayed.

**Output Explanation**
The output contains **two box plots**.

**1. dodge=True (Side by Side)**
- **X-axis:** Days of the Week (Thur, Fri, Sat, Sun).
- **Y-axis:** Tip Amount (in dollars).
- **Male and Female box plots** are displayed **next to each other** for each day.
From this graph, you can observe:
- An easy comparison of tip distributions between **Male** and **Female** customers.

**2. dodge=False (Overlapping)**
- **X-axis:** Days of the Week.
- **Y-axis:** Tip Amount (in dollars).
- **Male and Female box plots** are drawn at the **same position**, so they overlap.

![Seaborn output](/EDA_images/simg58.png)`,

8: `# TOPIC 8: Regression Plots

:::definition
**Regression**
Regression is a statistical technique that fits a line (or curve) through scattered data points to show the overall trend. The regression line shows: 'As x increases, how does y change on average?'
:::

## 8.1  sns.regplot() — Scatter + Regression Line

:::definition
**sns.regplot()**
An axes-level function that draws a scatter plot AND a regression line with a shaded confidence interval band around it. By default it fits a linear (straight) regression line.
:::

### Syntax

\`\`\`python
sns.regplot(
    data=None,
    x=None,
    y=None,
    x_estimator=None,  # Apply function to x before plotting
    x_bins=None,       # Discretize x into bins
    x_ci='ci',         # Error bars for x_estimator: 'ci','sd',None
    scatter=True,       # Show scatter points
    fit_reg=True,       # Show regression line
    ci=95,              # Confidence interval width
    n_boot=1000,
    units=None,
    seed=None,
    order=1,            # Degree of polynomial (1=linear, 2=quadratic)
    logx=False,         # Fit y ~ log(x)
    lowess=False,       # Fit LOWESS smoother
    robust=False,       # Use robust regression (handles outliers)
    logistic=False,     # Fit logistic regression (for binary y)
    truncate=True,      # Only draw line within data range
    scatter_kws=None,   # Dict of kwargs for scatter points
    line_kws=None,      # Dict of kwargs for the line
    color=None,
    marker='o',
    ax=None,
)
\`\`\`

### Example 1 — Basic Regression Plot

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

sns.regplot(
    data=df,
    x='total_bill',
    y='tip',
)

plt.title('Linear Regression: Tip vs Total Bill')
plt.xlabel('Total Bill ($)')
plt.ylabel('Tip ($)')
plt.show()
\`\`\`

**Explanation**
This program creates a **regression plot (regplot)** to show the **relationship between the total bill amount and the tip amount**.
- The **tips** dataset is loaded.
- A **regression plot** is created using the total_bill column on the X-axis and the tip column on the Y-axis.
- The plot displays the **individual data points** along with a **best-fit regression line**.
- A title and axis labels are added, and the graph is displayed.

**Output Explanation**
The output is a **regression plot**.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Tip Amount (in dollars).
- **Dots:** Represent individual customers' bill and tip values.
- **Regression Line:** Shows the overall trend between the total bill and the tip.

![Seaborn output](/EDA_images/simg59.png)

### Example 2 — Custom Scatter and Line Styles

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

sns.regplot(
    data=df,
    x='total_bill',
    y='tip',
    scatter_kws={         # Styling for scatter dots
        'color': 'gray',
        'alpha': 0.4,
        's': 30,          # dot size
    },
    line_kws={            # Styling for the line
        'color': 'red',
        'linewidth': 2.5,
        'linestyle': '--',
    },
    ci=99,               # 99% confidence interval
)

plt.title('Regression with Custom Styling (99% CI)')
plt.show()
\`\`\`

**Explanation**
This program creates a **regression plot** with **custom styling** for the data points and regression line.
- The **tips** dataset is loaded.
- A **regression plot** is created using the total_bill column on the X-axis and the tip column on the Y-axis.
- The **scatter points** are customized with a gray color, slight transparency, and a larger size.
- The **regression line** is customized to be **red**, **thicker**, and **dashed**.
- A **99% confidence interval (CI)** is displayed around the regression line.
- A title is added, and the graph is displayed.

**Output Explanation**
The output is a **styled regression plot**.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Tip Amount (in dollars).
- **Gray Dots:** Represent individual customers' bill and tip values.
- **Red Dashed Line:** Represents the best-fit regression line.
- **Shaded Area Around the Line:** Represents the **99% confidence interval**.

![Seaborn output](/EDA_images/simg60.png)

## 8.2  sns.lmplot() — Figure-level Regression

:::definition
**sns.lmplot()**
The figure-level version of regplot. Can create multi-panel regression plots using hue=, col=, and row=. Returns FacetGrid.
:::

### Example — lmplot with Multiple Groups

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

# Separate regression lines per gender
g = sns.lmplot(
    data=df,
    x='total_bill',
    y='tip',
    hue='sex',           # One line per sex, different colors
    palette='Set1',
    height=5,
    aspect=1.4,
    scatter_kws={'alpha': 0.5},
)

g.set_axis_labels('Total Bill ($)', 'Tip ($)')
g.figure.suptitle('Regression by Gender', y=1.02)
plt.show()
\`\`\`

**Explanation**
This program creates a **regression plot (lmplot)** to compare the **relationship between total bill and tip amount** for **Male** and **Female** customers.
- The **tips** dataset is loaded.
- An **lmplot** is created using the total_bill column on the X-axis and the tip column on the Y-axis.
- The **sex** column is used to create separate regression lines and scatter points for **Male** and **Female** customers.
- Different colors distinguish the two groups.
- The scatter points are slightly transparent to make overlapping points easier to see.
- Axis labels and a title are added, and the graph is displayed.

**Output Explanation**
The output is a **regression plot with two regression lines**.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Tip Amount (in dollars).
- **Dots:** Represent individual customers' bill and tip values.
- **Different Colored Regression Lines:** Represent **Male** and **Female** customers.

![Seaborn output](/EDA_images/simg61.png)

### Example — lmplot with col= Panels

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

g = sns.lmplot(
    data=df,
    x='total_bill',
    y='tip',
    col='smoker',       # One panel per smoker status
    hue='sex',
    palette='Dark2',
    height=5,
)

g.figure.suptitle('Regression: Smoker vs Non-Smoker', y=1.02)
plt.show()
\`\`\`

**Explanation**
This program creates a **regression plot (lmplot)** to compare the **relationship between total bill and tip amount** based on **smoker status** and **gender**.
- The **tips** dataset is loaded.
- An **lmplot** is created using the total_bill column on the X-axis and the tip column on the Y-axis.
- The **smoker** column creates **two separate panels**: one for **Smokers** and one for **Non-Smokers**.
- The **sex** column uses different colors to show **Male** and **Female** customers in each panel.
- A title is added, and the graphs are displayed.

**Output Explanation**
The output contains **two regression plots**.
- **Left Panel:** Non-Smoker customers.
- **Right Panel:** Smoker customers.
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Tip Amount (in dollars).
- **Dots:** Represent individual customers' bill and tip values.
- **Different Colored Regression Lines:** Represent **Male** and **Female** customers.

![Seaborn output](/EDA_images/simg62.png)

## 8.3  Confidence Intervals and Scatter Options

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

fig, axes = plt.subplots(1, 3, figsize=(18, 5))

# ci=95 (default)
sns.regplot(data=df, x='total_bill', y='tip', ci=95, ax=axes[0])
axes[0].set_title('ci=95 (Default)')

# ci=None (no CI band)
sns.regplot(data=df, x='total_bill', y='tip', ci=None, ax=axes[1])
axes[1].set_title('ci=None (No band)')

# scatter=False (line only, no dots)
sns.regplot(data=df, x='total_bill', y='tip',
            scatter=False, color='green', ax=axes[2])
axes[2].set_title('scatter=False (Line only)')

plt.suptitle('Regression Options', y=1.02)
plt.tight_layout()
plt.show()
\`\`\`

**Explanation**
This program compares **three different regression plot options** using the **tips** dataset.
- The **tips** dataset is loaded.
- Three **regression plots** are created side by side.
- Each plot shows the relationship between **total bill** and **tip**, but with different settings:
- ↳ **ci=95** shows the default **95% confidence interval**.
- ↳ **ci=None** removes the confidence interval.
- ↳ **scatter=False** displays only the regression line without the data points.
- An overall title is added, and the graphs are displayed.

**Output Explanation**
The output contains **three regression plots**.

**1. ci=95 (Default)**
- **X-axis:** Total Bill Amount (in dollars).
- **Y-axis:** Tip Amount (in dollars).
- **Dots:** Individual customer data.
- **Regression Line:** Best-fit line.
- **Shaded Area:** 95% confidence interval.

**2. ci=None (No Band)**
- **X-axis:** Total Bill Amount.
- **Y-axis:** Tip Amount.
- **Dots:** Individual customer data.
- **Regression Line:** Best-fit line.
- **No Shaded Area:** The confidence interval is removed.

**3. scatter=False (Line Only)**
- **X-axis:** Total Bill Amount.
- **Y-axis:** Tip Amount.
- **Green Line:** Best-fit regression line.
- **No Dots:** Only the regression line is displayed.
![Seaborn output](/EDA_images/simg63.png)

## 8.4  Polynomial Regression — order parameter

:::definition
**Polynomial Regression**
Instead of fitting a straight line, polynomial regression fits a curved line. order=2 fits a quadratic curve (U-shape or hill shape), order=3 fits a cubic curve (S-shape), etc.
:::

### Example — Linear vs Polynomial Regression

\`\`\`python
import seaborn as sns
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Create non-linear data
np.random.seed(0)
x = np.linspace(0, 10, 100)
y = 2*x**2 - 5*x + 3 + np.random.normal(0, 8, 100)
df = pd.DataFrame({'x': x, 'y': y})

fig, axes = plt.subplots(1, 3, figsize=(18, 5))

# Linear fit (order=1)
sns.regplot(data=df, x='x', y='y', order=1, ax=axes[0],
            color='blue')
axes[0].set_title('order=1 (Linear)')

# Quadratic fit (order=2)
sns.regplot(data=df, x='x', y='y', order=2, ax=axes[1],
            color='red')
axes[1].set_title('order=2 (Quadratic)')

# Cubic fit (order=3)
sns.regplot(data=df, x='x', y='y', order=3, ax=axes[2],
            color='green')
axes[2].set_title('order=3 (Cubic)')

plt.suptitle('Polynomial Regression Orders', y=1.02)
plt.tight_layout()
plt.show()
\`\`\`

**Explanation**
This program demonstrates how the **order** parameter changes the **regression curve**.
- A dataset with a **non-linear relationship** is created.
- Three **regression plots** are drawn using the same data.
- Each plot uses a different polynomial order:
- ↳ **order=1** fits a **linear (straight) line**.
- ↳ **order=2** fits a **quadratic (curved) line**.
- ↳ **order=3** fits a **cubic (more flexible curved) line**.
- The three plots are displayed side by side for comparison.

**Output Explanation**
The output contains **three regression plots**.

**1. order=1 (Linear)**
- **X-axis:** x
- **Y-axis:** y
- **Straight Line:** Fits the data with a simple linear relationship.

**2. order=2 (Quadratic)**
- **X-axis:** x
- **Y-axis:** y
- **Curved Line:** Fits the quadratic pattern in the data more accurately.

**3. order=3 (Cubic)**
- **X-axis:** x
- **Y-axis:** y
- **More Flexible Curve:** Fits the data with a cubic polynomial, allowing more complex curvature.
![Seaborn output](/EDA_images/simg64.png)

## 8.5  Logistic Regression — logistic=True

:::definition
**Logistic Regression**
Logistic regression is used when the y variable is binary (0 or 1, True/False, survived/died). The resulting curve is an S-shaped sigmoid between 0 and 1 showing probability.
:::

### Example — Logistic Regression on Titanic Data

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('titanic')

# Remove missing age values
df = df.dropna(subset=['age'])

# Logistic regression: Does age predict survival?
sns.regplot(
    data=df,
    x='age',
    y='survived',       # Binary: 0 = died, 1 = survived
    logistic=True,      # Fit sigmoid/logistic curve
    scatter_kws={
        'alpha': 0.2,
        'color': 'gray',
    },
    line_kws={'color': 'red'},
    ci=95,
)

plt.title('Logistic Regression: Age vs Survival (Titanic)')
plt.xlabel('Age (years)')
plt.ylabel('Probability of Survival')
plt.yticks([0, 0.5, 1.0])
plt.show()
\`\`\`

**Explanation**
This program creates a **logistic regression plot** to show how **age affects the probability of survival** on the Titanic.
- The **Titanic** dataset is loaded.
- Rows with missing **age** values are removed.
- A **logistic regression plot** is created using the age column on the X-axis and the survived column on the Y-axis.
- Since **survived** has only two values (**0 = Died, 1 = Survived**), a **logistic (sigmoid) curve** is fitted instead of a straight line.
- The data points are shown in light gray, and the regression curve is shown in red.
- A title and axis labels are added, and the graph is displayed.

**Output Explanation**
The output is a **logistic regression plot**.
- **X-axis:** Age (years).
- **Y-axis:** Probability of Survival (0 to 1).
- **Gray Dots:** Represent individual passengers.
- **Red Sigmoid Curve:** Shows how the probability of survival changes with age.
- **Shaded Area:** Represents the **95% confidence interval** around the curve.
![Seaborn output](/EDA_images/simg65.png)

## 8.6  Residual Plots — sns.residplot()

:::definition
**Residual Plot**
A residual is the difference between the actual y value and the predicted y value from the regression line. A residual plot shows these residuals on the y-axis vs x on the x-axis. If the residuals are randomly scattered around zero, the model fits well.
:::

### Syntax

\`\`\`python
sns.residplot(
    data=None,
    x=None,
    y=None,
    lowess=False,      # Overlay a LOWESS smoother on residuals
    x_partial=None,
    y_partial=None,
    order=1,           # Polynomial degree of regression
    robust=False,
    dropna=True,
    scatter_kws=None,
    line_kws=None,
    color=None,
    ax=None,
)
\`\`\`

### Example — Residual Plot

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')

sns.residplot(
    data=df,
    x='total_bill',
    y='tip',
    scatter_kws={'alpha': 0.5, 'color': 'steelblue'},
    line_kws={'color': 'red', 'linewidth': 2},
    lowess=True,       # Show smoother line through residuals
)

plt.axhline(0, color='black', linestyle='--', linewidth=0.8)
plt.title('Residual Plot: Tip vs Total Bill')
plt.xlabel('Total Bill ($)')
plt.ylabel('Residuals')
plt.show()
\`\`\`

**Explanation**
This program demonstrates how to create a **Residual Plot** using Seaborn's residplot() function.
- The **tips** dataset is loaded from the Seaborn library.
- A residual plot is created using **total_bill** as the independent variable and **tip** as the dependent variable.
- The scatter points represent the residuals (errors), while a **LOWESS smoothing line** is added to observe any patterns in the residuals.
- A horizontal reference line is drawn at **y = 0** to make it easier to identify whether the residuals are randomly distributed around zero.
- Appropriate title and axis labels are added to improve the readability of the plot.

**Output Explanation**
The output contains a **Residual Plot**.

**1. Residual Plot**
- **X-axis:** Total Bill ($)
- **Y-axis:** Residuals
- **Scatter Points:** Represent the difference between the actual tip values and the values predicted by the regression model.
- **Red LOWESS Curve:** Shows the overall trend of the residuals. If the curve remains close to zero, the regression model fits the data well.
- **Horizontal Dashed Line (y = 0):** Serves as a reference line. Ideally, the residuals should be randomly scattered around this line without any clear pattern, indicating that the regression model is appropriate.
![Seaborn output](/EDA_images/simg66.png)`,

9: `# TOPIC 9: Matrix & Heatmap Plots

:::definition
**Heatmap**
A heatmap is a 2D grid where each cell is colored according to its value. Darker/warmer colors represent higher values, lighter/cooler colors represent lower values. Heatmaps are ideal for visualizing correlation matrices, confusion matrices, or any tabular numeric data.
:::

## 9.1  sns.heatmap() — 2D Grid of Values

### Syntax

\`\`\`python
sns.heatmap(
    data,              # 2D array, DataFrame, or matrix
    vmin=None,         # Minimum value for color scale
    vmax=None,         # Maximum value for color scale
    cmap=None,         # Colormap name
    center=None,       # Value at center of colormap
    robust=False,      # Use robust range (ignore outliers for scale)
    annot=None,        # True=show values in cells, or array
    fmt='',            # Format string for annotations
    annot_kws=None,    # Dict for annotation text style
    linewidths=0,      # Width of grid lines between cells
    linecolor='white', # Color of grid lines
    cbar=True,         # Show color bar legend
    cbar_kws=None,
    cbar_ax=None,
    square=False,      # Force square cells
    xticklabels='auto',
    yticklabels='auto',
    mask=None,         # Boolean mask — hide certain cells
    ax=None,
)
\`\`\`

### Example 1 — Basic Heatmap

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd

# Flight passenger data — pivot to month x year matrix
df = sns.load_dataset('flights')
pivot = df.pivot_table(index='month', columns='year',
                        values='passengers')

sns.heatmap(pivot)

plt.title('Airline Passengers by Month and Year')
plt.show()
\`\`\`

**Explanation**
This program demonstrates how to create a **Heatmap** using Seaborn.
- The **flights** dataset is loaded from the Seaborn library.
- The dataset is converted into a **pivot table**, where **months** are used as rows, **years** as columns, and **passenger counts** as the values.
- A heatmap is created to visualize the number of airline passengers across different months and years.
- The color intensity represents the passenger count, making it easy to identify periods with lower and higher passenger traffic.
- A title is added to make the visualization more informative.

**Output Explanation**
The output contains a **Heatmap**.

**1. Heatmap**
- **X-axis:** Year
- **Y-axis:** Month
- **Color Intensity:** Represents the number of airline passengers.
- **Darker/Brighter Colors:** Indicate higher passenger counts, while lighter colors represent lower passenger counts.
- The heatmap helps compare passenger trends across different months and years, making seasonal patterns and yearly growth easy to identify.
![Seaborn output](/EDA_images/simg67.png)

## 9.2  annot=True — Cell Annotations

The annot=True parameter writes the actual numeric value inside each cell of the heatmap. This is very useful when you need the exact numbers visible, not just the colors.

### Example 2 — Heatmap with Annotations

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('flights')
pivot = df.pivot_table(index='month', columns='year',
                        values='passengers')

plt.figure(figsize=(12, 7))
sns.heatmap(
    pivot,
    annot=True,         # Show numbers in cells
    fmt='d',            # Format as integer ('d' = decimal integer)
    cmap='YlOrRd',
    linewidths=0.5,     # Grid lines between cells
    linecolor='white',
)

plt.title('Flight Passengers with Values Annotated')
plt.xlabel('Year')
plt.ylabel('Month')
plt.show()
\`\`\`

**Explanation**
This program demonstrates how to create an **Annotated Heatmap** using Seaborn.
- The **flights** dataset is loaded from the Seaborn library.
- The dataset is converted into a **pivot table**, where **months** are used as rows, **years** as columns, and **passenger counts** as the values.
- An annotated heatmap is created using sns.heatmap(), where each cell displays the corresponding passenger count.
- The **YlOrRd** colormap is applied, and white grid lines are added between cells for better readability.
- A title and axis labels are added to make the visualization clear and informative.

**Output Explanation**
The output contains an **Annotated Heatmap**.

**1. Annotated Heatmap**
- **X-axis:** Year
- **Y-axis:** Month
- **Cell Values:** Display the exact number of airline passengers for each month and year.
- **Color Intensity:** Represents the passenger count, where darker colors indicate higher values and lighter colors indicate lower values.
- **Grid Lines:** White lines separate each cell, making the heatmap easier to read.
- The annotated heatmap allows users to compare passenger counts across different months and years while also viewing the exact numerical values in each cell.\\\\
![Seaborn output](/EDA_images/simg68.png)

## 9.3  fmt= — Annotation Format

### Common fmt values

| fmt value | Meaning | Example output in cell |
|---|---|---|
| 'd' | Integer | 245 |
| '.1f' | Float with 1 decimal | 245.3 |
| '.2f' | Float with 2 decimals | 245.32 |
| '.2%' | Percentage | 24.53% |
| '.2e' | Scientific notation | 2.45e+02 |
| 'g' | General float (smart format) | 245 or 2.45e+02 |

\`\`\`python
# Example with .2f format
sns.heatmap(
    pivot,
    annot=True,
    fmt='.0f',   # Round to nearest integer but as float
    cmap='Blues',
)
\`\`\`

## 9.4  cmap — Colormap Selection

The cmap (colormap) parameter changes the color scheme of the heatmap. Choosing the right colormap is critical for accurate data interpretation.

| cmap name | Color Range | Best For Heatmaps |
|---|---|---|
| 'Blues' | White to dark blue | Single variable increasing values |
| 'YlOrRd' | Yellow → Orange → Red | Temperature, count data (warm tones) |
| 'viridis' | Purple → green → yellow | Perceptually uniform — scientific data |
| 'coolwarm' | Blue ← white → Red | Correlation matrices (positive/negative) |
| 'RdYlGn' | Red ← yellow → Green | Performance metrics, good/bad scale |
| 'hot' | Black → red → yellow → white | High-intensity maps |
| 'Greys' | White to black | Print-friendly, neutral |

## 9.5  Masking Upper/Lower Triangle

When displaying a correlation matrix or any symmetric matrix, you may want to show only the lower triangle (or upper triangle) to avoid redundant information.

### Example — Lower Triangle Mask

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

# Load iris dataset (only numeric columns)
df = sns.load_dataset('iris').select_dtypes(include='number')

# Compute correlation matrix
corr = df.corr()

# Create mask for UPPER triangle
mask = np.triu(np.ones_like(corr, dtype=bool))
# np.triu = upper triangle (including diagonal) = True
# Where mask=True, the cell is hidden

plt.figure(figsize=(7, 6))
sns.heatmap(
    corr,
    mask=mask,          # Hide upper triangle
    annot=True,
    fmt='.2f',
    cmap='coolwarm',
    center=0,           # 0 = white (neutral) center
    square=True,
    linewidths=0.5,
    cbar_kws={'shrink': 0.8},
)

plt.title('Correlation Matrix (Lower Triangle)')
plt.show()
\`\`\`

**Explanation**
This program demonstrates how to create a **Lower Triangle Correlation Heatmap** using Seaborn.
- The **iris** dataset is loaded, and only the numeric columns are selected.
- A **correlation matrix** is computed using the corr() function to measure the relationship between the numerical features.
- A **mask** is created using np.triu() to hide the upper triangle of the correlation matrix, displaying only the lower triangle.
- A heatmap is generated with correlation values annotated inside each cell using the **coolwarm** color map.
- The heatmap is customized with square cells, grid lines, a centered color scale, and a color bar for better visualization.

**Output Explanation**
The output contains a **Lower Triangle Correlation Heatmap**.

**1. Correlation Heatmap**
- **X-axis:** Numeric features of the Iris dataset.
- **Y-axis:** Numeric features of the Iris dataset.
- **Cell Values:** Display the correlation coefficient between pairs of features, ranging from **-1.00** to **1.00**.
- **Color Intensity:** Represents the strength and direction of the correlation. Warm colors indicate positive correlation, cool colors indicate negative correlation, and white represents values close to zero.
- **Masked Upper Triangle:** The upper half of the matrix is hidden, leaving only the lower triangle to avoid displaying duplicate correlation values.
- This visualization helps identify strong positive or negative relationships among the numeric features of the Iris dataset.
![Seaborn output](/EDA_images/simg69.png)

## 9.6  Correlation Matrix Visualization

The most common use case for heatmaps in data science is visualizing the correlation matrix of a DataFrame. Correlation tells you how much two variables move together.

### Full Correlation Matrix Example

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

# Use penguins dataset
df = sns.load_dataset('penguins').dropna()

# Select numeric columns
numeric_df = df.select_dtypes(include='number')

# Compute Pearson correlation
corr_matrix = numeric_df.corr()

print('Correlation Matrix:')
print(corr_matrix.round(2))

# Visualize
plt.figure(figsize=(8, 6))
sns.heatmap(
    corr_matrix,
    annot=True,
    fmt='.2f',
    cmap='RdYlGn',
    center=0,
    square=True,
    linewidths=1,
    cbar_kws={'label': 'Correlation Coefficient'},
    annot_kws={'size': 11},
)

plt.title('Penguin Measurements Correlation Matrix', fontsize=14)
plt.xticks(rotation=30, ha='right')
plt.yticks(rotation=0)
plt.tight_layout()
plt.show()
\`\`\`

**Explanation**
This program demonstrates how to create a **Correlation Matrix Heatmap** using Seaborn.
- The **penguins** dataset is loaded, and missing values are removed using dropna().
- Only the **numeric columns** are selected for correlation analysis.
- A **Pearson correlation matrix** is calculated using the corr() function to measure the relationship between the numerical features.
- The correlation matrix is printed in the console and visualized as a heatmap with correlation values displayed inside each cell.
- The heatmap is customized using the **RdYlGn** color map, grid lines, square cells, and a color bar to make the relationships easier to interpret.

**Output Explanation**
The output contains a **Correlation Matrix Heatmap**.

**1. Correlation Matrix**
- Displays the **Pearson correlation coefficients** between all numeric features of the Penguin dataset.
- The values range from **-1.00** to **1.00**, where:
- ↳ **1.00** indicates a perfect positive correlation.
- ↳ **-1.00** indicates a perfect negative correlation.
- ↳ **0.00** indicates no linear correlation.

**2. Correlation Heatmap**
- **X-axis:** Numeric features of the Penguin dataset.
- **Y-axis:** Numeric features of the Penguin dataset.
- **Cell Values:** Show the exact correlation coefficient between each pair of variables.
- **Color Intensity:** Green shades represent positive correlation, red shades represent negative correlation, and yellow shades indicate weak or no correlation.
- The heatmap helps identify strong relationships among penguin measurements, making it easier to understand how different numeric features are related.

\`\`\`output
Correlation Matrix:
                    bill_length  bill_depth  flipper_length  body_mass
bill_length_mm           1.00        -0.23            0.65       0.60
bill_depth_mm           -0.23         1.00           -0.58      -0.47
flipper_length_mm        0.65        -0.58            1.00       0.87
body_mass_g              0.60        -0.47            0.87       1.00
\`\`\`

![Seaborn output](/EDA_images/simg71.png)

### Interpreting Correlation Values

| Correlation Value | Interpretation |
|---|---|
| 1.0 | Perfect positive correlation — as x increases, y always increases |
| 0.7 to 0.9 | Strong positive correlation |
| 0.4 to 0.6 | Moderate positive correlation |
| 0.1 to 0.3 | Weak positive correlation |
| 0 | No linear correlation |
| -0.1 to -0.3 | Weak negative correlation |
| -0.4 to -0.6 | Moderate negative correlation |
| -0.7 to -1.0 | Strong negative correlation — as x increases, y decreases |`,

}

export default edaContent
