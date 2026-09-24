// JavaScript Module 2 — Complete Guide
// Auto-extracted from the source .docx study guide. Do not hand-edit;
// regenerate if the source document changes.

const content: Record<number, string> = {
  1: `# 1. Higher-Order Array Methods

:::definition
A higher-order function is a function that takes another function as an argument, or returns a function. JavaScript's most-used higher-order functions are array methods like map, filter, and reduce -- each takes a 'callback function' describing exactly what to do with each item, and handles the looping for you internally.
:::

![Figure 1: the three core higher-order array methods -- transform, filter, and combine](/JavaScript_2_images/image_1.png)

**Figure 1** — the three core higher-order array methods -- transform, filter, and combine

## 1.1 map() -- Transform Every Item

:::definition
map() creates a NEW array by running a function on every item of the original array, and collecting the results. The new array is always the SAME LENGTH as the original.
:::

\`\`\`javascript
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(function(num) {
  return num * 2;
});
console.log(doubled);   // [2, 4, 6, 8]
// Same thing with an arrow function (much more common in real code):
const tripled = numbers.map(num => num * 3);
console.log(tripled);   // [3, 6, 9, 12]
// Real-world example: extracting one property from an array of objects
const users = [{ name: "Rahul" }, { name: "Priya" }];
const names = users.map(user => user.name);
console.log(names);   // ["Rahul", "Priya"]
\`\`\`

:::scenario
**Real-time use case**
map() is used constantly to transform raw API data into exactly the shape a UI needs -- e.g. converting an array of product objects into an array of price strings formatted with a currency symbol, ready to display.
:::

## 1.2 filter() -- Keep Only Matching Items

:::definition
filter() creates a NEW array containing only the items for which the callback function returns true. The result can be shorter than (or equal to) the original.
:::

\`\`\`javascript
const numbers = [3, 8, 2, 9, 4, 10];
const bigNumbers = numbers.filter(function(num) {
  return num > 5;
});
console.log(bigNumbers);   // [8, 9, 10]
// Arrow function version:
const evens = numbers.filter(num => num % 2 === 0);
console.log(evens);   // [8, 2, 4, 10]
// Real-world example: filtering products in stock
const products = [
  { name: "Shirt", inStock: true },
  { name: "Shoes", inStock: false },
  { name: "Hat", inStock: true }
];
const available = products.filter(product => product.inStock);
console.log(available);  // [{name:"Shirt",...}, {name:"Hat",...}]
\`\`\`

## 1.3 reduce() -- Combine Everything Into One Value

:::definition
reduce() runs a function on every item, carrying forward an 'accumulator' value, and ultimately combines the whole array into a SINGLE result -- a total, an average, a combined object, anything.
:::

\`\`\`javascript
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce(function(accumulator, current) {
  return accumulator + current;
}, 0);   // 0 is the STARTING value of the accumulator
console.log(sum);   // 10
// Arrow function version:
const total = numbers.reduce((acc, num) => acc + num, 0);
// Real-world example: calculating a cart total
const cart = [{ price: 100 }, { price: 250 }, { price: 50 }];
const cartTotal = cart.reduce((acc, item) => acc + item.price, 0);
console.log(cartTotal);   // 400
\`\`\`

:::note
**reduce() is the trickiest of the three -- trace through it step by step**
For [1,2,3,4].reduce((acc,num) => acc+num, 0): Start acc=0. Step1: acc=0+1=1. Step2: acc=1+2=3. Step3: acc=3+3=6. Step4: acc=6+4=10. Final result: 10. This is exactly the same tracing technique from Module 1's loop diagrams -- reduce is really just a loop with a running total, wrapped up as a method.
:::

## 1.4 find(), some(), and every()

\`\`\`javascript
const numbers = [5, 12, 8, 20, 3];
console.log(numbers.find(n => n > 10));      // 12 -- the FIRST match only
console.log(numbers.some(n => n > 15));       // true -- is AT LEAST ONE true?
console.log(numbers.every(n => n > 0));       // true -- are ALL of them true?
console.log(numbers.every(n => n > 10));      // false -- not all are > 10
\`\`\`

| Method | Returns |
|---|---|
| map() | A new array, same length, transformed |
| filter() | A new array, shorter (or equal), matching items only |
| reduce() | A single combined value |
| find() | The first matching item (or undefined) |
| some() | true if AT LEAST ONE item matches |
| every() | true only if ALL items match |

## 1.5 Chaining Methods Together

Since map/filter both return new arrays, you can chain them directly -- this is extremely common in real code:

\`\`\`javascript
const products = [
  { name: "Shirt", price: 500, inStock: true },
  { name: "Shoes", price: 2000, inStock: false },
  { name: "Hat", price: 300, inStock: true }
];
const availableNames = products
  .filter(p => p.inStock)
  .map(p => p.name);
console.log(availableNames);   // ["Shirt", "Hat"]
\`\`\`

:::mistake
**Common mistakes to avoid**
1) Forgetting to return a value inside the map/filter callback -- without return, every result is undefined.
2) Forgetting the starting value (the second argument) in reduce() -- this can cause the first item to be skipped or used incorrectly as the initial accumulator.
3) Using forEach when you actually need a new array back -- forEach always returns undefined; use map instead when you need the transformed results.
4) Confusing filter (returns matching ITEMS) with find (returns only the FIRST matching item, not an array).
:::

:::challenge
**Practice Exercise 1.1**
1) Use map to convert an array of Celsius temperatures to Fahrenheit.
2) Use filter to get only the words longer than 5 characters from an array of strings.
3) Use reduce to find the maximum value in an array of numbers.
4) Chain filter and map together to get the names of all students who scored above 80 from an array of student objects.
5) Use find to get the first product priced under 1000 from an array of product objects.
:::

:::challenge
**Quick Quiz -- Section 1**
Q1) What's the key difference between map and filter in terms of what they return?
Q2) What does reduce ultimately produce?
Q3) What's the difference between find and filter?
Q4) What's the difference between some and every?
:::
`,
  2: `# 2. Callbacks

:::definition
A callback function is a function passed into another function as an argument, to be called ('called back') later -- either immediately, or after some task completes. You've already been using callbacks throughout Module 1 and Section 1 without necessarily naming them -- every function passed into map/filter/forEach is a callback.
:::

:::insight
**Analogy**
A callback is like leaving your phone number with a restaurant when there's a waiting list. You don't stand there blocking the entrance waiting -- you give them a way to 'call back' when your table is ready, and go do something else in the meantime.
:::

## 2.1 Simple Callbacks

\`\`\`javascript
function greetUser(name, callback) {
  console.log("Hello, " + name);
  callback();
}
function afterGreeting() {
  console.log("Nice to meet you!");
}
greetUser("Rahul", afterGreeting);
// "Hello, Rahul"
// "Nice to meet you!"
\`\`\`

## 2.2 Callbacks for Asynchronous Operations

:::definition
The real power of callbacks shows up with ASYNCHRONOUS operations -- tasks that take time (loading data, waiting for a timer) where JavaScript doesn't want to freeze everything else while waiting.
:::

\`\`\`javascript
console.log("Start");
setTimeout(function() {
  console.log("This runs after 2 seconds");
}, 2000);
console.log("End");
// Output order:
// "Start"
// "End"
// "This runs after 2 seconds"  (after the 2-second delay)
\`\`\`

:::insight
**Why does 'End' print before the timeout message?**
JavaScript does NOT pause and wait for setTimeout to finish. It registers the callback to run later, and immediately continues running the rest of the code. This 'non-blocking' behavior is fundamental to how JavaScript handles anything that takes time -- we'll see exactly how in Section 5 (The Event Loop).
:::

## 2.3 Callback Hell -- The Problem Promises Solve

When you need to run several async operations in sequence, each depending on the previous one's result, callbacks nested inside callbacks quickly become hard to read:

\`\`\`javascript
getUser(1, function(user) {
  getPosts(user.id, function(posts) {
    getComments(posts[0].id, function(comments) {
      console.log(comments);
      // deeply nested -- this pattern is called "callback hell"
      // it gets worse with error handling added at every level
    });
  });
});
\`\`\`

:::scenario
**Real-time use case**
This exact nested pattern used to be extremely common before Promises became standard -- loading a user, then their posts, then comments on the first post, each step depending on data from the previous one. Section 3 (Promises) and Section 4 (async/await) exist specifically to solve this readability problem.
:::

:::mistake
**Common mistakes to avoid**
1) Calling the callback function immediately with parentheses (callback()) when you meant to just pass the reference (callback) -- this runs it too early instead of waiting.
2) Assuming asynchronous code (like setTimeout) runs in the exact order it's written -- it doesn't; the rest of the synchronous code runs first.
3) Nesting too many callbacks, making code hard to read and debug -- a sign it's time to reach for Promises/async-await instead.
:::

:::challenge
**Practice Exercise 2.1**
1) Write a function processOrder(orderName, callback) that logs a message and then calls the callback.
2) Use setTimeout to simulate a 3-second delay before printing 'Data loaded'.
3) Predict the console output order of a program mixing synchronous console.log statements with a setTimeout, before running it.
:::

:::challenge
**Quick Quiz -- Section 2**
Q1) What is a callback function, in your own words?
Q2) Why does code after setTimeout run before the timeout's callback?
Q3) What problem does 'callback hell' describe?
:::
`,
  3: `# 3. Promises

:::definition
A Promise is an object representing the eventual result of an asynchronous operation -- it's a placeholder that says 'I promise to give you a value later, either successfully or with an error'. Promises were introduced specifically to solve the callback hell problem from Section 2.
:::

![Figure 2: a Promise's three possible states](/JavaScript_2_images/image_2.png)

**Figure 2** — a Promise's three possible states

:::insight
**Analogy**
A Promise is like a food delivery tracking number. The moment you order, you get a tracking ID immediately (the Promise object) -- but the food itself isn't ready yet (pending). Eventually it either arrives (fulfilled) or the order gets cancelled (rejected), and you find out which via notifications (.then() / .catch()).
:::

## 3.1 Creating and Using a Promise

\`\`\`javascript
const myPromise = new Promise(function(resolve, reject) {
  const success = true;
  setTimeout(function() {
    if (success) {
      resolve("Data loaded successfully!");
    } else {
      reject("Something went wrong!");
    }
  }, 2000);
});
myPromise
  .then(function(result) {
    console.log(result);   // "Data loaded successfully!" -- runs if resolved
  })
  .catch(function(error) {
    console.log(error);     // runs if rejected
  });
\`\`\`

## 3.2 .then() and .catch() -- Handling the Result

\`\`\`javascript
fetchUserData()
  .then(user => {
    console.log("Got user:", user);
    return user.id;   // whatever you return here becomes the input to the NEXT .then()
  })
  .then(id => {
    console.log("User ID:", id);
  })
  .catch(error => {
    console.log("Something failed:", error);
  });
\`\`\`

:::note
**Chaining .then() solves callback hell**
Instead of nesting callbacks inside callbacks (deep indentation), Promises let you chain .then() calls one after another, flat and readable, each step waiting for the previous one to finish before running.
:::

## 3.3 Promise.all() -- Running Multiple Promises Together

\`\`\`javascript
const promise1 = fetchUser();
const promise2 = fetchPosts();
const promise3 = fetchComments();
Promise.all([promise1, promise2, promise3])
  .then(function(results) {
    console.log(results);   // an array of all 3 results, in order
    // [userResult, postsResult, commentsResult]
  })
  .catch(function(error) {
    console.log("At least one promise failed:", error);
  });
\`\`\`

:::scenario
**Real-time use case**
Promise.all() is used constantly when a page needs several independent pieces of data before it can render -- e.g. a dashboard that needs user info, notifications, AND recent activity all loaded before showing the page, rather than waiting for each one sequentially (which would be much slower).
:::

## 3.4 A Complete Worked Example

\`\`\`javascript
function checkAge(age) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      if (age >= 18) {
        resolve("You are allowed entry");
      } else {
        reject("You are too young");
      }
    }, 1000);
  });
}
checkAge(20)
  .then(message => console.log(message))    // "You are allowed entry"
  .catch(error => console.log(error));
checkAge(15)
  .then(message => console.log(message))
  .catch(error => console.log(error));       // "You are too young"
\`\`\`

:::mistake
**Common mistakes to avoid**
1) Forgetting to call resolve() or reject() inside the Promise executor -- the Promise then hangs forever in the pending state.
2) Forgetting .catch() entirely, causing unhandled Promise rejections that silently fail or crash in stricter environments.
3) Nesting .then() calls instead of chaining them flat, recreating the exact callback hell problem Promises were meant to solve.
:::

:::challenge
**Practice Exercise 3.1**
1) Write a Promise that resolves with a random number after 1 second.
2) Write a Promise-based function checkPassword(password) that resolves if the password is at least 8 characters, and rejects otherwise.
3) Chain 3 .then() calls together, each logging and passing along a transformed value.
4) Use Promise.all() with 2-3 simple Promises you create yourself.
:::

:::challenge
**Quick Quiz -- Section 3**
Q1) What are the three states a Promise can be in?
Q2) What's the difference between .then() and .catch()?
Q3) What does Promise.all() do?
:::
`,
  4: `# 4. Async/Await

:::definition
async/await is modern syntax built on top of Promises that lets you write asynchronous code that READS like synchronous code -- top to bottom, without .then() chains. It doesn't replace Promises; it's a cleaner way to work with them.
:::

## 4.1 The Basic Syntax

\`\`\`javascript
async function loadData() {
  console.log("Starting...");
  const result = await fetchUserData();   // pauses HERE until the promise resolves
  console.log("Got result:", result);
  return result;
}
loadData();
\`\`\`

- async before a function makes it always return a Promise automatically
- await can only be used INSIDE an async function -- it pauses execution until the awaited Promise settles
- While 'paused', the rest of your program keeps running normally -- only the code inside that specific async function waits

## 4.2 Promises vs Async/Await -- Side by Side

\`\`\`javascript
// Promise .then() chain version:
function loadUserPromise() {
  fetchUser()
    .then(user => {
      console.log(user);
      return fetchPosts(user.id);
    })
    .then(posts => {
      console.log(posts);
    })
    .catch(error => {
      console.log("Error:", error);
    });
}
// async/await version -- reads top to bottom, much clearer:
async function loadUserAsync() {
  try {
    const user = await fetchUser();
    console.log(user);
    const posts = await fetchPosts(user.id);
    console.log(posts);
  } catch (error) {
    console.log("Error:", error);
  }
}
\`\`\`

:::note
**Error handling with try/catch**
Since await 'pauses' the function, errors are handled with a regular try/catch block wrapped around the awaited code -- exactly like handling a synchronous error, instead of chaining .catch(). This is one of the biggest readability wins of async/await.
:::

## 4.3 Awaiting Multiple Promises

\`\`\`javascript
async function loadDashboard() {
  const [user, notifications, activity] = await Promise.all([
    fetchUser(),
    fetchNotifications(),
    fetchActivity()
  ]);
  console.log(user, notifications, activity);
}
\`\`\`

Just like Promise.all() from Section 3, but combined with await for clean, readable code that waits for all three to finish before continuing.

## 4.4 A Complete Worked Example

\`\`\`javascript
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function makeCoffee() {
  console.log("Boiling water...");
  await delay(1000);
  console.log("Water boiled!");
  console.log("Brewing coffee...");
  await delay(1500);
  console.log("Coffee ready!");
}
makeCoffee();
// "Boiling water..."
// (1 second later) "Water boiled!"
// "Brewing coffee..."
// (1.5 seconds later) "Coffee ready!"
\`\`\`

:::scenario
**Real-time use case**
async/await is the standard, expected way to fetch data from a server in modern JavaScript and React applications -- you'll use it constantly starting with the Fetch API in Section 15, and even more once we reach Node.js and Express later in this course.
:::

:::mistake
**Common mistakes to avoid**
1) Using await outside of an async function -- this is a syntax error (except in newer top-level await contexts).
2) Forgetting try/catch, so errors go completely unhandled instead of being caught gracefully.
3) Awaiting Promises one at a time in sequence when they could run in parallel with Promise.all(), unnecessarily slowing down your program.
4) Forgetting that an async function ALWAYS returns a Promise, even if you write 'return 5' inside it -- the caller still needs to await or .then() it.
:::

:::challenge
**Practice Exercise 4.1**
1) Rewrite the Promise chain example from Section 3.4 using async/await and try/catch.
2) Build the makeCoffee example yourself, adding a third step (pouring milk) with its own delay.
3) Write an async function that awaits three separate delay() calls in parallel using Promise.all(), and log the total time taken.
:::

:::challenge
**Quick Quiz -- Section 4**
Q1) What does the await keyword do, and where can it be used?
Q2) How do you handle errors in async/await code?
Q3) Does async/await replace Promises, or build on top of them?
:::
`,
  5: `# 5. The Event Loop -- How Async Code Really Runs

:::definition
The event loop is the mechanism that lets JavaScript -- a single-threaded language that can only do one thing at a time -- handle asynchronous operations like timers, API calls, and events without freezing. Understanding it fully explains WHY the 'Start/End/timeout' ordering from Section 2 happens.
:::

![Figure 3: the call stack, Web APIs, callback queue, and the event loop connecting them](/JavaScript_2_images/image_3.png)

**Figure 3** — the call stack, Web APIs, callback queue, and the event loop connecting them

## 5.1 The Four Pieces

- Call Stack -- where your currently-running code executes, one function at a time, top to bottom
- Web APIs -- browser-provided features (setTimeout, fetch, DOM events) that run OUTSIDE your JavaScript code, in the browser itself
- Callback/Task Queue -- where finished async callbacks wait their turn to run
- Event Loop -- constantly checks: 'Is the call stack empty? If yes, take the next item from the queue and push it onto the stack.'

## 5.2 Tracing Through an Example

\`\`\`javascript
console.log("1");
setTimeout(function() {
  console.log("2");
}, 0);   // even with 0ms delay!
console.log("3");
// Output: 1, 3, 2  -- NOT 1, 2, 3!
\`\`\`

1. console.log("1") runs immediately on the call stack -- prints 1
2. setTimeout hands its callback off to the Web APIs, even with a 0ms delay, and JavaScript moves on immediately without waiting
3. console.log("3") runs immediately on the call stack -- prints 3
4. Only NOW, since the call stack is finally empty, does the event loop push the setTimeout callback from the queue onto the stack -- prints 2

:::insight
**The key insight: even a 0-second setTimeout still goes through the queue.**
This proves the event loop isn't really about timing -- it's about ORDER. Synchronous code (the main program, top to bottom) ALWAYS finishes completely before ANY queued async callback gets a turn, no matter how short its delay is.
:::

## 5.3 Microtasks vs Macrotasks (A Brief Note)

Promises actually use a slightly higher-priority 'microtask queue', which always empties completely before the regular callback/task queue gets a turn. This is why Promise callbacks (.then, async/await) tend to run before setTimeout callbacks, even if both were queued around the same time:

\`\`\`javascript
console.log("1");
setTimeout(() => console.log("2 (macrotask)"), 0);
Promise.resolve().then(() => console.log("3 (microtask)"));
console.log("4");
// Output: 1, 4, 3 (microtask), 2 (macrotask)
\`\`\`

:::scenario
**Real-time use case**
Understanding the event loop is exactly what lets you correctly predict the order of console.log statements in interview questions and real debugging sessions -- a genuinely common category of JavaScript interview question, and the model behind every async bug you'll ever chase down.
:::

:::mistake
**Common mistakes to avoid**
1) Assuming setTimeout(fn, 0) runs immediately -- it still goes through the queue, after all synchronous code finishes.
2) Assuming async code runs on a separate thread -- JavaScript is single-threaded; async operations are handled by the browser's Web APIs, not by JavaScript itself running in parallel.
3) Forgetting that Promise callbacks (microtasks) generally run before setTimeout callbacks (macrotasks), even when queued in the same order.
:::

:::challenge
**Practice Exercise 5.1**
1) Predict the exact console output order of a program mixing console.log, setTimeout, and a Promise.then(), before running it.
2) Write a small program using setTimeout with different delay values (0ms, 100ms, 50ms) and predict the print order.
3) Explain in your own words, out loud, why 'Start'/'End' print before a setTimeout's message, using the call stack and queue vocabulary from this section.
:::

:::challenge
**Quick Quiz -- Section 5**
Q1) What are the four pieces involved in the event loop?
Q2) What condition does the event loop constantly check?
Q3) Why does setTimeout(fn, 0) not run immediately?
Q4) Do Promise callbacks (microtasks) generally run before or after setTimeout callbacks (macrotasks)?
:::
`,
  6: `# 6. Closures

:::definition
A closure is created when a function 'remembers' the variables from the scope it was created in, even after that outer function has finished running. Every function in JavaScript automatically forms a closure over its surrounding scope -- it's not something you opt into, it's how functions inherently work.
:::

![Figure 4: an inner function retains access to its outer function's variables](/JavaScript_2_images/image_4.png)

**Figure 4** — an inner function retains access to its outer function's variables

:::insight
**Analogy**
Think of a closure like a backpack. When a function is created inside another function, it packs a backpack containing references to all the variables it might need from its surroundings. Even after the outer function finishes and 'leaves the room', the inner function still has its backpack with it, wherever it goes.
:::

## 6.1 A Basic Closure Example

\`\`\`javascript
function makeCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}
const counter = makeCounter();
console.log(counter());   // 1
console.log(counter());   // 2
console.log(counter());   // 3 -- 'count' persists between calls!
\`\`\`

Even though makeCounter() finished running after the first line, the returned inner function still has access to (and can modify) its own private count variable -- no other code outside can reach it directly.

## 6.2 Why Closures Are Useful: Data Privacy

\`\`\`javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance;   // completely private -- not accessible from outside!
  return {
    deposit: function(amount) {
      balance += amount;
      console.log(\`Deposited \${amount}. New balance: \${balance}\`);
    },
    withdraw: function(amount) {
      if (amount > balance) {
        console.log("Insufficient funds");
      } else {
        balance -= amount;
        console.log(\`Withdrew \${amount}. New balance: \${balance}\`);
      }
    },
    getBalance: function() {
      return balance;
    }
  };
}
const account = createBankAccount(1000);
account.deposit(500);     // "Deposited 500. New balance: 1500"
account.withdraw(200);    // "Withdrew 200. New balance: 1300"
console.log(account.balance);   // undefined -- can't access it directly!
console.log(account.getBalance());  // 1300 -- only through the provided method
\`\`\`

:::scenario
**Real-time use case**
This exact pattern -- private data only accessible through specific provided functions -- is used throughout real applications to protect internal state from being accidentally (or maliciously) modified from outside code, similar to how private fields work in other programming languages.
:::

## 6.3 A Common Closure Pitfall: Loops

\`\`\`javascript
// The classic beginner surprise:
for (var i = 1; i <= 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, 1000);
}
// Prints: 4, 4, 4  (NOT 1, 2, 3!) -- because var is function-scoped, not block-scoped
// The fix: use let instead of var
for (let i = 1; i <= 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, 1000);
}
// Prints: 1, 2, 3 -- let creates a NEW binding for i on each iteration
\`\`\`

:::note
**This is a real, extremely common interview question**
It's also a very real, practical reason (beyond the scoping rules from Module 1) to always prefer let over var -- this exact bug has caused real production issues in professional codebases.
:::

:::mistake
**Common mistakes to avoid**
1) Not realizing closures happen automatically -- every function closes over its surrounding scope by default, whether you intended it or not.
2) The var-in-a-loop pitfall shown above -- always use let for loop counters when the loop body contains async code.
3) Accidentally creating memory leaks by holding onto closures referencing large objects/data longer than necessary in long-running applications.
:::

:::challenge
**Practice Exercise 6.1**
1) Build the counter example yourself, then create TWO separate counters and confirm they track independently.
2) Build the bank account example, adding a transferTo(otherAccount, amount) method.
3) Recreate the var vs let loop pitfall yourself, observe the difference, and explain in your own words why it happens.
:::

:::challenge
**Quick Quiz -- Section 6**
Q1) What is a closure, in your own words?
Q2) How can closures be used to create 'private' data?
Q3) Why does the var-in-a-loop example print 4, 4, 4 instead of 1, 2, 3?
:::
`,
  7: `# 7. Constructor Functions & the new Keyword

:::definition
A constructor function is a regular function used as a template for creating multiple similar objects. By convention, constructor function names start with a capital letter, and are called using the new keyword, which creates a brand new object automatically.
:::

## 7.1 Creating Objects the Old Way (Object Literals)

\`\`\`javascript
const car1 = { brand: "Toyota", year: 2022 };
const car2 = { brand: "Honda", year: 2023 };
const car3 = { brand: "Ford", year: 2021 };
// Works fine for 1-2 objects, but repetitive and error-prone for many similar objects
\`\`\`

## 7.2 Constructor Functions

\`\`\`javascript
function Car(brand, year) {
  this.brand = brand;
  this.year = year;
  this.drive = function() {
    console.log(this.brand + " is driving!");
  };
}
const car1 = new Car("Toyota", 2022);
const car2 = new Car("Honda", 2023);
console.log(car1.brand);   // "Toyota"
console.log(car2.brand);   // "Honda"
car1.drive();                // "Toyota is driving!"
\`\`\`

The new keyword does four things automatically: creates a brand new empty object, sets 'this' to point to that new object, runs the function body (setting properties on 'this'), and returns the new object -- all without you writing any of that manually.

:::scenario
**Real-time use case**
Before ES6 classes existed (Section 9), constructor functions were the standard way to create reusable object 'templates' in JavaScript -- and understanding them makes ES6 classes much easier to understand, since classes are really just cleaner syntax built on top of this exact same mechanism.
:::

:::mistake
**Common mistakes to avoid**
1) Forgetting the new keyword when calling a constructor function -- this silently makes 'this' refer to something else entirely (the global object or undefined in strict mode), causing confusing bugs.
2) Not capitalizing constructor function names, breaking the widely understood convention that signals 'this function is meant to be used with new'.
3) Defining methods directly inside the constructor (like the drive method above) -- this creates a NEW copy of that function for every single object, wasting memory. Section 8 (Prototypes) shows the proper fix.
:::

:::challenge
**Practice Exercise 7.1**
1) Write a Person constructor function with name and age properties, and a greet() method.
2) Create 3 different Person objects and call greet() on each.
3) Try calling your constructor function WITHOUT the new keyword and observe what goes wrong.
:::

:::challenge
**Quick Quiz -- Section 7**
Q1) What four things does the new keyword do automatically?
Q2) What naming convention do constructor functions follow?
Q3) What happens if you forget the new keyword?
:::
`,
  8: `# 8. Prototypes & the Prototype Chain

:::definition
Every JavaScript object has an internal link to another object called its prototype, which it can borrow properties and methods from. When you access a property that doesn't exist directly on an object, JavaScript automatically looks up the PROTOTYPE CHAIN until it finds it (or reaches the end).
:::

![Figure 5: JavaScript searches up the prototype chain to find methods](/JavaScript_2_images/image_5.png)

**Figure 5** — JavaScript searches up the prototype chain to find methods

## 8.1 Fixing the Constructor Function Memory Problem

Recall from Section 7 that defining methods inside a constructor wastes memory, creating a new copy per object. The fix: put shared methods on the prototype instead:

\`\`\`javascript
function Car(brand, year) {
  this.brand = brand;
  this.year = year;
}
// Add the method ONCE, to the prototype -- shared by ALL Car instances
Car.prototype.drive = function() {
  console.log(this.brand + " is driving!");
};
const car1 = new Car("Toyota", 2022);
const car2 = new Car("Honda", 2023);
car1.drive();   // "Toyota is driving!"
car2.drive();   // "Honda is driving!"
console.log(car1.drive === car2.drive);   // true -- same function, shared!
\`\`\`

## 8.2 How the Lookup Actually Works

\`\`\`javascript
const car1 = new Car("Toyota", 2022);
// When you call car1.drive():
// 1. JS checks: does car1 itself have a 'drive' property? No.
// 2. JS checks car1's prototype (Car.prototype): does IT have 'drive'? Yes! Uses it.
// When you call car1.toString():
// 1. car1 itself? No.
// 2. Car.prototype? No.
// 3. Car.prototype's prototype (Object.prototype)? Yes! Found it there.
\`\`\`

:::scenario
**Real-time use case**
This exact mechanism is why every single array in JavaScript has access to push, map, filter, and dozens of other methods, without each individual array carrying its own private copy of all that code -- they're all defined once on Array.prototype and shared by every array through the prototype chain.
:::

## 8.3 Checking an Object's Prototype

\`\`\`javascript
console.log(car1.hasOwnProperty("brand"));   // true -- brand is on car1 itself
console.log(car1.hasOwnProperty("drive"));    // false -- drive is on the prototype, not car1
console.log(Object.getPrototypeOf(car1) === Car.prototype);   // true
\`\`\`

:::mistake
**Common mistakes to avoid**
1) Defining shared methods inside the constructor instead of on the prototype, wasting memory across many instances.
2) Confusing an object's OWN properties (set via this.x = ...) with properties it INHERITS from its prototype.
3) Modifying built-in prototypes (like Array.prototype) directly in real projects -- this is considered bad practice, since it can cause unpredictable conflicts with other code/libraries.
:::

:::challenge
**Practice Exercise 8.1**
1) Rewrite your Person constructor from Section 7, moving the greet() method onto Person.prototype instead.
2) Create two Person instances and confirm (using ===) that they share the exact same greet function.
3) Use hasOwnProperty to check which properties live directly on an instance versus its prototype.
:::

:::challenge
**Quick Quiz -- Section 8**
Q1) What is the prototype chain, in your own words?
Q2) Why is it more memory-efficient to put shared methods on the prototype instead of inside the constructor?
Q3) How would you check if a property belongs directly to an object versus its prototype?
:::
`,
  9: `# 9. ES6 Classes

:::definition
A class is modern, cleaner syntax for creating constructor functions and their prototype methods together -- it's often described as 'syntactic sugar' over what Sections 7 and 8 just covered manually. Classes don't add new capability; they make the same underlying mechanism much easier to read and write.
:::

![Figure 6: a class is a blueprint; each 'new' call creates a separate instance](/JavaScript_2_images/image_6.png)

**Figure 6** — a class is a blueprint; each 'new' call creates a separate instance

## 9.1 Basic Class Syntax

\`\`\`javascript
class Car {
  constructor(brand, year) {
    this.brand = brand;
    this.year = year;
  }
  drive() {
    console.log(this.brand + " is driving!");
  }
  getAge() {
    return new Date().getFullYear() - this.year;
  }
}
const car1 = new Car("Toyota", 2022);
const car2 = new Car("Honda", 2020);
car1.drive();               // "Toyota is driving!"
console.log(car2.getAge()); // e.g. 6 (depending on the current year)
\`\`\`

:::note
**Classes are exactly equivalent to Sections 7+8, combined**
The constructor() method replaces the separate constructor function. Methods written inside the class body (like drive() and getAge()) are automatically placed on the prototype, exactly like Car.prototype.drive = ... was in Section 8 -- just with cleaner, more familiar syntax.
:::

## 9.2 Inheritance with extends

\`\`\`javascript
class Vehicle {
  constructor(brand) {
    this.brand = brand;
  }
  honk() {
    console.log(this.brand + " goes beep!");
  }
}
class Car extends Vehicle {
  constructor(brand, doors) {
    super(brand);   // calls the PARENT class's constructor
    this.doors = doors;
  }
  drive() {
    console.log(this.brand + " is driving on " + this.doors + " doors!");
  }
}
const myCar = new Car("Toyota", 4);
myCar.honk();    // "Toyota goes beep!" -- inherited from Vehicle
myCar.drive();    // "Toyota is driving on 4 doors!" -- Car's own method
\`\`\`

:::scenario
**Real-time use case**
Inheritance models real-world 'is-a' relationships cleanly: a Car IS A Vehicle, an AdminUser IS A User with extra permissions, a SavingsAccount IS A BankAccount with an interest rate. This will become especially relevant once we reach React, where components are conceptually similar (though modern React favors functions over classes).
:::

## 9.3 Getters, Setters & Static Methods

\`\`\`javascript
class Circle {
  constructor(radius) {
    this.radius = radius;
  }
  get area() {                  // accessed like a property, not called like a method
    return Math.PI * this.radius ** 2;
  }
  static describe() {            // called on the CLASS itself, not an instance
    return "A Circle class representing circles";
  }
}
const c = new Circle(5);
console.log(c.area);              // 78.53... -- no parentheses needed!
console.log(Circle.describe());   // called directly on the class
\`\`\`

:::mistake
**Common mistakes to avoid**
1) Forgetting super() in a child class's constructor when extending another class -- this causes a runtime error before 'this' can be used.
2) Trying to call a static method on an instance instead of the class itself (or vice versa).
3) Forgetting that class methods are non-enumerable and behave differently from regular object properties in a few edge cases -- not something to worry deeply about yet, but worth knowing exists.
:::

:::challenge
**Practice Exercise 9.1**
1) Convert your Person constructor function from Section 7 into an ES6 class.
2) Create a Student class that extends Person, adding a school property and an extra method.
3) Add a getter to your class that computes a derived value (like age from a birth year).
4) Add a static method to one of your classes and call it directly on the class.
:::

:::challenge
**Quick Quiz -- Section 9**
Q1) Are ES6 classes a completely new mechanism, or built on top of something you already learned?
Q2) What does the super() call do inside a child class's constructor?
Q3) How is a static method called differently from a regular method?
:::
`,
  10: `# 10. ES6+ Features

ES6 (2015) and later versions added many features that are now considered standard, everyday JavaScript. You've already used some (let/const, arrow functions, template literals) -- this section rounds out the rest.

## 10.1 Destructuring -- Unpacking Values Quickly

\`\`\`javascript
// Array destructuring
const colors = ["red", "green", "blue"];
const [first, second, third] = colors;
console.log(first, second, third);   // "red" "green" "blue"
// Skipping items
const [, , thirdOnly] = colors;
console.log(thirdOnly);   // "blue"
// Object destructuring -- extremely common in real code
const person = { name: "Rahul", age: 20, city: "Delhi" };
const { name, age } = person;
console.log(name, age);   // "Rahul" 20
// Renaming while destructuring
const { name: fullName } = person;
console.log(fullName);   // "Rahul"
// Destructuring function parameters directly (very common in React later)
function printUser({ name, age }) {
  console.log(\`\${name} is \${age} years old\`);
}
printUser(person);
\`\`\`

## 10.2 Spread & Rest Operators (...)

\`\`\`javascript
// Spread: expands an array/object into individual elements
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];
console.log(arr2);   // [1, 2, 3, 4, 5]
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };
console.log(obj2);   // { a: 1, b: 2, c: 3 }
// Copying arrays/objects without mutating the original (very common pattern)
const original = [1, 2, 3];
const copy = [...original];
// Rest: collects remaining arguments into an array
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3, 4));   // 10 -- works with ANY number of arguments
\`\`\`

:::note
**Spread vs Rest -- same ... symbol, opposite direction**
Spread EXPANDS a collection into individual items (going OUT). Rest COLLECTS individual items into a collection (coming IN). Context tells you which is happening -- spread appears when building a new array/object/argument list; rest appears in a function's parameter list.
:::

## 10.3 Template Literals (Recap & Extra Features)

\`\`\`javascript
const name = "Rahul";
const age = 20;
console.log(\`\${name} is \${age} years old\`);   // string interpolation
console.log(\`\${age >= 18 ? "Adult" : "Minor"}\`);   // expressions work too!
// Multi-line strings, without needing \\n
const message = \`Line one
Line two
Line three\`;
\`\`\`

## 10.4 Optional Chaining (?.) & Nullish Coalescing (??)

\`\`\`javascript
const user = { profile: { name: "Rahul" } };
console.log(user.profile?.name);        // "Rahul"
console.log(user.address?.city);         // undefined -- NO ERROR, even though address doesn't exist!
// Without ?. this would throw: "Cannot read property 'city' of undefined"
const username = null;
console.log(username ?? "Guest");        // "Guest" -- only falls back for null/undefined
console.log(0 ?? "Guest");                 // 0 -- NOT "Guest", since 0 is not null/undefined
console.log(0 || "Guest");                 // "Guest" -- || falls back for ANY falsy value, different!
\`\`\`

:::scenario
**Real-time use case**
Optional chaining is used constantly when working with data from an API (Section 15) where you're not 100% sure a nested property will exist -- e.g. user.address?.city safely returns undefined instead of crashing your entire application if a user hasn't filled in their address yet.
:::

## 10.5 Modules -- import/export (Overview)

\`\`\`javascript
// math.js
export function add(a, b) {
  return a + b;
}
export const PI = 3.14159;
// main.js
import { add, PI } from "./math.js";
console.log(add(2, 3));   // 5
\`\`\`

Modules let you split code across multiple files and import only what you need -- essential for any real project beyond a single file, and something you'll use constantly starting with React and Node.js later in this course.

:::mistake
**Common mistakes to avoid**
1) Confusing spread (expanding out) with rest (collecting in) -- remember: spread builds something bigger, rest gathers scattered arguments.
2) Using || instead of ?? when 0 or an empty string are valid values you don't want replaced by a fallback.
3) Forgetting that destructuring a property that doesn't exist gives undefined, not an error -- combine with default values (const { age = 18 } = person) when needed.
:::

:::challenge
**Practice Exercise 10.1**
1) Destructure name, age, and city from an object in a single line, renaming one property.
2) Use the spread operator to merge two objects, with the second overriding shared keys.
3) Write a function using rest parameters that finds the maximum of any number of arguments.
4) Use optional chaining to safely access a deeply nested property that may not exist.
:::

:::challenge
**Quick Quiz -- Section 10**
Q1) What's the difference between spread and rest, even though they use the same ... syntax?
Q2) What does optional chaining (?.) prevent?
Q3) What's the key difference between ?? and ||?
:::
`,
  11: `# 11. The DOM -- Introduction & the Document Tree

:::definition
The DOM (Document Object Model) is the browser's live, in-memory, tree-shaped representation of your HTML page. Everything we've learned so far ran in isolation -- the DOM is the bridge that lets JavaScript actually see, read, and change what's on screen in real time.
:::

:::insight
**Analogy**
If your HTML file is a recipe, the DOM is the actual meal sitting on the counter after it's been cooked. JavaScript can't edit the recipe once it's cooking (the original HTML text file) -- but it CAN walk over to the counter, add more salt, rearrange the plate, or throw an ingredient away. That's exactly what DOM manipulation is.
:::

## 11.1 Why the DOM Matters

Everything you'll build from this point forward -- interactive buttons, live form validation, dynamic content updates, single-page applications, and eventually React itself -- is fundamentally about reading and manipulating the DOM. This is the single most practically important section of Module 2.

## 11.2 The console as Your DOM Playground

Open any webpage, press F12 to open DevTools, and type document in the Console tab -- you'll see the entire live DOM tree for that page. Try document.title or document.body right now on any site to see the DOM respond instantly.

\`\`\`javascript
console.log(document);          // the entire document object
console.log(document.title);     // the page's title
console.log(document.body);      // the <body> element
console.log(document.URL);       // the current page's URL
\`\`\`

:::mistake
**Common mistakes to avoid**
1) Confusing the DOM (live, in-browser, can change) with the original HTML source file (static, unchanging text on disk) -- View Page Source shows the original file; DevTools' Elements tab shows the live DOM, which JavaScript may have already modified.
2) Trying to manipulate the DOM before the page has finished loading -- covered fully in the Events section (14), where we'll use DOMContentLoaded to wait safely.
:::

:::challenge
**Quick Quiz -- Section 11**
Q1) What is the DOM, in your own words?
Q2) What's the difference between the DOM and the original HTML source file?
:::
`,
  12: `# 12. DOM Selection Methods

:::definition
Before you can change anything on a page, you first need to SELECT the exact element(s) you want to work with. JavaScript provides several methods for this, each with different behavior worth knowing precisely.
:::

![Figure 7: the four core DOM selection methods, applied to the same small page](/JavaScript_2_images/image_7.png)

**Figure 7** — the four core DOM selection methods, applied to the same small page

## 12.1 getElementById -- The Fastest, Most Specific

\`\`\`html
<div id="main">Hello</div>
<script>
  const el = document.getElementById("main");
  console.log(el);   // the actual <div> element
  // Note: no "#" prefix here -- just the raw id name
</script>
\`\`\`

Returns exactly ONE element (since IDs must be unique on a page), or null if nothing matches. This is the fastest selection method, since the browser doesn't need to search broadly.

## 12.2 querySelector -- The Modern, Flexible Choice

\`\`\`javascript
const byId = document.querySelector("#main");        // by id -- note the #
const byClass = document.querySelector(".text");       // by class -- note the .
const byTag = document.querySelector("p");              // by tag name
const nested = document.querySelector("nav a");         // CSS-style descendant selector
const complex = document.querySelector(".card:first-child .title");   // any valid CSS selector!
\`\`\`

:::note
**querySelector accepts ANY valid CSS selector**
This is exactly why it's the most commonly used selection method in modern code -- if you can write it as a CSS selector (from your CSS module), querySelector can find it. It always returns only the FIRST match.
:::

## 12.3 querySelectorAll -- Getting Every Match

\`\`\`javascript
const allCards = document.querySelectorAll(".card");
console.log(allCards.length);   // how many matched
allCards.forEach(function(card) {
  console.log(card);
});
// querySelectorAll returns a NodeList -- it supports forEach directly!
\`\`\`

## 12.4 Older Methods You'll Still Encounter

\`\`\`javascript
document.getElementsByClassName("text");   // live HTMLCollection of all matches
document.getElementsByTagName("p");         // live HTMLCollection of all <p> tags
\`\`\`

| Method | Returns |
|---|---|
| getElementById(id) | One element, or null |
| querySelector(selector) | The FIRST matching element, or null (any CSS selector) |
| querySelectorAll(selector) | A NodeList of ALL matches (supports forEach) |
| getElementsByClassName(class) | A live HTMLCollection of all matches |
| getElementsByTagName(tag) | A live HTMLCollection of all matching tags |

:::insight
**Which should YOU actually use, starting today?**
Default to querySelector and querySelectorAll for almost everything -- they're the most flexible and widely used in modern code. Use getElementById only when you specifically want the fastest possible lookup for a single known ID, which is a minor, rarely-critical performance difference in practice.
:::

:::mistake
**Common mistakes to avoid**
1) Forgetting the # or . prefix with querySelector -- document.querySelector("main") looks for a <main> TAG, not an element with id="main".
2) Trying to use array methods like .map() directly on the result of getElementsByClassName -- it's an HTMLCollection, not a real array (querySelectorAll's NodeList at least supports forEach, but for full array methods, wrap it: Array.from(collection)).
3) Selecting an element before the DOM has finished loading, getting null back -- covered in Section 14 with DOMContentLoaded.
:::

:::challenge
**Practice Exercise 12.1**
1) Build a simple HTML page with an id, several elements sharing a class, and a nav with links.
2) Select the id'd element with getElementById, then again with querySelector, and confirm they return the same element.
3) Select all class-sharing elements with querySelectorAll and loop through them with forEach, logging each one.
4) Select a nested element (like a link inside a nav) using a descendant CSS selector.
:::

:::challenge
**Quick Quiz -- Section 12**
Q1) What's the key difference between querySelector and querySelectorAll?
Q2) Why would document.querySelector("main") fail to find an element with id="main"?
Q3) Which selection method should you default to in modern code?
:::
`,
  13: `# 13. DOM Manipulation -- Changing Content, Styles & Attributes

:::definition
Once you've selected an element (Section 12), DOM manipulation is how you actually change what it shows, how it looks, or what attributes it has -- this is what makes a page feel 'alive' rather than static.
:::

## 13.1 Changing Text & HTML Content

\`\`\`javascript
const heading = document.querySelector("h1");
heading.textContent = "New Heading Text";   // sets plain text (SAFE, preferred for text)
heading.innerHTML = "<em>New</em> Heading";  // sets HTML markup (renders the <em> tag)
console.log(heading.textContent);   // reads the current text back out
\`\`\`

:::note
**textContent vs innerHTML -- an important safety distinction**
textContent treats everything as plain text (even if it looks like HTML tags, they show as literal text) -- always safe. innerHTML actually PARSES and renders HTML tags, which is powerful but risky if you ever insert raw user input directly (a security vulnerability called XSS). Prefer textContent unless you specifically need to insert HTML markup.
:::

## 13.2 Changing Styles

\`\`\`javascript
const box = document.querySelector(".box");
box.style.backgroundColor = "blue";
box.style.padding = "20px";
box.style.display = "none";       // hides the element completely
box.style.display = "block";       // shows it again
// Note: CSS properties with hyphens become camelCase in JS:
// background-color -> backgroundColor
// font-size -> fontSize
\`\`\`

## 13.3 Working with Classes -- The Preferred Way to Style

\`\`\`javascript
const box = document.querySelector(".box");
box.classList.add("active");        // adds a class
box.classList.remove("hidden");      // removes a class
box.classList.toggle("open");         // adds it if missing, removes it if present
console.log(box.classList.contains("active"));   // true
\`\`\`

:::scenario
**Real-time use case**
classList.toggle() is exactly how dark mode toggles, mobile navigation menus, and accordion/dropdown open-close states are built in real projects -- one line flips between two visual states, and all the actual styling stays cleanly defined in CSS rather than scattered across JavaScript.
:::

## 13.4 Changing & Reading Attributes

\`\`\`javascript
const img = document.querySelector("img");
console.log(img.getAttribute("src"));       // reads the current src
img.setAttribute("src", "new-photo.jpg");    // changes it
img.setAttribute("alt", "A new photo");
console.log(img.hasAttribute("alt"));         // true
\`\`\`

## 13.5 Creating & Removing Elements

\`\`\`javascript
// Creating a new element from scratch
const newPara = document.createElement("p");
newPara.textContent = "I'm a brand new paragraph!";
document.body.appendChild(newPara);   // adds it to the end of <body>
// Removing an element
const oldPara = document.querySelector(".old");
oldPara.remove();
// Inserting before a specific element
const list = document.querySelector("ul");
const newItem = document.createElement("li");
newItem.textContent = "New item";
list.insertBefore(newItem, list.firstChild);
\`\`\`

## 13.6 A Complete Worked Example -- A Live Character Counter

\`\`\`html
<textarea id="message"></textarea>
<p id="counter">0 characters</p>
<script>
  const textarea = document.getElementById("message");
  const counter = document.getElementById("counter");
  textarea.addEventListener("input", function() {
    const length = textarea.value.length;
    counter.textContent = length + " characters";
    if (length > 100) {
      counter.style.color = "red";
    } else {
      counter.style.color = "black";
    }
  });
</script>
\`\`\`

This combines selection, an event listener (fully covered in Section 14), text content updates, and style changes -- exactly the kind of small, real feature you'll build constantly.

:::mistake
**Common mistakes to avoid**
1) Using innerHTML with raw, unescaped user input -- a genuine security risk (XSS) in real applications; prefer textContent for plain text.
2) Forgetting that style changes via .style only affect INLINE styles -- if a CSS class also sets that property with higher specificity, the inline change may not visually apply as expected.
3) Trying to select and manipulate an element before the DOM has fully loaded, getting null and a 'cannot read property of null' error.
:::

:::challenge
**Practice Exercise 13.1**
1) Select a heading and change its text using textContent.
2) Select a box element and change 3 different style properties on it.
3) Use classList.toggle to build a simple show/hide button for a paragraph.
4) Create a new list item element and append it to an existing list.
5) Build the live character counter example yourself from scratch.
:::

:::challenge
**Quick Quiz -- Section 13**
Q1) What's the key safety difference between textContent and innerHTML?
Q2) What does classList.toggle() do?
Q3) How do you create a brand new element and add it to the page?
:::
`,
  14: `# 14. Events & Event Listeners

:::definition
An event is something that happens on a page -- a click, a key press, a form submission, the page finishing loading. An event listener is a function you attach to an element, telling it 'when this event happens, run this code'.
:::

## 14.1 The addEventListener Method

\`\`\`javascript
const button = document.querySelector("button");
button.addEventListener("click", function() {
  console.log("Button was clicked!");
});
// Arrow function version (more common in modern code):
button.addEventListener("click", () => {
  console.log("Clicked again!");
});
\`\`\`

| Common Event | Fires when... |
|---|---|
| click | An element is clicked |
| input | A text input's value changes, as the user types |
| submit | A form is submitted |
| keydown / keyup | A key is pressed down / released |
| mouseover / mouseout | The mouse enters / leaves an element |
| DOMContentLoaded | The HTML has fully loaded and parsed (fires on 'document') |

## 14.2 The Event Object

Every event listener callback automatically receives an 'event object' containing useful details about what happened:

\`\`\`javascript
button.addEventListener("click", function(event) {
  console.log(event.target);         // the exact element that was clicked
  console.log(event.type);            // "click"
});
const form = document.querySelector("form");
form.addEventListener("submit", function(event) {
  event.preventDefault();   // stops the page from reloading -- ESSENTIAL for forms!
  console.log("Form submitted without a page reload");
});
\`\`\`

:::note
**event.preventDefault() -- a critical method for real projects**
By default, submitting a form reloads the entire page (the old, pre-JavaScript way the web worked). Nearly every modern form uses event.preventDefault() to stop this, so JavaScript can handle the submission instead -- validating it, sending it to a server with fetch (Section 15), and updating the page without a jarring full reload.
:::

## 14.3 Waiting for the Page to Load

\`\`\`javascript
document.addEventListener("DOMContentLoaded", function() {
  console.log("The DOM is fully loaded and safe to manipulate!");
  // Put your DOM selection/manipulation code here if your <script>
  // is in <head> instead of just before </body>
});
\`\`\`

If your script tag is placed in <head> (before the body's elements exist yet), selecting elements immediately will fail. DOMContentLoaded guarantees the entire HTML structure exists before your code runs -- an alternative to the 'place scripts at the end of body' approach from Module 1.

## 14.4 A Complete Worked Example -- A Simple Toggle Menu

\`\`\`html
<button id="menu-btn">Menu</button>
<nav id="menu" class="hidden">
  <a href="#">Home</a>
  <a href="#">About</a>
</nav>
<script>
  const menuBtn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");
  menuBtn.addEventListener("click", function() {
    menu.classList.toggle("hidden");
  });
</script>
\`\`\`

This exact pattern -- a button toggling a class that CSS uses to show/hide something -- is how the vast majority of real mobile navigation menus, dropdowns, and accordions are built.

:::mistake
**Common mistakes to avoid**
1) Forgetting event.preventDefault() on form submissions, causing an unwanted full page reload.
2) Attaching event listeners before the DOM has loaded (when script is in <head>) without DOMContentLoaded, causing null selection errors.
3) Attaching a NEW event listener every time inside another function/loop by accident, causing the same action to fire multiple times.
4) Confusing the click event's event.target (the exact element clicked) with the element the listener was attached to (which could be a parent).
:::

:::challenge
**Practice Exercise 14.1**
1) Add a click listener to a button that changes the page's background color.
2) Build a form with preventDefault() that logs the entered values without reloading the page.
3) Build the toggle menu example yourself, adding your own CSS for the .hidden class.
4) Add an input event listener to a text field that live-updates a character count elsewhere on the page.
:::

## 14.5 A Practical Pattern: Debouncing (Closures + Events Together)

This section's events and Section 6's closures combine perfectly in a genuinely common real-world problem: an input event firing on every single keystroke, potentially triggering an expensive search or API call far too often.

\`\`\`javascript
function debounce(fn, delay) {
  let timeoutId;   // captured by the closure below
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
const searchInput = document.getElementById("search");
const handleSearch = debounce(function(event) {
  console.log("Searching for:", event.target.value);
  // this only fires 300ms after the user STOPS typing, not on every keystroke
}, 300);
searchInput.addEventListener("input", handleSearch);
\`\`\`

:::insight
**Why this works -- tracing the closure**
Every call to debounce() creates its own private timeoutId variable via a closure (Section 6). Each time the returned function runs (on every keystroke), it clears any pending timer and starts a fresh one. Only once 300ms pass with NO new keystrokes does the actual fn finally run. This exact pattern is used in every real search bar, resize handler, and auto-save feature you've ever used.
:::

:::challenge
**Quick Quiz -- Section 14**
Q1) What does addEventListener's second argument (the callback) receive automatically?
Q2) What does event.preventDefault() do, and when is it commonly needed?
Q3) Why might selecting an element in <head> before DOMContentLoaded fail?
:::
`,
  15: `# 15. The Fetch API -- Talking to Real Servers

:::definition
The Fetch API is JavaScript's built-in way to make HTTP requests to servers -- exactly the request/response cycle from Module 1's very first orientation topic, now actually usable in code. This is the foundation for every real dynamic web application, and directly prepares you for connecting to your own Express APIs later in this course.
:::

![Figure 8: fetch() is how your JavaScript performs this exact request-response cycle](/JavaScript_2_images/image_8.png)

**Figure 8** — fetch() is how your JavaScript performs this exact request-response cycle

## 15.1 A Basic GET Request

\`\`\`javascript
fetch("https://api.example.com/users")
  .then(response => response.json())   // parses the response body as JSON
  .then(data => console.log(data))
  .catch(error => console.log("Error:", error));
\`\`\`

fetch() returns a Promise (Section 3) that resolves with a Response object -- you typically call .json() on it (which ITSELF returns another Promise) to get the actual usable data.

## 15.2 The Same Request Using Async/Await

\`\`\`javascript
async function getUsers() {
  try {
    const response = await fetch("https://api.example.com/users");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log("Error:", error);
  }
}
getUsers();
\`\`\`

:::note
**This is the standard, expected pattern in real modern code**
fetch + async/await + try/catch is exactly how you'll retrieve data in virtually every real project going forward, including React components and Node.js scripts later in this course. Get comfortable with this exact pattern.
:::

## 15.3 Checking for Errors Properly

:::note
**A critical gotcha: fetch does NOT reject on HTTP error statuses!**
fetch() only rejects (triggers .catch) for network failures (no internet, DNS failure). A 404 or 500 response is still considered a 'successful' fetch as far as the Promise is concerned -- you must manually check response.ok.
:::

\`\`\`javascript
async function getUser(id) {
  try {
    const response = await fetch(\`https://api.example.com/users/\${id}\`);
    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log("Failed to get user:", error.message);
  }
}
\`\`\`

## 15.4 Making POST Requests -- Sending Data

\`\`\`javascript
async function createUser(name, email) {
  const response = await fetch("https://api.example.com/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: name, email: email })
  });
  const data = await response.json();
  console.log("Created:", data);
}
createUser("Rahul", "rahul@example.com");
\`\`\`

- method -- GET (default), POST, PUT, PATCH, DELETE, matching the HTTP methods from Module 1
- headers -- metadata about the request; Content-Type tells the server what format the body is in
- body -- the data being sent, converted to a JSON string with JSON.stringify()

## 15.5 PUT, PATCH & DELETE Requests

Updating and deleting data follow the same fetch pattern, just with a different method and (for updates) a body:

\`\`\`javascript
// Fully replace a resource
async function updateUser(id, userData) {
  const response = await fetch(\`https://api.example.com/users/\${id}\`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });
  return response.json();
}
// Delete a resource -- usually no body needed
async function deleteUser(id) {
  const response = await fetch(\`https://api.example.com/users/\${id}\`, {
    method: "DELETE"
  });
  if (response.ok) {
    console.log("User deleted successfully");
  }
}
\`\`\`

This maps directly onto the CRUD (Create, Read, Update, Delete) operations you'll build full REST APIs around once we reach Express -- GET reads, POST creates, PUT/PATCH updates, DELETE removes. Recognizing this pattern now makes backend work later feel immediately familiar.

## 15.6 A Complete Worked Example -- Fetching & Displaying Real Data

\`\`\`javascript
async function loadAndDisplayUsers() {
  const list = document.getElementById("user-list");
  list.textContent = "Loading...";
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) throw new Error("Failed to load users");
    const users = await response.json();
    list.innerHTML = "";   // clear "Loading..."
    users.forEach(function(user) {
      const li = document.createElement("li");
      li.textContent = user.name;
      list.appendChild(li);
    });
  } catch (error) {
    list.textContent = "Error loading users: " + error.message;
  }
}
document.addEventListener("DOMContentLoaded", loadAndDisplayUsers);
\`\`\`

This single example combines almost everything from Module 2: async/await, fetch, error handling, DOM selection, DOM manipulation, events, and array iteration -- exactly the kind of complete feature you'll build constantly going forward.

:::mistake
**Common mistakes to avoid**
1) Forgetting that a 404/500 response doesn't automatically throw -- always check response.ok manually.
2) Forgetting to call .json() (or await response.json()) to actually extract usable data from the Response object.
3) Forgetting Content-Type: application/json in headers on POST requests, causing the server to misinterpret the body.
4) Forgetting JSON.stringify() on the body -- fetch expects a string, not a raw JavaScript object.
:::

:::challenge
**Practice Exercise 15.1**
1) Use fetch to GET data from https://jsonplaceholder.typicode.com/posts and log the first 5 post titles.
2) Rewrite it using async/await with proper try/catch error handling.
3) Build the complete worked example yourself: fetch a list of items and render them into a real HTML list on a page.
4) Simulate a POST request to https://jsonplaceholder.typicode.com/posts sending a title and body, and log the server's response.
:::

:::challenge
**Quick Quiz -- Section 15**
Q1) What does fetch() return?
Q2) Why doesn't a 404 response automatically trigger .catch() or a try/catch block?
Q3) What three things does a POST request typically configure that a GET request doesn't need?
:::
`,
  16: `# 16. Practice Projects

This section combines everything from Module 2 into complete, realistic projects. Build each one yourself, then extend it using the challenge ideas provided.

## 16.1 Project 1: A Working Calculator

A calculator combines DOM selection, event listeners, and functions into a genuinely useful tool -- and is a very common practice/interview project.

\`\`\`html
<div class="calculator">
  <input type="text" id="display" readonly />
  <div class="buttons">
    <button data-value="7">7</button>
    <button data-value="8">8</button>
    <button data-value="9">9</button>
    <button data-value="+">+</button>
    <button data-value="4">4</button>
    <button data-value="5">5</button>
    <button data-value="6">6</button>
    <button data-value="-">-</button>
    <button data-value="1">1</button>
    <button data-value="2">2</button>
    <button data-value="3">3</button>
    <button data-value="*">x</button>
    <button data-value="0">0</button>
    <button data-value=".">.</button>
    <button id="equals">=</button>
    <button data-value="/">/</button>
    <button id="clear">C</button>
  </div>
</div>
\`\`\`

\`\`\`javascript
const display = document.getElementById("display");
const buttons = document.querySelectorAll("[data-value]");
const equalsBtn = document.getElementById("equals");
const clearBtn = document.getElementById("clear");
buttons.forEach(function(button) {
  button.addEventListener("click", function() {
    display.value += button.getAttribute("data-value");
  });
});
equalsBtn.addEventListener("click", function() {
  try {
    display.value = eval(display.value);   // simple approach for learning purposes
  } catch (error) {
    display.value = "Error";
  }
});
clearBtn.addEventListener("click", function() {
  display.value = "";
});
\`\`\`

:::note
**A note on eval()**
This example uses eval() to keep the logic simple for learning -- it evaluates a string as JavaScript code. In real production applications, eval() is generally avoided for security reasons (it can execute arbitrary code). A safer approach would parse the expression manually or use a small math-expression library, but eval() is perfectly fine for understanding the core DOM concepts here.
:::

## 16.2 Project 2: A Live Search Filter

\`\`\`html
<input type="text" id="search" placeholder="Search fruits..." />
<ul id="fruit-list"></ul>
<script>
  const fruits = ["Apple", "Banana", "Mango", "Orange", "Grapes", "Pineapple"];
  const searchInput = document.getElementById("search");
  const fruitList = document.getElementById("fruit-list");
  function renderList(items) {
    fruitList.innerHTML = "";
    items.forEach(function(fruit) {
      const li = document.createElement("li");
      li.textContent = fruit;
      fruitList.appendChild(li);
    });
  }
  searchInput.addEventListener("input", function() {
    const query = searchInput.value.toLowerCase();
    const filtered = fruits.filter(fruit => fruit.toLowerCase().includes(query));
    renderList(filtered);
  });
  renderList(fruits);   // show everything initially
</script>
\`\`\`

This project combines Section 1's filter() method with DOM manipulation and events -- exactly the pattern behind every real search bar you've ever used.

## 16.3 Project 3: A Weather-Style API Fetcher

\`\`\`html
<button id="load-btn">Load a Random User</button>
<div id="result"></div>
<script>
  const loadBtn = document.getElementById("load-btn");
  const result = document.getElementById("result");
  loadBtn.addEventListener("click", async function() {
    result.textContent = "Loading...";
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
      if (!response.ok) throw new Error("Failed to fetch");
      const user = await response.json();
      result.innerHTML = \`
        <h3>\${user.name}</h3>
        <p>Email: \${user.email}</p>
        <p>City: \${user.address.city}</p>
      \`;
    } catch (error) {
      result.textContent = "Error: " + error.message;
    }
  });
</script>
\`\`\`

## 16.4 Project 4: A Todo List with Closures

This project combines closures (Section 6), classes (Section 9), DOM manipulation (Section 13), and events (Section 14) into one cohesive app -- a great capstone for Module 2.

\`\`\`javascript
class TodoApp {
  constructor(listElementId) {
    this.todos = [];
    this.listEl = document.getElementById(listElementId);
  }
  addTodo(text) {
    const todo = { id: Date.now(), text: text, completed: false };
    this.todos.push(todo);
    this.render();
  }
  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) todo.completed = !todo.completed;
    this.render();
  }
  removeTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
    this.render();
  }
  render() {
    this.listEl.innerHTML = "";
    this.todos.forEach(todo => {
      const li = document.createElement("li");
      li.textContent = todo.text;
      li.style.textDecoration = todo.completed ? "line-through" : "none";
      li.addEventListener("click", () => this.toggleTodo(todo.id));
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();   // prevent the li's click (toggle) from also firing
        this.removeTodo(todo.id);
      });
      li.appendChild(deleteBtn);
      this.listEl.appendChild(li);
    });
  }
}
const app = new TodoApp("todo-list");
app.addTodo("Learn JavaScript Module 2");
app.addTodo("Build the calculator project");
\`\`\`

:::insight
**Why this project matters**
Notice how the class keeps 'todos' as private-feeling internal state (Section 6's closure/privacy ideas, now expressed through a class instance), map/filter/find (Section 1) manage the data, and DOM manipulation + events (Sections 13-14) keep the screen in sync. This exact pattern -- state, render(), and event-driven updates -- is conceptually the same model React uses, which you'll meet very soon.
:::

:::challenge
**Extend These Projects Yourself**
1) Calculator: add a percentage (%) button and a backspace button.
2) Calculator: replace eval() with your own function that safely parses simple two-number expressions.
3) Search Filter: add a 'no results found' message when the filtered list is empty.
4) Search Filter: highlight the matching part of each search result using innerHTML.
5) API Fetcher: add a loading spinner (a styled div, toggled with classList) while the fetch is in progress.
6) API Fetcher: add a dropdown to pick between 3 different user IDs to load.
7) Todo List: add a 'Clear Completed' button that removes all completed todos at once.
8) Todo List: persist the todos so they survive a page refresh (a natural bridge into localStorage, which you'll encounter in your next steps beyond this module).
:::
`,
  17: `# 17. Frequently Asked Interview Questions

Practice explaining each answer out loud, in your own words -- not just reading it silently.

Q1. What's the difference between map and forEach?

map returns a new array with transformed values; forEach returns undefined and is used purely for side effects (like logging). Use map when you need the results back.

Q2. What does reduce do, and give a real example.

It combines an entire array into a single value by running a function on each item while carrying forward an accumulator, e.g. summing a shopping cart's total price.

Q3. What is a callback function?

A function passed into another function to be executed later, either immediately or after some asynchronous operation completes.

Q4. What is a Promise, and what are its three states?

An object representing the eventual result of an async operation. States: pending, fulfilled, rejected.

Q5. How does async/await relate to Promises?

async/await is syntax built on top of Promises that lets asynchronous code be written and read like synchronous code, without explicit .then() chains.

Q6. Explain the event loop in your own words.

JavaScript is single-threaded; the event loop continuously checks if the call stack is empty, and if so, moves the next queued callback (from async operations) onto the stack to run.

Q7. What is a closure?

A function that retains access to variables from its outer scope, even after that outer function has finished executing.

Q8. Give a practical use case for closures.

Creating private, protected data that can only be accessed or modified through specifically provided functions, like a bank account's balance.

Q9. What does the 'new' keyword do?

Creates a new empty object, sets 'this' to point to it, runs the constructor function's code, and returns the new object automatically.

Q10. What is the prototype chain?

The link between an object and another object it can inherit properties/methods from; JavaScript searches up this chain when a property isn't found directly on an object.

Q11. Are ES6 classes fundamentally new, or built on existing JavaScript features?

They're syntactic sugar over constructor functions and the prototype chain -- easier to read and write, but not a fundamentally new mechanism.

Q12. What does the spread operator do versus the rest parameter?

Spread (...) expands a collection into individual elements; rest (...) collects individual arguments into a single array. Same syntax, opposite direction, distinguished by context.

Q13. What is optional chaining, and why is it useful?

The ?. operator safely accesses a nested property, returning undefined instead of throwing an error if an intermediate property doesn't exist -- very useful with uncertain API data.

Q14. What is the DOM?

The Document Object Model -- the browser's live, in-memory, tree-shaped representation of an HTML page, which JavaScript can read and modify.

Q15. What's the difference between querySelector and querySelectorAll?

querySelector returns only the first matching element; querySelectorAll returns all matches as a NodeList.

Q16. What's the difference between textContent and innerHTML?

textContent treats content as plain text (safe); innerHTML parses and renders actual HTML markup (powerful but riskier with untrusted input).

Q17. What does event.preventDefault() do?

Stops an event's default browser behavior, most commonly used to prevent a form submission from reloading the page.

Q18. Why doesn't fetch() reject on a 404 or 500 response?

fetch only rejects for network-level failures; HTTP error statuses are still considered a 'successful' fetch, so you must manually check response.ok.

Q19. What's the difference between synchronous and asynchronous code?

Synchronous code runs immediately, in order, blocking further execution until it finishes. Asynchronous code (timers, network requests) is handed off to run later without blocking the rest of the program.

Q20. Why is JavaScript described as single-threaded, and how does it still handle many things 'at once'?

It can only execute one piece of JavaScript code at a time on the call stack, but the browser's Web APIs and the event loop let it hand off slow tasks (timers, fetches) and pick their results back up later, creating the appearance of doing multiple things simultaneously.

Q21. What is event delegation, and why is it useful?

Attaching a single event listener to a parent element instead of many listeners on each child, using event.target to determine which child was actually interacted with -- more efficient and automatically works for dynamically added children.

Q22. What does e.stopPropagation() do?

Stops an event from continuing to 'bubble up' to parent elements' event listeners, useful when a child element's click shouldn't also trigger its parent's click handler.
`,
  18: `# 18. Glossary of Key Terms

A fast, alphabetical lookup of every important term used throughout this module.

async function -- A function that always returns a Promise, allowing await to be used inside it.

Callback -- A function passed into another function to be executed later.

Call stack -- Where JavaScript's currently executing code runs, one function at a time.

Class -- Modern syntax for creating constructor functions and their shared prototype methods together.

Closure -- A function that retains access to variables from its outer scope after that scope has finished executing.

Constructor function -- A function used as a template for creating similar objects via the new keyword.

DOM -- Document Object Model -- the browser's live, in-memory tree representation of an HTML page.

Event -- Something that happens on a page, such as a click, key press, or form submission.

Event listener -- A function attached to an element that runs when a specific event occurs on it.

Event loop -- The mechanism that moves queued async callbacks onto the call stack once it's empty.

Fetch API -- JavaScript's built-in method for making HTTP requests to servers.

filter() -- A higher-order array method returning a new array of only the items matching a condition.

Higher-order function -- A function that takes another function as an argument, or returns a function.

Inheritance -- A class gaining properties/methods from a parent class via extends.

map() -- A higher-order array method returning a new, transformed array of the same length.

Microtask -- A high-priority queued task (like a Promise callback) that runs before regular queued tasks.

Module -- A separate file of code, sharing functionality via export/import.

Optional chaining (?.) -- Safely accesses a nested property, returning undefined instead of throwing if it doesn't exist.

Prototype -- An object that another object can inherit properties and methods from.

Prototype chain -- The linked series of prototypes JavaScript searches through to find a property or method.

querySelector -- A DOM method returning the first element matching a CSS selector.

querySelectorAll -- A DOM method returning all elements matching a CSS selector, as a NodeList.

reduce() -- A higher-order array method combining an entire array into a single value.

Rest parameter -- Syntax (...) collecting multiple function arguments into a single array.

Spread operator -- Syntax (...) expanding an array or object into individual elements.

Static method -- A method called directly on a class itself, not on an instance of it.

Template literal -- A string wrapped in backticks, supporting \${} interpolation and multi-line text.

this -- Inside a method, refers to the object the method was called on.

Event bubbling -- The process by which an event fires on the deepest element, then propagates upward through its ancestors.

Event delegation -- Handling events for many children via a single listener on their shared parent.

NodeList -- The collection type returned by querySelectorAll, supporting forEach.

JSON -- JavaScript Object Notation -- a lightweight text format for representing structured data, used constantly with fetch.
`,
  19: `# 19. Do's and Don'ts + Debugging Checklist

## 19.1 Master Do's and Don'ts

| Do | Don't |
|---|---|
| Use map/filter/reduce for array transformations | Manually loop when a built-in method already exists |
| Use async/await with try/catch for async code | Nest callbacks many levels deep |
| Always check response.ok after a fetch | Assume fetch throws on 404/500 errors |
| Put shared methods on the prototype or in a class | Redefine methods inside every constructor call |
| Use textContent for plain text | Use innerHTML with untrusted/raw user input |
| Use querySelector/querySelectorAll by default | Mix up # and . prefixes with class/id names |
| Call event.preventDefault() on form submits | Let forms reload the page unexpectedly |
| Use let instead of var inside loops with closures | Assume var behaves the same as let in a loop |

## 19.2 Debugging Async & DOM Code

- console.log at every await/then step -- confirm each async step actually resolves with the data you expect before moving to the next
- Check the Network tab in DevTools -- see the exact request/response for every fetch call, including status codes and response bodies
- Check for null before manipulating a selected element -- if getElementById/querySelector return null, your selector or timing is wrong
- Use debugger; statements or breakpoints -- pause execution at a specific line in DevTools' Sources tab to inspect variables step by step
- Read stack traces from the bottom up -- the deepest, most specific error is usually listed first, but understanding the CALL chain that led there often means reading upward

## 19.3 A Before/After Mistakes Gallery

### Forgetting to return in map/filter

Before (incorrect):

\`\`\`javascript
const doubled = nums.map(n => {
  n * 2;   // no return -- all undefined!
});
\`\`\`

After (correct):

\`\`\`javascript
const doubled = nums.map(n => {
  return n * 2;
});
// or: nums.map(n => n * 2);
\`\`\`

### Not checking response.ok

Before (incorrect):

\`\`\`javascript
const res = await fetch(url);
const data = await res.json();
// silently gets error page as "data"
\`\`\`

After (correct):

\`\`\`javascript
const res = await fetch(url);
if (!res.ok) throw new Error("Failed");
const data = await res.json();
\`\`\`

### Using == with querySelector null check

Before (incorrect):

\`\`\`javascript
const el = document.querySelector(".x");
el.textContent = "Hi";
// crashes if .x does not exist!
\`\`\`

After (correct):

\`\`\`javascript
const el = document.querySelector(".x");
if (el) {
  el.textContent = "Hi";
}
\`\`\`

### Defining methods inside a constructor

Before (incorrect):

\`\`\`javascript
function Car(brand) {
  this.brand = brand;
  this.drive = function() {...};
  // new copy for EVERY instance!
}
\`\`\`

After (correct):

\`\`\`javascript
function Car(brand) {
  this.brand = brand;
}
Car.prototype.drive = function() {...};
\`\`\`

### var in a loop with async callbacks

Before (incorrect):

\`\`\`javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// prints 3, 3, 3
\`\`\`

After (correct):

\`\`\`javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// prints 0, 1, 2
\`\`\`

### Forgetting preventDefault on a form

Before (incorrect):

\`\`\`javascript
form.addEventListener("submit", function() {
  console.log("submitted");
  // page reloads anyway!
});
\`\`\`

After (correct):

\`\`\`javascript
form.addEventListener("submit", function(e) {
  e.preventDefault();
  console.log("submitted");
});
\`\`\`
`,
  20: `# 20. Quick Reference Cheat Sheet

## Higher-Order Array Methods

| Method | Returns |
|---|---|
| map(fn) | New array, transformed, same length |
| filter(fn) | New array, matching items only |
| reduce(fn, initial) | A single combined value |
| find(fn) | First matching item |
| some(fn) / every(fn) | true if any / all items match |

## Async JavaScript

| Syntax | Purpose |
|---|---|
| new Promise((resolve, reject) => {}) | Create a Promise |
| .then(fn) / .catch(fn) | Handle success / failure |
| Promise.all([...]) | Wait for multiple Promises together |
| async function | Declares a function that returns a Promise |
| await | Pauses inside an async function until a Promise settles |
| try { } catch (e) { } | Handle errors in async/await code |

## Closures, Constructors, Classes

| Concept | Key idea |
|---|---|
| Closure | Inner function retains access to outer scope variables |
| new Fn() | Creates object, sets this, runs Fn, returns the object |
| Fn.prototype.method | Shared method, memory-efficient across instances |
| class / constructor() | Modern syntax over constructor functions + prototypes |
| extends / super() | Inheritance between classes |

## ES6+ Features

| Syntax | Purpose |
|---|---|
| const { a, b } = obj; | Object destructuring |
| const [a, b] = arr; | Array destructuring |
| [...arr, item] | Spread -- expand into a new array/object |
| function f(...args) {} | Rest -- collect arguments into an array |
| obj?.prop | Optional chaining -- safe nested access |
| value ?? fallback | Nullish coalescing -- fallback only for null/undefined |

## DOM Selection & Manipulation

| Method / Property | Purpose |
|---|---|
| document.querySelector(sel) | First matching element |
| document.querySelectorAll(sel) | All matching elements (NodeList) |
| el.textContent / el.innerHTML | Get/set text / HTML content |
| el.style.property | Set an inline CSS style |
| el.classList.add/remove/toggle | Manage CSS classes |
| document.createElement(tag) | Create a new element |
| parent.appendChild(el) | Add an element to the page |
| el.remove() | Remove an element from the page |

## Events & Fetch

| Syntax | Purpose |
|---|---|
| el.addEventListener(type, fn) | Run fn when the event fires |
| event.preventDefault() | Stop default browser behavior (e.g. form reload) |
| fetch(url) | Make an HTTP request, returns a Promise |
| response.ok / response.status | Check if the HTTP response succeeded |
| response.json() | Parse the response body as JSON (returns a Promise) |
| fetch(url, { method, headers, body }) | Configure a POST/PUT/DELETE request |
`,
  21: `# 21. Practice Question Bank

A large set of short-answer questions, organized by topic, for focused revision.

## 21.1 Higher-Order Functions & Callbacks

1. Write a map call that converts an array of names to uppercase.
2. Write a filter call that keeps only numbers divisible by 3.
3. Write a reduce call that counts how many items in an array are true.
4. What is a callback function?
5. Why does code after setTimeout often run before its callback?

## 21.2 Promises & Async/Await

1. What are the three states of a Promise?
2. Rewrite a .then()/.catch() chain using async/await.
3. What does Promise.all() do?
4. How do you handle errors in async/await code?
5. Why must fetch() responses be manually checked with response.ok?

## 21.3 Closures, Constructors, Prototypes, Classes

1. Write a closure-based counter function.
2. What does the 'new' keyword do?
3. Why should shared methods live on the prototype rather than inside a constructor?
4. Convert a constructor function to an ES6 class.
5. What does the extends keyword do?

## 21.4 ES6+ Features

1. Destructure two properties from an object in one line.
2. Use the spread operator to merge two arrays.
3. Write a function using rest parameters.
4. What does optional chaining prevent?
5. What's the difference between ?? and ||?

## 21.5 DOM & Events

1. What's the difference between querySelector and querySelectorAll?
2. How do you safely set plain text content on an element?
3. Write code that adds a click listener to a button.
4. What does event.preventDefault() do?
5. How do you create and append a new element to the page?

## 21.6 Fetch API

1. Write a basic fetch GET request using async/await.
2. Why doesn't a 404 response trigger a catch block automatically?
3. What three fetch options configure a POST request?
4. What does response.json() return?
5. Write error handling for a fetch call using try/catch.

:::note
**How to use this question bank effectively**
Cover the answer for each question, attempt it from memory, then check yourself. Any question you hesitate on is exactly the concept to re-read in the matching section above before moving forward.
:::
`,
  22: `# 22. Final Self-Assessment Quiz

Attempt all 15 questions without looking back. Answers follow at the end.

:::challenge
**Questions**
Q1) What's the key difference between map and filter?
Q2) What does reduce ultimately produce?
Q3) What are the three states of a Promise?
Q4) How does async/await relate to Promises?
Q5) What four pieces are involved in the event loop?
Q6) What is a closure, in your own words?
Q7) What does the 'new' keyword do automatically?
Q8) Why put shared methods on a prototype instead of inside a constructor?
Q9) Are ES6 classes a new mechanism, or built on existing features?
Q10) What's the difference between spread and rest, despite sharing the ... syntax?
Q11) What's the difference between querySelector and querySelectorAll?
Q12) What's the safety difference between textContent and innerHTML?
Q13) What does event.preventDefault() commonly prevent?
Q14) Why must you manually check response.ok after a fetch call?
Q15) What does JSON.stringify() do, and when is it needed with fetch?
:::

## Answer Key

1. map returns a new array of the SAME length, transformed; filter returns a new array that may be SHORTER, containing only matching items.
2. A single combined value (a total, an object, anything built up from the whole array).
3. Pending, fulfilled, rejected.
4. async/await is syntax built on top of Promises, letting async code be written and read like synchronous code, without explicit .then() chains.
5. The call stack, Web APIs, the callback/task queue, and the event loop itself, which moves queued callbacks onto the stack once it's empty.
6. A function that retains access to variables from its outer scope, even after that outer function has finished running.
7. Creates a new empty object, sets 'this' to point to it, runs the constructor's code, and returns the new object.
8. It's more memory-efficient -- a method on the prototype is shared by ALL instances, instead of each instance carrying its own private copy.
9. Built on existing features -- classes are syntactic sugar over constructor functions and the prototype chain.
10. Spread EXPANDS a collection into individual items; rest COLLECTS individual items into a collection. Context (where the ... appears) tells you which.
11. querySelector returns only the FIRST matching element; querySelectorAll returns ALL matches as a NodeList.
12. textContent treats content as plain text (always safe); innerHTML parses and renders actual HTML (powerful but risky with untrusted input).
13. A form's default behavior of reloading the page on submission.
14. Because fetch() only rejects for network-level failures, not HTTP error statuses like 404 or 500 -- those still resolve as a 'successful' fetch.
15. It converts a JavaScript object into a JSON string; needed because the fetch body option must be a string, not a raw object, when sending JSON data.

## What's Next: Module 3 Preview

You now have a genuinely strong, complete JavaScript foundation across both modules -- from basic variables all the way through async programming, classes, and real API communication. This is precisely the JavaScript knowledge that everything else in this MERN course builds on top of: React (Month 2) uses these exact concepts constantly -- array methods for rendering lists, closures and classes conceptually related to components, fetch for data, and DOM concepts that React abstracts but still relies on underneath. Node.js and Express (Month 3) run this same JavaScript language on the server, using promises and async/await constantly for database operations.

:::note
**Carry these habits forward**
Keep tracing through async code step by step when confused, exactly like the event loop diagram in this module. Keep defaulting to modern syntax (arrow functions, destructuring, async/await, classes) over older patterns. And keep building small, complete projects like the calculator and search filter -- that habit of combining concepts into real, working features is exactly what carries you successfully into React next.
:::

:::note
**You have now covered a genuinely complete JavaScript Module 2.**
Higher-order array methods, callbacks, Promises, async/await, the event loop, closures, constructor functions, prototypes, ES6 classes, modern ES6+ syntax, the DOM and DOM manipulation, events, and the Fetch API -- with real diagrams tracing through data transformations, async execution order, memory/scope, and object relationships, plus dozens of worked examples and three complete practice projects. You are now ready for React.
:::
`,
}

export default content
