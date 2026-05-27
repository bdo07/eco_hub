# MongoDB Setup Guide

## Prerequisites
- MongoDB installed locally or access to a MongoDB Atlas cluster

## Local MongoDB Setup

### Option 1: Using Docker (Recommended)
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Option 2: Manual Installation
1. Install MongoDB from: https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   - **macOS (Homebrew)**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`
   - **Windows**: Use MongoDB Services manager

## Environment Configuration

Create a `.env` file in `backend/api-server/` with:
```
MONGODB_URI=mongodb://localhost:27017/ecommerce
PORT=5001
NODE_ENV=development
```

## MongoDB Atlas (Cloud)

For production or cloud deployment:
1. Create account at: https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/ecommerce`)
4. Update `MONGODB_URI` in `.env`

## Database Collections

The following collections are automatically created by Mongoose:
- **Products**: Store product information (name, price, images, etc.)
- **Categories**: Product categories
- **Orders**: Customer orders
- **Admins**: Admin user accounts

## Seeding Data

To seed the database with initial data:
```bash
cd scripts
pnpm run seed
```

## Verification

Test MongoDB connection:
```bash
npm run dev
```

If connection is successful, you should see:
```
✓ Connected to MongoDB
✓ Server listening on port 5001
```
