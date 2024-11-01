# PorchPass Test Automation Project

This project contains automated tests for Braustin website functionality using Playwright with TypeScript.

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
nvm install 20.11.1
nvm use 20.11.1
```

3. Install dependencies:
```bash
npm install
```

4. Install Playwright with Chromium:
```bash
npm init playwright@latest
# Choose the following options:
# - TypeScript: Yes
# - Tests folder: tests
# - GitHub Actions: No
# - Browsers: Chromium only
```

## Project Structure

```
PorchPass/
├── tests/
│   ├── pages/        # Page Object Models
│   ├── fixtures/     # Test data and configurations
│   └── *.spec.ts     # Test specifications
├── playwright.config.ts
└── package.json
```

## Running Tests

To run the tests:
```bash
npx playwright test
```

To run tests in UI mode:
```bash
npx playwright test --ui
```

## Additional Notes

- Using Page Object Model (POM) design pattern for better maintainability
- Tests are focused on BrAustin website functionality including:
  - Search and Filter functionality
  - Monthly payment calculations
  - Navigation testing
  - Dynamic updates validation

## Development Notes

- `.gitignore` is configured to exclude:
  - node_modules/
  - test-results/
  - playwright-report/
  - blob-report/
  - playwright/.cache/
  - IDE specific files
  - System files (.DS_Store)
  - Environment files
  - Debug logs
  - TypeScript compilation output