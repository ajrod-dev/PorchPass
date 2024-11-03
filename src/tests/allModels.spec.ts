import { test as baseTest } from '@playwright/test';
import { test as testPages } from '../fixtures/PageObjectManager';
import { AllModelsPage } from '../pages/allModelsPage';
import { expect } from '@playwright/test';

const test = testPages.extend({});

test.describe('Home Models Search', () => {
    test.beforeEach(async ({ page }) => {
        const allModelsPage = new AllModelsPage(page);
        await allModelsPage.goto();
        await page.waitForLoadState('networkidle');
    });

    test.afterEach(async ({ page }, testInfo) => {
        if (testInfo.status !== 'passed') {
          await page.screenshot({ 
            path: `./screenshots/${testInfo.title}-failure.png` 
          });
        }
      });

    test('As a user, when I navigate to the All Models page, then the URL should be "/shop/all-models"', 
        async ({ page, allModelsPage }) => {
            await allModelsPage.navigate('/');
            // Hover & Click above Home Button
            await allModelsPage.header.homeButton.hover();
            await allModelsPage.header.homeButton.click();
            // Click All Models Button
            await allModelsPage.header.allModels.click();
            await expect(page).toHaveURL(`${allModelsPage.path}`);
        }
    );

    test('As a user, I can confirm that the search bar returns houses filtered by name', async ({ page, allModelsPage }) => {
        // My search term
        const searchTerm = 'Clayton Tempo';
        // Make sure results do populate
        const initialCount = await allModelsPage.homeCards.count();
        await expect.soft(initialCount).toBeGreaterThan(0);
        // Perform my search
        await allModelsPage.header.searchInput.click();
        await allModelsPage.header.searchInput.fill(searchTerm);
        await allModelsPage.header.searchInput.press('Enter');
        // Get filtered results count
        const filteredCount = await allModelsPage.homeCards.count(); 
        expect.soft(filteredCount).toBeLessThan(initialCount);
        // Verify each result contains search term
        const titles = await allModelsPage.homeCards.allTextContents();
        titles.forEach(title => {
            expect(title.toLowerCase()).toContain(searchTerm.toLowerCase());
        });
    });

    test('As a user, I can confirm that an invalid name will not return results', async ({ page, allModelsPage }) => {
        // Invalid search term 
        const invalidSearchTerm = 'myInvalidSearchTerm';
        // Get initial count of homes to verify we had results before search
        const initialCount = await allModelsPage.homeCards.count();
        await expect.soft(initialCount).toBeGreaterThan(0);
        console.log(`Initial number of homes: ${initialCount}`);
        // Perform the search
        await allModelsPage.header.searchInput.click();
        await allModelsPage.header.searchInput.fill(invalidSearchTerm);
        await allModelsPage.header.searchInput.press('Enter');
        // Wait for the search results to update
        await page.waitForTimeout(1000); 
        // Verify no results are returned
        const filteredCount = await allModelsPage.homeCards.count();
        await expect(filteredCount).toBe(0);
        console.log(`Number of homes after invalid search: ${filteredCount}`);
    });

    test('As a user, I can confirm that clearing the search bar will return all results.', async ({ page, allModelsPage }) => {
        // My search term
        const searchTerm = 'Clayton Tempo';
        // Get initial count
        const initialCount = await allModelsPage.homeCards.count();
        // Perform search
        await allModelsPage.header.searchInput.fill(searchTerm);
        await allModelsPage.header.searchInput.press('Enter');
        // Wait for results to update
        await page.waitForTimeout(1000);
        // Clear search
        await allModelsPage.header.searchInput.fill('');
        await allModelsPage.header.searchInput.press('Enter');
        // Wait for results to update
        await page.waitForTimeout(1000);
        // Verify my results are restored
        const finalCount = await allModelsPage.homeCards.count();
        expect(finalCount).toBe(initialCount);
    });
    // Array of tests for each section type(single & multi)
    // I hardcoded the expected counts for now
    const sectionTests = [
        { type: 'single', expectedCount: 40 },
        { type: 'multi', expectedCount: 43 }
    ];
    for (const { type, expectedCount } of sectionTests) {
        test(`As a user, I can filter homes by ${type} section`, async ({ page, allModelsPage }) => {
            const initialCount = await allModelsPage.homeCards.count();
            await expect.soft(initialCount).toBeGreaterThan(0);
            // Use the buttons directly
            if (type === 'single') {
                await allModelsPage.sectionSingleButton.click();
            } else {
                await allModelsPage.sectionMultiButton.click();
            }
            await page.waitForLoadState('networkidle');
            const filteredCount = await allModelsPage.homeCards.count();
            console.log(`${type} section count: ${filteredCount}`);
            // Verify results are returned
            await expect.soft(filteredCount).toBeGreaterThan(0);
            await expect.soft(filteredCount).toBeLessThan(initialCount);
            await expect(filteredCount).toBe(expectedCount);
        });
    }

    test('As a user, I can filter homes by number of bedrooms', async ({ page, allModelsPage }) => {
        const bedroomCounts = [1, 2, 3, 4, 5];
        
        for (const count of bedroomCounts) {
            // Get initial count of home model cards
            const initialCount = await allModelsPage.homeCards.count();
            await expect.soft(initialCount).toBeGreaterThan(0);
            // Filter by bedroom count
            await allModelsPage.filterByBedrooms(count);
            await page.waitForTimeout(1000);
            // Verify results are returned
            const filteredCount = await allModelsPage.homeCards.count();
            console.log(`${count} bedroom count: ${filteredCount}`);
            await expect.soft(filteredCount).toBeGreaterThan(0);
            await expect.soft(filteredCount).toBeLessThan(initialCount);
            // Reset filters for next iteration
            await allModelsPage.resetFiltersButton.click();
            await page.waitForTimeout(1000);
        }
    });

    test('As a user, I can filter homes by number of bathrooms', async ({ page, allModelsPage }) => {
        const bathroomCounts = [1, 2, 3];
        
        for (const count of bathroomCounts) {
            // Get initial count of home model cards
            const initialCount = await allModelsPage.homeCards.count();
            await expect.soft(initialCount).toBeGreaterThan(0);
            
            // Filter by bathroom count
            await allModelsPage.filterByBathrooms(count);
            await page.waitForTimeout(1000);
            
            // Verify results are returned
            const filteredCount = await allModelsPage.homeCards.count();
            console.log(`${count} bathroom count: ${filteredCount}`);
            await expect.soft(filteredCount).toBeGreaterThan(0);
            await expect.soft(filteredCount).toBeLessThan(initialCount);
            
            // Reset filters for next iteration
            await allModelsPage.resetFiltersButton.click();
            await page.waitForTimeout(1000);
        }
    });
    test('As a user, I can filter homes by estimated payment range', async ({ page, allModelsPage }) => {
        await test.step('Test case 1: Filter with valid range', async () => {
            // Test case 1: Filter with valid range
            const initialCount = await allModelsPage.verifyInitialCount();
            // Open the "From" dropdown and select a value
            await allModelsPage.selectEstimatedPaymentFrom('$1000');
            let filteredCount = await allModelsPage.verifyFilteredResults(initialCount);
            console.log(`Homes with payments from $1000: ${filteredCount}`);
            // Open the "To" dropdown and select a value
            await allModelsPage.selectEstimatedPaymentTo('$2400');
            filteredCount = await allModelsPage.verifyFilteredResults(initialCount);
            console.log(`Homes with payments between $1000-$2400: ${filteredCount}`);
            await expect.soft(filteredCount).toBeLessThan(initialCount); // Hardcoded but can be dynamic
            await allModelsPage.resetFilters();
        });

        await test.step('Test case 2: Filter with no expected results', async () => {
            // Test case 2: Filter with no expected results
            await allModelsPage.selectEstimatedPaymentFrom('$2400');
            await allModelsPage.selectEstimatedPaymentTo('$2400');
            // Verify no items match filters
            await expect(allModelsPage.noItemsMatchFilters).toBeVisible();
            await allModelsPage.resetFilters();
        });

        await test.step('Test case 3: Filter to assert no Clayton Homes are returned', async () => {
            // Add your third test case here
            const initialCount = await allModelsPage.verifyInitialCount();
            await allModelsPage.selectEstimatedPaymentFrom('$2000');
            await allModelsPage.selectEstimatedPaymentTo('$2400');
            const filteredCount = await allModelsPage.verifyFilteredResults(initialCount);
            console.log(`Homes with payments between $2000-$2400: ${filteredCount}`);
            const homeCards = await allModelsPage.homeCards.allTextContents();
            homeCards.forEach(home => {
                expect(home).not.toContain('Clayton');
            });
            await allModelsPage.resetFilters();
        });
    });

    test('As a user, I can filter homes by size range', async ({ page, allModelsPage }) => {
        await test.step('Test case 1: Filter with valid size range', async () => {
            const initialCount = await allModelsPage.verifyInitialCount();
            // Open the "From" dropdown and select a value
            await allModelsPage.selectSizeFrom('1000');
            let filteredCount = await allModelsPage.verifyFilteredResults(initialCount);
            console.log(`Homes with size from 1000 sq ft: ${filteredCount}`);

            // Open the "To" dropdown and select a value
            await allModelsPage.selectSizeTo('2000');
            filteredCount = await allModelsPage.verifyFilteredResults(initialCount);
            console.log(`Homes with size between 1000-2000 sq ft: ${filteredCount}`);
            await expect.soft(filteredCount).toBeLessThan(initialCount);
            await allModelsPage.resetFilters();
        });

        await test.step('Test case 2: Filter with no expected results', async () => {
            // Select a size range that should return no results
            await allModelsPage.selectSizeFrom('2500');
            await allModelsPage.selectSizeTo('2500');
            // Verify no items match filters
            await expect(allModelsPage.noItemsMatchFilters).toBeVisible();
            await allModelsPage.resetFilters();
        });

        await test.step('Test case 3: Filter to verify home sizes are within range', async () => {
            const initialCount = await allModelsPage.verifyInitialCount();
            
            await allModelsPage.selectSizeFrom('2400');
            await allModelsPage.selectSizeTo('2500');
            const filteredCount = await allModelsPage.verifyFilteredResults(initialCount);
            console.log(`Homes with size between 2400-2500 sq ft: ${filteredCount}`);
           // Verify all returned homes are Clayton Epic Summit
           const homeCards = await allModelsPage.homeCards.all();
           for (const card of homeCards) {
               const titleText = await card.textContent();
               expect(titleText).toContain('Clayton Epic Summit');
           }
            await allModelsPage.resetFilters();
        });
    });

    test('As a user, I can filter homes by dimensions', async ({ page, allModelsPage }) => {
        await test.step('Test case 1: Filter with valid width and length', async () => {
            const initialCount = await allModelsPage.verifyInitialCount();
            // Select max width
            await allModelsPage.selectMaxWidth('16');
            let filteredCount = await allModelsPage.verifyFilteredResults(initialCount);
            // Select max length
            await allModelsPage.selectMaxLength('76');
            filteredCount = await allModelsPage.verifyFilteredResults(initialCount);
            console.log(`Homes with max width 16 ft and max length 76 ft: ${filteredCount}`);
            await expect.soft(filteredCount).toBeLessThan(initialCount);
            await allModelsPage.resetFilters();
        });

        await test.step('Test case 2: Filter with no expected results', async () => {
            // Select dimensions that should return no results
            await allModelsPage.selectMaxWidth('14');
            await allModelsPage.selectMaxLength('40');
            console.log('No items match filters between 14 ft and 40 ft');
            await expect(allModelsPage.noItemsMatchFilters).toBeVisible();
            await allModelsPage.resetFilters();
        });

        await test.step('Test case 3: Verify dimensions are within selected range', async () => {
            const initialCount = await allModelsPage.verifyInitialCount();
            // Select specific dimensions that should return certain models
            await allModelsPage.selectMaxWidth('14');
            await allModelsPage.selectMaxLength('56');

            const filteredCount = await allModelsPage.verifyFilteredResults(initialCount);
            console.log(`Homes with max width 14 ft and max length 56 ft: ${filteredCount}`);
            // Verify the filtered results contain expected models
            const homeCards = await allModelsPage.homeCards.allTextContents();
            homeCards.forEach(home => {
                expect(home).not.toContain('Clayton'); 
            });
            await allModelsPage.resetFilters();
        });
    });

    test('As a user, I can filter homes by manufacturer', async ({ page, allModelsPage }) => {
        const manufacturers = ['Clayton', 'TRU', 'Oak Creek'];
        
        for (const manufacturer of manufacturers) {
            const initialCount = await allModelsPage.verifyInitialCount();
            await allModelsPage.filterByManufacturer(manufacturer);
            const filteredCount = await allModelsPage.verifyFilteredResults(initialCount);
            console.log(`${manufacturer} homes: ${filteredCount}`);
            await expect.soft(filteredCount).toBeLessThan(initialCount);
            
            // Verify all returned homes are from the selected manufacturer
            const homeCards = await allModelsPage.homeCards.allTextContents();
            const manufacturerName = manufacturer.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            homeCards.forEach(home => {
                expect(home).toContain(manufacturerName);
            });
            await allModelsPage.resetFilters();
        }
    });
});