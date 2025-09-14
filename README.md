# 🍽️ FoodShare - Food Surplus Sharing Platform

A modern web application that connects food donors with those in need, reducing food waste while helping communities. Built with the MERN stack and featuring real-time notifications, geolocation, and advanced search capabilities.

## 🌟 Features

### Core Features
- **User Authentication** - Secure registration and login system
- **Food Donation** - Easy-to-use interface for donating surplus food
- **Food Discovery** - Browse and search available food items
- **Claim System** - Simple claiming process for food recipients
- **User Profiles** - Manage donations and claims

### Advanced Features
- **Image Upload** - Cloudinary integration for food photos
- **Geolocation** - Location-based food discovery
- **Advanced Search** - Filter by category, location, expiry date
- **Rating System** - User feedback and trust building
- **Email Notifications** - Automated reminders and updates
- **Progressive Web App** - Mobile-friendly with offline capabilities

## 🚀 Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Cloudinary** - Image storage and optimization
- **Nodemailer** - Email notifications

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (Atlas)
- Cloudinary account (for image uploads)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/udayanalone/food-surplus-app.git
   cd food-surplus-app
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Configuration**
   
   Create `.env` files in both server and client directories:
   
   **Server (.env)**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/foodshare
   JWT_SECRET=your_super_secret_jwt_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```
   
   **Client (.env)**
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

4. **Start the application**
   ```bash
   # Start server (from server directory)
   npm run dev
   
   # Start client (from client directory)
   npm start
   ```

## 🏗️ Project Structure

```
food-surplus-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   └── services/       # API services
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   └── server.js         # Main server file
├── package.json          # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Food Management
- `GET /api/food` - Get all available food items
- `POST /api/food` - Create new food donation
- `GET /api/food/search` - Search food items
- `GET /api/food/nearby` - Get nearby food items
- `GET /api/food/my-donations` - Get user's donations
- `GET /api/food/my-claims` - Get user's claims
- `PATCH /api/food/:id/claim` - Claim food item
- `DELETE /api/food/:id` - Delete food item
- `POST /api/food/:id/rate` - Rate food donor

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read

## 🎨 UI Components

The application uses a modern, responsive design with:
- Clean, intuitive interface
- Mobile-first approach
- Accessibility features
- Dark/light mode support
- Loading states and error handling

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Environment variable protection

## 📱 Progressive Web App

- Service worker for offline functionality
- App manifest for installation
- Push notifications
- Background sync
- Responsive design

## 🧪 Testing

```bash
# Run server tests
cd server
npm test

# Run client tests
cd client
npm test

# Run e2e tests
npm run test:e2e
```

## 🚀 Deployment

### Using Vercel (Recommended)

1. **Deploy to Vercel**
   ```bash
   npm run deploy
   ```

2. **Environment Variables**
   Configure all environment variables in Vercel dashboard

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 📊 Performance Optimization

- Image optimization with Cloudinary
- Lazy loading for components
- API response caching
- Database indexing
- Bundle size optimization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by food waste reduction initiatives
- Built with love for the community

## 📞 Support

For support, email support@foodshare.com or join our Slack channel.

---

**Made with ❤️ to reduce food waste and help communities**
