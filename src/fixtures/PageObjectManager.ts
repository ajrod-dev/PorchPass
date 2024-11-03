import { BasePage } from "../pages/basePage";
import { AllModelsPage } from "../pages/allModelsPage";
import { test as base } from "@playwright/test";


type PageObjects = {
    allModelsPage: AllModelsPage;
    basePage: BasePage;
}

export const test = base.extend<PageObjects> ({
    allModelsPage: async ({ page }, use) => {
        await use(new AllModelsPage(page));
    },
    basePage: async ({ page }, use) => {
        await use(new BasePage(page));
    }
})