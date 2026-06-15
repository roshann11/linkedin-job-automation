require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

// Map of categories to specific candidate profiles, subject lines, and email bodies.
const templates = {
    'JAVA DEVELOPER': {
        subject: 'Application for Senior Java Developer Position (C2C)',
        senderName: 'John Doe',
        body: `Dear Recruiter,

I am writing to express my interest in the Java Developer contract position. 

I have extensive experience building scalable microservices with Spring Boot, Java, and AWS. Please find my tailored resume attached.

Thank you for your time and consideration.

Regards,
John Doe`
    },
    'BUSINESS ANALYST': {
        subject: 'Application for Senior Business Analyst Position (C2C)',
        senderName: 'Jane Smith',
        body: `Dear Recruiter,

I am writing to express my interest in the Business Analyst contract position. 

I have extensive experience gathering requirements, mapping processes, and managing agile projects using JIRA/Confluence. Please find my tailored resume attached.

Thank you for your time and consideration.

Regards,
Jane Smith`
    },
    'PROJECT MANAGER': {
        subject: 'Application for Technical Project Manager Position (C2C)',
        senderName: 'Robert Johnson',
        body: `Dear Recruiter,

I am writing to express my interest in the Project Manager contract position. 

I am a PMP-certified Project Manager with strong experience delivering software engineering projects using Agile/Scrum methodologies. Please find my tailored resume attached.

Thank you for your time and consideration.

Regards,
Robert Johnson`
    },
    'DATA ANALYST': {
        subject: 'Application for Lead Data Analyst Position (C2C)',
        senderName: 'Sarah Davis',
        body: `Dear Recruiter,

I am writing to express my interest in the Data Analyst contract position. 

I have extensive experience extracting business insights using SQL, Python, and creating interactive dashboards in Tableau/Power BI. Please find my tailored resume attached.

Thank you for your time and consideration.

Regards,
Sarah Davis`
    }
};

/**
 * Resolves the role category key from the category string.
 */
function getTemplateCategory(category) {
    const catUpper = category.toUpperCase();
    if (catUpper.includes('JAVA')) return 'JAVA DEVELOPER';
    if (catUpper.includes('BUSINESS ANALYST') || catUpper.includes('BA ')) return 'BUSINESS ANALYST';
    if (catUpper.includes('PROJECT MANAGER') || catUpper.includes('PM ')) return 'PROJECT MANAGER';
    if (catUpper.includes('DATA ANALYST')) return 'DATA ANALYST';
    return 'JAVA DEVELOPER'; // fallback
}

/**
 * Sends application email to the recruiter with CC to team.
 * 
 * @param {string} recruiterEmail - Recruiter recipient address
 * @param {string} category - Application role category
 * @param {string} resumePath - Path to the specific generated PDF resume
 */
async function sendApplicationEmail(recruiterEmail, category, resumePath) {
    const templateKey = getTemplateCategory(category);
    const template = templates[templateKey];

    if (!template) {
        throw new Error(`No template found for category key: ${templateKey}`);
    }

    const mailOptions = {
        from: `"${template.senderName}" <${process.env.GMAIL_USER}>`,
        to: recruiterEmail,
        cc: 'quinn@jpitstaffing.com, kim@jpitstaffing.com',
        subject: template.subject,
        text: template.body,
        attachments: [
            {
                filename: `Resume_${template.senderName.replace(/\s+/g, '_')}.pdf`,
                path: resumePath
            }
        ]
    };

    console.log(`Sending application email to ${recruiterEmail} for ${category} (CC: quinn@jpitstaffing.com, kim@jpitstaffing.com)...`);
    await transporter.sendMail(mailOptions);
}

module.exports = sendApplicationEmail;