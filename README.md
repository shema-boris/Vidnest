# Vidnest - Video Organization Platform

A platform that helps you save, organize, and manage videos from various social media platforms in one place.

## Features

- Save videos from TikTok, Instagram, YouTube, and more
- Organize videos into categories and tags
- Search and filter your video collection
- View video analytics and statistics
- Secure video storage and management

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd vidnest
   ```

2. Install dependencies:
   ```bash
   # Frontend
   cd Frontend
   npm install

   # Backend
   cd ../video-organizer-backend
   npm install
   ```

3. Configure environment variables:
   - Create `.env` file in `video-organizer-backend` directory
   - Add the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd video-organizer-backend
   npm run dev

   # In a new terminal, start frontend
   cd ../Frontend
   npm run dev
   ```

### Usage

1. Register or login to your account
2. Import videos from supported platforms
3. Create categories and organize your videos
4. Use the search and filter features to find videos
5. View video analytics and statistics

## Supported Platforms
- TikTok
- Instagram
- YouTube
- More platforms coming soon...

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Support

For support, please open an issue in the GitHub repository.

## Acknowledgments

- Thanks to all contributors and users who help make this project better
- Special thanks to the open-source community for the tools and libraries used in this project
