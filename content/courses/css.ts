// CSS — Complete Guide (Extended Edition)
// Auto-extracted from the source .docx study guide. Do not hand-edit;
// regenerate if the source document changes.

const content: Record<number, string> = {
  1: `# 1. What is CSS?

:::definition
CSS (Cascading Style Sheets) is the language used to control how HTML looks -- colors, fonts, spacing, layout, animations. HTML says WHAT content exists; CSS says HOW it should appear. Without CSS, every website would look like a plain, unstyled document -- just headings and paragraphs stacked top to bottom in default black text.
:::

:::insight
**Analogy**
If HTML is the skeleton of a house, CSS is the paint, the furniture placement, the curtains -- the same skeleton can look completely different (a cozy cottage or a modern apartment) depending purely on the CSS applied to it, without changing a single HTML tag.
:::

## 1.1 Three Ways to Add CSS to a Page

\`\`\`html
<!-- 1) Inline CSS: written directly on an element, avoid in real projects -->
<p style="color: blue; font-size: 18px;">Blue text</p>
<!-- 2) Internal CSS: written inside a <style> tag in the <head> -->
<head>
  <style>
    p { color: blue; }
  </style>
</head>
<!-- 3) External CSS: separate .css file -- THE PROFESSIONAL STANDARD -->
<head>
  <link rel="stylesheet" href="style.css" />
</head>
\`\`\`

:::insight
**Which one should you actually use?**
Always use external CSS in real projects. It keeps structure (HTML) and presentation (CSS) completely separate, lets one stylesheet style hundreds of pages consistently, and is what every professional codebase in this course will use from today onward.
:::

## 1.2 CSS Syntax Anatomy

\`\`\`css
selector {
  property: value;
  property: value;
}
/* Real example */
p {
  color: navy;
  font-size: 16px;
}
\`\`\`

- Selector -- which HTML element(s) this rule applies to (e.g. p)
- Property -- the aspect being styled (e.g. color, font-size)
- Value -- the setting for that property (e.g. navy, 16px)
- Each property:value pair is called a declaration, and must end with a semicolon

## 1.3 Selectors -- How to Target Elements

\`\`\`css
/* Element selector: targets ALL <p> tags */
p { color: black; }
/* Class selector: targets elements with class="highlight" (reusable) */
.highlight { background-color: yellow; }
/* ID selector: targets the ONE element with id="header" (must be unique) */
#header { font-size: 24px; }
/* Group selector: apply the same rule to multiple selectors at once */
h1, h2, h3 { font-family: Arial, sans-serif; }
/* Descendant selector: targets <a> tags that are INSIDE a <nav> */
nav a { text-decoration: none; }
/* Child selector: targets DIRECT children only, not grandchildren */
nav > a { color: blue; }
/* Attribute selector: targets elements with a specific attribute value */
input[type="email"] { border-color: green; }
/* Universal selector: targets EVERYTHING on the page */
* { margin: 0; padding: 0; box-sizing: border-box; }
\`\`\`

:::note
**class vs id -- the most important distinction in this section**
Use class when a style will be reused on multiple elements (e.g. every 'card' on a page). Use id only for a single, unique element on the page (e.g. the one main header). In HTML: class="card" vs id="header". In CSS: classes start with a dot (.card), IDs start with a hash (#header).
:::

## 1.4 More Combinators & Attribute Selectors

\`\`\`css
/* Adjacent sibling: targets a <p> immediately after an <h2> */
h2 + p { font-weight: bold; }
/* General sibling: targets ALL <p> siblings after an <h2> */
h2 ~ p { color: #555; }
/* Attribute selectors: match based on attribute presence/value */
input[required] { border-color: red; }
input[type="email"] { background: #f0f8ff; }
a[href^="https"] { color: green; }   /* href STARTS WITH https */
a[href$=".pdf"] { color: purple; }   /* href ENDS WITH .pdf */
\`\`\`

The adjacent sibling combinator (+) is commonly used to add spacing after a specific element type, e.g. 'give a paragraph extra margin only when it directly follows a heading' -- exactly the kind of contextual styling that's hard to achieve with classes alone.

## 1.5 The Cascade & Specificity -- Who Wins When Rules Conflict?

:::definition
When multiple CSS rules target the same element with different values, the browser uses specificity to decide which one wins.
:::

![Figure 1: CSS specificity, from lowest to highest priority](/CSS_images/image_1.png)

**Figure 1** — CSS specificity, from lowest to highest priority

\`\`\`css
p { color: blue; }         /* specificity: low  */
.highlight { color: red; }  /* specificity: medium -- THIS WINS on <p class="highlight"> */
#main { color: green; }     /* specificity: high */
\`\`\`

:::scenario
**Real-time use case**
This is exactly why sometimes your CSS 'doesn't work' as a beginner -- another, more specific rule elsewhere in the file (or even in a library like Bootstrap) is overriding it. Understanding specificity is the #1 skill for debugging 'why isn't my CSS applying' problems.
:::

:::mistake
**Common mistakes to avoid**
1) Forgetting external CSS needs a correctly linked <link> tag with the right relative path, or nothing will apply at all.
2) Overusing IDs for styling instead of classes, making later overrides much harder.
3) Reaching for !important to force a style instead of fixing the actual specificity conflict -- this creates a maintenance nightmare in larger projects.
:::

:::challenge
**Practice Exercise 1.1**
1) Create an external style.css file and link it properly to an HTML page from the HTML guide.
2) Style all h1/h2 tags using an element selector.
3) Add a class 'highlight' to one element and style it with a background color.
4) Deliberately create a specificity conflict (style the same element with both a class and an ID rule using different colors) and predict which wins before checking in the browser.
:::

:::challenge
**Quick Quiz -- Section 1**
Q1) Name the three ways to add CSS, and which is the professional standard.
Q2) What's the difference between a class selector and an ID selector?
Q3) In specificity, which wins: a class selector or an ID selector?
Q4) What does the universal selector (*) target?
:::
`,
  2: `# 2. The CSS Box Model

:::definition
Every single HTML element, no matter what it is, is treated by the browser as a rectangular box made of four layers: content (the actual text/image), padding (space between the content and the border), border (a visible or invisible line around the padding), and margin (transparent space outside the border, separating this box from other boxes).
:::

![Figure 2: every element is these four nested layers, from the inside out](/CSS_images/image_2.png)

**Figure 2** — every element is these four nested layers, from the inside out

:::insight
**Analogy**
Think of mailing a fragile gift. The content is the gift itself. The padding is the bubble wrap directly around it. The border is the cardboard box holding the bubble-wrapped gift. The margin is the empty space you leave around that box inside a larger shipping crate so it doesn't bang against other boxes.
:::

## 2.1 The Four Properties in Practice

\`\`\`css
.card {
  width: 300px;
  height: 200px;
  padding: 20px;        /* space inside, around the content */
  border: 2px solid #333;
  margin: 16px;          /* space outside, between this box and others */
}
/* Shorthand: different values per side (top right bottom left, clockwise) */
.box {
  margin: 10px 20px 10px 20px;
  padding: 5px 10px;      /* top/bottom: 5px, left/right: 10px */
}
\`\`\`

## 2.2 box-sizing -- The Setting Every Project Needs

:::tip
**Critical concept**
By default, width and height apply only to the content -- padding and border get ADDED on top, making the box bigger than you expected. Setting box-sizing: border-box; changes this so width/height include padding and border, making sizing far more predictable.
:::

![Figure 3: content-box (default, unpredictable) vs border-box (recommended)](/CSS_images/image_3.png)

**Figure 3** — content-box (default, unpredictable) vs border-box (recommended)

This is why professional projects almost always start their CSS file with:

\`\`\`css
* {
  box-sizing: border-box;
}
\`\`\`

## 2.3 A Worked Example -- Before and After border-box

\`\`\`css
/* Without border-box: */
.card {
  width: 300px;
  padding: 20px;
  border: 5px solid black;
  /* Actual rendered width = 300 + 20+20 + 5+5 = 350px! */
}
/* With border-box: */
* { box-sizing: border-box; }
.card {
  width: 300px;
  padding: 20px;
  border: 5px solid black;
  /* Actual rendered width = exactly 300px, as expected */
}
\`\`\`

:::mistake
**Common mistakes to avoid**
1) Forgetting box-sizing: border-box, then being confused why an element with padding is wider than expected.
2) Using margin when you actually meant padding (margin is OUTSIDE the border, padding is INSIDE) -- draw the box model diagram from memory if you're ever unsure.
3) Setting margin on all four sides individually when the shorthand (margin: 10px 20px;) would be clearer and shorter.
:::

:::challenge
**Practice Exercise 2.1**
1) Add '* { box-sizing: border-box; margin: 0; padding: 0; }' at the very top of a fresh stylesheet -- this exact reset is used in nearly every real project.
2) Build 3 boxes with different width/padding/border/margin combinations, then use Chrome DevTools (F12 -> Elements -> the box model diagram in the Styles panel) to visually confirm your values.
3) Recreate the 'without border-box' example, measure the actual rendered width in DevTools, and confirm it matches the math shown above.
:::

:::challenge
**Quick Quiz -- Section 2**
Q1) Name the four layers of the box model, from innermost to outermost.
Q2) What problem does box-sizing: border-box solve?
Q3) What's the difference between margin and padding?
:::
`,
  3: `# 3. Colors & Units

## 3.1 Every Way to Specify a Color

\`\`\`css
p { color: red; }                      /* Named color (147 available) */
p { color: #ff0000; }                  /* Hex code -- most common in real projects */
p { color: rgb(255, 0, 0); }           /* Red, Green, Blue values (0-255 each) */
p { color: rgba(255, 0, 0, 0.5); }     /* RGB + Alpha (0=invisible, 1=solid) */
p { color: hsl(0, 100%, 50%); }        /* Hue, Saturation, Lightness */
p { color: hsla(0, 100%, 50%, 0.5); }  /* HSL + Alpha */
\`\`\`

:::scenario
**Real-time use case**
Design teams hand developers exact hex codes (e.g. #0b3d91 for a brand blue) -- this is why hex codes are the most common format in real company codebases. rgba() is used specifically whenever you need transparency, like a semi-transparent dark overlay behind a popup modal.
:::

## 3.2 CSS Units -- Absolute vs Relative

![Figure 4: the five most common CSS units, absolute vs relative](/CSS_images/image_4.png)

**Figure 4** — the five most common CSS units, absolute vs relative

| Unit | Type | What it means |
|---|---|---|
| px | Absolute | Fixed pixels -- does not scale with anything |
| % | Relative | Percentage of the parent element's size |
| em | Relative | Relative to the font-size of the PARENT element |
| rem | Relative | Relative to the font-size of the ROOT (html) element -- predictable, preferred |
| vw / vh | Relative | 1% of the viewport's (browser window's) width / height |

:::insight
**Which unit should you actually use?**
Use rem for font sizes and spacing (predictable, and respects a user's browser accessibility settings), % or vw/vh for layout widths that need to be responsive, and px sparingly, mainly for things that truly should never scale (like a 1px border).
:::

## 3.3 A Worked Example -- em's Compounding Problem

\`\`\`css
.parent {
  font-size: 20px;
}
.child {
  font-size: 1.5em;   /* 1.5 x 20px (parent) = 30px */
}
.grandchild {
  font-size: 1.5em;   /* 1.5 x 30px (child, NOT root!) = 45px -- compounds! */
}
/* rem avoids this entirely: */
.grandchild-fixed {
  font-size: 1.5rem;  /* always 1.5 x the ROOT font-size, no matter how deep nested */
}
\`\`\`

This compounding behavior is exactly why professional teams default to rem for font sizes -- em can silently balloon in deeply nested components.

:::mistake
**Common mistakes to avoid**
1) Confusing em (relative to the PARENT's font-size, which compounds when nested) with rem (relative to the ROOT font-size, always predictable).
2) Using px for every single measurement, making a page rigid and non-responsive.
3) Forgetting rgba() requires a 4th value (alpha) between 0 and 1, not 0-255 like the RGB values.
:::

:::challenge
**Practice Exercise 3.1**
1) Style the same button 5 different ways, once per color format (named, hex, rgb, rgba, hsl).
2) Build 3 nested boxes using em for font-size and observe the compounding effect; then rebuild using rem and compare.
3) Build a full-width banner using vw units, and confirm it always spans the full browser width by resizing your browser.
:::

:::challenge
**Quick Quiz -- Section 3**
Q1) Which color format lets you control transparency?
Q2) What's the difference between em and rem?
Q3) Which CSS unit is 1% of the browser viewport's height?
:::
`,
  4: `# 4. Typography

## 4.1 Core Text Properties

\`\`\`css
p {
  font-family: "Poppins", Arial, sans-serif;  /* fallback fonts */
  font-size: 16px;
  font-weight: 400;       /* 400=normal, 700=bold */
  font-style: italic;     /* normal | italic */
  line-height: 1.6;       /* spacing between lines -- crucial! */
  letter-spacing: 0.5px;  /* spacing between letters */
  text-align: center;     /* left | right | center | justify */
  text-transform: uppercase; /* uppercase | lowercase | capitalize */
  text-decoration: underline; /* underline | line-through | none */
}
\`\`\`

:::insight
**Why line-height matters more than beginners expect**
A common beginner mistake is ignoring line-height, leaving text lines cramped and hard to read. Professional designers set body text line-height between 1.4 and 1.8. This single property has a bigger impact on how 'professional' a page looks than almost anything else.
:::

## 4.2 Using Google Fonts

\`\`\`html
<!-- In your HTML <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href=
  "https://fonts.googleapis.com/css2?family=Poppins:wght@400;700">
/* In your CSS */
body {
  font-family: "Poppins", sans-serif;
}
\`\`\`

:::scenario
**Real-time use case**
Almost every modern website uses a Google Font instead of a default system font, because it lets the whole site have a consistent, deliberate visual identity across every device and operating system, rather than looking different on Windows vs Mac vs Android.
:::

## 4.3 Font Weight Reference

| Value | Common name |
|---|---|
| 100 | Thin |
| 300 | Light |
| 400 | Normal (default) |
| 600 | Semi-bold |
| 700 | Bold |
| 900 | Black (heaviest) |

## 4.4 A Complete Typography System Example

\`\`\`css
body {
  font-family: "Inter", sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}
h1 { font-size: 2.5rem; font-weight: 700; line-height: 1.2; }
h2 { font-size: 2rem; font-weight: 600; line-height: 1.3; }
p  { font-size: 1rem; font-weight: 400; margin-bottom: 1rem; }
small { font-size: 0.85rem; color: #777; }
\`\`\`

Notice headings use a tighter line-height (1.2-1.3) than body text (1.6) -- headings are usually short and don't need as much breathing room between lines, while paragraphs of running text need more space to stay readable.

:::mistake
**Common mistakes to avoid**
1) Forgetting a fallback font -- always list a generic family (serif, sans-serif) last in case the custom font fails to load.
2) Using text-transform: uppercase on long paragraphs -- it hurts readability and should be reserved for short labels/buttons.
3) Setting font-size in px everywhere instead of rem, ignoring users who've changed their browser's default font size for accessibility.
:::

:::challenge
**Practice Exercise 4.1**
1) Import a Google Font and apply it to an entire page.
2) Build the complete typography system example above and apply it to an HTML page from the HTML guide.
3) Compare line-height: 1.0 vs line-height: 1.6 on the same paragraph and note the readability difference.
:::

:::challenge
**Quick Quiz -- Section 4**
Q1) What does line-height control, and why does it matter for readability?
Q2) Why should you always include a fallback font family?
Q3) Name two font-weight values and what they represent.
:::
`,
  5: `# 5. Backgrounds, Borders, Border-radius & Box-shadow

## 5.1 Backgrounds

\`\`\`css
.hero {
  background-color: #0b3d91;
  background-image: url("banner.jpg");
  background-size: cover;       /* cover | contain | 100% 100% */
  background-position: center;
  background-repeat: no-repeat;
}
/* Gradient background -- no image file needed */
.hero-gradient {
  background: linear-gradient(to right, #0b3d91, #3b6fd6);
}
.radial-hero {
  background: radial-gradient(circle, #3b6fd6, #0b3d91);
}
\`\`\`

- background-size: cover -- scales the image to fully cover the box, cropping if needed (most common for hero banners)
- background-size: contain -- scales to fit fully inside the box without cropping, may leave empty space
- Gradients are extremely common in modern UI design and require zero image files -- purely CSS

## 5.2 Borders & Border-radius

\`\`\`css
.card {
  border: 2px solid #0b3d91;      /* width | style | color */
  border-radius: 12px;            /* rounded corners -- 50% for a perfect circle */
}
/* Different radius per corner */
.card-top {
  border-radius: 12px 12px 0 0;   /* top-left top-right bottom-right bottom-left */
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;   /* turns a square image into a perfect circle */
}
/* Border styles */
.dashed { border: 2px dashed #999; }
.dotted { border: 2px dotted #999; }
\`\`\`

:::scenario
**Real-time use case**
Every rounded profile picture on any social media platform uses exactly border-radius: 50% on a square image. Card-top radius (rounded top corners only, sharp bottom) is a very common pattern for image headers on product cards.
:::

## 5.3 Box-shadow

\`\`\`css
.card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  /* x-offset  y-offset  blur-radius  color */
}
/* Multiple shadows, comma-separated */
.card-elevated {
  box-shadow:
    0 1px 2px rgba(0,0,0,0.1),
    0 4px 12px rgba(0,0,0,0.1);
}
/* Inset shadow -- appears inside the element */
.pressed-button {
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
}
\`\`\`

Every card-style UI (Netflix movie tiles, Amazon product cards) uses box-shadow to create the illusion that the card is slightly lifted off the page. Subtle shadows with low opacity (0.1-0.2) look far more professional than harsh, dark shadows.

:::mistake
**Common mistakes to avoid**
1) Setting only background-image without background-size, causing the image to repeat in a tiled, broken-looking pattern.
2) Forgetting background-repeat: no-repeat when you only want the image to show once.
3) Using box-shadow values that are too strong/dark, making the design look heavy instead of subtle and modern.
:::

:::challenge
**Practice Exercise 5.1**
1) Give a hero section a gradient background.
2) Make a profile photo circular using border-radius: 50%.
3) Build 3 cards with progressively stronger box-shadow values and compare which looks most professional.
4) Build a 'pressed' button state using an inset box-shadow.
:::

:::challenge
**Quick Quiz -- Section 5**
Q1) What's the difference between background-size: cover and contain?
Q2) What border-radius value creates a perfect circle from a square image?
Q3) What are the four values in box-shadow: 0 4px 12px rgba(0,0,0,0.15)?
:::
`,
  6: `# 6. Display & Position

## 6.1 The display Property

\`\`\`css
span { display: block; }         /* now behaves like a block element */
li { display: inline; }           /* turns list items into a horizontal menu */
div { display: inline-block; }    /* flows inline BUT respects width/height like a block */
div { display: none; }            /* completely removes the element -- no space taken */
\`\`\`

:::scenario
**Real-time use case**
Turning li items to display: inline (or, more commonly today, using Flexbox -- Section 7) is exactly how horizontal navigation menus are built from what is structurally still a semantic, accessible list.
:::

## 6.2 The position Property -- Deep Dive

![Figure 5: the 5 values of the position property](/CSS_images/image_5.png)

**Figure 5** — the 5 values of the position property

| Value | Behavior |
|---|---|
| static | Default. Follows normal document flow; top/left/right/bottom are ignored |
| relative | Stays in normal flow, but can be nudged using top/left/right/bottom, relative to where it WOULD have been |
| absolute | Removed from normal flow entirely; positioned relative to its nearest ancestor with position other than static |
| fixed | Removed from normal flow; positioned relative to the browser window, stays in place when scrolling |
| sticky | Behaves like relative until the page scrolls past a threshold, then behaves like fixed |

\`\`\`css
.badge {
  position: absolute;
  top: 8px;
  right: 8px;
}
.parent-card {
  position: relative;   /* makes .badge position relative to .parent-card, not the page */
}
.navbar {
  position: sticky;
  top: 0;
}
\`\`\`

:::insight
**The single most important rule about position: absolute**
An absolutely positioned element positions itself relative to its nearest ancestor that is NOT static. If no ancestor has one of those, it positions relative to the entire page. This is why you'll constantly see position: relative; added to a parent purely to 'contain' an absolutely positioned child -- this single pattern is used everywhere in real UI development.
:::

## 6.3 z-index -- Controlling Stacking Order

:::definition
When elements overlap (which only happens with position values other than static), z-index controls which one appears on top. Higher numbers sit above lower numbers. z-index only works on elements that have a position value set.
:::

![Figure 6: higher z-index values stack visually on top of lower ones](/CSS_images/image_6.png)

**Figure 6** — higher z-index values stack visually on top of lower ones

\`\`\`css
.modal-overlay { position: fixed; z-index: 100; }
.navbar { position: sticky; z-index: 50; }
.page-content { position: static; }  /* z-index has no effect here */
\`\`\`

:::mistake
**Common mistakes to avoid**
1) Using position: absolute without setting position: relative on the intended parent, causing the element to jump to an unexpected place on the page.
2) Setting z-index on an element that still has position: static -- it will have no effect at all.
3) Overusing position: absolute for general layout instead of Flexbox/Grid -- reserve it for badges, tooltips, and overlays, not full page layout.
:::

:::challenge
**Practice Exercise 6.1**
1) Create a card with a 'NEW' badge in the top-right corner using position: relative on the card and position: absolute on the badge.
2) Build a sticky navigation bar that stays at the top of the page as you scroll.
3) Create two overlapping boxes and use z-index to control which appears on top; then swap the values and observe the change.
:::

:::challenge
**Quick Quiz -- Section 6**
Q1) What's the default value of the position property?
Q2) An absolutely positioned element positions itself relative to what, exactly?
Q3) Does z-index work on an element with position: static? Why or why not?
:::
`,
  7: `# 7. Flexbox -- Complete Deep Dive

:::definition
Flexbox (Flexible Box Layout) is a CSS layout system designed for arranging items in a single direction -- a row OR a column -- and distributing space between them intelligently, even when their sizes are unknown or dynamic. It solved decades of layout problems that used to require hacky float-based tricks.
:::

![Figure 7: Flexbox's main axis (direction of layout) vs cross axis (perpendicular)](/CSS_images/image_7.png)

**Figure 7** — Flexbox's main axis (direction of layout) vs cross axis (perpendicular)

## 7.1 Container Properties

\`\`\`css
.container {
  display: flex;
  flex-direction: row;         /* row (default) | column | row-reverse | column-reverse */
  justify-content: center;     /* aligns items along the MAIN axis */
  align-items: center;         /* aligns items along the CROSS axis */
  gap: 16px;                   /* spacing between items -- no more margin hacks! */
  flex-wrap: wrap;             /* allows items to move to a new line if they don't fit */
}
\`\`\`

## 7.2 justify-content Values (Main Axis Alignment)

| Value | Effect |
|---|---|
| flex-start | Items packed at the start (default) |
| flex-end | Items packed at the end |
| center | Items packed in the center |
| space-between | Equal space BETWEEN items, none at the edges |
| space-around | Equal space AROUND each item, including edges |
| space-evenly | Perfectly equal space everywhere, including edges |

## 7.3 align-items Values (Cross Axis Alignment)

| Value | Effect |
|---|---|
| stretch | Items stretch to fill the container's cross-axis size (default) |
| flex-start | Items align to the start of the cross axis |
| flex-end | Items align to the end of the cross axis |
| center | Items align to the center of the cross axis |

## 7.4 Flex Item Properties

\`\`\`css
.item {
  flex-grow: 1;       /* how much this item should grow to fill extra space */
  flex-shrink: 1;      /* how much this item should shrink if space is tight */
  flex-basis: 200px;   /* the item's starting size before growing/shrinking */
  /* shorthand: */
  flex: 1;              /* same as flex-grow:1; flex-shrink:1; flex-basis:0; -- very common */
}
.item-fixed {
  flex: 0 0 200px;    /* never grow, never shrink, always exactly 200px */
}
\`\`\`

## 7.5 Worked Example: A Navbar

\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
}
.navbar .links {
  display: flex;
  gap: 24px;
}
\`\`\`

\`\`\`html
<nav class="navbar">
  <div class="logo">MyBrand</div>
  <div class="links">
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </div>
  <button>Sign Up</button>
</nav>
\`\`\`

This is exactly how the vast majority of real navbars are built: logo on the left, links in the middle, a button on the right, using justify-content: space-between on the outer flex container.

## 7.6 Worked Example: Equal-Width Cards

\`\`\`css
.pricing-row {
  display: flex;
  gap: 20px;
}
.pricing-card {
  flex: 1;   /* every card shares available space equally, however many there are */
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
\`\`\`

:::mistake
**Common mistakes to avoid**
1) Trying to force Flexbox to do a full 2D grid layout with lots of wrapping and manual width math -- use Grid instead (Section 8).
2) Forgetting 'gap' exists, and instead adding margin to every child element (creating uneven edge spacing).
3) Confusing justify-content (main axis) with align-items (cross axis) -- if flex-direction is row, justify-content is horizontal and align-items is vertical; if flex-direction is column, they SWAP.
:::

:::challenge
**Practice Exercise 7.1**
1) Build a navbar with a logo on the left, three nav links in the center, and a button on the right, using justify-content: space-between.
2) Build a row of 4 equal-width pricing cards using flex: 1 and gap.
3) Build a centered loading spinner using justify-content: center and align-items: center on a full-height container.
4) Change flex-direction to column on one of your layouts and observe how justify-content and align-items swap their effective direction.
:::

:::challenge
**Quick Quiz -- Section 7**
Q1) Which property centers flex items along the main axis?
Q2) What does flex: 1 do to a flex item?
Q3) When flex-direction is row, does justify-content control horizontal or vertical alignment?
:::
`,
  8: `# 8. CSS Grid -- Complete Deep Dive

:::definition
CSS Grid is a layout system designed for arranging items in rows AND columns simultaneously -- a true 2D grid, unlike Flexbox's single direction. Grid is the right tool whenever you're laying out an overall page structure or a genuine grid of cards.
:::

![Figure 8: a 3-column, 2-row CSS Grid layout](/CSS_images/image_8.png)

**Figure 8** — a 3-column, 2-row CSS Grid layout

## 8.1 Basic Grid Setup

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;   /* 3 equal-width columns ("fr" = fraction of free space) */
  grid-template-rows: auto 1fr auto;    /* header / main content / footer */
  gap: 20px;                             /* spacing between grid cells, both directions */
}
/* Fixed sidebar + flexible main area -- very common! */
.page-layout {
  display: grid;
  grid-template-columns: 200px 1fr;
}
\`\`\`

## 8.2 Placing Items Explicitly

\`\`\`css
.item {
  grid-column: 1 / 3;   /* spans from column line 1 to line 3 (2 columns wide) */
  grid-row: 1 / 2;
}
/* Shorthand span syntax */
.wide-item {
  grid-column: span 2;   /* spans 2 columns starting from its natural position */
}
\`\`\`

## 8.3 grid-template-areas -- Naming Your Layout

\`\`\`css
.page {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar main"
    "sidebar footer";
}
.sidebar { grid-area: sidebar; }
.header  { grid-area: header; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
\`\`\`

:::scenario
**Real-time use case**
grid-template-areas is one of the most readable ways to build an admin dashboard layout (fixed sidebar, header, main content area) -- you can literally read the layout's shape from the CSS itself, which is why many real production dashboards are built exactly this way.
:::

## 8.4 Auto-Responsive Grids Without Media Queries

\`\`\`css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}
\`\`\`

This single line creates a grid that automatically fits as many 220px-minimum columns as will comfortably fit the screen width, reflowing to fewer columns on smaller screens -- often achieving a fully responsive card grid with zero media queries at all. We'll build on this in Section 9.

## 8.5 Flexbox vs Grid -- Which One Do You Actually Use?

| Use Flexbox when... | Use Grid when... |
|---|---|
| Arranging items in ONE direction (a row or a column) | Arranging items in BOTH rows and columns at once |
| Building a navbar, a button group, a list of tags | Building an overall page layout or a photo gallery grid |
| Item sizes should adapt to content | You want precise control over rows and columns together |

:::insight
**The honest answer**
In real projects you use both, together. Grid is very common for the page's overall skeleton (header/sidebar/main/footer), while Flexbox is used constantly inside individual components (a navbar's items, a card's internal content). Neither replaces the other.
:::

:::mistake
**Common mistakes to avoid**
1) Confusing fr units with percentages -- 1fr means 'one share of the remaining free space', not '1% of the container'.
2) Forgetting that grid-template-areas requires every row to have the same number of named cells, including repeated names for spanning.
3) Using Grid for a simple single-row navbar when Flexbox would be simpler and more appropriate.
:::

:::challenge
**Practice Exercise 8.1**
1) Build a full page layout (sidebar, header, main, footer) using grid-template-areas.
2) Build a responsive photo gallery using repeat(auto-fit, minmax(200px, 1fr)).
3) Rebuild your resume page's Projects section as a responsive grid of project cards using CSS Grid.
:::

:::challenge
**Quick Quiz -- Section 8**
Q1) What's the fundamental difference between Flexbox and Grid?
Q2) What does 'fr' mean in grid-template-columns: 1fr 2fr?
Q3) In real projects, do you typically use Flexbox OR Grid, or both together?
:::
`,
  9: `# 9. Responsive Design & Media Queries

:::definition
A responsive website automatically adapts its layout, sizing, and content arrangement based on the screen size it's being viewed on -- a phone, a tablet, or a desktop monitor -- using a single codebase, rather than building entirely separate 'mobile' and 'desktop' websites.
:::

:::scenario
**Real-time use case**
Every time you visit a website on your phone and the navigation menu collapses into a hamburger icon, and columns that sat side-by-side on your laptop stack vertically instead -- that is responsive design at work, and it's mandatory for every frontend developer today, since most web traffic worldwide now comes from mobile devices.
:::

## 9.1 Media Queries -- The Core Tool

\`\`\`css
/* Base styles apply to ALL screen sizes by default (mobile-first) */
.container {
  display: flex;
  flex-direction: column;   /* stacked on mobile */
  padding: 16px;
}
/* Applies ONLY when the screen is 768px wide or more (tablets and up) */
@media (min-width: 768px) {
  .container {
    flex-direction: row;    /* side-by-side on larger screens */
    padding: 32px;
  }
}
/* Applies ONLY when the screen is 1024px wide or more (desktops) */
@media (min-width: 1024px) {
  .container {
    padding: 64px;
  }
}
\`\`\`

![Figure 9: common responsive breakpoints, mobile-first](/CSS_images/image_9.png)

**Figure 9** — common responsive breakpoints, mobile-first

## 9.2 Mobile-First vs Desktop-First

:::note
**Mobile-first (the modern, recommended approach)**
You write your DEFAULT/base CSS for small mobile screens first, then use @media (min-width: ...) queries to progressively ADD complexity as the screen gets bigger. This forces you to prioritize essential content first, and matches how most users actually experience the modern web.
:::

## 9.3 The viewport Meta Tag -- A Required Partner

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
\`\`\`

Without this tag, mobile browsers render your page at a fake 'desktop width' and then zoom out, making all your careful media query work completely useless. This tag must be present for responsive CSS to function correctly on real devices.

## 9.4 Responsive Images & Flexible Layouts

\`\`\`css
img {
  max-width: 100%;   /* image never overflows its container, shrinks on small screens */
  height: auto;       /* maintains aspect ratio automatically */
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}
\`\`\`

## 9.5 A Note on Container Queries (Modern CSS)

Media queries respond to the browser viewport's size. A newer feature, container queries, lets a component respond to the size of its own CONTAINER instead -- useful when the same card component might sit in a wide main area or a narrow sidebar:

\`\`\`css
.card-container {
  container-type: inline-size;
}
@container (min-width: 400px) {
  .card { display: flex; }
}
\`\`\`

This is a newer, increasingly well-supported CSS feature worth being aware of, even though media queries remain the primary responsive tool you'll use throughout this course.

## 9.6 A Complete Responsive Navbar Example

\`\`\`css
.navbar {
  display: flex;
  flex-direction: column;   /* stacked on mobile */
  gap: 12px;
  padding: 16px;
}
@media (min-width: 768px) {
  .navbar {
    flex-direction: row;      /* side-by-side on tablets/desktop */
    justify-content: space-between;
    align-items: center;
  }
}
\`\`\`

:::mistake
**Common mistakes to avoid**
1) Designing desktop-first and then trying to 'squeeze' everything down for mobile as an afterthought -- leads to messy, bug-prone CSS.
2) Forgetting the viewport meta tag, making all responsive work pointless on real devices.
3) Using fixed pixel widths on containers instead of max-width/percentages, causing horizontal scrollbars on small screens.
4) Only testing in a full desktop browser window and never resizing it or using DevTools' device toolbar (Ctrl+Shift+M in Chrome) to check real breakpoints.
:::

:::challenge
**Practice Exercise 9.1**
1) Build a landing page that is a single column on mobile, 2 columns on tablets, and 3-4 columns on desktop.
2) Make an existing navbar responsive: stacked on mobile, horizontal from 768px up.
3) Test your page by resizing your browser window from very narrow to very wide, confirming there's no horizontal scrollbar at any width.
:::

:::challenge
**Quick Quiz -- Section 9**
Q1) What does mobile-first mean when writing media queries?
Q2) What does max-width: 100% do on an image, and why does it matter?
Q3) Why must the viewport meta tag be present for responsive CSS to work?
:::
`,
  10: `# 10. Pseudo-classes & Pseudo-elements

## 10.1 Pseudo-classes -- Targeting an Element's State

:::definition
A pseudo-class selects an element based on a special STATE it's currently in (being hovered, being the first child, being checked) rather than its tag, class, or ID. Written with a single colon: selector:pseudo-class.
:::

\`\`\`css
a:hover { color: red; }              /* while the mouse is over the link */
button:active { transform: scale(0.97); } /* while being clicked */
input:focus { border-color: blue; }   /* while typing in the input */
input:checked + label { color: green; } /* when a checkbox/radio is ticked */
li:first-child { font-weight: bold; } /* the first <li> inside its parent */
li:last-child { border-bottom: none; }
li:nth-child(2) { background: #eee; } /* the 2nd child specifically */
li:nth-child(odd) { background: #f7f7f7; }  /* odd rows -- striped tables! */
input:disabled { opacity: 0.5; }
p:not(.highlight) { color: gray; }    /* everything EXCEPT elements with this class */
\`\`\`

:::scenario
**Real-time use case**
Every button that visibly changes color when hovered, every striped table with alternating row colors (nth-child(odd)), and every login input that glows blue when clicked into -- all built with pseudo-classes, with zero JavaScript required.
:::

## 10.2 Pseudo-elements -- Targeting a Part of an Element

:::definition
A pseudo-element lets you style a specific part of an element, or even insert generated content that doesn't exist in your HTML at all. Written with a double colon: selector::pseudo-element.
:::

\`\`\`css
p::first-line { font-weight: bold; }  /* styles just the first line */
p::first-letter { font-size: 2em; }    /* a large drop-cap first letter */
.required::after {
  content: " *";       /* inserts content that doesn't exist in the HTML */
  color: red;
}
.quote::before {
  content: "\\201C";     /* inserts an opening quotation mark character */
}
::selection {
  background: yellow;   /* styles the highlighted text when a user selects it */
}
\`\`\`

:::scenario
**Real-time use case**
That small red asterisk after 'Email *' on a required form field is almost always inserted using ::after { content: " *"; } in real projects, rather than being typed directly into the HTML -- this keeps the HTML clean and the styling/content decision in CSS.
:::

## 10.3 nth-child Formulas -- Beyond odd/even

\`\`\`css
li:nth-child(3) { color: red; }        /* exactly the 3rd child */
li:nth-child(3n) { color: blue; }       /* every 3rd child: 3, 6, 9... */
li:nth-child(3n+1) { color: green; }    /* 1st, 4th, 7th... */
li:nth-child(-n+3) { font-weight: bold; } /* only the FIRST 3 children */
li:nth-last-child(2) { color: orange; } /* 2nd from the END */
\`\`\`

nth-child(-n+3) is a genuinely useful pattern: 'style only the first 3 items' -- common for featured products, top rankings, or highlighted list items, without needing to add a class to each one manually.

## 10.4 A Complete Worked Example -- A Styled Card with Hover

\`\`\`css
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.card:hover {
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  transform: translateY(-4px);
}
.card:first-child {
  border-color: #0b3d91;
}
\`\`\`

:::mistake
**Common mistakes to avoid**
1) Confusing pseudo-class (:hover, single colon, targets STATE) with pseudo-element (::after, double colon, targets a PART/inserted content).
2) Forgetting that ::before/::after require a 'content' property to actually appear, even if it's just an empty string.
3) Using :nth-child incorrectly -- it counts ALL children of the parent, not just children of the same tag type (use :nth-of-type for that distinction).
:::

:::challenge
**Practice Exercise 10.1**
1) Add a :hover effect with a smooth appearance to every button and nav link on a page.
2) Style every input's :focus state with a distinct border color.
3) Use nth-child(odd)/(even) to stripe a table.
4) Add a red asterisk after any 'required' form label using ::after and content.
:::

:::challenge
**Quick Quiz -- Section 10**
Q1) What's the syntax difference between a pseudo-class and a pseudo-element?
Q2) Which pseudo-class styles every other row in a table?
Q3) What's required for ::before/::after to actually render?
:::
`,
  11: `# 11. Transitions & Animations

## 11.1 Transitions -- Smooth Changes Between States

:::definition
A transition makes a property change happen smoothly over time instead of instantly -- e.g. a color fading in, or a box smoothly growing, instead of snapping abruptly.
:::

\`\`\`css
.button {
  background-color: #0b3d91;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.button:hover {
  background-color: #3b6fd6;
  transform: translateY(-2px);
}
\`\`\`

- property -- which property to animate (or 'all' for every property)
- duration -- how long the change takes (e.g. 0.3s)
- timing-function -- the pace of change: ease, linear, ease-in, ease-out, ease-in-out

## 11.2 The transform Property

![Figure 10: transform functions -- translate, rotate, scale, skew](/CSS_images/image_10.png)

**Figure 10** — transform functions -- translate, rotate, scale, skew

\`\`\`css
.box {
  transform: translate(20px, 10px);   /* moves the element */
}
.box-rotated {
  transform: rotate(15deg);            /* spins the element */
}
.box-scaled {
  transform: scale(1.1);               /* resizes the element (1.1 = 110%) */
}
.box-combined {
  transform: translate(20px, 0) rotate(15deg) scale(1.1);
  /* combine multiple transforms in one declaration -- applied left to right */
}
\`\`\`

transform (along with opacity) is specifically recommended for animations because the browser can animate them very efficiently using the GPU, resulting in much smoother motion than animating properties like width or top.

## 11.3 Animations -- Multi-Step Motion with @keyframes

:::definition
While transitions only handle a change between two states (normal -> hover), @keyframes animations let you define multiple steps across a timeline, and can even loop automatically without any user interaction at all.
:::

![Figure 11: @keyframes lets you define the element's state at any % point along the timeline](/CSS_images/image_11.png)

**Figure 11** — @keyframes lets you define the element's state at any % point along the timeline

\`\`\`css
@keyframes bounce {
  0%   { transform: translateY(0); }
  50%  { transform: translateY(-20px); }
  100% { transform: translateY(0); }
}
.icon {
  animation: bounce 1.5s ease-in-out infinite;
  /* name | duration | timing | iteration-count (infinite = loop) */
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.modal {
  animation: fadeIn 0.4s ease-out;
}
\`\`\`

:::scenario
**Real-time use case**
A 'new notification' bell icon that gently bounces, a loading spinner that rotates continuously, and a modal that fades in smoothly when opened -- all built with @keyframes animations.
:::

## 11.4 A Complete Worked Example -- A Loading Spinner

\`\`\`css
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #eee;
  border-top: 4px solid #0b3d91;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
\`\`\`

:::mistake
**Common mistakes to avoid**
1) Animating properties like 'width' or 'top' for performance-sensitive animations -- prefer transform and opacity, which are much smoother, especially on mobile.
2) Forgetting iteration-count: infinite when you actually want a continuous loop (like a spinner).
3) Making transitions too slow (over 0.5s) for hover effects -- users perceive this as sluggish rather than smooth.
:::

:::challenge
**Practice Exercise 11.1**
1) Add a smooth hover transition (color + slight lift with translateY) to every button and card on a page.
2) Build the loading spinner example above from scratch.
3) Build a @keyframes animation that makes a logo or icon pulse or bounce infinitely.
4) Build a fade-in animation for a modal or alert box.
:::

## 11.5 Common Animation Recipes (Copy-Paste Reference)

### Shake (for form validation errors)

\`\`\`css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}
.input-error {
  animation: shake 0.3s ease-in-out;
  border-color: red;
}
\`\`\`

### Skeleton Loading Pulse

\`\`\`css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.skeleton {
  background: #e0e0e0;
  border-radius: 4px;
  animation: pulse 1.5s ease-in-out infinite;
}
\`\`\`

This is exactly the grey pulsing placeholder blocks you see on sites like YouTube or LinkedIn while real content is still loading -- a skeleton screen, built entirely with a simple opacity keyframe animation.

### Slide-In Notification

\`\`\`css
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}
.toast {
  animation: slideIn 0.3s ease-out;
}
\`\`\`

:::challenge
**Quick Quiz -- Section 11**
Q1) What CSS property makes a hover color change happen smoothly instead of instantly?
Q2) Which two CSS properties are recommended for the smoothest possible animations?
Q3) What does iteration-count: infinite do?
:::
`,
  12: `# 12. CSS Variables, Sass Basics & Utility Frameworks

## 12.1 CSS Custom Properties (CSS Variables)

:::definition
CSS custom properties ('CSS variables') let you define a reusable value once and reference it everywhere, so changing one line updates every place that value is used. This is native, modern CSS -- no build tool required.
:::

\`\`\`javascript
:root {
  --primary-color: #0b3d91;
  --secondary-color: #3b6fd6;
  --spacing-unit: 16px;
  --font-heading: "Poppins", sans-serif;
}
.button {
  background-color: var(--primary-color);
  padding: var(--spacing-unit);
  font-family: var(--font-heading);
}
.button:hover {
  background-color: var(--secondary-color);
}
\`\`\`

:::scenario
**Real-time use case**
Every real company's design system (a consistent set of colors, spacing, and fonts reused across the entire product) is implemented using CSS variables just like this, defined once in :root. This is also exactly how dark mode toggles are commonly implemented, by swapping variable values based on a class on the body.
:::

## 12.2 A First Look at Sass/SCSS

:::definition
Sass (.scss files) is a preprocessor -- a language that compiles down into regular CSS, but gives you programming features CSS alone doesn't have: nesting, variables (predating native CSS variables), reusable mixins, and splitting styles across files.
:::

\`\`\`css
// SCSS variables
$primary-color: #0b3d91;
$spacing: 16px;
// Nesting -- write related selectors inside their parent
.navbar {
  background: $primary-color;
  padding: $spacing;
  a {                    // compiles to: .navbar a { ... }
    color: white;
    &:hover {             // compiles to: .navbar a:hover { ... }
      color: lightblue;
    }
  }
}
// Mixins -- reusable groups of declarations
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.card {
  @include flex-center;
}
\`\`\`

## 12.3 Worked Example: A Dark Mode Toggle Using Variables

CSS variables make dark mode remarkably simple -- no duplicated stylesheets needed, just different variable values swapped based on a class:

\`\`\`javascript
:root {
  --bg: #ffffff;
  --text: #1a1a1a;
  --card-bg: #f7f9fd;
}
body.dark-mode {
  --bg: #121212;
  --text: #eaeaea;
  --card-bg: #1e1e1e;
}
body {
  background: var(--bg);
  color: var(--text);
  transition: background 0.3s ease, color 0.3s ease;
}
.card {
  background: var(--card-bg);
}
\`\`\`

Every element referencing var(--bg), var(--text), etc. updates automatically the instant the dark-mode class is toggled on the body -- typically done with a small amount of JavaScript (which we'll cover next week) that just adds or removes that one class.

## 12.4 A Naming Convention Worth Knowing: BEM

:::definition
BEM (Block, Element, Modifier) is a popular class-naming convention that keeps large stylesheets organized and predictable: Block (a standalone component), Element (a part of that block), Modifier (a variation of a block or element).
:::

\`\`\`html
<!-- Block: card -->
<!-- Element: card__title, card__button -->
<!-- Modifier: card--featured -->
<div class="card card--featured">
  <h3 class="card__title">Featured Product</h3>
  <button class="card__button card__button--primary">Buy Now</button>
</div>
\`\`\`

\`\`\`javascript
.card { padding: 20px; border-radius: 8px; }
.card--featured { border: 2px solid var(--primary); }
.card__title { font-size: 1.2rem; margin-bottom: 8px; }
.card__button { padding: 10px 20px; }
.card__button--primary { background: var(--primary); color: white; }
\`\`\`

BEM's double-underscore (__) and double-hyphen (--) naming makes it instantly clear, just from a class name, whether you're looking at a standalone component, a piece of it, or a variation -- extremely useful once stylesheets grow beyond a handful of files.

## 12.5 Utility-First Frameworks: Tailwind CSS

:::definition
Tailwind CSS is a utility-first CSS framework: instead of writing custom CSS classes yourself, you apply small, single-purpose utility classes directly in your HTML (p-4 for padding, flex for display:flex, text-blue-600 for a specific blue). It's extremely popular in modern React projects, which is exactly where we'll use it starting Month 2.
:::

\`\`\`html
<!-- Traditional CSS approach -->
<button class="btn-primary">Click Me</button>
<style>
  .btn-primary { padding: 12px 24px; background: #0b3d91;
    color: white; border-radius: 8px; }
</style>
<!-- Tailwind CSS approach: styling written directly as classes -->
<button class="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-700">
  Click Me
</button>
\`\`\`

| Approach | Philosophy |
|---|---|
| Traditional CSS / Sass | Write custom, semantically-named classes and define their styles separately |
| Tailwind (utility-first) | Compose pre-made utility classes directly in HTML/JSX; rarely write custom CSS |
| Bootstrap (component-based) | Use pre-built, ready-made components (buttons, navbars, cards) with a default look |

:::insight
**Why this matters for your MERN journey**
This course primarily uses hand-written CSS to build your fundamentals properly, then introduces Tailwind CSS once React starts in Month 2 -- and understanding the box model, Flexbox and Grid deeply is exactly what makes Tailwind's utility classes make sense immediately instead of feeling like a random list of shortcuts to memorize.
:::

:::mistake
**Common mistakes to avoid**
1) Jumping straight to Tailwind/Bootstrap without understanding the underlying CSS -- you'll be stuck when a utility class doesn't do exactly what you need.
2) Over-nesting in Sass (more than 3 levels deep) which produces overly-specific, hard-to-override CSS output.
3) Hardcoding colors/spacing repeatedly instead of defining CSS variables once at the start of a project.
:::

:::challenge
**Practice Exercise 12.1**
1) Refactor an existing stylesheet to define all colors, spacing values, and fonts as CSS custom properties in :root, then reference them everywhere instead of raw values.
2) (Optional) Install Sass and rewrite one component's CSS as a .scss file using nesting and a variable.
3) Browse the Tailwind CSS documentation for 10 minutes and identify 5 utility classes you can already guess the meaning of.
:::

:::challenge
**Quick Quiz -- Section 12**
Q1) How do you define and use a CSS custom property?
Q2) Name two features Sass provides that plain CSS traditionally lacked.
Q3) What does 'utility-first' mean in the context of Tailwind CSS?
:::
`,
  13: `# 13. Building a Fully Styled Multi-Page Website Step by Step

Let's style the Sunrise Bakery site from the HTML guide, one piece at a time, exactly the way you'd approach styling a real project from scratch.

## 13.1 Step 1: The CSS Reset & Variables

\`\`\`javascript
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
:root {
  --primary: #b5651d;
  --secondary: #f4e4c1;
  --text: #333;
  --spacing: 16px;
  --radius: 8px;
}
body {
  font-family: "Poppins", sans-serif;
  color: var(--text);
  line-height: 1.6;
}
\`\`\`

## 13.2 Step 2: Styling the Header & Nav

\`\`\`javascript
header {
  background: var(--primary);
  color: white;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}
header img { width: 60px; border-radius: 50%; }
header h1 { font-size: 1.8rem; }
nav {
  display: flex;
  gap: 24px;
  padding: 16px 24px;
  background: var(--secondary);
}
nav a {
  text-decoration: none;
  color: var(--text);
  font-weight: 600;
  transition: color 0.2s ease;
}
nav a:hover { color: var(--primary); }
\`\`\`

## 13.3 Step 3: Styling the Home Page Content

\`\`\`javascript
main {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing);
}
figure {
  margin: 24px 0;
  text-align: center;
}
figure img {
  max-width: 100%;
  border-radius: var(--radius);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
figcaption {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #777;
}
\`\`\`

## 13.4 Step 4: Styling the Menu Table

\`\`\`javascript
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}
th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
th {
  background: var(--primary);
  color: white;
}
tr:hover { background: var(--secondary); }
\`\`\`

## 13.5 Step 5: Styling the Contact Form

\`\`\`javascript
form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}
label { font-weight: 600; }
input, textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: var(--radius);
  font-family: inherit;
}
input:focus, textarea:focus {
  outline: none;
  border-color: var(--primary);
}
button {
  padding: 12px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: background 0.2s ease;
}
button:hover { background: #8a4b16; }
\`\`\`

## 13.6 Step 6: Making It Responsive

\`\`\`css
@media (max-width: 600px) {
  header { flex-direction: column; text-align: center; }
  nav { flex-direction: column; gap: 12px; }
  main { padding: 12px; }
}
\`\`\`

:::challenge
**Practice Project 13.1**
1) Apply every step above to your own copy of the bakery site (or any multi-page site you built in the HTML guide).
2) Verify it looks correct at mobile, tablet, and desktop widths.
3) Style the gallery.html and FAQ pages from the HTML guide's bonus projects using the same CSS variables for visual consistency across all pages.
:::

## 13.7 Bonus: Styling the FAQ Accordion

Recall the details/summary FAQ page from the HTML guide -- here's how to style it into something that looks genuinely polished:

\`\`\`javascript
details {
  background: white;
  border-radius: var(--radius);
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}
summary {
  font-weight: 600;
  cursor: pointer;
  list-style: none;   /* removes the default triangle marker */
}
summary::-webkit-details-marker { display: none; }
summary::after {
  content: "+";
  float: right;
  font-size: 1.4rem;
  color: var(--primary);
}
details[open] summary::after {
  content: "\\2212";   /* minus sign when expanded */
}
details p {
  margin-top: 12px;
  color: #555;
}
\`\`\`

The details[open] attribute selector lets you style an element differently based on its current open/closed state -- no JavaScript required, purely CSS reacting to the native HTML state.

## 13.8 Bonus: Styling the Pricing Table

\`\`\`javascript
table {
  width: 100%;
  border-collapse: collapse;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}
th {
  background: var(--primary);
  color: white;
  padding: 16px;
}
td {
  padding: 14px 16px;
  text-align: center;
  border-bottom: 1px solid #eee;
}
tr:last-child td { border-bottom: none; }
tr:hover td { background: var(--secondary-light, #f0f4ff); }
\`\`\`

:::challenge
**Quick Quiz -- Section 13**
Q1) Why define CSS variables in :root instead of repeating raw color values everywhere?
Q2) What does the details[open] selector let you do without JavaScript?
Q3) Why use border-collapse: collapse on a styled table?
:::
`,
  14: `# 14. Real-World CSS Patterns Explained

Let's analyze the CSS behind four extremely common real-world UI patterns.

## 14.1 Pattern: A Hero Section

\`\`\`css
.hero {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("banner.jpg");
  background-size: cover;
  background-position: center;
  color: white;
}
.hero h1 { font-size: 3rem; margin-bottom: 16px; }
.hero button {
  padding: 14px 32px;
  font-size: 1.1rem;
  border-radius: 999px;
  border: none;
  background: white;
  color: #0b3d91;
  cursor: pointer;
}
\`\`\`

The dark gradient layered over the background image (using two stacked linear-gradient colors) is a very common trick to ensure white text stays readable over any photo.

## 14.2 Pattern: A Modal / Popup Overlay

\`\`\`css
.overlay {
  position: fixed;
  inset: 0;   /* shorthand for top:0; right:0; bottom:0; left:0; */
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
.modal {
  background: white;
  padding: 32px;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  animation: fadeIn 0.3s ease-out;
}
\`\`\`

## 14.3 Pattern: A Card Grid

\`\`\`css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  padding: 24px;
}
.card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}
.card:hover { transform: translateY(-6px); }
.card img { width: 100%; display: block; }
.card-body { padding: 16px; }
\`\`\`

## 14.4 Pattern: A Sticky Footer Layout

\`\`\`css
html, body { height: 100%; }
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
main { flex: 1; }   /* pushes footer down even on short pages */
footer { padding: 24px; text-align: center; }
\`\`\`

This exact pattern solves the classic 'footer floating in the middle of the page on short-content pages' problem -- main takes up all remaining space, pushing footer to the true bottom regardless of content length.

## 14.5 Pattern: A Toggle Switch (No JavaScript)

\`\`\`javascript
.switch {
  position: relative;
  width: 50px;
  height: 26px;
}
.switch input { opacity: 0; width: 0; height: 0; }
.slider {
  position: absolute;
  inset: 0;
  background: #ccc;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.slider::before {
  content: "";
  position: absolute;
  width: 20px; height: 20px;
  left: 3px; top: 3px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s ease;
}
input:checked + .slider { background: var(--primary); }
input:checked + .slider::before { transform: translateX(24px); }
\`\`\`

This is a real, common pattern: a hidden checkbox input paired with a styled label/span that visually represents its checked state -- fully accessible and keyboard-operable since it's still a genuine checkbox underneath.

:::challenge
**Practice Exercise 14.1**
1) Build all five patterns above from scratch and combine them into a single landing page.
2) Identify one more UI pattern you use daily (a dropdown menu, a toast notification, a progress bar) and try building it yourself using what you've learned.
:::

## 14.6 Common Layout Recipes (Copy-Paste Reference)

A quick reference of layout problems every developer hits repeatedly, and the modern CSS solution for each.

### Perfectly Centering Anything

\`\`\`css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;   /* centers within the full viewport height */
}
\`\`\`

### Equal-Height Columns

\`\`\`css
.row {
  display: flex;   /* flex items are equal height by default (align-items: stretch) */
}
.column {
  flex: 1;
  padding: 20px;
}
\`\`\`

Before Flexbox, equal-height columns required JavaScript or hacky float tricks -- it's now the default behavior of any flex container.

### The 'Holy Grail' Layout (Header, Footer, Sidebar, Main)

\`\`\`css
.holy-grail {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "nav main aside"
    "footer footer footer";
  min-height: 100vh;
}
header { grid-area: header; }
nav    { grid-area: nav; }
main   { grid-area: main; }
aside  { grid-area: aside; }
footer { grid-area: footer; }
\`\`\`

This classic layout name comes from how notoriously difficult it was to build reliably before CSS Grid -- now it's a handful of readable lines.

### Full-Bleed Section Inside a Constrained Container

\`\`\`css
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 16px;
}
.full-bleed {
  width: 100vw;
  margin-left: calc(-50vw + 50%);   /* breaks out of the parent's max-width */
}
\`\`\`

Common on blog/article pages where body text stays narrow and readable, but an occasional full-width image should stretch edge to edge.

:::challenge
**Quick Quiz -- Section 14**
Q1) Why is a dark gradient often layered over a hero background image?
Q2) What does inset: 0; do as a shorthand?
Q3) How does the toggle switch pattern stay accessible despite being purely CSS-styled?
:::
`,
  15: `# 15. Frequently Asked Interview Questions

Practice explaining each answer out loud, in your own words -- not just reading it silently.

Q1. What is the CSS box model?

Every element is a rectangular box made of content, padding, border, and margin, from the inside out. box-sizing: border-box makes width/height include padding and border for predictable sizing.

Q2. What is CSS specificity?

The set of rules the browser uses to decide which CSS rule wins when multiple rules target the same element. Order (lowest to highest): element/pseudo-element, class/attribute/pseudo-class, id, inline style, !important.

Q3. What's the difference between em and rem?

em is relative to the parent element's font-size and compounds when nested; rem is always relative to the root (html) element's font-size, making it more predictable.

Q4. What's the difference between Flexbox and CSS Grid?

Flexbox arranges items in one direction (a row or column); Grid arranges items in two dimensions (rows and columns simultaneously). Real projects commonly use both together.

Q5. What does box-sizing: border-box do?

Makes width and height include padding and border, instead of adding them on top of the specified size -- resulting in more predictable element sizing.

Q6. What is the difference between position: absolute and position: fixed?

absolute positions relative to the nearest non-static ancestor and scrolls with the page; fixed positions relative to the browser window and stays in place even when scrolling.

Q7. Why does z-index sometimes not work?

z-index only has an effect on elements with a position value other than static (relative, absolute, fixed, or sticky).

Q8. What is the difference between a pseudo-class and a pseudo-element?

A pseudo-class (single colon, e.g. :hover) targets an element's state. A pseudo-element (double colon, e.g. ::after) targets a specific part of an element or inserts generated content.

Q9. What's the difference between visibility: hidden and display: none?

display: none removes the element entirely, including its space in the layout. visibility: hidden hides the element visually but still reserves its layout space.

Q10. What is a media query, and what does mobile-first mean?

A media query applies CSS conditionally based on screen characteristics like width. Mobile-first means writing base styles for small screens first, then adding complexity for larger screens with min-width queries.

Q11. What are CSS custom properties (variables) and why use them?

Reusable values defined with --name and used with var(--name). They let you change one value in one place (e.g. :root) to update it everywhere it's used, essential for maintainable design systems.

Q12. What's the difference between inline, block, and inline-block?

Block elements start on a new line and fill available width. Inline elements flow within text and ignore width/height. inline-block flows inline but still respects width, height, and vertical margin/padding.

Q13. How would you center a div both horizontally and vertically?

The modern approach: display: flex; justify-content: center; align-items: center; on the parent container.

Q14. What is the CSS cascade?

The algorithm browsers use to combine style rules from multiple sources (browser defaults, external stylesheets, inline styles) and resolve conflicts using specificity and source order.

Q15. Why should you avoid using !important?

It overrides normal specificity rules entirely, making CSS much harder to debug and override later -- a sign of an unresolved specificity problem rather than a real solution.

Q16. How would you implement a dark mode toggle using CSS?

Define theme colors as CSS custom properties in :root, then override those same variable names inside a class like body.dark-mode with different values -- toggling the class (via JavaScript) instantly updates every element referencing those variables.

Q17. What's the difference between relative and absolute units, and when would you choose one over the other?

Absolute units (px) never scale; relative units (%, em, rem, vw/vh) scale based on a parent, the root, or the viewport. Relative units are generally preferred for responsive, accessible layouts.

Q18. What does the CSS Reset / Normalize approach solve?

Different browsers apply different default margins, paddings, and font sizes to elements. A reset (like * { margin: 0; padding: 0; box-sizing: border-box; }) or a normalize stylesheet removes these inconsistencies so your layout behaves predictably across browsers.
`,
  16: `# 16. Glossary of Key Terms

A fast, alphabetical lookup of every important term used throughout this document.

Breakpoint -- A specific screen width at which a media query changes the page's layout.

Cascade -- The algorithm the browser uses to resolve conflicting CSS rules, based on specificity and source order.

CSSOM -- CSS Object Model -- the browser's in-memory tree representation of parsed CSS rules.

Custom property (CSS variable) -- A reusable value defined with --name and referenced with var(--name).

Declaration -- A single property:value pair inside a CSS rule, e.g. color: red;

Flex container -- An element with display: flex, whose direct children become flex items.

Flexbox -- A one-dimensional CSS layout system for arranging items in a row or column.

fr unit -- A fraction of the remaining free space in a CSS Grid container.

Gradient -- A smooth transition between two or more colors, created with linear-gradient() or radial-gradient().

Grid container -- An element with display: grid, whose direct children become grid items.

Keyframes -- A set of style rules defining an animation's appearance at specific points along its timeline.

Media query -- A CSS rule that applies conditionally based on screen characteristics like width.

Mobile-first -- A design approach where base styles target small screens, enhanced for larger screens via min-width queries.

Pseudo-class -- A selector targeting an element's state, e.g. :hover, written with a single colon.

Pseudo-element -- A selector targeting part of an element or inserting generated content, e.g. ::after, written with a double colon.

Responsive design -- Designing a page to adapt its layout to different screen sizes using a single codebase.

Sass/SCSS -- A CSS preprocessor adding nesting, variables, and mixins, compiled down to plain CSS.

Selector -- The part of a CSS rule that determines which HTML element(s) the rule applies to.

Specificity -- The set of rules the browser uses to decide which of several conflicting CSS rules wins.

Transition -- A smooth, animated change of a CSS property's value over a set duration.

Utility-first CSS -- An approach (e.g. Tailwind CSS) using small, single-purpose classes composed directly in HTML.

Viewport -- The visible area of a webpage on a device's screen.

z-index -- A property controlling the stacking order of overlapping positioned elements.

Attribute selector -- A selector targeting elements based on a specific attribute or its value, e.g. input[type="email"].

Combinator -- A symbol (space, >, +, ~) describing the relationship between two selectors, e.g. descendant or direct child.

Computed value -- The final resolved value of a CSS property after the cascade and inheritance have been applied.

Design system -- A consistent, reusable set of colors, spacing, and typography rules applied across an entire product.

Inheritance -- The mechanism by which some CSS properties (like color and font-family) automatically pass from parent to child elements.

Preprocessor -- A tool (like Sass) that compiles an enhanced syntax down into plain CSS before it reaches the browser.

Reset CSS -- A small set of rules (like box-sizing and margin/padding zeroing) applied at the start of a project to normalize browser defaults.
`,
  17: `# 17. Do's and Don'ts + Debugging Checklist

## 17.1 Master Do's and Don'ts

| Do | Don't |
|---|---|
| Use external stylesheets | Use inline styles in real projects |
| Start every project with a CSS reset + box-sizing: border-box | Assume default box-sizing behaves predictably |
| Use classes for reusable styles | Overuse IDs for styling |
| Use rem for font-size and spacing | Use px for everything |
| Use Flexbox/Grid for layout | Use floats or tables for page layout |
| Use CSS variables for colors/spacing | Hardcode the same value everywhere |
| Design mobile-first | Design desktop-first and squeeze down |
| Use transition/animation with transform & opacity | Animate width/top for performance-sensitive motion |

## 17.2 Debugging Your CSS

- Use Chrome DevTools (F12) -- the Elements tab's Styles panel shows every rule applying to an element, including ones being overridden (shown with a strikethrough)
- Check the box model diagram in DevTools' Styles panel to see exact computed padding/border/margin values
- Use the 'Computed' tab to see the final resolved value of any property after the cascade has been applied
- Temporarily add a bright background-color (like red) to an element to understand exactly where its box boundaries are
- Comment out CSS rules one at a time to isolate which rule is causing an unexpected layout issue

## 17.3 A Before/After Mistakes Gallery

### Missing box-sizing reset

Before (incorrect):

\`\`\`css
.card {
  width: 300px;
  padding: 20px;
  border: 2px solid black;
}
\`\`\`

After (correct):

\`\`\`css
* { box-sizing: border-box; }
.card {
  width: 300px;
  padding: 20px;
  border: 2px solid black;
}
\`\`\`

### Overusing !important

Before (incorrect):

\`\`\`css
.title {
  color: blue !important;
}
\`\`\`

After (correct):

\`\`\`css
/* Fix the actual specificity conflict instead */
#page .title {
  color: blue;
}
\`\`\`

### z-index with no position

Before (incorrect):

\`\`\`css
.badge {
  z-index: 10;
}
\`\`\`

After (correct):

\`\`\`css
.badge {
  position: relative;
  z-index: 10;
}
\`\`\`

### Absolute positioning without a relative parent

Before (incorrect):

\`\`\`css
.card { /* no position set */ }
.badge { position: absolute; top: 8px; right: 8px; }
\`\`\`

After (correct):

\`\`\`css
.card { position: relative; }
.badge { position: absolute; top: 8px; right: 8px; }
\`\`\`

### Fixed pixel widths breaking mobile

Before (incorrect):

\`\`\`css
.container {
  width: 1200px;
}
\`\`\`

After (correct):

\`\`\`css
.container {
  max-width: 1200px;
  width: 100%;
}
\`\`\`

### Animating expensive properties

Before (incorrect):

\`\`\`css
.box {
  transition: width 0.3s, top 0.3s;
}
\`\`\`

After (correct):

\`\`\`css
.box {
  transition: transform 0.3s, opacity 0.3s;
}
\`\`\`

### Forgetting units on non-zero values

Before (incorrect):

\`\`\`css
.box {
  margin-top: 20;
}
\`\`\`

After (correct):

\`\`\`css
.box {
  margin-top: 20px;
}
\`\`\`

### Nesting Sass too deeply

Before (incorrect):

\`\`\`css
.page {
  .header {
    .nav {
      .link {
        &:hover { color: red; }
      }
    }
  }
}
\`\`\`

After (correct):

\`\`\`css
.nav-link {
  &:hover { color: red; }
}
\`\`\`

### Fighting specificity with more specificity

Before (incorrect):

\`\`\`css
div.container ul.list li.item a.link {
  color: blue;
}
\`\`\`

After (correct):

\`\`\`css
.list-link {
  color: blue;
}
\`\`\`

### Forgetting flex-wrap on a row that can overflow

Before (incorrect):

\`\`\`css
.tags {
  display: flex;
  gap: 8px;
}
\`\`\`

After (correct):

\`\`\`css
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
\`\`\`
`,
  18: `# 18. Complete Practice Example -- Everything Combined

This single stylesheet uses almost every concept from this document together: variables, box model, Flexbox, Grid, pseudo-classes, transitions, and responsive media queries. Apply it to the resume.html from the HTML guide.

\`\`\`javascript
* { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --primary: #0b3d91;
  --secondary: #3b6fd6;
  --bg: #f7f9fd;
  --text: #333;
  --radius: 10px;
  --spacing: 16px;
}
body {
  font-family: "Poppins", sans-serif;
  line-height: 1.6;
  color: var(--text);
  background: var(--bg);
}
header {
  background: linear-gradient(to right, var(--primary), var(--secondary));
  color: white;
  padding: 48px 24px;
  text-align: center;
}
nav {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 16px;
  background: white;
  position: sticky;
  top: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}
nav a {
  text-decoration: none;
  color: var(--primary);
  font-weight: 600;
  transition: color 0.2s ease;
}
nav a:hover { color: var(--secondary); }
main {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing);
}
section { margin-bottom: 48px; }
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}
.project-card {
  background: white;
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  transition: transform 0.2s ease;
}
.project-card:hover { transform: translateY(-6px); }
form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}
input, textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: var(--radius);
}
input:focus, textarea:focus {
  outline: none;
  border-color: var(--primary);
}
button {
  padding: 12px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: background 0.2s ease;
}
button:hover { background: var(--secondary); }
footer {
  text-align: center;
  padding: 24px;
  color: #777;
}
@media (max-width: 600px) {
  nav { flex-direction: column; gap: 12px; }
  header { padding: 32px 16px; }
}
\`\`\`

:::note
**Self-review checklist before you consider a stylesheet 'done'**
Is box-sizing: border-box applied globally? Are colors/spacing defined as CSS variables instead of repeated raw values? Does the layout use Flexbox/Grid instead of floats or tables? Is there at least one working media query? Do interactive elements (links, buttons, inputs) have hover/focus states? Does the page look correct from 320px to 1920px wide with no horizontal scrollbar?
:::

:::challenge
**Final Practice Project**
Take any complete HTML page you built in the HTML guide and fully style it using everything from this document: CSS variables, the box model, Flexbox and/or Grid for layout, pseudo-classes for interactivity, at least one animation, and full responsiveness across mobile/tablet/desktop. This single project demonstrates mastery of everything in this document.
:::
`,
  19: `# 19. Quick Reference Cheat Sheet

A fast lookup table of every property covered in this document, grouped by category.

## Selectors

| Selector | Targets |
|---|---|
| \`element\` | All elements of that tag |
| \`.class\` | All elements with that class |
| \`#id\` | The one element with that id |
| \`a, b\` | Both a and b |
| \`a b\` | b anywhere inside a (descendant) |
| \`a > b\` | b that is a direct child of a |
| \`a:hover\` | a while in a specific state |
| \`a::after\` | Generated content after a |

## Box Model

| Property | Purpose |
|---|---|
| \`width\` / \`height\` | Content size |
| \`padding\` | Space inside the border |
| \`border\` | Line around the padding |
| \`margin\` | Space outside the border |
| \`box-sizing: border-box\` | Makes width/height include padding+border |

## Colors & Units

| Value | Purpose |
|---|---|
| \`#hex\` / \`rgb()\` / \`rgba()\` | Color formats; rgba adds transparency |
| \`px\` | Fixed pixels |
| \`%\` | Relative to parent |
| \`rem\` | Relative to root font-size (preferred) |
| \`vw\` / \`vh\` | Relative to viewport width/height |

## Typography

| Property | Purpose |
|---|---|
| \`font-family\` | Typeface, with fallbacks |
| \`font-size\` / \`font-weight\` | Text size / boldness |
| \`line-height\` | Spacing between lines |
| \`text-align\` | Horizontal text alignment |

## Layout

| Property | Purpose |
|---|---|
| \`display: flex\` | One-dimensional layout |
| \`justify-content\` / \`align-items\` | Main axis / cross axis alignment |
| \`display: grid\` | Two-dimensional layout |
| \`grid-template-columns/rows\` | Define grid tracks |
| \`position\` | static/relative/absolute/fixed/sticky |
| \`z-index\` | Stacking order (needs a non-static position) |

## Visual Effects

| Property | Purpose |
|---|---|
| \`background\` | Color, image, or gradient |
| \`border-radius\` | Rounded corners |
| \`box-shadow\` | Drop shadow |
| \`transition\` | Smooth property change on state change |
| \`transform\` | translate/rotate/scale/skew |
| \`@keyframes\` / \`animation\` | Multi-step, loopable animation |

## Responsive

| Tool | Purpose |
|---|---|
| \`@media (min-width: ...)\` | Apply CSS conditionally by screen size |
| \`max-width: 100%\` on img | Prevent image overflow |
| \`repeat(auto-fit, minmax(...))\` | Auto-responsive grid columns |

## Pseudo-classes & Pseudo-elements

| Selector | Purpose |
|---|---|
| \`:hover\` / \`:focus\` / \`:active\` | Mouse hover / keyboard focus / being clicked |
| \`:first-child\` / \`:last-child\` | First / last child of its parent |
| \`:nth-child(n)\` | Match children by formula (odd, even, 3n...) |
| \`:checked\` / \`:disabled\` | A checked input / a disabled field |
| \`::before\` / \`::after\` | Insert generated content |
| \`::first-line\` / \`::first-letter\` | Style just the first line/letter of text |

## Variables, Sass & Naming

| Concept | Purpose |
|---|---|
| \`--name: value;\` / \`var(--name)\` | Define / use a CSS custom property |
| \`$name: value;\` (Sass) | Define a Sass variable |
| \`&:hover\` (Sass) | Reference the parent selector while nesting |
| BEM naming (\`block__element--modifier\`) | Predictable, scalable class naming convention |
`,
  20: `# 20. Practice Question Bank

## A large set of short-answer questions, organized by topic, for focused revision.

## 20.1 Basics & Selectors

## 1. Question

## Fill in the blank: To select an element by class, prefix the class name with ______.

## Answer: . (dot)

## Explanation: In CSS, a class selector starts with a dot (.). For example:

## .text {

## color: red;

## }

## This selects all elements having class="text".

## 2. Question

## True or False: An ID selector can be reused on multiple elements.

## Answer: False.

## Explanation: An ID should be unique within a webpage. It is normally used for one specific element.

## <p id="title">Hello</p>

## If the same styling is needed for multiple elements, use a class instead.

## 3. Question

## Write a selector targeting only <a> tags directly inside a <nav>.

## Answer:

## nav > a {

## }

## Explanation: The > symbol is the child combinator. It selects only <a> elements that are direct children of <nav>.

## <nav>

## <a>Home</a>

## <a>About</a>

## </nav>

## 4. Question

## Which wins: p { color: blue; } or .text { color: red; } on a <p class="text">?

## Answer: .text { color: red; } wins.

## Explanation: A class selector has higher specificity than an element selector.

## p → element selector

## .text → class selector

## Therefore, the text will be red.

## 5. Question

## What are the three ways to add CSS to a page?

## Answer:

## Inline CSS

## Internal CSS

## External CSS

## Explanation:

## Inline CSS:

## <p style="color: red;">Hello</p>

## Internal CSS:

## <style>

## p {

## color: red;

## }

## </style>

## External CSS:

## <link rel="stylesheet" href="style.css">

## External CSS is generally preferred for larger projects because it keeps HTML and CSS separate.

## 20.2 Box Model & Units

## 1. Question

## List the four layers of the box model, from inside out.

## Answer: Content → Padding → Border → Margin

## Explanation: The CSS box model describes how space is calculated around an element.

## Content → actual text/image

## Padding → space around the content

## Border → line surrounding the padding

## Margin → space outside the border

## 2. Question

## What does box-sizing: border-box change?

## Answer:

## box-sizing: border-box;

## It makes the declared width and height include the content, padding, and border.

## Explanation: For example:

## .box {

## width: 300px;

## padding: 20px;

## border: 5px solid black;

## box-sizing: border-box;

## }

## The total width remains 300px, instead of becoming larger because of padding and border.

## 3. Question

## Which unit is relative to the root element's font-size?

## Answer: rem

## Explanation: rem means root em and is relative to the font size of the <html> element.

## For example, if the root font size is 16px:

## font-size: 2rem;

## means:

## 2 × 16px = 32px

## 4. Question

## Write CSS giving a box 20px padding and a 2px solid black border.

## Answer:

## .box {

## padding: 20px;

## border: 2px solid black;

## }

## Explanation: padding: 20px adds 20px of space inside the element, while border creates a 2px solid black boundary around it.

## 5. Question

## What's the difference between margin and padding?

## Answer: Padding is inside the element; margin is outside the element.

## Explanation:

## Margin

## ↓

## [ Border

## [ Padding

## [ Content ]

## ]

## ]

## Padding creates space between the content and border. Margin creates space between the element and surrounding elements.

## 20.3 Layout: Flexbox & Grid

## 1. Question

## Which display value enables Flexbox?

## Answer:

## display: flex;

## Explanation: When display: flex is applied to a container, its direct children become flex items.

## 2. Question

## Which property centers flex items along the main axis?

## Answer:

## justify-content: center;

## Explanation: justify-content controls alignment along the main axis.

## For a normal row-based flex container:

## .container {

## display: flex;

## justify-content: center;

## }

## This centers the items horizontally.

## 3. Question

## Write a 3-column equal-width grid using grid-template-columns.

## Answer:

## grid-template-columns: repeat(3, 1fr);

## Explanation: repeat(3, 1fr) creates three columns where each column receives an equal share of the available space.

## 4. Question

## What does flex: 1 do?

## Answer: It allows a flex item to grow and share the available space.

## Explanation: If multiple flex items have:

## .item {

## flex: 1;

## }

## they will generally share the available space equally.

## 5. Question

## Name one scenario where Grid is the better choice over Flexbox.

## Answer: When creating a two-dimensional layout involving both rows and columns, such as a dashboard.

## Explanation: Flexbox is mainly designed for one-dimensional layouts—a row or a column.

## Grid is designed for two-dimensional layouts, making it useful for:

## Dashboards

## Image galleries

## Page layouts

## Card grids

## 20.4 Position & Visual Effects

## 1. Question

## List the five values of the position property.

## Answer:

## static

## relative

## absolute

## fixed

## sticky

## Explanation: These values control how an element is positioned in the document.

## For example:

## position: relative;

## allows an element to be positioned relative to its normal position.

## 2. Question

## Why might z-index appear to "not work" on an element?

## Answer: Because of positioning or stacking contexts.

## Explanation: z-index controls the stacking order of elements, but its behavior depends on the elements' positioning and stacking contexts.

## A common example is:

## .box {

## position: relative;

## z-index: 10;

## }

## If another element belongs to a different stacking context, simply increasing z-index may not produce the expected result.

## 3. Question

## Write CSS for a circular 100px avatar image.

## Answer:

## .avatar {

## width: 100px;

## height: 100px;

## border-radius: 50%;

## object-fit: cover;

## }

## Explanation:

## width and height make the image 100×100px.

## border-radius: 50% makes it circular.

## object-fit: cover keeps the image properly filled inside the circle.

## 4. Question

## What's the difference between transition and animation?

## Answer: A transition smoothly changes between two states, while an animation can have multiple stages defined using @keyframes.

## Explanation:

## Transition:

## button {

## transition: background-color 0.3s;

## }

## It commonly happens when a state changes, such as :hover.

## Animation:

## @keyframes move {

## from {

## transform: translateX(0);

## }

## to {

## transform: translateX(100px);

## }

## }

## Animations can run automatically and contain multiple keyframes.

## 5. Question

## Which two properties are best for smooth, performant animations?

## Answer: transform and opacity

## Explanation: These properties can usually be animated efficiently by modern browsers and are commonly preferred for smooth UI animations.

## Example:

## .box {

## transition: transform 0.3s, opacity 0.3s;

## }

## 20.5 Responsive Design

## 1. Question

## What does mobile-first mean?

## Answer: Mobile-first means designing the website for small screens first, then adding styles for larger screens.

## Explanation: You start with the mobile layout:

## .container {

## width: 100%;

## }

## Then use media queries for larger screens:

## @media (min-width: 768px) {

## .container {

## width: 80%;

## }

## }

## 2. Questio

## Write a media query applying styles only at 768px and above.

## Answer:

## @media (min-width: 768px) {

## /* CSS styles */

## }

## Explanation: min-width: 768px means the styles inside the media query apply when the viewport width is 768px or wider.

## 3. Question

## Why is the viewport meta tag required for responsive CSS to work?

## Answer:

## <meta name="viewport" content="width=device-width, initial-scale=1.0">

## Explanation: It tells mobile browsers to use the device's actual screen width as the viewport width.

## Without it, mobile browsers may render the page as if it were a wider desktop page, making responsive layouts behave incorrectly.

## 4. Question

## What does max-width: 100% do on an image?

## Answer: It prevents the image from becoming wider than its parent container.

## Explanation:

## img {

## max-width: 100%;

## }

## This helps prevent images from overflowing their containers on smaller screens.

## 5. Question

## What does repeat(auto-fit, minmax(200px, 1fr)) achieve?

## Answer: It creates a responsive grid that automatically adjusts the number of columns based on the available space.

## Explanation:

## grid-template-columns: repeat(

## auto-fit,

## minmax(200px, 1fr)

## );

## Each column:

## Has a minimum width of 200px

## Can grow up to 1fr

## Automatically fits as many columns as possible

## This is very useful for responsive card layouts.

## 20.6 Pseudo-classes, Pseudo-elements & Animation

## 1. Question

## What's the syntax difference between a pseudo-class and a pseudo-element?

## Answer:

## Pseudo-class → :

## Pseudo-element → ::

## Explanation:

## Pseudo-class:

## button:hover {

## color: red;

## }

## Pseudo-element:

## p::before {

## content: "→";

## }

## :hover represents a state, while ::before represents a part of an element.

## 2. Question

## Write CSS that turns a link red only while it's being hovered.

## Answer:

## a:hover {

## color: red;

## }

## Explanation: :hover is a pseudo-class that applies styles when the mouse pointer is over the element.

## 3. Question

## What property must ::before/::after have to actually render?

## Answer: The content property.

## Explanation:

## .box::before {

## content: "";

## }

## The content property is required for ::before and ::after to generate their pseudo-elements.

## 4. Question

## Write a @keyframes animation that fades an element from opacity 0 to 1.

## Answer:

## @keyframes fadeIn {

## from {

## opacity: 0;

## }

## to {

## opacity: 1;

## }

## }

## Explanation: The animation starts with the element completely transparent (opacity: 0) and ends with it fully visible (opacity: 1).

## It can be applied using:

## .element {

## animation: fadeIn 1s;

## }

## 5. Question

## Which timing-function value gives a smooth, natural-feeling animation start and end?

## Answer: ease

## Explanation: ease starts relatively slowly, speeds up in the middle, and slows down toward the end, producing a natural-looking transition.

## Example:

## transition: transform 0.5s ease;

## 20.7 Variables, Sass & Frameworks

## 1. Question

## Write the syntax to define a CSS variable called --main-color and use it on a background-color.

## Answer:

## :root {

## --main-color: blue;

## }

## .box {

## background-color: var(--main-color);

## }

## Explanation: CSS variables are defined using --.

## They are accessed using:

## var(--main-color)

## This makes it easy to reuse and change values throughout a stylesheet.

## 2. Question

## What Sass feature lets you write a selector inside its parent selector?

## Answer: Nesting

## Explanation: Sass allows selectors to be nested inside other selectors.

## Example:

## .nav {

## color: black;

## .link {

## color: blue;

## }

## }

## This makes related styles easier to organize.

## 3. Question

## What does "utility-first" mean in the context of Tailwind CSS?

## Answer: Utility-first means building designs using small, single-purpose utility classes.

## Explanation: Instead of writing a large custom CSS class, you can combine utility classes.

## For example:

## <div class="flex p-4 text-center">

## Here:

## flex → Flexbox

## p-4 → padding

## text-center → centered text

## This approach allows developers to build interfaces quickly without writing much custom CSS.

## 4. Question

## Name one advantage and one disadvantage of using a framework like Bootstrap.

## Answer:

## Advantage: Faster development.

## Disadvantage: Websites can look similar unless they are customized.

## Explanation: Frameworks such as Bootstrap provide ready-made components, responsive layouts, buttons, forms, navigation bars, and other utilities.

## This saves development time.

## However, relying heavily on default styles can make different websites look similar.

## 5. Question

## Why is understanding plain CSS deeply still important even if you'll use Tailwind later?

## Answer: Because understanding CSS helps you understand layout, styling, responsiveness, specificity, and browser behavior.

## Explanation: Tailwind provides utility classes, but those utilities are still based on CSS concepts.

## For example, to properly understand:

## <div class="flex justify-center items-center">

## you should understand:

## display: flex;

## justify-content: center;

## align-items: center;

## A strong understanding of plain CSS also makes it easier to debug, customize, and solve layout problems when using Tailwind or other CSS frameworks.
`,
  21: `# 21. Final Self-Assessment Quiz

Attempt all 15 questions without looking back. Answers follow at the end.

:::challenge
**Questions**
Q1) What are the three ways to add CSS to an HTML page?
Q2) List the four layers of the CSS box model, in order.
Q3) What does box-sizing: border-box change?
Q4) Name two CSS color formats that support transparency.
Q5) What CSS value makes a position: absolute element position relative to a specific parent?
Q6) What's the main difference between Flexbox and CSS Grid?
Q7) Which property controls the main-axis alignment of flex items?
Q8) What does mobile-first mean when writing media queries?
Q9) What does max-width: 100% do on an image, and why does it matter?
Q10) What's the difference between a pseudo-class and a pseudo-element?
Q11) What CSS property makes a hover effect happen smoothly?
Q12) Which two properties are recommended for smooth, performant animations?
Q13) How do you define and use a CSS custom property (variable)?
Q14) What does z-index require to have any effect?
Q15) In real projects, do you typically use Flexbox or Grid, or both together?
:::

## Answer Key

1. Inline, internal, external -- external is the professional standard.
2. Content, padding, border, margin.
3. Makes width/height include padding and border, instead of adding them on top.
4. rgba() and hsla().
5. position: relative on that specific parent element.
6. Flexbox is one-dimensional (a row or column); Grid is two-dimensional (rows and columns together).
7. justify-content.
8. Writing base CSS for small screens first, then progressively enhancing for larger screens with min-width media queries.
9. Prevents the image from overflowing its container; keeps layouts from breaking on small screens.
10. A pseudo-class (single colon) targets an element's state; a pseudo-element (double colon) targets a part of an element or inserts generated content.
11. transition.
12. transform and opacity.
13. Define with --name: value; (commonly inside :root), use with var(--name).
14. The element must have a position value other than static (relative, absolute, fixed, or sticky).
15. Both together -- Grid for overall page structure, Flexbox for component-level layout.

## What's Next: A Preview of JavaScript

You now have a genuinely complete CSS foundation on top of your HTML skills -- you can build fully responsive, professionally styled pages from scratch. But right now, every page is still static: nothing responds to clicks, nothing calculates, nothing changes after the page loads. Next week, JavaScript brings your pages to life with real logic and interactivity.

:::note
**Carry these habits forward into JavaScript week**
Keep using semantic HTML and clean CSS class names as natural hooks for JavaScript to target. Keep testing in the browser constantly rather than only reading. And keep practicing by rebuilding real pages from memory -- that habit built your HTML and CSS skills, and it's exactly what will build your JavaScript skills next.
:::

:::note
**You have now covered a genuinely complete CSS foundation.**
Syntax, selectors, specificity, the box model, colors and units, typography, backgrounds and shadows, display and position, Flexbox, Grid, responsive design, pseudo-classes and pseudo-elements, transitions and animations, and CSS variables/Sass/Tailwind -- with real diagrams and dozens of worked examples throughout. Practice by fully styling a page from memory, then move on to JavaScript next.
:::
`,
}

export default content
