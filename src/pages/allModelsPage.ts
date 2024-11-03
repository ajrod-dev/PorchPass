import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from "./basePage";

export class AllModelsPage extends BasePage {
    // URL
    readonly path: string = '/shop/all-models';
    // Home Models Cards
    readonly homeCards: Locator;
    readonly startingAtPrice: Locator;
    // Reset & Show Homes buttons
    readonly resetFiltersButton: Locator;
    readonly noItemsMatchFilters: Locator;
    readonly showHomesButton: Locator;
    // All Home Models Grid Results
    readonly allModelsResults: Locator;
    // Section Filters
    readonly sectionFilterGroup: Locator;
    readonly sectionAnyButton: Locator;
    readonly sectionSingleButton: Locator;
    readonly sectionMultiButton: Locator;
    // Bedroom Filters
    readonly bedroomsGroup: Locator;
    readonly oneBedroomButton: Locator;
    readonly twoBedroomButton: Locator;
    readonly threeBedroomButton: Locator;
    readonly fourBedroomButton: Locator;
    readonly fiveBedroomButton: Locator;
    // Bathroom Filters
    readonly bathroomsGroup: Locator;
    readonly oneBath: Locator;
    readonly twoBaths: Locator;
    readonly threeBaths: Locator;
    // Estimated Payment Filters
    readonly estimatedPaymentGroup: Locator;
    readonly estimatedPaymentFrom: Locator;
    readonly estimatedPaymentTo: Locator;
    // Size Filters
    readonly sizeGroup: Locator;
    readonly sizeGroupFrom: Locator;
    readonly sizeGroupTo: Locator; 
    // Dimension Filters
    readonly dimensionsGroup: Locator;
    readonly maxWidthDropdown: Locator;
    readonly maxLengthDropdown: Locator;
    // Manufacturer Filters
    readonly manufacturerGroup: Locator;
    readonly manufacturerButtons: {
        any: Locator;
        clayton: Locator;
        tru: Locator;
        oakCreek: Locator;
    };

    constructor(page: Page) {
        super(page);
        this.homeCards = page.locator('a.homecard');
        this.startingAtPrice = this.homeCards.getByText('Starting at');
        // Reset Filters & Show Homes buttons
        this.resetFiltersButton = page.getByRole('link', { name: 'Reset Filters' });
        this.noItemsMatchFilters = page.getByText('No items match your filters');
        this.showHomesButton = page.getByRole('link', { name: /Show \d+ Homes/i });
        // All Models Results
        this.allModelsResults = page.locator('section.col-start-1.row-start-');
        // Section Filters
        this.sectionFilterGroup = page.locator('//span[normalize-space(text())="Sections"]');
        this.sectionAnyButton = page.getByRole('link', { name: 'Any' }).nth(1);
        this.sectionSingleButton = page.getByRole('link', { name: 'Single' }).nth(1);
        this.sectionMultiButton = page.getByRole('link', { name: 'Multi' }).nth(0);
        // Bedroom Filters
        this.bedroomsGroup = page.locator('.flex.flex-col' ,{ hasText: 'Bedrooms'});
        this.oneBedroomButton = this.bedroomsGroup.getByRole('link', { name: '1' }).first() ;
        this.twoBedroomButton = this.bedroomsGroup.getByRole('link', { name: '2' }).first();
        this.threeBedroomButton = this.bedroomsGroup.getByRole('link', { name: '3' }).first();
        this.fourBedroomButton = this.bedroomsGroup.getByRole('link', { name: '4' }).first();
        this.fiveBedroomButton = this.bedroomsGroup.getByRole('link', { name: '5' }).first();
        // Bathroom filters
        this.bathroomsGroup = page.locator('.flex.flex-col' ,{ hasText: 'Baths'});
        this.oneBath = this.bathroomsGroup.getByRole('link', { name: '1' }).nth(1);
        this.twoBaths = this.bathroomsGroup.getByRole('link', { name: '2' }).nth(1);
        this.threeBaths = this.bathroomsGroup.getByRole('link', { name: '3' }).nth(1);
        // Estimated payment filter dropdowns
        this.estimatedPaymentGroup = page.locator('.flex.flex-col', { 
            has: page.locator('span', { hasText: 'Estimated Payment' })
        });
        this.estimatedPaymentFrom = this.estimatedPaymentGroup
            .locator('button[aria-label="select button"]')
            .filter({ hasText: /\$\d+/ })
            .first();
        this.estimatedPaymentTo = this.estimatedPaymentGroup
            .locator('button[aria-label="select button"]')
            .filter({ hasText: /\$\d+/ })
            .nth(1);
                // Size filter dropdowns
        this.sizeGroup = page.locator('.flex.flex-col', { 
            has: page.locator('span', { hasText: 'Size' })
        });
        this.sizeGroupFrom = this.sizeGroup
            .locator('button[aria-label="select button"]')
            .filter({ hasText: /\d+/ })
            .nth(2);
        this.sizeGroupTo = this.sizeGroup
            .locator('button[aria-label="select button"]')
            .filter({ hasText: /\d+/ })
            .nth(3);
        // Dimension filters
        this.dimensionsGroup = page.locator('.flex.flex-col', { 
            has: page.locator('span', { hasText: 'Dimensions' })
        });
        this.maxWidthDropdown = this.dimensionsGroup
            .locator('button[aria-label="select button"]')
            .filter({ hasText: /\d+/ })
            .nth(4);
        this.maxLengthDropdown = this.dimensionsGroup
            .locator('button[aria-label="select button"]')
            .filter({ hasText: /\d+/ })
            .nth(5);
        // Manufacturer filters
        this.manufacturerGroup = page.locator('.flex.flex-col', { 
            has: page.locator('span', { hasText: 'Manufacturer' })
        });
        this.manufacturerButtons = {
            any: this.manufacturerGroup.getByRole('link', { name: 'Any' }),
            clayton: this.manufacturerGroup.getByRole('link', { name: 'Clayton' }),
            tru: this.manufacturerGroup.getByRole('link', { name: 'TRU' }),
            oakCreek: this.manufacturerGroup.getByRole('link', { name: 'Oak Creek' })
        };

    }
    // Navigation
    async goto() {
        await this.navigate(this.path);
    }
    async waitForFilters() {
        await this.page.waitForTimeout(1000);
    }

    async resetFilters() {
        await this.resetFiltersButton.click();
        await this.waitForFilters();
    }
    // Verify initial count of homes
    async verifyInitialCount() {
        const initialCount = await this.homeCards.count();
        await expect.soft(initialCount).toBeGreaterThan(0);
        return initialCount;
    }
    // Verify filtered results count
    async verifyFilteredResults(initialCount: number) {
        const filteredCount = await this.homeCards.count();
        await expect.soft(filteredCount).toBeGreaterThan(0);
        await expect.soft(filteredCount).toBeLessThan(initialCount);
        return filteredCount;
    }
    // Filter by bedroom count
    async filterByBedrooms(count: number) {
        switch(count) {
            case 1: await this.oneBedroomButton.click(); break;
            case 2: await this.twoBedroomButton.click(); break;
            case 3: await this.threeBedroomButton.click(); break;
            case 4: await this.fourBedroomButton.click(); break;
            case 5: await this.fiveBedroomButton.click(); break;
            default: await this.bedroomsGroup.getByRole('link', { name: 'Any' }).click();
        }
    }
    // Filter by bathroom count
    async filterByBathrooms(count: number) {
        switch(count) {
            case 1: await this.oneBath.click(); break;
            case 2: await this.twoBaths.click(); break;
            case 3: await this.threeBaths.click(); break;
            default: await this.bathroomsGroup.getByRole('link', { name: 'Any' }).click();
        }
    }
    async selectEstimatedPaymentFrom(value: string) {
        await this.estimatedPaymentFrom.click();
        const dropdownList = this.estimatedPaymentGroup.locator('ul[role="listbox"]').nth(2);
        await dropdownList.waitFor({ state: 'visible' }); 
        await dropdownList.getByRole('link', { name: `${value} /m` }).click();
        await this.waitForFilters();
    }

    async selectEstimatedPaymentTo(value: string) {
        await this.estimatedPaymentTo.click();
        const dropdownList = this.estimatedPaymentGroup.locator('ul[role="listbox"]').nth(3);
        await dropdownList.waitFor({ state: 'visible' }); 
        await dropdownList.getByRole('link', { name: `${value} /m` }).click();
        await this.waitForFilters();
    }
    async selectSizeFrom(value: string) {
        await this.sizeGroupFrom.click();
        const dropdownList = this.sizeGroup.locator('ul[role="listbox"]').nth(4);
        await dropdownList.waitFor({ state: 'visible' }); 
        await dropdownList.getByRole('link', { name: `${value} /ft2` }).click();
        await this.waitForFilters();
    }

    async selectSizeTo(value: string) {
        await this.sizeGroupTo.click();
        const dropdownList = this.sizeGroup.locator('ul[role="listbox"]').nth(5);
        await dropdownList.waitFor({ state: 'visible' }); 
        await dropdownList.getByRole('link', { name: `${value} /ft2` }).click();
        await this.waitForFilters();
    }

    async selectMaxWidth(value: string) {
        await this.maxWidthDropdown.click();
        const widthList = this.dimensionsGroup.locator('ul[role="listbox"]').nth(6);
        await widthList.waitFor({ state: 'visible' });
        await widthList.getByRole('link', { name: `${value} ft` }).click();
        await this.waitForFilters();
    }

    async selectMaxLength(value: string) {
        await this.maxLengthDropdown.click();
        const lengthList = this.dimensionsGroup.locator('ul[role="listbox"]').nth(7);
        await lengthList.waitFor({ state: 'visible' });
        await lengthList.getByRole('link', { name: `${value} ft` }).click(); 
        await this.waitForFilters();
    }

    async filterByManufacturer(manufacturer: string) {
        switch(manufacturer.toLowerCase()) {
            case 'clayton': await this.manufacturerButtons.clayton.click(); break;
            case 'tru': await this.manufacturerButtons.tru.click(); break;
            case 'oak creek': await this.manufacturerButtons.oakCreek.click(); break;
            default: await this.manufacturerButtons.any.click();
        }
        await this.waitForFilters();
    }
}