# MongoDB Quick Start

## Start MongoDB
```bash
# Using Docker (Recommended)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or with Homebrew (macOS)
brew services start mongodb-community
```

## Start Backend
```bash
cd /Users/a/Desktop/rep/ECommerce-Hub
pnpm install
pnpm run dev
```

## Seed Admin User
```bash
# In a separate terminal
pnpm --filter scripts run seed
```

Default credentials:
- Username: `admin`
- Password: `admin123`

## Test API
```bash
curl http://localhost:5001/api/health
curl http://localhost:5001/api/products
curl http://localhost:5001/api/categories
```

## Environment Variables
Located in `/backend/api-server/.env`:
- `MONGODB_URI=mongodb://localhost:27017/ecommerce`
- `PORT=5001`
- `NODE_ENV=development`

## Documentation
- [Full Setup Guide](./MONGODB_SETUP.md)
- [Integration Details](./MONGODB_INTEGRATION.md)
