# Cost Manager RESTful Web Services

A RESTful web service for managing user costs and expenses.

## API Endpoints

### GET /api/about
Returns information about the development team members.

### GET /api/users/:id
Returns details of a specific user including their total costs.

### GET /api/report
Returns a monthly report of costs for a specific user, grouped by categories.

### POST /api/add
Adds a new cost item to the system.

## Database Schema

### User Schema
- id: Number (unique)
- first_name: String
- last_name: String
- birthday: String
- marital_status: String

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

## Running the Server

```bash
npm start
```

The server will run on port 3000 by default. 