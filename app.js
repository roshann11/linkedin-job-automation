const fs = require('fs');
const path = require('path');
const getRecruiterEmails = require('./linkedin');
const sendApplicationEmail = require('./gmail');
const generateResume = require('./resumeGenerator');
const saveReport = require('./utils');

// Define search criteria for the 4 roles
const categories = [
    { name: 'JAVA DEVELOPER', query: '"Java Developer" "C2C"' },
    { name: 'BUSINESS ANALYST', query: '"Business Analyst" "C2C"' },
    { name: 'PROJECT MANAGER', query: '"Project Manager" "C2C"' },
    { name: 'DATA ANALYST', query: '"Data Analyst" "C2C"' }
];

async function main() {
    console.log('Starting LinkedIn Job Automation Process...');
    
    let applications = [];
    try {
        // Scrape emails from all categories
        applications = await getRecruiterEmails(categories);
        console.log(`Scraping complete. Found a total of ${applications.length} unique recruiter contacts.`);
    } catch (err) {
        console.error('Critical error during LinkedIn scraping stage:', err);
        process.exit(1);
    }

    const report = [];

    for (const app of applications) {
        console.log(`\n--- Processing Application for: ${app.email} [${app.category}] ---`);
        
        // Define temporary resume path
        const safeEmailName = app.email.replace(/[^a-zA-Z0-9]/g, '_');
        const resumePath = path.resolve(__dirname, 'resume', `Resume_${safeEmailName}_${Date.now()}.pdf`);

        try {
            // 1. Generate customized PDF resume
            await generateResume(app.category, app.postText, resumePath);

            // 2. Send application email
            await sendApplicationEmail(app.email, app.category, resumePath);

            console.log(`Successfully completed application to ${app.email}`);
            report.push({
                category: app.category,
                email: app.email,
                status: 'SUCCESS'
            });

        } catch (error) {
            console.error(`Failed to process application for ${app.email}:`, error);
            report.push({
                category: app.category,
                email: app.email,
                status: 'FAILED'
            });
        } finally {
            // 3. Clean up the temporary customized PDF
            if (fs.existsSync(resumePath)) {
                try {
                    fs.unlinkSync(resumePath);
                    console.log(`Cleaned up temporary resume: ${path.basename(resumePath)}`);
                } catch (cleanupError) {
                    console.warn(`Could not clean up temporary resume at ${resumePath}:`, cleanupError.message);
                }
            }
        }
    }

    // Save final status log to reports/applications.csv
    try {
        await saveReport(report);
        console.log('\nReport saved successfully to ./reports/applications.csv');
    } catch (csvError) {
        console.error('Failed to write CSV report:', csvError);
    }

    console.log('\nLinkedIn Job Automation Process Completed.');
}

main();