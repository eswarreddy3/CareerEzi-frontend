// Statistics for Data Analysis — Beginner to Advanced (12 lessons)
// Generated from the 3 Statistics_*_final.pdf study guides — content copied as-is.
// Diagrams/tables rendered as layout-preserving text; charts served from /statistics-images/statimg*.png

const statisticsContent: Record<number, string> = {
1: `# Introduction to Statistics & Data Types

## Overview

Statistics is the science of collecting, organising, summarising, analysing, and interpreting data to make informed decisions. In data analysis, statistics forms the mathematical backbone without it, data is just noise. Every business insight, every A/B test result, every machine learning model depends on statistical foundations.

## Detailed Explanation

### 1. What is Statistics?

Statistics is divided into two branches: Descriptive Statistics summarises and describes data (mean, charts, tables). Inferential Statistics draws conclusions about a population from a sample (hypothesis tests, confidence intervals). Both are essential in data analysis you describe what you see, then infer what it means.

:::scenario
**Real-World Scenario**
A hospital records blood pressure of 500 patients. Descriptive statistics: average BP = 132 mmHg, range = 90–180. Inferential statistics: we estimate that the average BP of ALL patients in the city (not just the 500) is between 128 and 136 with 95% confidence.
:::

![Statistics diagram](/statistics-images/statimg1.png)

### 2. Types of Data: Qualitative vs Quantitative

Qualitative (Categorical) data describes attributes names, labels, categories. It cannot be averaged. Quantitative (Numerical) data represents measurable quantities it can be added, averaged, and analysed numerically. Knowing the data type determines which statistical methods you can apply.

:::scenario
**Real-World Scenario**
An e-commerce survey collects: Customer name (qualitative/nominal), Product rating 1-5 (qualitative/ordinal), Purchase amount in rupees (quantitative/ratio), Age in years
:::

(quantitative/ratio). You can compute average purchase amount but NOT average customer name.

\`\`\`text
                                        Nominal  : No order   → Colours, Names,
                                                              Cities
                 QUALITATIVE
                                        Ordinal  : Has order  → Ratings, Ranks,
                 (Categorical)                                Grades
                                        Discrete : Countable  → No. of children,
                                                              Orders
DATA TYPES
                 QUANTITATIVE           Continuous:           Measurable → Height,
                 (Numerical)
                                                              Weight, Salary
\`\`\`

### 3. Levels of Measurement: NOIR

The four measurement levels Nominal, Ordinal, Interval, Ratio determine what statistical operations are valid. Higher levels allow more operations. Ratio is the most powerful (has a true zero meaning 'none of the quantity'). Nominal is the least powerful (only labels).

\`\`\`text
LEVEL                         EXAMPLE                       OPERATIONS ALLOWED
Nominal                       Gender, Blood group           Count, Mode
Chi-square Ordinal            Satisfaction 1-5              Median, Percentile
Mann-Whitney Interval         Temperature (°C)              Mean,  SD, t-test  (no  true
                                                            zero)
Ratio                         Weight, Income                All above  + ratios  (2x, 3x
                                                            etc.)
\`\`\`

### 4. Population vs Sample

A population is every individual in the group of interest. A sample is a subset selected for study. Parameters (μ, σ) describe populations. Statistics (x̄, s) describe samples. Because studying entire populations is usually impossible, we study samples and generalise. The quality of our conclusions depends entirely on how representative the sample is.

:::scenario
**Real-World Scenario**
BSNL wants to know average monthly internet usage of all 50 million subscribers. Studying all 50M is impossible. They study a sample of 10,000 randomly selected subscribers. The sample mean (x̄) estimates the population mean (μ).
:::

![Statistics diagram](/statistics-images/statimg2.png)

## Assignment Tasks

\`\`\`text
#   Assignm ent Task                                          Difficulty   Type
1   Collect 30 data points (e.g., ages of students in your class, or Easy  Practical
    m onthly expenses). Identify each variable as
    qualitative/quantitative and its level of measurement
    (nominal/ordinal/interval/ratio).
2
    Find a real dataset online (Kaggle, data.gov.in). List all  Medium     Research
    variables, classify each by data type and level of measurement.
    Justify your classification for at least 5 variables.
3   Explain in writing (200+ words): Why can we compute the     Medium     W ritten
    average of temperature in Celsius but say '40°C is NOT twice
    as hot as 20°C'? What property is missing that prevents this
    ratio interpretation?
4
    Design a survey for a college canteen: create 10 questions that Medium Design
    together cover all four levels of measurement. Label each
    question's measurement level.
5   From a newspap er or news website, find 5 statistical claims Hard      Research
    (e.g., 'average salary', 'X% of people'). Identify whether each is
    a descriptive or inferential statement and explain why.
\`\`\`

## Interview Questions

**Q1:** What is the difference between descriptive and inferential statistics?

**Answer:** Descriptive statistics summarises the data you have (e.g., mean, charts). Inferential statistics uses

sample data to draw conclusions about a broader population (e.g., hypothesis tests, confidence intervals). In practice, a data analyst does both first describing the data, then making inferences.

**Q2:** Why does the level of measurement matter in data analysis?

**Answer:** The level of measurement determines which statistical methods are valid. For example, you can

compute a mean for ratio data (salary) but not for nominal data (city names). Using the wrong method produces meaningless or misleading results.

**Q3:** What is the difference between a parameter and a statistic?

**Answer:** A parameter describes the entire population (e.g., μ = true average income of all Indians). A

statistic describes a sample (e.g., x̄ = average income from a 1000-person survey). Parameters are usually unknown; statistics estimate them.

**Q4:** Can you give a real-world example where confusing population and sample caused a

problem?

**Answer:** The 1936 US presidential election poll by Literary Digest they sampled from telephone

directories and car registrations (a biased sample of wealthier Americans), predicted a Republican win, but Roosevelt won by a landslide. The sample did not represent the population.

## Knowledge Test

**Q1:** A company surveys 200 customers out of 50,000. The survey finds average spending is

₹4,500. Is ₹4,500 a parameter or a statistic? What would be the parameter here?

:::tip
₹4,500 is a statistic (it describes the sample of 200). The parameter would be the true average
:::

spending of ALL 50,000 customers, which is unknown.

**Q2:** A researcher measures: Country of birth, Age, Height, and Favourite colour. Which variables

can be meaningfully added or averaged? Which cannot? Why?

:::tip
Age and Height (ratio data) can be meaningfully added and averaged. Country of birth and
:::

Favourite colour (nominal data) cannot they are labels with no numerical meaning.

**Q3:** Temperature is recorded as 20°C, 25°C, 30°C. Can we say 30°C is 'twice as warm' as 15°C?

What level of measurement is Celsius temperature, and why does this matter?

:::tip
No   Celsius is interval level, which has no true zero. 0°C does not mean 'no heat'. Ratio statements
:::

(twice as much) require ratio-level data. We can say 30°C is 15 degrees warmer than 15°C, but NOT 'twice as warm'.`,

2: `# Measures of Central Tendency

## Overview

Measures of central tendency identify the 'centre' or 'typical value' of a data set. The three key measures Mean, Median, and Mode each capture a different aspect of the centre. Choosing the right measure depends on the data type, distribution shape, and presence of outliers. This is the most fundamental concept in all of statistics.

## Detailed Explanation

### 1. The Mean (Arithmetic Average)

The mean is calculated by summing all values and dividing by the count. It uses every data point, making it sensitive to outliers. It is the most mathematically tractable measure, forming the basis of many advanced techniques. Use mean when data is symmetric and has no extreme outliers.

\`\`\`text
Data: 10, 20, 30, 40, 50
Mean = (10 + 20 + 30 + 40 + 50) / 5      = 150 / 5      = 30
Effect of outlier: Data: 10, 20, 30, 40, 500  ← outlier added
Mean = 600 / 5 = 120  ← completely misleading!
The outlier dragged the mean from 30 to 120.
\`\`\`

### 2. The Median (Middle Value)

The median is the middle value when data is sorted. For odd n, it is the middle item; for even n, it is the average of the two middle items. The median is resistant to outliers extreme values do not affect it. Use median for skewed data or when outliers are present (e.g., income, house prices).

:::scenario
**Real-World Scenario**
India's per-capita income reported as 'average' can be misleading because a few billionaires inflate the mean. The median income (50th percentile) better represents what a 'typical' Indian earns, as it is unaffected by extreme wealth.
:::

\`\`\`text
Odd count: 3, 7, 9, 12, 15
 ↑ Median = 9 (3rd of 5 values)
Even count: 3, 7, 9, 12
 ↑↑ Median = (7+9)/2 = 8 (avg of 2 middle values)
With outlier: 3, 7, 9, 12, 200               Median = 9 (unchanged!)
Mean   = 46.2 (severely affected)
\`\`\`

### 3. The Mode (Most Frequent Value)

The mode is the value that appears most often in the data. Data can be unimodal (one mode), bimodal (two modes), or multimodal (multiple modes). Mode is the only measure applicable to nominal (categorical) data. In a normal distribution, mean = median = mode.

:::scenario
**Real-World Scenario**
A shoe store analyses sales: sizes 6, 7, 8, 8, 8, 9, 9, 10. Mode = 8. The store stocks the most pairs of size 8. Mode directly answers 'what should I stock most of?' a question
:::

mean and median cannot answer.

\`\`\`text
Unimodal:  2, 4, 4, 4, 6, 8
→ Mode = 4
Bimodal:   2, 3, 3, 5, 5, 7
 → Mode = 3 and 5
No mode:   1, 2, 3, 4, 5
→ Every value unique
 Categorical: Red, Blue, Blue, Green, Blue
 Mode = Blue (most frequent)
\`\`\`

### 4. When to Use Each Measure

The choice of central tendency measure depends on data type and distribution shape. For symmetric numerical data without outliers, use mean. For skewed numerical data or data with outliers, use median. For categorical data or to find the most common value, use mode. Often, reporting all three together gives the fullest picture. Choosing the Best Measure of Central Tendency Scenario Best Measure Reason Student exam scores (normal) Data is symmetric with no extreme outliers Mean House prices in a city Median Skewed due to very high-priced luxury properties Favourite movie genre Mode Categorical data (no numeric meaning) Employee salary (skewed) High salaries (e.g., CEOs) distort the mean Median Product ratings (1–5, ordinal) Median / Mode Ordinal scale (ranking matters, not exact difference)

## Assignment Tasks

\`\`\`text
#   Assignm ent Task                                          Difficulty   Type
1   Collect the monthly grocery bills for 15 households. Calculate Easy    Practical
    m ean, median, and mode. Add one extreme value (a very rich
    household's bill). Recalculate and compare all three measures.
2
    Dow nload the IPL player salary dataset from Kaggle. Calculate Medium  Practical
    m ean and median salary. Explain which better represents the
    'typical' player's salary and why.
3
    Find a real news article that uses 'average' to report salary, Medium  W ritten
    income, or price data. Identify whether mean or median was
    likely used. Explain what difference it would make.
4   Create a data set of 20 values where mean, median, and mode  Hard      Practical
    are all very different. Visualise it with a histogram and explain
\`\`\`

why the three measures diverge. 5Hard

\`\`\`text
Research: India's official GDP per capita uses the mean. Find       R esearch
the median income estimate for India from any source. How
large is the gap? What does this gap tell us about income
inequality?
\`\`\`

## Interview Questions

**Q1:** When would you use median instead of mean to represent central tendency? Give a data

analysis example.

**Answer:** Whenever data is skewed or contains outliers. For example, in salary analysis, a few extremely

high-paid executives inflate the mean, making it unrepresentative. Median salary is used in official wage reports because it represents the 'middle worker'.

**Q2:** Can a data set have no mode? Can it have multiple modes?

**Answer:** Yes to both. A data set where every value is unique has no mode (or every value is a mode). A

data set like 2,3,3,5,5,7 has two modes (bimodal). This matters in distribution analysis bimodal distributions often indicate two distinct subgroups in the data.

**Q3:** You have salary data: most employees earn ₹30,000-₹50,000, but the CEO earns ₹5 crore. A

colleague reports the 'average salary' as ₹1.2 lakh. What's the issue?

**Answer:** The mean is severely inflated by the CEO's extreme salary. The median would be a far more

honest representation of what 'most employees' earn. This is misleading communication, a common misuse of statistics in real business contexts.

## Knowledge Test

**Q1:** Data: 12, 15, 15, 18, 20, 100. Calculate mean and median. Which better represents the 'typical'

value? Why?

:::tip
Mean = (12+15+15+18+20+100)/6 = 180/6 = 30. Sorted: 12,15,15,18,20,100 → Median =
:::

(15+18)/2 = 16.5. Median (16.5) better represents the typical value because 100 is an outlier pulling the mean up to 30, which is above 5 of the 6 values.

**Q2:** A shop sells: Size 6 (4 pairs), Size 7 (3 pairs), Size 8 (10 pairs), Size 9 (2 pairs). Which central

tendency measure helps the shop decide what to stock? What is its value?

:::tip
Mode is the relevant measure here   it identifies the most frequently needed size. Mode = Size 8
:::

(sold 10 pairs, most frequently). Mean or median of shoe sizes doesn't answer 'which size to stock most'.

**Q3:** Explain why the mean, median and mode are all equal in a normal distribution, but diverge in

a skewed distribution.

:::tip
In a symmetric normal distribution, the data is evenly spread around the centre   so the balancing
:::

point (mean), middle value (median), and highest peak (mode) all coincide. In a right-skewed distribution, the long right tail pulls the mean rightward past the median, which is past the mode: Mode < Median < Mean.`,

3: `# Measures of Spread (Variability)

## Overview

Measures of central tendency alone are insufficient two data sets can have the same mean but completely different distributions. Measures of spread (or variability) quantify how much data values deviate from the centre. Understanding spread is critical for risk assessment, quality control, and comparing datasets.

## Detailed Explanation

### 1. Range

Range = Maximum − Minimum. It is the simplest measure of spread but is highly sensitive to outliers one extreme value completely changes it. Range gives no information about how values are distributed between the extremes.

\`\`\`text
Data A: 10, 12, 14, 16, 18
→  Range = 18 - 10 = 8
Data B: 10, 10, 10, 10, 18
→  Range = 18 - 10 = 8
Both have Range = 8,
but Data A is evenly spread while Data B is clustered at 10 with one outlier.
Range cannot distinguish these distributions.
\`\`\`

### 2. Variance and Standard Deviation

Variance is the average of squared deviations from the mean. Standard deviation (SD) is its square root returning to the original units. SD is the most important and widely used measure of spread. A small SD means data is tightly clustered around the mean; a large SD means data is widely spread. Population uses N in the denominator; sample uses (N-1) Bessel's correction to reduce bias.

:::scenario
**Real-World Scenario**
A quality control engineer at a biscuit factory checks weight. Target: 100g. Machine A: mean=100g, SD=0.5g (consistent). Machine B: mean=100g, SD=5g (inconsistent). Both have the correct average weight, but Machine B produces many under/over-weight biscuits. SD reveals the
:::

difference that mean alone cannot.

\`\`\`text
Formula (sample):  s = √[ Σ(xᵢ - x̄)² / (n-1) ]
Data: 2, 4, 6, 8, 10
Mean = 6
Deviations: -4, -2, 0, +2, +4
Squared:    16,  4, 0,  4, 16
Sum = 40
Variance s² = 40 / (5-1) = 10
Std Dev  s  = √10 ≈ 3.16
Interpretation: Values typically deviate about ±3.16 units from the mean of 6.
\`\`\`

### 3. Interquartile Range (IQR)

IQR = Q3 − Q1. It measures the spread of the middle 50% of data. Quartiles divide sorted data into four equal parts: Q1=25th percentile, Q2=50th percentile (median), Q3=75th percentile. IQR is resistant to outliers since it ignores the top and bottom 25%. It is used in box plots and in the IQR rule for detecting outliers.

![Statistics diagram](/statistics-images/statimg3.png)

\`\`\`text
Outlier rule: Outlier if value > Q3 + 1.5×IQR  or < Q1 - 1.5×IQR
Upper fence: 58 + 1.5×6 = 67
Lower fence:  52 - 1.5×6 = 43
\`\`\`

### 4. Coefficient of Variation (CV)

CV = (Standard Deviation / Mean) × 100%. It expresses standard deviation as a percentage of the mean, allowing comparison of variability across data sets with different units or scales. A lower CV means less relative variability (more consistent). Used in finance (comparing investment volatility) and quality control.

\`\`\`text
Stock A:  Mean return = 12%, SD = 3%   → CV = 3/12 × 100 = 25%
Stock B:  Mean return = 20%, SD = 10%  → CV = 10/20 × 100 = 50%
Stock A has lower CV (25%) → more consistent returns
Stock B has higher CV (50%) → more volatile / risky Even though Stock B has higher
absolute SD, relative to its return, Stock A is more stable.
\`\`\`

## Assignment Tasks

\`\`\`text
#   Ass ignmen t Task                                         Difficulty   Type
1
    Collect test scores of 20 students. Calculate: range, variance, Easy   Practical
    standard deviation, Q1, Q3, and IQR. Identify any outliers using
    the IQR rule.
2   Com pare variability of two stocks (find price data from    Medium     Practical
    NS E/BSE for any two stocks). Calculate mean, SD, and CV for
\`\`\`

each. Which stock is more volatile relative to its return? 3Medium

\`\`\`text
    Create two data sets each with mean = 50 but different                 Practical
    standard deviations (SD=5 and SD=20). Plot both as
    histograms. Explain what the different SDs reveal.
4   Build a box plot for the Iris dataset (available on Kaggle or Hard     Practical
    sklearn). Identify outliers in the petal length column using the
    IQR rule.
\`\`\`

5Research: Why does sample standard deviation use (n-1) HardResearch

\`\`\`text
instead of n in the denominator? What is 'Bessel's correction'
and why is it needed?
\`\`\`

## Interview Questions

**Q1:** What is the difference between variance and standard deviation? Why do we prefer standard

deviation in practice?

**Answer:** Variance = average squared deviation from mean. SD = square root of variance. SD is preferred

because it is in the same units as the original data e.g., if data is in rupees, SD is in rupees. Variance would be in squared rupees, which is hard to interpret.

**Q2:** When would you report IQR instead of standard deviation?

**Answer:** When data is skewed or contains outliers. SD is affected by outliers (since it uses the mean,

which is itself affected). IQR uses quartiles which are resistant to outliers, making it more appropriate for skewed distributions like income, house prices, or response times.

**Q3:** Two investment funds have the same mean return. How would you compare their risk?

**Answer:** Compare their standard deviations (absolute risk) or coefficients of variation (relative risk). Higher

SD = more volatile. CV = SD/Mean × 100% allows fair comparison even if the funds have different mean returns.

## Knowledge Test

**Q1:** Data: 100, 102, 98, 105, 95, 200. Calculate range and IQR. Which better represents spread

here? Why?

:::tip
Sort: 95,98,100,102,105,200. Range = 200-95 = 105. Q1=98, Q3=105, IQR=7. IQR (7) better
:::

represents spread of the typical data because Range is dominated by the outlier 200. The IQR correctly shows that the middle 50% of data is tightly spread.

**Q2:** Machine A produces components with mean weight=500g, SD=2g. Machine B: mean=500g,

SD=15g. Which machine should a quality manager prefer? What does SD tell them?

:::tip
Machine A, because its lower SD (2g vs 15g) means components are much more consistently
:::

close to the target weight of 500g. SD measures consistency a lower SD means less variability and fewer out-of-tolerance parts.

**Q3:** Why can't we compare the spread of two datasets directly using standard deviation if one is

in centimetres and the other is in kilograms?

:::tip
Standard deviation is in the same units as the data. Comparing 3cm SD with 3kg SD is
:::

meaningless because the units are incomparable. Use Coefficient of Variation (CV = SD/Mean × 100%) instead it is unitless and allows fair comparison of relative variability.`,

4: `# Data Distributions & the Normal Distribution

## Overview

A distribution describes how data values are spread across their range. Understanding distribution shape is fundamental to choosing the right statistical methods. The normal distribution is the most important distribution in statistics it appears naturally in many real-world phenomena and is the foundation of most classical statistical tests.

## Detailed Explanation

### 1. Distribution Shapes

Distribution shape tells you about the spread and symmetry of data. Symmetric distributions have equal spread on both sides. Skewed distributions have a longer tail on one side. Kurtosis measures the 'peakedness' and heaviness of tails. Recognising distribution shape determines which statistics to use and how to interpret them.

\`\`\`text
SYMMETRIC (Normal):       ▁▁▄▁█▁▄▁▁                        Mean = Median = Mode
RIGHT SKEWED (Positive):  ▁▄█▄▁▁▁▁▁                        Mean > Median > Mode
Example: Income, House prices
LEFT SKEWED (Negative):   ▁▁▁▁▁▁▄█▄▁                       Mean < Median < Mode
Example: Age at retirement
BIMODAL (Two peaks):      ▁▁▁▁▁▁▁                           Two distinct groups
\`\`\`

### 2. The Normal Distribution

The normal distribution is a symmetric, bell-shaped curve completely defined by two parameters: mean (μ) and standard deviation (σ). It is fundamental because many natural phenomena follow it (heights, measurement errors, test scores) and because the Central Limit Theorem guarantees that sample means tend toward normality. The normal distribution is the basis of z-scores, t-tests, and most classical statistics.

:::scenario
**Real-World Scenario**
Heights of 10,000 Indian adult men follow a normal distribution with μ=168cm, σ=6cm. About 68% of men are between 162-174cm (μ±σ). About 95% are between 156-180cm
:::

(μ±2σ). Manufacturers use this to determine what sizes to produce most of.

### Normal Distribution: N(μ, σ)

μ (mu) = Mean (center of the distribution)

\`\`\`text

\`\`\`

σ (sigma) = Standard deviation (spread of the data)

\`\`\`text

\`\`\`

Shape: Bell-shaped, symmetric curve

\`\`\`text

\`\`\`

μ-3σ μ-2σ μ-σ μ μ+σ μ+2σ μ+3σ |------|------|------|------|------|------| |←── 68% ──→| |←──────── 95% ────────→| |←──────────── 99.7% ──────────────→| 68–95–99.7 Rule (Empirical Rule) Range from Mean Percentage of Data μ ± 1σ 68.27% μ ± 2σ 95.45% μ ± 3σ 99.73%

### 3. Z-Scores (Standard Scores)

A z-score measures how many standard deviations a value is from the mean. It standardises data from different scales, enabling comparison. A z-score of +2 means the value is 2 standard deviations above the mean. Z-scores are used to find probabilities from the standard normal table, to identify outliers (|z| > 3), and to compare observations across different scales.

\`\`\`text
Formula:  z = (x - μ) / σ
Example: Test scores, μ=70, σ=10
Student A scored 85:  z = (85-70)/10 = +1.5
Student B scored 55:  z = (55-70)/10 = -1.5
Student C scored 70:  z = (70-70)/10 =  0
Interpretation:   z = +1.5 → 1.5
SDs above average (better than ~93% of class)
 z = -1.5 → 1.5
SDs below average (better than only ~7% of class)
 z = 0    → exactly at the mean
Outlier threshold: |z| > 3 → unusual value
\`\`\`

## Assignment Tasks

\`\`\`text
#   Assignm ent Task                                          Difficulty   Type
1   Find daily maximum temperature data for your city for the past Easy    Practical
    year (weather website or data.gov.in). Plot a histogram. Is it
\`\`\`

normally distributed, skewed, or bimodal? 2

\`\`\`text
    For a data set of exam scores, calculate z-scores for all   Medium     Practical
    students. Identify students whose z-score is above +2 or below
    -2. What percentile does each correspond to?
3
    Collect heights of 30 students. Check if data is approximately Medium  Practical
    normal using: histogram shape, and comparison of mean vs
    m edian. What does your analysis suggest?
4   Resea rch: What is the Central Limit Theorem? Run a simulation Hard    Research
    in Python: take samples of increasing sizes from a skewed
\`\`\`

distribution and plot the distribution of sample means. 5Hard

\`\`\`text
In Python/Excel: generate 1000 random values from N(100,               Practical
15). Verify the empirical rule   what % of values actually fall
within ±1σ, ±2σ, ±3σ?
\`\`\`

## Interview Questions

**Q1:** Why is the normal distribution so important in statistics?

**Answer:** Three main reasons: (1) Many natural phenomena genuinely follow it (heights, test scores,

measurement errors). (2) The Central Limit Theorem states that sample means tend toward normality regardless of population distribution, enabling parametric tests on large samples. (3) It is fully characterised by just two parameters (mean and SD), making it mathematically tractable.

**Q2:** What does a z-score of +2.5 tell you about a data point?

**Answer:** The value is 2.5 standard deviations above the mean. In a normal distribution, only about 0.62%

of values exceed z=+2.5, so this is an unusually high value. In outlier detection, values with |z|>3 are often flagged as outliers.

**Q3:** If income data is right-skewed, why might the government report median income rather than

mean income?

**Answer:** The right tail (extremely wealthy individuals) pulls the mean upward, making it unrepresentative of

the typical person's income. Median income the income of the person exactly in the middle of the distribution is unaffected by billionaires and gives a more honest picture of what most people earn.

## Knowledge Test

**Q1:** Exam scores are normally distributed with μ=65, σ=8. What percentage of students scored

between 57 and 73? What percentage scored above 81?

:::tip
57 to 73 is μ±σ (65-8=57, 65+8=73) → 68% of students. Above 81: 81 = μ+2σ (65+16=81). The
:::

area above +2σ = (100-95)/2 = 2.5% of students.

**Q2:** Two students take different tests: Student A scores 75 on Test 1 (μ=70, σ=5). Student B

scores 82 on Test 2 (μ=75, σ=10). Who performed better relative to their classmates?

:::tip
Student A: z=(75-70)/5=1.0. Student B: z=(82-75)/10=0.7. Student A has a higher z-score (1.0 >
:::

0.7), meaning A performed better relative to their class, despite scoring lower in absolute terms.

**Q3:** You have salary data for 1000 employees. The mean is ₹45,000 and median is ₹38,000. What

does this tell you about the distribution shape?

:::tip
Mean > Median indicates right-skewed (positively skewed) distribution. A few high-salary
:::

employees are pulling the mean upward. The median (₹38,000) better represents the 'typical' employee salary.`,

5: `# Introduction to Probability

## Overview

Probability is the mathematical framework for quantifying uncertainty. It forms the bridge between data collection and statistical inference. Every statistical test produces a probability (p-value); every confidence interval is built on probability. Understanding probability is essential before tackling hypothesis testing, regression, and machine learning.

## Detailed Explanation

### 1. Basic Probability Concepts

Probability measures the likelihood of an event on a scale of 0 to 1. P(event) = Number of favourable outcomes / Total possible outcomes. This is classical probability (assumes equally likely outcomes). Empirical probability uses observed data: P(event) = Frequency of event / Total observations.

\`\`\`text
Classical: P(event) = Favourable outcomes / Total outcomes
Die example:  P(rolling 4) = 1/6 ≈ 0.167
 P(even number) = 3/6 = 0.5
 P(number > 6)  = 0/6 = 0 (impossible)
 P(number ≤ 6)  = 6/6 = 1 (certain)
Properties:   0 ≤ P(A) ≤ 1      (probability between 0 and 1)
 P(A) + P(not A) = 1 (complement rule)
\`\`\`

### 2. Rules of Probability: Addition and Multiplication

Addition Rule: P(A or B) = P(A) + P(B) − P(A and B). For mutually exclusive events (cannot happen together), P(A or B) = P(A) + P(B). Multiplication Rule: P(A and B) = P(A) × P(B|A). For independent events, P(A and B) = P(A) × P(B). These two rules form the foundation of probability calculations.

:::scenario
**Real-World Scenario**
In quality control: P(defect from machine A) = 0.03, P(defect from machine B) = 0.05. If machines are independent, P(both defective on same item) = 0.03 × 0.05 = 0.0015.
:::

Very unlikely! Probability helps quantify such joint scenarios.

\`\`\`text
ADDITION RULE:   P(A or B) = P(A) + P(B) - P(A and B)
  P(card is Red OR Face card) = 26/52 + 12/52 - 6/52 = 32/52
 MUTUALLY EXCLUSIVE (cannot both occur):   P(A or B) = P(A) + P(B)
 P(die = 1 or die = 6) = 1/6 + 1/6 = 2/6
MULTIPLICATION RULE (independent events):   P(A and B) = P(A) × P(B)   P(2 heads in a
row) = 0.5 × 0.5 = 0.25
\`\`\`

### 3. Conditional Probability

P(A|B) = P(A and B) / P(B) reads as 'probability of A given B has occurred'. Conditional probability updates our probability estimate based on new information. It is the foundation of Bayes' theorem, which is central to Bayesian statistics and machine learning (Naive Bayes classifier).

:::scenario
**Real-World Scenario**
Medical testing: P(Disease) = 0.01 (1% of population has disease). Test accuracy: P(Positive|Disease) = 0.95. If someone tests positive, what is P(Disease|Positive)? Conditional probability and Bayes' theorem answer this. The answer is often surprisingly low due to the base rate of the disease.
:::

\`\`\`text
P(A | B) = P(A and B) / P(B)
Example: 100 students, 60 passed exam, 40 attended all lectures  30 both passed AND
attended all lectures
 P(Pass | Attended) = P(Pass AND Attend) / P(Attend)   = (30/100) / (40/100)
= 30/40 = 0.75
Students who attended all lectures had a 75% pass rate, vs overall pass rate of
60/100 = 60%.
\`\`\`

## Assignment Tasks

\`\`\`text
#   Assignm ent Task                                         Difficulty  T ype
1   Roll two dice 100 times (simulate in Python or Excel). Record Easy   P ractical
    outcomes. Calculate empirical probability of: sum=7, doubles,
    sum> 9. Compare to theoretical probabilities.
\`\`\`

2In a deck of 52 cards: calculate P(Ace), P(Red card), P(Ace MediumPractical

\`\`\`text
    AN D Red), P(Ace OR Red). Show all working using addition
    rule.
3
    Resea rch: What is Bayes' Theorem? Use it to solve: A disease Hard     Research
    affects 1% of the population. A test is 95% accurate. If
    som eone tests positive, what is the actual probability they have
\`\`\`

the disease? 4Design a probability tree for a two-stage quality inspection: 5% HardDesign

\`\`\`text
    of items have defects in stage 1. Of those, 80% are caught. Of
    items passing stage 1, 2% have hidden defects caught in stage
    2.
5   Using real cricket match data, calculate empirical probabilities: Medium Research
    P(Team  A wins), P(win when batting first), P(win by more than
    50 runs). Discuss limitations of empirical probability.
\`\`\`

## Interview Questions

**Q1:** What is the difference between independent and mutually exclusive events? Give a real

example of each.

**Answer:** Mutually exclusive: cannot both occur simultaneously e.g., a coin showing Heads and Tails on

the same flip. Independent: occurrence of one doesn't affect probability of other e.g., flipping a coin twice; first result doesn't affect second. These are completely different concepts independent events CAN both occur; mutually exclusive events CANNOT.

**Q2:** Explain conditional probability with a business example.

**Answer:** P(Customer buys | Customer opened email) the probability a customer purchases is conditional

on them having opened the marketing email. This is how email marketing conversion rates work. We know that email openers have a higher conversion rate than non-openers, so the conditional probability is higher than the unconditional probability.

**Q3:** Why does a medical test with 95% accuracy not mean that a positive test result has a 95%

chance of indicating disease?

**Answer:** This is the base rate fallacy, explained by Bayes' theorem. If the disease is rare (e.g., 1%

prevalence), even a 95% accurate test produces many false positives among the large healthy population. The posterior probability (P(Disease|Positive test)) depends on both the test accuracy AND the prior probability (prevalence) of the disease.

## Knowledge Test

**Q1:** In a class of 30 students: 18 play cricket, 15 play football, 8 play both. What is the probability

that a randomly selected student plays cricket OR football?

:::tip
P(Cricket) = 18/30 = 0.6. P(Football) = 15/30 = 0.5. P(Both) = 8/30 ≈ 0.267. P(Cricket OR Football)
:::

= 0.6 + 0.5 - 0.267 = 0.833. So about 83.3% of students play at least one of these sports.

**Q2:** Two quality inspectors each catch defects independently. Inspector A catches 90% of

defects. Inspector B catches 80%. What is the probability that a defect is missed by BOTH?

:::tip
P(A misses) = 0.10, P(B misses) = 0.20. P(both miss) = P(A misses) × P(B misses) = 0.10 × 0.20 =
:::

0.02 = 2%. Only a 2% chance that a defect slips through both inspectors.

**Q3:** A survey shows: P(owns a car) = 0.6, P(owns a bike) = 0.4, P(owns both) = 0.25. What is

P(owns neither)? Are car and bike ownership independent?

:::tip
P(car OR bike) = 0.6 + 0.4 - 0.25 = 0.75. P(neither) = 1 - 0.75 = 0.25. Independence check: P(car)
:::

× P(bike) = 0.6 × 0.4 = 0.24 ≠ 0.25 = P(both). Since 0.24 ≠ 0.25, they are NOT perfectly independent (though close).`,

6: `# Hypothesis Testing

## Overview

Hypothesis testing is the formal statistical process for making decisions about populations based on sample data. It is the backbone of scientific research, A/B testing in tech companies, clinical trials in medicine, and quality control in manufacturing. Every time a company says 'our new feature increased conversions by 15% (p<0.05)', they are reporting a hypothesis test result.

## Detailed Explanation

### 1. The Hypothesis Testing Framework

Hypothesis testing starts with two competing claims: the Null Hypothesis (H₀) — the status quo (no effect, no difference) — and the Alternative Hypothesis (H₀ or Hₐ) — what we are trying to prove. We never 'prove' H₀; we either reject it (evidence is strong enough) or fail to reject it (not enough evidence). This asymmetry is fundamental.

:::scenario
**Real-World Scenario**
Netflix wants to test if a new recommendation algorithm increases watch time. H₀: New algorithm = Old algorithm (no difference). H₀: New algorithm > Old algorithm. They run an A/B test for 2 weeks. If results are statistically significant (p < 0.05), they reject H₀ and deploy the new
:::

algorithm.

\`\`\`text
HYPOTHESIS TESTING FRAMEWORK:
Step 1: State H₀ and H₀    H₀: μ = 50  (no change from status quo)    H₀: μ ≠ 50
(two-tailed: any difference)    H₀: μ > 50  (one-tailed: specifically higher)
Step 2: Choose significance level α (usually 0.05)
Step 3: Collect sample data
Step 4: Calculate test statistic
Step 5: Find p-value
Step 6: Decision:    p < α → Reject H₀ (statistically significant)    p ≥ α → Fail to
reject H₀ (not significant)
\`\`\`

### 2. Type I and Type II Errors

Type I error (α, False Positive): rejecting H₀ when it is actually true — a false alarm. Type II error (β, False Negative): failing to reject H₀ when it is actually false — missing a real effect. These errors have a fundamental tradeoff: reducing α increases β. Power = 1 − β = probability of correctly detecting a real effect. In high-stakes decisions (medical trials), minimising Type II errors is critical. Decision \\ Reality H₀ True H₀ False Reject H₀ Type I Error (α) ❌ Correct (Power = 1 − β) ✅ Fail to Reject H₀ Correct (1 − α) Type II Error (β) ✅❌

### 3. The p-value Explained

The p-value is the probability of observing results as extreme as (or more extreme than) the sample data, ASSUMING H₀ is true. It is NOT the probability that H₀ is true. A small p-value (typically < 0.05) means the observed data would be very unlikely if H₀ were true — providing evidence against H₀. A large p- value provides no strong evidence against H₀.

\`\`\`text
p-value interpretation:  p = 0.001  →  Very strong evidence against H₀
p = 0.01   →  Strong evidence against H₀
p = 0.05   →  Borderline evidence (conventional threshold)
p = 0.10   →  Weak evidence against H₀
 p = 0.50   →  No evidence against H₀
COMMON MISCONCEPTIONS:     'p=0.05 means 5% chance H₀  is true'  ← WRONG
                         ✗
    'p<0.05 means the effect is large'    ← WRONG
  ✗
   p = P(data this extreme | H₀  is true) ← CORRECT
 Statistical significance ≠ Practical significance!
\`\`\`

### 4. One-tailed vs Two-tailed Tests

A one-tailed test specifies the direction of the expected effect (H₀: μ > μ₀ or H₀: μ < μ₀). A two-tailed test is non-directional (H₀: μ ≠ μ₀). One-tailed tests are more powerful for detecting effects in the specified direction but miss effects in the opposite direction. Two-tailed tests are more conservative and are the default choice unless there is a strong prior reason to expect a specific direction.

\`\`\`text
TWO-TAILED (H₀: μ ≠ μ₀):   Rejection regions on BOTH sides   α split as α/2 on each
tail   ▓▓▓|           Normal dist           |▓▓▓   2.5%
2.5%   Critical values: ±1.96 (α=0.05)
ONE-TAILED (H₀: μ > μ₀):   Rejection region on RIGHT side only   Full α on one tail
|           Normal dist       |▓▓▓▓▓|                                        5%
Critical value: +1.645 (α=0.05)
\`\`\`

Feature Two-Tailed Test One-Tailed Test Alternative (H₁) μ ≠ μ₀ μ > μ₀ or μ < μ₀ Rejection Region Both tails One tail only α Distribution Split (α/2 each side) Entire α in one tail Critical Values ±1.96 ±1.645

## Assignment Tasks

\`\`\`text
#   Assignment Task                                      Difficulty  Type
\`\`\`

1Medium

\`\`\`text
    A comp any claims their product lasts an average of 500 hours.         Practical
    You test 30 units and find x̄ =485 hours, s=30 hours. Set up and
    conduct a one-sample t-test (α=0.05). State your conclusion.
2   Design an A/B test for an e-commerce website: define H₀ and Medium     Design
    H₀ , choose significance level, specify what data to collect, and
    describe how you would make the business decision.
3
    Find a published research paper that reports p-values. Identify: Hard  Research
    the hypotheses, significance level, p-values reported, and the
    conclusions. Evaluate whether the conclusions appropriately
    reflect the statistical results.
4   Simulate the false positive problem in Python: run 100 t-tests on Hard Practical
    data from the same population (H₀ should always be true).
    W ith α=0.05, how many tests incorrectly reject H₀? Explain
    what you observe.
5   Resea rch: What is the 'replication crisis' in science? How does Hard  Research
    hypothesis testing contribute to it? What reforms (like pre-
    registration) have been proposed?
\`\`\`

## Interview Questions

**Q1:** Explain the p-value to a non-technical business stakeholder.

**Answer:** 'Imagine H₀ (no difference) is true. The p-value is the probability that we'd see results as dramatic

as what we observed purely by chance. A p-value of 0.03 means: if there's truly no difference, we'd still see this kind of result only 3% of the time. That's unlikely enough that we believe there IS a real difference.'

**Q2:** Your A/B test shows p=0.04 for a 0.1% increase in conversion rate. Should you ship the new

feature?

**Answer:** The result is statistically significant (p=0.04 < 0.05), but the effect size (0.1%) may not be

practically significant. Need to consider: cost of implementation, traffic volumes (0.1% of 1M users = 1,000 extra conversions daily — potentially significant), confidence interval width, and business goals. Statistical significance is just one input into the business decision.

**Q3:** How do you choose between a one-tailed and two-tailed test?

**Answer:** Two-tailed is the default — it tests for any difference regardless of direction, making no

assumptions about direction. One-tailed is used only when there is strong prior reason to expect the effect in a specific direction AND you are not interested in detecting effects in the opposite direction. One-tailed tests are more powerful but more easily abused.

## Knowledge Test

**Q1:** A pharmaceutical company tests a new drug. H : Drug has no effect. H : Drug improves

patient outcomes. They set α=0.01. Explain what Type I and Type II errors mean in this context. Which is more dangerous?

:::tip
Type I error: Concluding the drug works when it actually doesn't — patients receive an ineffective
:::

treatment, wasting money and time, potentially delaying effective treatment. Type II error: Concluding the drug doesn't work when it actually does — a potentially life-saving drug is rejected. In medical contexts, Type II error is often more dangerous as effective treatments are missed. Hence clinical trials often use α=0.01 (very low Type I rate) but ensure high power (low Type II rate).

**Q2:** An experiment finds a statistically significant result with p=0.001. A colleague says 'the p-

value being so small means this result is very important.' Is this correct?

:::tip
Not necessarily. p=0.001 means the result is highly statistically significant — very unlikely to occur
:::

by chance. But statistical significance tells us nothing about practical importance (effect size). With n=100,000 subjects, even a difference of 0.01% can produce p=0.001. We must also report effect size (Cohen's d, r², etc.) to judge practical importance.

**Q3:** You test whether a new training programme improves employee productivity. You fail to

reject H  (p=0.23). Does this mean the programme has no effect? What might have caused this result?

:::tip
No — failing to reject H₀ does NOT prove H₀ is true. It means there is insufficient evidence.
:::

Possible causes: (1) Small sample size → low power → real effect missed. (2) High variability in the data. (3) The effect size is genuinely small. We should report the confidence interval, sample size, and power analysis to properly interpret the non-significant result.`,

7: `# Confidence Intervals

## Overview

A confidence interval gives a range of plausible values for a population parameter, based on sample data. Rather than a single point estimate (which is almost certainly not exactly right), confidence intervals express our uncertainty. They are used in every field — from medicine ('drug reduces blood pressure by 5-10 mmHg with 95% confidence') to economics to election polling.

## Detailed Explanation

### 1. What is a Confidence Interval?

A 95% confidence interval means: if we repeated the sampling procedure many times and constructed a CI each time, 95% of those intervals would contain the true population parameter. It does NOT mean there is a 95% probability the true parameter is in THIS specific interval — once constructed, either it contains the parameter or it doesn't.

:::scenario
**Real-World Scenario**
A polling company surveys 1,000 voters and finds 52% support Candidate A. They report: '52% ± 3%' (49% to 55%) with 95% confidence. This means: based on the sample, a reasonable range for the true support is 49% to 55%. The election is genuinely uncertain since this
:::

interval spans 50%.

\`\`\`text
CI = x̄ ± (Critical value × Standard Error)  For 95% CI of mean (large n, known σ):
CI = x̄ ± 1.96 × (σ/√n)
 Example: x̄=100, σ=15, n=36    SE = 15/√36 = 15/6 = 2.5
 95% CI = 100 ± 1.96 × 2.5           = 100 ± 4.9           = (95.1, 104.9)
Interpretation: We are 95% confident the true population mean is between 95.1 and
104.9.
\`\`\`

### 2. Factors Affecting CI Width

Width of a CI depends on: confidence level (higher confidence = wider interval), sample size (larger n = narrower interval), and population variability (larger σ = wider interval). There is always a tradeoff between confidence level and precision — to be more certain, you must sacrifice precision (wider interval). Effect on CI Factor Change Reason Width 95% → More certainty requires covering more possible Confidence Level Wider 99% values Sample Size (n) 30 → 300 Narrower More data reduces uncertainty → more precision Population SD Greater variability increases spread → less 5 → 20 Wider (σ) precision

![Statistics diagram](/statistics-images/statimg4.png)

Common Critical Values (z*) Confidence Level z* Value

## 90% Ci 1.645

## 95% Ci 1.96

## 99% Ci 2.576

### 3. t-Distribution for Small Samples

When the population standard deviation (σ) is unknown and sample size is small (n < 30), we use the t- distribution instead of z. The t-distribution is wider/flatter than normal, reflecting extra uncertainty from estimating σ with s. Degrees of freedom (df = n-1) determine how much the t-distribution differs from normal. As df → ∞, t → z.

\`\`\`text
t-distribution vs Normal distribution:
 Normal (n → ∞):      ▄ █ ▄    (thin tails) t
                    ▁▂ ▆ ▆ ▂▁
(df=5):          ₀₀₀₀██₀₀₀₀  (fatter tails = more uncertainty) t
(df=30):         ₀₀▄₀█₀▄₀₀   (nearly normal)
 Small sample CI:   x̄ ± t*(df, α/2) × (s/√n)  With n=10 (df=9), 95% CI: t* = 2.262
(vs z*=1.96)    → CI is wider, reflecting uncertainty about σ
\`\`\`

## Assignment Tasks

\`\`\`text
#   Ass ignmen t Task                                         Difficulty   Type
1
    Collect a sample of 30 data points (e.g., heights, prices).  Easy      Practical
    Calculate the 90%, 95%, and 99% confidence intervals for the
    m ean. Compare their widths and explain the tradeoff.
2   Simulate the confidence interval property: in Python, take 100 Hard    Practical
    sam ples of n=30 from a known population. Construct a 95% CI
    for each. Count how many actually contain the true mean.
3
    A news article reports a poll result with margin of error ±3%. Medium  W ritten
    Explain what this means, what confidence level it likely implies,
    and what sample size would give ±2% margin at 95%
    confidence.
4   Com pare two groups (e.g., male/female heights, or scores from Medium  Practical
    two classes). Construct 95% CIs for each group's mean. Do the
    intervals overlap? What does overlap imply about significance?
\`\`\`

5Research: What is the difference between a confidence interval HardResearch

\`\`\`text
and a credible interval (Bayesian)? Which is more intuitively
interpretable and why?
\`\`\`

## Interview Questions

**Q1:** A poll reports '55% approval with margin of error ±3%'. Explain this to a business executive.

**Answer:** The poll surveyed a random sample and found 55% approval. Based on this sample, we are 95%

confident the true approval rate in the entire population is between 52% and 58%. If the interval spans 50%, the result is uncertain — it could go either way.

**Q2:** Why does increasing sample size narrow the confidence interval?

**Answer:** The CI width is proportional to SE = σ/√n. Larger n means √n is larger, making SE smaller.

Intuitively: more data gives more information about the population, reducing uncertainty. In practice, to halve the CI width, you need to quadruple the sample size (since √4n = 2√n).

**Q3:** You run an experiment. Your 95% CI for the effect is (0.01, 0.05) — entirely positive but very

small. What would you tell the product team?

**Answer:** The effect is statistically significant (CI doesn't include zero), meaning it's real and not just random

noise. However, the practical significance is questionable — the effect is between 0.01 and 0.05. Whether this is worth implementing depends on the cost of the change, the volume of users affected, and the business context. Small but real effects at scale can still matter enormously.

## Knowledge Test

**Q1:** A 95% CI for mean exam score is (72, 80). A student says 'I am 95% sure the true mean is

between 72 and 80.' Explain what is correct and incorrect about this statement.

:::tip
The statement is commonly made but technically incorrect in frequentist statistics. Once the interval
:::

is computed, it either DOES or DOES NOT contain the true mean — there's no probability about it. The correct statement: 'The method used to construct this interval will contain the true mean 95% of the time across repeated samples.' The student's intuitive interpretation is closer to a Bayesian credible interval.

**Q2:** You want to estimate average spending to within ±₹500 with 95% confidence. Previous

studies suggest σ=₹2,000. What sample size is needed?

:::tip
n = (z* × σ / E)² = (1.96 × 2000 / 500)² = (3.92 × 4)² = Wait: (1.96 × 2000 / 500)² = (7.84)² ≈ 61.5 →
:::

n = 62 people. You need at least 62 respondents to achieve a margin of error of ±₹500 with 95% confidence.

**Q3:** Two candidates in an election: Candidate A has 52% support with CI (48%, 56%). Candidate B

has 48% support with CI (44%, 52%). The intervals overlap (48-52%). What conclusion can you draw?

:::tip
The overlapping CIs mean we cannot conclude Candidate A is definitively ahead — the difference
:::

is not statistically significant. The true support for A could be 48% and for B could be 52% (B leads). The election is too close to call based on this data. We need a larger sample to achieve a narrower CI that clearly separates the candidates.`,

8: `# Correlation Analysis

## Overview

Correlation measures the strength and direction of the relationship between two variables. It is one of the most used and most misunderstood tools in data analysis. Understanding correlation is essential for feature selection in machine learning, exploratory data analysis, and business insight generation — but correlation never implies causation without additional evidence.

## Detailed Explanation

### 1. Pearson Correlation Coefficient (r)

Pearson's r measures the strength and direction of the linear relationship between two continuous −1 (perfect negative linear relationship) to +1 (perfect positive linear relationship). variables. It ranges from r = 0 means no linear relationship (but there could be a non-linear one). r is only valid for linear relationships in approximately normally distributed data.

\`\`\`text
r = +1.0
Perfect positive linear:  as X↑, Y↑ perfectly r = +0.8
Strong positive linear:   as X↑, Y↑ generally r = +0.3
Weak positive:            slight upward trend r =  0.0  No linear relationship r = -
0.3
Weak negative:            slight downward trend r = -0.8  Strong negative linear:
as X↑, Y↓ generally r = -1.0
Perfect negative:         as X↑, Y↓ perfectly
Scatter plot shapes: r ≈ +0.9:  ●●●●●   (tight upward band)
r ≈ +0.5:  ●●●     (wide upward cloud)
r ≈  0.0:  ● ●●●  (random cloud)
r ≈ -0.9:  ●●●●●  (tight downward band)
Formula: r = Σ[(xᵢ-x̄)(yᵢ-ȳ)] / (n-1)sₓsᵧ
\`\`\`

### 2. Spearman Rank Correlation

Spearman's ρ (rho) measures the strength and direction of the monotonic relationship between two variables (one increases as the other tends to increase, but not necessarily linearly). It uses ranks rather than raw values, making it robust to outliers and valid for ordinal data. Use Spearman when data is not normally distributed, contains outliers, or is ordinal.

:::scenario
**Real-World Scenario**
A teacher ranks 10 students by Math score and by English score. Spearman's ρ = 0.75 tells us students who rank high in Math tend to rank high in English — but it doesn't
:::

assume the relationship is linear. This is better than Pearson here because ranking data is ordinal.

\`\`\`text
Spearman vs Pearson:
USE PEARSON WHEN:           USE SPEARMAN WHEN:
- Both variables normal      - Non-normal distribution
- No extreme outliers        - Outliers present
- Continuous data            - Ordinal data (ranks, ratings)
- Relationship is linear     - Relationship is monotonic
Both range from -1 to +1. ρ
formula: 1 - (6 Σdᵢ²) / (n(n²-1)) where dᵢ = difference in ranks for each pair
\`\`\`

### 3. Correlation Does NOT Imply Causation

This is the most important warning in statistics. Two variables can be correlated for many reasons other than one causing the other: (1) Reverse causation — B causes A, not A causes B. (2) Common cause — a third variable C causes both A and B. (3) Coincidence (spurious correlation). Always think critically about mechanisms before concluding causation from correlation.

:::scenario
**Real-World Scenario**
Nicolas Cage films strongly correlate with pool drowning deaths (r≈0.67 historically). Obviously there is NO causal relationship — this is a spurious correlation. In business: 'ice cream sales correlate with drowning' — not because ice cream causes drowning, but because heat (confound) drives both. Always ask: what is the mechanism?
:::

\`\`\`text
SPURIOUS CORRELATION EXAMPLES:
Nicolas Cage movies ↔ Pool drownings  (coincidence)
Ice cream sales     ↔ Drowning rates  (common cause: hot weather)
Shoe size           ↔ Reading ability (common cause: age in children)
CAUSAL DIAGRAMS: A → B   (A causes B)          Correlation explained by causation B →
A   (reverse causation)   Correlation, wrong direction assumed C → A
Correlation explained by confounder C   ↓   B
\`\`\`

## Assignment Tasks

\`\`\`text
#   Assignm ent Task                                          Difficulty   Type
1   Dow nload a dataset with at least 4 numerical variables (e.g., Easy    Practical
    iris, Boston housing). Create a correlation matrix. Plot a
    heatmap . Identify the strongest positive and negative
    correlations.
2
    Find two variables that are strongly correlated in your data. Medium   W ritten
    Investigate whether there is a plausible causal mechanism or a
    potential confounder. Write a 150-word analysis.
3   Com pare Pearson and Spearman correlations for the same     Medium     Practical
    data. Create a data set where the results differ significantly.
\`\`\`

Explain why. 4Medium

\`\`\`text
    Resea rch 3 famous spurious correlations (Tyler Vigen's website        Research
    is a great source). For each, identify the likely explanation
    (coincidence, confounder, or reverse causation).
5   In Python: demonstrate that r=0 does not mean 'no relationship' Hard   Practical
    by generating data from y = x² and calculating Pearson r. What
\`\`\`

do you find? Plot the data.

## Interview Questions

**Q1:** How would you explain correlation vs causation to a business stakeholder who says 'our

marketing spend correlates perfectly with revenue — so marketing causes revenue growth'?

**Answer:** While the correlation is real, causation is not guaranteed. Revenue could also be driven by

seasonality, product improvements, or economic conditions that coincidentally align with marketing spend. To establish causation, we'd need controlled experiments (e.g., randomised marketing budget allocation by region) or rigorous quasi-experimental designs that isolate the marketing effect from confounders.

**Q2:** A correlation heatmap shows r=0.95 between two features in your ML model. What action do

you take?

**Answer:** High correlation (multicollinearity) between features means they carry redundant information. I

would investigate whether both are needed, potentially drop one, or use dimensionality reduction (PCA). In linear models, multicollinearity inflates coefficient standard errors and makes interpretation unreliable.

**Q3:** Pearson r = 0 but your scatter plot shows a clear U-shape. How do you interpret this?

**Answer:** Pearson r measures only linear association. A U-shaped relationship has r ≈ 0 because the

positive and negative sides cancel out. This is why always visualising data before computing correlations is essential. I would use a non-linear correlation measure or transform the data.

## Knowledge Test

**Q1:** Variables: study hours (X) and exam score (Y). r = 0.75. Interpret this, calculate r², and explain

what r² means.

:::tip
r = 0.75: strong positive linear relationship — students who study more tend to score higher. r² =
:::

0.75² = 0.5625 = 56.25%. This means 56.25% of the variation in exam scores can be explained by variation in study hours. The remaining 43.75% is explained by other factors (sleep, ability, prior knowledge, etc.).

**Q2:** You find r = -0.90 between years of education and crime rate across Indian states. A politician

concludes 'education reduces crime.' Evaluate this claim.

:::tip
The strong negative correlation is consistent with the claim but does NOT prove causation.
:::

Alternative explanations: (1) Wealthy states have both better education AND lower crime (confounder: wealth/development). (2) Low crime areas attract more educational investment (reverse causation). (3) Other factors (employment, infrastructure, governance) drive both. To establish causation, we'd need controlled studies or natural experiments.

**Q3:** Data has extreme outliers. Pearson r = 0.3. Spearman ρ = 0.8. Which is more informative?

What does the discrepancy tell you?

:::tip
Spearman ρ = 0.8 is more informative here. The extreme outliers are distorting the Pearson
:::

correlation downward. The high Spearman ρ tells us the relationship is actually strong and monotonic when we account for the influence of outliers. The discrepancy is a red flag to investigate the outliers and consider whether the true underlying relationship is strong.`,

9: `# Linear Regression

## Overview

Linear regression models the relationship between a continuous dependent variable (Y) and one or more independent variables (X), enabling prediction and understanding of relationships. It is the foundation of supervised machine learning and remains one of the most widely used analytical tools in business, economics, and science.

## Detailed Explanation

### 1. Simple Linear Regression

Simple Linear Regression fits a straight line through data: Ŷ = β₀ + β₀X. β₀ (intercept) is the predicted Y when X=0. β₀ (slope) is the change in Y for each unit increase in X. The line is fitted by minimising the sum of squared residuals (Ordinary Least Squares). The quality of fit is measured by R².

:::scenario
**Real-World Scenario**
A real estate analyst models: House Price (₹ lakhs) = β₀ + β₀ × Area (sq ft). Fitted: Price = 10 + 0.5 × Area. Interpretation: A house with 0 sq ft costs ₹10 lakh (intercept, often meaningless), and each additional sq ft adds ₹0.5 lakh to the price. Predicted price for 2000 sq ft: 10 +
:::

0.5×2000 = ₹1,010 lakhs.

\`\`\`text
Y = β₀ + β₀X + ε
\`\`\`

![Statistics diagram](/statistics-images/statimg5.png)

### 2. R² — Coefficient of Determination

R² measures the proportion of variance in Y explained by the model. R² = 1 − (SSresidual/SStotal). R² = 1: perfect fit. R² = 0: model explains nothing (no better than predicting the mean). R² should be interpreted alongside domain knowledge — R²=0.7 is excellent for social science but poor for engineering applications. Adjusted R² penalises for adding unhelpful predictors.

\`\`\`text
SStotal   = Σ(yᵢ - ȳ)²     (total variance in Y)
SSresidual = Σ(yᵢ - ŷᵢ)²   (unexplained variance)
SSregression = SStotal - SSresidual (explained variance)
 R² = SSregression / SStotal = 1 - SSresidual/SStotal
Example: R² = 0.75   → 75% of Y's variance explained by model   → 25% remains
unexplained  R² = r² (in simple linear regression) If r = 0.87, R² = 0.87² = 0.76
\`\`\`

### 3. Regression Assumptions (LINE)

Linear regression has four key assumptions remembered as LINE: Linearity (relationship between X and Y is linear), Independence (observations are independent), Normality (residuals are normally distributed), Equal variance/Homoscedasticity (residuals have constant variance). Violating these assumptions makes inference unreliable. Diagnostic plots (residuals vs fitted, Q-Q plot) check these assumptions.

\`\`\`text
L - Linearity:         Residual plot should show no pattern
I - Independence:      Data points collected independently
N - Normality:         Q-Q plot: residuals on straight diagonal line
E - Equal Variance:    Residuals scatter evenly at all fitted values
Residuals vs Fitted (check Linearity + Equal Variance):
GOOD:
(random scatter around zero)
 BAD:
(fan shape = heteroscedasticity)
(curve = non-linear relationship)
\`\`\`

## Assignment Tasks

# Assignment Task Difficulty Type

\`\`\`text
1   Using house price data (Kaggle or UCI), build a simple linear Easy     Practical
    regression with area as predictor. Report β₀, β₀, R², and
    interpret each coefficient.
\`\`\`

2For the same model, check all four LINE assumptions using MediumPractical

\`\`\`text
    diagnostic plots (residual vs fitted, Q-Q plot, scale-location plot).
    Repo rt any violations.
3   Add m ultiple predictors to your regression (multiple linear Medium    Practical
    regression). Compare R² and Adjusted R². What happens to R²
    when  you add an irrelevant variable?
4   Build a regression model with a categorical predictor (e.g., Hard      Practical
    gender, city). How do you handle it? What do the resulting
    coefficients mean?
5
    Resea rch: What is the difference between correlation and   Medium     Research
    regression? In what situations would you use regression
    instead of just reporting correlation?
\`\`\`

## Interview Questions

**Q1:** Explain the interpretation of regression coefficients to a non-technical manager.

**Answer:** The intercept is the predicted value of Y when all X's are zero (sometimes meaningless). Each

slope coefficient tells us: 'holding everything else constant, a one-unit increase in this predictor is associated with a β-unit change in the outcome.' For example: 'Holding all other factors constant, each additional square foot of area is associated with a ₹0.5 lakh increase in house price.'

**Q2:** Your regression model has R²=0.95. Are you happy with it?

**Answer:** Not necessarily. R²=0.95 sounds great, but I'd check: (1) Overfitting — is R² on training data much

higher than on test data? (2) Assumption violations — are residuals homoscedastic and normal? (3) Influential outliers — are a few data points driving the fit? (4) Multicollinearity — are predictors correlated? High R² with violated assumptions gives misleading inference.

**Q3:** How would you handle heteroscedasticity (unequal variance of residuals)?

**Answer:** Options: (1) Log-transform Y (often stabilises variance). (2) Use Weighted Least Squares,

downweighting high-variance observations. (3) Use robust (heteroscedasticity-consistent) standard errors. The choice depends on whether the heteroscedasticity has a pattern and the business context.

## Knowledge Test

**Q1:** Regression: Sales = 200 + 3.5 × Advertising_Spend (₹000s). R² = 0.78. Interpret the intercept,

slope, and R².

:::tip
Intercept (200): Predicted sales when advertising spend is ₹0 — the base sales level from non-
:::

advertising sources. Slope (3.5): Each additional ₹1,000 in advertising spend is associated with an average increase of 3.5 units in sales. R²=0.78: 78% of the variation in sales is explained by advertising spend. The remaining 22% is due to other factors (season, price, competition, etc.).

**Q2:** You build a regression model and the residual plot shows a clear U-shape. What does this

mean and how do you fix it?

:::tip
A U-shaped residual plot indicates a violated linearity assumption — the true relationship between
:::

X and Y is non-linear (curved), but you've fitted a straight line. Fix options: (1) Add a quadratic term (X²) to the model. (2) Log-transform X or Y. (3) Use a non-linear model. The U-shape residuals show the model systematically under-predicts in the middle and over-predicts at the extremes.

**Q3:** You add 5 new predictor variables to your regression. R² increases from 0.72 to 0.73, but

Adjusted R² decreases from 0.70 to 0.68. What does this tell you?

:::tip
The new variables improved the raw fit (R² up slightly) but Adjusted R² decreased — meaning the
:::

new predictors are not contributing enough to justify their complexity. They are likely irrelevant or redundant variables. The model is at risk of overfitting. You should keep only predictors that improve Adjusted R², using model selection techniques (AIC, stepwise, LASSO).`,

10: `# Advanced Hypothesis Testing & Multiple Comparisons

## Overview

Beyond the basic one-sample t-test lie a rich family of hypothesis tests for different data structures and research questions. ANOVA, Chi-square, non-parametric tests, and the critical problem of multiple comparisons are essential for any senior data analyst. The multiple comparisons problem — where running many tests inflates false positive rates — is a key source of non-reproducible findings in science and industry.

## Detailed Explanation

### 1. One-Way ANOVA

ANOVA (Analysis of Variance) tests whether means differ across three or more groups. Using multiple t- tests would inflate Type I error. ANOVA uses the F-statistic: ratio of between-group variance to within- group variance. A large F (and small p-value) means at least one group mean differs significantly. If ANOVA is significant, post-hoc tests (Tukey, Bonferroni) identify WHICH groups differ.

![Statistics diagram](/statistics-images/statimg6.png)

:::scenario
**Real-World Scenario**
A pharmaceutical company tests 4 dosage levels (0mg, 10mg, 20mg, 30mg) of a drug. Using 6 t-tests would give a 26% chance of at least one false positive. ANOVA tests all 4 means simultaneously while controlling α at 5%.
:::

### 2. Chi-Square Tests

The Chi-square test of independence tests whether two categorical variables are associated. It compares observed frequencies with expected frequencies (under H₀ of independence). Chi-square goodness-of-fit tests whether a sample distribution matches a hypothesised distribution. Neither test provides the direction or strength of association — use Cramér's V for effect size.

:::scenario
**Real-World Scenario**
Marketing team wants to know: Does a customer's age group (18-25, 26- 40, 41-60, 60+) affect their preferred product category (Electronics, Clothing, Food)? Chi-square test on
:::

the contingency table answers this.

\`\`\`text
H₀: Age group and product preference are independent
OBSERVED TABLE:
 Electronics  Clothing  Food   Total 18-25:       26-40:     41-60:         60+:
  45          30       25     100
  30          40       30     100
  20          35       45     100
   10          25       65     100
 Total:       105         130      165     400
χ² = Σ [(Observed - Expected)² / Expected]  Large χ² → p < 0.05 → Reject H₀
Conclusion: Age group and product preference ARE associated
\`\`\`

### 3. Multiple Comparisons Problem & Corrections

If you run m independent tests each at α=0.05, the probability of at least one false positive = 1 − (0.95)^m. For m=20 tests: 1−0.95²⁰ = 64% chance of at least one false alarm! Bonferroni correction: divide α by m. False Discovery Rate (FDR) control (Benjamini-Hochberg) is less conservative and widely used in genomics and big data analytics.

\`\`\`text
FAMILY-WISE ERROR RATE WITH m TESTS AT α=0.05:  m=1:   1-(0.95)¹  = 5%   (as
designed)
m=5:   1-(0.95)₀  = 23%  (much higher!)
 m=10:  1-(0.95)¹₀ = 40%
\`\`\`

²₀

\`\`\`text
m=20:  1-(0.95)    = 64%
m=100: 1-(0.95)¹₀₀= 99.4% (almost certain false positive!)
CORRECTIONS:
Bonferroni:  α* = α/m  (conservative, few tests) H
olm-Bonferroni: stepwise version, less conservative
Benjamini-Hochberg (FDR): controls false discovery RATE   → better for large-scale
testing (genomics, ML features)
\`\`\`

### 4. Non-Parametric Tests

Non-parametric tests make no assumption about population distribution. Use them when: data is ordinal, distribution is non-normal and n is small, or outliers are present. Mann-Whitney U = non-parametric alternative to independent samples t-test. Wilcoxon signed-rank = non-parametric alternative to paired t- test. Kruskal-Wallis = non-parametric ANOVA. These tests use ranks rather than raw values. Choosing the Right Test Research Question Parametric Test Non-Parametric Test Compare 2 independent groups 2-sample t-test Mann–Whitney U Compare 2 paired groups Paired t-test Wilcoxon signed-rank Research Question Parametric Test Non-Parametric Test Compare 3+ groups One-way ANOVA Kruskal–Wallis Association between 2 categorical variables (n/a) Chi-square test Linear association between 2 continuous variables Pearson r Spearman ρ

## Assignment Tasks

\`\`\`text
#   Assignm ent Task                                          Difficulty   Type
1
    Using an ANOV A-appropriate dataset (e.g., plant growth under Medium   Practical
    3 fertilisers): run one-way ANOVA. Report F-statistic, p-value,
    and conclusion. If significant, run Tukey's HSD post-hoc test.
\`\`\`

2Simulate the multiple comparisons problem: run 100 t-tests on HardPractical

\`\`\`text
    identical populations. Count how many give p<0.05. Apply
    Bonferroni correction. Compare results.
3
    Cond uct a chi-square test of independence on a real dataset: Medium   Practical
    e.g., survey data with categorical variables. Interpret the result
    and calculate Cramér's V for effect size.
4   Com pare ANO VA and Kruskal-Wallis on the same data. Create  Hard      Research
\`\`\`

a scenario where they disagree. Explain why. 5Hard

\`\`\`text
Rese arch: What is the 'replication crisis'? How do pre-               Resea rch
registration, p-value adjustments, and effect size reporting help
address it? Write 300 words.
\`\`\`

## Interview Questions

**Q1:** Why can't you use multiple t-tests instead of ANOVA when comparing 4 groups?

**Answer:** Running 6 t-tests (all pairs of 4 groups) at α=0.05 each gives a family-wise error rate of

1−(0.95)^6 ≈ 26% — a 26% chance of at least one false positive. ANOVA tests all groups simultaneously with a single F-test, maintaining the overall α at 5%.

**Q2:** Describe a scenario where you would use chi-square instead of t-test.

**Answer:** Chi-square is for categorical variables. Example: Testing whether gender (Male/Female) is

associated with product preference (Electronics/Clothing/Food). There are no means to compare — just counts of observations in each category. Chi-square compares observed vs expected cell frequencies under independence.

**Q3:** A data scientist runs 500 feature importance tests and reports all features with p<0.05 as

significant. What is the problem?

**Answer:** With 500 tests at α=0.05, we'd expect 0.05×500=25 false positives even if no features are truly

important. This is a severe multiple comparisons problem. They should apply FDR correction (Benjamini- Hochberg) which controls the expected false discovery rate across all 500 tests.

## Knowledge Test

**Q1:** A drug company tests 4 treatments in the same study. They run 6 pairwise t-tests, all at

α=0.05, and find 2 significant results. A reviewer criticises the study. Why? What should have been done?

:::tip
The family-wise error rate for 6 tests is 1-(0.95)^6 ≈ 26%. The two 'significant' results could easily be
:::

false positives from chance alone. They should have: (1) Run a one-way ANOVA first to test for any overall group difference. (2) Used a post-hoc correction (Tukey's HSD, Bonferroni) for pairwise comparisons to control the family-wise error rate.

**Q2:** Chi-square test on a contingency table gives χ²=1.2, df=4, p=0.87. Interpret this result.

:::tip
p=0.87 >> 0.05: Fail to reject H₀ of independence. The two categorical variables are NOT
:::

statistically associated. The observed frequencies are very close to what we'd expect if the variables were completely independent. The data provides no evidence of association.

**Q3:** You're building an ML model with 1000 features. You want to select features by testing each

one for significance with the outcome. What statistical concern arises and how do you address it?

:::tip
Multiple comparisons: With 1000 tests at α=0.05, we'd expect 50 false positives by chance.
:::

Approaches: (1) Bonferroni correction: α*=0.05/1000=0.00005 (very conservative, misses real features). (2) FDR control (Benjamini-Hochberg): controls expected proportion of false discoveries — better for feature selection. (3) Regularisation methods (LASSO/Ridge) that select features without explicit hypothesis testing.`,

11: `# Bayesian Statistics

## Overview

Bayesian statistics is a fundamentally different approach to statistical inference — instead of asking 'what is the probability of observing this data if H₀ is true?', Bayesian methods ask 'given this data, what should I believe about the parameters?' It uses Bayes' theorem to update prior beliefs with observed evidence to produce posterior beliefs. Bayesian methods are increasingly central to data science, machine learning, and decision-making.

## Detailed Explanation

### 1. Bayes' Theorem

Bayes' theorem: P(θ|data) ₀ P(data|θ) × P(θ). Posterior = Likelihood × Prior. The prior P(θ) encodes what we believe before seeing data. The likelihood P(data|θ) is how probable the observed data is under different parameter values. The posterior P(θ|data) is our updated belief after seeing the data. Bayesian inference treats parameters as random variables with probability distributions, not as fixed unknown constants.

:::scenario
**Real-World Scenario**
Medical diagnosis: P(Disease) = 0.01 (prior — 1% prevalence). Test sensitivity P(Positive|Disease) = 0.95. Test specificity: P(Negative|No Disease) = 0.90, so P(Positive|No Disease) = 0.10. Posterior: P(Disease|Positive) = (0.95×0.01) / [(0.95×0.01) + (0.10×0.99)] = 0.0095 / 0.1085 ≈ 0.088 = 8.8%. Despite 95% sensitivity, a positive test only has 8.8% probability of disease because the disease is rare!
:::

\`\`\`text
BAYES' THEOREM: P(θ | data) = P(data | θ) × P(θ) / P(data)  Components:   P(θ)
= Prior   (belief before data)   P(data | θ) = Likelihood (probability of data given
θ)   P(θ | data) = Posterior (updated belief after data)   P(data)    = Marginal
likelihood (normalising constant)  Medical example:   Prior:        P(Disease) = 0.01
Likelihood:   P(+test | Disease) = 0.95   Posterior:    P(Disease | +test) = 0.088
The rare prior (1%) dominates despite the 95% accurate test!
\`\`\`

### 2. Prior, Likelihood, and Posterior

Choosing a prior is the most controversial part of Bayesian analysis. Informative priors incorporate genuine domain knowledge. Non-informative (flat/uniform) priors let the data speak. Conjugate priors have the same functional form as the posterior, enabling analytical solutions. As sample size grows, the influence of the prior diminishes — with enough data, Bayesian and frequentist results converge.

\`\`\`text
PRIOR TYPES: Informative:     Strong prior belief (from past studies, domain
knowledge)   Beta(10, 2)    → expect success rate around 83%  Non-informative:
Minimal prior assumptions   Beta(1, 1) = Uniform[0,1] → all values equally likely
Conjugate pairs (analytically convenient):   Prior          Likelihood     Posterior
Beta(α,β)    × Binomial    =  Beta(α+k, β+n-k)   Normal(μ,σ²) × Normal      =  Normal
Gamma(α,β)   × Poisson     =  Gamma  As n increases: Posterior → dominated by
Likelihood, not Prior
\`\`\`

### 3. Bayesian vs Frequentist Inference

Frequentist statistics treats parameters as fixed unknowns, with probability defined as long-run frequency. Bayesian statistics treats parameters as random variables with probability distributions, allowing direct probability statements about parameters. Key differences: Bayesian CIs are credible intervals (genuinely probabilistic); Bayesian hypothesis testing uses Bayes Factors instead of p-values; Bayesian methods naturally incorporate prior knowledge. Aspect **Frequentist * * B a y e s i a n **Parameters Fixed but unknown R a n d o m v a r i a b l e s w i t h distributions **Meaning of Probability Long-run frequency of events D e g r e e o f b e l i e f / u n c e r t a in t y **Interval Interpretation **95% Confidence Interval (CI): If **95% Credible Interval: we repeated the experiment many There is a **95% probability times, **95% of intervals would the true parameter lies in this contain the true parameter range **Hypothesis Evidence **p-value: P(data H₀) **Core Approach Based on sampling theory U p d a t e s b e l ie f s u s i n g p r i o r + data (posterior)

## Assignment Tasks

\`\`\`text
#   Assignment Task                                      Difficulty  Type
\`\`\`

1Implement Bayesian coin flip analysis in Python: start with MediumPractical

\`\`\`text
    Beta(1,1) prior. Update after observing 3 heads in 5 flips. Plot
    prior and posterior. Compute 95% credible interval.
2   M edical diagnosis problem: work through a complete Bayesian Medium    Practical
    calculation for a disease with 0.5% prevalence, 98% sensitivity,
    and 95%  specificity. Interpret the result.
3   Com pare Bayesian and frequentist hypothesis testing on the  Hard      Practical
    sam e dataset: report p-value (frequentist) and Bayes Factor
    (Bayesian). Do they lead to the same conclusion?
4
    Resea rch and implement MCMC (Markov Chain Monte Carlo)      Hard      Research
    sam pling using PyMC3 or Stan to estimate the posterior
    distribution of a regression coefficient.
5   W rite 400 words: When would you choose Bayesian over        Hard      W ritten
    frequentist analysis? Give 3 real data science scenarios where
    Bayesian methods provide genuine advantages.
\`\`\`

## Interview Questions

**Q1:** Explain Bayes' theorem in a business context without using mathematical notation.

**Answer:** 'Imagine we believe there's a 5% chance our marketing email was opened (prior). We then

observe that the customer just made a purchase — which is much more common among email openers (likelihood). Bayes' theorem updates our belief: given the purchase, what's the probability they opened the email?' We start with prior beliefs, observe evidence, and calculate a posterior (updated) probability.

**Q2:** In A/B testing, what is the advantage of Bayesian over frequentist approach?

**Answer:** Bayesian A/B testing: (1) Produces probability statements ('variant B is better than A with 93%

probability') that business stakeholders understand intuitively. (2) Can stop early when sufficient confidence is reached without inflating error rates (the 'peeking problem' affects frequentist tests). (3) Naturally incorporates prior knowledge from previous experiments. (4) Doesn't require fixing sample size in advance.

**Q3:** A critic says 'Bayesian methods are subjective because of the prior.' How do you respond?

**Answer:** The prior is explicit and transparent — a strength, not a weakness. Frequentist methods also

contain implicit assumptions (model choice, test selection). With enough data, the prior is overwhelmed by the likelihood. Using multiple priors (sensitivity analysis) shows whether conclusions are robust. Informative priors encode genuine domain knowledge that improves inference when data is limited.

## Knowledge Test

**Q1:** Coin flip: prior belief is the coin is fair (50% heads). You observe 8 heads in 10 flips. Using

Beta distribution: prior = Beta(1,1), update to posterior. Is the coin unfair?

:::tip
Posterior = Beta(α+k, β+n-k) = Beta(1+8, 1+2) = Beta(9, 3). Posterior mean = 9/(9+3) = 0.75. 95%
:::

credible interval: approximately (0.47, 0.93) using scipy.stats.beta. Since the CI includes 0.5, we cannot conclusively say the coin is unfair, but our posterior belief has shifted substantially toward higher probability of heads.

**Q2:** In COVID testing: prevalence = 2%, sensitivity = 98%, specificity = 95%. Calculate P(has

COVID | positive test). Why might this surprise people?

:::tip
P(COVID|+) = P(+|COVID)×P(COVID) / P(+) = (0.98×0.02) / [(0.98×0.02) + (0.05×0.98)] = 0.0196 /
:::

(0.0196 + 0.049) = 0.0196/0.0686 ≈ 28.6%. Despite 98% sensitivity and 95% specificity, only 28.6% of positive tests indicate actual COVID when prevalence is just 2%. This surprises people because they confuse P(+|COVID) with P(COVID|+) — the base rate matters enormously.

**Q3:** A Bayesian analysis gives a posterior probability of 0.91 that Treatment A is better than

Treatment B. A frequentist analysis gives p=0.06 (not significant at α=0.05). How do you reconcile these?

:::tip
These can coexist: The frequentist p=0.06 means 'given H₀ true (treatments equal), we'd see data
:::

this extreme 6% of the time' — just above the arbitrary 0.05 cutoff. The Bayesian posterior 0.91 means 'given the data and prior, there's 91% probability A is better.' The Bayesian result is more directly actionable for decision-making. The disagreement highlights: (1) p-values are not direct probabilities of hypotheses. (2) Bayesian methods incorporate prior information. (3) The 0.05 threshold is arbitrary. In practice, the business decision should consider effect size, credible intervals, and practical significance.`,

12: `# Regression Diagnostics & Advanced Modelling

## Overview

Building a regression model is only the beginning. Advanced practitioners know that model diagnosis — checking assumptions, identifying influential observations, handling violations — is where most of the work lies. This topic covers the full diagnostic toolkit, regularisation methods (Ridge, Lasso), logistic regression for binary outcomes, and model selection strategies.

## Detailed Explanation

### 1. Regression Diagnostics in Depth

Four diagnostic plots are standard: (1) Residuals vs Fitted — checks linearity and homoscedasticity. (2) Normal Q-Q — checks normality of residuals. (3) Scale-Location — checks constant variance. (4) Residuals vs Leverage — identifies influential observations. Cook's Distance measures how much removing one observation changes all coefficient estimates.

\`\`\`text
DIAGNOSTIC PLOTS INTERPRETATION:
1. Residuals vs Fitted:    GOOD: Random scatter around 0 horizontal line    BAD:
Curve → non-linearity | Fan → heteroscedasticity
2. Normal Q-Q:    GOOD: Points follow diagonal line closely    BAD:  S-curve → heavy
tails | Concave → skewness
3. Scale-Location:    GOOD: Horizontal red line, equal spread    BAD:  Increasing
spread → heteroscedasticity
4. Residuals vs Leverage:    Points outside Cook's distance dashed lines    →
Influential observations (investigate!)  Cook's Distance > 4/n flagged as influential
\`\`\`

### 2. Ridge Regression (L2 Regularisation)

Ridge regression adds a penalty λΣβⱼ² to the OLS cost function. This shrinks all coefficients towards zero but never to exactly zero. Ridge is effective when many predictors contribute weakly (multicollinearity, p ≈ n). The hyperparameter λ controls shrinkage — found via cross-validation. Ridge trades some bias for lower variance, reducing overfitting.

\`\`\`text
OLS Cost:   Σ(yᵢ - ŷᵢ)² Ridge Cost: Σ(yᵢ - ŷᵢ)² + λ Σβⱼ²
 λ=0: Standard OLS (no regularisation)
λ→∞: All coefficients → 0 (intercept only model)
Effect on coefficients: OLS:   β₀=2.4, β₀=3.1, β₀=0.1 (many predictors)
 Ridge: β₀=1.8, β₀=2.3, β₀=0.08 (all shrunk, none zero)
When to use Ridge:
  - Multicollinearity between predictors
 - p (predictors) close to n (observations)
  - All predictors expected to contribute
\`\`\`

### 3. Lasso Regression (L1 Regularisation)

Lasso adds a penalty λΣ|βⱼ| (absolute values). Unlike Ridge, Lasso can shrink some coefficients exactly to zero, performing automatic variable selection. This produces sparse models — useful when many predictors exist but only a few are truly important. The Elastic Net combines Ridge and Lasso penalties.

\`\`\`text
Lasso Cost: Σ(yᵢ - ŷᵢ)² + λ Σ|βⱼ|
 Key difference from Ridge: Lasso CAN set coefficients exactly to zero!
Effect on coefficients: OLS:   β₀=2.4, β₀=3.1, β₀=0.1, β₀=0.02, β₀=3.8 Lasso: β₀=1.9,
β₀=2.6, β₀=0.0, β₀=0.0,  β₀=3.2          β₀ and β₀ eliminated!
Automatic feature selection.
COMPARISON:
 parameter       Ridge             Lasso
                                              Elastic
 Net             Σβⱼ²           Σ|βⱼ|          αΣ|βⱼ|+(1-
 Penalty:                                     α)Σβⱼ²
 Sparsity:       No              Yes                Yes
 Best for:                       Feature       select
                Multicollin.                  Both
\`\`\`

### 4. Logistic Regression

Logistic regression models binary (0/1) outcomes. The logistic (sigmoid) function maps a linear combination of predictors to a probability between 0 and 1. Coefficients are interpreted as log-odds; exponentiating gives odds ratios. Model performance is evaluated by ROC-AUC, confusion matrix, precision, recall — not R². Logistic regression is the standard baseline for binary classification.

\`\`\`text
Logit: log(p/1-p) = β₀ + β₀X₀ + β₀X₀ + ...
Probability: p = 1 / (1 + e^-(β₀+β₀X))
Sigmoid function shape:
X  Coefficient interpretation:
β₀ = log-odds change per unit X increase
 exp(β₀) = odds ratio
exp(1.5) = 4.5 → each unit X increases odds by 4.5×
Performance metrics:   Accuracy, Precision, Recall, F1, ROC-AUC   (Not R² — use log-
loss or pseudo-R²)
\`\`\`

## Assignment Tasks

# Assignment Task Difficulty Type 1

\`\`\`text
    Build a multiple regression model and run all 4 diagnostic plots. Hard Practical
    Identify at least one assumption violation. Apply an appropriate
    fix (transformation, robust SE, WLS).
2
    Implemen t Ridge, Lasso, and Elastic Net using scikit-learn. Use Hard  Practical
    cross-validation to select optimal λ. Compare model coefficients
    and R² across all three.
3   Build a logistic regression model (binary classification). Report Medium Practical
    confusion matrix, precision, recall, F1, and ROC-AUC. Plot the
\`\`\`

ROC curve. 4Hard

\`\`\`text
    Create a dataset with high multicollinearity (correlated               Practical
    predictors). Compare coefficient estimates and standard errors
    under OLS vs Ridge. Explain the difference.
5   Resea rch: What is the bias-variance tradeoff? How does      Hard      Research
    regularisation navigate this tradeoff? Draw the bias-variance
    decom position diagram and explain each component.
\`\`\`

## Interview Questions

**Q1:** When would you choose Lasso over Ridge regression?

**Answer:** Lasso when you have many predictors and believe only a few are truly important — Lasso's zero-

shrinkage property automatically selects features, producing an interpretable sparse model. Ridge when many predictors each contribute a small amount (common in genomics), or when predictors are highly collinear (Lasso arbitrarily picks one from a correlated group). In practice, try both and compare cross- validated performance.

**Q2:** How do you handle an influential outlier identified by Cook's Distance?

**Answer:** First, investigate: Is it a data entry error? (fix or remove). Is it a genuine extreme observation?

(keep it — it's real data). Does removing it change the substantive conclusion? (report results both ways). Never automatically remove outliers — understand them first. Consider robust regression or transformations if influential points are real but extreme.

**Q3:** Explain the ROC curve and AUC to a non-technical audience.

**Answer:** 'Our model predicts whether a transaction is fraud. We can set a threshold: above X probability =

flag as fraud. A low threshold catches more fraud but flags more legitimate transactions (annoying customers). A high threshold avoids false alarms but misses fraud. The ROC curve plots all these tradeoffs visually. AUC = the area under this curve — a single number from 0.5 (random guessing) to 1.0 (perfect). Our model's AUC of 0.92 means it correctly identifies 92% of fraud cases when tested.'

## Knowledge Test

**Q1:** Your regression has R²=0.95 but the residual plot shows a clear U-shape. Is the model good?

What should you do?

:::tip
No — the U-shape residual pattern indicates the linearity assumption is violated. The model is
:::

systematically wrong: it under-predicts at low and high values, over-predicts in the middle. The high R² is misleading. Fix: (1) Add X² (quadratic term) to the model to capture the curvature. (2) Log-transform Y or X. After fixing, run diagnostics again.

**Q2:** You have 500 features and 200 observations. OLS regression is not appropriate. Why? What

methods would you use?

:::tip
p > n (500 features, 200 observations): OLS is undefined — the system is underdetermined
:::

(infinitely many solutions). OLS also dramatically overfits. Appropriate methods: (1) Lasso: performs variable selection, reducing to a manageable sparse model. (2) Ridge: shrinks all coefficients, stabilising estimates even when p > n. (3) Elastic Net: combines both. (4) Dimensionality reduction (PCA) first. Always use cross-validation to select λ.

**Q3:** Logistic regression gives P(default) = 0.73 for a loan applicant. The coefficient for 'debt_ratio'

is 1.8. Interpret the coefficient. Should the bank approve the loan?

:::tip
Coefficient interpretation: exp(1.8) = 6.05. For each unit increase in debt_ratio, the odds of default
:::

increase by 6.05 times (holding other variables constant). This is a substantial risk factor. P(default)=0.73 = 73% probability of default — very high. Whether to approve depends on business risk tolerance and the bank's default threshold policy (typically 0.2-0.3 for conservative lenders). At 73%, this application would almost certainly be rejected.`,

}

export default statisticsContent
