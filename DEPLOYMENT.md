# FoodShare Deployment Guide

This guide provides step-by-step instructions for deploying the FoodShare application to Vercel.

## Prerequisites

1. Node.js 18.x or higher
2. npm 9.x or higher
3. Vercel CLI installed (`npm install -g vercel`)
4. Vercel account

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Atlas Connection
MONGODB_URI=your_mongodb_uri

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Client URL (for CORS)
CLIENT_URL=https://your-vercel-app.vercel.app

# Email Configuration
EMAIL_HOST=your_smtp_host
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
EMAIL_FROM=FoodShare <noreply@foodshare.com>
```

## Deployment Steps

1. **Install Dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client
   npm install --force

   # Install server dependencies
   cd ../server
   npm install --force
   cd ..
   ```

2. **Build the Application**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel**
   ```bash
   # Login to Vercel (if not already logged in)
   vercel login

   # Deploy to Vercel
   vercel --prod
   ```

4. **Set Environment Variables in Vercel**
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add all variables from your `.env` file

## Troubleshooting

- **Build Failures**: Check the build logs in the Vercel dashboard for specific error messages.
- **CORS Issues**: Ensure `CLIENT_URL` is correctly set in your environment variables.
- **Database Connection**: Verify your MongoDB Atlas connection string and network access settings.

## Maintenance

To update the application:

1. Pull the latest changes
2. Run `npm run build`
3. Deploy with `vercel --prod`

## Support

For any issues, please contact the development team.
