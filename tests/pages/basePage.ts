import { Page } from '@playwright/test';

export class BasePage {
    protected page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }

    // Common methods that all pages will share
    async navigate(path: string) {
        await this.page.goto(`https://www.braustin.com${path}`);
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }
}