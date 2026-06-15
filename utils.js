const createCsvWriter = require('csv-writer').createObjectCsvWriter;

/**
 * Saves application execution results to a CSV report.
 * 
 * @param {Array<{email: string, category: string, status: string}>} records - Log entries.
 */
async function saveReport(records) {
    const csvWriter = createCsvWriter({
        path: './reports/applications.csv',
        header: [
            { id: 'category', title: 'Job Category' },
            { id: 'email', title: 'Recruiter Email' },
            { id: 'status', title: 'Status' }
        ]
    });

    await csvWriter.writeRecords(records);
}

module.exports = saveReport;