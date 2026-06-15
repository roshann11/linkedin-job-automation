require('dotenv').config();
const { chromium } = require('playwright');

async function getRecruiterEmails(keyword) {
    const browser = await chromium.launch({
        headless: false
    });

    const page = await browser.newPage();

    // Login
    await page.goto('https://www.linkedin.com/login');

    await page.fill('#username', process.env.LINKEDIN_EMAIL);
    await page.fill('#password', process.env.LINKEDIN_PASSWORD);

    await page.click('button[type="submit"]');

    await page.waitForTimeout(5000);

    // Search posts
    await page.goto(
        `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(keyword)}`
    );

    await page.waitForTimeout(5000);

    const posts = await page.$$eval(
        '.feed-shared-update-v2',
        nodes => nodes.map(n => n.innerText)
    );

    const emailRegex =
        /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

    const emails = [];

    posts.forEach(post => {
        const matches = post.match(emailRegex);

        if (matches) {
            emails.push(...matches);
        }
    });

    await browser.close();

    return [...new Set(emails)];
}

module.exports = getRecruiterEmails;