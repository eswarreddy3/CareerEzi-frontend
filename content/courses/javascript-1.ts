// JavaScript Module 1 — Complete Guide
// Auto-extracted from the source .docx study guide. Do not hand-edit;
// regenerate if the source document changes.

const content: Record<number, string> = {
  1: `# 1. Variables -- Storing and Naming Data

:::definition
A variable is a named container that stores a value in the computer's memory, which you can reference and reuse by that name anywhere later in your code, instead of retyping the raw value every time.
:::

:::insight
**Analogy**
Think of a variable like a labeled storage box. You write a label on the box ('age') and put a value inside it (25). Whenever you need that value later, you just ask for the box by its label instead of remembering the value itself. And just like a real box, you can open it later and swap what's inside for something else.
:::

## 1.1 How Variables Actually Work in Memory

![Figure 1: a variable is a labeled name pointing to a value stored in memory](/JavaScript_1_images/image_1.png)

**Figure 1** — a variable is a labeled name pointing to a value stored in memory

When you write let age = 25;, JavaScript reserves a small piece of memory, stores the value 25 in it, and creates a label called age that points to that memory location. When you later write age = 30;, JavaScript doesn't move the label -- it replaces the value the label points to.

## 1.2 let, const, and var

\`\`\`javascript
let age = 25;         // "let" -- CAN be reassigned later
const name = "Rahul";  // "const" -- CANNOT be reassigned
var city = "Delhi";    // "var" -- the old way (pre-2015), avoid in modern code
age = 26;               // OK, since age was declared with let
// name = "Priya";      // ERROR! const cannot be reassigned
\`\`\`

## 1.3 let vs const vs var -- Which Should You Actually Use?

| Keyword | Reassignable? | Recommendation |
|---|---|---|
| const | No | Use by DEFAULT for everything, unless you know the value will change |
| let | Yes | Use only when you genuinely need to reassign the value later |
| var | Yes | Avoid entirely in modern JavaScript -- confusing scoping rules |

:::scenario
**Real-time use case**
A user's ID fetched from a database should be const (it never changes during that session), while a shopping cart's running total should be let (it changes every time an item is added). Defaulting to const everywhere and only switching to let when you hit an actual reassignment error is exactly how professional developers write JavaScript today.
:::

## 1.4 A Crucial Nuance: const Doesn't Mean 'Frozen'

:::tip
**Important**
const only prevents REASSIGNING the variable name to a completely new value. If the value is an object or array, you can still change what's INSIDE it -- you just can't point the variable at a different object/array entirely.
:::

\`\`\`javascript
const fruits = ["apple", "banana"];
fruits.push("mango");     // OK! We're changing the array's CONTENTS, not reassigning fruits
console.log(fruits);       // ["apple", "banana", "mango"]
// fruits = ["kiwi"];      // ERROR! This WOULD be reassigning the variable itself
const person = { name: "Rahul" };
person.name = "Priya";     // OK! Changing a property, not reassigning person
// person = { name: "X" }; // ERROR! Reassigning the whole object
\`\`\`

## 1.5 Variable Naming Rules & Conventions

- Names must start with a letter, underscore (_), or dollar sign ($) -- never a number
- Names are case-sensitive: age, Age, and AGE are three different variables
- Cannot use reserved words (let, const, function, if, etc.) as variable names
- Convention: use camelCase for variables and functions (firstName, calculateTotal)
- Choose descriptive names: userAge is far better than a or x for anything beyond a quick loop counter

\`\`\`javascript
let firstName = "Rahul";     // good -- camelCase, descriptive
let x = "Rahul";              // works, but unclear what it represents
let 2ndPlace = "Priya";       // ERROR -- cannot start with a number
let user-age = 25;            // ERROR -- hyphens are not allowed
\`\`\`

:::mistake
**Common mistakes to avoid**
1) Using var out of old habit or tutorials -- stick to const/let in this course and in real projects.
2) Trying to reassign a const variable, causing a runtime error -- start with const, switch to let only if you actually need to reassign.
3) Forgetting that JavaScript is case-sensitive, leading to confusing 'undefined' bugs from a typo'd variable name.
4) Confusing 'const prevents reassignment' with 'const makes values immutable' -- arrays and objects declared with const can still be modified internally.
:::

:::challenge
**Practice Exercise 1.1**
1) Declare a const for your name, and a let for your age. Print both to the console.
2) Reassign your age variable and log it again to confirm it changed.
3) Declare a const array of 3 favorite foods, then push a 4th item into it -- confirm this works despite using const.
4) Try (on purpose) reassigning a const variable and read the exact error message in the console.
:::

:::challenge
**Quick Quiz -- Section 1**
Q1) What's the difference between let and const?
Q2) Why should you default to const and only use let when necessary?
Q3) Can you change the contents of a const array? Can you reassign the const variable itself?
Q4) Name two rules for valid variable names.
:::
`,
  2: `# 2. Data Types

:::definition
Every value in JavaScript has a TYPE, which determines what kind of data it represents and what operations can be performed on it. JavaScript has 7 core types: 5 primitive types (String, Number, Boolean, Undefined, Null) and 2 reference types (Object, Array).
:::

![Figure 2: JavaScript's 7 core data types](/JavaScript_1_images/image_2.png)

**Figure 2** — JavaScript's 7 core data types

## 2.1 The Primitive Types

\`\`\`javascript
let str = "Hello";        // String -- text, wrapped in quotes
let num = 25;               // Number -- JS has only ONE number type (no int/float split)
let price = 19.99;          // still a Number
let isActive = true;        // Boolean -- only true or false
let notSet;                 // Undefined -- declared but not given a value
let empty = null;           // Null -- intentional 'nothing' value
console.log(typeof str);        // "string"
console.log(typeof num);        // "number"
console.log(typeof isActive);   // "boolean"
console.log(typeof notSet);     // "undefined"
console.log(typeof empty);      // "object" -- a famous, long-standing JS quirk!
\`\`\`

:::note
**undefined vs null -- a subtle but important difference**
undefined means JavaScript itself hasn't assigned anything yet (an accidental/default state). null means a developer deliberately said 'there is no value here' on purpose. E.g. a 'middleName' field might be null if a user intentionally left it blank, but would be undefined if you tried to read a variable that was never declared.
:::

## 2.2 The Reference Types: Object & Array

\`\`\`javascript
let person = { name: "Rahul", age: 20 };   // Object -- key-value pairs
let fruits = ["apple", "banana", "mango"];  // Array -- an ordered list
console.log(typeof person);   // "object"
console.log(typeof fruits);   // "object" -- arrays are technically a special kind of object!
console.log(Array.isArray(fruits));  // true -- the correct way to check for an array
\`\`\`

We'll cover Arrays in full depth in Section 8, and Objects in Section 9 -- both deserve dedicated attention since they're used constantly in real applications.

## 2.3 The typeof Operator

typeof is your go-to tool for checking what type a value is at any point in your code -- extremely useful for debugging:

\`\`\`javascript
console.log(typeof "hello");      // "string"
console.log(typeof 42);            // "number"
console.log(typeof true);          // "boolean"
console.log(typeof undefined);     // "undefined"
console.log(typeof null);          // "object" (the famous quirk)
console.log(typeof {});             // "object"
console.log(typeof []);             // "object"
console.log(typeof function(){});   // "function"
\`\`\`

:::scenario
**Real-time use case**
An e-commerce site stores a product's name as a String, its price as a Number, whether it's in stock as a Boolean, and the full product details as an Object -- understanding types is what lets you correctly work with, validate, and calculate on this kind of real data.
:::

:::mistake
**Common mistakes to avoid**
1) Forgetting typeof null returns "object" -- a well-known historical bug in JavaScript that was never fixed for backward compatibility.
2) Confusing a Number that looks like text (e.g. from form input, which is always a String) with an actual Number -- '5' + 3 gives '53', not 8 (covered fully in Section 4).
3) Using typeof to check for an array -- it returns "object" for arrays too; use Array.isArray() instead.
:::

:::challenge
**Practice Exercise 2.1**
1) Declare one variable of each of the 7 types and log the result of typeof for each.
2) Predict what typeof null and typeof [] will print BEFORE running the code, then check yourself.
3) Create an object representing a book (title, author, price, inStock) and log typeof for the whole object and for each individual property.
:::

:::challenge
**Quick Quiz -- Section 2**
Q1) Name the 5 primitive types and 2 reference types.
Q2) What does typeof null return, and why is this considered a quirk?
Q3) What's the correct way to check if a value is actually an array?
:::
`,
  3: `# 3. Operators

:::definition
An operator performs an action on one or more values (called operands) -- adding numbers, comparing values, or combining logical conditions. JavaScript groups operators into several families, each with a distinct purpose.
:::

## 3.1 Arithmetic Operators

\`\`\`javascript
let a = 10, b = 3;
console.log(a + b);   // 13  -- addition
console.log(a - b);   // 7   -- subtraction
console.log(a * b);   // 30  -- multiplication
console.log(a / b);   // 3.333... -- division
console.log(a % b);   // 1   -- remainder (modulo) -- very commonly used!
console.log(a ** b);  // 1000 -- exponent (a to the power of b)
let count = 5;
count++;   // same as count = count + 1 -- now 6
count--;   // same as count = count - 1 -- now 5
count += 10;  // same as count = count + 10 -- now 15
\`\`\`

:::scenario
**Real-time use case**
The modulo operator (%) is used constantly to check if a number is even/odd (n % 2 === 0), to wrap values around a range (like a carousel that loops back to the first image), or to format time (converting total seconds into minutes and seconds).
:::

## 3.2 Comparison Operators

\`\`\`javascript
console.log(5 == "5");    // true  -- loose equality, converts types before comparing
console.log(5 === "5");   // false -- strict equality, checks type AND value -- ALWAYS prefer this
console.log(5 != "5");    // false -- loose inequality
console.log(5 !== "5");   // true  -- strict inequality -- ALWAYS prefer this
console.log(5 > 3);        // true
console.log(5 <= 5);       // true
\`\`\`

:::tip
**Always use === and !== , never == and !=**
== and != perform 'type coercion' before comparing, leading to confusing results like '0' == false being true, or '' == 0 being true. === and !== check both type and value with no surprises. Professional JavaScript code almost always uses strict equality.
:::

## 3.3 Logical Operators

\`\`\`javascript
let age = 20;
let hasLicense = true;
console.log(age >= 18 && hasLicense);   // AND -- true only if BOTH are true
console.log(age < 18 || hasLicense);     // OR -- true if AT LEAST ONE is true
console.log(!hasLicense);                 // NOT -- flips true to false and vice versa
// Real-world combined condition:
if (age >= 18 && hasLicense) {
  console.log("Can drive");
}
\`\`\`

## 3.4 Assignment Operators

| Operator | Meaning |
|---|---|
| = | Assign a value |
| += | Add and reassign (x += 5 same as x = x + 5) |
| -= | Subtract and reassign |
| *= | Multiply and reassign |
| /= | Divide and reassign |

## 3.5 The Ternary Operator (a compact if/else)

\`\`\`javascript
let age = 20;
let status = age >= 18 ? "adult" : "minor";
console.log(status);   // "adult"
// Equivalent to:
let status2;
if (age >= 18) {
  status2 = "adult";
} else {
  status2 = "minor";
}
\`\`\`

condition ? valueIfTrue : valueIfFalse -- extremely common for short, simple conditional assignments. We'll cover full if/else in depth in Section 5.

:::mistake
**Common mistakes to avoid**
1) Using == or != instead of === or !== -- leads to subtle, hard-to-find bugs from unexpected type coercion.
2) Confusing = (assignment) with == or === (comparison) -- a single = inside an if condition assigns a value instead of comparing, a classic beginner bug.
3) Forgetting operator precedence -- multiplication/division run before addition/subtraction, just like in math class; use parentheses when unsure.
:::

:::challenge
**Practice Exercise 3.1**
1) Write expressions using all 6 arithmetic operators and log each result.
2) Compare 5 == "5" and 5 === "5" and explain in your own words why they differ.
3) Write a combined logical condition checking if a user is both an adult AND has a valid membership.
4) Rewrite one of your existing if/else statements using the ternary operator instead.
:::

:::challenge
**Quick Quiz -- Section 3**
Q1) What does the % (modulo) operator return?
Q2) Why should you always prefer === over ==?
Q3) What does the ternary operator's syntax look like?
:::
`,
  4: `# 4. Type Conversion & Coercion

:::definition
Type conversion is when YOU deliberately convert a value from one type to another. Type coercion is when JAVASCRIPT automatically converts a value's type behind the scenes, often during an operation like + or ==. Understanding both prevents a huge category of confusing bugs.
:::

## 4.1 The Infamous + Operator Trap

\`\`\`javascript
console.log(5 + 3);        // 8   -- both numbers, normal addition
console.log("5" + 3);      // "53" -- string + number = string concatenation!
console.log("5" + "3");    // "53" -- both strings, concatenation
console.log(5 + "3" + 2);  // "532" -- reads left to right: 5+"3"="53", then "53"+2="532"
console.log(5 + 2 + "3");  // "73" -- 5+2=7 (both numbers) first, THEN 7+"3"="73"
\`\`\`

:::scenario
**Real-time use case**
This exact trap happens constantly with form inputs: every value typed into an HTML input field arrives in JavaScript as a String, even if the user typed numbers. Adding two 'number' inputs without converting them first (e.g. quantity + price) will silently concatenate text instead of adding numbers -- a very common real bug.
:::

## 4.2 Deliberate Type Conversion

\`\`\`javascript
// String to Number
let strNum = "42";
console.log(Number(strNum));      // 42
console.log(parseInt("42px"));    // 42 -- parses until it hits a non-number character
console.log(parseFloat("3.14"));  // 3.14
console.log(+strNum);              // 42 -- the unary plus trick, same as Number()
// Number to String
let num = 42;
console.log(String(num));    // "42"
console.log(num.toString()); // "42"
console.log(num + "");        // "42" -- the concatenation trick
// Any value to Boolean
console.log(Boolean(0));      // false
console.log(Boolean(1));      // true
console.log(Boolean(""));     // false
console.log(Boolean("hi"));   // true
\`\`\`

## 4.3 Truthy and Falsy Values

:::definition
Every value in JavaScript is 'truthy' or 'falsy' when evaluated in a boolean context (like an if condition), even if it isn't literally true or false.
:::

| Falsy values (all 6) | Everything else is Truthy |
|---|---|
| false, 0, "" (empty string), null, undefined, NaN | "0", "false", [], {}, any non-empty string, any number except 0 |

\`\`\`javascript
let username = "";
if (username) {
  console.log("Has a username");
} else {
  console.log("Username is empty");  // this runs -- "" is falsy
}
\`\`\`

:::mistake
**Common mistakes to avoid**
1) Forgetting that [] and {} (empty array/object) are TRUTHY, even though they might feel 'empty' -- this trips up almost every beginner at least once.
2) Adding form input values directly without converting to Number first, causing string concatenation instead of arithmetic.
3) Using parseInt without realizing it stops at the first non-numeric character, which can silently hide bugs (e.g. parseInt("12abc") gives 12, not an error).
:::

:::challenge
**Practice Exercise 4.1**
1) Predict the output of "5" + 3, 5 + "3" + 2, and 5 + 2 + "3" before running them, then verify.
2) Convert the string "100" to a Number three different ways.
3) Write a list of 5 falsy values and 5 truthy values, including at least one 'surprising' truthy value.
:::

:::challenge
**Quick Quiz -- Section 4**
Q1) What's the difference between type conversion and type coercion?
Q2) What does "5" + 3 evaluate to, and why?
Q3) Are empty arrays ([]) and empty objects ({}) truthy or falsy?
:::
`,
  5: `# 5. Conditional Statements

:::definition
Conditional statements let your program make decisions -- running different code depending on whether a condition is true or false. This is what allows a program to actually 'think', rather than just running the same instructions every time.
:::

## 5.1 if / else -- The Basic Decision

![Figure 3: the flow of an if/else decision](/JavaScript_1_images/image_3.png)

**Figure 3** — the flow of an if/else decision

\`\`\`javascript
let age = 20;
if (age >= 18) {
  console.log("You can vote");
} else {
  console.log("Not old enough to vote");
}
\`\`\`

## 5.2 else if -- Checking Multiple Conditions in Order

Let's watch this run step by step with real values, to see exactly how JavaScript checks each condition in order until one matches:

![Figure 4: JavaScript checks each else-if in order, stopping at the first true condition](/JavaScript_1_images/image_4.png)

**Figure 4** — JavaScript checks each else-if in order, stopping at the first true condition

\`\`\`javascript
let score = 72;
let grade;
if (score >= 90) {
  grade = "A";
} else if (score >= 75) {
  grade = "B";
} else if (score >= 60) {
  grade = "C";     // this branch runs, since 72 >= 60 but 72 < 75
} else {
  grade = "F";
}
console.log(grade);   // "C"
\`\`\`

:::tip
**Critical concept: only ONE branch ever runs.**
The moment JavaScript finds a true condition in an if/else if chain, it runs that block and completely skips every remaining else if and else below it -- even if a later condition would also technically be true. Order matters!
:::

## 5.3 switch -- Cleaner Multi-Way Branching

\`\`\`javascript
let day = "Tuesday";
switch (day) {
  case "Monday":
    console.log("Start of the week");
    break;
  case "Tuesday":
    console.log("Second day");   // this runs
    break;
  case "Saturday":
  case "Sunday":
    console.log("Weekend!");      // shared code for two cases
    break;
  default:
    console.log("A regular day");
}
\`\`\`

:::insight
**Why the break statement is essential**
Without break, JavaScript keeps executing every case below the matching one (called 'fall-through') until it hits a break or the end of the switch. This is a common source of bugs -- always include break unless you deliberately want fall-through (like the shared Saturday/Sunday case above).
:::

## 5.4 The Ternary Operator, Revisited

\`\`\`javascript
let age = 16;
let message = age >= 18 ? "You can vote" : "Not old enough";
console.log(message);
// Ternary operators can even be nested (use sparingly for readability!)
let grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : "F";
\`\`\`

## 5.5 A Complete Worked Example

\`\`\`javascript
function checkLogin(username, password) {
  if (username === "" || password === "") {
    return "Please fill in all fields";
  } else if (username !== "admin") {
    return "User not found";
  } else if (password !== "secret123") {
    return "Incorrect password";
  } else {
    return "Login successful!";
  }
}
console.log(checkLogin("admin", "secret123"));   // "Login successful!"
console.log(checkLogin("admin", "wrong"));        // "Incorrect password"
console.log(checkLogin("", ""));                   // "Please fill in all fields"
\`\`\`

:::mistake
**Common mistakes to avoid**
1) Forgetting break in a switch statement, causing unintended fall-through into the next case.
2) Using = instead of === inside an if condition (a single = assigns, doesn't compare).
3) Writing overly nested if/else chains that become hard to read -- consider switch or early returns (like the login example above) for cleaner logic.
:::

:::challenge
**Practice Exercise 5.1**
1) Write an if/else that checks if a number is positive, negative, or zero.
2) Write an if/else-if chain that assigns a letter grade based on a numeric score (A/B/C/D/F).
3) Rewrite your grade logic using a switch statement based on a truncated score band (e.g. Math.floor(score/10)).
4) Write a function that checks login credentials, similar to the worked example, using your own conditions.
:::

:::challenge
**Quick Quiz -- Section 5**
Q1) In an if/else-if chain, how many branches can run at most?
Q2) What does the break statement do inside a switch, and what happens if you forget it?
Q3) Write the ternary operator syntax from memory.
:::
`,
  6: `# 6. Loops

:::definition
A loop repeats a block of code multiple times, either a set number of times or until a condition becomes false -- without you having to write the same code over and over.
:::

:::insight
**Analogy**
A loop is like giving someone standing instructions: 'Keep stacking these 10 boxes onto the shelf, one at a time, until you've stacked all 10.' You don't repeat the instruction 10 times -- you give it once, with a repeat condition.
:::

## 6.1 The for Loop

![Figure 5: the anatomy of a for loop's execution flow](/JavaScript_1_images/image_5.png)

**Figure 5** — the anatomy of a for loop's execution flow

\`\`\`javascript
for (let i = 0; i < 5; i++) {
  console.log(i);
}
// prints: 0, 1, 2, 3, 4
\`\`\`

- Initialization (let i = 0) -- runs once, before the loop starts
- Condition (i < 5) -- checked before EVERY iteration; loop stops when false
- Increment (i++) -- runs after each iteration

## 6.2 Watching a Loop Run, Step by Step

Let's trace through a real loop's execution one iteration at a time, watching exactly how a variable changes:

![Figure 6: a running total building up across 4 loop iterations](/JavaScript_1_images/image_6.png)

**Figure 6** — a running total building up across 4 loop iterations

This step-by-step tracing technique -- writing out each iteration's variable values by hand -- is one of the most valuable debugging skills you can build. Whenever a loop doesn't do what you expect, trace through it exactly like this.

## 6.3 The while Loop

\`\`\`javascript
let count = 0;
while (count < 5) {
  console.log(count);
  count++;   // CRITICAL -- forgetting this creates an infinite loop!
}
\`\`\`

:::note
**Use for when you know how many times to loop; use while when you don't**
for is ideal when you know the exact number of iterations in advance (e.g. 'loop through this array'). while is ideal when the loop should continue based on a condition that might change unpredictably (e.g. 'keep asking the user for input until they enter something valid').
:::

## 6.4 The do-while Loop

\`\`\`javascript
let num;
do {
  num = Math.floor(Math.random() * 10);
  console.log(num);
} while (num !== 7);
// runs the block AT LEAST ONCE, even if the condition is false from the start
\`\`\`

The key difference: do-while checks its condition AFTER running the block, guaranteeing at least one execution. A regular while loop checks BEFORE, so it might never run at all if the condition starts false.

## 6.5 break and continue

\`\`\`javascript
// break: exits the loop entirely
for (let i = 0; i < 10; i++) {
  if (i === 5) break;
  console.log(i);
}
// prints: 0, 1, 2, 3, 4 -- then stops completely
// continue: skips just this iteration, loop keeps going
for (let i = 0; i < 5; i++) {
  if (i === 2) continue;
  console.log(i);
}
// prints: 0, 1, 3, 4 -- skips only 2
\`\`\`

## 6.6 Nested Loops

\`\`\`javascript
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    console.log(\`i=\${i}, j=\${j}\`);
  }
}
// The inner loop runs COMPLETELY for every single iteration of the outer loop
// Total iterations: 3 x 3 = 9
\`\`\`

:::scenario
**Real-time use case**
Nested loops are exactly how a multiplication table, a calendar grid, or a chessboard pattern is generated -- the outer loop handles rows, the inner loop handles columns within each row.
:::

## 6.7 A Complete Worked Example -- FizzBuzz

FizzBuzz is a classic beginner exercise, genuinely often asked in real entry-level interviews, combining loops and conditionals:

\`\`\`javascript
for (let i = 1; i <= 15; i++) {
  if (i % 15 === 0) {
    console.log("FizzBuzz");
  } else if (i % 3 === 0) {
    console.log("Fizz");
  } else if (i % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(i);
  }
}
// 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz
\`\`\`

:::mistake
**Common mistakes to avoid**
1) Forgetting to update the loop variable (i++), creating an infinite loop that freezes your program.
2) Off-by-one errors -- using <= when you meant < (or vice versa), causing one extra or one missing iteration.
3) Modifying an array's length while looping over it with a for loop, which can skip elements unexpectedly.
:::

:::challenge
**Practice Exercise 6.1**
1) Write a for loop that prints numbers 1 to 20.
2) Write a while loop that keeps doubling a number starting at 1 until it exceeds 1000, logging each value.
3) Build the FizzBuzz example yourself from scratch, without looking at the notes.
4) Use nested loops to print a 5x5 grid of asterisks (*).
5) Write a loop that sums all numbers from 1 to 100 using break/continue appropriately if needed.
:::

:::challenge
**Quick Quiz -- Section 6**
Q1) What are the three parts of a for loop's parentheses?
Q2) What's the key difference between while and do-while?
Q3) What's the difference between break and continue?
Q4) How many total iterations happen in two nested loops that each run 4 times?
:::
`,
  7: `# 7. Functions

:::definition
A function is a reusable, named block of code that performs a specific task. You define it once, then 'call' (run) it as many times as needed, optionally passing in different inputs each time.
:::

![Figure 7: a function takes input, processes it, and produces output](/JavaScript_1_images/image_7.png)

**Figure 7** — a function takes input, processes it, and produces output

:::insight
**Analogy**
A function is like a coffee machine. You put in inputs (water, coffee beans -- the parameters). The machine does its internal process (brewing -- the function body). You get an output (a cup of coffee -- the return value). You don't need to know exactly how the machine works internally to use it -- you just give it inputs and get outputs.
:::

## 7.1 Function Declarations

\`\`\`javascript
function add(a, b) {
  return a + b;
}
console.log(add(5, 3));   // 8
console.log(add(10, 20)); // 30
\`\`\`

- Parameters (a, b) -- placeholders for the values the function expects when called
- Arguments (5, 3) -- the actual values passed in when calling the function
- return -- sends a value back out of the function; without it, the function returns undefined

## 7.2 Function Expressions & Arrow Functions

\`\`\`javascript
// Function expression -- a function stored in a variable
const multiply = function(a, b) {
  return a * b;
};
// Arrow function -- a shorter, modern syntax, extremely common today
const subtract = (a, b) => {
  return a - b;
};
// Arrow function with implicit return (no curly braces needed for one-liners)
const square = x => x * x;
console.log(multiply(4, 5));  // 20
console.log(subtract(10, 3)); // 7
console.log(square(6));        // 36
\`\`\`

| Syntax | When to use |
|---|---|
| function name() {} | Declarations -- can be called before they're defined in the file (hoisting) |
| const name = function() {} | Expressions -- useful when passing functions as values |
| const name = () => {} | Arrow functions -- shorter, very common in modern code and React |

## 7.3 Default Parameters

\`\`\`javascript
function greet(name = "Guest") {
  console.log(\`Hello, \${name}!\`);
}
greet("Rahul");   // "Hello, Rahul!"
greet();           // "Hello, Guest!" -- uses the default since no argument was passed
\`\`\`

## 7.4 Scope -- Where a Variable is Visible

:::definition
Scope determines where in your code a variable can be accessed. JavaScript has three levels: global scope (accessible everywhere), function scope (only inside that function), and block scope (only inside that specific { } block, for let/const).
:::

![Figure 8: global, function, and block scope, nested inside each other](/JavaScript_1_images/image_8.png)

**Figure 8** — global, function, and block scope, nested inside each other

\`\`\`javascript
let globalVar = "I'm global";
function myFunction() {
  let functionVar = "I'm function-scoped";
  if (true) {
    let blockVar = "I'm block-scoped";
    console.log(globalVar);    // works -- global is visible everywhere
    console.log(functionVar);  // works -- still inside the function
    console.log(blockVar);     // works -- still inside the block
  }
  // console.log(blockVar);    // ERROR! blockVar doesn't exist out here
}
// console.log(functionVar);   // ERROR! functionVar doesn't exist out here
\`\`\`

:::scenario
**Real-time use case**
Scope is exactly why two different functions can each safely use a variable named i or count without conflicting with each other -- each function has its own private scope, protecting your code from accidental name collisions across a large application.
:::

## 7.5 A Complete Worked Example

\`\`\`javascript
function calculateDiscount(price, discountPercent = 10) {
  if (price <= 0) {
    return 0;
  }
  const discountAmount = price * (discountPercent / 100);
  return price - discountAmount;
}
console.log(calculateDiscount(1000));      // 900 -- uses default 10%
console.log(calculateDiscount(1000, 25));  // 750 -- 25% discount
console.log(calculateDiscount(-50));        // 0 -- invalid price handled gracefully
\`\`\`

:::mistake
**Common mistakes to avoid**
1) Forgetting the return statement, then being confused why the function's result is undefined.
2) Confusing parameters (the placeholders in the function definition) with arguments (the actual values passed when calling).
3) Trying to access a block-scoped or function-scoped variable from outside where it was declared.
4) Using var inside loops/conditionals, which does NOT respect block scope the way let does -- another reason to avoid var.
:::

:::challenge
**Practice Exercise 7.1**
1) Write a function declaration that calculates the area of a rectangle, given width and height.
2) Rewrite the same function as an arrow function.
3) Write a function with a default parameter for tax rate that calculates a final price including tax.
4) Write a function containing a nested if block, and demonstrate which variables are and aren't accessible outside that block.
:::

:::challenge
**Quick Quiz -- Section 7**
Q1) What's the difference between a parameter and an argument?
Q2) What does a function return if it has no explicit return statement?
Q3) Name the three levels of scope in JavaScript.
Q4) Can a variable declared inside an if block be accessed outside that block?
:::
`,
  8: `# 8. Arrays

:::definition
An array is an ordered list of values, stored under a single variable name. Each value has a numbered POSITION called an index, always starting at 0 -- not 1.
:::

:::insight
**Analogy**
Think of an array like a row of numbered lockers at a gym. Locker 0 is the first one, locker 1 is next, and so on. Each locker holds one item, and you can open any locker directly if you know its number -- you don't have to search through every locker to find item #3.
:::

## 8.1 Creating Arrays & Indexing

![Figure 9: array positions (indexes) always start counting from 0](/JavaScript_1_images/image_9.png)

**Figure 9** — array positions (indexes) always start counting from 0

\`\`\`javascript
const fruits = ["apple", "banana", "mango", "kiwi"];
console.log(fruits[0]);              // "apple" -- the FIRST item is at index 0
console.log(fruits[2]);              // "mango"
console.log(fruits.length);          // 4 -- the total number of items
console.log(fruits[fruits.length - 1]);  // "kiwi" -- a reliable way to get the LAST item
console.log(fruits[10]);              // undefined -- no error, just undefined if index doesn't exist
\`\`\`

:::insight
**Why arrays start at index 0, not 1**
This trips up every beginner at first. It comes from how computers calculate memory addresses (the index represents an OFFSET from the start, and the first item has zero offset). Just memorize it: the first item is always fruits[0], and the last item is always fruits[fruits.length - 1].
:::

## 8.2 Modifying Arrays: push, pop, shift, unshift

![Figure 10: push() adds to the end, pop() removes from the end](/JavaScript_1_images/image_10.png)

**Figure 10** — push() adds to the end, pop() removes from the end

\`\`\`javascript
let colors = ["red", "green", "blue"];
colors.push("yellow");       // adds to the END: ["red","green","blue","yellow"]
colors.pop();                 // removes from the END, returns it: ["red","green","blue"]
colors.unshift("purple");     // adds to the START: ["purple","red","green","blue"]
colors.shift();                // removes from the START, returns it: ["red","green","blue"]
console.log(colors);          // ["red", "green", "blue"]
\`\`\`

| Method | Effect |
|---|---|
| push(item) | Adds an item to the END of the array |
| pop() | Removes and returns the LAST item |
| unshift(item) | Adds an item to the START of the array |
| shift() | Removes and returns the FIRST item |

## 8.3 Finding & Changing Items

\`\`\`javascript
let numbers = [10, 20, 30, 40, 50];
numbers[1] = 99;                  // directly change an item by index: [10,99,30,40,50]
console.log(numbers.indexOf(30));  // 2 -- finds the index of a value (-1 if not found)
console.log(numbers.includes(40)); // true -- checks if a value exists at all
\`\`\`

## 8.4 slice() vs splice() -- A Common Point of Confusion

\`\`\`javascript
let letters = ["a", "b", "c", "d", "e"];
// slice(start, end) -- returns a NEW array, does NOT change the original
let sliced = letters.slice(1, 3);
console.log(sliced);    // ["b", "c"]
console.log(letters);   // ["a","b","c","d","e"] -- unchanged!
// splice(start, deleteCount, ...itemsToInsert) -- MODIFIES the original array
let removed = letters.splice(1, 2);
console.log(removed);   // ["b", "c"] -- the removed items
console.log(letters);   // ["a","d","e"] -- original array is now changed!
letters.splice(1, 0, "X", "Y");   // insert without removing (deleteCount = 0)
console.log(letters);              // ["a","X","Y","d","e"]
\`\`\`

:::insight
**The single easiest way to remember slice vs splice**
slice = 'give me a COPY of a piece, leave the original alone' (non-destructive). splice = 'SPLICE INTO the original array and change it directly' (destructive/mutating). This is one of the most commonly confused pairs in all of JavaScript -- come back to this box whenever you're unsure.
:::

## 8.5 A First Look at Iteration: forEach

You'll learn map, filter, and reduce in full depth in Module 2 -- but forEach, the simplest iteration method, belongs here as your first array loop method:

\`\`\`javascript
const fruits = ["apple", "banana", "mango"];
fruits.forEach(function(fruit) {
  console.log(fruit);
});
// apple
// banana
// mango
// Same thing with an arrow function (more common in modern code):
fruits.forEach(fruit => console.log(fruit));
// forEach also gives you the index if you need it:
fruits.forEach((fruit, index) => {
  console.log(\`\${index}: \${fruit}\`);
});
// 0: apple
// 1: banana
// 2: mango
\`\`\`

forEach is essentially a cleaner alternative to a for loop specifically for arrays -- it automatically handles the indexing and loop condition for you.

## 8.6 A Few More Essential Array Methods

\`\`\`javascript
let nums = [5, 2, 8, 1, 9];
console.log(nums.join(", "));      // "5, 2, 8, 1, 9" -- combines into a single string
console.log(nums.reverse());        // [9, 1, 8, 2, 5] -- reverses IN PLACE (mutates!)
console.log(nums.sort());           // sorts IN PLACE, but as STRINGS by default!
let a = [1, 2];
let b = [3, 4];
console.log(a.concat(b));           // [1, 2, 3, 4] -- combines arrays, returns a NEW array
\`\`\`

:::insight
**The sort() trap every beginner hits**
By default, sort() converts everything to strings and sorts alphabetically -- so [10, 2, 1].sort() gives [1, 10, 2], NOT [1, 2, 10]! For correct numeric sorting, pass a comparison function: nums.sort((a, b) => a - b) sorts ascending, (a, b) => b - a sorts descending.
:::

\`\`\`javascript
let scores = [50, 8, 130, 2];
console.log(scores.sort());               // [130, 2, 50, 8] -- WRONG (string sort)
console.log(scores.sort((a, b) => a - b)); // [2, 8, 50, 130] -- correct numeric ascending sort
\`\`\`

## 8.7 A Complete Worked Example -- A Shopping List Manager

\`\`\`javascript
let shoppingList = [];
function addItem(item) {
  shoppingList.push(item);
  console.log(\`Added: \${item}\`);
}
function removeItem(item) {
  const index = shoppingList.indexOf(item);
  if (index !== -1) {
    shoppingList.splice(index, 1);
    console.log(\`Removed: \${item}\`);
  } else {
    console.log(\`\${item} not found in list\`);
  }
}
addItem("Milk");
addItem("Eggs");
addItem("Bread");
removeItem("Eggs");
console.log(shoppingList);   // ["Milk", "Bread"]
\`\`\`

:::mistake
**Common mistakes to avoid**
1) Trying to access fruits[fruits.length] expecting the last item -- that index is actually one PAST the last item (always out of bounds); use fruits.length - 1.
2) Confusing slice (non-destructive, returns a copy) with splice (destructive, changes the original array).
3) Forgetting that push/pop work on the END while unshift/shift work on the START -- easy to mix up under pressure.
4) Using a regular for loop with the wrong condition (i <= array.length instead of i < array.length), causing an off-by-one 'undefined' error.
:::

:::challenge
**Practice Exercise 8.1**
1) Create an array of 5 favorite movies. Log the first, third, and last item using indexing.
2) Use push and pop to add and remove items, logging the array after each change.
3) Use slice to get a copy of just the middle 3 items without modifying the original array.
4) Use splice to remove the 2nd item and insert two new items in its place.
5) Build the shopping list manager example yourself, then add a function to check if an item already exists before adding it (avoid duplicates).
:::

:::challenge
**Quick Quiz -- Section 8**
Q1) What index does the first item in an array have?
Q2) Which two methods add/remove from the END of an array? Which two work on the START?
Q3) What's the key difference between slice and splice?
Q4) How do you reliably get the last item of an array of unknown length?
:::
`,
  9: `# 9. Objects

:::definition
An object is a collection of related data stored as key-value pairs. Unlike arrays (which use numbered positions), objects use named KEYS to label each piece of data, making them ideal for representing a single 'thing' with multiple properties -- a person, a product, a car.
:::

![Figure 11: an object maps named keys to values](/JavaScript_1_images/image_11.png)

**Figure 11** — an object maps named keys to values

:::insight
**Analogy**
If an array is a row of numbered lockers, an object is a filing cabinet with labeled folders. Instead of 'locker 0, locker 1, locker 2', you have folders named 'name', 'age', 'email' -- you find what you need by its label, not its position.
:::

## 9.1 Creating Objects & Accessing Properties

\`\`\`javascript
const student = {
  name: "Rahul",
  age: 20,
  isEnrolled: true,
  skills: ["HTML", "CSS", "JavaScript"]
};
// Dot notation -- the most common way
console.log(student.name);   // "Rahul"
console.log(student.age);    // 20
// Bracket notation -- required when the key is dynamic or has special characters
console.log(student["isEnrolled"]);   // true
let key = "skills";
console.log(student[key]);   // ["HTML", "CSS", "JavaScript"] -- dot notation CAN'T do this
\`\`\`

:::note
**Dot notation vs bracket notation -- when do you actually need brackets?**
Use dot notation (student.name) by default -- it's cleaner and more readable. Use bracket notation (student[key]) only when the property name is stored in a variable, contains spaces/special characters, or is determined dynamically at runtime.
:::

## 9.2 Modifying, Adding & Deleting Properties

\`\`\`javascript
const car = { brand: "Toyota", year: 2022 };
car.year = 2024;          // modify an existing property
car.color = "red";         // add a brand new property
delete car.year;            // remove a property entirely
console.log(car);   // { brand: "Toyota", color: "red" }
\`\`\`

## 9.3 Object Methods -- Functions Stored as Properties

\`\`\`javascript
const person = {
  name: "Priya",
  age: 22,
  greet: function() {
    console.log("Hi, I'm " + this.name);
  },
  // Shorthand method syntax (modern, more common):
  sayAge() {
    console.log(this.age + " years old");
  }
};
person.greet();    // "Hi, I'm Priya"
person.sayAge();    // "22 years old"
\`\`\`

:::note
**What is 'this'?**
Inside an object method, this refers to the object the method belongs to -- it's how a method accesses that specific object's own properties. this.name inside person's greet method refers to person.name. This becomes especially important once we reach React components in a later module.
:::

## 9.4 Nested Objects & Arrays of Objects

\`\`\`javascript
const company = {
  name: "TechCorp",
  address: {
    city: "Bangalore",
    zip: "560001"
  },
  employees: [
    { name: "Rahul", role: "Developer" },
    { name: "Priya", role: "Designer" }
  ]
};
console.log(company.address.city);          // "Bangalore" -- chain dots to go deeper
console.log(company.employees[0].name);      // "Rahul" -- array index, then object key
console.log(company.employees[1].role);      // "Designer"
\`\`\`

:::scenario
**Real-time use case**
This exact nested pattern -- an array of objects -- is precisely the shape almost all real-world data comes in: a list of products from a database, a list of users from an API, a list of comments on a post. Getting comfortable reading and navigating nested objects/arrays is essential preparation for working with real APIs starting in Module 2 and Node.js later in this course.
:::

## 9.5 Useful Object Methods

\`\`\`javascript
const student = { name: "Rahul", age: 20, city: "Delhi" };
console.log(Object.keys(student));     // ["name", "age", "city"]
console.log(Object.values(student));   // ["Rahul", 20, "Delhi"]
console.log(Object.entries(student));  // [["name","Rahul"], ["age",20], ["city","Delhi"]]
\`\`\`

These methods are especially useful when you need to loop over an object's contents, since regular for loops don't work directly on objects the way they do on arrays.

## 9.6 Combining Arrays and Objects -- A To-Do List

Real applications constantly combine arrays and objects together -- here's a small but complete to-do list, using everything from Sections 5-9 at once:

\`\`\`javascript
let todos = [];
function addTodo(text) {
  todos.push({ text: text, completed: false, id: todos.length + 1 });
}
function toggleComplete(id) {
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      todos[i].completed = !todos[i].completed;
    }
  }
}
function printTodos() {
  todos.forEach(function(todo) {
    const status = todo.completed ? "[x]" : "[ ]";
    console.log(\`\${status} \${todo.text}\`);
  });
}
addTodo("Learn JavaScript basics");
addTodo("Build the capstone project");
toggleComplete(1);
printTodos();
// [x] Learn JavaScript basics
// [ ] Build the capstone project
\`\`\`

## 9.7 A Complete Worked Example -- A Simple Contact Book

\`\`\`javascript
let contacts = [
  { name: "Rahul", phone: "9876543210" },
  { name: "Priya", phone: "9123456780" }
];
function addContact(name, phone) {
  contacts.push({ name: name, phone: phone });
}
function findContact(name) {
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].name === name) {
      return contacts[i];
    }
  }
  return null;
}
addContact("Amit", "9988776655");
console.log(findContact("Priya"));   // { name: "Priya", phone: "9123456780" }
console.log(findContact("Nobody"));   // null
\`\`\`

:::mistake
**Common mistakes to avoid**
1) Trying to use bracket notation with an unquoted key when it should be a string: obj[name] looks for a variable called name, not the property literally named 'name' -- use obj["name"] or obj.name.
2) Forgetting that objects, unlike arrays, don't have a guaranteed numeric order or a .length property.
3) Confusing const preventing reassignment of the object variable itself with objects being fully 'frozen' -- properties can still be added, changed, or deleted.
4) Forgetting 'this' inside a regular method refers to the object it's called on -- a common source of confusion, especially once arrow functions are involved (arrow functions handle 'this' differently, covered in Module 2).
:::

:::challenge
**Practice Exercise 9.1**
1) Create an object representing a book (title, author, year, genres as an array). Access each property using dot notation.
2) Add a new property (price) and delete an existing one.
3) Add a method to the book object that logs a formatted summary sentence using 'this'.
4) Create an array of 3 book objects and write a function that finds a book by title, similar to the contact book example.
5) Use Object.keys() and Object.values() on your book object and log the results.
:::

:::challenge
**Quick Quiz -- Section 9**
Q1) What's the difference between how arrays and objects organize their data?
Q2) When must you use bracket notation instead of dot notation?
Q3) What does 'this' refer to inside an object method?
Q4) How would you access the city of the first employee's address in a deeply nested object?
:::
`,
  10: `# 10. Module 1 Capstone Project

This project combines every single concept from Module 1 -- variables, data types, operators, conditionals, loops, functions, arrays, and objects -- into one realistic program: a Student Grade Management System.

## 10.1 Project Requirements

- Store multiple students as an array of objects, each with name, and an array of scores
- A function to calculate a student's average score
- A function to convert an average into a letter grade (A/B/C/D/F) using conditionals
- A function to add a new student to the system
- A loop that prints a full report for every student
- Use array methods (push, forEach) and object property access throughout

## 10.2 Complete Solution

\`\`\`javascript
let students = [
  { name: "Rahul", scores: [85, 90, 78] },
  { name: "Priya", scores: [92, 88, 95] },
  { name: "Amit", scores: [60, 55, 70] }
];
function calculateAverage(scores) {
  let total = 0;
  for (let i = 0; i < scores.length; i++) {
    total += scores[i];
  }
  return total / scores.length;
}
function getGrade(average) {
  if (average >= 90) {
    return "A";
  } else if (average >= 75) {
    return "B";
  } else if (average >= 60) {
    return "C";
  } else {
    return "F";
  }
}
function addStudent(name, scores) {
  students.push({ name: name, scores: scores });
  console.log(\`Added student: \${name}\`);
}
function printReport() {
  console.log("===== STUDENT REPORT =====");
  students.forEach(function(student) {
    const avg = calculateAverage(student.scores);
    const grade = getGrade(avg);
    console.log(\`\${student.name}: Average = \${avg.toFixed(1)}, Grade = \${grade}\`);
  });
}
addStudent("Sneha", [95, 91, 89]);
printReport();
// ===== STUDENT REPORT =====
// Rahul: Average = 84.3, Grade = B
// Priya: Average = 91.7, Grade = A
// Amit: Average = 61.7, Grade = C
// Sneha: Average = 91.7, Grade = A
\`\`\`

## 10.3 Extend It Yourself

:::challenge
**Capstone Challenges**
1) Add a function findTopStudent() that returns the student object with the highest average.
2) Add a function that returns an array of only the students who scored a grade of 'F', so a teacher could follow up with them.
3) Add input validation to addStudent() -- don't allow adding a student with an empty name or an empty scores array.
4) Add a removeStudent(name) function using the array methods from Section 8.
5) Calculate the class-wide average (the average of all students' averages) using a loop.
:::

:::insight
**Why this project matters**
Every real application you'll ever build -- a MERN e-commerce site, a social media clone, a booking system -- is fundamentally built from exactly these same building blocks: variables holding data, arrays and objects modeling real-world entities, functions performing operations on that data, and loops/conditionals directing the logic. If you can build this capstone confidently from scratch, you have genuinely mastered Module 1.
:::
`,
  11: `# 11. Frequently Asked Interview Questions

Practice explaining each answer out loud, in your own words -- not just reading it silently.

Q1. What's the difference between let, const, and var?

let and const are block-scoped; var is function-scoped (and hoisted in a confusing way). const cannot be reassigned; let can. var should be avoided in modern code.

Q2. What's the difference between == and ===?

== performs type coercion before comparing (converting types if needed); === checks both type and value with no conversion. Always prefer === to avoid unexpected bugs.

Q3. What is the difference between undefined and null?

undefined means a variable was declared but never assigned a value (or a property/function doesn't exist). null is an intentional 'no value' explicitly assigned by a developer.

Q4. What are truthy and falsy values?

Every value converts to true or false in a boolean context. The only falsy values are false, 0, "", null, undefined, and NaN -- everything else, including [] and {}, is truthy.

Q5. What's the difference between a function declaration and a function expression?

A function declaration (function name(){}) is hoisted and can be called before it appears in the file. A function expression (const name = function(){}) is not hoisted the same way and must be defined before use.

Q6. What is scope in JavaScript?

Scope determines where a variable is accessible: global (everywhere), function (only inside that function), or block (only inside that { } block, for let/const).

Q7. What's the difference between slice() and splice()?

slice() returns a new array without modifying the original (non-destructive). splice() modifies the original array directly, removing and/or inserting items (destructive).

Q8. How do you check if a value is an array?

Array.isArray(value) -- typeof returns "object" for both arrays and plain objects, so it cannot distinguish between them.

Q9. What does the modulo operator (%) do, and give a real use case.

It returns the remainder of a division. A common use case is checking if a number is even or odd: n % 2 === 0 means even.

Q10. Explain the difference between push/pop and shift/unshift.

push adds to the end, pop removes from the end. unshift adds to the start, shift removes from the start.

Q11. What is the purpose of the return statement in a function?

It sends a value back out of the function to wherever the function was called, and immediately stops the function's execution. Without it, a function returns undefined.

Q12. What's the difference between a parameter and an argument?

A parameter is the placeholder name in the function definition (function greet(name)). An argument is the actual value passed in when calling the function (greet("Rahul")).

Q13. How do you access a nested property in an object?

Chain dot notation (or bracket notation) for each level, e.g. company.address.city, or company.employees[0].name for an array inside an object.

Q14. What does 'this' refer to inside an object method?

It refers to the object the method was called on, allowing the method to access that specific object's own properties.

Q15. What's the difference between a for loop and a while loop?

for is typically used when the number of iterations is known in advance; while is used when looping should continue based on a condition that may not have a predetermined iteration count.

Q16. What does the break statement do inside a switch or loop?

It immediately exits the current switch block or loop entirely, skipping any remaining cases or iterations.

Q17. Why is const preferred over let by default in modern JavaScript?

It signals intent clearly (this value shouldn't be reassigned), catches accidental reassignment bugs early, and makes code easier to reason about -- switch to let only when reassignment is genuinely needed.

Q18. What is an infinite loop, and how do you accidentally create one?

A loop whose condition never becomes false, so it never stops running. Commonly caused by forgetting to update the loop variable (e.g. forgetting i++ in a while loop).

Q19. What is the output of typeof null and why is it considered a bug?

It returns "object", which is technically incorrect since null is a primitive type -- a mistake from JavaScript's original 1995 implementation that was never fixed, to avoid breaking existing code.

Q20. Why should arrays of objects be a familiar pattern to you?

It's the shape almost all real-world API and database data comes in -- a list of records, each with multiple named properties -- so comfortably looping through and accessing nested data is an essential, constantly-used skill.
`,
  12: `# 12. Glossary of Key Terms

A fast, alphabetical lookup of every important term used throughout this module.

Argument -- The actual value passed into a function when it's called.

Array -- An ordered list of values, accessed by numbered index starting at 0.

Block scope -- The visibility of a let/const variable, limited to the { } block it was declared in.

Boolean -- A data type with only two possible values: true or false.

Coercion -- JavaScript automatically converting a value's type behind the scenes during an operation.

Conditional -- A statement (if/else, switch) that runs different code depending on a true/false condition.

const -- A variable declaration keyword that prevents the variable from being reassigned.

Falsy -- A value that evaluates to false in a boolean context (false, 0, "", null, undefined, NaN).

Function -- A reusable, named block of code that performs a task, optionally taking input and returning output.

Function scope -- The visibility of a variable, limited to the function it was declared inside.

Global scope -- The outermost scope; variables here are accessible from anywhere in the code.

Index -- The numbered position of an item in an array, starting at 0.

Infinite loop -- A loop whose condition never becomes false, causing it to run forever.

Iteration -- One single pass/repeat of a loop's code block.

let -- A variable declaration keyword allowing reassignment, scoped to its block.

Method -- A function that is a property of an object.

Modulo -- The % operator, returning the remainder of a division.

Mutating -- Changing a value's contents directly, rather than creating a new copy (e.g. push, splice).

null -- An intentional 'no value', explicitly assigned by a developer.

Object -- A collection of related data stored as key-value pairs.

Operator -- A symbol that performs an action on one or more values, e.g. +, ===, &&.

Parameter -- The placeholder name for an expected input in a function's definition.

Primitive type -- A basic data type (String, Number, Boolean, Undefined, Null) that is not an object.

Property -- A key-value pair belonging to an object.

Reference type -- A data type (Object, Array) whose variable stores a reference/pointer to the value, not the value itself.

Return value -- The value a function sends back to wherever it was called, via the return keyword.

Scope -- The region of code where a particular variable can be accessed.

String -- A data type representing text, wrapped in quotes.

Ternary operator -- A compact one-line conditional: condition ? valueIfTrue : valueIfFalse.

this -- Inside an object method, refers to the object the method was called on.

Truthy -- A value that evaluates to true in a boolean context (everything except the 6 falsy values).

typeof -- An operator that returns a string naming the type of a value.

undefined -- The default value of a variable that has been declared but not yet assigned.

var -- The original (pre-2015) variable declaration keyword; avoided in modern code due to confusing scoping.
`,
  13: `# 13. Do's and Don'ts + Debugging Checklist

## 13.1 Master Do's and Don'ts

| Do | Don't |
|---|---|
| Default to const, use let only when needed | Use var in modern code |
| Use === and !== | Use == and != and rely on coercion |
| Use descriptive variable/function names | Use single letters outside of loop counters |
| Use console.log() constantly to debug | Guess what your code is doing without checking |
| Trace through loops step by step when confused | Assume a loop 'obviously' does what you intended |
| Use array methods (push/pop/slice) for arrays | Manually manage array indices when a method exists |
| Return early from functions for clarity | Nest if/else many levels deep |
| Check typeof / Array.isArray when unsure of a type | Assume a value's type without checking |

## 13.2 Debugging Your JavaScript

- console.log() everything -- print variables at each step to see exactly what your code is actually doing versus what you expect
- Use the browser's Console tab (F12) -- syntax errors and runtime errors appear here with a file name and line number
- Read error messages carefully -- 'X is not defined' means a variable/function doesn't exist in scope; 'Cannot read property of undefined' means you're trying to access something on a value that doesn't exist yet
- Trace through loops and conditionals by hand -- write out variable values on paper for each iteration/branch, exactly like the diagrams in Sections 5 and 6
- Isolate the problem -- comment out sections of code and re-enable them one at a time to find exactly which line causes an issue

## 13.3 A Before/After Mistakes Gallery

### Using == instead of ===

Before (incorrect):

\`\`\`javascript
if (age == "18") {
  // works but relies on coercion
}
\`\`\`

After (correct):

\`\`\`javascript
if (age === 18) {
  // explicit, no surprises
}
\`\`\`

### Forgetting to update the loop variable

Before (incorrect):

\`\`\`javascript
let i = 0;
while (i < 5) {
  console.log(i);
  // forgot i++ -- infinite loop!
}
\`\`\`

After (correct):

\`\`\`javascript
let i = 0;
while (i < 5) {
  console.log(i);
  i++;
}
\`\`\`

### Confusing slice with splice

Before (incorrect):

\`\`\`javascript
let arr = [1,2,3];
arr.slice(0,1);   // expecting arr to change
console.log(arr); // still [1,2,3] -- unchanged!
\`\`\`

After (correct):

\`\`\`javascript
let arr = [1,2,3];
arr.splice(0,1);  // actually removes from arr
console.log(arr); // [2,3]
\`\`\`

### Off-by-one loop error

Before (incorrect):

\`\`\`javascript
for (let i = 0; i <= arr.length; i++) {
  console.log(arr[i]);
  // last iteration logs undefined!
}
\`\`\`

After (correct):

\`\`\`javascript
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
\`\`\`

### Forgetting a return statement

Before (incorrect):

\`\`\`javascript
function add(a, b) {
  a + b;   // no return!
}
console.log(add(2,3)); // undefined
\`\`\`

After (correct):

\`\`\`javascript
function add(a, b) {
  return a + b;
}
console.log(add(2,3)); // 5
\`\`\`

### Missing break in a switch

Before (incorrect):

\`\`\`javascript
switch (day) {
  case "Mon":
    console.log("Start");
  case "Tue":
    console.log("Second");
}
// both lines print for "Mon"!
\`\`\`

After (correct):

\`\`\`javascript
switch (day) {
  case "Mon":
    console.log("Start");
    break;
  case "Tue":
    console.log("Second");
    break;
}
\`\`\`

### Sorting numbers with default sort()

Before (incorrect):

\`\`\`javascript
let nums = [10, 2, 1];
nums.sort();
console.log(nums);
// [1, 10, 2] -- sorted as strings!
\`\`\`

After (correct):

\`\`\`javascript
let nums = [10, 2, 1];
nums.sort((a, b) => a - b);
console.log(nums);
// [1, 2, 10] -- correct numeric order
\`\`\`

### Reassigning a const object entirely

Before (incorrect):

\`\`\`javascript
const user = { name: "Rahul" };
user = { name: "Priya" };
// ERROR! Cannot reassign a const
\`\`\`

After (correct):

\`\`\`javascript
const user = { name: "Rahul" };
user.name = "Priya";
// OK -- modifying a property, not reassigning
\`\`\`
`,
  14: `# 14. Quick Reference Cheat Sheet

## Variables

| Keyword | Behavior |
|---|---|
| const | Cannot be reassigned; use by default |
| let | Can be reassigned; block-scoped |
| var | Avoid -- function-scoped, confusing hoisting |

## Data Types

| Type | Example |
|---|---|
| String | "text" |
| Number | 42, 3.14 |
| Boolean | true / false |
| Undefined | declared, not assigned |
| Null | intentionally empty |
| Object | { key: value } |
| Array | [item1, item2] |

## Operators

| Operator | Purpose |
|---|---|
| + - * / % ** | Arithmetic (% = remainder, ** = exponent) |
| === !== | Strict equality/inequality (always prefer these) |
| && \\|\\| ! | Logical AND / OR / NOT |
| ? : | Ternary conditional |

## Conditionals & Loops

| Syntax | Purpose |
|---|---|
| if / else if / else | Run code based on a condition |
| switch / case / break | Multi-way branching on one value |
| for (init; cond; incr) | Loop a known number of times |
| while (cond) | Loop while a condition is true |
| do { } while (cond) | Loop at least once, then check condition |
| break / continue | Exit loop entirely / skip to next iteration |

## Functions

| Syntax | Purpose |
|---|---|
| function name() {} | Function declaration (hoisted) |
| const name = function() {} | Function expression |
| const name = () => {} | Arrow function |
| return value; | Send a value back out of the function |

## Array Methods

| Method | Effect |
|---|---|
| push(item) | Add to end |
| pop() | Remove from end |
| unshift(item) | Add to start |
| shift() | Remove from start |
| indexOf(item) | Find position (-1 if not found) |
| includes(item) | Check if a value exists |
| slice(start,end) | Copy a portion (non-destructive) |
| splice(start,count) | Remove/insert (destructive) |
| forEach(fn) | Run a function for every item |

## Objects

| Syntax | Purpose |
|---|---|
| obj.key | Dot notation access |
| obj["key"] / obj[var] | Bracket notation access (required for dynamic keys) |
| delete obj.key | Remove a property |
| Object.keys(obj) | Array of all keys |
| Object.values(obj) | Array of all values |
`,
  15: `# 15. Practice Question Bank

A large set of short-answer questions, organized by topic, for focused revision.

## 15.1 Variables & Data Types

1. What's the difference between let and const?
2. Write a variable declaration for a value that should never change.
3. What does typeof [] return?
4. Name the 5 primitive data types.
5. What's the difference between undefined and null?

## 15.2 Operators & Type Conversion

1. What does 10 % 3 evaluate to?
2. Why should you use === instead of ==?
3. What does "5" + 3 evaluate to?
4. List the 6 falsy values in JavaScript.
5. Write a ternary operator that assigns "pass" or "fail" based on a score >= 40.

## 15.3 Conditionals & Loops

1. Write an if/else-if chain assigning shipping cost based on order total.
2. What does the break statement do in a switch statement?
3. Write a for loop that prints even numbers from 2 to 20.
4. What's the difference between while and do-while?
5. How many total iterations occur in two nested loops that each run 5 times?

## 15.4 Functions

1. Write a function declaration that returns the square of a number.
2. Rewrite it as an arrow function.
3. What does a function return if there's no return statement?
4. What's the difference between a parameter and an argument?
5. Write a function with a default parameter value.

## 15.5 Arrays

1. What index does the first element of an array have?
2. Which method adds an item to the end of an array?
3. Write code to get the last item of an array without knowing its length in advance.
4. What's the key difference between slice and splice?
5. Write a forEach loop that prints each item of an array in uppercase.

## 15.6 Objects

1. Create an object representing a car with 3 properties.
2. When must you use bracket notation instead of dot notation?
3. How do you delete a property from an object?
4. What does Object.keys() return?
5. Access a deeply nested property from an object containing an array of objects.

:::note
**How to use this question bank effectively**
Cover the answer for each question, attempt it from memory, then check yourself. Any question you hesitate on is exactly the concept to re-read in the matching section above before moving forward.
:::
`,
  16: `# 16. Final Self-Assessment Quiz

Attempt all 15 questions without looking back. Answers follow at the end.

:::challenge
**Questions**
Q1) What's the difference between let, const, and var?
Q2) Name JavaScript's 5 primitive data types and 2 reference types.
Q3) Why should you always use === instead of ==?
Q4) What are the 6 falsy values in JavaScript?
Q5) In an if/else-if chain, how many branches can execute at most?
Q6) What's the difference between break and continue inside a loop?
Q7) What's the difference between a function declaration and an arrow function?
Q8) What does a function return if it has no return statement?
Q9) What index does the first item of an array have?
Q10) What's the difference between push/pop and shift/unshift?
Q11) What's the key difference between slice() and splice()?
Q12) How do you access a property using bracket notation, and when is it required?
Q13) What does 'this' refer to inside an object method?
Q14) What does typeof null return, and why is it considered a quirk?
Q15) What's the difference between type conversion and type coercion?
:::

## Answer Key

1. let and const are block-scoped (let reassignable, const not); var is function-scoped with confusing hoisting and should be avoided.
2. Primitives: String, Number, Boolean, Undefined, Null. Reference types: Object, Array.
3. === checks both type and value with no conversion; == performs type coercion first, leading to unpredictable results.
4. false, 0, "" (empty string), null, undefined, NaN.
5. Only one -- the first condition found true runs, and all remaining branches are skipped.
6. break exits the loop entirely; continue skips just the current iteration and continues looping.
7. A function declaration is hoisted (can be called before its definition in the file); an arrow function (typically stored in a const) is not, and also handles 'this' differently.
8. undefined.
9. Index 0.
10. push/pop add/remove from the END of the array; unshift/shift add/remove from the START.
11. slice() returns a new array without modifying the original; splice() modifies the original array directly.
12. obj["key"] or obj[variable]; required when the key is stored in a variable or contains special characters/spaces.
13. The object the method was called on, giving the method access to that object's own properties.
14. "object" -- a long-standing historical bug in JavaScript, kept for backward compatibility.
15. Type conversion is deliberate, done by the developer (Number("5")); type coercion is automatic, done by JavaScript behind the scenes ("5" + 3).

## What's Next: Module 2 Preview

You now have a genuinely solid JavaScript foundation -- variables, data types, operators, conditionals, loops, functions, arrays, and objects. Module 2 builds directly on top of this: the DOM (making real web pages interactive), events, ES6+ features (destructuring, spread/rest, template literals in depth), higher-order array methods (map, filter, reduce), closures, promises, and async/await for working with real APIs.

:::note
**Carry these habits forward into Module 2**
Keep tracing through code step by step whenever you're confused, exactly like the loop and conditional diagrams in this module. Keep defaulting to const and using descriptive names. And keep building small projects (like the capstone) to combine concepts -- that habit is what will make Module 2's more advanced topics click quickly.
:::

:::note
**You have now covered a genuinely complete JavaScript Module 1.**
Variables and constants, all data types, every operator family, type conversion and coercion, conditionals, loops, functions and scope, array basics and essential methods, and objects -- with real diagrams tracing through memory, loop iterations, and decision flow, plus dozens of worked examples throughout. Practice by rebuilding the capstone project from memory, then move on to Module 2.
:::
`,
}

export default content
