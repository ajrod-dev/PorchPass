import { Locator, Page } from '@playwright/test';

export class BasePage {
    protected page: Page;
    readonly searchButton: Locator;
    readonly searchInput: Locator;
    readonly header: {
        homeButton: Locator;
        aboutButton: Locator;
        learnButton: Locator;
        contactUsButton: Locator;
        commercialAccountsButton: Locator;
        skirtingButton: Locator;
        phoneNumButton: Locator;
        searchButton: Locator;
        searchInput: Locator;
        allModels: Locator;
    };

    constructor(page: Page) {
        this.page = page;
        this.header = {
            homeButton: this.page.getByRole('button', { name: 'Homes' }).nth(0),
            aboutButton: this.page.getByRole('button', { name: 'About' }),
            learnButton: this.page.getByRole('button', { name: 'Learn' }),
            contactUsButton: this.page.getByRole('button', { name: 'Contact Us' }),
            commercialAccountsButton: this.page.getByRole('button', { name: 'Commercial Accounts' }),
            skirtingButton: this.page.getByRole('button', { name: 'Skirting' }),
            phoneNumButton: this.page.getByRole('button', { name: '830-355-6279' }),
            searchButton: this.page.getByRole('button', { name: 'Search' }),
            searchInput: this.page.locator('input[type="search"]').nth(1),
            // Homes Button Options
            allModels: this.page.getByRole('button', { name: 'All Models' }).nth(0),
        };
        
    }
    // Common methods that all pages will share
    async navigate(path: string) {
        const maxRetries = 3;
        let lastError;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                await this.page.goto(path, {
                    waitUntil: 'domcontentloaded',
                    timeout: 45000
                });
                await this.page.waitForLoadState('networkidle', { timeout: 45000 }).catch(e => {
                    console.log(`Network idle wait failed on attempt ${attempt}: ${e}`);
                });
                return; 
            } catch (error) {
                lastError = error;
                console.log(`Navigation failed on attempt ${attempt}: ${error}`);
                await this.page.waitForTimeout(2000);
            }
        }
        throw new Error(`Navigation failed after ${maxRetries} attempts. Last error: ${lastError}`);
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }
    
}