import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from "./basePage";
import path from 'path';

export class OneModelsPage extends BasePage {
    readonly testingUrl: string = 'shop/rgn-the-braustin';
    readonly modelName: Locator;
    readonly creditScoreGroup: Locator;
    readonly fairCredit: Locator;
    readonly goodCredit: Locator;
    readonly veryGoodCredit: Locator;
    readonly downPaymentGroup: Locator;
    readonly zeroPercentDown: Locator;
    readonly fivePercentDown: Locator;
    readonly tenPercentDown: Locator;
    readonly fifteenPercentDown: Locator;
    readonly twentyPercentDown: Locator;
    readonly downPaymentInput: Locator;
    readonly monthlyPayment: Locator;
    readonly estimatedMonthlyHeading: Locator;
    readonly estimatedMonthlyPayment: Locator;
    readonly airConditionerCheckbox: Locator;
    readonly zipCodeInput: Locator;
    readonly calculateButton: Locator;

    constructor(page: Page) {
        super(page);
        this.modelName = this.page.getByRole('heading', { level: 1} );
        this.creditScoreGroup = page.locator('.flex.flex-col', { 
            has: page.locator('span', { hasText: 'Credit Score' })
        });
        this.fairCredit = this.page.locator('#creditClassId-1')
        this.goodCredit = this.page.locator('#creditClassId-2')
        this.veryGoodCredit = this.page.locator('#creditClassId-3')
        this.downPaymentGroup = page.locator('.flex.flex-col', { 
            has: page.locator('span', { hasText: 'Credit Score' })
        });
        this.downPaymentGroup = page.locator('.flex.flex-col', { 
            has: page.locator('span', { hasText: 'Down Payment' })
        });
        this.zeroPercentDown = this.downPaymentGroup.getByText('0%', { exact: true })
        this.fivePercentDown = this.downPaymentGroup.getByText('5%', { exact: true })
        this.tenPercentDown = this.downPaymentGroup.getByText('10%', { exact: true })
        this.fifteenPercentDown = this.downPaymentGroup.getByText('15%', { exact: true })
        this.twentyPercentDown = this.downPaymentGroup.getByText('20%', { exact: true })
        this.downPaymentInput = page.locator('input[name="downPayment"][placeholder="Enter Down Payment"]');
        // Monthly payment locator
        this.monthlyPayment = this.page.locator('span.text07-b.text-clr-cnt-body-darker');
        // Air conditioner checkbox locator
        this.airConditionerCheckbox = this.page.locator('input[type="checkbox"]#air-conditioner');
        // Zip code input locator
        this.zipCodeInput = this.page.locator('input[name="deliveryZipCode"][placeholder="Enter Zip Code"]');
        // Calculate button locator
        this.calculateButton = this.page.locator('button:has-text("Calculate")').nth(1);
    }
    async goto() {
        await this.navigate(this.testingUrl);
    }
    /**
     * Sets the down payment percentage using the predefined buttons
     * @param percentage The percentage to set (0, 5, 10, 15, or 20)
     */
    async setDownPaymentPercentage(percentage: number) {
        // First ensure the down payment section is visible
        await this.downPaymentInput.waitFor({ state: 'visible', timeout: 5000 });
        
        switch (percentage) {
            case 0:
                await this.zeroPercentDown.click();
                break;
            case 5:
                await this.fivePercentDown.click();
                break;
            case 10:
                await this.tenPercentDown.click();
                break;
            case 15:
                await this.fifteenPercentDown.click();
                break;
            case 20:
                await this.twentyPercentDown.click();
                break;
            default:
                throw new Error(`Invalid down payment percentage: ${percentage}. Must be 0, 5, 10, 15, or 20.`);
        }
        await this.waitForPageLoad();
    }

}
