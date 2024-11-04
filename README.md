# PorchPass Test Automation Project

This project contains automated tests for the Braustin Homes website functionality using Playwright with TypeScript.

## Prerequisites

- Node Version Manager (nvm)
- Node.js v22.11.0 (LTS)
- Git

## Setup Instructions

1. Clone the repository:
```bash
git clone git@github.com:ajrod-dev/PorchPass.git
cd PorchPass
```

2. Install Node.js using NVM:
```bash
nvm install 22.11.0
nvm use 22.11.0
```

3. Install dependencies:
```bash
npm install
```

## Project Structure

```
PorchPass/
├── src/
│   ├── pages/           # Page Object Models
│   │   ├── basePage.ts
│   │   ├── allModelsPage.ts
│   │   └── oneModelPage.ts
│   ├── tests/           # Test specifications
│   │   ├── allModels.spec.ts
│   │   ├── baseNavigation.spec.ts
│   │   └── oneModel.spec.ts
│   └── fixtures/        # Test fixtures and configurations
│       └── PageObjectManager.ts
├── playwright.config.ts
└── package.json
```

## Test Suites

### Base Navigation Tests
- Header menu navigation testing
- Navigation verification for all main menu items:
  - Home Menu (All Models, In Stock, On Land, On Sale, Saved Homes)
  - About Menu (Braustin Story, Customer Stories, Locations)
  - Learn Menu (Blog, Academy, Podcast, FAQs, Braustin Scholars)
  - Contact Us Menu (Contact Us, Commercial Accounts, Skirting Quote)

### All Models Page Tests
- Search functionality testing
- Filter testing for:
  - Section types (Single/Multi)
  - Number of bedrooms (1-5)
  - Number of bathrooms (1-3)
  - Estimated payment ranges
  - Size ranges
  - Dimensions (width/length)
  - Manufacturers (Clayton, TRU, Oak Creek)
- Reset filters functionality
- Results validation

### One Model Page Tests
- Page load verification
- Credit score adjustment testing
- Down payment modification testing
- Zip code validation
- Price calculation verification

## Page Objects

### BasePage
- Common navigation methods
- Header element definitions
- Shared functionality across pages

### AllModelsPage
- Home model card interactions
- Filter controls
- Search functionality
- Results management

### OneModelPage
- Model details interaction
- Payment calculator controls
- Configuration options

## Running Tests

Run all tests:
```bash
npx playwright test src/tests
```

Run tests in UI mode:
```bash
npx playwright test --ui
```

Run specific test file:
```bash
npx playwright test filename.spec.ts
```

## Configuration

The project uses Playwright's configuration file (`playwright.config.ts`) with:
- Base URL: https://www.braustin.com
- Browser: Chromium
- Slow motion: 500ms
- Screenshots on failure
- HTML reporter
- Retry attempts: 2 (CI only)

## Development Notes

- Using Page Object Model (POM) design pattern
- TypeScript for type safety
- Automated screenshot capture on test failures
- Retry mechanism for flaky tests in CI
- Comprehensive error handling and logging

## Continuous Integration

This project uses GitHub Actions for continuous integration. The workflow:

- Triggers on:
  - Push to main/master branch
  - Pull requests to main/master branch
  - Daily at midnight UTC

- Workflow steps:
  1. Sets up Node.js environment
  2. Installs dependencies
  3. Installs Playwright browsers
  4. Runs all tests
  5. Uploads test reports as artifacts

Test reports are available in the GitHub Actions tab after each run and are retained for 30 days.

To view test results:
1. Go to the GitHub Actions tab
2. Select the latest workflow run
3. Download the artifacts from the "Artifacts" section