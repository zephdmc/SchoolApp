# User Management Service

This is a microservice for managing users, including authentication, authorization, and user profiles.

## Features

- User registration and login
- JWT-based authentication
- Role-based access control
- Secure password storage with bcrypt
- Rate limiting to prevent brute force attacks
- Logging with Winston
- API documentation with Swagger

## Requirements

- Node.js
- MongoDB
- Docker (optional)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/user-management-service.git
   cd user-management-service
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

4. Start the application:

   ```bash
   npm start
   ```

5. Run the tests:
   ```bash
   npm test
   ```

## Docker

To run the service using Docker:

```bash
docker-compose up --build
```
