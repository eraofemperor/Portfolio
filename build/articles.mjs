// Short, answer-first articles. Only figures already published in the case studies are used
// (34,500+ records, 14 districts, 29.1%, +64.2%). SQL/DAX snippets are illustrative.
export const ARTICLES = [
  {
    slug: 'kerala-road-accident-analysis-sql-window-functions',
    title: 'How I Analyzed Kerala Road Accident Data with SQL',
    description:
      'Step-by-step: how a fresher data analyst ranked 14 Kerala districts by fatal crashes with SQL window functions, RANK() OVER and a time-of-day comparison.',
    h1: 'How I analyzed Kerala road accident data with SQL window functions',
    published: '2026-11-01',
    answer:
      'To analyze road accident data with SQL window functions, clean the crash records, count fatal crashes per district, then rank districts with RANK() OVER. A second query compares night and day crashes. On 34,500+ Kerala records this showed Thiruvananthapuram and Ernakulam hold 29.1% of fatal crashes.',
    related: ['/projects/kerala-road-accident-analysis/', 'Kerala road accident analysis case study'],
    body: `
      <h2>What question was I trying to answer?</h2>
      <p>Where and when do the deadliest road accidents happen in Kerala? Without a district and time-of-day breakdown, safety effort is spread evenly instead of aimed at the highest-risk places and hours. I used public MoRTH crash data covering all 14 districts.</p>

      <h2>Step 1: How do you clean accident data before running SQL?</h2>
      <p>Profile the schema first. In this dataset the main problems were missing values and inconsistent district names. I standardised the names with Pandas and Excel so that one district is never counted as two. Ranking dirty labels gives wrong rankings, so cleaning always comes before the query.</p>

      <h2>Step 2: How do you rank districts with RANK() OVER?</h2>
      <p>Aggregate fatal crashes per district, then add a window function. Unlike <code>GROUP BY</code> alone, a window function ranks rows without collapsing them, so each district keeps its own row.</p>
      <pre><code>-- Illustrative query (column names simplified)
SELECT district,
       COUNT(*) AS fatal_crashes,
       RANK() OVER (ORDER BY COUNT(*) DESC) AS fatal_rank
FROM crashes
WHERE severity = 'Fatal'
GROUP BY district;</code></pre>

      <h2>Step 3: How do you compare night and day crashes?</h2>
      <p>Use a <code>CASE</code> expression to label each crash as night (20:00 to 04:00) or day, then compare the share of crashes that were fatal in each window. Dividing the night share by the day share gives the fatality severity ratio.</p>
      <pre><code>SELECT CASE WHEN crash_hour &gt;= 20 OR crash_hour &lt; 4
            THEN 'Night' ELSE 'Day' END AS time_window,
       AVG(CASE WHEN severity = 'Fatal' THEN 1.0 ELSE 0 END) AS fatal_share
FROM crashes
GROUP BY 1;</code></pre>

      <h2>What did the analysis show?</h2>
      <p>Thiruvananthapuram and Ernakulam together account for 29.1% of fatal crashes, and crashes between 20:00 and 04:00 have a fatality severity ratio 64.2% higher than the rest of the day. These counts are not adjusted for traffic volume or population, so they show where deaths concentrate, not which roads are riskiest per vehicle.</p>
      <p>The district results were then visualised as Power BI heat maps with time-of-day slicers. Read the full write-up in the <a href="/projects/kerala-road-accident-analysis/">Kerala road accident analysis case study</a>.</p>`,
  },
  {
    slug: 'build-power-bi-dashboard-from-scratch',
    title: 'How to Build a Power BI Dashboard from Scratch',
    description:
      'A practical six-step guide to building a Power BI dashboard from scratch: KPIs, data cleaning, star schema, DAX measures, slicers and validation.',
    h1: 'How to build a Power BI dashboard from scratch',
    published: '2026-11-01',
    answer:
      'To build a Power BI dashboard from scratch, define the business question and KPIs, import and clean the data, model it as a star schema, write DAX measures, add visuals with slicers and drill-downs, then validate the numbers against the source before publishing. Keep the first page focused on one decision.',
    related: ['/projects/kerala-road-accident-analysis/', 'Kerala road accident analysis (Power BI)'],
    body: `
      <h2>Step 1: What business question should the dashboard answer?</h2>
      <p>Write the decision first, for example "which districts need night-time enforcement?", then list the two or three KPIs that answer it. A dashboard without a decision becomes a wall of charts that nobody uses.</p>

      <h2>Step 2: How should you import and clean the data?</h2>
      <p>Load the raw tables, then check data types, nulls, duplicates and inconsistent labels before building anything. Cleaning rules should be repeatable, not one-off edits, so the report still works when new data arrives. The same discipline drives the <a href="/projects/datasentrix/">Datasentrix data-cleaning platform</a>.</p>

      <h2>Step 3: Why use a star schema?</h2>
      <p>A star schema separates numeric facts (crashes, sales) from descriptive dimensions (date, district, product). It keeps DAX simple, filters fast and numbers consistent across every visual.</p>

      <h2>Step 4: How do DAX measures work?</h2>
      <p>A DAX measure calculates a value in the context of the current filters, so one measure works for every slicer selection.</p>
      <pre><code>-- Illustrative measure
Fatal Crashes =
CALCULATE ( COUNTROWS ( Crashes ), Crashes[Severity] = "Fatal" )</code></pre>

      <h2>Step 5: Which visuals and slicers should you add?</h2>
      <p>Start with KPI cards at the top, one main chart for the trend or ranking, and a few slicers (period, region, category). Add drill-downs only where a manager would genuinely ask "why?". In my Kerala road accident analysis the heat map and a time-of-day slicer carry the main message.</p>

      <h2>Step 6: How do you validate before publishing?</h2>
      <p>Reconcile at least one total in the dashboard against the source table or a SQL query. If the numbers differ, fix the model, not the chart. Then publish and write one sentence under each chart saying what it means.</p>
      <p>See a finished example in the <a href="/projects/kerala-road-accident-analysis/">Kerala road accident analysis</a>, or the Excel version of the same approach in the <a href="/projects/bike-sales-dashboard/">bike sales Excel dashboard</a>.</p>`,
  },
  {
    slug: 'data-analyst-fresher-skills-checklist',
    title: 'Data Analyst Fresher Skills: A Practical Checklist',
    description:
      'The skills a data analyst fresher needs: Excel, SQL joins and CTEs, Power BI, Python, statistics and data storytelling, plus projects that prove them.',
    h1: 'What skills does a data analyst fresher need?',
    published: '2026-11-01',
    answer:
      'A data analyst fresher needs advanced Excel, SQL joins, subqueries and CTEs, one BI tool such as Power BI, Python with Pandas for data cleaning, basic statistics and data storytelling. A portfolio of real projects matters more than a list of tools, because it shows the skills working together.',
    related: ['/projects/', 'data analyst portfolio projects'],
    body: `
      <h2>1. Advanced Excel</h2>
      <p>Pivot tables, VLOOKUP and XLOOKUP, slicers and KPI cards still cover most small-team reporting. Build at least one Excel dashboard end to end, such as the <a href="/projects/bike-sales-dashboard/">bike sales Excel dashboard</a>.</p>

      <h2>2. SQL for data analysis</h2>
      <p>Learn joins, subqueries, CTEs, aggregation and window functions such as <code>RANK() OVER</code>. Practise on a real dataset, as in the <a href="/articles/kerala-road-accident-analysis-sql-window-functions/">SQL window functions article</a>.</p>

      <h2>3. A BI tool such as Power BI</h2>
      <p>Know how to model data as a star schema, write basic DAX measures and design a dashboard that answers one question. Follow the <a href="/articles/build-power-bi-dashboard-from-scratch/">Power BI dashboard guide</a>.</p>

      <h2>4. Python for data analysis</h2>
      <p>Pandas for cleaning (missing values, duplicates, inconsistent labels) is the minimum. NumPy and Matplotlib help with checks and quick charts. Data cleaning in Python is what the <a href="/projects/datasentrix/">Datasentrix project</a> automates.</p>

      <h2>5. Statistics and data storytelling</h2>
      <p>Understand averages, distributions and outliers (for example Z-scores), then explain findings in plain language with a recommendation. Hiring managers read the conclusion first.</p>

      <h2>6. A portfolio that proves it</h2>
      <p>Three well-explained projects beat ten tool badges. Browse the <a href="/projects/">data analyst portfolio projects</a> on this site to see how each skill appears in a real case study.</p>`,
  },
];

for (const a of ARTICLES) a.path = `/articles/${a.slug}/`;
