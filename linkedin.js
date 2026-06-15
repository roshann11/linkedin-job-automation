require('dotenv').config();
const { chromium } = require('playwright');

/**
 * Searches LinkedIn for content posts matching the queries for each category.
 * Extracts recruiter email addresses and maps them to their respective post descriptions and categories.
 * 
 * @param {Array<{name: string, query: string}>} categories - The list of roles and search queries.
 * @returns {Promise<Array<{email: string, postText: string, category: string}>>} - The scraped recruiter contact entries.
 */
async function getRecruiterEmails(categories) {
    const browser = await chromium.launch({
        headless: false
    });

    const page = await browser.newPage();

    // Login once
    console.log('Logging in to LinkedIn...');
    await page.goto('https://www.linkedin.com/login');

    await page.fill('#username', process.env.LINKEDIN_EMAIL);
    await page.fill('#password', process.env.LINKEDIN_PASSWORD);

    await page.click('button[type="submit"]');

    // Wait for 5 seconds to complete login process
    await page.waitForTimeout(5000);

    const applications = [];
    const processedEmails = new Set();

    for (const cat of categories) {
        console.log(`Searching posts for: "${cat.name}" using query: [${cat.query}]...`);
        
        await page.goto(
            `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(cat.query)}`
        );

        // Wait for search results to load
        await page.waitForTimeout(5000);

        const posts = await page.$$eval(
            '.feed-shared-update-v2',
            nodes => nodes.map(n => n.innerText)
        );

        console.log(`Found ${posts.length} posts for category "${cat.name}".`);

        const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

        posts.forEach(postText => {
            const matches = postText.match(emailRegex);

            if (matches) {
                const uniquePostEmails = [...new Set(matches)];
                uniquePostEmails.forEach(email => {
                    const normalizedEmail = email.toLowerCase().trim();
                    if (!processedEmails.has(normalizedEmail)) {
                        processedEmails.add(normalizedEmail);
                        applications.push({
                            email: normalizedEmail,
                            postText: postText,
                            category: cat.name
                        });
                        console.log(`Scraped Email: ${normalizedEmail} from post under category: ${cat.name}`);
                    }
                });
            }
        });

        // Small delay between searches to be nice to LinkedIn rate limits
        await page.waitForTimeout(3000);
    }

    await browser.close();

    return applications;
}

module.exports = getRecruiterEmails;