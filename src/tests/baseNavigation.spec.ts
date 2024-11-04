import { test as baseTest } from '@playwright/test';
import { test as testPages } from '../fixtures/PageObjectManager';
import { BasePage } from '../pages/basePage';
import { expect } from '@playwright/test';

const test = testPages.extend({});

test.describe('Base Navigation', () => {
    test.beforeEach(async ({ page }) => {
        const basePage = new BasePage(page);
        await basePage.navigate('/');
        await page.waitForLoadState('networkidle');
    });

    test.afterEach(async ({ page }, testInfo) => {
        if (testInfo.status !== 'passed') {
            await page.screenshot({
                path: `./screenshots/${testInfo.title}-failure.png`
            });
        }
    });

    test.describe('Home Menu Navigation', () => {
        test('should navigate to All Models page', async ({ page, basePage }) => {
            await basePage.header.homeButton.hover();
            await basePage.header.allModels.click();
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL(/.*\/shop\/all-models/);
        });

        test('should navigate to In Stock page', async ({ page, basePage }) => {
            await basePage.header.homeButton.hover();
            await basePage.header.inStock.click();
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL(/.*\/shop\/inventory/);
        });

        test('should navigate to On Land page', async ({ page, basePage }) => {
            await basePage.header.homeButton.hover();
            await basePage.header.onLand.click();
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL(/.*\/shop\/land-home/);
        });

        test('should navigate to On Sale page', async ({ page, basePage }) => {
            await basePage.header.homeButton.hover();
            await basePage.header.onSale.click();
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL(/.*\/shop\/homes-on-sale/);
        });

        test('should navigate to Saved Homes page', async ({ page, basePage }) => {
            await basePage.header.homeButton.hover();
            await basePage.header.saved.click();
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL(/.*\/shop\/saved-homes/);
        });
    });

    test.describe('About Menu Navigation', () => {
        test('should navigate to Braustin Story page', async ({ page, basePage }) => {
            await basePage.header.aboutButton.hover();
            await basePage.header.braustinStory.click();
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL('/about');
        });

        test('should navigate to Customer Stories page', async ({ page, basePage }) => {
            await basePage.header.aboutButton.hover();
            await basePage.header.customerStories.click();
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL('/customer-stories');
        });

        test('should navigate to Locations page', async ({ page, basePage }) => {
            await basePage.header.aboutButton.hover();
            await basePage.header.locations.click();
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL('/locations');
        });
    });

    test.describe('Learn Menu Navigation', () => {
        test('should navigate to Blog page', async ({ page, basePage }) => {
            await basePage.header.learnButton.hover();
            await basePage.header.blog.click();
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL('/blog');
        });

        test('should navigate to Academy page', async ({ page, basePage }) => {
            await basePage.header.learnButton.hover();
            await basePage.header.academy.click();
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL('/academy');
        });

        test('should navigate to Podcast page', async ({ page, basePage }) => {
            await basePage.header.learnButton.hover();
            await basePage.header.podcast.click();
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL('/podcast');
        });

        test('should navigate to FAQs page', async ({ page, basePage }) => {
            await basePage.header.learnButton.hover();
            await basePage.header.faqs.click();
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL('/frequently-asked-questions');
        });

        test('should navigate to Braustin Scholars page', async ({ page, basePage }) => {
            await basePage.header.learnButton.hover();
            await basePage.header.braustinScholars.click();
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL('/braustin-scholars');
        });
    });

    test.describe('Contact Us Menu Navigation', () => {
        test('should navigate to Contact Us page', async ({ page, basePage }) => {
            await basePage.header.contactUsButton.hover();
            await basePage.header.contactUsButton.click();
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL('/contact-us');
        });

        test('should navigate to Commercial Accounts page', async ({ page, basePage }) => {
            await basePage.header.contactUsButton.hover();
            await basePage.header.commercialAccountsButton.click();
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL('/commercial-account-management');
        });

        test('should navigate to Skirting Quote page', async ({ page, basePage }) => {
            await basePage.header.contactUsButton.hover();
            await basePage.header.skirtingButton.click();
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveURL('/mobile-home-skirting-quote');
        });
    });
});
