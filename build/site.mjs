// Shared site data: single source of truth for name, bio, links and content.
// Keep NAME / ROLE / BIO word-for-word identical on LinkedIn, GitHub, Medium, etc.

import { ARTICLES } from './articles.mjs';
export { ARTICLES };

export const DOMAIN = 'https://www.akhilinsights.com';
// Bing Webmaster Tools: paste the msvalidate.01 content value here to emit the verification meta tag.
export const BING_VERIFICATION = '';
// IndexNow key (public by design): served at /<key>.txt so Bing/Yahoo/others can verify ownership.
export const INDEXNOW_KEY = '7c1f4a9e2b5d48a0b3e6f91d5c2a8e47';
export const BUILD_DATE = new Date().toISOString().slice(0, 10);

export const PERSON = {
  name: 'Akhil Shibu',
  givenName: 'Akhil',
  familyName: 'Shibu',
  brand: 'Akhil Insights',
  alternateNames: [
    'Akhil',
    'Akhil Shibu',
    'Akhil Insights',
    'Akhil Shibu Data Analyst',
    'Akhil Shibu Business Analyst',
    'Akhil Shibu Power BI',
    'Akhil Shibu Kerala',
  ],
  role: 'Fresher Data Analyst & Business Analyst (Power BI, SQL)',
  bio: 'Fresher Data Analyst, Business Analyst and Power BI specialist (MCA 2026, CGPA 8.48) from Kerala, India, working with SQL, Excel, Python and ETL pipelines.',
  // One plain entity sentence, repeated on every page (footer) and in llms.txt for AI engines.
  intro: 'Akhil Shibu is a fresher Data Analyst and Business Analyst (MCA 2026, CGPA 8.48) from Thiruvananthapuram, Kerala, India, skilled in SQL, Power BI, Excel and Python.',
  whoIsAkhil:
    'Akhil Shibu (also searched as Akhil and founder of Akhil Insights) is an Indian Data Analyst, Business Intelligence Analyst, and Business Analyst from Thiruvananthapuram, Kerala. An MCA graduate from the University of Kerala (2026, CGPA 8.48), he specialises in SQL, Power BI, Microsoft Excel, Python, automated ETL data cleaning, and KPI dashboarding.',
  email: 'akhilshibu03@gmail.com',
  phone: '+91 9061511805',
  phoneHref: '+919061511805',
  github: 'https://github.com/eraofemperor',
  linkedin: 'https://www.linkedin.com/in/-akhilshibu',
  address: 'Akhilandom, Puthukkari, Chirayinkeezhu',
  locality: 'Thiruvananthapuram',
  region: 'Kerala',
  country: 'IN',
  college: 'CHMM College for Advanced Studies',
  university: 'University of Kerala',
  mcaCgpa: '8.48',
  bcaCgpa: '7.4',
  resumeSubtitle: 'Data Analyst | Business Intelligence | Business Analyst',
  resumeSummary:
    'Akhil Shibu is an MCA graduate from Kerala University (2026, CGPA: 8.48) with hands-on experience in data analysis, data cleaning, ETL pipelines, SQL, Python, Power BI, and Microsoft Excel. Skilled in extracting and processing data from PDF reports, performing exploratory data analysis (EDA), building interactive KPI dashboards, and validating data quality. Developed DataSentrix, a data analytics platform tested on a 200,000-row dataset. Also experienced in API testing and functional testing through internships. Seeking opportunities as a Data Analyst, Business Intelligence Analyst, Business Analyst, Power BI Developer, or SQL Analyst.',
  targetRoles: [
    'Data Analyst',
    'Junior Data Analyst',
    'Data Analyst Trainee',
    'Business Intelligence (BI) Analyst',
    'Business Analyst',
    'Associate Business Analyst',
    'Power BI Developer',
    'SQL Data Analyst',
    'MIS & Reporting Analyst',
    'Data Quality Analyst',
  ],
  targetLocations: [
    'Thiruvananthapuram (Technopark)',
    'Kochi / Ernakulam (Infopark)',
    'Kozhikode (Cyberpark)',
    'Bengaluru (Bangalore)',
    'Chennai',
    'Hyderabad',
    'Pune',
    'Mumbai',
    'Delhi NCR',
    'Remote Worldwide',
  ],
  extraSameAs: [],
};

export const EXPERIENCE = [
  {
    role: 'Quality Assurance Intern',
    company: 'Kerala Sellers',
    period: '11/2025 – 12/2025',
    location: 'Thiruvananthapuram, Kerala',
    bullets: [
      'Performed manual and functional testing across buyer and seller modules of a hyperlocal e-commerce platform.',
      'Tested APIs using Postman and documented defects and test results using Excel, Word, and Google Sheets.',
    ],
  },
  {
    role: 'Python / Django Intern',
    company: 'Digital Product Solutions',
    period: '04/2025 – 05/2025',
    location: 'Thiruvananthapuram, Kerala',
    bullets: [
      'Developed project Evalora, a project that converts handwritten text into digital text using a model accessed through an API.',
    ],
  },
];

export const EDUCATION = [
  {
    degree: 'Master of Computer Applications (MCA)',
    shortDegree: 'MCA',
    institution: 'CHMM College for Advanced Studies, University of Kerala',
    period: '08/2024 – 10/2026',
    cgpa: '8.48',
    details: 'Coursework includes relational databases, SQL query optimisation, Python, algorithms and data structures, and web architecture.',
  },
  {
    degree: 'Bachelor of Computer Applications (BCA)',
    shortDegree: 'BCA',
    institution: 'CHMM College for Advanced Studies, University of Kerala',
    period: '11/2021 – 04/2024',
    cgpa: '7.4',
    details: 'Core foundations in computer science, database management systems, programming, and software engineering.',
  },
];

export const CERTIFICATES = [
  {
    title: 'Google AI Essentials',
    issuer: 'Coursera / Google',
    type: 'Course certificate',
  },
  {
    title: 'Prompt Engineering',
    issuer: 'Infosys Springboard',
    type: 'Course certificate',
  },
  {
    title: 'Participant, 24-Hour Hackathon',
    issuer: 'TKM College of Engineering',
    type: 'Hackathon',
  },
];

export const SKILLS_CATEGORIES = [
  {
    area: 'Analytics & Business Intelligence',
    skills: 'Power BI (Data Modeling, Star Schema, DAX Measures, KPI Dashboards, Drill-downs), Microsoft Excel (Pivot Tables, Power Query, VLOOKUP, XLOOKUP, Slicers, Dashboards), Data Visualization, KPI & Variance Analysis, Data Cleaning, Exploratory Data Analysis (EDA), Statistical Analysis, Data Storytelling, MIS & Business Reporting.',
  },
  {
    area: 'Programming & Databases',
    skills: 'Python (Pandas, NumPy, Matplotlib, Django), SQL (Joins, Aggregations, Subqueries, CTEs, Window Functions), ETL Pipelines, Schema Validation, PostgreSQL, MySQL, SQLite.',
  },
  {
    area: 'Business Analysis & Quality Assurance',
    skills: 'Requirements Gathering, Stakeholder Reporting, Root Cause Analysis, Manual & Functional Testing, REST API Testing, Defect Documentation, UAT, Data Quality Assurance.',
  },
  {
    area: 'Tools & Workflow',
    skills: 'Postman, Google Sheets, Git & GitHub, ECharts, Notion, MS PowerPoint, MS Word.',
  },
];

export const PROJECTS = [
  {
    slug: 'kerala-road-accident-analysis',
    name: 'Road Accident Analytics (2020–2025)',
    short: 'Road Accident Analysis in Kerala',
    category: 'Geospatial & Public Safety Analytics',
    period: '09/2026 – 10/2026',
    tools: ['Python', 'SQL', 'Power BI', 'Microsoft Excel', 'Pandas'],
    keywords: ['data analyst case study', 'road accident analysis India', 'Kerala accident data analysis', 'SQL project with dataset', 'Power BI dashboard examples'],
    metrics: [['29.1%', 'of fatal crashes in 2 districts'], ['+64.2%', 'night-time fatality severity']],
    bullets: [
      'Cleaned 6 years of Kerala Police district-wise accident data from PDFs into a 114-row dataset, resolving inconsistent district reporting and reconciling totals against source.',
      'Found accidents rose 79% (2020 to 2025) while deaths rose only 25%; top 5 districts account for 39% of accidents, and Palakkad has the highest fatality rate (12.3 per 100) despite ranking 6th in volume.',
      'Built an interactive Power BI dashboard (KPI cards, YoY trends, district map, drill-downs) to guide enforcement and awareness spending.',
    ],
    repoLabel: 'GitHub profile',
    summary:
      'Statistical investigation of 34,500+ traffic crash records across all 14 Kerala districts, pinpointing high-fatality districts and night-time risk.',
    repo: PERSON.github,
  },
  {
    slug: 'datasentrix',
    name: 'DataSentrix: Data Analytics Platform',
    short: 'Datasentrix',
    category: 'Analytics Platform - Python / Django / SQL',
    period: '01/2026 – Present',
    tools: ['Python', 'Django', 'PostgreSQL', 'Pandas', 'ECharts', 'Matplotlib', 'API', 'SQLite'],
    keywords: ['data cleaning in Python', 'ETL pipeline', 'data analyst portfolio project', 'Python for data analysis'],
    metrics: [['200,000-row', 'dataset tested with quality rules'], ['Zero data loss', 'automated cleaning & KPIs']],
    bullets: [
      'Built a web-based analytics platform with dataset uploads, data cleaning, KPI metrics, charts, and AI-assisted insights.',
      'Tested on a 200,000-row dataset with defined data quality rules (duplicates, missing values, outliers); verified accuracy via functional testing against an existing tool.',
    ],
    repoLabel: 'GitHub profile',
    summary:
      'A web-based data analytics platform tested on a 200,000-row dataset with defined data cleaning rules, KPI metrics, charts and AI-assisted insights.',
    repo: PERSON.github,
  },
  {
    slug: 'bike-sales-dashboard',
    name: 'Bike Sales Analysis',
    short: 'Bike Sales Excel Dashboard',
    category: 'Commercial Intelligence - Microsoft Excel',
    period: '08/2026 – 09/2026',
    tools: ['Microsoft Excel', 'Pivot Tables', 'Power Query', 'XLOOKUP', 'Slicers', 'KPI Cards'],
    keywords: ['Excel sales dashboard project', 'Excel dashboard', 'advanced Excel', 'VLOOKUP and XLOOKUP', 'data analyst case study'],
    metrics: [['~57% income', 'driven by North America'], ['~22% income', 'driven by Pacific region']],
    bullets: [
      'Cleaned a Kaggle dataset and built Pivot Tables, charts, and an interactive Excel dashboard to analyse sales patterns.',
      'Found North America drives ~57% of income and Pacific ~22%; analysed how commute distance and education affect bike purchases.',
    ],
    repoLabel: 'GitHub',
    summary:
      'Cleaned Kaggle bike sales dataset and created an interactive Excel dashboard showing how commute distance, education and geography drive purchase behavior.',
    repo: 'https://github.com/eraofemperor/Bike-Sales-Excel-Dashboard',
  },
];

// FAQ: first paragraph is the 40-60 word direct answer; `more` expands it.
// AEO questions recruiters and voice assistants ask (shown on home, about and FAQ pages).
const F = {
  kochi: {
    q: 'Who is a good fresher data analyst in Kochi?',
    a: 'Akhil Shibu is a fresher data analyst and business analyst (MCA 2026) based in Thiruvananthapuram, Kerala, and open to roles in Kochi, including Infopark. He works with SQL, Power BI, Excel and Python, and shows the skills in three case studies, including a 34,500-record Kerala road accident analysis.',
    more: 'Recruiters in Kochi can review the portfolio, resume and contact details on this site.',
    link: ['/resume/', 'online resume'],
  },
  kerala: {
    q: 'Who is a good fresher data analyst in Kerala?',
    a: 'Akhil Shibu is a fresher data analyst from Thiruvananthapuram with an MCA from CHMM College for Advanced Studies (Kerala University, 2026). He has built an SQL and Power BI road accident analysis of all 14 Kerala districts, a Python and Django data-cleaning platform and an Excel sales dashboard.',
    more: 'He is open to data analyst and business analyst roles across Kerala, including Technopark and Infopark.',
    link: ['/projects/', 'data analyst portfolio projects'],
  },
  india: {
    q: 'Who is a good fresher data analyst in India?',
    a: 'Akhil Shibu is a fresher data analyst and business analyst from Kerala who is open to on-site, hybrid and remote roles across India. He holds an MCA (2026), uses SQL, Power BI, Excel and Python, and proves each skill with a published case study instead of just listing tools.',
    more: 'His resume and contact details are available on the About and Resume pages.',
    link: ['/about/#contact', 'contact Akhil Shibu'],
  },
  powerbisql: {
    q: 'Which data analyst in Kerala knows Power BI and SQL?',
    a: 'Akhil Shibu, a fresher data analyst from Thiruvananthapuram, Kerala, knows Power BI and SQL. He ranked districts with SQL window functions and built Power BI heat maps with time-of-day slicers in his Kerala road accident analysis, and he has also built an Excel dashboard and a Python data-cleaning platform.',
    more: '',
    link: ['/projects/kerala-road-accident-analysis/', 'Kerala road accident analysis'],
  },
  skills: {
    q: 'What skills does a data analyst fresher need?',
    a: 'A data analyst fresher needs SQL joins, subqueries and CTEs, advanced Excel (pivot tables, VLOOKUP and XLOOKUP), one BI tool such as Power BI, Python with Pandas for data cleaning, basic statistics and data storytelling. Employers also value a portfolio that proves these skills on real datasets.',
    more: 'Akhil demonstrates each skill on a case study page.',
    link: ['/articles/data-analyst-fresher-skills-checklist/', 'data analyst fresher skills checklist'],
  },
  sqlwindow: {
    q: 'How do I analyze road accident data using SQL window functions?',
    a: 'Clean the crash records first, then group by district and count fatal crashes. Add RANK() OVER (ORDER BY fatal_crashes DESC) to rank districts without collapsing rows, and use PARTITION BY to compare hours or years within a district. Akhil ranked districts this way on 34,500+ Kerala crash records.',
    more: '',
    link: ['/articles/kerala-road-accident-analysis-sql-window-functions/', 'step-by-step SQL window functions article'],
  },
  buildpbi: {
    q: 'How do you build a Power BI dashboard from scratch?',
    a: 'Define the business question and KPIs, import and clean the data, then model it as a star schema with fact and dimension tables. Write DAX measures, add visuals with slicers and drill-downs, check the numbers against the source, and publish. Start with one page that answers one decision.',
    more: '',
    link: ['/articles/build-power-bi-dashboard-from-scratch/', 'Power BI dashboard from scratch guide'],
  },
  whois: {
    q: 'Who is Akhil and what is Akhil Insights?',
    a: 'Akhil, full name Akhil Shibu, is a fresher Data Analyst, Business Intelligence Analyst, and Business Analyst from Thiruvananthapuram, Kerala, India. Akhil Insights (akhilinsights.com) is his official portfolio showcasing SQL, Power BI, Python, and Microsoft Excel case studies, analytics articles, and his single-page ATS resume.',
    more: 'He completed his MCA (CGPA 8.48) and BCA (CGPA 7.4) under the University of Kerala.',
    link: ['/about/', 'about Akhil Shibu'],
  },
  trivandrum: {
    q: 'Who is a good fresher data analyst in Thiruvananthapuram (Trivandrum)?',
    a: 'Akhil Shibu is a fresher Data Analyst and Business Analyst based in Chirayinkeezhu, Thiruvananthapuram (Trivandrum), Kerala, available immediately for roles at Technopark and across the city. He combines an MCA degree (8.48 CGPA) with hands-on SQL, Power BI, Python, and Excel projects plus QA and Django internships.',
    more: 'View his single-page resume or email him directly for interviews in Thiruvananthapuram.',
    link: ['/resume/', 'Akhil Shibu resume'],
  },
  ba: {
    q: 'Can Akhil Shibu work as a Business Analyst or BI Analyst?',
    a: 'Yes. Akhil Shibu targets Business Analyst, Business Intelligence Analyst, Power BI Developer, SQL Analyst, and MIS Reporting Analyst roles alongside Data Analyst positions. His projects translate stakeholder questions into KPI scorecards, variance checks, DAX models, and interactive dashboards, backed by functional and API testing internship experience.',
    more: 'He documents requirements, validates data quality rules, and presents actionable business recommendations.',
    link: ['/projects/', 'business intelligence case studies'],
  },
  internships: {
    q: 'What internship and industry experience does Akhil Shibu have?',
    a: 'Akhil Shibu completed two internships in Thiruvananthapuram, Kerala: Quality Assurance Intern at Kerala Sellers, where he ran manual, functional, and Postman API testing across e-commerce modules, and Python/Django Intern at Digital Product Solutions, where he built Evalora to convert handwritten notes into digital text via an API.',
    more: 'Defect logs and test cases were tracked in Microsoft Excel, Word, and Google Sheets.',
    link: ['/resume/', 'professional experience on resume'],
  },
  education: {
    q: 'What is Akhil Shibu’s educational qualification and CGPA?',
    a: 'Akhil Shibu holds a Master of Computer Applications (MCA, 2024–2026, Overall CGPA 8.48) and a Bachelor of Computer Applications (BCA, 2021–2024, Overall CGPA 7.4) from CHMM College for Advanced Studies, affiliated with the University of Kerala, covering relational databases, SQL optimization, Python, and software engineering.',
    more: 'He also holds Google AI Essentials (Coursera) and Prompt Engineering (Infosys Springboard) certificates.',
    link: ['/about/#credentials', 'education and certificates'],
  },
  resume: {
    q: 'Where can I view or download Akhil Shibu’s ATS-friendly resume?',
    a: 'You can read Akhil Shibu’s complete ATS-friendly single-page resume online at akhilinsights.com/resume/ or download the print-ready A4 PDF directly from the navigation bar and resume page. It lists his summary, SQL, Power BI, Python, and Excel skills, two internships, MCA and BCA degrees, certificates, and three analytics projects.',
    more: 'Use the Print / Save PDF button or direct PDF download link anytime.',
    link: ['/resume/', 'download Akhil Shibu resume'],
  },
  panindia: {
    q: 'Is Akhil Shibu open to Data Analyst jobs in Bengaluru, Chennai, Hyderabad or remote?',
    a: 'Yes. While based in Thiruvananthapuram, Kerala, Akhil Shibu is open to relocating for full-time or trainee Data Analyst, BI Analyst, and Business Analyst roles in Bengaluru (Bangalore), Chennai, Hyderabad, Kochi, Pune, Mumbai, and Delhi NCR, as well as hybrid and remote analytics positions worldwide.',
    more: 'Reach out by email or LinkedIn with role details and location requirements.',
    link: ['/about/#contact', 'hire Akhil Shibu'],
  },
};

const BASE_FAQS = [
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
    a: 'Akhil holds Google AI Essentials from Coursera and Google, Prompt Engineering from Infosys Springboard, and participated in the 24-hour Hackathon at TKM College of Engineering. These credentials complement his MCA coursework in database management, algorithms, data structures and web architecture.',
    more: 'Credentials and coursework are listed on the About and Resume pages.',
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
    q: 'How does Python help with data cleaning?',
    a: 'Python with Pandas can find missing values, remove duplicates, standardise inconsistent labels and flag outliers in a few repeatable lines, replacing manual spreadsheet edits. In the Kerala road accident analysis, Pandas was used to standardise district names before the SQL ranking and Power BI visuals were built.',
    more: 'Scripts can be re-run on new files, which keeps results consistent.',
  },
];

export const FAQS = [
  ...BASE_FAQS,
  F.whois,
  F.trivandrum,
  F.kochi,
  F.kerala,
  F.india,
  F.panindia,
  F.powerbisql,
  F.ba,
  F.internships,
  F.education,
  F.resume,
  F.skills,
  F.sqlwindow,
  F.buildpbi,
];
export const HOME_FAQS = [BASE_FAQS[0], F.whois, F.trivandrum, F.kochi, F.kerala, F.india, F.powerbisql, F.ba, F.skills];
export const ABOUT_FAQS = [BASE_FAQS[0], F.whois, F.education, F.internships, F.ba, F.powerbisql, F.skills, F.sqlwindow, F.buildpbi, F.kerala, F.india, F.panindia];
export const RESUME_FAQS = [BASE_FAQS[0], F.resume, F.ba, F.internships, F.education, F.panindia];

export const CORE_KEYWORDS = [
  'Akhil',
  'Akhil Shibu',
  'Who is Akhil Shibu',
  'Akhil Insights',
  'Akhil Shibu Data Analyst',
  'Akhil Shibu Business Analyst',
  'Akhil Shibu Power BI',
  'Akhil Shibu Resume',
  'Akhil Shibu Portfolio',
  'Akhil Shibu Kerala',
  'Akhil Shibu Thiruvananthapuram',
  'Data Analyst Fresher Kerala',
  'Fresher Data Analyst India',
  'Business Intelligence Analyst Fresher',
  'Entry Level Business Analyst',
  'Power BI Developer Fresher',
  'SQL Data Analyst',
  'Python Data Cleaning',
  'Advanced Excel Dashboard',
  'Technopark Data Analyst',
  'Infopark Kochi Data Analyst',
  'MCA Data Analyst Fresher',
  'DataSentrix',
];

export const PAGES = {
  home: {
    path: '/',
    title: 'Data Analyst Fresher Kerala | Akhil Shibu, Power BI & SQL',
    description:
      'Akhil Shibu is a fresher data analyst and business analyst in Kerala (MCA 2026) skilled in SQL, Power BI, Excel and Python. View projects and hire him.',
  },
  about: {
    path: '/about/',
    title: 'Akhil Shibu: Fresher Data Analyst in Thiruvananthapuram',
    description:
      'About Akhil Shibu, a fresher data analyst and MCA 2026 graduate from Thiruvananthapuram (Trivandrum). Read his background, skills and credentials.',
  },
  projects: {
    path: '/projects/',
    title: 'Data Analyst Portfolio Projects | Akhil Shibu',
    description:
      'Data analyst portfolio projects by Akhil Shibu: Kerala road accident analysis (SQL, Power BI), a Python cleaning platform and an Excel sales dashboard.',
  },
  'kerala-road-accident-analysis': {
    path: '/projects/kerala-road-accident-analysis/',
    title: 'Kerala Road Accident Analysis: SQL & Power BI Project',
    description:
      'Kerala accident data analysis of 34,500+ crash records in 14 districts: SQL window functions and Power BI show 29.1% of fatal crashes in two districts.',
  },
  datasentrix: {
    path: '/projects/datasentrix/',
    title: 'Datasentrix: Python Data Cleaning & ETL Project | Akhil',
    description:
      'Datasentrix is a Python and Django data cleaning and ETL project that validates spreadsheets, flags outliers and builds KPI reports. See how it works.',
  },
  'bike-sales-dashboard': {
    path: '/projects/bike-sales-dashboard/',
    title: 'Excel Sales Dashboard Project: Bike Sales Case Study',
    description:
      'Excel sales dashboard project with pivot tables, XLOOKUP, slicers and KPI cards for margin, category and regional trends. See the problem and approach.',
  },
  resume: {
    path: '/resume/',
    title: 'Fresher Data Analyst Resume | Akhil Shibu, SQL & Power BI',
    description:
      'Online resume of Akhil Shibu, fresher data analyst in Thiruvananthapuram: MCA 2026, SQL, Power BI, Python and Excel skills and three projects.',
  },
  faq: {
    path: '/faq/',
    title: 'Fresher Data Analyst FAQ: Kerala, Power BI & SQL',
    description:
      'Answers about Akhil Shibu, a fresher data analyst in Kerala: Power BI and SQL skills, Kochi and India availability, projects, certificates and hiring.',
  },
  articles: {
    path: '/articles/',
    title: 'Data Analyst Articles: SQL & Power BI | Akhil Shibu',
    description:
      'Short articles by Akhil Shibu on SQL window functions, building a Power BI dashboard from scratch and the skills a fresher data analyst needs. Read now.',
  },
};

for (const a of ARTICLES) PAGES['article-' + a.slug] = { path: a.path, title: a.title, description: a.description };


