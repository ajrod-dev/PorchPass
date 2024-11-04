import { Locator, Page } from '@playwright/test';

export class BasePage {
    protected page: Page;
    readonly searchButton: Locator;
    readonly searchInput: Locator;
    readonly header: {
        // Home
        homeButton: Locator;
        allModels: Locator;
        inStock: Locator;
        onLand: Locator;
        onSale: Locator;
        saved: Locator
        // About
        aboutButton: Locator;
        braustinStory: Locator;
        customerStories: Locator;
        locations: Locator;
        // Learn
        learnButton: Locator;
        blog: Locator;
        academy: Locator;
        podcast: Locator;
        faqs: Locator;
        braustinScholars: Locator;
        // Contact Us
        contactUsButton: Locator;
        commercialAccountsButton: Locator;
        skirtingButton: Locator;
        phoneNumButton: Locator;
        searchButton: Locator;
        searchInput: Locator;
        
        
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
            // allModels: this.page.getByRole('button', { name: 'All Models' }).nth(0),
            allModels: this.page.getByLabel('All Models', { exact: true }),
            inStock: this.page.getByRole('button', { name: 'In Stock' }),
            onLand: this.page.getByRole('button', { name: 'On Land' }),
            onSale: this.page.getByRole('button', { name: 'On Sale' }),
            saved: this.page.getByRole('button', { name: 'Saved' }),
            // About Button Options
            braustinStory: this.page.getByRole('button', { name: 'Braustin Story' }),
            customerStories: this.page.getByRole('button', { name: 'Customer Stories' }),
            locations: this.page.getByRole('button', { name: 'Locations' }),
            // Learn Button Options
            blog: this.page.getByRole('button', { name: 'Blog' }),
            academy: this.page.getByRole('button', { name: 'Academy' }),
            podcast: this.page.getByRole('button', { name: 'Podcast' }),
            faqs: this.page.getByRole('button', { name: 'FAQs' }),
            braustinScholars: this.page.getByRole('button', { name: 'Braustin Scholars' })
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