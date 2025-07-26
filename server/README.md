# Food Surplus App - Server

This is the backend server for the Food Surplus Application, which allows users to donate and claim surplus food items.

## Features

- User authentication (register, login, get current user)
- Food item management (create, list, claim, delete)
- JWT-based authentication
- MongoDB database integration

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the server directory with the following variables (see `.env.example` for reference):
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```
   npm start
   ```
   Or for development with auto-reload:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user details (requires authentication)

### Food Items

- `GET /api/food` - Get all available food items
- `POST /api/food` - Create a new food item (requires authentication)
- `GET /api/food/my-donations` - Get user's donated food items (requires authentication)
- `GET /api/food/my-claims` - Get user's claimed food items (requires authentication)
- `PATCH /api/food/:id/claim` - Claim a food item (requires authentication)
- `DELETE /api/food/:id` - Delete a food item (requires authentication, only by donor)

## Project Structure

- `config/` - Database configuration
- `controllers/` - Route controllers
- `middleware/` - Custom middleware (authentication)
- `models/` - Mongoose models
- `routes/` - API routes
- `server.js` - Main application file