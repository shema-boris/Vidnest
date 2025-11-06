# VidNest Project Structure

## Current Structure (Confusing)
```
C:\Users\HP\boris\Vidnest\Vidnest\
├── backend/
├── Frontend/
├── docs/
└── README.md
```

## Recommended Clean Structure
```
C:\Users\HP\boris\Vidnest\
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── app.js             # Express app configuration
│   │   ├── config/
│   │   │   └── db.js          # Database connection
│   │   ├── controllers/       # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── videoController.js
│   │   │   └── categoryController.js
│   │   ├── middleware/        # Custom middleware
│   │   │   ├── auth.js
│   │   │   └── errorMiddleware.js
│   │   ├── models/           # Database models
│   │   │   ├── User.js
│   │   │   ├── Video.js
│   │   │   └── Category.js
│   │   ├── routes/           # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── videoRoutes.js
│   │   │   ├── shareRoutes.js
│   │   │   └── categoryRoutes.js
│   │   ├── services/         # Business logic
│   │   │   └── videoImportService.js
│   │   └── utils/           # Utility functions
│   │       └── videoUtils.js
│   ├── __tests__/           # Test files
│   ├── package.json
│   ├── server.js            # Server entry point
│   └── README.md
├── frontend/                 # React/Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── common/      # Common UI components
│   │   │   ├── layout/      # Layout components
│   │   │   └── videos/      # Video-specific components
│   │   ├── contexts/        # React contexts
│   │   │   ├── AuthContext.jsx
│   │   │   ├── VideoContext.jsx
│   │   │   └── CategoryContext.jsx
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   │   ├── auth/        # Authentication pages
│   │   │   ├── videos/      # Video pages
│   │   │   └── user/        # User pages
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # App entry point
│   ├── public/              # Static assets
│   │   ├── manifest.json    # PWA manifest
│   │   ├── sw.js           # Service worker
│   │   └── bookmarklet.js  # Browser bookmarklet
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── docs/                     # Documentation
│   ├── PLATFORM_SUPPORT.md
│   └── VIDEO_IMPORT_SYSTEM.md
├── README.md                 # Main project README
└── package.json             # Root package.json (optional)
```

## Key Changes Made

### Backend Structure
- ✅ Moved all backend code to `backend/src/`
- ✅ Standard Express.js structure
- ✅ Separated concerns (controllers, routes, services)
- ✅ Added Web Share Target API support

### Frontend Structure
- ✅ Standard React.js structure
- ✅ Component organization by feature
- ✅ PWA support with manifest.json
- ✅ Service worker for offline support
- ✅ Web Share Target integration

### New Features Added
- ✅ Web Share Target API for mobile sharing
- ✅ Quick Import component for web users
- ✅ PWA manifest for app installation
- ✅ Browser bookmarklet for power users
- ✅ Enhanced metadata extraction
- ✅ Smart categorization

## Next Steps

1. **Choose one project** to work with (recommend the newer one)
2. **Move files** to clean structure if needed
3. **Update import paths** if structure changes
4. **Test functionality** after reorganization
5. **Update documentation** with new structure


