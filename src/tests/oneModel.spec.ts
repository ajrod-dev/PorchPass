import { test as baseTest } from '@playwright/test';
import { test as testPages } from '../fixtures/PageObjectManager';
import { expect } from '@playwright/test';
import { OneModelsPage } from '../pages/oneModelPage';
import { AllModelsPage } from '../pages/allModelsPage';

let sharedModelUrl: string;

const test = testPages.extend({
    oneModelsPage: async ({ page }, use) => {
        const oneModelsPage = new OneModelsPage(page);
        await use(oneModelsPage);
    },
    allModelsPage: async ({ page }, use) => {
        const allModelsPage = new AllModelsPage(page);
        await use(allModelsPage);
    }
});

test.describe('Single Model Page Tests', () => {
    test.beforeEach(async ({ page, oneModelsPage, allModelsPage }) => {
        // Navigate to home page
        await oneModelsPage.goto();
        await oneModelsPage.waitForPageLoad();

    });

    test.afterEach(async ({ page }, testInfo) => {
        if (testInfo.status !== 'passed') {
            await page.screenshot({ 
                path: `./screenshots/${testInfo.title}-failure.png` 
            });
        }
    });

    test('Verify page loads successfully', async ({ page, oneModelPage, allModelsPage }) => {        
        await oneModelPage.navigate('/');
        await oneModelPage.waitForPageLoad();
        // Navigating through the home page to get to the model page
        await oneModelPage.header.homeButton.hover();
        await oneModelPage.header.homeButton.click();
        await oneModelPage.header.allModels.click();
        await oneModelPage.waitForPageLoad();
        // Clicking on the first model card to navigate to the model page
        await allModelsPage.homeCards.first().click();
        await oneModelPage.waitForPageLoad();
        // Check for header
        await expect(oneModelPage.modelName).toBeVisible();
        // Verify URL
        const modelName = await oneModelPage.modelName.innerText();
        await expect(page).toHaveURL(`/shop/${modelName.toLowerCase().replace(/\s+/g, '-')}`);
    });

    test('As a user, I can adjust the credit score', async ({ oneModelsPage }) => {
        // Start at fair credit
        await oneModelsPage.fairCredit.click();
        await oneModelsPage.waitForPageLoad();
        const initialPayment = await oneModelsPage.monthlyPayment.innerText();
        console.log(`Fair monthlypayment: ${initialPayment}`);
        // Change to good credit
        await oneModelsPage.goodCredit.click();
        await oneModelsPage.waitForPageLoad();
        const goodPayment = await oneModelsPage.monthlyPayment.innerText();
        console.log(`Good monthly payment: ${goodPayment}`);
        // Change to very good credit
        await oneModelsPage.veryGoodCredit.click();
        await oneModelsPage.waitForPageLoad();
        const veryGoodPayment = await oneModelsPage.monthlyPayment.innerText();
        console.log(`Very good monthly payment: ${veryGoodPayment}`);
        
        await oneModelsPage.monthlyPayment.waitFor({ state: 'visible', timeout: 1000 });
        const updatedPayment = await oneModelsPage.monthlyPayment.innerText();
        
        expect(updatedPayment).not.toEqual(initialPayment);
        console.log(`Payment changed from ${initialPayment} to ${updatedPayment}`);
    });

    test('As a user, I can adjust down payment', async ({ oneModelsPage }) => {
        await oneModelsPage.monthlyPayment.waitFor({ state: 'visible', timeout: 1000 });
        let previousMonthlyPayment = await oneModelsPage.monthlyPayment.innerText();
        console.log(`Previous monthly payment: ${previousMonthlyPayment}`);
        const downPaymentPercentages = [0, 5, 10, 15, 20];
        for (const percentage of downPaymentPercentages) {
            try {
                await oneModelsPage.setDownPaymentPercentage(percentage);
                // Click outside the input to ensure the calculation triggers
                await oneModelsPage.page.click('body');
                await oneModelsPage.waitForPageLoad();
                await oneModelsPage.monthlyPayment.waitFor({ state: 'visible', timeout: 1000 });
                // Wait for the monthly payment to be visible
                const currentMonthlyPayment = await oneModelsPage.monthlyPayment.innerText();
                expect(currentMonthlyPayment).not.toEqual(previousMonthlyPayment);
                console.log(`Monthly payment changed from ${previousMonthlyPayment} to ${currentMonthlyPayment} at ${percentage}% down`);
                previousMonthlyPayment = currentMonthlyPayment;
            } catch (error) {
                console.error(`Error setting ${percentage}% down payment:`, error);
                throw error;
            }
        }

        try {
            await oneModelsPage.downPaymentInput.fill('1000');
            await oneModelsPage.downPaymentInput.press('Enter');
            await oneModelsPage.waitForPageLoad();
            await oneModelsPage.monthlyPayment.waitFor({ state: 'visible', timeout: 1000 });
            // Wait for the monthly payment to be visible
            const manualMonthlyPayment = await oneModelsPage.monthlyPayment.innerText();
            // Convert string amounts to numbers for comparison
            const prevPayment = parseFloat(previousMonthlyPayment.replace(/[$,]/g, ''));
            const currPayment = parseFloat(manualMonthlyPayment.replace(/[$,]/g, ''));
            expect(currPayment).not.toEqual(prevPayment);
            console.log(`Monthly payment changed to ${manualMonthlyPayment} with $14000 down payment`);
        } catch (error) {
            console.error('Error setting manual down payment:', error);
            throw error;
        }
    });

    test('As a user, I can see zip code errors', async ({ oneModelsPage }) => {
        try {
            await oneModelsPage.monthlyPayment.waitFor({ state: 'visible', timeout: 1000 });
            const initialPayment = await oneModelsPage.monthlyPayment.innerText();

            // Ensure the checkbox is visible and clickable
            await oneModelsPage.airConditionerCheckbox.evaluate(element => {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
            await oneModelsPage.page.waitForTimeout(500); // Wait for scroll to complete
            await oneModelsPage.airConditionerCheckbox.click();
            
            // Enter invalid zip code
            await oneModelsPage.zipCodeInput.waitFor({ state: 'visible', timeout: 500 });
            await oneModelsPage.zipCodeInput.fill('0000');
            await oneModelsPage.waitForPageLoad();
            // Look for disabled calculate button
            await expect(oneModelsPage.calculateButton).toBeDisabled({ timeout: 1000 });
            // Enter valid zip code
            await oneModelsPage.zipCodeInput.fill('78260');
            await expect(oneModelsPage.calculateButton).toBeVisible({ timeout: 1000 });
            await oneModelsPage.calculateButton.click();
            // Verify payment changed
            await oneModelsPage.monthlyPayment.waitFor({ state: 'visible', timeout: 1000 });
            const updatedPayment = await oneModelsPage.monthlyPayment.innerText();
            await oneModelsPage.waitForPageLoad();
            await oneModelsPage.page.waitForTimeout(5000);
            expect(updatedPayment).not.toEqual(initialPayment);
            console.log(`Payment changed from ${initialPayment} to ${updatedPayment}`);
        } catch (error) {
            console.error('Error in zip code test:', error);
            throw error;
        }
    });
});
