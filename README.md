
# Forex Converter

## Description
A simple and efficient currency conversion tool for forex trading and international transactions.

## Features
- Real-time exchange rate lookups
- Support for multiple currencies
- Easy-to-use API
- Accurate conversion calculations

## Installation
```bash
npm install forex-converter
```

## Usage
```javascript
const converter = require('forex-converter');

const result = converter.convert(100, 'USD', 'EUR');
console.log(result);
```

## Requirements
- Node.js 14+
- Valid API key for exchange rate data

## Configuration
Set your API key in a `.env` file:
```
FOREX_API_KEY=your_api_key_here
```

## Contributing
Contributions are welcome. Please fork the repository and submit a pull request.

## License
MIT

## Support
For issues and questions, please open an issue on GitHub.

## Project Structure
```
forex-converter/
├── src/
│   ├── index.js
│   ├── converter.js
│   ├── api.js
│   └── utils.js
├── tests/
│   └── converter.test.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Tools & Technologies
- **Runtime**: Node.js 14+
- **Package Manager**: npm
- **API Client**: axios
- **Testing**: Jest
- **Linting**: ESLint
- **Environment**: dotenv

## Setup Instructions

### Prerequisites
- Node.js 14 or higher
- npm 6 or higher

### Local Development
```bash
git clone https://github.com/yourusername/forex-converter.git
cd forex-converter
npm install
cp .env.example .env
```

### Running Tests
```bash
npm test
```

### Starting the Server
```bash
npm start
```

## API Endpoints

### Convert Currency
**POST** `/api/convert`

Request body:
```json
{
    "amount": 100,
    "from": "USD",
    "to": "EUR"
}
```

Response:
```json
{
    "amount": 100,
    "from": "USD",
    "to": "EUR",
    "rate": 0.92,
    "result": 92.00
}
```

### Get Exchange Rates
**GET** `/api/rates/:currency`

Response:
```json
{
    "base": "USD",
    "rates": {
        "EUR": 0.92,
        "GBP": 0.79,
        "JPY": 110.25
    }
}
```
