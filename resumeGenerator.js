const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Base Resume Data for the 4 roles
const baseProfiles = {
    'JAVA DEVELOPER': {
        name: 'John Doe',
        title: 'Senior Java Developer',
        contact: {
            email: 'john.doe.dev@example.com',
            phone: '+1 (555) 019-2834',
            location: 'Dallas, TX',
            linkedin: 'linkedin.com/in/johndoe-demo',
            github: 'github.com/johndoe-demo'
        },
        summary: 'Highly skilled and results-driven Senior Java Developer with over 7 years of experience designing, building, and deploying robust enterprise applications. Expert in microservices architecture, RESTful APIs, cloud platforms, and agile software development methodologies. Proven track record of optimizing application performance and scaling cloud infrastructure.',
        skills: ['Java 11/17/21', 'Spring Boot', 'Spring Cloud', 'Hibernate/JPA', 'Microservices', 'RESTful APIs', 'AWS (EC2, S3, RDS, Lambda)', 'SQL & NoSQL (PostgreSQL, MongoDB)', 'Docker & Kubernetes', 'CI/CD (Jenkins, GitHub Actions)', 'Git', 'Agile/Scrum'],
        experience: [
            {
                role: 'Senior Software Engineer (Java)',
                company: 'Apex Solutions Corp',
                period: '2022 - Present',
                bullets: [
                    'Led the design and development of a high-throughput Java-based microservices architecture using Spring Boot and Spring Cloud, increasing system reliability by 35%.',
                    'Spearheaded the migration of legacy monolithic applications to AWS cloud environment, utilizing Docker and Kubernetes for container orchestration.',
                    'Optimized SQL queries and Hibernate caching strategies, reducing database response times by 40% and overall application latency.',
                    'Mentored a team of 5 junior and mid-level developers, enforcing clean code practices, writing comprehensive JUnit/Mockito unit tests, and conducting rigorous code reviews.'
                ]
            },
            {
                role: 'Java Developer',
                company: 'CoreTech Industries',
                period: '2019 - 2022',
                bullets: [
                    'Developed RESTful Web Services and APIs using Spring Boot, integrating multiple third-party payment gateways and services.',
                    'Designed and maintained database schemas in PostgreSQL, writing complex store procedures and optimizing indexing.',
                    'Implemented CI/CD pipelines using Jenkins, reducing release deployment times from hours to under 15 minutes.',
                    'Participated in daily stand-ups and sprint planning sessions in an Agile environment, collaborating closely with QA and Product Managers.'
                ]
            }
        ],
        education: 'B.S. in Computer Science - University of Texas at Austin'
    },
    'BUSINESS ANALYST': {
        name: 'Jane Smith',
        title: 'Senior Business Analyst',
        contact: {
            email: 'jane.smith.ba@example.com',
            phone: '+1 (555) 019-5832',
            location: 'Chicago, IL',
            linkedin: 'linkedin.com/in/janesmith-demo'
        },
        summary: 'Analytical and detail-oriented Senior Business Analyst with 6+ years of experience bridging the gap between business needs and technology solutions. Experienced in requirements gathering, process mapping, agile methodologies, and stakeholder communication. Proven ability to translate complex business scenarios into clear functional specifications and technical requirements.',
        skills: ['Requirements Gathering', 'Process Mapping (BPMN)', 'Agile / Scrum', 'SQL', 'JIRA & Confluence', 'Tableau', 'MS Visio', 'UML Diagramming', 'User Stories & Use Cases', 'Data Analysis', 'Stakeholder Management'],
        experience: [
            {
                role: 'Senior Business Analyst',
                company: 'Fidelity Financials Inc',
                period: '2021 - Present',
                bullets: [
                    'Gathered and documented business, functional, and non-functional requirements for a new online banking platform, collaborating with cross-functional stakeholders.',
                    'Created detailed process flow diagrams, UML charts, and use cases using MS Visio to illustrate complex system interactions and workflows.',
                    'Managed product backlogs, wrote detailed user stories with clear acceptance criteria in JIRA, and facilitated sprint grooming and planning sessions.',
                    'Conducted User Acceptance Testing (UAT) sessions, validating system changes against requirements and coordinating bug fixes with the engineering team.'
                ]
            },
            {
                role: 'Business Analyst',
                company: 'Innovate Solutions LLC',
                period: '2018 - 2021',
                bullets: [
                    'Conducted gap analysis and business process modeling to identify operational inefficiencies, saving the department 15% in administrative overhead.',
                    'Queried databases using SQL to extract and analyze operational data, creating executive dashboards using Tableau to track project performance metrics.',
                    'Served as the primary liaison between business clients and the technical development team, ensuring clear communication and expectations throughout the SDLC.'
                ]
            }
        ],
        education: 'B.B.A. in Management Information Systems - University of Illinois'
    },
    'PROJECT MANAGER': {
        name: 'Robert Johnson',
        title: 'Technical Project Manager',
        contact: {
            email: 'robert.johnson.pm@example.com',
            phone: '+1 (555) 019-9921',
            location: 'San Jose, CA',
            linkedin: 'linkedin.com/in/robertjohnson-demo'
        },
        summary: 'PMP-certified Technical Project Manager with 8 years of experience leading cross-functional teams to deliver complex software development projects. Expert in Agile, Scrum, and Waterfall methodologies, resource planning, risk management, and budget tracking. Adept at managing client relationships and ensuring project delivery within scope, time, and budget constraint.',
        skills: ['Project Management', 'Agile & Scrum Delivery', 'PMP Certified', 'Risk Management', 'Resource Allocation', 'Budget Management & Forecasting', 'JIRA & Confluence', 'MS Project', 'SDLC Management', 'Cross-functional Leadership', 'Stakeholder Communication'],
        experience: [
            {
                role: 'Technical Project Manager',
                company: 'Vanguard Systems',
                period: '2022 - Present',
                bullets: [
                    'Managed a portfolio of 3 enterprise SaaS software development projects with an annual budget of $1.5M, delivering all projects on time and 5% under budget.',
                    'Led daily stand-ups, sprint planning, and sprint retrospectives for 3 distributed development teams totaling 18 members.',
                    'Identified, tracked, and mitigated project risks and roadblocks, reducing project delays by 25% through proactive dependency management.',
                    'Established project governance processes and dashboards using JIRA/Confluence, providing weekly status reports and progress updates to C-level executives.'
                ]
            },
            {
                role: 'Project Manager / Scrum Master',
                company: 'Matrix Technologies',
                period: '2019 - 2022',
                bullets: [
                    'Led the successful transition of a legacy software development group from Waterfall to Agile Scrum, boosting delivery speed by 30%.',
                    'Coordinated with business analysts, UI/UX designers, developers, and QA engineers to define project scope and execute roadmap deliverables.',
                    'Facilitated stakeholder conflict resolution and managed vendor contracts, ensuring smooth integration of third-party APIs.'
                ]
            }
        ],
        education: 'M.S. in Project Management, B.S. in Software Engineering - San Jose State University'
    },
    'DATA ANALYST': {
        name: 'Sarah Davis',
        title: 'Lead Data Analyst',
        contact: {
            email: 'sarah.davis.data@example.com',
            phone: '+1 (555) 019-3384',
            location: 'New York, NY',
            linkedin: 'linkedin.com/in/sarahdavis-demo'
        },
        summary: 'Insightful and detail-driven Data Analyst with 5+ years of experience transforming raw, complex data sets into actionable business insights. Highly proficient in SQL, Python, and data visualization tools like Tableau and Power BI. Expert in designing ETL pipelines, statistical modeling, and conducting deep-dive analysis to drive strategic decision-making.',
        skills: ['Data Visualization (Tableau, Power BI)', 'SQL (PostgreSQL, MySQL, BigQuery)', 'Python (Pandas, NumPy, Scikit-learn)', 'Data Modeling & ETL Processes', 'Statistical Analysis & Hypothesis Testing', 'Excel (Macros, Pivot Tables)', 'Data Warehousing', 'Reporting Automation', 'A/B Testing'],
        experience: [
            {
                role: 'Lead Data Analyst',
                company: 'Insight Analytics Co',
                period: '2021 - Present',
                bullets: [
                    'Designed and implemented interactive Tableau dashboards for sales and marketing departments, providing real-time metrics tracking and driving a 12% increase in sales conversion.',
                    'Developed automated Python and SQL ETL pipelines to consolidate data from multiple sources, reducing manual reporting hours by 15 hours per week.',
                    'Conducted complex A/B testing analysis for product feature launches, calculating statistical significance to guide product managers on rollouts.',
                    'Collaborated with data engineers to model data structures in Snowflake, optimizing query performance for analytics teams.'
                ]
            },
            {
                role: 'Data Analyst',
                company: 'Omni Retail Group',
                period: '2019 - 2021',
                bullets: [
                    'Analyzed customer transaction history and browsing behavior to build segmentation models, supporting targeted email marketing campaigns.',
                    'Wrote complex SQL queries to generate daily, weekly, and monthly performance reports for retail operations managers.',
                    'Identified data quality issues and implemented validation checks, improving overall data integrity across production databases by 20%.'
                ]
            }
        ],
        education: 'B.S. in Statistics and Data Science - Columbia University'
    }
};

/**
 * Normalizes category name to match one of the base profiles.
 */
function getProfileCategory(category) {
    const catUpper = category.toUpperCase();
    if (catUpper.includes('JAVA')) return 'JAVA DEVELOPER';
    if (catUpper.includes('BUSINESS ANALYST') || catUpper.includes('BA ')) return 'BUSINESS ANALYST';
    if (catUpper.includes('PROJECT MANAGER') || catUpper.includes('PM ')) return 'PROJECT MANAGER';
    if (catUpper.includes('DATA ANALYST')) return 'DATA ANALYST';
    return 'JAVA DEVELOPER'; // Default fallback
}

/**
 * Uses Gemini API to adapt base resume to match a specific job description.
 */
async function adaptResumeWithAI(profile, category, jobDescription) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        console.log('Skipping AI adaptation: No GEMINI_API_KEY found in environment.');
        return profile;
    }

    console.log(`Adapting resume for role: ${category} using Gemini API...`);

    const promptText = `
You are an expert resume writer. Your task is to customize a candidate's resume summary, skills list, and professional experience bullet points to match a specific Job Description. 

You MUST NOT change the candidate's name, education, company names, job titles, or dates of employment. Your task is only to edit the professional summary, select or add matching technical/professional skills, and refine the bullet points of their experience to highlight the technologies, methodologies, and requirements mentioned in the Job Description. Make it look natural, truthful (don't add unrealistic achievements), and highly aligned with what the employer wants.

Base Resume Profile:
${JSON.stringify(profile, null, 2)}

Job Description:
${jobDescription}

Generate the adapted resume profile. You MUST respond with a valid JSON object only. The JSON object should have the exact same structure as the input profile:
{
  "name": "Same name as base profile",
  "title": "Same title as base profile",
  "contact": { ... same contact details ... },
  "summary": "Tailored professional summary (approx. 3-4 sentences)",
  "skills": ["Updated skill 1", "Updated skill 2", ...],
  "experience": [
    {
      "role": "Same role as base profile",
      "company": "Same company as base profile",
      "period": "Same period as base profile",
      "bullets": [
        "Tailored bullet point 1 focusing on matching technologies/responsibilities",
        "Tailored bullet point 2 focusing on matching technologies/responsibilities",
        ...
      ]
    },
    ...
  ],
  "education": "Same education as base profile"
}
`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: promptText
                    }]
                }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API returned status ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        let aiText = data.candidates[0].content.parts[0].text;
        
        // Remove markdown block backticks if present
        aiText = aiText.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        const adaptedProfile = JSON.parse(aiText);
        console.log(`Successfully adapted resume with Gemini API!`);
        return adaptedProfile;
    } catch (error) {
        console.error('Failed to adapt resume with Gemini. Falling back to base profile. Error:', error.message);
        return profile;
    }
}

/**
 * Generates an HTML string for the resume using the profile data.
 */
function generateResumeHtml(profile) {
    const skillsHtml = profile.skills
        .map(skill => `<span class="skill-badge">${skill}</span>`)
        .join('');

    const experienceHtml = profile.experience
        .map(exp => `
            <div class="exp-item">
                <div class="exp-header">
                    <span class="exp-role">${exp.role}</span>
                    <span class="exp-period">${exp.period}</span>
                </div>
                <div class="exp-company">${exp.company}</div>
                <ul class="exp-bullets">
                    ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
                </ul>
            </div>
        `)
        .join('');

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Resume - ${profile.name}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            body {
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                color: #1e293b;
                line-height: 1.45;
                margin: 0;
                padding: 0;
                background-color: #ffffff;
                -webkit-print-color-adjust: exact;
            }
            .resume-container {
                max-width: 800px;
                margin: 0 auto;
                padding: 40px;
            }
            header {
                border-bottom: 2px solid #e2e8f0;
                padding-bottom: 20px;
                margin-bottom: 20px;
            }
            .header-top {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
            }
            .name-title h1 {
                font-size: 28px;
                font-weight: 700;
                color: #0f172a;
                margin: 0 0 4px 0;
                letter-spacing: -0.025em;
            }
            .name-title .subtitle {
                font-size: 16px;
                color: #4f46e5;
                font-weight: 600;
                margin: 0;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            .contact-info {
                text-align: right;
                font-size: 13px;
                color: #475569;
            }
            .contact-info div {
                margin-bottom: 3px;
            }
            
            section {
                margin-bottom: 22px;
            }
            section h2 {
                font-size: 14px;
                font-weight: 700;
                color: #0f172a;
                text-transform: uppercase;
                letter-spacing: 0.075em;
                margin: 0 0 10px 0;
                border-bottom: 1px solid #cbd5e1;
                padding-bottom: 4px;
            }
            
            .summary-text {
                font-size: 13.5px;
                color: #334155;
                text-align: justify;
                margin: 0;
            }
            
            .skills-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }
            .skill-badge {
                font-size: 12px;
                font-weight: 500;
                background-color: #f1f5f9;
                color: #334155;
                padding: 4px 10px;
                border-radius: 4px;
                border: 1px solid #e2e8f0;
            }
            
            .exp-item {
                margin-bottom: 16px;
            }
            .exp-item:last-child {
                margin-bottom: 0;
            }
            .exp-header {
                display: flex;
                justify-content: space-between;
                font-weight: 600;
                font-size: 14px;
                color: #0f172a;
            }
            .exp-company {
                font-size: 13px;
                color: #4f46e5;
                font-weight: 500;
                margin-top: 1px;
                margin-bottom: 6px;
            }
            .exp-bullets {
                margin: 0;
                padding-left: 20px;
                font-size: 13px;
                color: #334155;
            }
            .exp-bullets li {
                margin-bottom: 4px;
            }
            
            .edu-text {
                font-size: 13.5px;
                font-weight: 600;
                color: #0f172a;
                margin: 0;
            }
        </style>
    </head>
    <body>
        <div class="resume-container">
            <header>
                <div class="header-top">
                    <div class="name-title">
                        <h1>${profile.name}</h1>
                        <div class="subtitle">${profile.title}</div>
                    </div>
                    <div class="contact-info">
                        <div>📍 ${profile.contact.location}</div>
                        <div>📞 ${profile.contact.phone}</div>
                        <div>✉️ ${profile.contact.email}</div>
                        ${profile.contact.linkedin ? `<div>🔗 ${profile.contact.linkedin}</div>` : ''}
                        ${profile.contact.github ? `<div>💻 ${profile.contact.github}</div>` : ''}
                    </div>
                </div>
            </header>
            
            <section>
                <h2>Professional Summary</h2>
                <p class="summary-text">${profile.summary}</p>
            </section>
            
            <section>
                <h2>Technical Skills</h2>
                <div class="skills-grid">
                    ${skillsHtml}
                </div>
            </section>
            
            <section>
                <h2>Professional Experience</h2>
                ${experienceHtml}
            </section>
            
            <section>
                <h2>Education</h2>
                <p class="edu-text">${profile.education}</p>
            </section>
        </div>
    </body>
    </html>
    `;
}

/**
 * Core interface: Generates a resume PDF for a specified category and job description.
 * Saves the output PDF to the resume directory.
 */
async function generateResume(category, jobDescription, outputPath) {
    const profileType = getProfileCategory(category);
    const baseProfile = JSON.parse(JSON.stringify(baseProfiles[profileType])); // deep clone
    
    // Tailor profile with AI if API key is provided
    const tailoredProfile = await adaptResumeWithAI(baseProfile, profileType, jobDescription);
    
    // Generate HTML
    const htmlContent = generateResumeHtml(tailoredProfile);
    
    // Set up output directory if it does not exist
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    // Launch playwright to print PDF
    console.log(`Generating PDF using Playwright headless browser at ${outputPath}...`);
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.setContent(htmlContent);
    
    // Render PDF
    await page.pdf({
        path: outputPath,
        format: 'A4',
        margin: {
            top: '0.4in',
            bottom: '0.4in',
            left: '0.4in',
            right: '0.4in'
        },
        printBackground: true
    });
    
    await browser.close();
    console.log(`Resume PDF generated successfully.`);
}

module.exports = generateResume;
