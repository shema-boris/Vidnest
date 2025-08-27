# Vidnest - Video Organization Platform

## Project Overview
Vidnest is a cross-platform video organization application that helps users save, categorize, and quickly find videos from multiple platforms in one centralized location.

## Tech Stack
- **Frontend**: React (Vite), React Router, Tailwind CSS, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT
- **APIs**: YouTube Data API, TikTok API, Instagram Graph API
- **Dev Tools**: ESLint, Prettier, dotenv

## Project Structure
```
Vidnest/
├── backend/                # Backend server
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Third-party services
│   ├── utils/             # Utility functions
│   ├── .env               # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js          # Entry point
└── frontend/              # Frontend React app
    ├── public/
    └── src/
        ├── assets/        # Static assets
        ├── components/    # Reusable components
        ├── context/       # React context
        ├── hooks/         # Custom hooks
        ├── pages/         # Page components
        ├── services/      # API services
        ├── styles/        # Global styles
        ├── utils/         # Utility functions
        ├── App.jsx
        └── main.jsx
```

## Implementation Phases

### Phase 1: Backend Foundation (Week 1-2)
- [x] Set up Express server with basic configuration
- [x] Configure MongoDB connection
- [x] Implement User model and authentication
- [ ] Create Video model with metadata fields
- [ ] Set up basic API routes
- [ ] Implement error handling and validation
- [ ] Set up environment configuration

### Phase 2: Core Features (Week 3-4)
- [ ] Video Management
  - [ ] Save video URLs with metadata
  - [ ] CRUD operations for videos
  - [ ] Categorization system
  - [ ] Platform detection (YouTube, TikTok, Instagram)
  - [ ] Metadata extraction from platforms

- [ ] User Experience
  - [ ] Video organization by categories/tags
  - [ ] Search and filtering
  - [ ] Pagination and sorting
  - [ ] Responsive design

### Phase 3: Platform Integration (Week 5-6)
- [ ] YouTube Integration
  - [ ] API connection
  - [ ] Metadata extraction
  - [ ] Thumbnail handling

- [ ] TikTok Integration
  - [ ] API connection
  - [ ] Metadata extraction

- [ ] Instagram Integration
  - [ ] API connection
  - [ ] Metadata extraction

### Phase 4: Frontend Development (Week 7-8)
- [ ] Set up React application
- [ ] Implement authentication flows
- [ ] Create dashboard layout
- [ ] Build video management interface
- [ ] Implement search and filtering UI
- [ ] Add responsive design

### Phase 5: Testing & Deployment (Week 9-10)
- [ ] Write unit and integration tests
- [ ] Implement error boundaries
- [ ] Performance optimization
- [ ] Set up CI/CD pipeline
- [ ] Deploy to production

## Environment Variables
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# API Keys
YOUTUBE_API_KEY=your_youtube_api_key
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
```

## Getting Started
1. Clone the repository
2. Install backend dependencies: `cd backend && npm install`
3. Install frontend dependencies: `cd ../frontend && npm install`
4. Create `.env` files in both backend and frontend directories
5. Start development servers:
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run dev`

## API Endpoints
### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Videos
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Add a new video
- `GET /api/videos/:id` - Get video by ID
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video
- `GET /api/videos/platform/:platform` - Get videos by platform
- `GET /api/videos/category/:category` - Get videos by category

## Dependencies
### Backend
- express: Web framework
- mongoose: MongoDB ODM
- jsonwebtoken: Authentication
- bcryptjs: Password hashing
- axios: HTTP client
- cors: Cross-origin resource sharing
- dotenv: Environment variables
- express-validator: Input validation

### Frontend
- react: UI library
- react-router-dom: Routing
- axios: HTTP client
- tailwindcss: Styling
- @headlessui/react: UI components
- react-hook-form: Form handling
- @heroicons/react: Icons
- framer-motion: Animations
