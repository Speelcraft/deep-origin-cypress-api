# DeepOrigin – Product API Tests

A clean and efficient test suite for the DummyJSON Product API, built with Cypress and TypeScript. This project focuses on validating API endpoints, data formats, and core behaviors.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: LTS version (16-20 is recommended)
- **npm**: Comes bundled with Node.js
- **Git**: For cloning the repository
- **Internet access**: The test API is publicly available.

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Speelcraft/deep-origin-cypress-api.git
cd deeporigin-api-tests
npm install
```

## 🏃 Running the Tests

### Graphical User Interface (GUI)

This command opens the Cypress Test Runner, allowing you to select and watch tests run interactively.

```Bash
npx cypress open
```

### Headless Mode

This command runs all test specifications in headless, without opening the browser GUI.

```Bash
npx cypress run
```

# ⚙️ Project Structure

This section provides a quick overview of key project files and configurations.

- **Base URL**: `https://dummyjson.com` (configured in `cypress.config.ts`)
- **API Client**: The custom `ProductAPI` client is located at `cypress/support/api.ts`.
- **Test Specs**: All API tests are in `cypress/e2e/api/product.spec.ts`.
- **Typing**: The project uses TypeScript, with `tsconfig.json` pre-configured.

# ⚠️ Important Notes

- **Simulated Endpoints**: The `POST`, `PUT`, and `DELETE` endpoints on DummyJSON are simulated. They will return a successful response but do not persist any changes to the server-side data. The tests are written to validate this specific behavior.