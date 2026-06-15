require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

async function sendApplicationEmail(recruiterEmail) {

    await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: recruiterEmail,
        subject: 'Application for Java Developer Contract Position',

        text: `
Dear Recruiter,

I am interested in the Java Developer Contract position.

Please find my resume attached.

Thank you for your time.

Regards,
Your Name
        `,

        attachments: [
            {
                filename: 'Resume.pdf',
                path: './resume/Resume.pdf'
            }
        ]
    });
}

module.exports = sendApplicationEmail;