const getRecruiterEmails = require('./linkedin');
const sendApplicationEmail = require('./gmail');
const saveReport = require('./utils');

async function main() {

    const keyword =
        'Java Developer Contract';

    const recruiterEmails =
        await getRecruiterEmails(keyword);

    const report = [];

    for (const email of recruiterEmails) {

        try {

            await sendApplicationEmail(email);

            console.log(
                `Email sent to ${email}`
            );

            report.push({
                email,
                status: 'SUCCESS'
            });

        } catch (error) {

            console.log(
                `Failed for ${email}`
            );

            report.push({
                email,
                status: 'FAILED'
            });
        }
    }

    await saveReport(report);

    console.log(
        'Process Completed'
    );
}

main();