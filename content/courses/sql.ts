// Lesson content for SQL course (indexed by lesson order, 1-based)
const sqlContent: Record<number, string> = {
  1: `## Introduction to SQL

SQL (Structured Query Language) is the standard language for managing and querying relational databases.

## What is a Relational Database?

Data is organized into **tables** (like spreadsheets) with rows and columns. Tables relate to each other through **keys**.

| id | name  | dept_id | salary |
|----|-------|---------|--------|
| 1  | Alice | 2       | 75000  |
| 2  | Bob   | 1       | 60000  |
| 3  | Carol | 2       | 80000  |

## Basic SELECT

\`\`\`sql
-- Select all columns from a table
SELECT * FROM employees;

-- Select specific columns
SELECT name, salary FROM employees;

-- Give columns an alias
SELECT name AS employee_name, salary AS monthly_pay
FROM employees;
\`\`\`

## WHERE Clause

Filter rows based on conditions:

\`\`\`sql
SELECT name, salary
FROM employees
WHERE salary > 70000;

SELECT * FROM employees
WHERE dept_id = 2;
\`\`\`

## SQL Statement Order

Always written in this order:
\`\`\`
SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT
\`\`\``,

  2: `## Filtering Data

## Comparison Operators

\`\`\`sql
WHERE age > 25
WHERE age >= 18
WHERE salary < 50000
WHERE salary <= 75000
WHERE name = 'Alice'
WHERE name != 'Bob'    -- or  <>
\`\`\`

## Range and List

\`\`\`sql
-- BETWEEN (inclusive)
WHERE salary BETWEEN 40000 AND 80000

-- IN — match any value in a list
WHERE city IN ('NYC', 'LA', 'Chicago')
WHERE dept_id IN (1, 2, 5)

-- NOT IN
WHERE status NOT IN ('inactive', 'deleted')
\`\`\`

## NULL Checks

\`\`\`sql
WHERE email IS NULL
WHERE phone IS NOT NULL
\`\`\`

> Never use \`= NULL\` — always use \`IS NULL\`.

## Pattern Matching with LIKE

\`\`\`sql
WHERE name LIKE 'A%'       -- starts with A
WHERE name LIKE '%son'     -- ends with son
WHERE name LIKE '%ali%'    -- contains "ali"
WHERE code LIKE 'CS__'     -- CS followed by exactly 2 chars
\`\`\`

## Logical Operators

\`\`\`sql
-- AND — both conditions must be true
WHERE age > 25 AND department = 'Engineering'

-- OR — at least one condition
WHERE city = 'NYC' OR city = 'LA'

-- NOT — negate a condition
WHERE NOT status = 'inactive'

-- Combining with parentheses
WHERE (city = 'NYC' OR city = 'LA') AND salary > 60000
\`\`\``,

  3: `## Sorting and Limiting

## ORDER BY

Sort results by one or more columns:

\`\`\`sql
-- Ascending (default)
SELECT name, salary FROM employees
ORDER BY salary ASC;

-- Descending
SELECT name, salary FROM employees
ORDER BY salary DESC;

-- Multiple columns — sorts by first, then second for ties
SELECT name, department, salary FROM employees
ORDER BY department ASC, salary DESC;
\`\`\`

## LIMIT and OFFSET

Control how many rows are returned:

\`\`\`sql
-- Top 10 highest paid
SELECT name, salary FROM employees
ORDER BY salary DESC
LIMIT 10;

-- Pagination: page 3 with 10 per page
SELECT * FROM products
ORDER BY price ASC
LIMIT 10 OFFSET 20;   -- skip 20, take next 10
\`\`\`

## DISTINCT

Remove duplicate values:

\`\`\`sql
-- All unique departments
SELECT DISTINCT department FROM employees;

-- Unique combinations
SELECT DISTINCT city, department FROM employees;
\`\`\`

## Practical Example

Find the top 5 best-paid employees in the Engineering department:

\`\`\`sql
SELECT name, salary
FROM employees
WHERE department = 'Engineering'
ORDER BY salary DESC
LIMIT 5;
\`\`\``,

  4: `## Aggregate Functions

Aggregate functions perform calculations on a set of rows and return a single value.

## Common Aggregates

\`\`\`sql
SELECT COUNT(*) FROM employees;           -- total rows
SELECT COUNT(email) FROM employees;       -- non-null emails
SELECT AVG(salary) FROM employees;        -- average salary
SELECT SUM(sales) FROM orders;            -- total sales
SELECT MAX(salary) FROM employees;        -- highest salary
SELECT MIN(salary) FROM employees;        -- lowest salary
\`\`\`

## GROUP BY

Group rows by a column and apply aggregates to each group:

\`\`\`sql
SELECT department, COUNT(*) AS headcount, AVG(salary) AS avg_salary
FROM employees
GROUP BY department;
\`\`\`

Result:
| department  | headcount | avg_salary |
|-------------|-----------|------------|
| Engineering | 12        | 85000      |
| Marketing   | 8         | 65000      |
| HR          | 5         | 55000      |

## HAVING

Filter **groups** (like WHERE but applied after GROUP BY):

\`\`\`sql
-- Departments with more than 5 employees
SELECT department, COUNT(*) AS headcount
FROM employees
GROUP BY department
HAVING COUNT(*) > 5;

-- Departments where avg salary > 70000
SELECT department, AVG(salary) AS avg_sal
FROM employees
GROUP BY department
HAVING AVG(salary) > 70000
ORDER BY avg_sal DESC;
\`\`\`

> **WHERE vs HAVING:**
> - WHERE filters rows **before** grouping
> - HAVING filters groups **after** grouping`,

  5: `## JOINs

JOINs combine rows from two or more tables based on a related column.

## Sample Tables

**employees**
| id | name  | dept_id |
|----|-------|---------|
| 1  | Alice | 2       |
| 2  | Bob   | NULL    |

**departments**
| id | name        |
|----|-------------|
| 1  | HR          |
| 2  | Engineering |
| 3  | Marketing   |

## INNER JOIN

Returns only rows with a match in **both** tables:

\`\`\`sql
SELECT e.name, d.name AS department
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id;
\`\`\`
Result: Alice + Engineering (Bob excluded, no dept_id)

## LEFT JOIN

All rows from left table, matched rows from right (NULLs where no match):

\`\`\`sql
SELECT e.name, d.name AS department
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.id;
\`\`\`
Result: Alice + Engineering, Bob + NULL

## RIGHT JOIN

All rows from right table, matched from left:

\`\`\`sql
SELECT e.name, d.name AS department
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.id;
\`\`\`
Result: Alice + Engineering, NULL + HR, NULL + Marketing

## FULL OUTER JOIN

All rows from **both** tables, NULLs where no match:

\`\`\`sql
SELECT e.name, d.name AS department
FROM employees e
FULL OUTER JOIN departments d ON e.dept_id = d.id;
\`\`\`

## Self JOIN

Join a table to itself (e.g., employee → manager):

\`\`\`sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
\`\`\``,

  6: `## Subqueries

A subquery is a query nested inside another query.

## Scalar Subquery (single value)

\`\`\`sql
-- Employees earning above average salary
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
\`\`\`

## IN Subquery

\`\`\`sql
-- Employees in NY-based departments
SELECT name
FROM employees
WHERE dept_id IN (
    SELECT id FROM departments WHERE location = 'New York'
);

-- NOT IN
SELECT name
FROM products
WHERE id NOT IN (
    SELECT product_id FROM order_items
);
\`\`\`

## EXISTS

Returns true if the subquery returns any row:

\`\`\`sql
-- Customers who have placed at least one order
SELECT name FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.id
);
\`\`\`

## Correlated Subquery

References the outer query — runs once per row:

\`\`\`sql
-- Employees earning more than their department average
SELECT name, salary, dept_id
FROM employees e
WHERE salary > (
    SELECT AVG(salary)
    FROM employees
    WHERE dept_id = e.dept_id
);
\`\`\`

## Subquery in FROM (Derived Table)

\`\`\`sql
SELECT dept_name, avg_sal
FROM (
    SELECT d.name AS dept_name, AVG(e.salary) AS avg_sal
    FROM employees e
    JOIN departments d ON e.dept_id = d.id
    GROUP BY d.name
) AS dept_stats
WHERE avg_sal > 70000;
\`\`\``,

  7: `## INSERT, UPDATE, DELETE

## INSERT

Add new rows to a table:

\`\`\`sql
-- Insert one row
INSERT INTO employees (name, salary, dept_id, hire_date)
VALUES ('Alice', 75000, 3, '2024-01-15');

-- Insert multiple rows
INSERT INTO employees (name, salary, dept_id)
VALUES
    ('Bob', 60000, 1),
    ('Carol', 80000, 2),
    ('Dave', 55000, 1);

-- Insert from another table
INSERT INTO employees_archive
SELECT * FROM employees WHERE status = 'inactive';
\`\`\`

## UPDATE

Modify existing rows:

\`\`\`sql
-- Give Engineering a 10% raise
UPDATE employees
SET salary = salary * 1.10
WHERE department = 'Engineering';

-- Update multiple columns
UPDATE users
SET last_login = NOW(), login_count = login_count + 1
WHERE id = 42;
\`\`\`

> **Always use WHERE with UPDATE** — without it, ALL rows are updated!

## DELETE

Remove rows from a table:

\`\`\`sql
-- Delete specific rows
DELETE FROM sessions
WHERE created_at < NOW() - INTERVAL '30 days';

-- Delete with subquery
DELETE FROM orders
WHERE customer_id IN (
    SELECT id FROM customers WHERE status = 'banned'
);
\`\`\`

> **Always use WHERE with DELETE** — \`DELETE FROM table;\` removes ALL rows!

## TRUNCATE vs DELETE

\`\`\`sql
TRUNCATE TABLE temp_data;   -- fast, removes all rows, no WHERE
DELETE FROM temp_data;       -- slower, can use WHERE, logged
\`\`\``,

  8: `## Indexes and Performance

## What is an Index?

An index is a data structure that speeds up data retrieval at the cost of extra storage and slower writes.

Think of it like a book index: instead of reading every page to find "recursion", you jump directly to the page.

## Creating Indexes

\`\`\`sql
-- Single column index
CREATE INDEX idx_employees_name ON employees(name);

-- Unique index (also enforces uniqueness)
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Composite index (multiple columns)
CREATE INDEX idx_orders_customer_date ON orders(customer_id, created_at);

-- Drop an index
DROP INDEX idx_employees_name;
\`\`\`

## When to Create an Index

✅ Create indexes on:
- Columns frequently used in WHERE clauses
- Columns used in JOIN conditions (foreign keys)
- Columns used in ORDER BY with large tables

❌ Avoid indexing:
- Small tables (full scan is faster)
- Columns with very few unique values (e.g., gender: M/F)
- Tables with very frequent INSERT/UPDATE/DELETE

## EXPLAIN / Query Plan

Understand how the database executes a query:

\`\`\`sql
EXPLAIN SELECT * FROM orders WHERE customer_id = 100;
-- Shows: Seq Scan (no index) or Index Scan (uses index)

EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 100;
-- Shows actual execution time too
\`\`\`

## Common Performance Tips

\`\`\`sql
-- Bad: function on indexed column (can't use index)
WHERE YEAR(created_at) = 2024

-- Good: range query (can use index)
WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31'

-- Bad: leading wildcard (can't use index)
WHERE name LIKE '%alice%'

-- Good: prefix search (can use index)
WHERE name LIKE 'alice%'
\`\`\``,
}

export default sqlContent
