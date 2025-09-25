# Vidnest Backend

Backend API for Vidnest - A video organization platform.

## Features

- User authentication (register, login, logout)
- JWT-based authentication
- Protected routes
- Error handling
- MongoDB integration
- Environment configuration

## Prerequisites

- Node.js (v14 or later)
- MongoDB (local or cloud)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your environment variables (see `.env.example`)
4. Start the development server:
   ```bash
   npm run dev
   ```

The server will be running at `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/logout` - Logout (requires authentication)

- `GET /api/auth/profile` - Get user profile (requires authentication)

- `PUT /api/auth/profile` - Update profile (requires authentication)
  ```json
  {
    "name": "Updated Name",
    "email": "newemail@example.com",
    "password": "newpassword"
  }
  ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
```

## Development

- Run in development mode: `npm run dev`
- Build for production: `npm run build`
- Start production server: `npm start`

## Testing

To run tests:

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
