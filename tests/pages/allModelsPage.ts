import { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class AllModelsPage extends BasePage {
    private readonly path = '/shop/all-models';
    private readonly searchButton: Locator;
    private readonly searchInput: Locator;

    constructor(page: Page) {
        super(page);
        const searchButton = page.getByRole('button', { name: 'Search' });
        const searchInput = page.locator('input[type="search"]');
        


    }

    // Navigation
    async goto() {
        await this.navigate(this.path);
        await this.waitForPageLoad();
    }
}