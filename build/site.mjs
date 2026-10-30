// Shared site data: single source of truth for name, bio, links and content.
// Keep NAME / ROLE / BIO word-for-word identical on LinkedIn, GitHub, Medium, etc.

export const DOMAIN = 'https://www.akhilinsights.com';
// IndexNow key (public by design): served at /<key>.txt so Bing/Yahoo/others can verify ownership.
export const INDEXNOW_KEY = '7c1f4a9e2b5d48a0b3e6f91d5c2a8e47';
export const BUILD_DATE = new Date().toISOString().slice(0, 10);

export const PERSON = {
  name: 'Akhil Shibu',
  brand: 'Akhil Insights',
  role: 'Data Analyst & Power BI Specialist',
  bio: 'Data Analyst and Power BI specialist from Kerala, India, working with SQL, Python and ETL pipelines.',
  email: 'akhilshibu03@gmail.com',
  phone: '+91 9061511805',
  phoneHref: '+919061511805',
  github: 'https://github.com/eraofemperor',
  linkedin: 'https://www.linkedin.com/in/akhil-shibu-',
  locality: 'Thiruvananthapuram',
  region: 'Kerala',
  country: 'IN',
  college: 'CHMM College for Advanced Studies',
};

export const PROJECTS = [
  {
    slug: 'kerala-road-accident-analysis',
    name: 'Kerala Road Accident Analysis',
    short: 'Road Accident Analysis in Kerala',
    category: 'Geospatial & Public Safety Analytics',
    tools: ['SQL window functions', 'Power BI', 'Microsoft Excel', 'Pandas', 'MoRTH public data'],
    summary:
      'Statistical investigation of 34,500+ traffic crash records across all 14 Kerala districts, pinpointing high-fatality districts and night-time risk.',
    repo: PERSON.github,
  },
  {
    slug: 'datasentrix',
    name: 'Datasentrix',
    short: 'Datasentrix',
    category: 'Analytics Platform · Python / Django / SQL',
    tools: ['Python', 'Django', 'SQL', 'Data validation', 'Cohort modeling'],
    summary:
      'An automated data cleaning, validation and reporting platform that turns messy multi-source spreadsheets into dependable KPI reports.',
    repo: PERSON.github,
  },
  {
    slug: 'bike-sales-dashboard',
    name: 'Bike Sales Excel Dashboard',
    short: 'Bike Sales Excel Dashboard',
    category: 'Commercial Intelligence · Microsoft Excel',
    tools: ['Microsoft Excel', 'Pivot Tables', 'XLOOKUP', 'Slicers', 'KPI cards'],
    summary:
      'A multi-dimensional Excel workbook analysing product margins, customer purchasing patterns and regional seasonal variance.',
    repo: 'https://github.com/eraofemperor/Bike-Sales-Excel-Dashboard',
  },
];

// FAQ: first paragraph is the 40-60 word direct answer; `more` expands it.
export const FAQS = [
  {
    q: 'Who is Akhil Shibu?',
    a: 'Akhil Shibu is a Data Analyst and Power BI specialist from Thiruvananthapuram, Kerala, India. He holds an MCA from CHMM College for Advanced Studies (Kerala University, 2026) and builds SQL analyses, Python data-cleaning pipelines and Power BI dashboards that turn raw business records into clear decisions.',
    more: 'His portfolio, published under the name Akhil Insights, contains three case studies: a Kerala road accident analysis, the Datasentrix data-cleaning platform and a bike sales Excel dashboard.',
  },
  {
    q: 'What does Akhil build?',
    a: 'Akhil builds data analytics deliverables: SQL queries and models, automated Python and Django data-cleaning pipelines, Power BI dashboards with DAX measures, and Excel models with pivot tables and slicers. Each project starts with a business question and ends with a KPI view that a manager can act on.',
    more: 'The three portfolio projects show this range: public-safety analysis (Power BI and SQL), a validation platform (Python and Django) and a commercial dashboard (Excel).',
  },
  {
    q: 'What is Datasentrix?',
    a: 'Datasentrix is an automated data hygiene and reporting platform built by Akhil Shibu with Python, Django and SQL. It validates uploaded spreadsheets, drops records with null primary keys, isolates outliers with Z-scores and generates KPI reports, so teams stop repeating manual clean-up before every dashboard.',
    more: 'Read the full write-up, including the problem, pipeline stages and tools, on the Datasentrix case study page.',
    link: ['/projects/datasentrix/', 'Datasentrix case study'],
  },
  {
    q: 'Which tools and languages does Akhil Shibu use?',
    a: 'Akhil works with SQL (CTEs, window functions, query optimisation), Microsoft Excel (pivot tables, XLOOKUP, modelling), Power BI (DAX measures, star-schema modelling) and Python (Pandas, NumPy, Matplotlib, Django). He picks the lightest tool that answers the business question reliably.',
    more: 'SQL dialects used in his projects are PostgreSQL and MySQL.',
  },
  {
    q: 'What did the Kerala road accident analysis find?',
    a: 'Across 34,500+ crash records covering all 14 Kerala districts, Thiruvananthapuram and Ernakulam together account for 29.1% of fatal crashes. Crashes between 20:00 and 04:00 show a fatality severity ratio 64.2% higher than the rest of the day, which points to night-time enforcement and lighting as priorities.',
    more: 'The case study explains the data source, method and what "fatality severity ratio" means in plain English.',
    link: ['/projects/kerala-road-accident-analysis/', 'Kerala road accident analysis case study'],
  },
  {
    q: 'How does Akhil approach data cleaning and ETL?',
    a: 'Akhil follows an 8-stage workflow: define the business objective, inspect the schema, validate and clean records, engineer features, model in SQL, build the BI dashboard, diagnose root causes and recommend actions. Cleaning rules are written as repeatable scripts rather than one-off manual edits, so results can be re-run.',
    more: 'This workflow is implemented in code in the Datasentrix project.',
  },
  {
    q: 'Which certificates does Akhil Shibu hold?',
    a: 'Akhil holds three Coursera course certificates: Google Cloud Fundamentals: Core Infrastructure (Google Cloud), Google API Architecture & Integration (Google) and AI Programming & Machine Learning Foundations (IIT faculty). They are course completion certificates, not professional Google Cloud certification exams.',
    more: 'Credentials are listed on the About page.',
  },
  {
    q: 'Is Akhil Shibu available for jobs in Kerala or remote work?',
    a: 'Yes. Akhil is open to data analyst and BI roles on-site or hybrid in Kerala (Technopark Thiruvananthapuram, Infopark Kochi), elsewhere in India, and remote worldwide. He is based in Thiruvananthapuram and open to relocation for the right role.',
    more: 'Use the contact details below to share a role or project brief.',
  },
  {
    q: 'How can I contact Akhil Shibu?',
    a: `Email Akhil at ${PERSON.email} or message him on LinkedIn (${PERSON.linkedin.replace('https://www.', '')}). His code is on GitHub at github.com/eraofemperor. Email is the preferred way to reach him for data analyst, Power BI or project enquiries, and a phone number is on the resume page.`,
    more: 'A resume PDF is available from the About page and an online version is on the resume page.',
    link: ['/about/#contact', 'contact section on the About page'],
  },
  {
    q: 'Where is Akhil Shibu based and what does he specialise in?',
    a: 'Akhil Shibu is based in Thiruvananthapuram, Kerala, India. He specialises in data analytics and business intelligence: SQL analysis, Power BI dashboards with DAX, Excel reporting and Python data cleaning. He is open to roles at Technopark and Infopark, across India, and remote.',
    more: 'See the resume page for a one-page summary of skills and projects.',
    link: ['/resume/', 'online resume'],
  },
  {
    q: 'How does SQL help in data analytics?',
    a: 'SQL lets an analyst pull, filter, join and aggregate data directly from a database instead of copying spreadsheets. Window functions such as RANK() OVER rank rows within groups without collapsing them, which is how the Kerala road accident analysis ranks districts by fatal crashes.',
    more: 'Queries are repeatable, so the same result can be regenerated when new data arrives.',
    link: ['/projects/kerala-road-accident-analysis/', 'Kerala road accident analysis'],
  },
  {
    q: 'What is the difference between Power BI and Excel dashboards?',
    a: 'Excel dashboards use pivot tables, slicers and formulas inside a workbook, which suits small teams and quick analysis. Power BI uses a data model with DAX measures and shared reports, which scales better to larger datasets and many viewers. Akhil has built one of each.',
    more: 'Compare the bike sales Excel dashboard with the Power BI work in the Kerala road accident analysis.',
    link: ['/projects/bike-sales-dashboard/', 'bike sales Excel dashboard'],
  },
  {
    q: 'What is an automated ETL pipeline?',
    a: 'An automated ETL pipeline extracts raw data from its sources, transforms it by validating and cleaning records, and loads the result into a store for reporting, all without manual steps. Datasentrix applies this idea to spreadsheets: schema checks, null-key removal and Z-score outlier flags run on every file.',
    more: 'Because the rules are code, the output is repeatable and auditable.',
    link: ['/projects/datasentrix/', 'Datasentrix case study'],
  },
  {
    q: 'What skills does a junior data analyst need?',
    a: 'A junior data analyst needs SQL for querying, Excel for quick analysis, one BI tool such as Power BI, basic Python with Pandas for cleaning, and the habit of checking data quality before reporting. Clear communication of findings matters as much as the tools. Akhil shows these skills in three projects.',
    more: 'Each skill is demonstrated on a case study page rather than only listed.',
    link: ['/projects/', 'data analytics projects'],
  },
  {
    q: 'How does Python help with data cleaning?',
    a: 'Python with Pandas can find missing values, remove duplicates, standardise inconsistent labels and flag outliers in a few repeatable lines, replacing manual spreadsheet edits. In the Kerala road accident analysis, Pandas was used to standardise district names before the SQL ranking and Power BI visuals were built.',
    more: 'Scripts can be re-run on new files, which keeps results consistent.',
  },
];

export const PAGES = {
  home: {
    path: '/',
    title: 'Akhil Shibu | Data Analyst & Power BI Specialist, Kerala',
    description:
      'Akhil Shibu is a Kerala-based data analyst using SQL, Power BI and Python. See case studies, incl. a 34,500-record Kerala road accident analysis.',
  },
  about: {
    path: '/about/',
    title: 'About Akhil Shibu, Data Analyst in Kerala | Akhil Insights',
    description:
      'Meet Akhil Shibu, an MCA graduate and data analyst from Thiruvananthapuram. Read his background, credentials and how to hire him for BI work today.',
  },
  projects: {
    path: '/projects/',
    title: 'Data Analytics Projects & Case Studies | Akhil Insights',
    description:
      'Browse three data analytics case studies by Akhil Shibu: Kerala road accidents, the Datasentrix cleaning platform and a bike sales dashboard. Read now.',
  },
  'kerala-road-accident-analysis': {
    path: '/projects/kerala-road-accident-analysis/',
    title: 'Kerala Road Accident Analysis | Akhil Insights',
    description:
      'Analysis of 34,500+ Kerala crash records across 14 districts: 29.1% of fatal crashes sit in two districts and night crashes are deadlier. See the method.',
  },
  datasentrix: {
    path: '/projects/datasentrix/',
    title: 'Datasentrix Data Cleaning Platform | Akhil Insights',
    description:
      'Datasentrix is a Python and Django platform that validates spreadsheets, removes outliers and builds KPI reports automatically. See how it works and why.',
  },
  'bike-sales-dashboard': {
    path: '/projects/bike-sales-dashboard/',
    title: 'Bike Sales Excel Dashboard Case Study | Akhil Insights',
    description:
      'An Excel bike sales dashboard with pivot tables, slicers and KPI cards for margin, category and regional trends. See the problem, tools and approach here.',
  },
  resume: {
    path: '/resume/',
    title: 'Akhil Shibu Resume | Data Analyst, SQL & Power BI',
    description:
      'Online resume of Akhil Shibu, Thiruvananthapuram data analyst: MCA 2026, SQL, Power BI, Python and Excel skills, three case studies and contact details.',
  },
  faq: {
    path: '/faq/',
    title: 'Data Analyst FAQ: Skills, Tools & Hiring | Akhil Insights',
    description:
      'Answers about Akhil Shibu: what he builds, what Datasentrix is, his tools, certificates and availability in Kerala or remote. Get the facts in one place.',
  },
};


