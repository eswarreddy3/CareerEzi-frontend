// Microsoft Excel — Complete Mastery Guide
// 22 lessons: lesson 1 = About Excel intro, lessons 2–22 = Topics 1–21
// Images: /Excel_images/eimg1.png … eimg22.png

const excelContent: Record<number, string> = {

1: `# About Microsoft Excel

Microsoft Excel is one of the most powerful and widely used software tools in the world. It is a spreadsheet application developed by Microsoft and is part of the Microsoft Office suite. Excel allows you to organize data in rows and columns, perform calculations using formulas, create charts and graphs, analyse large datasets, and build professional reports — all in one place.
Whether you are a student, a business analyst, an accountant, a marketer, or a project manager, Excel is an essential skill that can dramatically improve your productivity and career prospects.

## Why Learn Excel?

- Used in every industry — Finance, HR, Marketing, Operations, Healthcare, Education
- Handles millions of rows of data with speed and precision
- Free to use at a basic level; deeply integrated into corporate workflows
- Foundation for BI tools like Power BI, Tableau, and advanced analytics
- High-demand skill — Excel appears in over 70% of job postings worldwide

## Key Capabilities of Excel

| Capability | What You Can Do | Example Use |
| --- | --- | --- |
| Data Entry | Store numbers, text, dates in cells | Employee attendance sheet |
| Formulas | Auto-calculate values | SUM of monthly expenses |
| Charts | Visual graphs from data | Sales trend line chart |
| Pivot Tables | Summarise large data instantly | Region-wise sales report |
| Power Query | Import and clean data from any source | Clean messy CSV files |
| Macros / VBA | Automate repetitive tasks | Auto-send email reports |
| Power Pivot | Work with millions of rows | Company-wide data model |


## Excel Versions

Excel has evolved significantly over the years. The most common versions you will encounter are:
- Excel 2016 / 2019 — Standard desktop versions, widely used in companies
- Excel 365 (Microsoft 365) — Cloud-connected, gets new features first (like XLOOKUP, dynamic arrays)
- Excel Online — Free browser version with basic features
- Excel for Mac — Similar to Windows but with some differences in shortcuts
Tip: This guide covers Excel 365 features which include all modern functions. If you are on Excel 2016/2019, most functions work the same except a few advanced ones like XLOOKUP and dynamic arrays.`,

2: `# Excel Interface & Basics

Before you start working with data, you need to understand the Excel environment. Think of Excel as a giant notebook where each page (worksheet) has thousands of tiny boxes (cells) arranged in rows and columns. Let's explore every part of this environment.

![Excel interface overview](/Excel_images/eimg1.png)


:::tip
Excel files are saved with the extension .xlsx. Older files use .xls. Always use .xlsx for modern features and compatibility.
:::


## 1.1 Workbook vs Worksheet

**Workbook**
A Workbook is the entire Excel file (e.g., Sales_Report.xlsx). Think of it as a book. One file = one workbook. You can share it, email it, and save it.

**Worksheet (Sheet)**
A Worksheet is one page inside the workbook. Think of it as a single chapter in the book. One workbook can contain many worksheets. You can see them as tabs at the bottom of the screen (Sheet1, Sheet2, Sheet3…).

| Feature | Workbook | Worksheet |
| --- | --- | --- |
| What it is | The entire Excel file (.xlsx) | Single grid page inside the file |
| Max sheets | Limited by memory | 1,048,576 rows × 16,384 cols each |
| Analogy | A book | A page in that book |

:::scenario
**Example: Workbook vs Worksheet**
`Company_Finance_2024.xlsx` is the Workbook. Inside it you might have worksheets: Jan_Sales, Feb_Sales, Expenses, Summary. Each worksheet holds its own data but can reference data from other sheets.
:::

## 1.2 Rows, Columns, and Cells

Excel's grid is made of rows (horizontal), columns (vertical), and cells (the intersection).

| Part | Direction | Label | Example |
| --- | --- | --- | --- |
| Column | Vertical (up↕down) | Letters: A, B, C … XFD | Column A, Column Z |
| Row | Horizontal (left↕right) | Numbers: 1, 2, 3 … 1,048,576 | Row 1, Row 100 |
| Cell | Single box (intersection) | Column + Row = Address | A1, B5, C10, Z99 |

Cell Reference
Tip: Excel has 16,384 columns (A to XFD) and 1,048,576 rows per worksheet. That's over 17 BILLION cells in a single sheet!Tip: Excel has 16,384 columns (A to XFD) and 1,048,576 rows per worksheet. That's over 17 BILLION cells in a single sheet!1.3 The Ribbon, Tabs, and Quick Access Toolbar1.3 The Ribbon, Tabs, and Quick Access Toolbar

![Rows, columns and cells in Excel](/Excel_images/eimg2.png)

The Ribbon is the toolbar at the top of Excel. It is organised into Tabs, each containing groups of related commands.

| Tab | What It Contains |
| --- | --- |
| Home | Most-used: font, alignment, number format, copy/paste, styles |
| Insert | Charts, tables, pivot tables, pictures, shapes |
| Page Layout | Print settings, margins, orientation, themes |

| Formulas | Function library, name manager, formula auditing |
| --- | --- |
| Data | Sort, filter, data validation, import, power query |
| Review | Spell check, comments, protect sheet/workbook |
| View | Freeze panes, zoom, window arrangement |


:::tip
Press Ctrl+F1 to show/hide the Ribbon. Press Alt to see keyboard shortcuts for every Ribbon button.
:::

The Quick Access Toolbar (QAT) is a small bar at the very top left of Excel. It always shows a few icons you can click quickly — by default: Save (Ctrl+S), Undo (Ctrl+Z), Redo (Ctrl+Y). You can add your own favourite buttons to it by right-clicking any command and selecting Add to Quick Access Toolbar.

## 1.4 Saving, Renaming, and Formatting Sheets


## Saving Your Workbook

- Ctrl + S — Save the file (quick save)
- F12 — Save As (choose location and format)
- .xlsx — Standard Excel format (use this always)
- .csv — Plain text format (no formatting, just data — for sharing with other tools)
- Auto-save — Turn on in Excel 365 to save automatically to OneDrive every few seconds

## Renaming a Sheet

Double-click any sheet tab at the bottom (e.g., Sheet1). Type the new name and press Enter. Good names:
Jan_Sales, Employee_Data, Summary.

## Formatting Sheets (Tab Colour)

Right-click a sheet tab -> Tab Color -> pick a colour. This helps you visually organise: green for income sheets, red for expenses, blue for summaries.`,

3: `# Basic Formatting

Formatting makes your data look professional and easy to read. Excel formatting does NOT change the underlying data — it only changes how the data LOOKS.

## 2.1 Bold, Italic, Borders, and Colors

| Formatting | Shortcut / Location | When to Use |
| --- | --- | --- |
| Bold | Ctrl + B / Home -> Bold (B) | Column headers, totals, important values |
| Italic | Ctrl + I / Home -> Italic (I) | Notes, labels, secondary info |
| Underline | Ctrl + U / Home -> Underline | Section titles |
| Font Color | Home -> Font Color (A with color bar) | Highlight specific values |
| Fill Color | Home -> Fill Color (paint bucket icon) | Color rows/columns for readability |
| Borders | Home -> Borders (box icon) | Create table-like grid lines |

:::scenario
**Example: Making a Header Row Stand Out**
1. Click row 1 header (the number '1') to select the entire row.
2. Press Ctrl + B to bold all text in row 1.
3. Click Fill Color → choose Dark Green (#217346).
4. Click Font Color → choose White.

Your header now looks like a professional table.
:::

## 2.2 Cell Formatting — Currency, Date, Percent
When you type a number like 1234.5, Excel stores it as a plain number. You can format it to display as $1,234.50 or 123,450% without changing the actual stored value.

**Format Cells Shortcut:** `Ctrl + 1` (or right-click cell → Format Cells) — Opens the Format Cells dialog box where you can set Number, Alignment, Font, Border, Fill.

| Format Type | Example Input | Displayed As | How to Apply |
| --- | --- | --- | --- |
| General (default) | 1234.5 | No formatting applied | Default |
| Number | 1234.567 | 1,234.57 | Home -> Number Format -> Number |
| Currency | 5000 | $5,000.00 | Home -> $ symbol dropdown -> More formats |
| Percentage | 0.75 | 75% | Home -> % button (or Ctrl+Shift+%) |
| Date | 44927 | 27-Jan-2023 | Home -> Number -> Date |
| Time | 0.5 | 12:00 PM | Home -> Number -> Time |

| Format Type | Example Input | Displayed As | How to Apply |
| --- | --- | --- | --- |
| Text | 001234 | 001234 (keeps leading zeros) | Home -> Number -> Text |
| Custom | Any format you define | As per user wish | Ctrl+1 → Custom |


![Number formatting options](/Excel_images/eimg3.png)


## 2.3  Custom Number Formats

| Purpose | Custom Format Code | Result Example |
| --- | --- | --- |
| Indian currency | "₹"#,##0.00 | ₹1,23,456.00 |
| Show thousands as K | #,##0,"K" | 45000 → 45K |
| Percentage 2 decimals | 0.00% | 0.256 → 25.60% |
| Date long format | DD-MMM-YYYY | 44927 → 01-Jan-2023 |
| Positive/Negative colour | #,##0;[Red]-#,##0 | Pos = black, Neg = red |
| Show zero as dash | #,##0;-#,##0;"-" | 0 shows as - |


## 2.4  Alignment & Cell Properties

| Feature | Location | Use Case |
| --- | --- | --- |
| Wrap Text | Home → Alignment → Wrap Text | Long text in cells — shows all content |
| Horizontal Align | Home → Alignment (left/centre/right) | Numbers right-aligned, text left-aligned |
| Indent | Home → Indent buttons | Sub-items in a list |
| Row Height | Right-click row number → Row Height | Make rows taller for readability |
| Column Width | Double-click column border | AutoFit to content width |
| Freeze Top Row | View → Freeze Panes → Freeze Top Row | Keep headers visible while scrolling |


## 2.5 Wrap Text and Merge Cells


## Wrap Text

When your text is too long to fit in a cell, it either overflows into the next cell or gets cut off. Wrap Text makes the cell taller so all text is visible. Select the cell -> Home -> Wrap Text (or Alt + H + W).

## Merge Cells

Merge & Center combines two or more cells into one big cell and centers the content. It is commonly used for report titles that span multiple columns.
Note: Be careful with merged cells in data ranges — they can break sorting, filtering, and formulas. Use Merge & Center only for titles/headers, not inside data tables.

## 2.6 AutoFill and Flash Fill

## AutoFill

AutoFill automatically continues a pattern. Type a value, then drag the small green square (called the Fill Handle) at the bottom-right corner of the cell.

| You Type In Cells | AutoFill Continues |
| --- | --- |
| 1, 2 | 3, 4, 5, 6, 7… |
| Monday | Tuesday, Wednesday, Thursday… |
| Jan | Feb, Mar, Apr… |
| Q1 | Q2, Q3, Q4 |
| Jan-2024 | Feb-2024, Mar-2024… |


## Flash Fill (Ctrl + E)

Flash Fill is like magic — Excel detects a pattern from your example and fills the rest automatically.
:::scenario
**Example: Flash Fill**
- Column A (Full Name): Alice Johnson, Bob Smith, Carol White
- Column B (First Name): Type `Alice` in B1, then press Ctrl+E.
- Result: Excel automatically fills B2 = Bob, B3 = Carol.

Also works for: extracting email domains, reformatting phone numbers, combining text.
:::`,

4: `# Basic Data Entry

Entering data correctly into Excel is the foundation of everything. Excel treats numbers, text, and dates differently — understanding this prevents errors.

## 3.1 Entering Numbers and Text

| Data Type | What Excel Does | Tips |
| --- | --- | --- |
| Number | Aligns right, can be used in calculations | Do not add extra spaces or commas |
| Text | Aligns left, cannot be calculated | Starts with a letter or apostrophe mark |
| Date | Stored as a serial number, displayed as date | Type: 27-Jan-2024 or 27/01/2024 |
| Formula | Starts with = sign | =A1+B1 adds values in A1 and B1 |
| Boolean | TRUE or FALSE | Used in logical checks |

Tip: To enter a number AS text (e.g., product code '001'), type an apostrophe first: '001. Excel stores it astext and will not strip the leading zeros.3.2 Data Validation — Restricting Values
Data Validation ensures that only the right kind of data gets entered into a cell. For example, you can restrict a cell to accept only numbers between 1 and 100, or only dates after today.

## How to Apply Data Validation

- Select the cell or range where you want to restrict input
- Go to Data tab -> Data Validation
- In the Settings tab, choose the validation rule
- Optionally set an Input Message (shown when the cell is clicked)
- Set an Error Alert (message shown when wrong data is entered)

![Data validation setup](/Excel_images/eimg4.png)


![Data validation in action](/Excel_images/eimg5.png)

| Validation Type | Example Setting | Use Case |
| --- | --- | --- |
| Whole Number | Between 1 and 100 | Employee age, quantity |
| Decimal | Greater than 0 | Price, discount rate |
| List | =A1:A5 or type items separated by comma | Department names, status |
| Date | Between 01/01/2024 and 31/12/2024 | Project timelines |
| Text Length | Less than or equal to 10 | Short codes, IDs |
| Custom | =LEN(A1)<=10 (formula-based) | Complex business rules |


## 3.3 Drop-Down Lists

A drop-down list lets the user select from predefined options instead of typing, which reduces errors and speeds up data entry.

## Creating a Drop-Down List

- Select the cell where you want the drop-down (e.g., B2)
- Go to Data -> Data Validation
- Under Allow, choose List
- In Source: type your options separated by commas: HR,IT,Finance,Marketing,Operations
- Or reference a range: =E1:E5 (where E1:E5 contains your list)
- Click OK — a drop-down arrow appears in the cell
:::scenario
**Example: Department Drop-Down List**
Cell B2 has a drop-down with: HR, IT, Finance, Marketing. When you click B2, an arrow appears. Click it to pick a department. If someone tries to type something else, Excel shows: 'The value you entered is not valid'.
:::

## 3.4  AutoFill & Flash Fill

AutoFill
Drag the small green square at the bottom-right of a selected cell to extend a series — Excel recognises patterns like dates, months, numbers, weekdays automatically.
Flash Fill (Ctrl+E)
Type the first example in a column next to your data. Press Ctrl+E and Excel detects the pattern and fills the rest of the column. Perfect for splitting names, extracting emails, reformatting codes.

| Flash Fill Scenario | Input Column | Type in Next Column | Flash Fill Produces |
| --- | --- | --- | --- |
| Split first name | "Ravi Kumar" | "Ravi" | Fills: Priya, Arjun, Sneha... |
| Extract email domain | "ravi@fynity.com" | "fynity.com" | Extracts all domains |
| Format phone number | "9876543210" | "98765-43210" | Formats all numbers |
`,

5: `# Basic Formulas & Functions

Formulas are the heart of Excel. A formula tells Excel to perform a calculation. Every formula begins with the
= (equals) sign. A Function is a pre-built formula that Excel provides (like SUM, AVERAGE, MAX).

![Basic formulas overview](/Excel_images/eimg6.png)


## 4.1 Arithmetic Operations

| Operation | Symbol | Example Formula | Result |
| --- | --- | --- | --- |
| Addition | + | =10 + 5 | 15 |
| Subtraction | - | =10 - 3 | 7 |
| Multiplication | * | =4 * 6 | 24 |
| Division | / | =20 / 4 | 5 |
| Exponent (Power) | ^ | =2 ^ 3 | 8 (2³) |
| Modulo (Remainder) | MOD() | =MOD(10, 3) | 1 |
| Using Cell References | All | =A1 + B1 - C1 | Sum of cells |

:::scenario
**Example: Sales Calculation with Formulas**
- A1: Price per unit = 250 | B1: Quantity = 40 | C1: Discount = 10%
- `=A1*B1` → 10000 (Gross Sales)
- `=D1*(1-C1)` → 9000 (After Discount)
- `=E1*0.18` → 1620 (18% GST)
:::

## 4.2 Essential Functions: SUM, AVERAGE, MAX, MIN, COUNT
### SUM
Syntax: `=SUM(number1, number2, …)` or `=SUM(A1:A10)`
Adds all numbers in the given range. The most used function in Excel.
`=SUM(B2:B13)` → Adds all monthly sales values from B2 to B13

### AVERAGE
Syntax: `=AVERAGE(number1, number2, …)` or `=AVERAGE(A1:A10)`
Calculates the arithmetic mean (sum ÷ count) of the values in the range.
`=AVERAGE(C2:C13)` → Finds average monthly expenses

### MAX
Syntax: `=MAX(number1, number2, …)` or `=MAX(A1:A10)`
Returns the largest (highest) value in the range.
`=MAX(D2:D13)` → Finds the highest sales month

### MIN
Syntax: `=MIN(number1, number2, …)` or `=MIN(A1:A10)`
Returns the smallest (lowest) value in the range.
`=MIN(D2:D13)` → Finds the lowest sales month

### COUNT
Syntax: `=COUNT(value1, value2, …)` or `=COUNT(A1:A10)`
Counts the number of cells that contain numbers. Ignores text and blank cells.
`=COUNT(B2:B13)` → Counts how many months have sales data entered

### COUNTA
Syntax: `=COUNTA(value1, …)`
Counts cells that are NOT empty — including text, numbers, and formulas.
`=COUNTA(A2:A100)` → Counts how many rows have any data (names, IDs, etc.)

## 4.3 Absolute & Relative References

This is one of the MOST IMPORTANT concepts in Excel. When you copy a formula to another cell, Excel adjusts the cell references automatically. Understanding absolute vs relative references gives you complete control over this behaviour.

| Reference Type | Syntax | Behaviour When Copied | When to Use |
| --- | --- | --- | --- |
| Relative | A1 | Both row and column change | Most calculations |
| Absolute Column | $A1 | Column stays fixed, row changes | Fixed column, variable row |
| Absolute Row | A$1 | Row stays fixed, column changes | Fixed row, variable column |
| Fully Absolute | $A$1 | Both row and column stay fixed | Tax rates, constants |

:::scenario
**Example: Tax Calculation with Absolute Reference**
- Setup: B1 = Tax Rate (18%) | A4:A10 = Item prices
- Formula in B4: `=A4*$B$1`
- When you copy B4 down to B5, B6… the formula becomes `=A5*$B$1`, `=A6*$B$1`
- A4 changes (relative) but $B$1 stays fixed (absolute) — always pointing to the tax rate.
:::
Tip: Press F4 after typing a cell reference to cycle through: A1 -> $A$1 -> A$1 -> $A1 -> A1

## 4.4  Error Messages

| Error | Meaning | Common Fix |
| --- | --- | --- |
| #DIV/0! | Division by zero | =IFERROR(A1/B1, 0) or check B1 is not empty |
| #VALUE! | Wrong data type | Check all cells contain numbers, not text |
| #REF! | Invalid reference | A row/column used in the formula was deleted — re-enter |
| #NAME? | Unrecognised name | Misspelled function name — check spelling |
| #N/A | Value not found | Use IFERROR to handle: =IFERROR(VLOOKUP(...), "Not Found") |
| ###### | Column too narrow | Double-click the column border to auto-fit width |
`,

6: `# Basic Data Handling

Once you have data in Excel, you need to organise and analyse it. Sorting, filtering, and removing duplicates are the three foundational data handling skills.

## 5.1 Sorting Data

Sorting rearranges your data rows in a specific order based on one or more columns.

| Sort Type | How To | Notes |
| --- | --- | --- |
| Quick sort A→Z | Click a cell in column → Home → Sort A-Z | Sorts entire table by that column |
| Quick sort Z→A | Click a cell in column → Home → Sort Z-A | Descending order |
| Multi-level sort | Data → Sort → Add Level | Sort by Department, then by Salary within each dept |
| Sort by colour | Data → Sort → Sort On: Cell Color | Useful after manual highlighting |
| Sort by custom list | Data → Sort → Order: Custom List | Sort by Mon, Tue, Wed instead of alphabetically |


## Simple Sort (A->Z or Z->A)

- Click any cell inside your data table
- Go to Data tab -> click A->Z (ascending) or Z->A (descending)
- Excel automatically detects your table and sorts it
- Works for text (A->Z), numbers (smallest to largest), and dates (oldest to newest)

![Sort and filter in Excel](/Excel_images/eimg8.png)


## Multi-Level Sort (Sort by multiple columns)

- Go to Data -> Sort (opens the Sort dialog box)
- Add levels: Sort by Department (A->Z), Then by Salary (largest to smallest)
- Excel sorts by the first criterion, then within ties, sorts by the second criterion
:::scenario
**Example: Multi-Level Sort**
- Goal: Sort by Department (A→Z), then within each department by Salary (highest first)
- Level 1: Column = Department, Order = A to Z
- Level 2: Column = Salary, Order = Largest to Smallest
- Result: Finance employees listed first by highest salary, then HR, then IT, etc.
:::

## 5.2 Filtering Data
Filtering hides rows that don't match your criteria — the data is not deleted, just hidden. This lets you focus on specific subsets of your data.

## Apply AutoFilter

- Click inside your data -> Data -> Filter (or Ctrl + Shift + L)
- Drop-down arrows appear on each column header
- Click a drop-down arrow -> check/uncheck values to show only those rows
- Apply filters to multiple columns simultaneously
- Remove filter: Data -> Filter again, or click Clear in the Sort & Filter group

| Filter Type | How to Use | Example |
| --- | --- | --- |
| Value Filter | Check/uncheck specific values | Show only "IT" and "Finance" departments |
| Number Filter | Greater than, less than, between | Salaries > 50,000 |
| Text Filter | Contains, begins with, ends with | Names containing "Kumar" |
| Date Filter | Today, this week, last month | Orders placed this month |
| Color Filter | Filter by cell or font color | Show only red-highlighted rows |


## 5.3  Excel Tables (Ctrl+T)

Excel Table
A formally defined range that has automatic filters, auto-expands when you add data, supports structured references, and works powerfully with Power Query and Pivot Tables.

| Table Feature | Benefit |
| --- | --- |
| Auto-expands | Add a row below the table — it automatically becomes part of the table |
| Structured references | =SalesTable[Revenue] instead of =C2:C100 — formulas are self-documenting |
| Built-in filter | Headers automatically have filter dropdowns |
| Calculated columns | Enter one formula — it fills the entire column automatically |
| Total Row | Toggle Total Row (Table Design tab) for instant sum/average/count at bottom |


## 5.4 Remove Duplicates

Duplicate rows are a common data quality problem. Excel has a built-in tool to find and remove them instantly.
- Click anywhere inside your data table
- Go to Data tab -> Remove Duplicates
- A dialog box appears — choose which columns to check for duplicates
- If you check ALL columns, only rows where EVERY column matches are removed
- If you check just one column (e.g., Email), rows with duplicate emails are removed
- Click OK — Excel tells you how many duplicates were found and removed
Note: Always make a backup copy before removing duplicates. The action cannot be undone after saving the file.`,

7: `# Basic Charts

Charts transform numbers into visual stories. A well-designed chart communicates insights instantly that would take minutes to read from a table.
![Chart types overview](/Excel_images/eimg9.png)


## 6.1  Chart Types

| Chart Type | Best For | When NOT to Use |
| --- | --- | --- |
| Column Chart | Comparing values across categories | When categories have long text labels (use Bar instead) |
| Bar Chart | Same as Column but horizontal | For time-series data (use Line) |
| Line Chart | Trends over time | For data with no time dimension |
| Pie/Donut Chart | Part-to-whole (percentages of a total) | When you have more than 5-6 slices |
| Scatter Plot (XY) | Relationship between two numeric variables | For categorical data |
| Area Chart | Volume trends over time | When comparing individual values matters more |


## 6.2  Creating a Chart

| Step | Action |
| --- | --- |
| 1. Select data | Click any cell in your data table, or select a specific range |
| 2. Insert chart | Insert → Charts → choose type, or use Recommended Charts |
| 3. Add title | Click on 'Chart Title' text and type a descriptive title |
| 4. Add axis labels | Chart Design → Add Chart Element → Axis Titles |
| 5. Format series | Right-click on bars/lines → Format Data Series → change colour, width |
| 6. Resize & position | Drag chart handles to resize; drag chart body to move |

## 6.3 Column Chart

A Column Chart shows data in vertical bars. It is the most common chart type and is ideal for comparing values across categories (e.g., sales by month, scores by student).


## How to Create

- Select your data (e.g., A1:B7 with months in A and sales in B)
- Go to Insert -> Charts -> Clustered Column
- The chart appears on the sheet — drag to resize and position it
- Click the chart title to rename it (e.g., 'Monthly Sales 2024')

![Column chart example](/Excel_images/eimg10.png)


## 6.4 Bar Chart

A Bar Chart is the same as a column chart but with horizontal bars. Use it when your category labels are long (they fit better on the left side) or when comparing rankings.

## 6.5 Pie Chart

A Pie Chart shows how parts make up a whole — perfect for showing percentage shares (market share, expense breakdown, etc.). Works best with 5 or fewer categories.
Note: Avoid pie charts with too many slices — use a bar chart instead when you have more than 6 categories.
Image 116.4 Line Chart6.4 Line Chart
A Line Chart shows trends over time — connect the dots to show how a value changes (stock prices, temperature, revenue growth). The X-axis is usually time (months, years).

![Line chart example](/Excel_images/eimg12.png)


## Chart Customisation Tips

| What You Want to Change | How to Do It |
| --- | --- |
| Chart Title | Double-click the title text and type a new name |
| Colors | Click a bar/line -> Format Data Series -> Fill & Line |
| Add Data Labels | Right-click a bar -> Add Data Labels (shows values on bars) |
| Change Chart Type | Right-click chart -> Change Chart Type -> pick new type |
| Add a Legend | Chart Design tab -> Add Chart Element -> Legend |
| Move to New Sheet | Right-click chart -> Move Chart -> New Sheet |
`,

8: `# Text Functions

Text functions help you manipulate, clean, and extract parts of text strings. They are essential for data cleaning — especially when you import data from other systems where text is messy, inconsistent, or combined in the wrong way.

| Cell | Value | What We Want to Extract |
| --- | --- | --- |
| A1 | "Alice Johnson" | First name: Alice / Last name: Johnson |
| A2 | " HR Manager " | Clean text: HR Manager (remove spaces) |
| A3 | "alice.johnson@company.com" | Username: alice.johnson / Domain: company.com |
| A4 | "EMP-2024-001" | ID number: 001 |
| A5 | "hello world" | Proper case: Hello World |

### LEFT
Syntax: `=LEFT(text, num_chars)` — Extracts the leftmost N characters.
- `=LEFT("Alice Johnson", 5)` → Alice
- `=LEFT(A1, 3)` where A1="EMP-2024" → EMP

### RIGHT
Syntax: `=RIGHT(text, num_chars)` — Extracts the rightmost N characters.
- `=RIGHT("EMP-2024-001", 3)` → 001
- `=RIGHT(A3, 11)` where A3="company.com" → company.com

### MID
Syntax: `=MID(text, start_num, num_chars)` — Extracts characters from the middle. start_num = where to start (1 = first character).
- `=MID("EMP-2024-001", 5, 4)` → 2024 (start at position 5, take 4 characters)

### LEN
Syntax: `=LEN(text)` — Returns the number of characters (including spaces).
- `=LEN("Hello World")` → 11 (5 + 1 space + 5)
- `=LEN(A1)` → useful to check if data meets length requirements

### TRIM
Syntax: `=TRIM(text)` — Removes leading, trailing, and double spaces. Keeps single spaces between words.
- `=TRIM(" HR Manager ")` → HR Manager
- Extremely useful after importing data from databases or CSV files.

### UPPER
Syntax: `=UPPER(text)` — Converts all text to uppercase.
- `=UPPER("alice johnson")` → ALICE JOHNSON

### LOWER
Syntax: `=LOWER(text)` — Converts all text to lowercase.
- `=LOWER("ALICE JOHNSON")` → alice johnson

### PROPER
Syntax: `=PROPER(text)` — Capitalises the first letter of each word.
- `=PROPER("ALICE johnson")` → Alice Johnson
- Great for fixing name data entered with inconsistent capitalisation.

### CONCAT
Syntax: `=CONCAT(text1, text2, …)` — Joins multiple text strings together. Modern replacement for & and CONCATENATE.
- `=CONCAT(A1, " ", B1)` where A1="Alice", B1="Johnson" → Alice Johnson

### TEXTJOIN
Syntax: `=TEXTJOIN(delimiter, ignore_empty, text1, text2, …)` — Joins values with a separator; ignore_empty=TRUE skips blank cells.
- `=TEXTJOIN(", ", TRUE, A1:A5)` → Alice, Bob, Carol, Dave, Eve

### FIND
Syntax: `=FIND(find_text, within_text, [start_num])` — Finds position of a character. Case-sensitive.
- `=FIND("@", "alice@company.com")` → 6 (@ is at position 6)
- Combine with LEFT/MID to extract parts around a specific character.

### SEARCH
Syntax: `=SEARCH(find_text, within_text, [start_num])` — Same as FIND but case-insensitive. Supports wildcards (* and ?).
- `=SEARCH("manager", "HR Manager")` → 4 (found at position 4, case-insensitive)

### CLEAN
Syntax: `=CLEAN(text)` — Removes non-printable characters. Use with TRIM for thorough cleaning.
- `=CLEAN(TRIM(A1))` → Removes invisible characters AND extra spaces in one step`,

9: `# Logical Functions

Logical functions make decisions based on conditions. They are the 'if this then that' of Excel — essential for categorising data, flagging issues, and making smart calculations.

## 8.1 IF Function

![IF function example](/Excel_images/eimg13.png)
Syntax: `=IF(logical_test, value_if_true, value_if_false)`
- `logical_test` — any expression that evaluates to TRUE or FALSE (e.g., A1>50)
- `value_if_true` — what to return when the test is TRUE
- `value_if_false` — what to return when the test is FALSE

| Scenario | Formula | Result if TRUE | Result if FALSE |
| --- | --- | --- | --- |
| Pass/Fail (marks>50) | =IF(B2>50, "Pass", "Fail") | Pass | Fail |
| Bonus eligible | =IF(C2>=100000, "Bonus", "NoBonus") | Bonus | No Bonus |
| Late payment | =IF(D2>30, "Late", "On Time") | Late | On Time |
| Stock alert | =IF(E2<10, "Reorder", "OK") | Reorder | OK |


## 8.2 Nested IF (Multiple Conditions)

You can put one IF inside another IF to handle multiple conditions — like a decision tree.
Syntax: `=IF(test1, result1, IF(test2, result2, IF(test3, result3, default)))`
Each IF is evaluated in order. The first TRUE condition's result is returned.

:::scenario
**Example: Grade Calculation with Nested IF**
`=IF(B2>=90, "A+", IF(B2>=80, "A", IF(B2>=70, "B", IF(B2>=60, "C", "Fail"))))`
If marks=85 → First test (>=90) is FALSE → Second test (>=80) is TRUE → Returns A
:::

Note: IFS function (Topic 8.8) is cleaner than Nested IF for multiple conditions.

## 8.3 AND Function
Syntax: `=AND(condition1, condition2, condition3, …)`
Returns TRUE only if ALL conditions are TRUE. Returns FALSE if even one is FALSE.

`=AND(B2>50, C2="Present", D2="Submitted")` → TRUE only if marks > 50 AND attendance is Present AND assignment is Submitted.

Use inside IF: `=IF(AND(B2>50, C2>80), "Eligible", "Not Eligible")`

## 8.4 OR Function
Syntax: `=OR(condition1, condition2, condition3, …)`
Returns TRUE if AT LEAST ONE condition is TRUE. Returns FALSE only if ALL are FALSE.

`=IF(OR(A2="Manager", A2="Director", A2="VP"), "Senior", "Junior")` → Returns 'Senior' if the person is a Manager OR Director OR VP.

## 8.5 NOT Function
Syntax: `=NOT(logical)` — Reverses the logical value. NOT(TRUE) = FALSE, NOT(FALSE) = TRUE.

`=IF(NOT(ISBLANK(A2)), "Has Data", "Empty")` → Returns 'Has Data' if A2 is NOT blank.

## 8.6 IFERROR Function
Syntax: `=IFERROR(value, value_if_error)`
If the formula produces an error (like #N/A, #DIV/0!, #VALUE!), returns the fallback value instead.
- `=IFERROR(VLOOKUP(A2, D:F, 2, FALSE), "Not Found")` → shows 'Not Found' instead of #N/A
- `=IFERROR(B2/C2, 0)` → returns 0 instead of #DIV/0! when C2=0

## 8.7 XOR Function
Syntax: `=XOR(condition1, condition2, …)`
Returns TRUE if an ODD number of conditions are TRUE (exclusive OR). Returns FALSE if an even number of conditions are TRUE or all are FALSE.

## 8.8 IFS Function (Modern alternative to Nested IF)
Syntax: `=IFS(condition1, result1, condition2, result2, condition3, result3, …)`
Tests multiple conditions in order and returns the result of the first TRUE condition. Much cleaner than nested IFs.

`=IFS(B2>=90, "A+", B2>=80, "A", B2>=70, "B", B2>=60, "C", TRUE, "Fail")`
The last `TRUE` acts as the 'else' — catches everything that didn't match above.

## 8.9 SWITCH Function
Syntax: `=SWITCH(expression, value1, result1, value2, result2, …, [default])`
Matches an expression against a list of values and returns the corresponding result.

:::scenario
**Example: SWITCH for Day Name**
`=SWITCH(WEEKDAY(A2), 1, "Sunday", 2, "Monday", 3, "Tuesday", 4, "Wednesday", 5, "Thursday", 6, "Friday", 7, "Saturday", "Unknown")`
:::
Syntax: `=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])`
- `lookup_value` — The value you are searching for (e.g., employee ID)
- `table_array` — The table range to search in (e.g., A:D or $A$2:$D$100)
- `col_index_num` — Which column to return (1=first col, 2=second col…)
- `range_lookup` — FALSE = exact match (use this always for IDs/names), TRUE = approximate`,

10: `# Lookup Functions

Lookup functions find and retrieve data from tables. They are the backbone of data analysis — imagine having two tables and wanting to automatically pull information from one into the other. That's what lookup functions do.

## 9.1 VLOOKUP — Vertical Lookup

![VLOOKUP function example](/Excel_images/eimg14.png)

| EmpID | Name | Department | Salary |
| --- | --- | --- | --- |
| E001 | Alice | HR | 45,000 |
| E002 | Bob | IT | 60,000 |
| E003 | Carol | Finance | 52,000 |
| E004 | Dave | IT | 58,000 |

Syntax: `=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])`
- `lookup_value` — The value to search for (e.g., employee ID)
- `table_array` — The table range (e.g., A:D or $A$2:$D$100)
- `col_index_num` — Which column to return (1=first col, 2=second col…)
- `range_lookup` — FALSE = exact match (use this always)

:::scenario
**Example: VLOOKUP on the table above**
- `=VLOOKUP("E002", A1:D5, 2, FALSE)` → Bob (column 2 = Name)
- `=VLOOKUP("E003", A1:D5, 3, FALSE)` → Finance (column 3 = Dept)
- `=VLOOKUP("E004", A1:D5, 4, FALSE)` → 58,000 (column 4 = Salary)
:::

**Common Error:** #N/A means the lookup value was not found in the first column.
**Note:** VLOOKUP can only look RIGHT — the lookup column must be the LEFTMOST column. For looking left, use INDEX+MATCH or XLOOKUP.

## 9.2 HLOOKUP — Horizontal Lookup
Syntax: `=HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])`
Same as VLOOKUP but searches horizontally (across rows instead of columns). Use when your data is arranged in rows instead of columns. Less common than VLOOKUP.

## 9.3 XLOOKUP — The Modern, Best Lookup Function

Syntax: `=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])`
- `lookup_array` — Can be any column (not restricted to first!)
- `if_not_found` — Optional: what to show if not found (e.g., 'Not Found')
- `match_mode` — 0=exact, -1=next smaller, 1=next larger, 2=wildcard
- `search_mode` — 1=first to last, -1=last to first (reverse search)

:::scenario
**Example: XLOOKUP**
- `=XLOOKUP("E002", A2:A5, D2:D5, "Not Found")` → ₹ 60,000
- `=XLOOKUP("E003", A2:A5, B2:D5)` → Returns entire row (Carol, Finance, ₹ 52,000)
- `=XLOOKUP("IT", C2:C5, B2:B5, "None", 0, -1)` → Finds LAST person in IT (reverse search)
:::

| Feature | VLOOKUP | XLOOKUP |
| --- | --- | --- |
| Direction | Left to right only | Any direction |
| Lookup column | Must be first column | Any column |
| Error handling | Need IFERROR wrapper | Built-in if_not_found argument |
| Multiple results | Returns one column | Can return entire row/multiple columns |
| Speed | Slower on large data | Faster |
| Availability | All Excel versions | Excel 365 and Excel 2021+ |


## 9.4 INDEX and MATCH — The Power Combination

**INDEX Function**
Syntax: `=INDEX(array, row_num, [col_num])` — Returns the value at a specific position in a range.
`=INDEX(A1:D10, 3, 2)` → Returns the value in row 3, column 2

**MATCH Function**
Syntax: `=MATCH(lookup_value, lookup_array, [match_type])` — Returns the POSITION of a value within a range. Use match_type=0 for exact match.
`=MATCH("E002", A1:A10, 0)` → Returns 2 (E002 is in position 2)

**INDEX + MATCH Combined**
Syntax: `=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))`
MATCH finds the row number; INDEX uses it to return the value. More flexible than VLOOKUP — can look in any direction.

:::scenario
**Example: INDEX+MATCH — Find salary for 'E003'**
`=INDEX(D2:D5, MATCH("E003", A2:A5, 0))` → ₹ 52,000
MATCH finds E003 at position 3; INDEX returns D2:D5[3].

**Advanced — Two-way lookup:**
`=INDEX(B2:D5, MATCH("E003",A2:A5,0), MATCH("Salary",B1:D1,0))`
Finds the intersection of row E003 and column Salary.
:::

## 9.5 LOOKUP Function
Syntax: `=LOOKUP(lookup_value, lookup_vector, [result_vector])`
An older, simpler lookup function. Searches a single row or column. Assumes data is sorted in ascending order. Use XLOOKUP instead for new work.`,

11: `# Date & Time Functions

Excel stores dates as serial numbers (e.g., January 1, 2024 = 45292) and times as decimal fractions. This means you can do arithmetic with dates — add days, find differences, etc.

| Function | Syntax | Returns | Example |
| --- | --- | --- | --- |
| TODAY | =TODAY() | Todays date (updates automatically) | =TODAY() -> 27-Mar-2026 |
| NOW | =NOW() | Current date and time | =NOW() -> 27-Mar-2026 14:30 |
| DAY | =DAY(date) | Day number (1-31) | =DAY("27-Mar-2026") -> 27 |
| MONTH | =MONTH(date) | Month number (1-12) | =MONTH("27-Mar-2026") -> 3 |
| YEAR | =YEAR(date) | Year (4-digit) | =YEAR("27-Mar-2026")-> 2026 |
| WEEKDAY | =WEEKDAY(date, [return_type]) | Day of week (1-7) | =WEEKDAY(TODAY(),2) -> 5 (Friday) |
| DATEDIF | =DATEDIF(start, end, unit) | Difference in days/months/years | =DATEDIF(A1, TODAY(), "Y") -> Age inyears |
| EDATE | =EDATE(start_date, months) | Date N months from start | =EDATE("01-Jan-2024", 6) -> 01-Jul-2024 |
| EOMONTH | =EOMONTH(start_date, months) | Last day of month N months away | =EOMONTH("01-Mar-20 24", 0) -> 31-Mar-2024 |
| NETWORKDAYS | =NETWORKDAYS(start, end) | Working days between two dates | =NETWORKDAYS(A1,B1) -> excludes weekends |
| WORKDAY | =WORKDAY(start, days) | Date N working days from start | =WORKDAY(TODAY(),10) -> 10 working days later |

### DATEDIF — The Hidden Age/Duration Calculator

Syntax: `=DATEDIF(start_date, end_date, unit)`

Unit options:
- `"Y"` = complete years between dates
- `"M"` = complete months between dates
- `"D"` = days between dates
- `"YM"` = months remaining after years
- `"MD"` = days remaining after months
:::scenario
**Example: Calculate Employee Age and Experience**
- A2 = Date of Birth: 15-Jun-1990 | B2 = Date of Joining: 01-Mar-2015
- Age: `=DATEDIF(A2, TODAY(), "Y")` → 35 years
- Experience: `=DATEDIF(B2, TODAY(), "Y")` → 11 years
- Full age: `=DATEDIF(A2,TODAY(),"Y")&" yrs "&DATEDIF(A2,TODAY(),"YM")&" months"`
:::
Dynamic Date & Time Functions

| TODAY | =TODAY() |  |
| --- | --- | --- |
| Returns the current date as a serial number (formatted as a date). Updates automatically every time the workbook recalculates. Takes NO arguments. |  |  |
| EXAMPLES |  |  |
| =TODAY() | → 24-Mar-2026 | Today's date |
| =TODAY()-A1 | → 45 (days) | Days since a past date in A1 |
| =A1-TODAY() | → 12 (days) | Days until a future date in A1 |
| =TEXT(TODAY(),"DD MMM YYYY") | → "24 Mar2026" | Formatted as text string |
| TIP: Combine with IF to highlight overdue tasks: =IF(A1<TODAY(),"Overdue","On Track") |  |  |

| NOW | =NOW() |  |
| --- | --- | --- |
| Returns the current date AND time as a serial number. The integer part is the date; the decimal part is the time. Also takes NO arguments. |  |  |
| EXAMPLES |  |  |
| =NOW() | → 24-Mar-2026 14:35 | Current date and time |
| =INT(NOW()) | → 24-Mar-2026 | Strip time — keep date only |
| =NOW()-INT(NOW()) | → 0.607638... | Strip date — keep time only |
| =TEXT(NOW(),"HH:MM AM/PM") | → "02:35 PM" | Format as time string |
| TIP: Use =NOW() to timestamp when a cell was last edited. Press Ctrl+; for a static (non-updating) date stamp. |  |  |

Date Calculation Functions

## DATEDIF=DATEDIF(start_date, end_date, "unit")

Calculates the difference between two dates in the unit you specify. This is a compatibility function — it doesNOT appear in autocomplete but works in all Excel versions.PARAMETERTYPE / DESCRIPTIONREQUIRED?

|  | start_dateThe | earlier/start date (must be ≤ end_date)Required |  |  |
| --- | --- | --- | --- | --- |
|  | end_dateThe | later/end dateRequired |  |  |
|  | "unit"Text | code: | "Y","M","D","MD","YM","YD"Required |  |
| EXAMPLES |  |  |  |  |
| =DATEDIF(B2,TODAY(),"Y") | → | 26 | Age in complete years |  |
| =DATEDIF(B2,TODAY(),"M") | → | 316 | Total complete months elapsed |  |
| =DATEDIF(B2,TODAY(),"YM") | → | 4 | Extra months beyond full years |  |
| =DATEDIF(B2,TODAY(),"MD") | → | 12 | Extra days beyond full months |  |
| CAUTION: start_date must be BEFORE end_date or Excel returns #NUM! error. |  |  |  |  |

DATEDIF Unit Codes

| UNIT | RETURNS | EXAMPLE FORMULA | RESULT (if diff = 1yr 3mo 15d) |
| --- | --- | --- | --- |
| "Y" | Complete years | =DATEDIF(A1,B1,"Y") | 1 |
| "M" | Complete months | =DATEDIF(A1,B1,"M") | 15 |
| "D" | Complete days | =DATEDIF(A1,B1,"D") | 470 |
| "MD" | Days, ignoring months & years | =DATEDIF(A1,B1,"MD") | 15 |
| "YM" | Months, ignoring years | =DATEDIF(A1,B1,"YM") | 3 |
| "YD" | Days, ignoring years | =DATEDIF(A1,B1,"YD") | 105 |

Real-World Example: Age Calculator

| GOAL | Display exact age as: '26 yrs, 4 mo, 12 days' |
| --- | --- |
| FORMULA | =DATEDIF(B2,TODAY(),"Y")&" yrs, "&DATEDIF;(B2,TODAY(),"YM")&" mo, "&DATEDIF;(B2,TODAY(),"MD")&" days" |
| WHERE | B2 = Date of Birth |

Date Shifting Functions

\`\`\`
EDATE=EDATE(start_date, months)
\`\`\`

\`\`\`
Returns a date that is exactly N months before or after a given date. The day of the month stays the same. Perfect for subscription renewals, loan EMI schedules, and contract deadlines.PARAMETERTYPE / DESCRIPTIONREQUIRED?
\`\`\`

|  | start_date | The starting date |  |  | Required |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  | months | Number of | months to add | (+) | or | subtract (-)Required |  |
| EXAMPLES |  |  |  |  |  |  |  |
| =EDATE(A1, 3) | → | 24-Jun-2026 | 3 months after date in A1 |  |  |  |  |
| =EDATE(A1, -1) | → | 24-Feb-2026 | 1 month before date in A1 |  |  |  |  |
| =EDATE(A1, 12) | → | 24-Mar-2027 | Exactly 1 year later |  |  |  |  |
| =EDATE(TODAY(),6) | → | 24-Sep-2026 | 6 months from today |  |  |  |  |
| TIP: Create a full EMI schedule: In B2 put loan start date, in B3 enter =EDATE(B2,1) then drag down. |  |  |  |  |  |  |  |

| EOMONTH |  | =EOMONTH(start_date, months) |  |  |  |
| --- | --- | --- | --- | --- | --- |
| Returns the last day of the month that is N months from the start date. Use months=0 for the last day of the same month. Essential for invoice due dates, month-end reports, and financial statements.PARAMETERTYPE / DESCRIPTIONREQUIRED? |  |  |  |  |  |
|  | start_date |  | Any date within the reference month | Required |  |
|  | months |  | 0 = same month, 1 = next month, -1 = prev | Required |  |
| EXAMPLES |  |  |  |  |  |
| =EOMONTH(TODAY(), | 0) | → 31-Mar-2026Last day of current month |  |  |  |
| =EOMONTH(TODAY(), | 1) | → 30-Apr-2026Last day of next month |  |  |  |
| =EOMONTH(TODAY(), | -1) | → 28-Feb-2026Last day of previous month |  |  |  |
| =EOMONTH(A1,0)+1 |  | → 01-Apr-2026First day of NEXT month |  |  |  |
| TIP: =EOMONTH(A1,0)-DAY(A1)+1 gives you the FIRST day of the month for any date in A1. |  |  |  |  |  |

Date Component Extraction Functions

| DAY | =DAY(date) |  |  |  |
| --- | --- | --- | --- | --- |
| Extracts the day component (1–31) from a date. Use to isolate the day number for calculations, display, or conditional logic.PARAMETERTYPE / DESCRIPTIONREQUIRED? |  |  |  |  |
|  | date | A valid Excel date, cell reference, or date text | Required |  |
| EXAMPLES |  |  |  |  |
| =DAY(TODAY()) | → 24Today's day number |  |  |  |
| =DAY("15-Aug-2024") | → 15Day from a text date |  |  |  |
| =DAY(A1) | → 1Day from date in A1 |  |  |  |


## =EOMONTH(A1,0)-DAY(A1)+1→ 01-Mar-2026First day of month trick

| MONTH=MONTH(date) |  |  |
| --- | --- | --- |
| Extracts the month number (1–12) from a date. Use with CHOOSE or IFS to convert to month names, or to group/filter data by month.PARAMETERTYPE / DESCRIPTIONREQUIRED? |  |  |
|  | dateA valid Excel date, cell reference, or date textRequired |  |
| EXAMPLES |  |  |
| =MONTH(TODAY())→ 3Current month number |  |  |
| =CHOOSE(MONTH(A1),"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec")→ "Mar"Convert to month name |  |  |
| =IF(MONTH(A1)<=3,"Q1",IF( MONTH(A1)<=6,"Q2",IF(MONTH(A1)<=9,"Q3","Q4")))→ "Q1"Convert to quarter |  |  |
| TIP: Use =TEXT(A1,"MMM") or =TEXT(A1,"MMMM") for a faster way to get short/full month names. |  |  |

| YEAR=YEAR(date) |  |  |
| --- | --- | --- |
| Extracts the 4-digit year from a date. Use to filter by year, group data in pivot tables, or build DATE() combinations.PARAMETERTYPE / DESCRIPTIONREQUIRED? |  |  |
|  | dateA valid Excel date, cell reference, or date textRequired |  |
| EXAMPLES |  |  |
| =YEAR(TODAY())→ 2026Current year |  |  |
| =YEAR(A1)→ 2024Year from date in A1 |  |  |
| =YEAR(A1)-YEAR(B1)→ 2Difference in years (approx) |  |  |
| =DATE(YEAR(A1),MONTH(A1),1)→ 01-Mar-2026First day of same month/year |  |  |
| TIP: Combine DAY+MONTH+YEAR with DATE() to rebuild or shift dates: =DATE(YEAR(A1)+1, MONTH(A1), DAY(A1)) adds exactly one year. |  |  |
`,

12: `# Pivot Tables


## 11.1. WHAT IS A PIVOT TABLE?

**Definition:** A Pivot Table is an interactive Excel tool that lets you automatically sort, count, total, or average data stored in a table or spreadsheet — and display the summarized results in a new table. It allows you to 'pivot' (rotate) the data to view it from different perspectives without writing any formulas.

![PivotTable creation](/Excel_images/eimg15.png)


## Key Characteristics

| Feature | What It Means |
| --- | --- |
| Interactive | Drag-and-drop interface — no formulas needed. |
| Dynamic | Refresh with one click when source data changes. |
| Multi-dimensional | Analyse data by multiple variables simultaneously. |
| Non-destructive | Never changes your original data. |
| Fast | Summarises thousands of rows in seconds. |


## The 4 Areas of a Pivot Table

| ROWS | Displays unique values from a field as row labels (left side). |
| --- | --- |
| COLUMNS | Displays unique values as column headers (top side). |
| VALUES | Performs calculations — Sum, Count, Average, Max, Min, etc. |
| FILTERS | Acts as a page-level filter — filters the entire pivot at once. |

- Understand why Pivot Tables are the #1 analyst tool
- Know the 4 areas: Rows, Columns, Values, Filters
- Recognise when to use a Pivot Table vs a formula

## 11.2. THE SAMPLE DATASET

**About the Dataset:** All examples in this module use a Sales Transactions dataset — 20 representative rows shown below (full dataset = 50 rows). It covers 4 regions, 4 products, 4 salespeople, and 12 months of data.

## Column Descriptions

| Column | Description | Data Type |
| --- | --- | --- |
| OrderID | Unique identifier for each transaction | Text |
| Date | Transaction date (Jan–Dec 2024) | Date |
| Region | North, South, East, West | Text |
| Salesperson | Alice, Bob, Carol, David | Text |
| Product | Laptop, Phone, Tablet, Monitor | Text |
| Category | Electronics (all items in this dataset) | Text |
| Units | Number of units sold | Number |
| Unit Price | Price per unit (INR) | Currency |
| Revenue | Units × Unit Price (auto-calculated) | Currency |
| Profit | Revenue × 0.25 (25% margin assumed) | Currency |


## Sample Data (First 20 Rows)

| OrderID | Date | Region | Person | Product | Units | Unit Price | Revenue | Profit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ORD001 | 01-Jan-24 | North | Alice | Laptop | 10 | ₹ 65,000.00 | ₹ 6,50,000.00 | ₹ 1,62,500.00 |
| ORD002 | 03-Jan-24 | South | Bob | Phone | 25 | ₹ 18,000.00 | ₹ 4,50,000.00 | ₹ 1,12,500.00 |
| ORD003 | 07-Jan-24 | East | Carol | Tablet | 15 | ₹ 28,000.00 | ₹ 4,20,000.00 | ₹ 1,05,000.00 |
| ORD004 | 10-Jan-24 | West | David | Monitor | 8 | ₹ 22,000.00 | ₹ 1,76,000.00 | ₹ 44,000.00 |
| ORD005 | 15-Feb-24 | North | Alice | Phone | 30 | ₹ 18,000.00 | ₹ 5,40,000.00 | ₹ 1,35,000.00 |
| ORD006 | 18-Feb-24 | South | Bob | Laptop | 5 | ₹ 65,000.00 | ₹ 3,25,000.00 | ₹ 81,250.00 |
| ORD007 | 22-Feb-24 | East | Carol | Monitor | 12 | ₹ 22,000.00 | ₹ 2,64,000.00 | ₹ 66,000.00 |
| ORD008 | 28-Feb-24 | West | David | Tablet | 20 | ₹ 28,000.00 | ₹ 5,60,000.00 | ₹ 1,40,000.00 |
| ORD009 | 05-Mar-24 | North | Bob | Tablet | 18 | ₹ 28,000.00 | ₹ 5,04,000.00 | ₹ 1,26,000.00 |
| ORD010 | 12-Mar-24 | South | Alice | Monitor | 6 | ₹ 22,000.00 | ₹ 1,32,000.00 | ₹ 33,000.00 |
| ORD011 | 20-Mar-24 | East | David | Laptop | 7 | ₹ 65,000.00 | ₹ 4,55,000.00 | ₹ 1,13,750.00 |

| ORD012 | 25-Mar-24 | West | Carol | Phone | 22 | ₹  18,000.00 | ₹  3,96,000.00 | ₹          99,000.00 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ORD013 | 02-Apr-24 | North | David | Monitor | 10 | ₹  22,000.00 | ₹  2,20,000.00 | ₹          55,000.00 |
| ORD014 | 10-Apr-24 | South | Carol | Laptop | 8 | ₹  65,000.00 | ₹  5,20,000.00 | ₹      1,30,000.00 |
| ORD015 | 17-Apr-24 | East | Alice | Phone | 35 | ₹  18,000.00 | ₹  6,30,000.00 | ₹      1,57,500.00 |
| ORD016 | 24-Apr-24 | West | Bob | Tablet | 14 | ₹  28,000.00 | ₹  3,92,000.00 | ₹          98,000.00 |
| ORD017 | 03-May-24 | North | Carol | Laptop | 12 | ₹  65,000.00 | ₹  7,80,000.00 | ₹ 1,95,000.00 |
| ORD018 | 15-May-24 | South | David | Phone | 28 | ₹  18,000.00 | ₹  5,04,000.00 | ₹      1,26,000.00 |
| ORD019 | 22-May-24 | East | Bob | Monitor | 9 | ₹  22,000.00 | ₹  1,98,000.00 | ₹          49,500.00 |
| ORD020 | 30-May-24 | West | Alice | Tablet | 16 | ₹  28,000.00 | ₹  4,48,000.00 | ₹      1,12,000.00 |

→ Dataset continues to 50 rows — all examples use the complete dataset.

## 11.3. CREATING YOUR FIRST PIVOT TABLE

**What You Will Build:** By the end of this section you will create a pivot table that shows Total Revenue by Region and Product — a classic analyst view.

## Step-by-Step: Insert a Pivot Table

| Step 1 | Prepare Your DataEnsure your data has column headers in Row 1 with no blank rows or columns. Click any cell inside the data range (e.g., A1). |
| --- | --- |
| Step 2 | Insert → PivotTableGo to the Insert tab on the Ribbon → click PivotTable. Shortcut: Alt → N → V → T |
| Step 3 | Choose Data SourceExcel auto-detects the range (e.g., Sheet1!$A$1:$I$51). Confirm or adjust. Select 'New Worksheet' for the output. |
| Step 4 | Click OKExcel creates a blank PivotTable on a new sheet with the Field List panel on the right side. |
| Step 5 | Add FieldsDrag 'Region' to ROWS. Drag 'Product' to COLUMNS. Drag 'Revenue' to VALUES. Drag 'Salesperson' to FILTERS. |
| Step 6 | Read the ResultYour pivot table now shows Revenue broken down by Region (rows) and Product (columns), filterable by Salesperson. |

Result: Revenue by Region × Product
After completing the steps above, your pivot table will look like this:

| Region  / Product → | Laptop | Monitor | Phone | Tablet | Grand Total |
| --- | --- | --- | --- | --- | --- |
| East | 10,10,000 | 4,62,000 | 12,30,000 | 4,20,000 | 31,22,000 |
| North | 21,80,000 | 4,70,000 | 5,40,000 | 5,04,000 | 36,94,000 |
| South | 8,45,000 | 1,32,000 | 9,54,000 | 0 | 19,31,000 |
| West | 0 | 1,76,000 | 3,96,000 | 13,00,000 | 18,72,000 |
| Grand Total | 40,35,000 | 12,40,000 | 31,20,000 | 22,24,000 | 1,06,19,000 |

→ Grand Total row/column added automatically by Excel.
Blank PivotTable canvas created on a new sheetRevenue shown for each Region-Product combinationGrand Totals auto-calculated for rows and columnsFilter drop-down appears at the top to slice by Salesperson✔ OUTCOMES / WHAT YOU WILL SEE

## 11.4. ROWS, COLUMNS, VALUES & FILTERS


## ROWS Area

Fields placed in the Rows area create row labels on the left side. Each unique value becomes a separate row. You can nest multiple fields (e.g., Region → Salesperson) to create a hierarchy.
Example: Region in Rows + Units in Values

| Region | Sum of Units |
| --- | --- |
| East | 121 |
| North | 108 |
| South | 97 |
| West | 94 |
| Grand Total | 420 |

Nested Rows Example: Region → Salesperson

| Region | Salesperson | Sum of Units |
| --- | --- | --- |
| East |  | 121 |
|  | Alice | 35 |
|  | Bob | 28 |
|  | Carol | 33 |
|  | David | 25 |
| North |  | 108 |
|  | Alice | 40 |
|  | Bob | 18 |
| Grand Total |  | 420 |


## COLUMNS Area

Fields in the Columns area spread values horizontally. Best used with fields that have a small number of unique values (e.g., Product with 4 values vs. OrderID with 50 values).
Tip: Use 'Compact Form' or 'Tabular Form' from Design tab to change layout.

## VALUES Area

The Values area performs the aggregation. Right-click → 'Value Field Settings' to change the function.

| Function | What It Does | Best Used For |
| --- | --- | --- |
| Sum | Adds all values | Revenue, Profit, Sales amounts |
| Count | Counts non-empty cells | Number of orders, transactions |

| Function | What It Does | Best Used For |
| --- | --- | --- |
| Average | Mean of all values | Average order value, avg units |
| Max / Min | Largest or smallest value | Top deal size, minimum price |
| Count Numbers | Counts only numeric cells | When mixed text+numbers exist |
| StdDev | Standard deviation | Performance consistency analysis |
| Product | Multiplies all values | Rarely used — compound rates |


### Example: Multiple Value Fields Side-by-Side

| Salesperson | Sum Revenue | Sum Profit | Count Orders | Avg Revenue/Order |
| --- | --- | --- | --- | --- |
| Alice | 19,22,000 | 4,80,500 | 12 | 1,60,167 |
| Bob | 17,50,000 | 4,37,500 | 11 | 1,59,091 |
| Carol | 18,90,000 | 4,72,500 | 14 | 1,35,000 |
| David | 16,30,000 | 4,07,500 | 13 | 1,25,385 |
| Grand Total | 71,92,000 | 17,98,000 | 50 | 1,43,840 |


## FILTERS Area (Report Filter / Slicer)

Fields in the Filters area appear above the pivot table as a drop-down selector. Selecting a value re-calculates the entire pivot. Use Slicers (Insert → Slicer) for a more visual, button-based filter.
Slicers vs. Report FiltersSlicers (Excel 2010+) are the modern alternative to Report Filters. They show all values as clickable buttons, support multi-select, and can be connected to multiple pivot tables simultaneously — ideal for dashboards.Slicers vs. Report FiltersSlicers (Excel 2010+) are the modern alternative to Report Filters. They show all values as clickable buttons, support multi-select, and can be connected to multiple pivot tables simultaneously — ideal for dashboards.Rows create row labels — nest fields for drill-down hierarchyColumns spread categories horizontally — keep count low (< 10)Values supports Sum, Count, Average, Max, Min, StdDevFilters / Slicers slice the entire pivot — connectable to charts✔ OUTCOMES / WHAT YOU WILL SEERows create row labels — nest fields for drill-down hierarchyColumns spread categories horizontally — keep count low (< 10)Values supports Sum, Count, Average, Max, Min, StdDevFilters / Slicers slice the entire pivot — connectable to charts✔ OUTCOMES / WHAT YOU WILL SEE

## 11.5. GROUPING DATA

DefinitionGrouping lets you combine values in a pivot table row/column field into custom buckets. Excel supports automatic grouping for Dates (by year/quarter/month/day) and Numbers (by range), as well as Manual text grouping.

## Grouping Dates

Right-click any date in the Rows/Columns area → Group. Select: Days, Months, Quarters, Years (multi-select allowed). Grouping by Month + Quarter together gives a two-level date hierarchy.

### How to Group by Month:

- Drag Date field to ROWS
- Right-click any date value → Group...
- Select 'Months' in the Grouping dialog → OK
- Excel collapses individual dates into Jan, Feb, Mar... etc.

### Result: Monthly Revenue Summary

| Month | Sum of Revenue |
| --- | --- |
| January 2024 | 17,96,000 |
| February 2024 | 16,89,000 |
| March 2024 | 14,87,000 |
| April 2024 | 17,62,000 |
| May 2024 | 18,30,000 |
| June 2024 | 16,55,000 |
| Grand Total | 1,01,19,000 |


## Grouping Numbers

Group numeric fields into ranges/buckets. E.g., group Units Sold into: 1–10, 11–20, 21–30, 31–40 — then count how many orders fall in each range (frequency distribution).
Steps: Right-click Units value → Group → set Start: 1, End: 40, By: 10

| Units Bucket | Count of Orders | % of Total |
| --- | --- | --- |
| 1 – 10 | 14 | 28% |
| 11 – 20 | 18 | 36% |
| 21 – 30 | 12 | 24% |
| 31 – 40 | 6 | 12% |

| Units Bucket | Count of Orders | % of Total |
| --- | --- | --- |
| Grand Total | 50 | 100% |


## Manual (Text) Grouping

Select multiple text items in the pivot → Right-click → Group. Useful for combining regions or products into custom categories.
Example: Group North + South → 'Upper India', East + West → 'Other India'

| Custom Region Group | Sum of Revenue |
| --- | --- |
| Upper India (North + South) | 56,25,000 |
| Other India (East + West) | 49,94,000 |
| Grand Total | 1,06,19,000 |

Date grouping by Month/Quarter/Year — no helper column neededNumber grouping creates frequency distribution bucketsText grouping merges categories into custom labelsGroupings are dynamic — edit anytime by right-clicking✔ OUTCOMES / WHAT YOU WILL SEE

## 11.6. SUMMARIZING LARGE DATASETS

Why This MattersPivot Tables reduce thousands of rows into actionable summaries in seconds. Combine multiple fields and aggregate functions to answer business questions like 'Who is our top salesperson per region per quarter?'

## Example A: Salesperson Performance Summary

Setup: Salesperson → ROWS | Revenue, Profit, Units → VALUES

| Salesperson | Total Revenue | Revenue % | Total Units | Avg Revenue/Unit |
| --- | --- | --- | --- | --- |
| Alice | 19,22,000 | 27% | 102 | 18,843 |
| Bob | 17,50,000 | 24% | 96 | 18,229 |
| Carol | 18,90,000 | 26% | 108 | 17,500 |
| David | 16,30,000 | 23% | 114 | 14,298 |
| Grand Total | 71,92,000 | 100% | 420 | 17,124 |


## Example B: Product Profitability Analysis

Setup: Product → ROWS | Revenue, Profit, Units → VALUES | Sort by Revenue DESC

| Product | Revenue | Profit | Units Sold | Avg Revenue/Order | Margin % |
| --- | --- | --- | --- | --- | --- |
| Laptop | 40,35,000 | 10,08,750 | 68 | 5,93,382 | 25.0% |
| Phone | 31,20,000 | 7,80,000 | 140 | 2,22,857 | 25.0% |
| Tablet | 22,24,000 | 5,56,000 | 118 | 1,88,475 | 25.0% |
| Monitor | 12,40,000 | 3,10,000 | 94 | 1,31,915 | 25.0% |
| Grand Total | 1,06,19,000 | 26,54,750 | 420 | 2,52,833 | 25.0% |

Example C: Region × Quarter Revenue Matrix
Setup: Region → ROWS | Quarter (Grouped Date) → COLUMNS | Revenue → VALUES

| Region | Q1 2024 | Q2 2024 | Q3 2024 | Q4 2024 | Grand Total |
| --- | --- | --- | --- | --- | --- |
| East | ₹   7,36,000.00 | ₹     8,20,000.00 | ₹         7,88,000.00 | ₹    7,78,000.00 | ₹     31,22,000.00 |
| North | ₹   9,16,000.00 | ₹     9,62,000.00 | ₹         8,92,000.00 | ₹    9,24,000.00 | ₹   36,94,000.00 |
| South | ₹   4,58,000.00 | ₹     5,12,000.00 | ₹         4,82,000.00 | ₹    4,79,000.00 | ₹  19,31,000.00 |
| West | ₹   4,62,000.00 | ₹     4,80,000.00 | ₹         4,58,000.00 | ₹    4,72,000.00 | ₹  18,72,000.00 |
| Grand Total | ₹ 25,72,000.00 | ₹   27,74,000.00 | ₹       26,20,000.00 | ₹  26,53,000.00 | ₹  1,06,19,000.00 |


## Pro Tips: Show Values As

| Show Values As | Meaning | Example Use Case |
| --- | --- | --- |
| % of Grand Total | Each cell as % of overall total | Revenue contribution per region |
| % of Row Total | Each cell as % of that row's total | Product mix per region |
| % of Column Total | Each cell as % of that column's total | Regional split per product |
| Running Total In | Cumulative sum along a field | Cumulative monthly revenue |
| Rank Largest to Smallest | Rank of each value in the field | Salesperson ranking |
| Difference From | Difference vs. a base value | MoM or QoQ change |

Access via: Right-click any value cell → Show Values As
Salesperson performance table — Revenue, Profit, Units in one viewProduct profitability ranked by Total Revenue (descending)Region × Quarter matrix — trend analysis across time'Show Values As' enables % contribution and ranking without formulas✔ OUTCOMES / WHAT YOU WILL SEE

## 11.7. PIVOT CHARTS

DefinitionA Pivot Chart is a chart that is directly connected to a Pivot Table. It updates automatically when the pivot data changes, supports all chart types, and inherits all filters and slicers from the parent pivot table.

## Creating a Pivot Chart

| Method 1 | Click inside your Pivot Table → Insert tab → PivotChart → Choose chart type → OK |
| --- | --- |
| Method 2 | Click inside Pivot Table → PivotTable Analyze tab → PivotChart button |
| Method 3 | Create both together: Insert → PivotChart → 'PivotChart & PivotTable' option |


## Recommended Chart Types by Use Case

| Chart Type | Best For | Example |
| --- | --- | --- |
| Clustered Column | Compare categories side by side | Revenue by Product per Region |
| Stacked Bar | Show part-to-whole within categories | Revenue mix by Salesperson |
| Line Chart | Show trends over time | Monthly Revenue trend |
| Pie / Doughnut | Show proportions of a total | Product share of total revenue |
| Combo Chart | Two metrics on same chart (dual axis) | Revenue (bars) + Margin % (line) |
| Heat Map (Conditional Formatting) | Colour intensity shows magnitude | Region × Month revenue matrix |


## Pivot Chart vs. Regular Chart

| Feature | Pivot Chart | Regular Chart |
| --- | --- | --- |
| Auto-updates with pivot filter | ✔ Yes | ✘ Must re-select data |
| Connected to Slicer | ✔ Yes | ✘ No |
| Dynamic field buttons on chart | ✔ Yes | ✘ No |
| Works without pivot table | ✘ No | ✔ Yes |
| Full chart formatting options | ✔ Yes | ✔ Yes |
| Can embed on dashboard | ✔ Yes | ✔ Yes |


## Formatting Tips for Pivot Charts

- Hide field buttons: Right-click chart → Hide All Field Buttons (for presentation mode)
- Disconnect chart: Cut & Paste as picture to freeze a snapshot of the chart
- Add Data Labels: Chart Design tab → Add Chart Element → Data Labels
- Change chart type: Right-click chart area → Change Chart Type
- Format axis: Right-click axis → Format Axis → Number → Currency / Percentage
- Apply chart style: Chart Design tab → Chart Styles gallery (Style 8 = clean dark theme)
Pivot Chart created linked to your pivot table with 3 methodsColumn chart shows Region-wise Revenue comparison visuallyLine chart shows monthly revenue trend automaticallySlicers filter BOTH the pivot table AND the chart simultaneouslyField buttons hidden for clean dashboard-ready presentation✔ OUTCOMES / WHAT YOU WILL SEE

## 11. 8. QUICK REFERENCE & KEYBOARD SHORTCUTS


## Keyboard Shortcuts

| Shortcut / Action | What It Does |
| --- | --- |
| Alt → N → V → T | Insert a new PivotTable |
| Alt → J → T | PivotTable Analyze tab |
| Alt → J → T → R | Refresh PivotTable data |
| Ctrl + Shift + * | Select entire pivot table region |
| Alt → D → P | PivotTable Wizard (legacy) |
| F5 / Ctrl+G | Go To — jump to named ranges |
| Ctrl + Z | Undo last field change |
| Right-click → Group | Group selected dates/numbers/text |
| Right-click → Ungroup | Remove grouping |
| Double-click value cell | Drill down — shows source rows in new sheet |


## Common Mistakes & Fixes

| Mistake | Symptom | Fix |
| --- | --- | --- |
| Blank rows in data | Pivot misses rows below the blank | Always use a contiguous table / Ctrl+T |
| No column headers | Can't add fields to areas | Ensure Row 1 is all headers, no blanks |
| Numbers stored as text | SUM returns 0 | Data → Text to Columns → Finish |
| Pivot doesn't auto-update | New data not reflected | Refresh: Right-click → Refresh or Alt+F5 |
| Date grouping greyed out | Dates stored as text | Convert to Date: use DATEVALUE() first |
| Duplicate grand totals | Wrong calculation | Design → Grand Totals → Off for Rows/Cols |


## Complete Topic Checklist

✔Create a pivot table from a raw dataset
✔Add fields to Rows, Columns, Values, Filters areas
✔Change Value Field to Sum / Count / Average / Max
✔Group dates by Month, Quarter, Year
✔Group numbers into ranges (frequency distribution)
✔Manually group text items into custom categories
✔Use 'Show Values As' → % of Grand Total, Running Total
✔Insert a Slicer and connect to pivot table
✔Create a Pivot Chart (Column + Line types)
✔Format and hide field buttons for dashboard use
✔Refresh pivot when source data changes
✔Drill down by double-clicking a value cell`,

13: `# Conditional Formatting


## 12.1. WHAT IS CONDITIONAL FORMATTING?

DefinitionConditional Formatting (CF) automatically applies visual formatting — fill colour, font colour, borders, icons, or data bars — to cells based on rules you define. The formatting updates dynamically as data changes. No macros or formulas in cells are needed.
How to Access Conditional Formatting

| Method | Action |
| --- | --- |
| Ribbon | Home tab → Styles group → Conditional Formatting |
| Keyboard | Alt → H → L (opens the CF dropdown instantly) |
| New Rule | Alt → H → L → N (opens New Rule dialog directly) |
| Manage Rules | Alt → H → L → M (opens Rules Manager) |

The 5 Built-in CF Categories

| Category | Purpose | Options |
| --- | --- | --- |
| Highlight Cell Rules | Flag cells meeting a condition | Greater/Less Than, Between, Text Contains, Duplicates |
| Top / Bottom Rules | Highlight rank-based values | Top/Bottom N, Top/Bottom N%, Above/Below Average |
| Data Bars | In-cell horizontal bar chart | Gradient fill or Solid fill in any colour |
| Color Scales | 2- or 3-colour gradient heat map | Green-Yellow-Red, Blue-White-Red, custom |
| Icon Sets | Visual icons inside cells | Arrows, Traffic Lights, Stars, Flags, Ratings |

Key Rule — Priority OrderCF rules are evaluated top-down by priority. If multiple rules match the same cell, the highest-priority rule's format is applied. Use 'Stop If True' to prevent lower rules from firing once a match is found. Manage priority in: Home → CF → Manage Rules.
CF panel opened via Home → Conditional Formatting (Alt+H+L)5 CF categories visible in the dropdown menuManage Rules dialog shows all rules with priority order and applies-to rangeOUTCOMES — What you will see in Excel

## 12.2 COLOR SCALES

. COLOR SCALES
DefinitionA Color Scale applies a gradient fill across a selected range. The colour intensity reflects each cell's value relative to the range — instantly creating a heat map without any charting. Low values get one colour, high values get another.
Types of Color Scales

| Type | How It Works | Common Example |
| --- | --- | --- |
| 2-Color Scale | Two colours: min → max value | Red → Green (bad to good) |
| 3-Color Scale | Three: min → midpoint → max | Red → Yellow → Green |
| Custom | User-defined colours & thresholds | Match your brand or traffic-light palette |


## Step-by-Step: Apply a 3-Color Scale

- Select data range — e.g., B2:B11 (Student Scores)
- Home → Conditional Formatting → Color Scales
- Choose 'Green - Yellow - Red Color Scale' preset
- To customise: More Rules → set Min / Mid / Max colours and values
- Click OK — Excel applies the gradient instantly

## Example: Student Score Heat Map (Green = High, Red = Low)

| Student | Score | Color Scale Applied |
| --- | --- | --- |
| Alice | 95 |  |
| Bob | 82 |  |
| Carol | 74 |  |
| David | 68 |  |
| Eva | 61 |  |
| Frank | 55 |  |
| Grace | 47 |  |
| Henry | 39 |  |
| Iris | 28 |  |
| James | 15 |  |

Green = high score, Yellow = midrange, Red = low — visible without reading numbers

| Setting | What It Controls | Options |
| --- | --- | --- |
| Minimum | Lowest value — gets Min colour | Number, Percent, Percentile, Formula, Automatic |
| Midpoint | Middle value (3-color only) | 50th Percentile or a specific target number |
| Maximum | Highest value — gets Max colour | Number, Percent, Percentile, Formula, Automatic |
| Type | How thresholds are calculated | Number=exact value, Percent=range%, Percentile=rank |

**Outcomes — What you will see in Excel:**
- Green-Yellow-Red gradient applied across the score column instantly
- Top scores glow green, failing scores glow red — no reading required
- Percentile mode handles outliers — gradient remains evenly distributed

:::tip
**Percentile vs Percent:** Percent is based on the numeric spread (max - min). Percentile is rank-based — 50th percentile = median value. Use Percentile when data has outliers that would compress the gradient.
:::

**Color Scale Settings (More Rules)**

## 12.3. DATA BARS

**Definition:** Data Bars draw a horizontal bar inside each cell, proportional to the cell's value relative to the range. The longest bar = highest value. The cell number remains visible alongside the bar — giving exact value and visual comparison simultaneously.
Gradient Fill vs Solid Fill

| Type | Appearance | Best For |
| --- | --- | --- |
| Gradient FillBa | r fades from solid at left to lighter at right | Modern dashboards, digital reports |
| Solid Fill | Single uniform colour throughout | Print-friendly, high-contrast displays |


## Step-by-Step: Apply Data Bars

- Select Revenue column — e.g., C2:C6
- Home → Conditional Formatting → Data Bars
- Choose Gradient Fill → Blue Data Bar
- To customise: More Rules → set min/max axis points
- Tick 'Show Bar Only' to hide the number (dashboard mode)

## Example: Regional Revenue with Data Bars

| Region | Revenue | Data Bar (proportional) |
| --- | --- | --- |
| North | Rs. 820,000 | ■■■■■■■■■■■■■■■■■■■■■■■■■ 90% |
| South | Rs. 650,000 | ■■■■■■■■■■■■■■■■■■■■ 71% |
| East | Rs. 910,000 | ■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 100% |
| West | Rs. 430,000 | ■■■■■■■■■■■■■ 47% |
| Central | Rs. 720,000 | ■■■■■■■■■■■■■■■■■■■■■■ 79% |

Bar length is proportional to revenue — East (910K) has the longest bar.
Advanced Data Bar Settings

| Setting | What It Does | Pro Tip |
| --- | --- | --- |
| Min / Max | Controls bar length boundaries | Set to 0 & a fixed max for cross-sheet consistency |
| Bar Direction | Left-to-Right or Right-to-Left | RTL for right-aligned or Arabic layouts |
| Show Bar Only | Hides number, shows bar only | Use in dashboards where bars tell the full story |
| Axis Position | Automatic, Cell Midpoint, None | Midpoint: perfect for +/- data (profit vs loss) |

| Setting | What It Does | Pro Tip |
| --- | --- | --- |
| Negative Bars | Separate colour for negatives | Red bars for losses, blue for profits — built-in |
| Border | Adds border to bar edge | Improves readability on white backgrounds |

Negative Value BarsData Bars handle negative numbers automatically. Negative bars extend to the LEFT in red; positive bars extend right. Perfect for P&L data, variance columns, or Month-over-Month change metrics.Negative Value BarsData Bars handle negative numbers automatically. Negative bars extend to the LEFT in red; positive bars extend right. Perfect for P&L data, variance columns, or Month-over-Month change metrics.Blue gradient bars drawn inside each Revenue cellEast (highest) has the longest bar, West (lowest) has the shortestNegative-value bars extend left in red — ideal for variance columns'Show Bar Only' mode hides numbers — pure visual in-cell chartOUTCOMES — What you will see in ExcelBlue gradient bars drawn inside each Revenue cellEast (highest) has the longest bar, West (lowest) has the shortestNegative-value bars extend left in red — ideal for variance columns'Show Bar Only' mode hides numbers — pure visual in-cell chartOUTCOMES — What you will see in Excel

## 12.4. HIGHLIGHT CELL RULES

DefinitionHighlight Cell Rules apply fill and/or font colour to cells that satisfy a specific condition — greater than a value, equal to text, between two numbers, within a date range, or duplicate values. These are the most commonly used CF rules for business reporting.
All Built-in Highlight Rules

| Rule | Condition | Example Use Case |
| --- | --- | --- |
| Greater Than | Value > threshold | Flag revenue exceeding target |
| Less Than | Value < threshold | Flag scores below passing grade (< 40) |
| Between | Min <= Value <= Max | Items priced between Rs.500–Rs.1000 |
| Equal To | Value = exact match | Flag a specific product or status code |
| Text Contains | Cell contains substring | All rows mentioning 'Laptop' |
| A Date Occurring | Date in a period | Orders due 'This Week' or 'Last Month' |
| Duplicate Values | Appears more than once | Duplicate Order IDs or names |
| Unique Values | Appears exactly once | One-time customers or single entries |


## Example: Three-Tier Revenue Highlight

Three separate rules: Red < 2L | Yellow 2L–3L | Green > 3L

| Order | Salesperson | Product | Revenue | CF Status |
| --- | --- | --- | --- | --- |
| ORD001 | Alice | Laptop | Rs.1,20,000 | Below Target (<2L) |
| ORD002 | Bob | Phone | Rs.3,80,000 | Above Target (>3L) |
| ORD003 | Carol | Tablet | Rs.2,50,000 | Near Target (2-3L) |
| ORD004 | David | Monitor | Rs.4,20,000 | Above Target (>3L) |
| ORD005 | Alice | Phone | Rs.1,80,000 | Below Target (<2L) |
| ORD006 | Bob | Laptop | Rs.5,10,000 | Above Target (>3L) |
| ORD007 | Carol | Monitor | Rs.2,90,000 | Near Target (2-3L) |
| ORD008 | David | Tablet | Rs.3,50,000 | Above Target (>3L) |

Three CF rules stacked. Rules evaluated top-down — first match wins.
Duplicate Values Rule

| OrderID | Salesperson | CF Status |
| --- | --- | --- |
| ORD001 | Alice | Normal — no fill |
| ORD002 | Bob | Normal — no fill |
| ORD001 | Alice | DUPLICATE — Red fill |
| ORD003 | Carol | Normal — no fill |
| ORD002 | David | DUPLICATE — Red fill |

Three-colour revenue tiers applied: Red < 2L, Yellow 2L-3L, Green > 3LDuplicate OrderIDs highlighted red — data quality check in one clickMultiple rules stack on same range — priority controls which winsOUTCOMES — What you will see in ExcelThree-colour revenue tiers applied: Red < 2L, Yellow 2L-3L, Green > 3LDuplicate OrderIDs highlighted red — data quality check in one clickMultiple rules stack on same range — priority controls which winsOUTCOMES — What you will see in ExcelSelect column → CF → Highlight Cell Rules → Duplicate Values → choose format. Fastest way to spot data quality issues — no COUNTIF formula needed.

## 12. 5. ICON SETS

DefinitionIcon Sets place a small icon (arrow, traffic light, flag, star, etc.) inside each cell, determined by the cell's value vs thresholds. Excel supports 3-icon, 4-icon, and 5-icon sets across 5 categories.
Icon Set Categories

| Category | Icons | Best For |
| --- | --- | --- |
| Directional | Up/Right/Down arrows | Performance vs target, trend direction |
| Shapes | Filled/half/empty circles | Project status, task completion |
| Indicators | Check / Warning / Cross | Pass/fail, compliance, quality gates |
| Ratings | Stars, signal bars (1-5) | Customer ratings, priority levels |
| Traffic Lights | Green / Yellow / Red circles | Risk level, health checks, SLA status |


## Step-by-Step: 3-Arrow Icon Set on % vs Target

- Select '% vs Target' column — e.g., C2:C5
- Home → CF → Icon Sets → Directional → 3 Arrows (Colored)
- Click 'More Rules...' to set custom thresholds:
- Up arrow (green): value >= 100
- Right/neutral (orange): value >= 80 and < 100
- Down arrow (red): value < 80
- Set Type to 'Number' for all three
- Optionally tick 'Show Icon Only' to hide the number

## Example: Quarterly Performance vs Target

| Quarter | Revenue | vs Target | Icon | Rule: >=100%▲ 80-99%● <80%▼ |
| --- | --- | --- | --- | --- |
| Q1 2024 | Rs.28,50,000 | 108% | ▲ |  |
| Q2 2024 | Rs.31,20,000 | 118% | ▲ |  |
| Q3 2024 | Rs.24,80,000 | 94% | ● |  |
| Q4 2024 | Rs.19,60,000 | 74% | ▼ |  |

>=100% = green up-arrow, 80-99% = orange neutral, <80% = red down-arrow.
Pro Tip — Dynamic Formula ThresholdsChange the threshold 'Type' to 'Formula'. E.g., use =AVERAGE($C$2:$C$10) as the mid threshold so icons automatically rebalance as new data is added. No manual updates needed when targets change.
Directional arrows appear inside cells based on % vs targetGreen up-arrow >= 100%, orange neutral 80-99%, red down-arrow < 80%Icon Only mode hides numbers — arrows alone communicate performanceFormula thresholds auto-rebalance icons as data updatesOUTCOMES — What you will see in Excel

## 12.6. TOP / BOTTOM RULES

DefinitionTop/Bottom Rules highlight the top N, bottom N, top N%, bottom N%, above-average, or below-average values. Excel dynamically recalculates these rules as data changes — highlighting always reflects the current top/bottom of your dataset.
All Top / Bottom Rule Types

| Rule | What Gets Highlighted | Key Note |
| --- | --- | --- |
| Top 10 Items | Highest N values (N is adjustable) | Default N=10, set any number from 1 upward |
| Top 10 % | Top N% of values by count | Top 10% of 50 rows = top 5 rows highlighted |
| Bottom 10 Items | Lowest N values | Perfect for flagging underperformers |
| Bottom 10 % | Bottom N% by count | Bottom 20% of 100 rows = bottom 20 |
| Above Average | Values > AVERAGE of the range | Dynamic — updates automatically as data changes |
| Below Average | Values < AVERAGE of the range | Flag rows needing immediate attention |


## Example: Top 3 and Bottom 3 Salespeople by Revenue

| Salesperson | Revenue | CF Rule Applied |
| --- | --- | --- |
| Alice | Rs.19,22,000 | TOP 3 |
| Carol | Rs.18,90,000 | TOP 3 |
| Bob | Rs.17,50,000 | TOP 3 |
| David | Rs.16,30,000 | Normal |
| Eva | Rs.14,80,000 | Normal |
| Frank | Rs.12,40,000 | Normal |
| Grace | Rs.10,10,000 | BOTTOM 3 |
| Henry | Rs.9,50,000 | BOTTOM 3 |
| Iris | Rs.8,20,000 | BOTTOM 3 |

Two CF rules on same column: Top 3 = Green fill, Bottom 3 = Red fill.
Above Average — Dynamic Dashboard Rule
Apply 'Above Average' CF to a daily sales column. The rule auto-recalculates every time data refreshes — cells above the current average always stay highlighted without any manual formula updates.

## OUTCOMES — What you will see in Excel

Top 3 revenue cells auto-highlighted green — no manual sorting neededBottom 3 highlighted red — underperformers instantly flaggedAbove/Below Average rules recalculate dynamically as new rows are addedN is adjustable — change 'Top 10' to 'Top 5' or 'Top 1' anytime

## 12.7. CUSTOM FORMULAS IN CONDITIONAL FORMATTING

DefinitionCustom Formula CF lets you write any Excel formula as the rule condition. If the formula returns TRUE for a cell, the format is applied. This unlocks multi-column conditions, text matching, date logic, ranking, andcross-references — far beyond the built-in rules.DefinitionCustom Formula CF lets you write any Excel formula as the rule condition. If the formula returns TRUE for a cell, the format is applied. This unlocks multi-column conditions, text matching, date logic, ranking, andcross-references — far beyond the built-in rules.Critical: Absolute vs Relative ReferencesThe CF formula is written for the top-left cell of your selection. Lock the COLUMN with $ but keep the ROW relative.Example — selection A2:E20, formula: =$D2>300000$D locks column D. Row 2 is relative — Excel checks D2 for row 2, D3 for row 3, etc. Wrong: =D2 (column not locked — shifts right as you move columns)Wrong: =$D$2 (fully locked — applies same cell to entire range)Critical: Absolute vs Relative ReferencesThe CF formula is written for the top-left cell of your selection. Lock the COLUMN with $ but keep the ROW relative.Example — selection A2:E20, formula: =$D2>300000$D locks column D. Row 2 is relative — Excel checks D2 for row 2, D3 for row 3, etc. Wrong: =D2 (column not locked — shifts right as you move columns)Wrong: =$D$2 (fully locked — applies same cell to entire range)

## 20 Essential Custom Formula Examples

| Use Case | Formula | Result |
| --- | --- | --- |
| Highlight entire row if Revenue> 3L | =AND($D2>300000) [select A2:E20] | Green fill — entire row turns green |
| Highlight Salesperson = 'Alice' | =$B2="Alice" [select A2:E20] | Blue fill on all of Alice's rows |
| Revenue above the column average | =D2>AVERAGE($D$2:$D$20) | Yellow fill on above-average cells |
| Highlight weekend dates | =WEEKDAY(A2,2)>=6 [select A2:A20] | Grey fill on Sat/Sun rows |
| Profit Margin below 20% | =($F2/$D2)<0.2 | Red fill — low-margin rows |
| Duplicate values across column | =COUNTIF($B$2:$B$20,B2)>1 | Orange fill on repeated values |
| Top 5 values dynamically | =D2>=LARGE($D$2:$D$20,5) | Gold fill on top 5 values |
| Overdue dates (past today) | =C2<TODAY() | Red fill on overdue rows |
| Any cell in row is blank | =COUNTBLANK($A2:$E2)>0 | Yellow fill — incomplete rows |
| Alternating row colours (zebra) | =MOD(ROW(),2)=0 | Light blue on even rows |
| Value ends with 'Ltd' | =RIGHT($A2,3)="Ltd" | Teal fill on company names |
| Dates in current month | =MONTH(A2)=MONTH(TODAY()) | Green fill on this month's rows |
| Score in bottom 10% | =D2<=PERCENTILE($D$2:$D$20,0.1) | Red fill on bottom 10% |

| Use Case | Formula | Result |
| --- | --- | --- |
| Multi-condition: Laptop AND Rev < 2L | =AND($C2="Laptop",$D2<200000) | Red fill — specific product + low rev |
| Either condition: East OR North | =OR($C2="East",$C2="North") | Blue fill on two regions |

Worked Example: AND Condition — Full Row Highlight

## Formula: =AND($C2="Laptop",$D2<200000) applied to A2:E9

| Order | Person | Product | Revenue | CF Result |
| --- | --- | --- | --- | --- |
| ORD001 | Alice | Laptop | Rs.1,20,000 | YES — Red fill (Laptop + Rev < 2L) |
| ORD002 | Bob | Phone | Rs.1,80,000 | No match |
| ORD003 | Carol | Laptop | Rs.3,40,000 | No match |
| ORD004 | David | Laptop | Rs.95,000 | YES — Red fill (Laptop + Rev < 2L) |
| ORD005 | Alice | Tablet | Rs.1,10,000 | No match |

Only Laptop rows where Revenue < 2L get red fill. Both conditions must be TRUE.
**Outcomes — What you will see in Excel:**
- Entire rows highlighted by multi-column AND/OR conditions
- COUNTIF formula detects duplicates — no helper column needed
- MOD(ROW(),2) creates zebra stripes — clean alternating row colours
- TODAY() in formula makes overdue date highlighting update daily
- LARGE() and PERCENTILE() enable dynamic top/bottom N highlighting

## 12.8. MANAGING RULES

**Why Rules Management Matters:** A single cell can have multiple CF rules. Excel evaluates them in priority order (top of list = highest priority). Understanding how to view, edit, reorder, and delete rules is essential for maintaining correct, clean formatting — especially in shared workbooks.
Manage Rules Actions

| Action | Purpose | Key Note |
| --- | --- | --- |
| New Rule | Creates a new CF rule | Use for any of the 5 CF types |
| Edit Rule | Modify condition or format | Change threshold or colour |
| Delete Rule | Permanently removes rule | Select rule first, then click Delete |
| Move Up / Down | Changes priority order | Top rule = evaluated first |
| Stop If True | Halts lower rules if this rule fires | Prevents overlapping rule conflicts |
| Applies To | Range the rule covers | Edit to extend or shrink the range |

Priority Order — Practical Example

## 3 rules on Revenue column D. Execution order matters:

| Priority | Condition | Format | Behaviour |
| --- | --- | --- | --- |
| 1 (Highest) | Value > 400000 | Green Fill | Fires first — if matched, turns green and stops |
| 2 | Value 200000 to 400000 | Yellow Fill | Only fires if Rule 1 did NOT match |
| 3 (Lowest) | Value < 200000 | Red Fill | Only fires if both Rule 1 and Rule 2 did not match |

Stop If TrueWith 'Stop If True' on Rule 1: if a cell matches Rule 1, Excel stops — Rules 2 and 3 are never evaluated for that cell. Without it, Excel evaluates all rules — a lower-priority rule can overwrite a higher one if it also matches.
Manage Rules shows all rules with priority, format preview, and Applies To rangeMove Up/Down reorders rules — top rule evaluated firstStop If True prevents lower-priority rules from overriding the winnerFormat Painter copies all CF rules to a new range in one clickOUTCOMES — What you will see in Excel

## 12. 9. REAL-WORLD USE CASES & DASHBOARD TIPS

Use Case 1: Sales Performance Dashboard
Apply 4 CF types simultaneously on one table: (1) Color Scale on Revenue — heat map, (2) Data Bars on Units
— visual comparison, (3) Icon Set on % vs Target — arrows, (4) Highlight Rule — red fill if Profit Margin < 15%.
Use Case 2: HR Attendance Sheet

| Scenario | CF Formula | Format |
| --- | --- | --- |
| Absent cells | =$B2="Absent" | Red fill on entire row |
| Late arrivals | =$C2>TIME(9,15,0) | Orange fill on time cell |
| Perfect attendance (26 days) | =COUNTIF($B2:$AF2,"Present")=26 | Gold fill on name |
| Weekend columns | =WEEKDAY(B$1,2)>=6 | Grey fill on Sat/Sun columns |

Use Case 3: Inventory Management

| Scenario | CF Formula | Format |
| --- | --- | --- |
| Out of stock (Stock = 0) | =$D2=0 | Red fill + bold text |
| Below reorder level | =$D2<$E2 | Orange fill — reorder warning |
| Overstocked | =$D2>$F2 | Purple fill |
| Expiry within 30 days | =$G2<=TODAY()+30 | Yellow fill on expiry cell |
| Slow-moving (no sale 60+ days) | =TODAY()-$H2>=60 | Grey fill on last-sold date |

Use Case 4: Project Tracker

| Scenario | CF Formula | Format |
| --- | --- | --- |
| Overdue tasks | =$D2<TODAY() | Red fill on due date |
| Due this week | =AND($D2>=TODAY(),$D2<=TODAY()+7) | Orange fill |
| Completed tasks | =$E2="Done" | Green fill + strikethrough on row |
| High priority | =$C2="High" | Bold red font on task name |

Dashboard Design Tips
- Use CF not helper columns — CF formulas evaluate inline — no extra columns clutter your sheet.
- Combine CF types — Color Scale + Data Bars on adjacent columns creates powerful visual density.
- Named ranges in CF — =D2>TargetRevenue instead of =D2>300000 — dynamic and maintainable.
- 3 colours max per table — Red / Yellow / Green is universal — avoid rainbow tables.
- Test with blank cells — Empty cells return 0 — verify your formula handles blanks correctly.
- Add a colour legend — Add a text note: 'Green>3L, Yellow 2-3L, Red<2L' near your table.
- Protect CF before sharing — Review → Protect Sheet — prevents others from accidentally deleting rules.
- Avoid CF on full columns — Apply to A2:E500 not A:E — full-column CF slows down large files.

## 4 CF types layered on one sales table — colour, bars, icons, highlightsHR sheet flags absences, late arrivals, and weekend columns automaticallyInventory alerts fire dynamically as stock levels changeProject tracker highlights overdue, due-this-week, and completed rowsOUTCOMES — What you will see in Excel


## 12.10. QUICK REFERENCE & KEYBOARD SHORTCUTS

Keyboard Shortcuts

| Shortcut / Action | What It Does |
| --- | --- |
| Alt → H → L | Open Conditional Formatting dropdown |
| Alt → H → L → N | New Rule dialog |
| Alt → H → L → M | Manage Rules dialog (priority, edit, delete) |
| Alt → H → L → C → S | Clear CF from Selected cells only |
| Alt → H → L → C → E | Clear CF from Entire sheet |
| Alt → H → F → P | Format Painter — copy CF to new range |
| Ctrl + Z | Undo last CF action |
| Ctrl + G → Special → Conditional Formats | Select ALL cells with CF in the sheet |
| F2 (in formula box) | Edit CF formula — shows colour-coded cell references |

Common Mistakes & Fixes

| Mistake | Cause | Fix |
| --- | --- | --- |
| CF applies to wrong rows | Missing $ on column reference | Use =$D2 not =D2 — lock column, free row |
| CF never firesFo | rmula doesn't return TRUE/FALSE | Ensure result is boolean, not text or 0/1 |
| Entire range same colour | Fully locked ref =$D$2 | Remove row lock: change $D$2 → $D2 |
| CF slows the file | Rules applied to full columns | Apply to A2:E500, never A:A or entire columns |
| Rules lost after paste | Paste overwrites formats | Use Paste Special → Values only |
| Date rule fires wrong | Dates stored as text | Use DATEVALUE() or Text to Columns to fix |
| Icons not showing correctly | Threshold type mismatch | Check 'Type' = Number vs Percent vs Percentile |

Complete Skill Checklist
✔Apply a 3-Color Scale (Green-Yellow-Red heat map)
✔Apply Data Bars — gradient and solid fill variants
✔Configure Data Bar axis for negative values
✔Apply 'Greater Than' Highlight Rule with custom format colour
✔Apply 'Duplicate Values' rule to detect data quality issues
✔Apply Icon Set (3-arrow) with custom numeric thresholds
✔Change Icon Set Type to 'Formula' for dynamic thresholds
✔Apply Top 10 / Bottom 10 rules to a sales column
✔Apply 'Above Average' rule to a KPI column
✔Write a custom formula CF to highlight entire rows (=$D2>300000)
✔Use AND() in CF formula for multi-condition row highlight
✔Use OR() in CF formula for either-or conditions
✔Use TODAY() for overdue date highlighting (updates daily)
✔Use COUNTIF() for duplicate detection via formula
✔Use MOD(ROW(),2) for alternating zebra-stripe rows
✔Use LARGE() for dynamic top-N highlighting
✔Open Manage Rules and reorder rule priority
✔Apply 'Stop If True' to prevent rule conflicts
✔Copy CF rules using Format Painter to new ranges
✔Clear CF from a range and from entire sheet
Master Conditional Formatting — and your spreadsheets will always tell their own story.`,

14: `# Data Cleaning Tools

Data cleaning means fixing errors, removing unwanted spaces or duplicates, and organising raw data so Excel can process it correctly. These tools save hours of manual work.

## Text-to-Columns

This tool splits one column of text into multiple columns. For example, a cell that says "John Smith"
can be split into a First Name column and a Last Name column.
When to use it: When data is combined in one cell but you need it separated — names, addresses, dates imported from another system.

#### Two Ways to Split

| Split Method | What It Does | Example |
| --- | --- | --- |
| Delimited | Splits at a specific character (comma, space, dash, etc.) | "John,Smith" → John / Smith |
| Fixed Width | Splits at a specific position (character number) | "20240315" → 2024 / 03 / 15 |


#### Step-by-Step: Split 'First Last' names

- A3: Peter B3: Brown Warning: Always copy your data to a new column first — Text to Columns overwrites the original column.A3: Peter B3: Brown Warning: Always copy your data to a new column first — Text to Columns overwrites the original column.Sample Data (Column A):A1: John Smith A2: Mary Johnson A3: Peter BrownSteps:Select column AGo to: Data tab → Text to ColumnsChoose: Delimited → NextTick: Space → Next → FinishResult:A1: John B1: Smith A2: Mary B2: JohnsonSample Data (Column A):A1: John Smith A2: Mary Johnson A3: Peter BrownSteps:Select column AGo to: Data tab → Text to ColumnsChoose: Delimited → NextTick: Space → Next → FinishResult:A1: John B1: Smith A2: Mary B2: JohnsonExample — Split Full Name into First & Last

## Find & Replace

Find & Replace lets you search for a specific word or value anywhere in your spreadsheet and replace it with something else. It can search in one sheet or the entire workbook.

#### Keyboard Shortcut: Ctrl + HOR: Home tab → Editing group → Find & Select → ReplaceKeyboard Shortcut: Ctrl + HOR: Home tab → Editing group → Find & Select → ReplaceHow to Open

Practical Examples

| Find This | Replace With | Why |
| --- | --- | --- |
| N/A | 0 | Convert text to number for calculations |
| United States | USA | Standardise country names |
| 01-01-2024 | 01/01/2024 | Fix date format |
| (extra space) | (nothing) | Remove leading spaces |

Tip: Use Match entire cell contents option to avoid replacing parts of words (e.g. replacing 'an' inside 'January').
Tip: Wildcards work in Find: * = any text, ? = any one character. Example: J*n matches 'John', 'Jan', 'Jason'.

## Remove Blanks

Blank (empty) cells cause problems in calculations, sorting, and charts. There are several ways to find and remove them.

#### Method 1 — Go To Special (fastest)

5. Right-click → Delete → Shift cells up5. Right-click → Delete → Shift cells upSteps:Select your data range (e.g. A1:A20)Press: Ctrl + G → Click SpecialSelect: Blanks → OKAll blank cells are now selectedSteps:Select your data range (e.g. A1:A20)Press: Ctrl + G → Click SpecialSelect: Blanks → OKAll blank cells are now selectedRemove Blank Cells

#### Method 2 — Filter & Delete

- Add a Filter: Data → FilterClick the dropdown arrow on your columnUncheck everything except (Blanks)Select all visible (blank) rowsRight-click → Delete RowRemove the filterAdd a Filter: Data → FilterClick the dropdown arrow on your columnUncheck everything except (Blanks)Select all visible (blank) rowsRight-click → Delete RowRemove the filterFilter-Based Removal

#### Method 3 — Formula to Flag Blanks

- =IF(A2="", "BLANK", "OK")Drag this formula down column B to tag each row. Then filter by 'BLANK' and delete those rows.=IF(A2="", "BLANK", "OK")Drag this formula down column B to tag each row. Then filter by 'BLANK' and delete those rows.Formula Flag

## Remove Duplicates

Duplicate rows happen when the same record is entered more than once. Excel has a built-in tool to find and delete them automatically.

#### Sample Data Before & After

| ID | Name | City |
| --- | --- | --- |
| 101 | Arjun | Hyderabad |
| 102 | Priya | Mumbai |
| 101 | Arjun | Hyderabad |
| 103 | Ravi | Delhi |
| 102 | Priya | Mumbai |

Rows 3 and 5 are duplicates of rows 1 and 2. After removing duplicates, only 3 unique rows remain.

#### Steps to Remove Duplicates

- Remove Duplicates Tool
(check all columns to match entire row)Click OKExcel shows: '2 duplicate values removed' Warning: Excel keeps the FIRST occurrence and deletes the rest. Always make a backup copy before removing duplicates.(check all columns to match entire row)Click OKExcel shows: '2 duplicate values removed' Warning: Excel keeps the FIRST occurrence and deletes the rest. Always make a backup copy before removing duplicates.Click anywhere inside your data tableGo to: Data tab → Remove DuplicatesChoose which columns to checkClick anywhere inside your data tableGo to: Data tab → Remove DuplicatesChoose which columns to check

#### Formula: Check If a Value Is Duplicate

- =COUNTIF($A$2:$A$10, A2) > 1Returns TRUE if the value in A2 appears more than once. Drag down to check every row.=COUNTIF($A$2:$A$10, A2) > 1Returns TRUE if the value in A2 appears more than once. Drag down to check every row.Highlight Duplicates Formula

## Flash Fill

Flash Fill is Excel's smart auto-complete. It learns the pattern from your example and fills the rest automatically — no formula needed!
Shortcut: Ctrl + E OR Data tab → Flash Fill

#### Example 1 — Extract First Name

| Column A (Full Name) | Column B (You Type) | Flash Fill Completes |
| --- | --- | --- |
| Arjun Sharma | Arjun  type this |  |
| Priya Patel | (press Ctrl+E) | Priya |
| Ravi Kumar |  | Ravi |
| Sunita Reddy |  | Sunita |


#### Example 2 — Format Phone Numbers

| Column A (Raw) | Column B (Your Pattern) | Flash Fill Result |
| --- | --- | --- |
| 9876543210 | 98765-43210  type |  |
| 8123456789 | (Ctrl+E) | 81234-56789 |
| 7001234567 |  | 70012-34567 |


#### More Flash Fill Use Cases

- Combine: First + Last → Full NameColumn A: Arjun Column B: SharmaCombine: First + Last → Full NameColumn A: Arjun Column B: SharmaTip: Flash Fill works best when your data has a very consistent pattern. If results look wrong, undo and try a different example.Change case (partial):A1: john smith → B1: John SmithReformat dates:A1: 20240115 → B1: 15-01-2024Extract domain from email:A1: arjun@gmail.com → B1: gmail.comColumn C: Type 'Arjun Sharma', press Ctrl+ETip: Flash Fill works best when your data has a very consistent pattern. If results look wrong, undo and try a different example.Change case (partial):A1: john smith → B1: John SmithReformat dates:A1: 20240115 → B1: 15-01-2024Extract domain from email:A1: arjun@gmail.com → B1: gmail.comColumn C: Type 'Arjun Sharma', press Ctrl+EMore Flash Fill Patterns

## Cleaning Messy Data Using Formulas

Sometimes data is not clean — it has extra spaces, wrong cases, or unwanted characters. These built-in Excel functions fix those problems quickly.

### TRIM

Removes extra spaces (keeps single spaces between words)
Formula 1: =TRIM(" Hello World ") Result: "Hello World"Formula 2: =TRIM(A2)Use case: Remove spaces from text in A2

### CLEAN

Removes non-printable characters (invisible symbols from imports)
Formula 1: =CLEAN(A2) Result: Clean textFormula 2: =CLEAN(A2)Use case: Remove hidden characters

### UPPER

Converts text to ALL UPPERCASE
Formula 1: =UPPER("hyderabad") Result: "HYDERABAD"Formula 2: =UPPER(A2)Use case: Uppercase city names

### LOWER

Converts text to all lowercase
Formula 1: =LOWER("INDIA")Result: "india"Formula 2: =LOWER(A2)Use case: Lowercase product codes

### PROPER

Capitalises First Letter Of Each Word
Formula 1: =PROPER("arjun sharma") Result: "Arjun Sharma"Formula 2: =PROPER(A2)Use case: Fix customer names

### SUBSTITUTE

Replaces specific text inside a cell
Formula 1: =SUBSTITUTE(A2, "-", "/")Result: Replaces - with /Formula 2: =SUBSTITUTE(A2," ","")Use case: Remove all spaces

### LEN

Counts the number of characters in a cell
Formula 1: =LEN(A2) Result: Returns a numberFormula 2: =LEN(A2)Use case: Check if text is too long

### LEFT / RIGHT / MID

Extract part of text
Formula 1: =LEFT(A2, 3) Result: First 3 charactersFormula 2: =MID(A2, 5, 4)Use case: 4 chars starting at position 5

#### Combine Formulas for Power Cleaning

- Clean + Trim + Proper all at once:=PROPER(TRIM(CLEAN(A2)))What it does step by step:CLEAN(A2) → removes hidden characters TRIM(...) → removes extra spaces PROPER(...) → fixes capitalisationExample:A2: " arjun sharma " (hidden char + spaces) Result: "Arjun Sharma"Clean + Trim + Proper all at once:=PROPER(TRIM(CLEAN(A2)))What it does step by step:CLEAN(A2) → removes hidden characters TRIM(...) → removes extra spaces PROPER(...) → fixes capitalisationExample:A2: " arjun sharma " (hidden char + spaces) Result: "Arjun Sharma"Nested Formula Example

#### Quick Reference — All Cleaning Formulas

| Formula | Purpose | Example |
| --- | --- | --- |
| TRIM(text) | Remove extra spaces | =TRIM(A2) |
| CLEAN(text) | Remove invisible chars | =CLEAN(A2) |
| UPPER(text) | ALL CAPS | =UPPER(A2) |

| LOWER(text) | all lowercase | =LOWER(A2) |
| --- | --- | --- |
| PROPER(text) | Title Case | =PROPER(A2) |
| SUBSTITUTE(text,"old","new") | Replace specific text | =SUBSTITUTE(A2,"-","") |
| LEN(text) | Count characters | =LEN(A2) |
| LEFT(text, n) | First n characters | =LEFT(A2,3) |
| RIGHT(text, n) | Last n characters | =RIGHT(A2,4) |
| MID(text, start, n) | Middle characters | =MID(A2,5,3) |
`,

15: `# Intermediate Charts

Charts turn numbers into pictures. Intermediate charts help you show comparisons, distributions, and relationships that basic bar or pie charts cannot capture.

## Combo Charts

A Combo Chart combines two different chart types in one — usually a Bar Chart for one data series and a Line Chart for another. This lets you compare two things that have different scales or units.
Best used for: Showing Sales (bars) and Profit Margin % (line) together on the same chart.

#### Sample Data

| Month | Sales (₹) | Profit Margin (%) |
| --- | --- | --- |
| Jan | ₹ 1,20,000 | 18% |
| Feb | ₹ 95,000 | 15% |
| Mar | ₹ 1,45,000 | 22% |
| Apr | ₹ 1,10,000 | 20% |
| May | ₹ 1,60,000 | 25% |


#### Steps to Create a Combo Chart

- Tip: Use a secondary axis whenever the two data series have very different value ranges. Without it, the line will look flat near zero.Tip: Use a secondary axis whenever the two data series have very different value ranges. Without it, the line will look flat near zero.Select all data: A1:C6Insert → Charts → See All ChartsClick the 'Combo' tab (last tab)Set Sales → Clustered ColumnSet Profit Margin → LineTick 'Secondary Axis' for Profit MarginClick OKWhy Secondary Axis?Sales is in thousands (e.g. 1,20,000) Margin is a % (e.g. 18%)They need separate Y-axis scales!Select all data: A1:C6Insert → Charts → See All ChartsClick the 'Combo' tab (last tab)Set Sales → Clustered ColumnSet Profit Margin → LineTick 'Secondary Axis' for Profit MarginClick OKWhy Secondary Axis?Sales is in thousands (e.g. 1,20,000) Margin is a % (e.g. 18%)They need separate Y-axis scales!Create Combo Chart

![Combo chart with secondary axis](/Excel_images/eimg17.png)


## Histogram

A Histogram shows how data is distributed across ranges (called bins). It looks like a bar chart, but the bars touch each other and represent value ranges, not categories.
Best used for: Exam scores, age groups, salary ranges, delivery times — any continuous numerical data.

#### Sample Data — Student Exam Scores

| Student | Score |
| --- | --- |
| Arjun | 72 |
| Priya | 88 |
| Ravi | 55 |
| Sunita | 91 |
| Kiran | 67 |
| Meena | 78 |
| Ajay | 82 |
| Kavya | 49 |
| Rohit | 95 |
| Divya | 63 |


#### Steps to Create a Histogram

- Reading the Chart:Bar height = how many students scored in that range Tall bar = most common score rangeReading the Chart:Bar height = how many students scored in that range Tall bar = most common score rangeSelect your score data: B2:B11Insert → Charts → Insert Statistic ChartClick HistogramExcel auto-creates bins (e.g. 40-60, 60-80, 80-100)Customise Bins:Right-click the X-axis → Format AxisSet Bin Width = 10 (for groups of 10)OR set Number of Bins = 5Select your score data: B2:B11Insert → Charts → Insert Statistic ChartClick HistogramExcel auto-creates bins (e.g. 40-60, 60-80, 80-100)Customise Bins:Right-click the X-axis → Format AxisSet Bin Width = 10 (for groups of 10)OR set Number of Bins = 5Create Histogram

#### What the Histogram Tells You

| Score Range | Count | Meaning |
| --- | --- | --- |
| 49–58 | 2 | 2 students scored poorly |
| 58–67 | 2 | Below average |
| 67–77 | 1 | Average range |
| 77–86 | 2 | Good performance |
| 86–95 | 3 | Excellent students |


## Box & Whisker Plot

A Box & Whisker chart shows the spread and distribution of data in five key numbers. It is great for comparing groups and spotting outliers (unusual values).

#### The 5 Numbers (Five-Number Summary)

| Part of Chart | What It Means | Example (Scores: 49–95) |
| --- | --- | --- |
| Minimum (bottom whisker) | Lowest value | 49 |
| Q1 (bottom of box) | 25% of data is below this | 63 |
| Median (line in middle) | Middle value — half above, half below | 75 |
| Q3 (top of box) | 75% of data is below this | 88 |
| Maximum (top whisker) | Highest value | 95 |


#### Steps to Create Box & Whisker

- Select your data (e.g. B2:B11 — the scores)Insert → Charts → Insert Statistic ChartClick Box and WhiskerCompare Two Groups:Add a second column (e.g. Section B scores) Select both columns together before insertingSelect your data (e.g. B2:B11 — the scores)Insert → Charts → Insert Statistic ChartClick Box and WhiskerCompare Two Groups:Add a second column (e.g. Section B scores) Select both columns together before insertingCreate Box & Whisker Chart
Tip: Box & Whisker charts are used in quality control, medical research, and comparing class performance across sections.Reading the chart:Tall box = data is spread out (inconsistent) Short box = data is clustered (consistent) Dots outside whiskers = outliersExcel draws two side-by-side boxes for comparison

![Box and Whisker plot](/Excel_images/eimg19.png)


## Scatter Plot

A Scatter Plot (also called XY Chart) shows the relationship between two numerical variables. Each dot represents one data point. Use it to see if two things are connected.
Best used for: Does advertising spend increase sales? Does study time improve marks? Is temperature linked to ice cream sales?

#### Sample Data — Study Hours vs Exam Score

| Student | Study Hours (X) | Exam Score (Y) |
| --- | --- | --- |
| Arjun | 2 | 55 |
| Priya | 4 | 68 |
| Ravi | 5 | 72 |
| Sunita | 7 | 85 |
| Kiran | 8 | 88 |
| Meena | 10 | 95 |
| Ajay | 3 | 60 |
| Kavya | 6 | 78 |


#### Steps to Create Scatter Plot

- Click any dot on the chartRight-click → Add TrendlineChoose: LinearTick: Display R-squared value on chartClick any dot on the chartRight-click → Add TrendlineChoose: LinearTick: Display R-squared value on chartSelect data: B1:C9 (Hours + Scores)Insert → Charts → Insert Scatter (X,Y) ChartChoose first option: Scatter with only MarkersClick OKAdd a Trendline:Select data: B1:C9 (Hours + Scores)Insert → Charts → Insert Scatter (X,Y) ChartChoose first option: Scatter with only MarkersClick OKAdd a Trendline:Create Scatter Plot

![Scatter plot with trendline](/Excel_images/eimg20.png)


#### How to Read the Pattern

| Pattern | What It Means | Example |
| --- | --- | --- |
| Dots go up-right ■ | Positive relationship | More study = higher score |
| Dots go down-right ■ | Negative relationship | More speed = fewer safety |
| Dots scattered randomly | No relationship | Shoe size vs exam score |
| R² close to 1.0 | Very strong relationship | Hours explain 95% of score variation |
| R² close to 0 | Weak relationship | No pattern found |

Syntax: =SUMIFS(sum_range, criteria_range1, criteria1, criteria_range2, criteria2, …)sum_range: The column to sumcriteria_range1: First column to check a condition againstcriteria1: The condition to check (e.g., "IT", ">50000", A2)Add more criteria_range + criteria pairs for additional conditions`,

16: `# Advanced Formulas

Advanced formulas combine multiple conditions, work with entire arrays of data, and automate complex calculations that would take hours manually.

## 15.1 SUMIFS — Sum with Multiple Conditions

| Goal | SUMIFS Formula |
| --- | --- |
| Total sales in "North" region | =SUMIFS(D2:D100, C2:C100, "North") |
| Sales in North AND March 2024 | =SUMIFS(D2:D100, C2:C100,"North", B2:B100,">=01-Mar-2024") |
| Sales > 10000 in IT department | =SUMIFS(D2:D100, E2:E100,"IT", D2:D100,">10000") |
| Sales for specific product in cell A1 | =SUMIFS(D2:D100, B2:B100, A1) |


## 15.2 COUNTIFS — Count with Multiple Conditions

Syntax: =COUNTIFS(criteria_range1, criteria1, criteria_range2, criteria2, …)Counts rows that match ALL specified conditions. Similar structure to SUMIFS.Example: COUNTIFS Examples=COUNTIFS(C2:C100, "IT", D2:D100, ">50000") -> Count IT employees with salary > 50,000=COUNTIFS(B2:B100, "Active", E2:E100, ">=01-Jan-2024") -> Count active customers joined in 202415.3 AVERAGEIFS — Average with Multiple ConditionsSyntax: =COUNTIFS(criteria_range1, criteria1, criteria_range2, criteria2, …)Counts rows that match ALL specified conditions. Similar structure to SUMIFS.Example: COUNTIFS Examples=COUNTIFS(C2:C100, "IT", D2:D100, ">50000") -> Count IT employees with salary > 50,000=COUNTIFS(B2:B100, "Active", E2:E100, ">=01-Jan-2024") -> Count active customers joined in 202415.3 AVERAGEIFS — Average with Multiple Conditions
Syntax: =SUBTOTAL(function_num, ref1, ref2, …)Performs calculations that IGNORE hidden/filtered rows. Use instead of SUM/AVERAGE when you have AutoFilter applied.Syntax: =SUBTOTAL(function_num, ref1, ref2, …)Performs calculations that IGNORE hidden/filtered rows. Use instead of SUM/AVERAGE when you have AutoFilter applied.Syntax: =AVERAGEIFS(average_range, criteria_range1, criteria1, …)Calculates average of values that meet all specified conditions.Example: AVERAGEIFS Examples=AVERAGEIFS(D2:D100, C2:C100, "Finance") -> Average salary in Finance dept=AVERAGEIFS(D2:D100, C2:C100, "IT", E2:E100, ">5") -> Avg salary in IT with >5 yrs experience15.4 SUBTOTAL — Respects FiltersSyntax: =AVERAGEIFS(average_range, criteria_range1, criteria1, …)Calculates average of values that meet all specified conditions.Example: AVERAGEIFS Examples=AVERAGEIFS(D2:D100, C2:C100, "Finance") -> Average salary in Finance dept=AVERAGEIFS(D2:D100, C2:C100, "IT", E2:E100, ">5") -> Avg salary in IT with >5 yrs experience15.4 SUBTOTAL — Respects Filters

| function_num | Function | Use |
| --- | --- | --- |
| 1 or 101 | AVERAGE | Average of visible rows |
| 2 or 102 | COUNT | Count of visible numeric rows |
| 3 or 103 | COUNTA | Count of all visible non-empty rows |
| 9 or 109 | SUM | Sum of visible rows |
| 4 or 104 | MAX | Max of visible rows |
| 5 or 105 | MIN | Min of visible rows |

Example: SUBTOTAL vs SUMData: 100 rows of sales data. You filter to show only 'North' region (25 rows visible).=SUM(D2:D101) -> Still shows total of ALL 100 rows (includes hidden rows!)=SUBTOTAL(9, D2:D101) -> Shows sum of only the 25 VISIBLE rows 15.5 Dynamic Array Functions (Excel 365)
Dynamic arrays are revolutionary — one formula can return MULTIPLE results, spilling automatically into adjacent cells. No Ctrl+Shift+Enter needed!
FILTER
Syntax: =FILTER(array, include, [if_empty])Returns rows that match a condition. The result automatically spills to multiple rows.Example: FILTER Example=FILTER(A2:D100, C2:C100="IT", "No Results") -> Returns all IT department rows automatically
SORT
Syntax: =SORT(array, [sort_index], [sort_order], [by_col])Returns a sorted version of an array. sort_order: 1=ascending, -1=descending.Example: SORT Example=SORT(A2:B50, 2, -1) -> Returns all rows sorted by column 2 (B), descending
UNIQUE
Syntax: =UNIQUE(array, [by_col], [exactly_once])Returns unique (distinct) values from a range. Eliminates duplicates automatically.Example: UNIQUE Example=UNIQUE(C2:C100) -> Returns list of unique departments (no repeats)
SEQUENCE
Syntax: =SEQUENCE(rows, [cols], [start], [step])Generates a sequence of numbers automatically.Example: SEQUENCE Example=SEQUENCE(12, 1, 1, 1) -> Generates numbers 1 through 12 (perfect for month numbers)`,

17: `# Power Query

Power Query is Excel's built-in ETL (Extract, Transform, Load) tool. It is like a data pipeline — you connect to data sources, clean and transform the data using a visual editor, and load the result into Excel. Every step is recorded so you can refresh data with one click.
How to Open Power QueryHow to Open Power Query
![Power Query interface](/Excel_images/eimg21.png)

- Data tab -> Get Data (to import from a new source)
- Or: Data -> Get & Transform Data section
- Once data is loaded: Data -> Queries & Connections -> double-click a query to edit

## 16.1 Import Data from Various Sources

| Source | How to Connect |
| --- | --- |
| Excel File | Get Data -> From File -> From Excel Workbook |
| CSV / Text File | Get Data -> From File -> From Text/CSV |
| Web (URL) | Get Data -> From Other Sources -> From Web -> paste URL |
| SQL Database | Get Data -> From Database -> From SQL Server |
| Folder | Get Data -> From File -> From Folder -> loads all files in folder |
| SharePoint/OneDrive | Get Data -> From Online Services |
| JSON / XML | Get Data -> From File -> From JSON or From XML |


## 16.2 Key Transformations in Power Query Editor

| Transformation | How to Apply | Use Case |
| --- | --- | --- |
| Remove Columns | Right-click column header -> Remove | Delete unnecessary columns from imported data |

| Transformation | How to Apply | Use Case |
| --- | --- | --- |
| Remove Duplicates | Home -> Remove Rows -> Remove Duplicates | Keep only unique rows |
| Split Column | Transform -> Split Column -> By Delimiter | Split 'Alice Johnson' into First and Last name columns |
| Rename Columns | Double-click column header and type new name | Rename 'col1' to 'Employee_Name' |
| Change Data Type | Click data type icon on column header -> pick type | Change text dates to proper Date type |
| Filter Rows | Click dropdown arrow on column -> filter values | Keep only rows where Status = 'Active' |
| Add Custom Column | Add Column -> Custom Column -> write formula | =Text.Upper([Name]) to make names uppercase |
| Group By | Transform -> Group By -> pick column and aggregation | Group by Department, Sum of Salary |
| Merge Queries | Home -> Merge Queries -> choose second table and join column | JOIN two tables (like SQL JOIN) |
| Append Queries | Home -> Append Queries -> combine tables vertically | Stack Jan, Feb, Mar tables into one |


## 16.3 Merge and Append Queries


## Merge (like SQL JOIN)

Merging combines two queries side-by-side based on a common column — like VLOOKUP but smarter.
- Home -> Merge Queries -> select the second query
- Click the matching column in both tables
- Choose join type: Left Outer, Inner, Full Outer, etc.
- Expand the merged column to show the data you need

## Append (like SQL UNION)

Appending stacks multiple queries on top of each other — combines rows from multiple tables.
- Home -> Append Queries -> Add tables to combine
- Great for combining monthly sales files: Jan_Sales + Feb_Sales + Mar_Sales -> Full_Year_Sales

## 16.4 Refreshing Data

The biggest advantage of Power Query: when your source data changes, just click Refresh and all your transformations run again automatically.
- Right-click a query in Queries & Connections -> Refresh
- Or: Data tab -> Refresh All
- Set automatic refresh: Data -> Connections -> Properties -> Refresh every N minutes
Tip: Power Query remembers every step. In the Applied Steps panel (right side of Query Editor), you can click any step to go back in time and see the data at that stage.`,

18: `# Power Pivot & DAX

Power Pivot extends Excel with a powerful in-memory analytics engine. It allows you to work with millions of rows from multiple tables, define relationships between them (like a database), and create complex calculations using DAX.

## 17.1 Enabling Power Pivot

- File -> Options -> Add-ins -> COM Add-ins -> Go
- Check Microsoft Office Power Pivot for Excel -> OK
- A new 'Power Pivot' tab appears in the ribbon

## 17.2 Data Modelling — Relationships Between Tables

In regular Excel, you need VLOOKUP to connect tables. In Power Pivot, you create relationships between tables — like a database — and the tables work together automatically.
- Load tables into Power Pivot: Power Pivot tab -> Add to Data Model
- Open Power Pivot window: Power Pivot -> Manage
- Create relationship: Home -> Diagram View -> drag a column from one table to another
- One-to-many relationships: one row in Table A links to many rows in Table B
Example: Data Model ExampleTable 1: Sales (SaleID, Date, CustomerID, ProductID, Amount) Table 2: Customers (CustomerID, Name, City, Segment) Table 3: Products (ProductID, ProductName, Category, Price)Create relationships: Sales.CustomerID -> Customers.CustomerIDAnd: Sales.ProductID -> Products.ProductIDNow a single Pivot Table can show Sales by Customer City by Product Category — all from threeseparate tables!17.3 DAX — Data Analysis Expressions
DAX is the formula language of Power Pivot and Power BI. It looks similar to Excel formulas but is much more powerful for analytical calculations.
Calculated Columns vs Measures

| Type | What It Is | Example |
| --- | --- | --- |
| Calculated Column | Adds a new column computed row by row to a table | Profit = [Revenue] - [Cost] |

| Type | What It Is | Example |
| --- | --- | --- |
| Measure | A summary calculation used in Pivot Tables | Total Revenue = SUM(Sales[Amount]) |


## SUM / SUMX

Syntax: =SUM(Sales[Amount])Adds all values in a column.Example: SUM / SUMX ExampleSUMX iterates row by row: =SUMX(Sales, Sales[Qty]*Sales[Price])

## CALCULATE

Syntax: =CALCULATE(expression, filter1, filter2, …)The most important DAX function. Evaluates an expression with modified filter context.Example: CALCULATE Example=CALCULATE(SUM(Sales[Amount]), Region[Name]="North") -> Sum only for North region
AVERAGEX
Syntax: =AVERAGEX(table, expression)Calculates average by evaluating an expression for each row.Example: AVERAGEX Example=AVERAGEX(Sales, Sales[Revenue]-Sales[Cost]) -> Average profit per row
RELATED
Syntax: =RELATED(TableName[ColumnName])Fetches a value from a related table (follows the relationship).Example: RELATED ExampleIn Sales table: =RELATED(Products[Category]) -> Gets the product category for each sale row

## COUNTROWS

Syntax: =COUNTROWS(table) or =COUNTROWS(FILTER(table, condition))Counts the number of rows in a table.
Example: COUNTROWS Example=COUNTROWS(Sales) -> Total number of sales transactions

## 17.4 Time Intelligence Functions

DAX includes powerful functions to calculate Year-to-Date, Quarter-to-Date, Month-to-Date, and year-over-year comparisons.

| Measure | DAX Formula | What It Calculates |
| --- | --- | --- |
| Sales YTD | =TOTALYTD(SUM(Sales[Amount]), Dates[Date]) | Cumulative sales from Jan 1 to current date |
| Sales QTD | =TOTALQTD(SUM(Sales[Amount]), Dates[Date]) | Cumulative sales from start of quarter |
| Sales MTD | =TOTALMTD(SUM(Sales[Amount]), Dates[Date]) | Cumulative sales from start of month |
| Previous Year | =CALCULATE([Total Sales], PREVIOUSYEAR(Dates[Date])) | Same period last year |
| YoY Growth | =[Total Sales]-[Previous Year Sales] | Year over year difference |
`,

19: `# Advanced Lookups & Functions

Mastering advanced lookup combinations gives you the ability to tackle any data retrieval challenge. These techniques are what separate intermediate Excel users from true experts.

## 18.1 Nested Functions

You can put any function inside another function. The inner function is evaluated first, and its result is passed to the outer function.
Example: Nested Function Examples=IF(ISBLANK(A2), "No Data", UPPER(TRIM(A2)))-> Checks if A2 is blank; if not, trims spaces and converts to uppercase.=IFERROR(INDEX(D2:D10, MATCH(A2, B2:B10, 0)), "Not Found")-> INDEX+MATCH with error handling — returns 'Not Found' if lookup fails.18.2 Advanced INDEX + MATCH + MATCH (Two-Way Lookup)Example: Nested Function Examples=IF(ISBLANK(A2), "No Data", UPPER(TRIM(A2)))-> Checks if A2 is blank; if not, trims spaces and converts to uppercase.=IFERROR(INDEX(D2:D10, MATCH(A2, B2:B10, 0)), "Not Found")-> INDEX+MATCH with error handling — returns 'Not Found' if lookup fails.18.2 Advanced INDEX + MATCH + MATCH (Two-Way Lookup)Syntax: =INDEX(table_range, MATCH(row_lookup, row_headers, 0), MATCH(col_lookup, col_headers, 0))Two MATCH functions find the row AND column position simultaneously. INDEX then returns the value atthat intersection — like finding a cell by both its row and column label.Example: Two-Way Lookup ExampleTable B1:E4: Rows = Regions (North/South/East/West), Columns = Quarters (Q1/Q2/Q3/Q4)=INDEX(C2:F5, MATCH("South", B2:B5, 0), MATCH("Q3", C1:F1, 0))-> Returns the sales value at intersection of South row and Q3 column automatically.18.3 INDIRECT — Dynamic Cell ReferencesSyntax: =INDEX(table_range, MATCH(row_lookup, row_headers, 0), MATCH(col_lookup, col_headers, 0))Two MATCH functions find the row AND column position simultaneously. INDEX then returns the value atthat intersection — like finding a cell by both its row and column label.Example: Two-Way Lookup ExampleTable B1:E4: Rows = Regions (North/South/East/West), Columns = Quarters (Q1/Q2/Q3/Q4)=INDEX(C2:F5, MATCH("South", B2:B5, 0), MATCH("Q3", C1:F1, 0))-> Returns the sales value at intersection of South row and Q3 column automatically.18.3 INDIRECT — Dynamic Cell ReferencesSyntax: =INDIRECT(ref_text, [a1])Converts a text string into a real cell reference. Useful for building dynamic range references.Example: INDIRECT ExampleIf A1 contains the text 'Sheet2!B5':=INDIRECT(A1) -> Returns the value in Sheet2 cell B5=SUM(INDIRECT("Sheet"&A1;&"!B2:B100")) -> Sums data from a sheet whose name is in cell A1Syntax: =INDIRECT(ref_text, [a1])Converts a text string into a real cell reference. Useful for building dynamic range references.Example: INDIRECT ExampleIf A1 contains the text 'Sheet2!B5':=INDIRECT(A1) -> Returns the value in Sheet2 cell B5=SUM(INDIRECT("Sheet"&A1;&"!B2:B100")) -> Sums data from a sheet whose name is in cell A1

## 18.4 OFFSET Function

Syntax: =OFFSET(reference, rows, cols, [height], [width])reference: Starting cellrows: How many rows to move (positive=down, negative=up) cols: How many columns to move (positive=right, negative=left) height: Number of rows in the returned rangewidth: Number of columns in the returned rangeExample: OFFSET Examples=OFFSET(A1, 3, 2) -> Returns value 3 rows down and 2 columns right of A1 (= C4)=SUM(OFFSET(A1, 0, 0, 5, 1)) -> Sums 5 rows starting from A1 (A1:A5)Dynamic range: =SUM(OFFSET(A1, 0, 0, COUNTA(A:A), 1)) -> Auto-expands as you add data18.5 Array Formulas (Ctrl+Shift+Enter)
Array formulas perform calculations on entire arrays (ranges) at once. In older Excel, you press Ctrl+Shift+Enter instead of just Enter (shows {curly braces}). In Excel 365, most arrays work with just Enter due to dynamic arrays.
Example: Array Formula — Sum of ProductsGoal: Multiply Qty × Price for each row, then sum all the results in ONE formula.=SUM(B2:B10 * C2:C10) -> In Excel 365: press EnterIn older Excel: press Ctrl+Shift+Enter -> Shows as {=SUM(B2:B10*C2:C10)} This replaces the need for a helper column with =B2*C2 in each row.`,

20: `# Dashboard Building

An Excel Dashboard is a single-screen visual summary of your most important data and KPIs. It combines charts, tables, cards, and filters into an interactive reporting tool.

## 19.1 Design Principles for a Good Dashboard

- One screen — everything visible without scrolling (design for a laptop screen)
- 5-second rule — the key insight should be obvious in 5 seconds
- Clean layout — consistent fonts, aligned elements, breathing space
- Color meaning — Green=good/on track, Red=bad/alert, Yellow=warning
- Title & context — always include the reporting period and data source

## 19.2 KPI Cards

KPI cards are simple boxes that show one key number prominently — like revenue, number of orders, or growth percentage.
- Use a single large merged cell for the number
- Add a formula label below: =IF(B2>B3, "▲ Up", "▼ Down")
- Use conditional formatting or font color to make it green (positive) or red (negative)
- Border the card with a colored border matching your theme

## 19.3 Slicers — Visual Filters

Slicers are clickable buttons that filter Pivot Tables (and Pivot Charts) instantly. They make dashboards interactive without any VBA coding.
- Click inside a Pivot Table -> PivotTable Analyze -> Insert Slicer
- Select the field to slice by (e.g., Region, Year, Product Category)
- A panel of buttons appears — click any button to filter the Pivot Table
- Connect one slicer to multiple Pivot Tables: right-click slicer -> Report Connections -> select all tables
- Style slicers: Slicer tab -> Slicer Styles — match your dashboard color theme

## 19.4 Timeline Filters

Timeline is like a Slicer but specifically for date fields — it shows a visual date bar you can drag.
- Click Pivot Table -> PivotTable Analyze -> Insert Timeline
- Select your date field -> OK
- Use the dropdown to switch between Years, Quarters, Months, Days
- Drag the handles to select a date range

## 19.5 Building the Dashboard — Step by Step

- Step 1 — Prepare Data: Clean your raw data, put it in an Excel Table (Ctrl+T)
- Step 2 — Build Pivot Tables: Create one Pivot Table for each chart/table in the dashboard
- Step 3 — Create Charts: Build Pivot Charts from the Pivot Tables
- Step 4 — Create a Dashboard Sheet: Insert a new sheet, name it 'Dashboard'
- Step 5 — Cut and Paste Charts: Move all charts to the Dashboard sheet
- Step 6 — Add Slicers and Timelines: Connect them to all relevant Pivot Tables
- Step 7 — Add KPI Cards: Reference key metrics using cell formulas
- Step 8 — Style and Design: Match colors, align elements, remove gridlines (View -> Gridlines)
- Step 9 — Hide Raw Data sheets: Right-click sheet tab -> Hide
- Step 10 — Protect and Share: Review -> Protect Sheet to prevent accidental changes
Tip: Press Ctrl+\` (backtick) to toggle between showing formula results and showing formulas. Remove gridlines from the dashboard sheet: View -> uncheck Gridlines. This makes the dashboard look much cleaner and more professional.
A complete dashboard design refer youtube link : https://youtu.be/8DJCfuf8k54
Datasets and more dashboard find here : https://drive.google.com/drive/folders/1tqE4m5hpZn8xT7A2e3ISKVZILjgFIK97?usp=sharing`,

21: `# Scenario & What-If Analysis

What-If Analysis tools let you explore different scenarios and see how changes in inputs affect your outputs
- without changing your original data. Essential for business planning, financial modelling, and decision making.

## 20.1 Goal Seek — Work Backwards from a Target

Goal Seek answers: 'What input value do I need to achieve a specific output result?'
- Data -> What-If Analysis -> Goal Seek
- Set Cell: The cell with your formula (output)
- To Value: The target result you want
- By Changing Cell: The input cell to adjust
- Click OK — Excel back-calculates the required input
Example: Goal Seek ExampleScenario: You need a profit of ₹50,000. Your profit formula is =Revenue - Costs. Set Cell: C5 (Profit formula) | To Value: 50000 | By Changing Cell: B3 (Revenue) Excel calculates: 'You need Revenue of ₹ 1,35,000 to achieve ₹ 50,000 profit'Loan EMI Example: Set Cell: EMI formula | To Value: 20000 | By Changing Cell: Loan Amount-> 'Maximum loan amount for an EMI of ₹ 20,000'20.2 Data Tables — Test Multiple Scenarios at Once
Data Tables let you see the results of a formula for many different input values at once — creating a sensitivity analysis matrix.

## One-Variable Data Table

- Set up a column of input values next to (or above) your formula
- Select the range including inputs and formula
- Data -> What-If Analysis -> Data Table -> Column Input Cell (or Row Input Cell)

## Two-Variable Data Table

- Set up rows of one variable and columns of another variable
- Put your formula at the intersection
- Data -> What-If Analysis -> Data Table -> specify both Row and Column Input Cells
Example: Two-Variable Data Table ExampleRows: Different interest rates (6%, 7%, 8%, 9%, 10%) Columns: Different loan amounts (₹5L, ₹10L, ₹15L, ₹20L) Formula at intersection: =PMT(rate, 240, -loan_amount)Result: A matrix showing the EMI for every combination of rate and amount.20.3 Scenario Manager — Save and Compare Multiple Scenarios
Scenario Manager lets you save named sets of input values and switch between them instantly. You can create a Scenario Summary Report that shows all scenarios side by side.
- Data -> What-If Analysis -> Scenario Manager
- Click Add -> name the scenario (e.g., 'Optimistic', 'Pessimistic', 'Base Case')
- Select the cells that change in this scenario and enter their values
- Add more scenarios (Pessimistic: lower values, etc.)
- Click Summary to generate a Scenario Summary report automatically
Example: Scenario Manager ExampleChanging Cells: B2=Revenue, B3=Cost, B4=Tax RateOptimistic Scenario: Revenue=2,00,000 | Cost=80,000 | Tax=15%Base Case: Revenue=1,50,000 | Cost=90,000 | Tax=18%Pessimistic: Revenue=1,00,000 | Cost=95,000 | Tax=20%Scenario Summary shows all three side by side with resulting Profit figures.`,

22: `# External Data Connections

Modern data analysis requires connecting Excel to external data sources — databases, APIs, and cloud platforms. Excel can pull live data so your reports update automatically.

## 21.1 Importing from SQL Databases

- Data -> Get Data -> From Database -> From SQL Server Database
- Enter the server name and database name
- Authenticate (Windows or SQL Server credentials)
- Power Query opens — select the table or write a custom SQL query
- Example: SQL Connection ExampleServer: company-sql-server.database.windows.net Database: SalesDBCustom SQL: SELECT CustomerID, Name, TotalOrders, Revenue FROM dbo.Customers WHERERegion='South'Click Refresh to get the latest data from the database at any time.Example: SQL Connection ExampleServer: company-sql-server.database.windows.net Database: SalesDBCustom SQL: SELECT CustomerID, Name, TotalOrders, Revenue FROM dbo.Customers WHERERegion='South'Click Refresh to get the latest data from the database at any time.Click Load — data comes into Excel (or the Data Model for Power Pivot)

| Database Type | How to Connect in Excel |
| --- | --- |
| SQL Server | Get Data -> From Database -> From SQL Server |
| MySQL | Get Data -> From Database -> From MySQL Database (requires driver) |
| PostgreSQL | Get Data -> From Database -> From PostgreSQL |
| Oracle | Get Data -> From Database -> From Oracle Database |
| Access (MDB) | Get Data -> From File -> From Microsoft Access Database |
| Azure SQL | Get Data -> Azure -> Azure SQL Database |


## 21.2 Connecting to Web APIs

Excel's Power Query can connect to any public REST API that returns JSON or XML data.
- Data -> Get Data -> From Other Sources -> From Web
- Enter the API URL (e.g., https://api.exchangerate.host/latest?base=USD)
- Power Query loads the JSON response
- Expand nested JSON objects using the expand icon in column headers
- Transform the data and load to Excel
Example: API Connection ExampleConnect to a currency exchange rate API:URL: https://api.exchangerate-api.com/v4/latest/USDPower Query parses the JSON, shows a table of currency codes and rates. Click Refresh -> gets today's live exchange rates automatically.Use these rates in your financial model formulas.21.3 Refreshable Data Sources — Keep Data Up to Date
The power of external connections is refreshability — your Excel report stays current.

| Refresh Option | How to Use | Best For |
| --- | --- | --- |
| Manual Refresh | Data -> Refresh All (or Ctrl+Alt+F5) | On-demand updates |
| Auto Refresh on Open | Query Properties -> Refresh data when file is opened | Daily reports |
| Scheduled Refresh | Set in Power BI Service or use Task Scheduler with VBA | Automated pipelines |
| Background Refresh | Query Properties -> Enable background refresh | Large datasets |


## Quick Reference — Where to Connect What

| Data Need | Best Tool | How |
| --- | --- | --- |
| Clean a CSV file | Power Query | Get Data -> From File -> From CSV |
| Combine 12 monthly Excel files | Power Query + Append | Get Data -> From Folder |
| Pull from SQL Server | Power Query / Power Pivot | Get Data -> From Database |
| Live stock/currency prices | Web API connection | Get Data -> From Web -> API URL |
| Millions of rows from database | Power Pivot (Data Model) | Load to Data Model option |
| Automate monthly report | Power Query + Refresh All | Schedule with Task Scheduler |
| Real-time dashboard | Power BI (export from Excel) | Publish to Power BI Service |


## Essential Excel Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| Ctrl + S | Save workbook |
| Ctrl + Z / Y | Undo / Redo |
| Ctrl + C / X / V | Copy / Cut / Paste |
| Ctrl + B / I / U | Bold / Italic / Underline |
| Ctrl + 1 | Open Format Cells dialog |
| Ctrl + T | Create Table from data |
| Ctrl + Shift + L | Toggle AutoFilter |
| Ctrl + F | Find (search in sheet) |
| Ctrl + H | Find & Replace |
| Ctrl + G -> Special | Go To Special (blanks, formulas, etc.) |
| Ctrl + End | Go to last used cell |
| Ctrl + Home | Go to A1 |
| Ctrl + Arrow Key | Jump to edge of data region |
| Ctrl + Shift + End | Select to last used cell |
| Alt + = | AutoSum (inserts =SUM() formula) |
| F4 | Toggle absolute/relative reference in formula |
| F2 | Edit active cell (go into formula editing mode) |
| F5 | Go To dialog |
| F11 | Create chart on new sheet |
| Alt + F1 | Create chart on current sheet |
| Ctrl + E | Flash Fill |
| Ctrl + D | Fill Down (copy cell above) |
| Ctrl + R | Fill Right (copy cell to the left) |
| Ctrl + Shift + + | Insert row/column |
| Ctrl + - | Delete row/column |
| Alt + H + O + I | AutoFit column width |
| Ctrl + ; | Insert todays date |
| Ctrl + Shift + ; | Insert current time |

| Shortcut | Action |
| --- | --- |
| Ctrl + \` | Toggle show formulas / values |
| Alt + Enter | New line inside a cell (wrap text manually) |
`,

};

export default excelContent;
