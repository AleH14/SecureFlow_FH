# SecureFlow Backend

Backend API for the SecureFlow application built with Express.js and Node.js.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Database (PostgreSQL recommended)

### Installation

1. Clone the repository and navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file:
```bash
copy .env.example .env
```

4. Update the `.env` file with your configuration values.

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000` (or the port specified in your .env file).

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   └── database.js   # Database configuration
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js       # Authentication middleware
│   │   └── errorHandler.js
│   ├── routes/           # API routes
│   │   ├── index.js      # Main router
│   │   ├── auth.js       # Authentication routes
│   │   └── users.js      # User routes
│   ├── utils/            # Utility functions
│   │   └── helpers.js    # Helper functions
│   └── app.js            # Main application file
├── .env.example          # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## 🔗 API Endpoints

### Health Check
- `GET /health` - Server health status

### API Base
- `GET /api` - API information and available endpoints

### Authentication (Coming Soon)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users (Coming Soon)
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

## 🔧 Environment Variables

Copy `.env.example` to `.env` and update the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=secureflow_db
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Security & Rate Limiting
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

## 🔐 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request rate limiting
- **Input Validation** - Request validation (coming soon)
- **JWT Authentication** - Token-based authentication (coming soon)

## 📈 Features Coming Soon

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication with JWT
- [ ] Password hashing with bcrypt
- [ ] Input validation and sanitization
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Logging system
- [ ] File upload handling
- [ ] Email service integration

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 License

This project is licensed under the MIT License.