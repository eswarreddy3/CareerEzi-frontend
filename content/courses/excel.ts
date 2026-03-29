// Microsoft Excel — Beginner to Advanced
// 21 lessons matching the PDF structure

const excelContent: Record<number, string> = {

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL 1 — BEGINNER
// ─────────────────────────────────────────────────────────────────────────────

1: `# Excel Interface & Basics

![Microsoft Excel — the world's most powerful spreadsheet tool](https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg/512px-Microsoft_Office_Excel_%282019%E2%80%93present%29.svg.png)

Excel is the world's most widely used spreadsheet application. From simple lists to complex financial models, mastering Excel is a core workplace skill.

## The Excel Window

When you open Excel, you'll see several key areas:

| Area | What it does |
|------|-------------|
| **Title Bar** | Shows the file name and Excel icon |
| **Ribbon** | Tabs (Home, Insert, Formulas…) with grouped commands |
| **Name Box** | Shows the current cell address (e.g. A1) |
| **Formula Bar** | Displays and lets you edit cell contents |
| **Worksheet Area** | The grid of rows (numbers) and columns (letters) |
| **Sheet Tabs** | Switch between sheets at the bottom |
| **Status Bar** | Shows sum/average/count of selected cells |

## Rows, Columns, and Cells

- **Columns** — labelled A, B, C … Z, AA, AB … (up to XFD — 16,384 columns)
- **Rows** — labelled 1, 2, 3 … (up to 1,048,576 rows)
- **Cell** — intersection of a row and column, e.g. **B3** (column B, row 3)
- **Cell Range** — a block of cells, e.g. **A1:D10**

:::tip
Press **Ctrl + End** to jump to the last used cell in your worksheet — perfect for finding where your data ends.
:::

## Navigating the Worksheet

\`\`\`
Arrow keys        → move one cell at a time
Ctrl + Arrow      → jump to the edge of a data region
Ctrl + Home       → go to cell A1
Ctrl + End        → go to the last used cell
Ctrl + G (F5)     → Go To a specific cell or range
Page Up/Down      → scroll up/down one screen
Ctrl + Page Up/Down → switch between sheets
\`\`\`

## The Ribbon Tabs

| Tab | Key Commands |
|-----|-------------|
| **Home** | Cut/Copy/Paste, Font, Alignment, Number formats, Styles |
| **Insert** | Tables, Charts, PivotTables, Images, Shapes |
| **Page Layout** | Margins, Orientation, Print Area |
| **Formulas** | Function Library, Name Manager, Formula Auditing |
| **Data** | Sort & Filter, Data Validation, Power Query |
| **Review** | Spell Check, Comments, Protect Sheet |
| **View** | Freeze Panes, Split, Zoom |

## Selecting Cells

\`\`\`
Click                  → select one cell
Click + Drag           → select a range
Shift + Click          → extend selection
Ctrl + Click           → select non-adjacent cells
Ctrl + A               → select all
Shift + Ctrl + End     → select from current cell to last used cell
\`\`\`

:::insight
The **Status Bar** at the bottom is your instant calculator. Select a range of numbers and instantly see **Sum**, **Average**, **Count**, **Min**, and **Max** — no formula needed!
:::

## Saving Your Work

\`\`\`
Ctrl + S     → Save
Ctrl + Shift + S → Save As
\`\`\`

**File formats:**
- **.xlsx** — modern Excel format (default)
- **.xls** — legacy Excel 97–2003 (avoid unless needed)
- **.csv** — plain text, comma-separated (no formatting/formulas)
- **.xlsm** — Excel with Macros enabled

:::scenario
You open an Excel file and the Ribbon is missing. What do you do? Double-click any tab to toggle the Ribbon on/off, or press **Ctrl + F1**.
:::
`,

// ─────────────────────────────────────────────────────────────────────────────

2: `# Basic Formatting

Good formatting makes data readable, professional, and easier to understand at a glance.

## Font Formatting

| Action | Shortcut |
|--------|----------|
| Bold | Ctrl + B |
| Italic | Ctrl + I |
| Underline | Ctrl + U |
| Font size up/down | Alt + H, F, S |
| Font color | Alt + H, F, C |
| Highlight color | Alt + H, H |

## Cell Borders

Select cells → **Home → Font → Borders** dropdown:
- **All Borders** — draws lines around every cell
- **Outside Borders** — border only on the outer edge
- **Thick Box Border** — bold outline (great for headers)

:::tip
Use **Ctrl + 1** to open the Format Cells dialog — it gives you full control over Number, Alignment, Font, Border, and Fill in one place.
:::

## Number Formats

\`\`\`excel
General      → 12345.6
Number       → 12,345.60
Currency     → ₹12,345.60
Percentage   → 0.125 → 12.50%
Date         → 44927 → 15-Jan-2023
Time         → 0.5 → 12:00 PM
Text         → treats numbers as text (won't calculate)
\`\`\`

**Shortcut keys for number formats:**
\`\`\`
Ctrl + Shift + 1  → Number (2 decimal places)
Ctrl + Shift + 2  → Time
Ctrl + Shift + 3  → Date
Ctrl + Shift + 4  → Currency
Ctrl + Shift + 5  → Percentage
Ctrl + Shift + 6  → Scientific notation
\`\`\`

## Alignment

| Option | What it does |
|--------|-------------|
| Left / Center / Right | Horizontal alignment |
| Top / Middle / Bottom | Vertical alignment |
| Wrap Text | Shows all text across multiple lines in one cell |
| Merge & Center | Combines cells and centers the content |
| Indent | Adds space from the left edge |

:::mistake
**Don't overuse Merge & Center.** Merged cells break sorting, filtering, and copy-paste. Use **Center Across Selection** instead (Format Cells → Alignment → Horizontal: Center Across Selection).
:::

## Column Width & Row Height

\`\`\`
Double-click column border     → auto-fit column width
Select columns → Format → Column Width → type exact width
Select rows → Format → Row Height → type exact height
\`\`\`

**Auto-fit all columns at once:**
1. Press **Ctrl + A** to select all
2. Double-click any column border in the header

## Cell Styles

**Home → Cell Styles** gives you one-click formatting presets:
- **Heading 1/2/3** — styled headings
- **Good / Bad / Neutral** — traffic-light data classification
- **Calculation / Input / Output** — common spreadsheet roles

## Format Painter

The **Format Painter** (paintbrush icon on Home tab) copies formatting from one cell to another:
- **Single click** → paste format once
- **Double click** → paste format continuously until you press Escape

:::insight
Build a **template row** with all your desired formatting, then use Format Painter to apply it to other rows instantly. This saves enormous time on large datasets.
:::
`,

// ─────────────────────────────────────────────────────────────────────────────

3: `# Basic Data Entry & Navigation

Efficient data entry is the foundation of every Excel spreadsheet. Learn the right techniques and you'll save hours every week.

## Entering Data

| Action | How |
|--------|-----|
| Enter a value | Click a cell and type |
| Confirm and move down | **Enter** |
| Confirm and move right | **Tab** |
| Confirm and stay | **Ctrl + Enter** |
| Cancel entry | **Escape** |
| Edit a cell | **F2** (or double-click) |

## Data Types

Excel automatically recognises three types:

| Type | Examples | Alignment |
|------|----------|-----------|
| **Text** | Names, addresses, codes | Left |
| **Numbers** | 42, 3.14, -100 | Right |
| **Dates/Times** | 15-Jan-2023, 14:30 | Right |

:::tip
If Excel treats a number as text (you'll see a green triangle in the corner), use **Data → Text to Columns** or multiply by 1 to convert it.
:::

## AutoFill

AutoFill is one of Excel's most powerful time-savers.

\`\`\`
Type January → drag the fill handle → February, March, April…
Type 1, 2   → select both → drag → 3, 4, 5…
Type Mon    → drag → Tue, Wed, Thu…
Type Q1     → drag → Q2, Q3, Q4…
\`\`\`

**Custom AutoFill lists:** File → Options → Advanced → Edit Custom Lists

:::scenario
You need to fill 100 rows with a repeating pattern (Yes, No, Yes, No…). Type "Yes" in A1 and "No" in A2, select both, then drag the fill handle down. Excel repeats the pattern automatically.
:::

## Flash Fill (Ctrl + E)

Flash Fill detects patterns and fills data automatically:

| Column A (Full Name) | Column B (First Name) |
|---------------------|----------------------|
| Priya Sharma | Priya |
| Rahul Gupta | *type "Rahul" → Ctrl+E* |

Excel fills the rest of column B by detecting the pattern!

## Find & Replace

\`\`\`
Ctrl + F  → Find
Ctrl + H  → Replace
\`\`\`

**Advanced options:**
- **Match case** — find "Apple" but not "apple"
- **Match entire cell contents** — find "10" but not "100"
- **Replace with formatting** — change all red text to blue

## Go To Special (Ctrl + G → Special)

This hidden gem lets you select:
- **Blanks** — find all empty cells (great for gap-filling)
- **Constants** — only cells with typed values
- **Formulas** — only cells with formulas
- **Visible cells only** — ignore hidden rows

:::insight
After filtering a table, always paste with **Ctrl + G → Special → Visible cells only** to ensure you're only pasting into the visible rows.
:::

## Data Validation

**Data → Data Validation** controls what can be entered in a cell:

\`\`\`
Allow: Whole number between 1 and 100
Allow: List  →  Items: Yes,No,Maybe   ← creates a dropdown
Allow: Date  →  between 01-Jan-2024 and 31-Dec-2024
Allow: Text length  →  maximum 50 characters
\`\`\`

:::tip
Add an **Input Message** and **Error Alert** in Data Validation to guide users — this turns your spreadsheet into a data-entry form that validates itself.
:::
`,

// ─────────────────────────────────────────────────────────────────────────────

4: `# Basic Formulas & Functions

Formulas are what make Excel a spreadsheet, not just a table. Every formula starts with **=**.

## Formula Anatomy

\`\`\`excel
= SUM ( A1 : A10 )
│  │      └─ arguments
│  └─ function name
└─ equals sign (required)
\`\`\`

## Cell References

| Type | Example | Behaviour when copied |
|------|---------|----------------------|
| **Relative** | \`=A1\` | Adjusts to new position |
| **Absolute** | \`=\$A\$1\` | Always points to A1 |
| **Mixed (row locked)** | \`=A\$1\` | Row stays, column shifts |
| **Mixed (col locked)** | \`=\$A1\` | Column stays, row shifts |

Press **F4** while editing a reference to cycle through these types.

:::tip
Use **absolute references** (\`\$A\$1\`) when you want a formula to always point to the same cell — like a tax rate, discount percentage, or conversion factor stored in one place.
:::

## Essential Functions

### SUM
\`\`\`excel
=SUM(A1:A10)           → adds all values from A1 to A10
=SUM(A1,B1,C1)         → adds individual cells
=SUM(A1:A10,C1:C10)    → adds two separate ranges
\`\`\`

### AVERAGE, MIN, MAX, COUNT
\`\`\`excel
=AVERAGE(B2:B20)       → arithmetic mean
=MIN(C2:C20)           → smallest value
=MAX(C2:C20)           → largest value
=COUNT(D2:D20)         → count of numeric cells
=COUNTA(D2:D20)        → count of non-empty cells (including text)
=COUNTBLANK(D2:D20)    → count of empty cells
\`\`\`

### ROUND, INT, ABS
\`\`\`excel
=ROUND(3.14159, 2)     → 3.14
=ROUND(2345, -2)       → 2300   (round to nearest 100)
=INT(3.9)              → 3      (truncate to integer)
=ABS(-45)              → 45     (absolute value)
\`\`\`

:::scenario
You have sales figures with 6 decimal places from an export. Use \`=ROUND(A2, 2)\` to clean up to 2 decimal places before sharing with management.
:::

## Order of Operations (BODMAS/PEMDAS)

\`\`\`excel
= 2 + 3 * 4      → 14   (not 20 — multiplication first)
= (2 + 3) * 4    → 20   (brackets override order)
= 10 / 2 ^ 2     → 2.5  (exponent before division)
\`\`\`

## Arithmetic Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| + | Addition | \`=A1+B1\` |
| - | Subtraction | \`=A1-B1\` |
| * | Multiplication | \`=A1*B1\` |
| / | Division | \`=A1/B1\` |
| ^ | Exponentiation | \`=A1^2\` |
| & | Text concatenation | \`=A1&" "&B1\` |

## Common Shortcuts for Formulas

\`\`\`
Alt + =          → AutoSum (SUM of cells above/left)
F4               → toggle absolute/relative reference
Ctrl + '         → copy formula from cell above
Ctrl + \`          → toggle show formulas / results
F9               → evaluate selected part of formula
\`\`\`

:::insight
**AutoSum (Alt + =)** is one of the most used shortcuts in Excel. Select an empty cell below a column of numbers and press Alt + = — Excel writes the SUM formula for you instantly.
:::

:::mistake
Avoid hardcoding values inside formulas like \`=A1*0.18\`. Instead put 0.18 in a cell (e.g. B1) and write \`=A1*\$B\$1\`. When the rate changes, update one cell and all formulas update automatically.
:::
`,

// ─────────────────────────────────────────────────────────────────────────────

5: `# Basic Data Handling

Clean, organised data is the foundation of every good analysis. Learn to sort, filter, and structure your data like a pro.

## Sorting Data

**Data → Sort** or the quick sort buttons:

\`\`\`
A→Z (ascending)  /  Z→A (descending)
\`\`\`

**Multi-level sort:**
1. Data → Sort
2. Click **Add Level**
3. Sort by Department (A-Z), then by Salary (Largest-Smallest)

:::tip
Always convert your data to a **Table** (Ctrl + T) before sorting. Excel remembers your headers and includes them automatically, preventing the classic "I accidentally sorted the header row" mistake.
:::

## Filtering Data

**Ctrl + Shift + L** toggles AutoFilter (dropdown arrows in headers).

\`\`\`
Click dropdown → filter by value, color, or custom condition
Text Filters   → Contains, Does Not Contain, Begins With…
Number Filters → Greater Than, Top 10, Above Average…
Date Filters   → This Week, Last Month, Between…
\`\`\`

**Keyboard shortcuts:**
\`\`\`
Alt + Down arrow   → open filter dropdown for active header
\`\`\`

:::scenario
You have 5,000 rows of customer orders. You need to see only orders from Delhi with a value over ₹10,000. Use two filters: City = "Delhi" AND Amount > 10000. The status bar at the bottom will show the count of visible rows.
:::

## Excel Tables (Ctrl + T)

Converting data to a Table is one of the best habits in Excel:

**Benefits:**
- Headers stay visible when scrolling
- AutoFilter is automatic
- Formulas auto-fill to new rows
- Named references: \`=Table1[Sales]\` instead of \`=C2:C100\`
- Works perfectly with Pivot Tables

\`\`\`
Ctrl + T  → create Table from selection
\`\`\`

## Removing Duplicates

**Data → Remove Duplicates:**
1. Select your data or place cursor inside a table
2. Choose which columns to check for duplicates
3. Click OK — Excel removes duplicate rows and reports how many were deleted

:::mistake
Remove Duplicates is permanent! Always work on a copy of your data, or press **Ctrl + Z** immediately if the result looks wrong.
:::

## Freeze Panes

Keep headers visible while scrolling through thousands of rows:

\`\`\`
Select cell B2 → View → Freeze Panes → Freeze Panes
→ Row 1 (header) and Column A stay frozen
\`\`\`

**Quick options:**
- **Freeze Top Row** — freezes only row 1
- **Freeze First Column** — freezes only column A

## Print Setup

**Page Layout tab:**
\`\`\`
Orientation    → Portrait / Landscape
Scale          → Fit Sheet on One Page / Fit All Columns on One Page
Print Area     → Select range → Set Print Area
Page Breaks    → Insert / Remove page breaks
Headers/Footers → Add page numbers, file name, date
\`\`\`

:::insight
**Ctrl + P → Page Setup** gives you a full preview. Use **Fit to 1 page wide** to force a wide dataset onto a single printed page without manually adjusting column widths.
:::
`,

// ─────────────────────────────────────────────────────────────────────────────

6: `# Basic Charts

A good chart communicates in seconds what a table takes minutes to read. Excel has over 17 chart types — here's how to choose and create them effectively.

## Choosing the Right Chart

| Chart Type | Best For |
|-----------|----------|
| **Column / Bar** | Comparing categories (sales by region, scores by student) |
| **Line** | Trends over time (monthly revenue, stock price) |
| **Pie / Doughnut** | Parts of a whole (market share, budget breakdown) |
| **Scatter** | Relationship between two variables |
| **Area** | Cumulative totals over time |
| **Combo** | Two metrics with different scales (revenue + growth %) |

:::mistake
Avoid **3D charts** — they distort the data perspective and make values hard to read accurately. Stick to flat, clean 2D charts.
:::

## Creating a Chart

\`\`\`
1. Select your data (including headers)
2. Insert → Charts → choose chart type
   OR press Alt + F1 → inserts default chart instantly
   OR press F11 → creates chart on a new sheet
\`\`\`

## Chart Elements

| Element | Purpose |
|---------|---------|
| **Chart Title** | Describes what the chart shows |
| **Axes** | X-axis (categories), Y-axis (values) |
| **Legend** | Identifies data series (shown in colour) |
| **Data Labels** | Shows exact values on bars/points |
| **Gridlines** | Visual guides across the plot area |
| **Trendline** | Shows the overall direction of data |

**Add/remove elements:** Click the chart → **Chart Elements** button (+ icon on the right)

## Formatting Charts

\`\`\`
Double-click any element  → open Format pane
Right-click              → context menu with quick options
Chart Styles button (🖌) → one-click style themes
\`\`\`

:::tip
Click a bar/line once to select the whole series, then click again to select a single data point. You can then apply a different colour to just that one bar to highlight it.
:::

## Moving and Resizing

\`\`\`
Click and drag chart → move it
Drag corner handles  → resize (hold Alt to snap to cell borders)
Move to own sheet    → Right-click chart → Move Chart → New sheet
\`\`\`

## Sparklines — Mini Charts in Cells

Sparklines are tiny charts that live inside a single cell:

\`\`\`
Insert → Sparklines → Line / Column / Win/Loss
Select the data range → select the output cell
\`\`\`

:::scenario
You have a monthly sales table with 12 columns. Add a Sparkline in column N to show the trend for each salesperson's performance across the year — at a glance, without a full chart!
:::

:::insight
Use **Combo charts** when comparing two metrics with different scales — for example, Revenue (₹ lakh) as a column chart and Growth % as a line chart on a secondary axis. This prevents the percentage line from being invisibly small next to large revenue bars.
:::
`,

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL 2 — INTERMEDIATE
// ─────────────────────────────────────────────────────────────────────────────

7: `# Text Functions

Text functions let you clean, transform, and extract data from text strings — essential when working with messy imported data.

## UPPER, LOWER, PROPER

\`\`\`excel
=UPPER("hello world")     → HELLO WORLD
=LOWER("HELLO WORLD")     → hello world
=PROPER("hello world")    → Hello World
\`\`\`

Use **PROPER** to fix names imported in ALL CAPS.

## LEN — String Length

\`\`\`excel
=LEN("CareerEzi")         → 9
=LEN(A2)                  → length of text in A2
\`\`\`

:::tip
Use \`=LEN(TRIM(A2))\` to check length after removing spaces, which is the real length for validation purposes.
:::

## TRIM and CLEAN

\`\`\`excel
=TRIM("  hello  world  ")  → "hello world"
                              (removes leading/trailing spaces,
                               collapses internal multiple spaces to one)

=CLEAN(A2)                 → removes non-printable characters
                              (often present in data copied from web pages)
\`\`\`

:::scenario
You import a CSV with customer names that have extra spaces. VLOOKUP fails because "  Priya " ≠ "Priya". Fix with \`=TRIM(A2)\` in a helper column, then paste-as-values to replace originals.
:::

## LEFT, RIGHT, MID

\`\`\`excel
=LEFT("ABCDEF", 3)         → ABC   (first 3 characters)
=RIGHT("ABCDEF", 2)        → EF    (last 2 characters)
=MID("ABCDEF", 2, 3)       → BCD   (start at pos 2, get 3 chars)
\`\`\`

**Practical example — extract employee ID from code "EMP-2024-0042":**
\`\`\`excel
=MID(A2, 10, 4)            → 0042
=RIGHT(A2, 4)              → 0042   (simpler for fixed-length suffix)
\`\`\`

## FIND and SEARCH

\`\`\`excel
=FIND("@", "user@example.com")     → 5   (case-sensitive)
=SEARCH("excel", "Learn Excel Now") → 7   (case-insensitive)
\`\`\`

**Extract username from email:**
\`\`\`excel
=LEFT(A2, FIND("@", A2) - 1)       → "user"
\`\`\`

## SUBSTITUTE and REPLACE

\`\`\`excel
=SUBSTITUTE("Hello World", "World", "Excel")   → "Hello Excel"
=SUBSTITUTE(A2, " ", "_")                      → replaces ALL spaces with _
=SUBSTITUTE(A2, " ", "_", 1)                   → replaces FIRST space only

=REPLACE("ABCDEF", 3, 2, "XX")                 → ABXXEF
\`\`\`

## CONCATENATE / CONCAT / TEXTJOIN

\`\`\`excel
=A2 & " " & B2                        → "Priya Sharma"
=CONCAT(A2, " ", B2)                  → "Priya Sharma"
=TEXTJOIN(", ", TRUE, A2:A10)         → "Alice, Bob, Carol, ..." (skips blanks)
\`\`\`

:::insight
**TEXTJOIN** is the modern replacement for the old CONCATENATE function. The TRUE parameter means it ignores empty cells, so your joined text won't have double commas from blanks.
:::

## TEXT Function — Format Numbers as Text

\`\`\`excel
=TEXT(44927, "DD-MMM-YYYY")          → "15-Jan-2023"
=TEXT(0.1234, "0.00%")               → "12.34%"
=TEXT(1500000, "₹##,##,##0")         → "₹15,00,000"
=TEXT(A2, "MMM YYYY")                → "Jan 2023"
\`\`\`

:::challenge
Build a formula that takes a date in A1 and a sales amount in B1 and outputs: **"Sales for January 2024: ₹1,50,000"**

\`\`\`excel
="Sales for " & TEXT(A1,"MMMM YYYY") & ": ₹" & TEXT(B1,"##,##,##0")
\`\`\`
:::
`,

// ─────────────────────────────────────────────────────────────────────────────

8: `# Logical Functions

Logical functions evaluate conditions and return results based on whether they are TRUE or FALSE.

## IF — The Decision Maker

\`\`\`excel
=IF(condition, value_if_true, value_if_false)

=IF(A2 >= 60, "Pass", "Fail")
=IF(B2 > 100000, "High Value", "Standard")
=IF(C2 = "", "Missing", C2)
\`\`\`

## Nested IF

\`\`\`excel
=IF(A2 >= 90, "A",
  IF(A2 >= 75, "B",
    IF(A2 >= 60, "C", "F")))
\`\`\`

:::tip
Nested IFs become hard to read beyond 3 levels. Use **IFS** (Excel 2019+) instead — it's much cleaner.
:::

## IFS — Multiple Conditions Cleanly

\`\`\`excel
=IFS(A2>=90, "A",
     A2>=75, "B",
     A2>=60, "C",
     A2>=45, "D",
     TRUE,   "F")
\`\`\`

The \`TRUE, "F"\` at the end acts as the default (else) case.

## AND, OR, NOT

\`\`\`excel
=AND(A2>50, B2="Active")      → TRUE only if BOTH are true
=OR(A2="Delhi", A2="Mumbai")  → TRUE if EITHER is true
=NOT(A2="Inactive")           → TRUE if A2 is not "Inactive"

-- Combining with IF:
=IF(AND(A2>50, B2="Active"), "Eligible", "Not eligible")
\`\`\`

:::scenario
You're marking scholarship eligibility: Score > 80 AND Attendance >= 75%.
\`\`\`excel
=IF(AND(B2>80, C2>=75%), "Eligible", "Not Eligible")
\`\`\`
:::

## IFERROR and IFNA

\`\`\`excel
=IFERROR(formula, value_if_error)

=IFERROR(VLOOKUP(A2,Table1,2,0), "Not Found")
=IFERROR(A2/B2, 0)              → returns 0 instead of #DIV/0!
=IFNA(VLOOKUP(A2,Table1,2,0), "Not Found")
   → IFNA catches only #N/A errors, not other errors
\`\`\`

:::mistake
Don't use IFERROR to hide all errors silently. It can mask real bugs. Use IFNA when you only want to handle "lookup not found" — keep other errors visible so you can fix them.
:::

## SWITCH — Replace Complex Nested IFs

\`\`\`excel
=SWITCH(A2,
  "Mon", "Monday",
  "Tue", "Tuesday",
  "Wed", "Wednesday",
  "Other day")          ← default value
\`\`\`

## COUNTIF and COUNTIFS

\`\`\`excel
=COUNTIF(range, criteria)
=COUNTIF(A2:A100, "Delhi")          → count rows where value = Delhi
=COUNTIF(B2:B100, ">50000")         → count rows where value > 50000
=COUNTIF(C2:C100, "*Ltd*")          → count rows containing "Ltd"

=COUNTIFS(A2:A100, "Delhi", B2:B100, ">50000")
   → count rows where BOTH conditions are met
\`\`\`

## SUMIF and SUMIFS

\`\`\`excel
=SUMIF(range, criteria, sum_range)
=SUMIF(A2:A100, "Delhi", C2:C100)   → sum sales only for Delhi

=SUMIFS(sum_range, range1, criteria1, range2, criteria2)
=SUMIFS(C2:C100, A2:A100, "Delhi", B2:B100, "Q1")
   → sum sales in Delhi during Q1
\`\`\`

:::insight
**COUNTIFS** and **SUMIFS** are the workhorses of Excel reporting. Most dashboards rely on these two functions to slice and aggregate data by multiple criteria without a Pivot Table.
:::
`,

// ─────────────────────────────────────────────────────────────────────────────

9: `# Lookup Functions

Lookup functions let you search for a value in one place and return a related value from another — the backbone of data matching and reporting.

## VLOOKUP — The Classic

\`\`\`excel
=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])

=VLOOKUP(A2, B:D, 2, FALSE)
         │    │    │   └─ FALSE = exact match (always use this!)
         │    │    └─ return value from 2nd column of table
         │    └─ search in this range (first col = search column)
         └─ value to look up
\`\`\`

**Example: find employee salary by ID**
\`\`\`excel
Employee table: Column A = ID, B = Name, C = Salary
=VLOOKUP(E2, A:C, 3, FALSE)    → returns Salary for ID in E2
\`\`\`

:::mistake
**VLOOKUP only looks right.** The lookup column must always be the leftmost column of your table array. If you need to look left, use INDEX/MATCH or XLOOKUP instead.
:::

## HLOOKUP — Horizontal Lookup

Same as VLOOKUP but searches across rows instead of columns:
\`\`\`excel
=HLOOKUP(lookup_value, table_array, row_index_num, FALSE)
\`\`\`

## INDEX + MATCH — The Flexible Alternative

\`\`\`excel
=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))

-- Find salary by name (even if Name is not the first column):
=INDEX(C2:C100, MATCH("Priya", A2:A100, 0))
                 └─ finds position of "Priya" in column A
        └─ returns value at that position from column C
\`\`\`

**Why INDEX/MATCH beats VLOOKUP:**
- Can look left (VLOOKUP can only look right)
- Faster on large datasets
- Doesn't break when you insert/delete columns
- Can match rows AND columns (2D lookup)

:::tip
Memorise the pattern: **INDEX(**what to return**, MATCH(**what to find**, where to find it**, 0**))**. The 0 at the end means exact match.
:::

## XLOOKUP — The Modern Standard (Excel 2021+)

\`\`\`excel
=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])

=XLOOKUP(A2, EmployeeID, Salary, "Not found")
   → cleaner, no column numbers, built-in error handling
   → can look left or right
   → returns multiple columns at once
\`\`\`

**XLOOKUP advantages:**
| Feature | VLOOKUP | XLOOKUP |
|---------|---------|---------|
| Look direction | Right only | Any direction |
| Column number | Required | Not needed |
| If not found | Needs IFERROR | Built-in |
| Multiple returns | One column | Multiple columns |
| Wildcards | Yes | Yes |

## MATCH and INDEX for 2D Lookup

Find a value at the intersection of a row and column:
\`\`\`excel
-- Table: rows = months, columns = products
=INDEX(B2:D13, MATCH("June", A2:A13, 0), MATCH("Widget", B1:D1, 0))
   → returns sales of Widget in June
\`\`\`

:::scenario
You have two sheets: a master product list and a sales report. Use XLOOKUP (or INDEX/MATCH) to bring the product category and cost price into the sales report based on the Product ID. Avoid VLOOKUP because your master list has the ID in the middle.
:::

:::challenge
Your dataset has duplicate IDs. VLOOKUP returns only the first match. How do you find the second match?

Use MATCH with a start position beyond the first match:
\`\`\`excel
-- First match position:
=MATCH(A2, B:B, 0)
-- Second match (search from row after first match):
=MATCH(A2, OFFSET(B1, MATCH(A2,B:B,0), 0, 1000), 0) + MATCH(A2,B:B,0)
\`\`\`
Or better — use **Power Query** to merge tables properly!
:::
`,

// ─────────────────────────────────────────────────────────────────────────────

10: `# Date & Time Functions

Excel stores dates as serial numbers (1 = January 1, 1900) and times as decimal fractions of a day. This makes date arithmetic remarkably simple.

## TODAY and NOW

\`\`\`excel
=TODAY()        → today's date (updates every time sheet recalculates)
=NOW()          → today's date and current time
\`\`\`

:::tip
If you need a **static** timestamp that doesn't change, press **Ctrl + ;** (date) or **Ctrl + Shift + ;** (time) to enter the current date/time as a hardcoded value.
:::

## DATE, YEAR, MONTH, DAY

\`\`\`excel
=DATE(2024, 3, 15)         → 15-Mar-2024
=YEAR(A2)                  → extracts the year
=MONTH(A2)                 → extracts the month number (1–12)
=DAY(A2)                   → extracts the day number (1–31)

-- Last day of any month:
=EOMONTH(A2, 0)            → last day of the month of A2
=EOMONTH(A2, 1)            → last day of NEXT month
=EOMONTH(A2, -1)           → last day of PREVIOUS month
\`\`\`

## DATEDIF — Calculate Age or Tenure

\`\`\`excel
=DATEDIF(start_date, end_date, unit)

=DATEDIF(B2, TODAY(), "Y")    → complete years (age)
=DATEDIF(B2, TODAY(), "M")    → complete months
=DATEDIF(B2, TODAY(), "D")    → total days
=DATEDIF(B2, TODAY(), "YM")   → months beyond complete years
=DATEDIF(B2, TODAY(), "MD")   → days beyond complete months

-- Display "2 years, 3 months, 15 days":
=DATEDIF(B2,TODAY(),"Y") & " years, " & DATEDIF(B2,TODAY(),"YM") & " months, " & DATEDIF(B2,TODAY(),"MD") & " days"
\`\`\`

## NETWORKDAYS — Working Days

\`\`\`excel
=NETWORKDAYS(start, end)
=NETWORKDAYS(A2, B2)                   → working days between dates (excludes Sat/Sun)
=NETWORKDAYS(A2, B2, HolidayRange)     → also exclude holidays
=NETWORKDAYS.INTL(A2, B2, 1)          → 1 = Sat/Sun off, 2 = Sun/Mon off, etc.
\`\`\`

:::scenario
HR wants to calculate the exact number of working days for leave approval. Staff work Monday–Saturday (not Sunday). Use NETWORKDAYS.INTL with weekend code 11 (Sunday only).
\`\`\`excel
=NETWORKDAYS.INTL(StartDate, EndDate, 11, HolidayList)
\`\`\`
:::

## WEEKDAY and WEEKNUM

\`\`\`excel
=WEEKDAY(A2, 2)     → 1=Mon, 2=Tue… 7=Sun (mode 2 = Mon-based)
=WEEKNUM(A2)        → which week of the year (1–53)
=ISOWEEKNUM(A2)     → ISO week number (starts on Monday)
\`\`\`

## Time Arithmetic

\`\`\`excel
-- Time is stored as a fraction of a day:
0.5  = 12:00 noon
0.25 = 6:00 AM
0.75 = 6:00 PM

=B2 - A2                    → duration (format as [h]:mm for > 24 hours)
=HOUR(A2)                   → hour component
=MINUTE(A2)                 → minute component
=TIME(9, 30, 0)             → 9:30:00 AM as a time value
\`\`\`

:::insight
For calculating total hours that exceed 24, format the result cell as **[h]:mm** — with square brackets. Without this, Excel shows the time modulo 24 (e.g., 26 hours shows as 2:00 instead of 26:00).
:::

:::challenge
Calculate the percentage of the year remaining as of today:
\`\`\`excel
=(DATE(YEAR(TODAY()),12,31) - TODAY()) / (DATE(YEAR(TODAY()),12,31) - DATE(YEAR(TODAY()),1,1)) * 100
\`\`\`
:::
`,

// ─────────────────────────────────────────────────────────────────────────────

11: `# Pivot Tables

Pivot Tables are Excel's most powerful analysis tool. They let you summarise thousands of rows into a concise, interactive report in seconds.

## What is a Pivot Table?

A Pivot Table **rearranges (pivots) your data** to show totals, averages, counts, and other summaries — sliced by any dimension you choose.

![Pivot Table transforming raw data into a summary report](https://support.content.office.net/en-us/media/4dbfe1a2-0ac8-4c15-a8ed-47f78ae6f0ed.png)

## Creating a Pivot Table

\`\`\`
1. Click anywhere inside your data table
2. Insert → PivotTable
3. Choose: New Worksheet (recommended)
4. Click OK
\`\`\`

The **PivotTable Fields** pane appears on the right with four areas:

| Area | Purpose |
|------|---------|
| **Filters** | Add a slicer at the top to filter the entire pivot |
| **Columns** | Categories shown as column headers |
| **Rows** | Categories shown as row labels |
| **Values** | The numbers to summarise (Sum, Count, Average, etc.) |

## Building Your First Pivot

Drag fields from the field list:

\`\`\`
Rows    → Region
Columns → Quarter
Values  → Sales Amount (Sum)
\`\`\`

Result: a grid showing total sales per region per quarter — instantly, with no formulas!

## Changing the Summary Function

Right-click a value in the pivot → **Value Field Settings**:
- Sum, Count, Average, Max, Min, Product
- **% of Grand Total**, **% of Row Total**, **% of Column Total**
- **Running Total**, **Rank**

:::tip
Show values as **"% of Grand Total"** to instantly see what percentage each region or product contributes to the overall total.
:::

## Sorting and Filtering in Pivots

\`\`\`
Click dropdown arrow in Row/Column label → Sort A-Z, Z-A, or by value
Click dropdown arrow → Value Filters → Top 10, Greater Than…
\`\`\`

## Slicers — Visual Filters

**PivotTable Analyze → Insert Slicer:**
- Creates a visual button panel to filter your pivot
- Multiple slicers can be connected to the same pivot
- Connect one slicer to multiple pivots: right-click slicer → Report Connections

:::scenario
You present a quarterly sales pivot to management. Add slicers for Region and Product Category. Managers can click buttons to filter the entire report without touching the pivot itself — makes it feel like a real dashboard!
:::

## Pivot Table Grouping

Right-click a date field in Rows → **Group**:
- Group by Year, Quarter, Month, Week, Day
- Group numbers into ranges (0–10, 11–20, 21–30…)
- Group text items manually into custom groups

## Calculated Fields

**PivotTable Analyze → Fields, Items & Sets → Calculated Field:**
\`\`\`
Name: Profit Margin
Formula: = Profit / Revenue
\`\`\`

Adds a new column to your pivot calculated from existing fields.

:::mistake
Never type over Pivot Table cells to "fix" them — your changes get overwritten on the next refresh. Always modify the source data or use Calculated Fields. Refresh with **Alt + F5** after changing source data.
:::

## Refresh and Source Data

\`\`\`
Alt + F5          → Refresh pivot
Ctrl + Alt + F5   → Refresh all pivots
Right-click → Change Data Source → update the range or table
\`\`\`

:::insight
If your source data is an **Excel Table** (Ctrl+T), the pivot automatically picks up new rows when you refresh. If it's a plain range, you must manually expand the data source. Always use Tables as Pivot Table sources!
:::
`,

// ─────────────────────────────────────────────────────────────────────────────

12: `# Conditional Formatting

Conditional Formatting automatically applies colours, icons, and data bars based on rules — turning raw numbers into visual insights.

## Applying Basic Rules

**Home → Conditional Formatting → Highlight Cell Rules:**

\`\`\`
Greater Than…      → highlight cells above a threshold
Less Than…         → highlight cells below a threshold
Between…           → highlight cells in a range
Equal To…          → highlight exact matches
Text that Contains → highlight cells with specific text
Date Occurring     → highlight dates (yesterday, this week, last month…)
Duplicate Values   → find duplicates or unique values
\`\`\`

## Top/Bottom Rules

**Home → Conditional Formatting → Top/Bottom Rules:**
\`\`\`
Top 10 items       → highlight the 10 highest values
Top 10%            → highlight the top 10 percent
Bottom 10 items    → highlight the 10 lowest values
Above Average      → highlight values above the mean
Below Average      → highlight values below the mean
\`\`\`

:::tip
Use **Top 10%** and **Bottom 10%** on exam scores to instantly see who the high performers and struggling students are — no sorting required.
:::

## Data Bars

**Home → Conditional Formatting → Data Bars:**
Fills each cell with a bar proportional to its value — creates an inline mini bar chart directly in the cells.

## Color Scales

**Home → Conditional Formatting → Color Scales:**
Applies a gradient from one colour (low values) to another (high values):
- Red–White–Green: bad → neutral → good
- Green–White–Red: good → neutral → bad

## Icon Sets

**Home → Conditional Formatting → Icon Sets:**
Shows traffic light icons (🔴🟡🟢), arrows, stars, or checkmarks based on value thresholds.

## Custom Formula Rules

This is where Conditional Formatting becomes truly powerful:

**Home → Conditional Formatting → New Rule → Use a formula**

\`\`\`excel
-- Highlight entire row where Status = "Overdue":
=$C2="Overdue"

-- Highlight cells where value is more than 2 standard deviations above average:
=A2 > AVERAGE($A$2:$A$100) + 2*STDEV($A$2:$A$100)

-- Highlight weekends in a date column:
=WEEKDAY(A2,2)>=6

-- Zebra striping (alternate row colours):
=MOD(ROW(),2)=0
\`\`\`

:::insight
The **\$C2** pattern (column locked, row relative) is the key to formula-based rules that highlight entire rows. The locked column checks the condition column, while the relative row moves down with each row.
:::

:::scenario
You have a project tracker. Apply conditional formatting to highlight the entire row red if the deadline (column D) has passed and status (column E) is not "Done":
\`\`\`excel
=AND($D2<TODAY(), $E2<>"Done")
\`\`\`
:::

## Managing Rules

**Home → Conditional Formatting → Manage Rules:**
- See all rules on the sheet or selected cells
- Change rule order (rules are applied top-to-bottom, first match wins)
- Tick **Stop If True** to prevent lower rules from applying after a match
- Edit or delete rules

:::mistake
Conditional Formatting can slow down large workbooks if applied to entire columns (e.g., A:A). Always limit rules to the exact data range (e.g., A2:A1000) to keep your file fast.
:::
`,

// ─────────────────────────────────────────────────────────────────────────────

13: `# Data Cleaning Tools

Real-world data is messy. This lesson covers Excel's built-in tools to clean, standardise, and validate data before analysis.

## Text to Columns

Splits text in one column into multiple columns:

**Data → Text to Columns:**
\`\`\`
Step 1: Choose Delimited (comma, space, tab…) or Fixed Width
Step 2: Select delimiters  →  comma, semicolon, space, other
Step 3: Set column data formats (text, date, skip column)

Example: "Priya,25,Delhi" in one cell
→ Priya | 25 | Delhi  in three columns
\`\`\`

:::tip
**Text to Columns** with "Fixed Width" is great for bank statements and legacy reports where data is aligned in columns of fixed character widths.
:::

## Flash Fill (Ctrl + E)

Flash Fill detects patterns and extracts/transforms data automatically:

| Column A | Column B |
|----------|----------|
| Priya Sharma | Priya |
| Rahul Gupta | *press Ctrl+E* |
| Anita Singh | *auto-filled* |

Works for: extracting first/last names, reformatting phone numbers, cleaning codes, reversing name order.

## TRIM + CLEAN for Whitespace

\`\`\`excel
=TRIM(A2)      → removes leading/trailing/extra spaces
=CLEAN(A2)     → removes non-printable characters (line breaks, tabs)
=TRIM(CLEAN(A2)) → apply both together for thorough cleaning
\`\`\`

**After cleaning, paste as values to remove the formulas:**
\`\`\`
Copy cleaned column → Paste Special → Values only (Ctrl+Shift+V, then V)
\`\`\`

## Find & Replace for Cleaning

\`\`\`
Ctrl + H  → Replace
Replace: "N/A" with "" (blank)
Replace: "-" with "" in phone numbers
Replace: "," with "" in numbers formatted as "1,000,000"
Use wildcards: Replace "??" (any 2 chars) or "*" (any text)
\`\`\`

## Removing Duplicates

\`\`\`
Data → Remove Duplicates
→ Choose which columns define "unique"
→ Can keep first occurrence, remove subsequent ones
\`\`\`

:::mistake
Remove Duplicates permanently deletes rows. Before using it, either work on a copy or use COUNTIF to identify and review duplicates manually first.
\`\`\`excel
=COUNTIF($A$2:$A$100, A2) > 1   → TRUE if this value is a duplicate
\`\`\`
:::

## Data Validation for Prevention

**Data → Data Validation** prevents bad data from entering:

\`\`\`
Dropdown list   → Allow: List  → Source: Yes,No,Pending
Number range    → Allow: Whole number  → Between 1 and 100
Date range      → Allow: Date  → Greater than =TODAY()
No duplicates   → Allow: Custom  → =COUNTIF(A:A,A2)=1
\`\`\`

## Spell Check and Autocorrect

\`\`\`
F7              → Spell Check (works on text cells)
File → Options → Proofing → AutoCorrect Options → customise
\`\`\`

## Power Query for Advanced Cleaning

For large-scale or recurring data cleaning, **Power Query** (Data → Get & Transform Data) is the right tool — covered in the Advanced level. It records every cleaning step so you can re-run the whole process on next month's data with one click.

:::insight
Build a **Data Cleaning Checklist** for every new dataset you receive:
1. Check for and remove duplicates
2. TRIM and CLEAN text fields
3. Standardise case (PROPER for names, UPPER for codes)
4. Verify date formats
5. Check for impossible values (negative ages, future dates in "date of birth")
6. Validate against reference lists (valid country codes, valid categories)
:::
`,

// ─────────────────────────────────────────────────────────────────────────────

14: `# Intermediate Charts

Beyond basic column and line charts, Excel offers specialised chart types that communicate specific analytical stories more effectively.

## Clustered vs Stacked Bar/Column

\`\`\`
Clustered  → bars side by side   → compare values across categories
Stacked    → bars stacked on top → show contribution to a total
100% Stacked → shows % of total  → compare proportions across categories
\`\`\`

:::tip
Use **Stacked** when you want to show both the total AND the breakdown (e.g., total revenue AND contribution from each product). Use **100% Stacked** when the total doesn't matter — only proportions do.
:::

## Combo Charts — Dual Axis

Mix two chart types and two Y-axes:

\`\`\`
1. Select your data
2. Insert → Charts → Combo → Custom Combination
3. Assign chart type per series:
   - Revenue → Clustered Column (primary axis, left)
   - Growth % → Line (secondary axis, right)
\`\`\`

The secondary axis prevents small percentage values from appearing flat against large revenue numbers.

## Scatter and Bubble Charts

\`\`\`
Scatter → shows relationship between 2 variables
Bubble  → like scatter but a 3rd variable controls bubble size

Good for: sales (x) vs. profit margin (y) per product
         population (x) vs. GDP (y) vs. area (bubble) per country
\`\`\`

**Add a Trendline:** Right-click a data point → Add Trendline → Linear / Exponential

## Waterfall Charts

Show how a starting value increases and decreases to reach a final value:

\`\`\`
Great for: P&L bridge charts (Revenue − Costs − Tax = Net Profit)
           budget variance analysis
           HR: headcount changes (start + hires − attrition = end)
\`\`\`

Insert → Charts → Waterfall

## Histogram

Shows frequency distribution — how many values fall in each range:

\`\`\`
Insert → Charts → Histogram
→ Right-click X-axis → Format Axis → set bin width manually
\`\`\`

## Chart Design Best Practices

| Do | Don't |
|----|-------|
| Use direct labels instead of a legend | Use 3D charts |
| Keep colour palette to 2–3 colours | Use rainbow colours |
| Remove gridlines and chart border | Clutter with decoration |
| Start Y-axis at zero | Truncate axis to exaggerate differences |
| Use a descriptive title (not just "Sales") | Use vague titles |

:::scenario
You're presenting monthly performance to leadership. Create a combo chart:
- Column bars showing absolute Revenue per month
- Line showing Month-over-Month Growth %
- Secondary axis for the % line

Add data labels to the line only (showing %) and remove them from columns (use tooltip instead). This tells two stories in one chart clearly.
:::

## Formatting Deep-Dive

\`\`\`
Double-click any element  → Format pane
Chart area background     → Fill: No fill (transparent)
Gridlines                 → Format → Dashed line, 30% opacity
Data labels               → Font size 9, position: Outside End
Gap Width                 → Format Data Series → narrow to 40% for cleaner bars
\`\`\`

:::insight
Export charts as high-resolution images: right-click the chart → Save as Picture → PNG at 300 DPI. This preserves quality for presentations and printed reports without font embedding issues.
:::
`,

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL 3 — ADVANCED
// ─────────────────────────────────────────────────────────────────────────────

15: `# Advanced Formulas & Array Formulas

Advanced formulas combine multiple functions to solve complex calculations that would otherwise require helper columns or manual work.

## Array Formulas — The Concept

An array formula operates on multiple values at once instead of a single value:

\`\`\`excel
-- Normal SUM needs a column of pre-calculated values:
-- Column D = B * C, then =SUM(D2:D100)

-- Array formula does it in ONE cell (Ctrl+Shift+Enter in older Excel):
=SUM(B2:B100 * C2:C100)

-- In Excel 365/2021, just press Enter — dynamic arrays work automatically
\`\`\`

## Dynamic Arrays (Excel 365)

Modern Excel automatically spills array results into neighbouring cells:

\`\`\`excel
=SORT(A2:A20)              → spills a sorted list into cells below
=UNIQUE(A2:A100)           → spills a list of unique values
=FILTER(A2:C100, B2:B100="Delhi")  → spills filtered rows
=SEQUENCE(5, 3, 1, 10)    → spills a 5×3 grid: 1,11,21…
=RANDARRAY(5, 1, 1, 100)  → spills 5 random numbers between 1 and 100
\`\`\`

:::insight
Dynamic arrays changed Excel forever. One formula can now produce an entire table of results. The **\#** operator references the entire spill range: if UNIQUE is in A1, \`=A1#\` references all its results.
:::

## SUMPRODUCT — Multi-Criteria Swiss Army Knife

\`\`\`excel
=SUMPRODUCT(array1 * array2)
=SUMPRODUCT((A2:A100="Delhi") * (B2:B100="Q1") * C2:C100)
   → sum of C where A=Delhi AND B=Q1 (like SUMIFS but more flexible)

=SUMPRODUCT((A2:A100="Delhi") * 1)
   → count rows where A=Delhi (like COUNTIF)

=SUMPRODUCT(LARGE(A2:A20, {1,2,3}))
   → sum of top 3 values
\`\`\`

## LARGE, SMALL, RANK

\`\`\`excel
=LARGE(A2:A20, 1)    → largest value
=LARGE(A2:A20, 2)    → 2nd largest
=SMALL(A2:A20, 1)    → smallest value
=RANK(A2, $A$2:$A$20, 0)  → rank (0=descending, 1=ascending)
=RANK.EQ vs RANK.AVG  → how ties are handled
\`\`\`

## Advanced Text Extraction

\`\`\`excel
-- Extract all numbers from a text string (array formula):
=TEXTJOIN("", TRUE, IF(ISNUMBER(MID(A2,ROW(INDIRECT("1:"&LEN(A2))),1)*1),
                       MID(A2,ROW(INDIRECT("1:"&LEN(A2))),1), ""))

-- Split a cell by a delimiter into an array:
=TEXTSPLIT(A2, ",")       → splits "a,b,c" into three cells
=TEXTSPLIT(A2, ",", ";")  → splits by both comma and semicolon
\`\`\`

## LET — Define Variables in Formulas

\`\`\`excel
=LET(
  rate, 0.18,
  base, A2 - B2,
  tax,  base * rate,
  total, base + tax,
  total
)
\`\`\`

**LET** makes complex formulas readable by naming intermediate calculations.

## LAMBDA — Create Custom Functions

\`\`\`excel
-- In Name Manager, create a name "TaxAmount" with this formula:
=LAMBDA(income, rate, income * rate)

-- Then use it anywhere:
=TaxAmount(A2, 0.18)
\`\`\`

:::challenge
Calculate the weighted average score for students where each subject has a different weight:
\`\`\`excel
Weights in B1:D1, Scores in B2:D100

=SUMPRODUCT(B2:D2, $B$1:$D$1) / SUM($B$1:$D$1)
\`\`\`
:::

:::tip
Use **F9** to evaluate selected parts of a formula in the formula bar. Select \`B2:D2 * \$B\$1:\$D\$1\` and press F9 to see the array of intermediate results — invaluable for debugging complex formulas.
:::
`,

// ─────────────────────────────────────────────────────────────────────────────

16: `# Power Query

Power Query is Excel's ETL (Extract, Transform, Load) engine. It connects to data sources, transforms messy data, and loads clean data into Excel — and all steps are recorded so you can refresh with one click.

## Why Power Query?

| Manual approach | Power Query |
|----------------|-------------|
| Redo manually each month | Refresh in one click |
| No audit trail | Every step recorded |
| Limited by worksheet size | Handles millions of rows |
| Error-prone copy-paste | Repeatable, consistent |

## Opening Power Query

\`\`\`
Data → Get Data → various sources
Data → From Table/Range  (if data is already in Excel)
\`\`\`

The **Power Query Editor** opens with a preview of your data.

## The Query Editor Interface

| Area | Purpose |
|------|---------|
| **Formula Bar** | M language formula for current step |
| **Applied Steps** | List of all transformation steps (right pane) |
| **Data Preview** | How data looks after all steps |
| **Column Headers** | Right-click for column-level transforms |

## Core Transformations

### Remove and Rename Columns
\`\`\`
Right-click column header → Remove
                          → Rename
Home → Choose Columns → select which to keep
\`\`\`

### Filter Rows
\`\`\`
Click filter arrow on column header → filter by value, condition
\`\`\`

### Data Type Conversion
\`\`\`
Click data type icon left of column name → set type:
Text, Whole Number, Decimal, Date, Date/Time, True/False
\`\`\`

### Split Columns
\`\`\`
Home → Split Column → By Delimiter / By Number of Characters
\`\`\`

### Add Column
\`\`\`
Add Column → Custom Column → write an M formula
Add Column → From Examples → type what you want, Power Query detects the pattern
\`\`\`

:::tip
**Add Column from Examples** is a game-changer. Type the expected output in a few rows and Power Query reverse-engineers the formula. No M language knowledge needed!
:::

## Combining Multiple Files

\`\`\`
Data → Get Data → From File → From Folder
→ Power Query lists all files, lets you combine and transform them all at once
→ Great for: monthly reports in separate files, branch data in separate sheets
\`\`\`

## Merging Queries (Joins)

\`\`\`
Home → Merge Queries
→ Select two tables and the matching columns
→ Choose join type: Left Outer, Inner, Full Outer, etc.
→ Expand the merged column to see the joined data
\`\`\`

This is like a SQL JOIN but visual and no-code!

## Appending Queries (UNION)

\`\`\`
Home → Append Queries
→ Stack multiple tables with the same columns on top of each other
→ Great for combining Jan + Feb + Mar data into one table
\`\`\`

:::scenario
Every month you receive 12 branch sales reports as separate Excel files in a folder. Instead of manually copying and pasting, use Data → From Folder to combine all files automatically. Next month, just drop the new file in the folder and click Refresh.
:::

## Loading Data Back to Excel

\`\`\`
Home → Close & Load → To Table  (loads into a new sheet as a Table)
Home → Close & Load → To Connection Only  (for use in Power Pivot only)
\`\`\`

## Refreshing

\`\`\`
Data → Refresh All  (refreshes all queries in the workbook)
Right-click query → Refresh
Set auto-refresh: Data → Queries & Connections → right-click query → Properties → Refresh every N minutes
\`\`\`

:::insight
Every Power Query transformation generates M code behind the scenes. You can view and edit it in **Advanced Editor** (Home → Advanced Editor). This is worth learning if you repeat the same transformations across projects.
:::
`,

// ─────────────────────────────────────────────────────────────────────────────

17: `# Power Pivot & DAX

Power Pivot extends Excel with a full in-memory database engine. It handles millions of rows, supports relationships between tables, and uses DAX (Data Analysis Expressions) for calculated columns and measures.

## Why Power Pivot?

| Regular Pivot | Power Pivot |
|--------------|-------------|
| One table only | Multiple related tables |
| Row limit ~1M | Millions of rows |
| Limited calculations | Full DAX language |
| No relationships | Proper data model |

## Enabling Power Pivot

\`\`\`
File → Options → Add-ins → COM Add-ins → check Microsoft Power Pivot for Excel
\`\`\`

## The Data Model

Load tables into Power Pivot:
\`\`\`
Power Pivot tab → Add to Data Model
\`\`\`

Or load directly from Power Query:
\`\`\`
In Power Query: Home → Close & Load To → Only Create Connection + Add to Data Model
\`\`\`

## Creating Relationships

\`\`\`
Power Pivot → Manage → Diagram View
Drag a column from one table onto the matching column in another table
→ creates a relationship (like a foreign key in a database)
\`\`\`

**Example model:**
\`\`\`
Sales ──── Product (on Product_ID)
Sales ──── Date    (on Date)
Sales ──── Store   (on Store_ID)
\`\`\`

Now a single Pivot Table can pull data from all four tables!

## DAX — Data Analysis Expressions

### Calculated Columns (row-level calculation)
\`\`\`dax
Profit = Sales[Revenue] - Sales[Cost]
Margin % = DIVIDE(Sales[Profit], Sales[Revenue], 0)
Year = YEAR(Sales[Date])
\`\`\`

### Measures (aggregate calculations)
\`\`\`dax
Total Revenue = SUM(Sales[Revenue])
Average Order = AVERAGE(Sales[Revenue])
Transaction Count = COUNTROWS(Sales)
\`\`\`

:::tip
**Measures** calculate in the context of your pivot (filtered by rows/columns/slicers). Calculated Columns are computed once per row when loaded. Use Measures for anything that changes based on filter context.
:::

### Time Intelligence Functions
\`\`\`dax
YTD Revenue = TOTALYTD(SUM(Sales[Revenue]), 'Date'[Date])
MTD Revenue = TOTALMTD(SUM(Sales[Revenue]), 'Date'[Date])
LY Revenue  = CALCULATE(SUM(Sales[Revenue]), SAMEPERIODLASTYEAR('Date'[Date]))
YoY Growth  = DIVIDE([Total Revenue] - [LY Revenue], [LY Revenue], 0)
\`\`\`

### CALCULATE — DAX's Most Powerful Function
\`\`\`dax
Delhi Revenue = CALCULATE(SUM(Sales[Revenue]), Store[City] = "Delhi")
Q1 Revenue    = CALCULATE(SUM(Sales[Revenue]), 'Date'[Quarter] = "Q1")

-- % of All Products:
Product Share = DIVIDE([Total Revenue], CALCULATE([Total Revenue], ALL(Product)))
\`\`\`

:::insight
CALCULATE modifies the **filter context** — it's the key to 90% of advanced DAX calculations. Think of it as "calculate this measure, but with these additional or overriding filters."
:::

:::scenario
You have 5 million rows of retail transactions. Connect Sales, Products, Stores, and a Date table in Power Pivot. Create measures for Total Revenue, YTD Revenue, and Revenue vs. Same Period Last Year. Build a single pivot that shows all three KPIs by month, product category, and region — something impossible with regular pivot tables.
:::
`,

// ─────────────────────────────────────────────────────────────────────────────

18: `# Advanced Lookups & Dynamic Arrays

Excel 365 introduced dynamic arrays, XLOOKUP, and a suite of new functions that replace many complex formula workarounds with elegant, readable solutions.

## XLOOKUP — Full Coverage

\`\`\`excel
=XLOOKUP(lookup, search_array, return_array, [not_found], [match_mode], [search_mode])

-- Exact match (default):
=XLOOKUP(A2, EmpID, Salary)

-- Approximate match (next smaller):
=XLOOKUP(A2, ScoreThresholds, Grades, , -1)

-- Wildcard match:
=XLOOKUP("*"&A2&"*", Names, Emails, "Not found", 2)

-- Return multiple columns at once:
=XLOOKUP(A2, EmpID, Table1[[Name]:[Department]:[Salary]])
   → spills 3 columns of results
\`\`\`

## XMATCH

\`\`\`excel
=XMATCH(lookup, array, [match_mode], [search_mode])

=XMATCH("Priya", A2:A100)          → row number of "Priya"
=XMATCH(A2, ScoreRange, -1)        → approximate match (next smaller)
=XMATCH(A2, SortedArray, 0, -1)    → binary search (faster on sorted data)
\`\`\`

## FILTER — Return Matching Rows

\`\`\`excel
=FILTER(array, include, [if_empty])

=FILTER(A2:C100, B2:B100="Delhi")
   → returns all rows where column B = "Delhi"

=FILTER(A2:C100, (B2:B100="Delhi") * (C2:C100>50000))
   → AND condition (use * for AND, + for OR)

=FILTER(A2:C100, ISNUMBER(SEARCH("Ltd", A2:A100)), "No results")
   → filter by partial text match
\`\`\`

:::insight
FILTER replaces the need for AutoFilter + copy-paste. The result is live — if source data changes, the filtered output updates automatically.
:::

## SORT and SORTBY

\`\`\`excel
=SORT(array, [sort_index], [sort_order], [by_col])

=SORT(A2:C100)                  → sort by first column ascending
=SORT(A2:C100, 2, -1)           → sort by 2nd column descending

=SORTBY(A2:C100, C2:C100, -1, B2:B100, 1)
   → sort by Column C descending, then by Column B ascending
\`\`\`

## UNIQUE

\`\`\`excel
=UNIQUE(A2:A100)                → unique values (removes duplicates)
=UNIQUE(A2:C100, FALSE, TRUE)   → keep only rows that appear exactly once
\`\`\`

## Combining Dynamic Functions

\`\`\`excel
-- Top 5 salespeople by revenue:
=TAKE(SORTBY(Names, Revenue, -1), 5)

-- Unique regions, sorted:
=SORT(UNIQUE(B2:B100))

-- Filtered and sorted in one formula:
=SORT(FILTER(A2:C100, B2:B100="Delhi"), 3, -1)

-- Dynamic dropdown with unique sorted values:
Source for Data Validation: =SORT(UNIQUE(Table1[City]))
\`\`\`

:::scenario
You want a dynamic summary that always shows the top 10 customers by revenue, updated automatically as data changes:
\`\`\`excel
=TAKE(SORTBY(Customer[Name], Customer[Revenue], -1), 10)
\`\`\`
This spills into 10 rows, sorted, always current — no VBA, no manual sorting!
:::

## CHOOSECOLS and CHOOSEROWS

\`\`\`excel
=CHOOSECOLS(A2:E100, 1, 3, 5)   → return only columns 1, 3, 5 from the range
=CHOOSEROWS(A2:E10, 1, 3, 5)    → return only rows 1, 3, 5 from the range
\`\`\`

## VSTACK and HSTACK

\`\`\`excel
=VSTACK(Table1, Table2, Table3)  → stack tables vertically (like Append in Power Query)
=HSTACK(A2:A100, C2:C100)        → combine columns side by side
\`\`\`

:::challenge
Build a formula that returns the name and score of students who scored above 80, sorted from highest to lowest, in a spilled range:
\`\`\`excel
=SORT(FILTER(A2:B100, B2:B100 > 80), 2, -1)
\`\`\`
:::
`,

// ─────────────────────────────────────────────────────────────────────────────

19: `# Dashboard Building

An Excel dashboard brings multiple KPIs, charts, and tables into one screen — allowing decision-makers to see the full picture at a glance.

## Dashboard Design Principles

| Principle | Application |
|-----------|------------|
| **One screen** | All key information visible without scrolling |
| **Hierarchy** | Most important KPIs at top-left (eyes scan top-left first) |
| **Consistency** | Same font, colour palette, and style throughout |
| **White space** | Don't cram everything — breathing room aids readability |
| **Interactivity** | Slicers/dropdowns for the user to explore data |

## Planning Your Dashboard

Before touching Excel:
1. Define the **audience** and **decisions** the dashboard supports
2. List the **KPIs** needed (4–8 is ideal)
3. Sketch a **wireframe** on paper
4. Identify your **data sources**

## Dashboard Structure

\`\`\`
Workbook layout:
  Sheet 1: Dashboard  (user-facing, protected, no gridlines)
  Sheet 2: Data       (raw data table)
  Sheet 3: Calcs      (pivot tables, SUMIFS, intermediate calculations)
  Sheet 4: Config     (targets, parameters, lookup tables)
\`\`\`

**Hide all sheets except Dashboard:** right-click sheet tab → Hide.

## KPI Cards

Build KPI cards using cells with formatting:
\`\`\`
1. Merge a range (e.g. B2:D4) for the card area
2. Set fill: dark background (#1A1F35 or similar)
3. Bold, large number in the centre
4. Small label text above, trend indicator below
5. Conditional format: green if above target, red if below
\`\`\`

## Linking Charts to Slicers

\`\`\`
1. Create Pivot Table from your data
2. Insert → Slicer (for Region, Quarter, Product, etc.)
3. Create charts from the Pivot Table
4. Right-click slicer → Report Connections → link to all pivots
→ Now slicers control all charts simultaneously
\`\`\`

## Dynamic Chart Titles

\`\`\`
1. Write chart title in a cell: ="Revenue by " & IF(Slicer_Region="All","All Regions", SelectedRegion)
2. Click chart title
3. Type = in formula bar → click the title cell
→ Chart title now updates dynamically with slicer selection
\`\`\`

:::tip
Hold **Alt** while moving/resizing charts to snap them to cell gridlines. This creates a perfectly aligned, pixel-perfect dashboard layout.
:::

## Sparklines and Mini-Charts

\`\`\`
Insert → Sparklines → Line
→ Add to a column beside each KPI row for instant trend visibility
\`\`\`

## Dropdown-Driven Dashboards (without PivotTables)

\`\`\`
1. Data Validation dropdown: select Region in cell B1
2. KPI formula: =SUMIFS(Sales, Region, $B$1, Quarter, $C$1)
3. Charts driven by these formulas update when dropdown changes
\`\`\`

:::scenario
You build a monthly sales dashboard for regional managers. Four KPI cards (Total Revenue, Orders, Avg. Order Value, Top Product), one combo chart (Revenue + Growth %), one map chart, and three slicers (Region, Quarter, Category). The entire dashboard refreshes when the data sheet is updated and the analyst clicks "Refresh All."
:::

## Polish and Protection

\`\`\`
View → Show/Hide → uncheck Gridlines, Formula Bar, Headings
                   → for a clean, app-like presentation
File → Format Cells → Protection → Lock/unlock cells
Review → Protect Sheet → prevent accidental edits
\`\`\`

:::insight
Export the entire dashboard as a PDF for distribution: File → Export → Create PDF/XPS. This preserves formatting exactly and prevents recipients from accidentally editing the data.
:::
`,

// ─────────────────────────────────────────────────────────────────────────────

20: `# Scenario & What-If Analysis

What-If Analysis lets you answer "what happens to my result if I change these inputs?" without manually changing values each time.

## Goal Seek — Work Backwards from a Target

Goal Seek answers: "What input value do I need to reach a target result?"

\`\`\`
Data → What-If Analysis → Goal Seek

Example: Your profit formula is =Revenue - Costs
You want profit = ₹10,00,000
Currently: Revenue = B2, Costs = B3, Profit = B4

Set cell: B4 (profit)
To value:  1000000
By changing cell: B2 (revenue)

→ Excel calculates the required revenue automatically
\`\`\`

:::tip
Goal Seek works on a single variable. For multiple variables, use **Solver** (a more powerful add-in under Data → Solver).
:::

## Data Tables — Sensitivity Analysis

Test how changing one or two inputs affects a formula:

### One-Variable Data Table
\`\`\`
1. List input values in a column (e.g., interest rates: 6%, 7%, 8%, 9%)
2. In the cell to the right of and above the input list, enter your formula reference (=B10)
3. Select the range (input list + formula row)
4. Data → What-If Analysis → Data Table
5. Column input cell: B5 (the cell your formula reads)
→ Excel fills in the result for each rate
\`\`\`

### Two-Variable Data Table
\`\`\`
1. Input values for variable 1 in a column
2. Input values for variable 2 in a row
3. Formula reference in the top-left corner
4. Data → What-If Analysis → Data Table
5. Row input cell: variable 2's source cell
6. Column input cell: variable 1's source cell
→ Creates a full sensitivity matrix
\`\`\`

:::scenario
You're doing loan analysis. Create a two-variable data table showing EMI for different combinations of interest rates (6%–12%) and loan tenures (1–5 years). This gives you a full matrix of 42 scenarios at once.
:::

## Scenario Manager — Named Scenarios

Save and compare multiple complete sets of assumptions:

\`\`\`
Data → What-If Analysis → Scenario Manager → Add

Scenario: "Base Case"
  Revenue growth: 10%
  Cost increase:  5%
  Interest rate: 8%

Scenario: "Optimistic"
  Revenue growth: 20%
  Cost increase:  3%
  Interest rate: 7%

Scenario: "Pessimistic"
  Revenue growth: 2%
  Cost increase: 10%
  Interest rate: 10%

→ Summary Report: shows all scenarios side by side with key output cells
\`\`\`

## Solver — Optimisation

Solver finds the optimal value for an objective by changing multiple variables subject to constraints:

\`\`\`
Data → Solver

Objective: maximize B20 (Profit)
By Changing: B5:B8 (product quantities)
Subject to Constraints:
  B5:B8 >= 0         (can't make negative units)
  B5:B8 <= 1000      (production capacity)
  SUMPRODUCT(B5:B8, UnitCost) <= 500000  (budget constraint)
\`\`\`

:::insight
Solver is the Excel equivalent of linear programming. It's used in manufacturing (optimise production mix), finance (optimise portfolio), logistics (minimise shipping costs), and HR (optimise scheduling).
:::

:::challenge
You want to achieve exactly 15% revenue growth next year. Current revenue is in B2. Growth formula is \`=(B3-B2)/B2\`. Use Goal Seek to find the target revenue in B3 that achieves exactly 15% growth.

\`\`\`
Goal Seek: Set B4 (=formula) to 0.15 by changing B3
\`\`\`
:::
`,

// ─────────────────────────────────────────────────────────────────────────────

21: `# External Data Connections

Connect Excel to live data sources — databases, web APIs, SharePoint, and cloud services — to build reports that refresh automatically without manual data entry.

## Connecting to a Database (SQL Server / MySQL)

\`\`\`
Data → Get Data → From Database → From SQL Server Database
  Server:   your-server.database.windows.net
  Database: SalesDB (optional)
  → Enter credentials
  → Choose tables or write a SQL query
  → Load to Table or Data Model
\`\`\`

Once loaded, **Refresh All** re-runs the query and pulls the latest data.

:::tip
Use **Native Database Query** to write custom SQL for maximum control. Power Query's visual interface generates M code, but you can paste your own SQL via Data → Get Data → From Database → Advanced Options.
:::

## Connecting to a Web API (JSON/CSV)

\`\`\`
Data → Get Data → From Web → enter URL

Examples:
  https://api.example.com/sales?year=2024
  https://data.gov.in/api/datasets/...

→ Power Query parses JSON/CSV automatically
→ Expand nested columns as needed
→ Set credentials (API key in headers via Advanced)
\`\`\`

## Connecting to SharePoint / OneDrive

\`\`\`
Data → Get Data → From Online Services → From SharePoint Online List
  Site URL: https://yourcompany.sharepoint.com/sites/Sales
  → Lists all available tables
  → Select the list → Load

OR: open a shared .xlsx from OneDrive/SharePoint
    File → Info → Connections → shows live connections
\`\`\`

## Importing from Other Excel Files

\`\`\`
Data → Get Data → From File → From Workbook
→ Select file → choose sheet or named range
→ This is different from a manual copy-paste — it's a live connection!
\`\`\`

:::scenario
Your finance team maintains a master budget workbook on SharePoint. Your department dashboard pulls numbers from it via a Power Query connection. When they update the budget, you just click Refresh and your dashboard reflects the changes — no emails, no copy-paste, no version confusion.
:::

## Connection Management

\`\`\`
Data → Queries & Connections pane
  → See all queries and connections in the workbook
  → Right-click → Properties:
      □ Refresh every 60 minutes
      □ Refresh data when file is opened
      □ Remove data from range before saving
\`\`\`

## From CSV / Text Files (Recurring)

\`\`\`
Data → Get Data → From File → From CSV
→ Power Query parses and transforms it
→ Save the query — next month, replace the CSV file with the same name
   and just click Refresh
\`\`\`

## Security Considerations

| Risk | Mitigation |
|------|-----------|
| Credentials stored in file | Use Windows Authentication or prompt each time |
| Sensitive data in connection strings | Use named credentials / key vault |
| Automatic refresh of untrusted sources | Disable "Refresh on open" for files from external sources |
| Sharing files with embedded credentials | Use Data → Edit Credentials → remove before sharing |

:::insight
The combination of **Power Query + External Connections** eliminates most manual reporting work. Build the query once, schedule the refresh, and your reports update themselves — daily, weekly, or in real time. This is the closest Excel comes to a live BI dashboard without Power BI.
:::

## Moving to Power BI

When Excel reaches its limits (millions of rows, multiple users, real-time refresh, mobile access), the next step is **Power BI**:
- Same Power Query and DAX skills transfer directly
- Power BI Desktop is free
- Publish to Power BI Service for web sharing
- All your Excel data model work is directly reusable

:::challenge
Set up a Power Query connection to a public CSV (e.g., a government open-data dataset). Apply these transformations: remove blank rows, rename columns, change data types, filter to relevant records, sort. Load to a Table. Then modify the source URL and refresh to see the connection update automatically.
:::
`,

}

export default excelContent
