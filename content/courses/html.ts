// HTML — Complete Guide (Extended Edition)
// Auto-extracted from the source .docx study guide. Do not hand-edit;
// regenerate if the source document changes.

const content: Record<number, string> = {
  1: `# 1. What is HTML?

:::definition
HTML (HyperText Markup Language) is not a programming language -- it has no logic, no calculations, no decision-making. It is a markup language: its only job is to describe the structure and meaning of content on a webpage, telling the browser 'this text is a heading', 'this is a paragraph', 'this is a list'. Every website you have ever visited started life as HTML. CSS then makes it look good, and JavaScript makes it interactive -- but HTML is always the foundation everything else is built on top of.
:::

:::insight
**Analogy -- Building a house**
HTML is the skeleton/structure of a house -- walls, rooms, and doors in the right places. CSS is the interior design -- paint colors, furniture, lighting. JavaScript is the electricity and automation -- the doorbell that rings, the lights that turn on. You cannot skip the skeleton and jump straight to paint, which is exactly why HTML is always learned first, and why we spend real time mastering it before touching anything else.
:::

## 1.1 A Brief History -- Why HTML Looks the Way It Does

HTML was created in 1991 by Tim Berners-Lee to share scientific documents between researchers. It has evolved through several versions -- HTML 2, 3.2, 4.01, XHTML -- until HTML5, released in 2014, which is the version used across the entire modern web today (and the version this entire guide teaches). HTML5 added semantic tags (header, nav, article), native audio/video support, and many new form input types, removing the need for old plugins like Flash. Every time you write \`<!DOCTYPE html>\`, you are telling the browser to use HTML5's rules.

## 1.2 How a Webpage Reaches Your Screen

Every time you visit a website, your browser (the client) requests a file from a remote computer (the server). The server sends back an HTML file (plus CSS and JavaScript), and your browser reads it from top to bottom, building what's called the DOM (Document Object Model) -- a live, in-memory tree representation of your page -- and paints it on your screen.

![Figure 1: how a webpage travels from a server to your browser](/HTML_images/image_1.png)

**Figure 1** — how a webpage travels from a server to your browser

1. Your browser looks up the website's address (DNS lookup) to find the server
2. Your browser sends a request asking for the page (an HTTP request)
3. The server processes the request and sends back the HTML file (an HTTP response)
4. Your browser reads the HTML top to bottom and builds the DOM
5. The browser paints the DOM onto your screen as the webpage you see

## 1.2b What Happens Inside the Browser -- The Rendering Pipeline

Once the HTML file arrives, the browser does not simply display it instantly -- it goes through several precise stages. Understanding this pipeline explains why some things (like a slow-loading image) can delay the whole page, and why the order of your HTML/CSS/JS matters.

![Figure 1b: the browser rendering pipeline, from raw HTML to pixels on screen](/HTML_images/image_2.png)

**Figure 1b** — the browser rendering pipeline, from raw HTML to pixels on screen

- Parse to DOM Tree -- the browser reads your HTML tags and builds the tree structure we saw earlier
- Parse CSS to CSSOM -- similarly, all CSS rules are parsed into their own tree of styling rules
- Combine into Render Tree -- DOM + CSSOM are merged to know exactly what should appear and how
- Layout -- the browser calculates the exact size and position of every element on the page
- Paint -- the final pixels are drawn onto your screen

This is also exactly why script placement (covered next week with JavaScript) matters so much -- a script running before the DOM is built has nothing to work with yet.

## 1.3 Anatomy of a Web Address (URL)

Since we'll be typing and linking to URLs constantly (Section 6), it's worth understanding what each part of one actually means:

![Figure 1c: the five parts of a typical URL](/HTML_images/image_3.png)

**Figure 1c** — the five parts of a typical URL

| Part | Meaning |
|---|---|
| Protocol (\`https://\`) | The rules used to transfer data; https is the secure, encrypted version of http |
| Domain (\`www.mysite.com\`) | The human-readable address of the server |
| Path (\`/courses\`) | Which specific page or resource on that server you want |
| Query (\`?id=42\`) | Extra parameters sent to the server, often used to filter or identify specific data |
| Fragment (\`#section2\`) | Jumps to a specific section within the page itself, handled entirely by the browser |

## 1.4 What You Need to Get Started

- A code editor -- VS Code is the industry standard and completely free
- A web browser -- Google Chrome is recommended, since it has excellent built-in developer tools (press F12 to open them)
- That's it! HTML needs no installation, no compiler, no special software -- just a text editor and a browser. This is very different from many other programming environments, and part of why HTML is a great starting point.

## 1.5 Your Very First Webpage

Let's not wait any longer -- create a folder, open it in VS Code, create a file named index.html, and type this exactly:

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello World! I am learning HTML.</h1>
  </body>
</html>
\`\`\`

Save the file, then double-click it to open it in Chrome. You have just built and viewed your first webpage -- the exact same fundamental process every website in the world uses, from the simplest personal blog to Google's homepage.

:::challenge
**Practice Exercise 1.1**
1) Recreate the example above exactly, then change the text inside \`<h1>\` to your own name.
2) Add a second line below it using a \`<p>\` tag introducing yourself in one sentence.
3) Save and refresh your browser to see the change. This save-refresh cycle is something you will repeat thousands of times during this course -- get comfortable with it now.
:::

:::mistake
**Common mistakes to avoid**
1) Forgetting to save the file (Ctrl+S) before refreshing the browser -- the browser always shows the last saved version, never unsaved changes.
2) Naming the main file something other than index.html -- servers look for index.html by default.
3) Not double-checking spelling of tag names -- \`<h1>\` and \`<H1>\` both work (HTML tags are not case-sensitive), but consistent lowercase is the professional standard.
:::
`,
  2: `# 2. The HTML Document Structure (Boilerplate)

Every single HTML file you will ever write starts with the same basic skeleton, called the boilerplate. Let's break it down piece by piece, and understand not just WHAT each line does, but WHY it's needed.

\`\`\`html
<!DOCTYPE html>        <!-- Tells the browser: use HTML5 rules -->
<html lang="en">        <!-- Root element wrapping the whole page -->
  <head>                 <!-- Meta info, NOT shown on the page itself -->
    <meta charset="UTF-8" />
    <title>Page Title</title>   <!-- Shown on the browser tab -->
  </head>
  <body>                 <!-- Everything VISIBLE to the user goes here -->
    <h1>This is visible content</h1>
  </body>
</html>
\`\`\`

## 2.1 Line by Line Breakdown

| Line | What it does |
|---|---|
| \`<!DOCTYPE html>\` | Must always be the very first line. Tells the browser to render using modern HTML5 rules instead of guessing based on old, inconsistent standards. |
| \`<html lang="en">\` | The root element wrapping the entire page. The lang attribute tells browsers, translators, and screen readers what language the page is in. |
| \`<head>\` | Holds information ABOUT the page: title, character encoding, links to CSS files, meta tags. Nothing inside it is visible on the page itself. |
| \`<meta charset="UTF-8">\` | Ensures special characters and symbols (accents, currency signs, emoji) display correctly across every device and language. |
| \`<title>\` | The text shown on the browser tab, and the default text used when someone bookmarks your page. |
| \`<body>\` | Holds everything the user actually sees and interacts with -- this is where 95% of your work happens. |

## 2.2 A Second, Slightly Richer Example

Here's a more realistic head section, exactly as you'd find in a real project:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Rahul Kumar - Portfolio</title>
  <link rel="stylesheet" href="style.css" />
  <link rel="icon" href="favicon.ico" />
</head>
<body>
  <h1>Welcome to My Portfolio</h1>
</body>
</html>
\`\`\`

Notice the \`<link>\` tags -- one connects an external CSS stylesheet (which we'll use starting next week), and one sets the small icon shown in the browser tab (the favicon). Both go inside \`<head>\`, since neither is directly visible content on the page itself.

## 2.3 Comments -- Notes That Never Appear on the Page

Comments let you leave notes for yourself or teammates directly inside the code, without affecting what the page displays:

\`\`\`html
<!-- This is a comment. The browser will NOT display this to users. -->
<!-- Comments are useful for explaining WHY something was done a certain way -->
<body>
  <!-- Navigation section starts here -->
  <nav>...</nav>
</body>
\`\`\`

:::challenge
**Practice Exercise 2.1**
1) Build a complete boilerplate for a page titled 'My Blog'.
2) Add a meta description tag describing what the blog is about.
3) Add two comments: one above the head section explaining what it contains, and one above the body explaining what it contains.
4) Verify in Chrome that your title shows correctly on the browser tab.
:::

:::mistake
**Common mistakes to avoid**
1) Forgetting the closing \`</html>\` tag at the very end -- always double-check your file 'closes' everything it opens.
2) Placing visible content (like text or images) directly inside \`<head>\` -- it won't show on the page and will confuse browsers.
3) Forgetting \`<meta charset="UTF-8">\` -- special characters like currency symbols or accented letters may display as broken boxes or question marks without it.
:::

:::challenge
**Quick Quiz -- Section 2**
Q1) What must always be the first line of an HTML file?
Q2) What goes inside <head> versus <body>?
Q3) Why is charset="UTF-8" important?
:::
`,
  3: `# 3. Tags, Elements & Attributes -- The Building Blocks

:::insight
**The three core concepts**
Tag: a keyword wrapped in angle brackets, e.g. \`<p>\` (opening tag) and \`</p>\` (closing tag). The closing tag has a forward slash.
Element: an opening tag + its content + closing tag together, e.g. \`<p>Hello</p>\` is one complete element.
Attribute: extra information added inside the opening tag, written as name="value", e.g. \`<a href="https://google.com">\` -- here href is the attribute.
:::

## 3.1 HTML is a Tree Structure

Every tag is 'nested' inside a parent tag, forming a tree, exactly like a family tree with grandparents, parents, and children. The browser reads this tree to know what belongs inside what, and this tree is exactly what becomes the DOM we mentioned in Section 1.

![Figure 2: an HTML document is structured as a nested tree of elements](/HTML_images/image_4.png)

**Figure 2** — an HTML document is structured as a nested tree of elements

Reading this tree: \`<html>\` is the root, with two children -- \`<head>\` and \`<body>\`. \`<head>\` has its own children (\`<title>\`, \`<meta>\`), and \`<body>\` has its own children (\`<h1>\`, \`<p>\`, \`<img>\`), some of which have children of their own (\`<ul>\` containing \`<li>\`). This nesting can go as deep as needed.

## 3.2 Void (Self-Closing) Elements

A small number of elements have no content and therefore no closing tag at all. Don't try to close these -- it's a common beginner mistake:

| Tag | Purpose |
|---|---|
| \`<img>\` | Embeds an image |
| \`<br>\` | Inserts a line break |
| \`<hr>\` | Inserts a horizontal divider line |
| \`<input>\` | A form input field |
| \`<meta>\` | Page metadata inside head |
| \`<link>\` | Links an external resource (like a CSS file) |

\`\`\`html
<!-- Correct: -->
<img src="photo.jpg" alt="A photo" />
<br />
<!-- WRONG -- these elements never have a closing tag: -->
<img src="photo.jpg"></img>   <!-- incorrect! -->
<br></br>                      <!-- incorrect! -->
\`\`\`

## 3.3 Global Attributes -- Available on (Almost) Every Tag

Some attributes aren't specific to one tag -- they can be added to almost any HTML element. These are essential to know early, since you'll use them constantly:

| Attribute | Purpose |
|---|---|
| \`id\` | A unique identifier for one specific element (no two elements should share an id) |
| \`class\` | A reusable identifier that can be applied to many elements (used heavily for CSS styling) |
| \`style\` | Inline CSS applied directly to this one element (generally avoided in real projects) |
| \`title\` | Extra text shown as a tooltip when hovering over the element |
| \`data-*\` | Custom data attributes for storing extra information, e.g. data-user-id="42", often read by JavaScript |
| \`hidden\` | Hides the element completely from the page |

\`\`\`html
<p id="intro" class="highlight" title="This is the introduction">
  Welcome to my website!
</p>
<div data-user-id="42" data-role="admin">Rahul Kumar</div>
\`\`\`

id vs class is one of the most important distinctions in all of HTML: use id when only ONE specific element on the whole page needs that identifier (e.g. the main header). Use class when the SAME styling or identifier needs to apply to MANY elements (e.g. every 'card' on a page). We'll use both constantly from next week's CSS.

## 3.4 Nesting Rules -- What's Allowed Inside What

HTML has rules about what can be nested inside what. For instance, block-level elements like \`<div>\` can generally contain other block or inline elements, but some tags have strict rules -- e.g. a \`<p>\` tag cannot contain another \`<p>\` tag or any other block-level element inside it. When in doubt, keep nesting logical and check your work by viewing it in the browser.

\`\`\`html
<!-- Correct nesting -->
<div>
  <h2>Title</h2>
  <p>Some <strong>bold</strong> text inside a paragraph.</p>
</div>
<!-- INCORRECT: a <p> cannot contain a <div> -->
<p>
  <div>This is invalid HTML</div>
</p>
\`\`\`

:::challenge
**Quick Quiz -- Section 3**
Q1) What's the difference between a tag and an element?
Q2) Name three void (self-closing) elements.
Q3) When should you use id versus class?
Q4) What does the data-* attribute pattern get used for?
:::
`,
  4: `# 4. Headings & Text Formatting

## 4.1 Headings

Headings represent the structure/importance of your content, from h1 (most important, usually one per page) down to h6 (least important). Think of them exactly like a book's table of contents -- Chapter (h1) > Section (h2) > Sub-section (h3).

\`\`\`html
<h1>Biggest Heading -- usually just ONE per page (the main title)</h1>
<h2>Second Level Heading -- major sections</h2>
<h3>Third Level Heading -- sub-sections</h3>
<h4>Fourth Level -- rarely needed, but available</h4>
<h5>Fifth Level -- rarely needed</h5>
<h6>Smallest Heading -- rarely needed</h6>
\`\`\`

:::mistake
**Common mistake to avoid**
Beginners often pick a heading level purely because of its default font size (e.g. using \`<h3>\` just because it 'looks right'). This is wrong. Heading levels represent structure/importance, like a book's chapter -> section -> sub-section hierarchy. Control visual size with CSS (next week), never by picking the wrong heading level for its look. A screen reader user often jumps between headings to navigate a page quickly -- skipping levels or misusing them breaks that navigation.
:::

## 4.2 Paragraphs & Inline Text Formatting

Beyond plain paragraphs, HTML offers many inline tags for formatting specific words or phrases within text:

\`\`\`html
<p>This is a normal paragraph of text.</p>
<b>Bold text (visual only)</b>
<strong>Important bold text (visual + semantic meaning)</strong>
<i>Italic text (visual only)</i>
<em>Emphasized italic text (visual + semantic meaning)</em>
<mark>Highlighted text, like a highlighter pen</mark>
<small>Fine print / less important text</small>
<del>Deleted / struck-through text</del>
<ins>Newly inserted / underlined text</ins>
<sub>Subscript</sub>  <sup>Superscript</sup>
<abbr title="HyperText Markup Language">HTML</abbr>  <!-- hover to see tooltip -->
<code>console.log("code snippets")</code>
<blockquote>A longer quoted block of text, often indented</blockquote>
<br />              <!-- line break -->
<hr />              <!-- horizontal divider line -->
\`\`\`

:::note
**b vs strong, i vs em -- why both exist**
\`<b>\` and \`<i>\` only change how text looks. \`<strong>\` and \`<em>\` look the same by default, but also tell screen readers and search engines that this text carries real semantic importance. In professional code, prefer strong/em unless you genuinely just want a visual style with no extra meaning attached.
:::

:::scenario
**Real-time use case**
On an Amazon product page: the product name uses \`<h1>\`, the description uses \`<p>\` tags, the discounted price is wrapped in \`<strong>\` to make it bold and important, and technical specifications sometimes use \`<abbr>\` for terms like 'RAM' with the full meaning shown as a tooltip.
:::

## 4.3 A Worked Example -- Combining Text Tags

Here's a realistic paragraph combining several of the tags above, exactly how you'd see it in a real article:

\`\`\`html
<article>
  <h2>Why Learn <abbr title="MongoDB, Express, React, Node">MERN</abbr>?</h2>
  <p>
    MERN is one of the <strong>most in-demand</strong> stacks in web
    development today. According to recent surveys, <mark>over 40%</mark>
    of full-stack job postings mention JavaScript-based stacks like MERN.
  </p>
  <p><small>Source: Industry hiring report, 2026</small></p>
</article>
\`\`\`

## 4.4 A Few More Useful Text Tags

These appear less often, but are genuinely useful and worth recognizing:

\`\`\`html
<p>Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save your file.</p>
<p>The variable <var>x</var> represents the total price.</p>
<p>Example output: <samp>Hello World!</samp></p>
<p><cite>The MDN Web Docs</cite> is an excellent HTML reference.</p>
\`\`\`

| Tag | Purpose |
|---|---|
| \`<kbd>\` | Represents keyboard input, e.g. showing a keyboard shortcut |
| \`<var>\` | Represents a variable in a mathematical or programming context |
| \`<samp>\` | Represents sample output from a computer program |
| \`<cite>\` | References the title of a creative work, e.g. a book or article |

:::scenario
**Real-time use case**
Technical documentation and tutorial sites (like this one!) use <kbd> constantly to show keyboard shortcuts clearly, and <samp> to show exactly what output a reader should expect to see.
:::

## 4.5 HTML Entities (Special Characters)

Some characters have special meaning in HTML (like < and >, which define tags), so to display them as visible text you need special codes called entities:

| Character | Entity Code | Meaning |
|---|---|---|
| < | &lt; | Less than |
| > | &gt; | Greater than |
| & | &amp; | Ampersand |
| (space) | &nbsp; | Non-breaking space |
| © | &copy; | Copyright symbol |
| ™ | &trade; | Trademark symbol |
| ₹ | &#8377; | Indian Rupee symbol |
| ‘ ’ | &lsquo; &rsquo; | Curly single quotes |

\`\`\`html
<p>To create a paragraph, use the &lt;p&gt; tag.</p>
<p>Price: &#8377;25,000 &copy; 2026 MERN Academy&trade;</p>
\`\`\`

:::challenge
**Practice Exercise 4.1**
1) Write a short 'About Me' paragraph using at least 5 different text formatting tags from this section.
2) Use an \`<abbr>\` tag for an acronym relevant to you (e.g. your college name), with the full form as the title.
3) Correctly display the text 'Use <div> for containers' as VISIBLE text on a page (hint: you'll need entities for the angle brackets).
:::

:::challenge
**Quick Quiz -- Section 4**
Q1) What's the real difference between <strong> and <b>?
Q2) Why shouldn't you pick a heading level just because of its size?
Q3) What entity code displays a literal < symbol as text?
Q4) What does the <abbr> tag's title attribute do?
:::
`,
  5: `# 5. Lists

:::definition
Lists group related items together. HTML has three types: unordered (bullet points, order doesn't matter), ordered (numbered, order matters), and description lists (term-definition pairs).
:::

![Figure 3: the three list types side by side](/HTML_images/image_5.png)

**Figure 3** — the three list types side by side

## 5.1 Unordered & Ordered Lists

\`\`\`html
<!-- Unordered list: bullet points -->
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
<!-- Ordered list: numbered -->
<ol>
  <li>Learn HTML</li>
  <li>Learn CSS</li>
  <li>Learn JavaScript</li>
</ol>
<!-- Ordered list starting from a custom number -->
<ol start="5">
  <li>Step five</li>
  <li>Step six</li>
</ol>
<!-- Ordered list with a different numbering style -->
<ol type="A">
  <li>Option A</li>
  <li>Option B</li>
</ol>
\`\`\`

## 5.2 Nested Lists

A list can contain another list inside one of its items -- this is how dropdown menus and multi-level outlines are structured:

\`\`\`html
<ul>
  <li>Frontend
    <ul>
      <li>HTML</li>
      <li>CSS</li>
      <li>JavaScript</li>
    </ul>
  </li>
  <li>Backend
    <ul>
      <li>Node.js</li>
      <li>Express.js</li>
    </ul>
  </li>
</ul>
\`\`\`

## 5.3 Description Lists

\`\`\`html
<dl>
  <dt>HTML</dt>
  <dd>The markup language used to structure web content</dd>
  <dt>CSS</dt>
  <dd>The language used to style web content</dd>
  <dt>JavaScript</dt>
  <dd>The programming language used to make web content interactive</dd>
</dl>
\`\`\`

:::scenario
**Real-time use case**
A restaurant website's menu page uses \`<ul>\` to list dish names (order doesn't matter). A recipe website uses \`<ol>\` for numbered cooking steps (order matters -- step 1 before step 2). A multi-level navigation menu uses nested lists for dropdown submenus. An FAQ or glossary page often uses \`<dl>\` for term-definition pairs.
:::

:::challenge
**Practice Exercise 5.1**
1) Build a nested unordered list of your favorite foods, grouped into at least two categories (e.g. 'Breakfast' and 'Dinner').
2) Build an ordered list of 5 steps for making your favorite recipe.
3) Build a description list defining 3 technical terms you've learned so far in this course.
:::

:::challenge
**Quick Quiz -- Section 5**
Q1) Which list type is used when order does not matter?
Q2) How do you create a nested list?
Q3) What are dt and dd used for inside a dl?
:::
`,
  6: `# 6. Links (Anchor Tags)

:::definition
The \`<a>\` (anchor) tag creates a hyperlink -- clickable text or an image that navigates the user to another page, another section of the same page, an external website, or triggers an email/phone action.
:::

\`\`\`html
<a href="https://google.com">Visit Google</a>              <!-- Absolute -->
<a href="about.html">About Us</a>                       <!-- Relative -->
<a href="../index.html">Back to Home</a>                 <!-- Go up a folder -->
<a href="#contact">Jump to Contact Section</a>           <!-- Same-page jump -->
<a href="https://google.com" target="_blank">New Tab</a>
<a href="mailto:hello@example.com">Email Us</a>           <!-- Opens email app -->
<a href="tel:+911234567890">Call Us</a>                  <!-- Opens dialer -->
<a href="resume.pdf" download>Download My Resume</a>     <!-- Force download -->
\`\`\`

## 6.1 Absolute vs Relative Paths

:::insight
**The distinction that confuses every beginner**
An absolute path is the complete web address, working from anywhere (e.g. https://mysite.com/about.html). A relative path is described relative to the current file's location on disk. Always use relative paths for links within your own project -- this way your whole site keeps working if you move it, rename a parent folder, or deploy it elsewhere.
:::

![Figure 4: absolute vs relative paths, shown against a real folder structure](/HTML_images/image_6.png)

**Figure 4** — absolute vs relative paths, shown against a real folder structure

## 6.2 The target Attribute

| Value | Behavior |
|---|---|
| \`_self\` | Default -- opens in the same tab |
| \`_blank\` | Opens in a new tab/window |
| \`_parent\` | Opens in the parent frame (rarely used) |
| \`_top\` | Opens in the full body of the window, breaking out of frames |

## 6.3 Building a Navigation Menu

Combining links with a list is exactly how every website's navigation bar is built:

\`\`\`html
<nav>
  <ul>
    <li><a href="index.html">Home</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="projects.html">Projects</a></li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
</nav>
\`\`\`

:::challenge
**Practice Exercise 6.1**
1) Create three linked HTML pages (index.html, about.html, contact.html) with a shared navigation menu on each, using relative paths.
2) Add a mailto and a tel link to your contact page.
3) Add a same-page jump link that scrolls to a section further down index.html.
:::

:::mistake
**Common mistakes to avoid**
1) Using absolute paths (with the full domain) for internal links -- this breaks if you move your project or change domains.
2) Forgetting \`target="_blank"\` when linking to an external site you don't want the user to navigate away from entirely.
3) Writing vague link text like 'click here' -- screen reader users often browse a list of just the links on a page, so descriptive text matters.
:::

:::challenge
**Quick Quiz -- Section 6**
Q1) What does target="_blank" do?
Q2) Write a mailto link in your head for your own email.
Q3) Why prefer relative paths inside your own project?
:::
`,
  7: `# 7. Images

:::definition
The \`<img>\` tag embeds an image into a webpage. Unlike most tags, it is self-closing and always requires a src (source path) attribute.
:::

\`\`\`html
<img src="logo.png" alt="Company Logo" width="200" height="100" />
\`\`\`

- \`src\` = path to the image file (required, works like href -- relative or absolute)
- \`alt\` = text shown if the image fails to load, AND read aloud by screen readers -- never optional in real projects
- \`width\` / \`height\` = reserve space before the image loads, preventing the page from jumping around as it loads
- \`<img>\` is self-closing -- it never has a separate closing tag

## 7.1 Common Image Formats

| Format | Best used for |
|---|---|
| .jpg / .jpeg | Photographs, complex images with many colors (smaller file size, some quality loss) |
| .png | Logos, icons, images needing transparency (larger file size, no quality loss) |
| .svg | Icons, logos, illustrations that need to scale to any size without blurring |
| .webp | Modern format -- smaller than JPG/PNG at similar quality, widely supported today |

## 7.2 figure & figcaption

Use figure and figcaption together whenever an image needs a caption -- this pairing is semantically correct (it tells the browser 'this caption belongs to this image'):

\`\`\`html
<figure>
  <img src="chart.png" alt="Sales growth chart for 2026" />
  <figcaption>Figure: Monthly sales growth for 2026</figcaption>
</figure>
\`\`\`

## 7.3 A Realistic Gallery Example

\`\`\`html
<section class="gallery">
  <figure>
    <img src="project1.png" alt="Screenshot of the portfolio homepage" />
    <figcaption>Portfolio Website -- Homepage</figcaption>
  </figure>
  <figure>
    <img src="project2.png" alt="Screenshot of the todo app interface" />
    <figcaption>Todo App -- Task List View</figcaption>
  </figure>
</section>
\`\`\`

:::challenge
**Practice Exercise 7.1**
1) Add three images to a page, each wrapped in a figure with a figcaption.
2) Deliberately break one image's src path and observe what the alt text displays instead.
3) Research and write down, in your own words, when you'd choose PNG over JPG for a project.
:::

:::mistake
**Common mistakes to avoid**
1) Forgetting the alt attribute -- this hurts both accessibility and SEO, and is checked in real code reviews.
2) Using a huge, uncompressed image file when a smaller one would look identical -- this slows down page loading significantly.
3) Using the same id twice on one page -- IDs must always be unique; use class when you need to reuse a style.
:::

:::challenge
**Quick Quiz -- Section 7**
Q1) Why is the alt attribute important?
Q2) When would you choose SVG over JPG?
Q3) What do figure and figcaption do together?
:::
`,
  8: `# 8. Tables

:::definition
Tables display data in rows and columns -- used for pricing plans, timetables, or financial reports. Never use tables just to lay out a whole webpage -- for page layout, CSS Flexbox/Grid is used instead (covered next week).
:::

![Figure 5: the labeled anatomy of an HTML table](/HTML_images/image_7.png)

**Figure 5** — the labeled anatomy of an HTML table

## 8.1 Basic Table Structure

\`\`\`html
<table border="1">
  <caption>Student Course Fees</caption>
  <thead>
    <tr>
      <th>Name</th>
      <th>Course</th>
      <th>Fee</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Rahul</td>
      <td>MERN Stack</td>
      <td>Rs. 25,000</td>
    </tr>
    <tr>
      <td>Priya</td>
      <td>MERN Stack</td>
      <td>Rs. 25,000</td>
    </tr>
  </tbody>
</table>
\`\`\`

## 8.2 Merging Cells with rowspan and colspan

\`\`\`html
<table border="1">
  <tr>
    <th>Day</th>
    <th colspan="2">Morning Batch</th>
  </tr>
  <tr>
    <td rowspan="2">Mon-Fri</td>
    <td>9:00 AM</td>
    <td>HTML/CSS/JS</td>
  </tr>
  <tr>
    <td>11:00 AM</td>
    <td>Doubt Session</td>
  </tr>
</table>
\`\`\`

colspan merges a cell across multiple COLUMNS (horizontally). rowspan merges a cell across multiple ROWS (vertically). Draw the table on paper first if you're ever unsure which one you need.

## 8.3 Making Tables Accessible with scope

For complex tables, the scope attribute on header cells tells screen readers exactly which rows/columns a header applies to -- important once tables get more complex than a simple grid:

\`\`\`html
<table border="1">
  <tr>
    <th></th>
    <th scope="col">Q1</th>
    <th scope="col">Q2</th>
  </tr>
  <tr>
    <th scope="row">Revenue</th>
    <td>$10,000</td>
    <td>$12,000</td>
  </tr>
</table>
\`\`\`

## 8.4 Reference: Table Tags

| Tag | Meaning |
|---|---|
| \`<table>\` | The whole table |
| \`<caption>\` | A title for the table |
| \`<thead>\` / \`<tbody>\` | Groups the header row(s) / the data rows |
| \`<tr>\` | A table row |
| \`<th>\` | A header cell (bold, centered by default) |
| \`<td>\` | A normal data cell |
| \`rowspan\` | Merges a cell across multiple ROWS |
| \`colspan\` | Merges a cell across multiple COLUMNS |

:::challenge
**Practice Exercise 8.1**
1) Build a weekly class timetable as a table, using rowspan/colspan wherever the same subject spans multiple time slots.
2) Add a caption describing what your table shows.
3) Build a second table comparing 3 phone models across 4 features (price, RAM, storage, camera).
:::

:::mistake
**Common mistakes to avoid**
1) Forgetting thead/tbody -- not strictly required, but good practice for styling and accessibility.
2) Using tables for full page layouts instead of just tabular data (an outdated habit to avoid entirely).
3) Confusing rowspan (vertical merge) with colspan (horizontal merge).
:::

:::challenge
**Quick Quiz -- Section 8**
Q1) What does colspan do versus rowspan?
Q2) What is the scope attribute used for?
Q3) Should tables ever be used for page layout?
:::
`,
  9: `# 9. Forms & Every Important Input Type

:::definition
A \`<form>\` is a container for input fields that lets users submit data -- a login form, a signup form, a search bar, a checkout form. This is the very first concept that connects frontend HTML to a real backend server: later in this course, data typed into these exact input types will be sent to an Express server and saved into a database.
:::

:::insight
**Analogy**
Think of a form like a paper application at a bank. Each blank line to fill in (name, account number, signature) is one \`<input>\`. When you hand the completed form to the clerk (click Submit), the clerk (the backend server) processes it and files it away (saves it to the database).
:::

## 9.1 Basic Text Inputs

\`\`\`html
<form action="/submit" method="POST">
  <label for="name">Full Name:</label>
  <input type="text" id="name" name="name" placeholder="Enter your name" required />
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required />
  <label for="password">Password:</label>
  <input type="password" id="password" name="password" required />
  <button type="submit">Submit</button>
</form>
\`\`\`

- \`action\` = the URL the form data is sent to when submitted
- \`method\` = the HTTP method used to send the data (usually GET or POST)
- \`type="text"\` -- plain text; \`type="email"\` -- validates email format automatically; \`type="password"\` -- hides typed characters
- \`placeholder\` = grey hint text shown before typing, disappears once you type
- \`required\` = browser blocks submission if the field is left empty
- \`label + for\` = clicking the label text automatically focuses the linked input, improving usability and accessibility

## 9.2 A Visual Reference -- What Each Input Type Renders As

![Figure 6: how the most common input types actually render in a browser](/HTML_images/image_8.png)

**Figure 6** — how the most common input types actually render in a browser

## 9.3 Every Other Important Input Type -- Deep Dive

Each of the input types below solves a specific real-world data collection problem. Let's go through them individually with a dedicated example and use case each.

### Number

\`\`\`html
<label for="qty">Quantity:</label>
<input type="number" id="qty" name="qty" min="1" max="10" step="1" />
\`\`\`

Real-time use case: an e-commerce 'quantity' selector on a product page, restricted to sensible values with min/max/step.

### Date

\`\`\`html
<label for="dob">Date of Birth:</label>
<input type="date" id="dob" name="dob" min="1990-01-01" max="2015-12-31" />
\`\`\`

Real-time use case: booking systems (flight departure dates), age verification forms, event registration.

### Tel (Telephone)

\`\`\`html
<label for="phone">Phone Number:</label>
<input type="tel" id="phone" name="phone" pattern="[0-9]{10}" />
\`\`\`

Real-time use case: on mobile devices, this automatically shows a numeric keypad instead of the full keyboard, making entry much faster.

### URL

\`\`\`html
<label for="website">Portfolio URL:</label>
<input type="url" id="website" name="website" placeholder="https://..." />
\`\`\`

Real-time use case: job application forms asking for a LinkedIn or portfolio link -- the browser validates it looks like a real URL before submission.

### Range

\`\`\`html
<label for="budget">Budget: $0 - $1000</label>
<input type="range" id="budget" name="budget" min="0" max="1000" step="50" />
\`\`\`

Real-time use case: price range filters on shopping sites, volume/brightness sliders in settings panels.

### Color

\`\`\`html
<label for="theme">Pick a theme color:</label>
<input type="color" id="theme" name="theme" value="#0b3d91" />
\`\`\`

Real-time use case: design tools and admin dashboards that let users customize a brand color, opening the OS's native color picker.

### File

\`\`\`html
<label for="avatar">Profile Picture:</label>
<input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" />
\`\`\`

Real-time use case: uploading a resume PDF, a profile picture, or any document. The accept attribute restricts which file types the browser's file picker shows.

### Search

\`\`\`html
<input type="search" name="q" placeholder="Search products..." />
\`\`\`

Real-time use case: search bars on e-commerce and content sites -- functionally similar to text, but adds a native clear (x) button and different mobile keyboard layout.

:::challenge
**Practice Exercise 9.2**
Build a 'Book a Flight' form using at least 6 of the input types above: text (name), tel (phone), date (departure), number (passenger count), range (budget), and select (destination).
:::

## 9.4 Dropdowns, Checkboxes, Radio Buttons & Text Areas

\`\`\`html
<!-- Dropdown -->
<label for="country">Country:</label>
<select id="country" name="country">
  <option value="">-- Select a country --</option>
  <option value="in">India</option>
  <option value="us">USA</option>
</select>
<!-- Grouped dropdown options -->
<select>
  <optgroup label="South India">
    <option>Tamil Nadu</option>
    <option>Kerala</option>
  </optgroup>
  <optgroup label="North India">
    <option>Delhi</option>
    <option>Punjab</option>
  </optgroup>
</select>
<!-- Checkbox: multiple choices allowed -->
<input type="checkbox" id="terms" name="terms" />
<label for="terms">I agree to the terms & conditions</label>
<!-- Radio buttons: only ONE choice per group (same 'name') -->
<input type="radio" id="male" name="gender" value="male" />
<label for="male">Male</label>
<input type="radio" id="female" name="gender" value="female" />
<label for="female">Female</label>
<!-- Multi-line text -->
<label for="msg">Message:</label>
<textarea id="msg" name="msg" rows="4" cols="30"></textarea>
\`\`\`

:::note
**Checkbox vs Radio -- the difference that confuses every beginner**
Checkboxes are independent -- a user can tick as many as they like (e.g. 'select your hobbies'). Radio buttons sharing the exact same name attribute form a group where only ONE can ever be selected (e.g. 'select your gender'). Every radio button in one group must share an identical name value -- the browser uses that shared name to know they belong together.
:::

## 9.5 Grouping Fields with fieldset & legend

\`\`\`html
<fieldset>
  <legend>Personal Details</legend>
  <label for="fname">First Name:</label>
  <input type="text" id="fname" name="fname" />
  <label for="lname">Last Name:</label>
  <input type="text" id="lname" name="lname" />
</fieldset>
\`\`\`

fieldset visually and semantically groups related form fields together (browsers draw a box around it automatically), and legend gives that group a title. Common in longer forms like checkout pages (Shipping Details, Payment Details as separate fieldsets).

## 9.6 Form Validation Attributes

| Attribute | Effect |
|---|---|
| \`required\` | Field must be filled before the form can submit |
| \`minlength\` / \`maxlength\` | Min/max number of characters allowed |
| \`min\` / \`max\` | Min/max numeric value allowed (number/date/range) |
| \`pattern\` | A regular expression the value must match |
| \`disabled\` | Field cannot be interacted with, and is NOT submitted |
| \`readonly\` | Field cannot be edited, but IS submitted with its value |
| \`autofocus\` | Automatically focuses this field when the page loads |
| \`autocomplete\` | Controls whether the browser suggests previously entered values |

\`\`\`html
<input type="text" pattern="[A-Za-z]{3,}" title="At least 3 letters, no numbers" required />
<input type="text" autofocus autocomplete="off" />
\`\`\`

## 9.7 A Complete Realistic Registration Form

Here is everything from this section combined into one realistic example:

\`\`\`html
<form action="/register" method="POST">
  <fieldset>
    <legend>Account Details</legend>
    <label for="uname">Username:</label>
    <input type="text" id="uname" name="uname" minlength="4" required />
    <label for="uemail">Email:</label>
    <input type="email" id="uemail" name="uemail" required />
    <label for="upass">Password:</label>
    <input type="password" id="upass" name="upass" minlength="8" required />
  </fieldset>
  <fieldset>
    <legend>Personal Details</legend>
    <label for="dob">Date of Birth:</label>
    <input type="date" id="dob" name="dob" />
    <label for="gender">Gender:</label>
    <input type="radio" id="male" name="gender" value="male" />
    <label for="male">Male</label>
    <input type="radio" id="female" name="gender" value="female" />
    <label for="female">Female</label>
  </fieldset>
  <input type="checkbox" id="terms" name="terms" required />
  <label for="terms">I agree to the terms and conditions</label>
  <button type="submit">Create Account</button>
</form>
\`\`\`

:::challenge
**Practice Exercise 9.1**
1) Build the complete registration form above from scratch, typing every line yourself.
2) Add a country dropdown and a 'bio' textarea to it.
3) Add a file input for 'profile picture' and a range input for 'experience level (1-10)'.
4) Add appropriate validation attributes (required, minlength, pattern) to at least 3 fields.
:::

:::scenario
**Real-time use case**
Every login page you've used (Gmail, Instagram, Amazon) is fundamentally a form with email/password inputs. Every signup form that blocks submission with a short password is using these exact built-in validation attributes -- before any JavaScript even runs.
:::

:::challenge
**Quick Quiz -- Section 9**
Q1) What must be true for a group of radio buttons to work correctly as 'only one selectable'?
Q2) What's the difference between disabled and readonly?
Q3) What does fieldset + legend do together?
Q4) Name three form validation attributes and what each does.
:::
`,
  10: `# 10. Semantic HTML5 Elements

:::definition
A semantic tag clearly describes its own meaning to both the browser and any developer reading the code -- e.g. \`<nav>\` obviously means navigation, unlike a generic \`<div>\` which could mean anything. Semantic HTML improves SEO (search engines understand your page better), accessibility (screen readers navigate it correctly), and code readability.
:::

![Figure 7: a typical real-world webpage built entirely from semantic HTML5 tags](/HTML_images/image_9.png)

**Figure 7** — a typical real-world webpage built entirely from semantic HTML5 tags

## 10.1 The Core Semantic Tags

| Tag | Meaning / Real Use |
|---|---|
| \`<header>\` | Top section of a page or section -- logo, site title, intro |
| \`<nav>\` | Group of navigation links (menu bar) |
| \`<main>\` | The primary, unique content of the page (only one per page) |
| \`<section>\` | A thematic grouping of content, usually with its own heading |
| \`<article>\` | Self-contained content, e.g. a blog post or news story |
| \`<aside>\` | Content indirectly related to main content -- sidebars, ads |
| \`<footer>\` | Bottom section -- copyright, contact info, site links |

## 10.2 More Semantic Elements Worth Knowing

| Tag | Meaning |
|---|---|
| \`<figure>\` / \`<figcaption>\` | An image (or diagram/chart) plus its caption, semantically linked |
| \`<time>\` | A specific date or time, machine-readable via the datetime attribute |
| \`<mark>\` | Highlighted/marked text, relevant to the current context |
| \`<details>\` / \`<summary>\` | A native collapsible/expandable content widget, no JavaScript needed |
| \`<address>\` | Contact information for the author/owner of a page or article |

\`\`\`html
<p>Published on <time datetime="2026-08-27">August 27, 2026</time></p>
<details>
  <summary>Click to see the answer</summary>
  <p>The answer is 42.</p>
</details>
<address>
  Written by Rahul Kumar. Contact:
  <a href="mailto:rahul@example.com">rahul@example.com</a>
</address>
\`\`\`

The details/summary pair is genuinely useful: it creates a native expand/collapse widget (like an FAQ accordion) with zero JavaScript -- click the summary text and the details expand or collapse automatically.

## 10.3 A Complete Semantic Page Skeleton

\`\`\`html
<body>
  <header>
    <h1>My Blog</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/archive">Archive</a>
    </nav>
  </header>
  <main>
    <article>
      <h2>My First Post</h2>
      <p>Published <time datetime="2026-08-27">Aug 27, 2026</time></p>
      <p>Article content goes here...</p>
    </article>
    <aside>
      <h3>Related Posts</h3>
      <ul><li><a href="#">Another post</a></li></ul>
    </aside>
  </main>
  <footer>
    <p>&copy; 2026 My Blog</p>
  </footer>
</body>
\`\`\`

:::scenario
**Real-time use case**
On any news website: the top banner is header, the menu is nav, each news story is an article inside main, the 'trending now' box is aside, and the bottom links live inside footer. A publish date almost always uses <time> so browsers and search engines can read it precisely.
:::

:::challenge
**Practice Exercise 10.1**
1) Rebuild one of your earlier practice pages using fully semantic structure: header, nav, main, section/article, aside, footer.
2) Add a details/summary FAQ block with at least 2 questions.
3) Add a <time> tag with a real datetime attribute somewhere on the page.
:::

:::mistake
**Common mistakes to avoid**
1) Using <div> for absolutely everything ('div soup') instead of meaningful semantic tags when one clearly applies.
2) Using more than one <main> tag on a page -- there should only ever be one.
:::

:::challenge
**Quick Quiz -- Section 10**
Q1) How many <main> tags should one page have?
Q2) What does details/summary let you build with no JavaScript?
Q3) Give a real-world example of when you would use <article>.
:::
`,
  11: `# 11. Non-Semantic Elements & Block vs Inline

## 11.1 div and span -- Non-Semantic Elements

:::definition
<div> and <span> carry no semantic meaning at all -- they are generic containers used purely for grouping content to apply CSS styling or JavaScript behavior, when no semantic tag accurately describes the content. <div> is block-level (e.g. a wrapper to center a page's content); <span> is inline (e.g. wrapping one word to color it differently).
:::

\`\`\`html
<div class="card">
  <span class="badge">New</span>
  <h3>Product Name</h3>
  <p>Product description text with a <span class="price">$49</span> price.</p>
</div>
\`\`\`

:::tip
**The rule to follow**
Always reach for a semantic tag FIRST if one accurately describes the content (nav, article, footer...). Only fall back to div/span when genuinely no semantic tag fits -- this is not 'never use div', it's 'don't use div for everything'.
:::

![Figure 8b: the same layout built with generic divs versus semantic tags -- identical appearance, very different code quality](/HTML_images/image_10.png)

**Figure 8b** — the same layout built with generic divs versus semantic tags -- identical appearance, very different code quality

## 11.2 Block vs Inline Elements

:::definition
Every HTML element behaves as either block or inline by default. A block element always starts on a new line and stretches to fill the full available width (div, p, h1-h6, ul, li, section, form). An inline element only takes up as much width as its content needs, sitting side-by-side within a line of text (span, a, b, strong, img).
:::

![Figure 8: block elements stack vertically; inline elements flow horizontally within text](/HTML_images/image_11.png)

**Figure 8** — block elements stack vertically; inline elements flow horizontally within text

## 11.3 Reference Table -- Common Elements by Type

| Block Elements | Inline Elements |
|---|---|
| div, p, h1-h6 | span, a, b, strong |
| ul, ol, li | i, em, small |
| section, article, header, footer | img, input, label |
| form, table | button (inline-block behavior) |

:::scenario
**Real-time use case**
This is exactly why a navigation menu (Home, About, Contact) uses inline <a> tags sitting side-by-side, while each section of a page (Header, Main, Footer) uses block elements stacked one below another. Understanding this now will make CSS layout (Flexbox/Grid, next week) far more intuitive.
:::

:::challenge
**Practice Exercise 11.1**
1) Identify (without looking anything up) whether each of these is block or inline: h2, span, li, strong, section, a, form.
2) Build a product card using a div wrapper, a span for a 'Sale' badge, and semantic tags for the rest.
:::

:::challenge
**Quick Quiz -- Section 11**
Q1) When is it acceptable to use a div instead of a semantic tag?
Q2) Is <li> block or inline by default?
Q3) Name two inline elements and two block elements.
:::
`,
  12: `# 12. Audio, Video & iframe

## 12.1 Video

\`\`\`html
<video width="400" controls autoplay muted loop>
  <source src="demo.mp4" type="video/mp4" />
  <source src="demo.webm" type="video/webm" />
  Your browser does not support the video tag.
</video>
\`\`\`

| Attribute | Effect |
|---|---|
| \`controls\` | Shows the play/pause/volume UI |
| \`autoplay\` | Starts playing automatically (browsers usually require muted alongside this) |
| \`loop\` | Restarts automatically when finished |
| \`muted\` | Starts with sound off |
| \`poster\` | An image shown before the video starts playing |

## 12.2 Audio

\`\`\`html
<audio controls>
  <source src="song.mp3" type="audio/mpeg" />
  <source src="song.ogg" type="audio/ogg" />
</audio>
\`\`\`

Multiple source tags let the browser pick whichever format it actually supports -- a fallback strategy identical to the one used for video.

## 12.3 The picture Element -- Responsive Images

Just like video uses multiple source tags for format fallbacks, picture lets you serve different images depending on screen size -- e.g. a smaller image for mobile to save data:

\`\`\`html
<picture>
  <source media="(min-width: 800px)" srcset="banner-large.jpg" />
  <source media="(min-width: 400px)" srcset="banner-medium.jpg" />
  <img src="banner-small.jpg" alt="Bakery storefront" />
</picture>
\`\`\`

The browser picks the first matching source based on screen width; the plain img tag at the end is always the fallback if no source matches or the browser doesn't support picture.

## 12.4 iframe -- Embedding Other Webpages

\`\`\`html
<iframe
  src="https://www.youtube.com/embed/VIDEO_ID"
  width="400" height="225"
  sandbox="allow-scripts allow-same-origin">
</iframe>
\`\`\`

An iframe embeds an entirely separate webpage inside yours -- commonly used for YouTube videos, Google Maps, and payment widgets. The sandbox attribute restricts what the embedded page is allowed to do, for security -- important whenever embedding content from other websites you don't control.

:::challenge
**Practice Exercise 12.1**
1) Embed any local video file with controls and two source fallback formats.
2) Embed a YouTube video using an iframe.
3) Add a poster image to your video that shows before playback starts.
:::
`,
  13: `# 13. Meta Tags & the <head> Section

\`\`\`html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Learn MERN Stack from scratch" />
  <meta name="robots" content="index, follow" />
  <!-- Open Graph tags: control how the page looks when shared on social apps -->
  <meta property="og:title" content="MERN Stack Course" />
  <meta property="og:description" content="A complete training program" />
  <meta property="og:image" content="preview.jpg" />
  <title>My Website</title>
  <link rel="icon" href="favicon.ico" />
  <link rel="stylesheet" href="style.css" />
</head>
\`\`\`

| Tag / Attribute | Purpose |
|---|---|
| \`charset="UTF-8"\` | Ensures special characters/symbols display correctly |
| \`viewport\` | Makes the page render correctly and responsively on mobile devices |
| \`description\` | The snippet Google shows under your page title in search results |
| \`robots\` | Tells search engines whether to index this page and follow its links |
| Open Graph tags (\`og:*\`) | Control the preview card shown when your link is shared on social apps |
| \`<title>\` | Text shown on the browser tab |
| favicon (\`link rel="icon"\`) | The small icon shown in the browser tab |

:::scenario
**Real-time use case**
When you share a link in WhatsApp and see a nice preview card with an image, title, and description, that's Open Graph meta tags at work. The description meta tag is often the deciding factor in whether someone clicks your link in Google search results.
:::

:::mistake
**Common mistake to avoid**
Forgetting the viewport meta tag makes your page look broken/zoomed-in on mobile devices -- always include it in every project from day one.
:::

:::challenge
**Practice Exercise 13.1**
1) Build a complete, professional head section for a portfolio site: charset, viewport, description, title, favicon, and at least 2 Open Graph tags.
:::

:::challenge
**Quick Quiz -- Sections 12-13**
Q1) Why do video/audio tags use multiple source children?
Q2) What does the sandbox attribute on an iframe do?
Q3) What are Open Graph tags used for?
:::
`,
  14: `# 14. Accessibility Basics (a11y)

:::definition
Accessibility means making your website usable by everyone, including people using screen readers, keyboard-only navigation, or other assistive devices. This is a real, expected professional skill, not optional polish -- many companies are legally required to meet accessibility standards.
:::

## 14.1 Keyboard Navigation & Tab Order

Many users navigate entirely with a keyboard (Tab to move forward, Shift+Tab to move back, Enter/Space to activate). HTML elements are focusable in the order they appear in your code -- so a logical, top-to-bottom source order matters:

![Figure 9: keyboard tab order flowing naturally through a form](/HTML_images/image_12.png)

**Figure 9** — keyboard tab order flowing naturally through a form

## 14.2 Core Accessibility Practices

- Always add meaningful alt text to images -- describe what the image shows, not just 'image1.jpg'
- Always pair form inputs with a proper \`<label for="...">\`
- Use heading tags (h1-h6) in logical order, not skipped for visual style
- Ensure link text describes its destination (avoid vague text like 'click here')
- Make sure all interactive elements can be reached and used with the Tab key alone
- Keep good color contrast between text and background (applied properly once we reach CSS colors)

## 14.3 A Quick Before/After Example

\`\`\`html
<!-- POOR accessibility -->
<div onclick="submit()">Submit</div>
<img src="chart.png" />
<input type="text" />
<!-- GOOD accessibility -->
<button type="submit">Submit</button>
<img src="chart.png" alt="Quarterly revenue growth chart" />
<label for="search">Search:</label>
<input type="text" id="search" />
\`\`\`

The 'poor' version uses a div pretending to be a button (not keyboard-focusable by default, not announced correctly by screen readers), an image with no alt text, and an input with no label. The 'good' version uses the correct native elements for each job -- always prefer a real button over a div styled to look like one.

:::scenario
**Real-time use case**
A visually impaired user browsing an e-commerce site with a screen reader relies entirely on meaningful alt text to know what a product image shows, and on properly labelled forms to complete a purchase independently.
:::

## 14.4 A Gentle Introduction to ARIA

Sometimes native HTML alone can't fully describe a complex custom widget's state. ARIA (Accessible Rich Internet Applications) attributes let you add extra accessibility information. The golden rule: 'No ARIA is better than bad ARIA' -- always prefer a native HTML element first, and only reach for ARIA when there's genuinely no native equivalent.

\`\`\`html
<!-- aria-label: provides an accessible name when there's no visible text -->
<button aria-label="Close menu">X</button>
<!-- aria-hidden: hides purely decorative content from screen readers -->
<span aria-hidden="true">★</span>
<!-- aria-live: announces dynamically updated content, e.g. a live error message -->
<div aria-live="polite" id="error-message"></div>
\`\`\`

:::tip
**Rule of thumb**
If a native tag already does the job (e.g. <button> is already keyboard-accessible and announced correctly), you do NOT need ARIA on it. ARIA is a repair tool for cases native HTML can't cover -- not a replacement for using the correct native elements in the first place.
:::

:::challenge
**Practice Exercise 14.1**
1) Audit one of your earlier practice pages: check every image has alt text, every input has a label, and headings are in logical order.
2) Try navigating your page using ONLY the Tab key and Enter -- can you reach and use every interactive element?
:::

:::challenge
**Quick Quiz -- Section 14**
Q1) Why does tab order matter for accessibility?
Q2) Why prefer a real <button> over a styled <div>?
Q3) Name three core accessibility practices from this section.
:::
`,
  15: `# 15. Building a Multi-Page Website Step by Step

Everything so far has been individual concepts. Now let's combine them into a real, connected 3-page website -- a small business site for a fictional bakery -- built one file at a time, exactly the way you'd approach a real project.

## 15.1 Step 1: Plan the Folder Structure

\`\`\`html
sunrise-bakery/
  index.html
  menu.html
  contact.html
  images/
    logo.png
    bread.jpg
\`\`\`

Planning the folder structure before writing any code avoids broken links later -- decide your pages and asset folders first, exactly like sketching a building's blueprint before construction.

## 15.2 Step 2: Build a Shared Header & Navigation

Since all three pages share the same header and navigation, let's design it once and reuse the same structure across every page (in Month 2 with React, this repetition disappears entirely through reusable components -- but for now, in plain HTML, we repeat it consistently):

\`\`\`html
<header>
  <img src="images/logo.png" alt="Sunrise Bakery logo" width="60" />
  <h1>Sunrise Bakery</h1>
</header>
<nav>
  <a href="index.html">Home</a>
  <a href="menu.html">Menu</a>
  <a href="contact.html">Contact</a>
</nav>
\`\`\`

## 15.3 Step 3: index.html (Home Page)

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sunrise Bakery - Home</title>
</head>
<body>
  <header>
    <img src="images/logo.png" alt="Sunrise Bakery logo" width="60" />
    <h1>Sunrise Bakery</h1>
  </header>
  <nav>
    <a href="index.html">Home</a>
    <a href="menu.html">Menu</a>
    <a href="contact.html">Contact</a>
  </nav>
  <main>
    <section>
      <h2>Welcome!</h2>
      <p>Freshly baked bread and pastries, every single morning.</p>
      <figure>
        <img src="images/bread.jpg" alt="Freshly baked sourdough loaves"
             width="400" />
        <figcaption>Our signature sourdough, baked daily</figcaption>
      </figure>
    </section>
  </main>
  <footer>
    <p>&copy; 2026 Sunrise Bakery</p>
  </footer>
</body>
</html>
\`\`\`

## 15.4 Step 4: menu.html (Using a Table)

\`\`\`html
<!-- Same header/nav as index.html, then: -->
<main>
  <h2>Our Menu</h2>
  <table border="1">
    <thead>
      <tr><th>Item</th><th>Price</th></tr>
    </thead>
    <tbody>
      <tr><td>Sourdough Loaf</td><td>$6</td></tr>
      <tr><td>Croissant</td><td>$3</td></tr>
      <tr><td>Chocolate Muffin</td><td>$4</td></tr>
    </tbody>
  </table>
</main>
\`\`\`

## 15.5 Step 5: contact.html (Using a Form)

\`\`\`html
<!-- Same header/nav as index.html, then: -->
<main>
  <h2>Contact Us</h2>
  <form>
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required />
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required />
    <label for="message">Message:</label>
    <textarea id="message" name="message" rows="4"></textarea>
    <button type="submit">Send</button>
  </form>
</main>
\`\`\`

:::challenge
**Practice Project 15.1**
1) Build all three files of this bakery site yourself, with a consistent header/nav copied onto each page and working relative links between them.
2) Add a footer with your own copyright text to all three pages.
3) Extend it with a fourth page, 'gallery.html', showing 3 images in a figure/figcaption gallery, linked from the nav on every page.
4) This is exactly the kind of small multi-page site you'll be asked to build in real internship or entry-level tasks -- treat it as a genuine mini-project, not just an exercise.
:::

## 15.6 Bonus Mini-Project: An FAQ Accordion Page

The details/summary elements from Section 10.2 let us build a fully working FAQ page with zero JavaScript. This is a genuinely common real-world request:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FAQ - Sunrise Bakery</title>
</head>
<body>
  <header><h1>Frequently Asked Questions</h1></header>
  <main>
    <details>
      <summary>Do you deliver?</summary>
      <p>Yes, we deliver within a 5km radius, Tuesday to Sunday.</p>
    </details>
    <details>
      <summary>Are your products vegan?</summary>
      <p>We offer a small vegan menu -- ask in-store or check the Menu page.</p>
    </details>
    <details>
      <summary>Do you take custom orders for events?</summary>
      <p>Yes! Contact us at least 3 days in advance via the Contact page.</p>
    </details>
  </main>
  <footer><p>&copy; 2026 Sunrise Bakery</p></footer>
</body>
</html>
\`\`\`

## 15.7 Bonus Mini-Project: A Pricing Comparison Table

Combining tables, semantic sections, and text formatting into a real pricing page layout:

\`\`\`html
<section>
  <h2>Membership Plans</h2>
  <table border="1">
    <thead>
      <tr>
        <th>Feature</th>
        <th>Basic</th>
        <th>Premium</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Monthly Price</td>
        <td>$9</td>
        <td><strong>$19</strong></td>
      </tr>
      <tr>
        <td>Free Delivery</td>
        <td>&#10007;</td>
        <td>&#10003;</td>
      </tr>
      <tr>
        <td>Priority Support</td>
        <td>&#10007;</td>
        <td>&#10003;</td>
      </tr>
    </tbody>
  </table>
</section>
\`\`\`

Notice the checkmark/cross entities (&#10003; and &#10007;) -- a simple, dependency-free way to show yes/no visually in a table without any images or icons.

## 15.8 Bonus Mini-Project: A Blog Post Page

Combining article, time, headings, and blockquote for a realistic content page:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>5 Baking Tips - Sunrise Bakery Blog</title>
</head>
<body>
  <header><h1>Sunrise Bakery Blog</h1></header>
  <main>
    <article>
      <h2>5 Tips for Baking Bread at Home</h2>
      <p>Published on <time datetime="2026-08-20">August 20, 2026</time> by Chef Maria</p>
      <p>Baking great bread starts with quality ingredients and patience.
      Here are our top five tips:</p>
      <ol>
        <li>Use fresh yeast, not expired packets</li>
        <li>Let the dough rest for at least an hour</li>
        <li>Preheat your oven properly before baking</li>
        <li>Score the top of the loaf before it goes in</li>
        <li>Let it cool completely before slicing</li>
      </ol>
      <blockquote>
        "The best bread takes time -- don't rush the rise."
        <cite>-- Chef Maria</cite>
      </blockquote>
    </article>
  </main>
  <footer><p>&copy; 2026 Sunrise Bakery</p></footer>
</body>
</html>
\`\`\`

## 15.9 Bonus Mini-Project: A Product Detail Page

A single product page combining images, semantic structure, and a purchase form:

\`\`\`html
<main>
  <article>
    <figure>
      <img src="images/bread.jpg" alt="Artisan sourdough loaf" width="350" />
      <figcaption>Artisan Sourdough Loaf</figcaption>
    </figure>
    <section>
      <h2>Artisan Sourdough Loaf</h2>
      <p><strong>$6.00</strong> <small>(serves 4-6 people)</small></p>
      <p>Naturally leavened, baked fresh every morning using a
      100-year-old starter.</p>
      <form>
        <label for="qty">Quantity:</label>
        <input type="number" id="qty" name="qty" min="1" max="10" value="1" />
        <button type="submit">Add to Cart</button>
      </form>
    </section>
  </article>
</main>
\`\`\`

:::challenge
**Practice Project 15.2**
Build both the blog post page and the product detail page above from scratch. Then pick ONE more page type of your own choosing (a recipe page, an event announcement, a team member bio page) and build it entirely from memory, combining at least 8 different concepts from this document.
:::
`,
  16: `# 16. Frequently Asked Interview Questions

These are genuine questions freshers are commonly asked about HTML in technical interviews. Practice explaining each answer out loud, in your own words -- not just reading it silently.

Q1. What is HTML and is it a programming language?

HTML (HyperText Markup Language) structures web content. It is NOT a programming language -- it has no logic, loops, or calculations; it's a markup language describing structure and meaning.

Q2. What is the difference between HTML and HTML5?

HTML5 is the latest version, adding semantic tags (header, nav, article...), native audio/video support, new form input types, and removing the need for plugins like Flash.

Q3. What is semantic HTML and why does it matter?

Tags that describe their own meaning (nav, article, footer) rather than generic containers (div). It improves SEO, accessibility, and code readability for other developers.

Q4. What's the difference between id and class?

id must be unique -- only one element on the page should use it. class can be reused across many elements. Both are used heavily for CSS styling and JavaScript targeting.

Q5. What are void/self-closing elements? Give examples.

Elements with no content and no closing tag: img, br, hr, input, meta.

Q6. Why is the alt attribute important on images?

It displays if the image fails to load, and is read aloud by screen readers -- critical for accessibility and SEO.

Q7. What's the difference between <strong>/<em> and <b>/<i>?

strong/em carry semantic meaning (important for screen readers/SEO) in addition to their default bold/italic look; b/i are purely visual with no extra meaning.

Q8. What is the DOM?

The Document Object Model -- the browser's live, in-memory tree representation of an HTML page, built after parsing, which JavaScript can later read and modify.

Q9. What's the difference between block and inline elements?

Block elements start on a new line and fill the available width (div, p, h1). Inline elements only take up as much width as needed and sit within a line of text (span, a, strong).

Q10. How do you make a website accessible?

Meaningful alt text, labels linked to inputs, logical heading order, descriptive link text, and ensuring the whole page is usable with a keyboard alone.

Q11. What is the difference between GET and POST methods on a form?

GET appends form data to the URL (visible, used for non-sensitive data like search queries); POST sends data in the request body (used for sensitive or larger data like passwords).

Q12. What is the purpose of the <!DOCTYPE html> declaration?

It tells the browser to render the page using modern HTML5 standards rather than an older or inconsistent rendering mode.

Q13. Can you nest a <div> inside a <p>? Why or why not?

No -- <p> is only meant to contain inline/text-level content; nesting a block-level element like div inside it is invalid HTML and browsers will silently 'fix' it in unpredictable ways.

Q14. What is the difference between an attribute and a property in HTML?

An attribute is what's written in the HTML source (e.g. value="5"); a property is the current, possibly changed, in-memory value the DOM holds (relevant once JavaScript starts modifying pages).

Q15. Why should you avoid inline styles and prefer external CSS?

Inline styles mix structure and presentation, are hard to maintain and override, and can't be reused across elements or pages -- external CSS keeps concerns cleanly separated.

Q16. What is the difference between HTML and XML?

HTML is designed specifically for displaying web content with predefined tags and some tolerance for errors; XML is a general-purpose markup language for storing/transporting data, with strict, self-defined tags.

Q17. What is the purpose of the <label> element, and what happens without it?

It links descriptive text to a form input, letting users click the text to focus the input, and lets screen readers announce what the field is for. Without it, the form is technically usable but far less accessible.

Q18. What's the difference between HTML validation and browser rendering?

A browser will try to render even invalid or broken HTML by guessing and auto-correcting; validation (e.g. via the W3C validator) strictly checks your code against the official spec and flags every deviation, even ones the browser silently tolerates.

Q19. Why is it bad practice to skip heading levels (e.g. h1 straight to h4)?

Screen reader users often navigate by jumping between headings; skipped levels break the logical outline of the page and make navigation confusing.

Q20. What does the required attribute do, and is it enough validation on its own?

It blocks form submission if the field is empty. It's a good first layer, but real applications also need server-side validation, since client-side checks can be bypassed.

Q21. What is the difference between <script> and <script defer>?

A plain <script> blocks HTML parsing until it downloads and runs; defer lets the HTML keep parsing and runs the script only after the full document is parsed, avoiding broken references to elements not yet loaded.

Q22. Explain the difference between <section> and <div>.

<section> is semantic -- it represents a distinct, thematically grouped part of the content, ideally with its own heading. <div> is a generic container with no inherent meaning, used purely for styling/scripting hooks.
`,
  17: `# 17. Glossary of Key Terms

A fast, alphabetical lookup of every important term used throughout this document.

Accessibility (a11y) -- Making a website usable by everyone, including people using screen readers or keyboard-only navigation.

Attribute -- Extra information added inside an opening tag, written as name="value".

Block element -- An element that starts on a new line and stretches to fill the available width.

Client -- The browser or device making a request to a server.

DOM (Document Object Model) -- The browser's live, in-memory tree representation of an HTML page.

Element -- An opening tag, its content, and its closing tag, together.

Entity -- A special code (like &amp;lt;) used to display reserved characters as visible text.

Favicon -- The small icon shown in a browser tab, set via a link tag in the head.

Global attribute -- An attribute usable on almost any HTML element, such as id, class, or style.

HTML entity -- See Entity.

HTTP -- The protocol (set of rules) browsers and servers use to communicate.

Inline element -- An element that only takes up as much width as its content needs, flowing within a line of text.

Meta tag -- A tag inside head providing metadata about the page, invisible on the page itself.

Nesting -- Placing one element inside another, forming a parent-child relationship.

Open Graph tags -- Meta tags controlling how a link's preview card appears when shared on social apps.

Relative path -- A file path described relative to the current file's location, e.g. about.html.

Absolute path -- A complete web address that works from anywhere, e.g. https://mysite.com/about.html.

Semantic tag -- A tag that describes its own meaning, such as nav, article, or footer.

Server -- A remote computer that listens for requests and sends back responses.

SEO (Search Engine Optimization) -- Practices that help search engines understand and rank a webpage.

Tag -- A keyword wrapped in angle brackets, e.g. <p> or </p>.

Tab order -- The sequence in which interactive elements receive keyboard focus when pressing Tab.

URL -- A web address, made of a protocol, domain, path, and optional query/fragment.

Viewport -- The visible area of a webpage on a device's screen, controlled via a meta tag for responsiveness.

Void element -- An element with no content and no closing tag, such as img or br.

ARIA -- Accessible Rich Internet Applications -- attributes that add extra accessibility info for complex widgets.

Boilerplate -- The standard, repeated starting structure of an HTML file (DOCTYPE, html, head, body).

CSSOM -- CSS Object Model -- the browser's in-memory tree representation of parsed CSS rules.

Fieldset -- A tag that visually and semantically groups related form fields together.

Fragment (URL) -- The part of a URL after a #, used to jump to a specific section of a page.

Markup language -- A language that describes the structure and meaning of content, not logic or behavior.

Metadata -- Data about data -- e.g. a page's title, description, or character encoding, held in the head.

Query string -- The part of a URL after a ?, sending extra parameters to a server.

Render tree -- The browser's combined DOM + CSSOM tree, used to calculate layout and paint the page.

Responsive design -- Designing a page to adapt its layout to different screen sizes (fully covered next week with CSS).

Self-closing tag -- See Void element.

Validator -- A tool (e.g. the W3C Markup Validator) that checks HTML against the official standard.
`,
  18: `# 18. Do's and Don'ts + Debugging Checklist

## 18.1 Master Do's and Don'ts

| Do | Don't |
|---|---|
| Use semantic tags (nav, article) where they fit | Use <div> for absolutely everything |
| Always add meaningful alt text to images | Leave alt empty or skip it entirely |
| Use one <h1> and one <main> per page | Use multiple <h1> or <main> tags |
| Use relative paths within your own project | Hardcode absolute paths for internal links |
| Pair every input with a <label for="..."> | Rely on placeholder text alone as a label |
| Close every tag that requires closing | Leave tags unclosed 'because it still displays' |
| Validate your HTML occasionally | Assume it's correct just because it looks right |
| Keep indentation and nesting consistent | Mix tabs/spaces or nest tags haphazardly |

## 18.2 Debugging & Validating Your HTML

- Use Chrome DevTools (F12) -- the Elements tab shows exactly how the browser interpreted your HTML, which can reveal auto-corrected mistakes
- View Page Source (right-click -> View Page Source) shows your raw HTML file exactly as written
- The W3C Markup Validator (validator.w3.org) checks your HTML against the official standard and lists every error with line numbers
- Look for red squiggly lines in VS Code -- many extensions flag unclosed tags and typos as you type
- Isolate the problem -- if a page looks broken, comment out large chunks and re-enable them one at a time to find the exact line causing the issue

## 18.3 The Most Common Beginner Errors, Ranked

1. Forgetting to close a tag, silently breaking everything that follows it
2. Using the same id on multiple elements
3. Forgetting the alt attribute on images
4. Missing the viewport meta tag, breaking mobile responsiveness
5. Incorrect nesting (e.g. block elements inside a <p>)
6. Typos in attribute names (hraf instead of href) -- the browser silently ignores unknown attributes rather than erroring

## 18.4 A Before/After Mistakes Gallery

Seeing a mistake fixed side by side often teaches faster than a rule alone. Here are eight real beginner mistakes, and the corrected version of each.

### Missing alt text

Before (incorrect):

\`\`\`html
<img src="cat.jpg" />
\`\`\`

After (correct):

\`\`\`html
<img src="cat.jpg" alt="A sleeping orange cat" />
\`\`\`

### Unclosed tag

Before (incorrect):

\`\`\`html
<p>Hello world<p>Next paragraph</p>
\`\`\`

After (correct):

\`\`\`html
<p>Hello world</p>
<p>Next paragraph</p>
\`\`\`

### Duplicate id

Before (incorrect):

\`\`\`html
<div id="box">A</div>
<div id="box">B</div>
\`\`\`

After (correct):

\`\`\`html
<div class="box">A</div>
<div class="box">B</div>
\`\`\`

### Label not linked

Before (incorrect):

\`\`\`html
<label>Name</label>
<input type="text" />
\`\`\`

After (correct):

\`\`\`html
<label for="name">Name</label>
<input type="text" id="name" />
\`\`\`

### Div soup

Before (incorrect):

\`\`\`html
<div class="nav">...</div>
\`\`\`

After (correct):

\`\`\`html
<nav>...</nav>
\`\`\`

### Wrong radio grouping

Before (incorrect):

\`\`\`html
<input type="radio" name="q1" />
<input type="radio" name="q2" />
\`\`\`

After (correct):

\`\`\`html
<input type="radio" name="gender" />
<input type="radio" name="gender" />
\`\`\`

### Table used for layout

Before (incorrect):

\`\`\`html
<table><tr><td>Sidebar</td><td>Content</td></tr></table>
\`\`\`

After (correct):

\`\`\`html
<div class="layout">
  <aside>Sidebar</aside>
  <main>Content</main>
</div>
\`\`\`

### Missing viewport meta tag

Before (incorrect):

\`\`\`html
<head>
  <title>My Site</title>
</head>
\`\`\`

After (correct):

\`\`\`html
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Site</title>
</head>
\`\`\`
`,
  19: `# 19. Real-World HTML Patterns Explained

Let's analyze the HTML structure behind three extremely common real-world UI patterns you'll recognize immediately -- understanding these patterns bridges the gap between 'knowing individual tags' and 'building things that look like real products'.

## 19.1 Pattern: A Login Form

\`\`\`html
<section class="login-box">
  <h2>Sign In</h2>
  <form action="/login" method="POST">
    <label for="login-email">Email</label>
    <input type="email" id="login-email" name="email" required autofocus />
    <label for="login-pass">Password</label>
    <input type="password" id="login-pass" name="password" required />
    <label>
      <input type="checkbox" name="remember" /> Remember me
    </label>
    <button type="submit">Sign In</button>
  </form>
  <a href="/forgot-password">Forgot your password?</a>
</section>
\`\`\`

Notice the label wrapping the checkbox directly (an alternative to for/id linking) -- both patterns are valid, and wrapping is often used for short inline options like 'Remember me'.

## 19.2 Pattern: A Product/Content Card

\`\`\`html
<article class="card">
  <img src="product.jpg" alt="Wireless headphones" />
  <div class="card-body">
    <h3>Wireless Headphones</h3>
    <p>Noise-cancelling, 30-hour battery life.</p>
    <p><strong>$79.99</strong></p>
    <button>Add to Cart</button>
  </div>
</article>
\`\`\`

This is the exact structure behind nearly every product grid on every e-commerce site -- an article (self-contained content) with an image, a heading, descriptive text, and an action button. Once we reach React in Month 2, this becomes a single reusable Card component rendered many times over real data.

## 19.3 Pattern: Breadcrumb Navigation

\`\`\`html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/courses">Courses</a></li>
    <li>MERN Stack</li>
  </ol>
</nav>
\`\`\`

Breadcrumbs use an ordered list (the sequence of pages genuinely matters) inside a nav, with the current page left as plain text (not a link, since you're already there). The aria-label helps screen readers distinguish this nav from the site's main navigation.

:::challenge
**Practice Exercise 19.1**
1) Build all three patterns above yourself, then style-agnostically combine them into one page: a login form, a grid of 3 product cards, and breadcrumb navigation above the cards.
2) Identify one more UI pattern you use daily (e.g. a comment section, a star rating, a notification badge) and sketch out what HTML structure you think it would use.
:::
`,
  20: `# 20. Complete Practice Example -- Everything Combined

This single example uses almost every concept from this document together: semantic layout, headings, text formatting, lists, links, images, a form, and proper accessibility. Type this out yourself, then try modifying it -- change the content, add your own sections, break it on purpose and see what happens.

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="My personal resume page" />
  <title>Your Name - Resume</title>
</head>
<body>
  <header>
    <h1>Your Name</h1>
    <p>Aspiring MERN Stack Developer</p>
  </header>
  <nav>
    <a href="#about">About</a>
    <a href="#skills">Skills</a>
    <a href="#projects">Projects</a>
    <a href="#contact">Contact</a>
  </nav>
  <main>
    <section id="about">
      <h2>About Me</h2>
      <p>Write 2-3 lines about yourself here.</p>
    </section>
    <section id="skills">
      <h2>Skills</h2>
      <ul>
        <li>Frontend
          <ul><li>HTML5</li><li>CSS3</li></ul>
        </li>
        <li>Backend
          <ul><li>JavaScript (in progress)</li></ul>
        </li>
      </ul>
    </section>
    <section id="projects">
      <h2>Projects</h2>
      <article>
        <figure>
          <img src="project1.png" alt="Screenshot of project 1" width="300" />
          <figcaption>My first HTML/CSS project</figcaption>
        </figure>
        <h3>Project Title</h3>
        <p>One-line description of what this project does.</p>
      </article>
    </section>
    <section id="contact">
      <h2>Contact</h2>
      <form>
        <label for="cname">Name:</label>
        <input type="text" id="cname" name="cname" required />
        <label for="cemail">Email:</label>
        <input type="email" id="cemail" name="cemail" required />
        <label for="cmsg">Message:</label>
        <textarea id="cmsg" name="cmsg" rows="4"></textarea>
        <button type="submit">Send</button>
      </form>
      <a href="mailto:you@example.com">Or Email Me Directly</a>
    </section>
  </main>
  <aside>
    <h3>Fun Facts</h3>
    <ul><li>Fact 1</li><li>Fact 2</li></ul>
  </aside>
  <footer>
    <p>&copy; 2026 Your Name. All rights reserved.</p>
  </footer>
</body>
</html>
\`\`\`

:::note
**Self-review checklist before you consider a page 'done'**
Does the file start with <!DOCTYPE html>? Does <head> include charset, viewport, and title? Is there exactly one <h1> and one <main>? Does every <img> have meaningful alt text? Does every form input have a matching <label for="...">? Are all tags properly closed and nested? Do the nav links correctly jump to each section?
:::

:::challenge
**Final Practice Project**
Build your own complete version of this page from scratch (not copy-pasted) about yourself. Include at least: a semantic layout, one nested list, one table, one complete form with 5+ different input types, one image with figure/figcaption, and correct meta tags. This single project demonstrates mastery of everything in this document.
:::
`,
  21: `# 21. Quick Reference Cheat Sheet

A fast lookup table of every tag covered in this document, grouped by category -- keep this section bookmarked for daily reference while you practice.

## Structure

| Tag | Purpose |
|---|---|
| \`<!DOCTYPE html>\` | Declares HTML5 |
| \`<html>\` | Root element |
| \`<head>\` | Page metadata (not visible) |
| \`<body>\` | Visible page content |

## Text

| Tag | Purpose |
|---|---|
| \`<h1>\` - \`<h6>\` | Headings, in order of importance |
| \`<p>\` | Paragraph |
| \`<strong>\` / \`<em>\` | Semantically important bold / italic |
| \`<b>\` / \`<i>\` | Visually bold / italic only |
| \`<mark>\` / \`<small>\` | Highlighted text / fine print |
| \`<del>\` / \`<ins>\` | Struck-through / underlined text |
| \`<sub>\` / \`<sup>\` | Subscript / superscript |
| \`<abbr>\` | Abbreviation with a tooltip |
| \`<blockquote>\` / \`<code>\` | Quoted block / inline code |
| \`<br>\` / \`<hr>\` | Line break / horizontal rule |

## Lists

| Tag | Purpose |
|---|---|
| \`<ul>\` / \`<li>\` | Unordered (bullet) list / list item |
| \`<ol>\` / \`<li>\` | Ordered (numbered) list / list item |
| \`<dl>\` / \`<dt>\` / \`<dd>\` | Description list / term / description |

## Links & Media

| Tag | Purpose |
|---|---|
| \`<a href="...">\` | Hyperlink |
| \`<img src="..." alt="...">\` | Image |
| \`<figure>\` / \`<figcaption>\` | Image (or media) with a caption |
| \`<video>\` / \`<audio>\` | Video / audio player |
| \`<iframe>\` | Embed another webpage |

## Tables

| Tag | Purpose |
|---|---|
| \`<table>\` / \`<tr>\` | Table / table row |
| \`<th>\` / \`<td>\` | Header cell / data cell |
| \`<thead>\` / \`<tbody>\` / \`<caption>\` | Header group / body group / title |
| \`rowspan\` / \`colspan\` | Merge cells vertically / horizontally |

## Forms

| Tag | Purpose |
|---|---|
| \`<form>\` | Container for user input |
| \`<input type="...">\` | text/email/password/number/date/checkbox/radio/file... |
| \`<select>\` / \`<option>\` / \`<optgroup>\` | Dropdown menu / choice / grouped choices |
| \`<textarea>\` | Multi-line text input |
| \`<label for="...">\` | Label linked to an input's id |
| \`<fieldset>\` / \`<legend>\` | Groups related fields / group title |
| \`<button>\` | Clickable button |

## Semantic Layout

| Tag | Purpose |
|---|---|
| \`<header>\` / \`<footer>\` | Top / bottom section |
| \`<nav>\` | Navigation links |
| \`<main>\` | Primary page content (one per page) |
| \`<section>\` / \`<article>\` | Thematic grouping / self-contained content |
| \`<aside>\` | Related side content |
| \`<details>\` / \`<summary>\` | Native collapsible content widget |
| \`<time>\` | Machine-readable date/time |
| \`<div>\` / \`<span>\` | Generic block / inline container (non-semantic) |

## Global Attributes

| Attribute | Purpose |
|---|---|
| \`id\` / \`class\` | Unique identifier / reusable identifier |
| \`alt\` | Fallback text for images (accessibility + SEO) |
| \`href\` / \`src\` | Link destination / resource path |
| \`target\` | Where a link opens (_blank, _self...) |
| \`data-*\` | Custom data, often read by JavaScript |
| \`title\` | Tooltip text shown on hover |

## Meta & Head

| Tag / Attribute | Purpose |
|---|---|
| \`charset\` | Character encoding, always UTF-8 |
| \`viewport\` | Mobile-responsive rendering |
| \`description\` | Search engine result snippet |
| \`og:*\` (Open Graph) | Social share preview card |
| \`link rel="icon"\` | Favicon |
| \`link rel="stylesheet"\` | External CSS file |

## Accessibility

| Attribute / Practice | Purpose |
|---|---|
| \`alt\` on images | Screen-reader description of image content |
| \`label for="id"\` | Accessible name for a form field |
| \`aria-label\` | Accessible name when no visible text exists |
| \`aria-hidden="true"\` | Hides purely decorative content from screen readers |
| Logical heading order | Lets screen reader users navigate by heading level |
| Full keyboard operability | Every interactive element reachable via Tab |
`,
  22: `# 22. Practice Question Bank

A large set of short-answer and fill-in-the-blank style questions, organized by topic, for focused revision before your final quiz or any assessment.

## 22.1 Structure & Basics

1. Fill in the blank: every HTML file must start with ______.
2. True or False: HTML is a programming language.
3. What two things does the lang attribute on <html> help with?
4. Name the two things that go inside every HTML file's root element.
5. Why is nothing inside <head> visible on the page?

## 22.2 Tags, Elements, Attributes

1. Write the opening tag, closing tag, and one attribute for a hyperlink to google.com.
2. List 4 void elements.
3. What symbol precedes a class name in CSS (preview from next week) versus an id?
4. True or False: <img> requires a closing tag.
5. What's stored in a data-* attribute, and who typically reads it?

## 22.3 Text & Lists

1. Which heading tag should appear only once per page?
2. Write an unordered list of 3 programming languages.
3. What tag would you use to show a keyboard shortcut like Ctrl+C?
4. What's the entity code for the & symbol?
5. Which list type uses dt and dd?

## 22.4 Links & Images

1. Write a link that opens in a new tab.
2. What attribute makes a link trigger a file download instead of navigating?
3. Why is width/height on an img tag recommended even though CSS can override it?
4. What does figcaption require to work correctly?
5. Name two image formats and when you'd use each.

## 22.5 Tables & Forms

1. Write a 2x2 table with a caption.
2. What attribute merges table cells horizontally?
3. List 5 different input types.
4. What must be identical across a group of radio buttons?
5. What's the difference in submitted data between disabled and readonly fields?

## 22.6 Semantic HTML & Accessibility

1. Name the semantic tag for a page's main navigation menu.
2. Why should you avoid using more than one <main> per page?
3. What does the alt attribute do for a broken image link?
4. What native tags create a working accordion without JavaScript?
5. Why is a real <button> preferred over a div with a click handler?

:::note
**How to use this question bank effectively**
Cover the answer key for each section, attempt every question from memory, then check yourself. Any question you get wrong or hesitate on is exactly the concept you should re-read in the matching section above before moving forward.
:::
`,
  23: `# 23. Final Self-Assessment Quiz

Attempt all 15 questions without looking back at the notes. Answers follow at the end.

:::challenge
**Questions**
Q1) What does HTML stand for, and is it a programming language?
Q2) What are the three core building blocks of HTML (tag, element, attribute) -- define each.
Q3) Name three void (self-closing) elements.
Q4) What's the real difference between <strong> and <b>?
Q5) Which list type would you use for numbered installation steps?
Q6) What's the difference between an absolute and a relative path?
Q7) Why is the alt attribute important on images?
Q8) What must be true for a group of radio buttons to behave as 'only one selectable'?
Q9) What's the difference between rowspan and colspan?
Q10) Name three semantic HTML5 tags and what each represents.
Q11) Is <div> a block or inline element? What about <span>?
Q12) What does the viewport meta tag actually do?
Q13) What are Open Graph tags used for?
Q14) Why should a real <button> be preferred over a <div> styled to look like one?
Q15) What is the DOM, in your own words?
:::

## Answer Key

1. HyperText Markup Language -- it is NOT a programming language, it's a markup language describing structure and meaning.
2. Tag = keyword in angle brackets; Element = opening tag + content + closing tag; Attribute = extra info inside the opening tag.
3. img, br, hr, input, meta (any three).
4. They look identical by default, but strong also carries semantic importance for screen readers/SEO, while b is purely visual.
5. <ol> (ordered list), because the step order matters.
6. Absolute = full URL, works from anywhere; relative = path based on the current file's location.
7. It's shown if the image fails to load, and read aloud by screen readers for accessibility and SEO.
8. They must all share the exact same 'name' attribute value.
9. rowspan merges cells vertically (across rows); colspan merges cells horizontally (across columns).
10. header, nav, main, section, article, aside, footer (any three).
11. div = block; span = inline.
12. Makes the page render correctly and responsively on mobile device screen widths.
13. They control the preview card (image/title/description) shown when your link is shared on social apps.
14. A real button is keyboard-focusable and correctly announced by screen readers automatically; a styled div is not, without significant extra work.
15. The DOM (Document Object Model) is the browser's live, in-memory tree representation of your HTML page, built after the browser reads your file.

## What's Next: A Preview of CSS

You now have a genuinely complete HTML foundation. But right now, every page you've built is unstyled -- black text on a white background, default fonts, no layout control. Next week, CSS (Cascading Style Sheets) transforms these exact same HTML skeletons into professional-looking, responsive websites.

## A Quick Taste of What's Coming

\`\`\`css
/* This single CSS file, linked to any page from this document, */
/* would completely transform its appearance: */
body {
  font-family: "Poppins", sans-serif;
  max-width: 800px;
  margin: 0 auto;
  color: #333;
}
header {
  background: linear-gradient(to right, #0b3d91, #3b6fd6);
  color: white;
  padding: 40px;
  text-align: center;
}
nav a {
  margin: 0 12px;
  text-decoration: none;
  color: #0b3d91;
  font-weight: bold;
}
.card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 20px;
}
\`\`\`

Notice something important: not a single HTML tag changes. The exact same header, nav, and article elements you've been building all week simply get referenced by CSS selectors and restyled completely. This is precisely why we invested real time mastering HTML structure first -- clean, semantic HTML makes the CSS you write next week dramatically easier and more predictable.

:::note
**Carry these habits forward into CSS week**
Keep using semantic tags as natural CSS targets (header, nav, article) instead of adding classes to divs for things that already have a meaningful tag. Keep your HTML validated and properly nested -- broken HTML structure causes confusing, hard-to-debug CSS behavior. And keep practicing by rebuilding real pages from memory, not just reading -- that habit is what actually built your HTML skills this week, and it's exactly what will build your CSS skills next.
:::

:::note
**You have now covered a genuinely complete HTML foundation.**
Structure, text, entities, lists, links, images, tables, every important form input, semantic and non-semantic elements, media, meta tags, and accessibility -- with real diagrams and dozens of worked examples throughout. Practice by rebuilding the complete example in Section 15 from memory, then move on to styling everything with CSS next.
:::
`,
}

export default content
