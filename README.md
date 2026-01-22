
# Forex Converter

## Description
A simple and efficient currency conversion tool for forex trading and international transactions.

## Features
- Real-time exchange rate lookups
- Support for multiple currencies
- Easy-to-use API
- Accurate conversion calculations

## Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM for PostgreSQL
- **PostgreSQL** - Database

### External API
- **ExchangeRate.host** - Real-time forex rates

## Project Structure
```
forex-converter/
├──  backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts        # Prisma client configuration
│   │   ├── controllers/
│   │   │   └── conversionController.ts  # Request handlers
│   │   ├── services/
│   │   │   ├── forexService.ts    # Forex API integration
│   │   │   └── conversionService.ts     # Business logic
│   │   ├── routes/
│   │   │   └── conversionRoutes.ts      # API routes
│   │   ├── middleware/
│   │   │   └── errorHandler.ts    # Error handling
│   │   ├── types/
│   │   │   └── index.ts           # TypeScript interfaces
│   │   └── server.ts              # Express server setup
│   ├── .env                       # Environment variables
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx               # Main page
│   │   ├── layout.tsx             # Root layout
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── ConversionForm.tsx     # Currency conversion form
│   │   ├── ConversionResult.tsx   # Conversion result display
│   │   └── ConversionHistory.tsx  # History table
│   ├── services/
│   │   └── api.ts                 # API service layer
│   ├── types/
│   │   └── index.ts               # TypeScript interfaces
│   ├── .env.local                 # Environment variables
│   └── package.json
│
└── README.md
```

## Tools & Technologies
- **Runtime**: Node.js 18+
- **Package Manager**: npm
- **API Client**: axios
- **Linting**: ESLint
- **Environment**: dotenv
- **Database**: PostgreSQL 12+
- **ExchangeRate.host API key**


## Setup Instructions

### 1. Clone or Extract the Project
```bash
cd forex-converter
```

### 2. Database Setup

1. Install PostgreSQL if not already installed
2. Create a new database:
```sql
CREATE DATABASE forex_converter;
```

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env  # Or create manually
```

Edit `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/forex_converter?schema=public"
PORT=5000
FOREX_API_KEY=your_api_key_here
```

**Replace:**
- `YOUR_PASSWORD` with your PostgreSQL password
- `your_api_key_here` with your ExchangeRate.host API key

Run database migrations:
```bash
npx prisma migrate dev
```

Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 4. Frontend Setup

Open a new terminal:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local  # Or create manually
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Backend API (http://localhost:5000/api)

| Method | Endpoint        | Description                        |
|--------|-----------------|-----------------------------------|
| GET    | /rates          | Fetch latest forex exchange rates |
| POST   | /convert        | Convert currency and save to DB   |
| GET    | /conversions    | Get all past conversions          |

### Example API Usage

**Convert Currency:**
```bash
curl -X POST http://localhost:5000/api/convert \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "baseCurrency": "USD",
    "targetCurrency": "EUR"
  }'
```

**Get Conversion History:**
```bash
curl http://localhost:5000/api/conversions
```

## Usage

1. Open `http://localhost:3000` in your browser
2. Enter the amount you want to convert
3. Select the base currency (currency you have)
4. Select the target currency (currency you want)
5. Click "Convert"
6. View the conversion result and rate
7. See all past conversions in the history table below

## Database Schema

**Conversions Table:**

| Field            | Type          | Description                    |
|------------------|---------------|--------------------------------|
| id               | Integer       | Primary key (auto-increment)   |
| amount           | Decimal(18,2) | Original amount                |
| base_currency    | VARCHAR(3)    | Source currency code           |
| target_currency  | VARCHAR(3)    | Target currency code           |
| converted_amount | Decimal(18,2) | Converted amount               |
| conversion_rate  | Decimal(18,6) | Exchange rate used             |
| created_at       | Timestamp     | When conversion was made       |

## Development Notes

### Key Design Decisions

1. **Separation of Concerns**: Backend is organized into controllers, services, and routes for maintainability
2. **Type Safety**: TypeScript used throughout for compile-time error checking
3. **Prisma ORM**: Provides type-safe database queries and easy migrations
4. **Error Handling**: Centralized error handling with custom AppError class
5. **Validation**: Input validation on both frontend and backend
6. **Decimal Precision**: Using Decimal type for accurate financial calculations

## Challenges Encountered and Solutions

As this project was also a learning experience, I encountered several real-world challenges during development. Here's what I learned and how I overcame them:

### 1. Environment Variables Loading Order Issue

**Challenge**: Encountered a critical bug where the Forex API service was trying to access `process.env.FOREX_API_KEY` before the environment variables were loaded. This caused the API key to be `undefined`, leading to failed API requests.


**The Problem**: JavaScript/TypeScript modules are executed immediately when imported. The service constructor runs during the import phase, before any code in `server.ts` can execute.

**Root Cause**: The service was being instantiated (and trying to read environment variables) during the import chain, which happens before `server.ts` executes its own code.

**Solution**: Modified the npm script to use nodemon with the `--env-file` flag:
```json
"dev": "nodemon --exec tsx --env-file=.env src/server.ts"
```

### 2. Next.js/Prisma Version Compatibility Issues

**Challenge**: Encountered compatibility issues with the latest versions of Next.js and Prisma. Some features and APIs that existed in older tutorials or documentation were deprecated or changed in the current versions.

**Specific Issues**:
- Next.js App Router (new in v13+) has different conventions than the older Pages Router
- Prisma client generation sometimes needed manual triggering after schema changes
- Some TypeScript types had stricter requirements in newer versions

**Solution**: 
- Carefully read the official documentation for the current versions
- Used `npx prisma generate` after every schema change
- Ensured `"use client"` directive was added to components using React hooks
- Stayed with stable, well-documented versions rather than bleeding edge

**Learning**: Framework versions matter significantly. When learning, it's important to:
- Check the version in tutorials vs. what you're using
- Read official documentation for your specific version
- Understand that breaking changes happen between major versions

### 3. Choosing and Implementing MVC Architecture

**Challenge**: Made a conscious decision to follow MVC (Model-View-Controller) architecture rather than putting all logic in route handlers. This added initial complexity but required careful planning of where each piece of logic belongs.

**Considerations**:
- **Controllers**: Should only handle HTTP request/response
- **Services**: Should contain business logic and external API calls
- **Models**: Should handle database interactions
- Where does validation go? (Answer: Both controller and service layers)
- How to avoid circular dependencies?

**Solution**: 
- Spent time upfront planning the folder structure and responsibilities
- Created clear interfaces between layers
- Controllers call Services, Services call Models (one-way dependency)
- Used dependency injection pattern (services exported as singletons)

**Example Structure**:
```
Request → Controller (validate, handle HTTP) 
    → Service (business logic, orchestration) 
        → Prisma Model (database) + Forex API
```

This was definitely more challenging than putting everything in one file, but it's how real production applications are built.

### 4. Crafting the Service Layer

**Challenge**: Designing the service layer was particularly challenging. Had to decide:
- What methods should `forexService` expose?
- Should `conversionService` handle validation or just business logic?
- How to handle errors from the external API?
- How to make services reusable and testable?

**Key Decisions Made**:

**ForexService**:
- Separated `getLatestRates()` (get all rates) from `getConversionRate()` (get specific pair)
- Handled different API error scenarios (no response, bad response, rate not found)
- Used `axios` instead of `fetch` for better error handling and timeouts

**ConversionService**:
- Combined API call + calculation + database save in one transaction
- Placed business validation here (amount > 0, currencies different)
- Converted Prisma Decimal types to numbers for API responses
- Handled the orchestration between forex API and database

**Solution Pattern**:
```typescript
class ConversionService {
  async convertCurrency(data) {
    // 1. Validate
    // 2. Call external API (forexService)
    // 3. Calculate
    // 4. Save to database
    // 5. Return formatted result
  }
}
```

### 5. Type Safety with Prisma Decimals

**Challenge**: Prisma uses `Decimal` type for precise financial calculations, but JavaScript/TypeScript APIs expect `number`. Had to handle conversion without losing precision.

**Issue**:
```typescript
// Prisma returns Decimal objects
const conversion = await prisma.conversion.create({...});
// conversion.amount is Decimal, not number!
```

**Solution**: 
- Used Prisma's `Decimal` in the database for accuracy
- Converted to `number` using `.toNumber()` when sending API responses
- Used `new Decimal()` when saving to database
- Kept precision by using Decimal(18,2) for amounts and Decimal(18,6) for rates

**Learning**: Financial applications require special handling of decimal numbers. Regular JavaScript numbers use floating-point arithmetic which can cause rounding errors (e.g., 0.1 + 0.2 = 0.30000000000000004). This is why we use Decimal types.

### 6. Understanding Async/Await Flow

**Challenge**: Managing asynchronous operations across multiple layers (controller → service → API/database) while ensuring proper error propagation.

**Issues Encountered**:
- Errors from forex API weren't being caught properly
- Race conditions when multiple conversions happened quickly
- Understanding when to use `await` vs. when to return promises directly

**Solution**:
- Used `asyncHandler` wrapper to catch async errors in controllers
- Implemented proper try-catch in service layer
- Created custom `AppError` class for consistent error handling 

### 7. Database Schema Design Decisions

**Challenge**: Deciding on the exact database schema, field types, and constraints.

**Decisions Made**:
- Used `@map` to keep code in camelCase but database in snake_case (SQL convention)
- Added `createdAt` timestamp for sorting history
- Used auto-incrementing integer ID instead of UUID (simpler for this use case)
- Used VARCHAR(3) for currency codes (ISO standard)
- Chose precision levels: Decimal(18,2) for amounts, Decimal(18,6) for rates

**Learning**: Database design requires thinking about:
- Data types and precision
- Indexing (for future performance)
- Naming conventions
- How data will be queried

### 8. API Response Standardization

**Challenge**: Initially had inconsistent response formats from different endpoints, making frontend error handling difficult.

**Solution**: Standardized all responses to:
```typescript
// Success
{ success: true, data: {...} }

// Error
{ success: false, error: { message: "..." } }
```

**Learning**: API contracts are crucial. Consistent response structure makes frontend development much smoother and reduces bugs.

### 9. Balancing Learning and Delivery

**Challenge**: This being a project with a deadline, I had to balance:
- Taking time to understand concepts deeply
- Researching best practices vs. just making it work
- Writing clean code vs. shipping quickly
- Using AI assistance appropriately

**Approach Taken**:
- Used copilot and claude as a tool.
- Read documentation 


## Overall Reflection

This project was challenging in good ways. The difficulties I encountered were:

1. **Technical Challenges**: Environment variables, CORS, type conversions, async handling
2. **Architectural Challenges**: Designing clean, maintainable code structure
3. **Learning Challenges**: Building my understanding on tools (Prisma) and patterns (MVC in Node.js)

The most valuable lesson was that **well-organized code takes more time initially but saves time in debugging and maintenance**. When I encountered bugs:
- With MVC structure: I knew exactly which file to check
- With type safety: TypeScript caught errors before runtime
- With proper error handling: I got clear error messages pointing to the issue

If I were to start over, I would:
- Plan the architecture on paper first
- Set up error logging from the beginning
- Create API documentation (like a Postman collection) early

However, I'm proud of the clean, organized codebase I created, and I feel confident I can explain and modify any part of it during the in-person review.

## Key Takeaways

- **Module import order matters** in Node.js (environment variables first!)
- **CORS is required** for cross-origin requests in web applications
- **Clean architecture** (MVC) is more work upfront but worth it for maintainability
- **Type safety** catches bugs early and makes refactoring safer
- **Service layer design** requires careful thinking about responsibilities and abstractions
- **Version compatibility** is real - always check documentation for your specific versions
- **Financial calculations** need special data types (Decimal, not Float)
- **Learning by doing** is powerful, especially when you take time to understand "why"
