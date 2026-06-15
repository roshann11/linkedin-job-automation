const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function saveReport(records) {

    const csvWriter = createCsvWriter({
        path: './reports/applications.csv',

        header: [
            { id: 'email', title: 'Recruiter Email' },
            { id: 'status', title: 'Status' }
        ]
    });

    await csvWriter.writeRecords(records);
}

module.exports = saveReport;