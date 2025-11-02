
## 🛠️ Installation

1. **Clone or download this starter template**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
dev-fe-task/
├── app/          # Next.js pages & layouts
├── component/    # Reusable React components
├── e2e/          # End-to-end tests
├── entities/     # Core domain entities
├── enum/         # Shared enums/constants
├── lib/          # Utilities & API calls
├── mappers/      # Data transformation (API ↔ entities/models)
├── models/       # Data models for state/type safety
└── utils/        # Small helper functions

```

```bash
# Run all tests
npm run test:e2e

# Run 1 file test  
npx playwright test e2e/tests/{file-name}.spec.ts

# Run tests with report
npx playwright show-report
