# Cost Manager RESTful Web Services

A RESTful web service for managing user costs and expenses.

## API Endpoints

### GET /api/about
Returns information about the development team members.

### GET /api/users/:id
Returns details of a specific user including their total costs.

### GET /api/report
Returns a monthly report of costs for a specific user, grouped by categories.
Query Parameters:
- id: User ID
- year: Year for the report
- month: Month for the report

### POST /api/add
Adds a new cost item to the system.
Required fields:
- description: String
- category: String (food, health, housing, sport, education)
- userid: Number
- sum: Number

### POST /api/users
Creates a new user.
Required fields:
- id: Number (unique)
- first_name: String
- last_name: String
- birthday: String
- marital_status: String

## Database Schema

### User Schema
- id: Number (unique)
- first_name: String
- last_name: String
- birthday: String
- marital_status: String
- total_costs: Number (computed field)

### Cost Schema
- description: String
- category: String (food, health, housing, sport, education)
- userid: Number
- sum: Number
- date: Date

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

## Running the Server

```bash
npm start
```

The server will run on port 5000 by default.

## API Documentation

The API documentation is available at:
- Local: `http://localhost:5000/docs`
- Production: `https://your-railway-app-url/docs`

To generate documentation:
```bash
npm run docs
```

## Project Structure

```
├── config/
│   └── Db.js           # Database configuration
├── models/
│   ├── User.js         # User model schema
│   └── Cost.js         # Cost model schema
├── routes/
│   └── userRouter.js   # API routes
├── docs/               # Generated API documentation
├── server.js           # Main application file
└── package.json
```

## Development Team

- Denis Volovik
- Lior Barel 