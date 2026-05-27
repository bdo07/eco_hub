# MongoDB Integration for ECommerce Hub Backend

## Summary

MongoDB has been successfully integrated into your backend using Mongoose. The following has been set up:

### ✅ What's Been Configured

1. **Database Models** (in `/backend/packages/db/src/models/`)
   - `Product.ts` - Stores product information with featured status
   - `Category.ts` - Product categories with unique slugs
   - `Order.ts` - Customer orders with item details
   - `Admin.ts` - Admin user accounts with hashed passwords

2. **Database Connection**
   - Configured in `/backend/packages/db/src/index.ts`
   - Connects to MongoDB using `MONGODB_URI` environment variable
   - Graceful error handling for connection failures

3. **API Routes** (all fully implemented with MongoDB queries)
   - `GET /api/products` - List all products with filters
   - `GET /api/products/featured` - Get featured products
   - `GET /api/products/:id` - Get single product
   - `POST /api/products` - Create product (admin)
   - `PATCH /api/products/:id` - Update product (admin)
   - `DELETE /api/products/:id` - Delete product (admin)
   - `GET /api/categories` - List all categories
   - `POST /api/categories` - Create category (admin)
   - `PATCH /api/categories/:id` - Update category (admin)
   - `DELETE /api/categories/:id` - Delete category (admin)
   - `GET /api/orders` - List orders with filters
   - `POST /api/orders` - Create order
   - `GET /api/orders/:id` - Get order details
   - `PATCH /api/orders/:id/status` - Update order status (admin)
   - `POST /api/admin/login` - Admin login
   - `GET /api/admin/me` - Check admin session
   - `POST /api/admin/logout` - Admin logout

4. **Environment Configuration**
   - `.env.example` - Template with required variables
   - `.env` - Local development configuration
   - Environment variables added to `.gitignore`

5. **Seed Script** (for initial admin setup)
   - Located at `/scripts/seed-admin.ts`
   - Creates default admin user: `admin / admin123`
   - Run with: `cd scripts && pnpm run seed`

### 🚀 Getting Started

#### 1. Install MongoDB

**Option A: Docker (Recommended)**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: Local Installation**
- macOS: `brew install mongodb-community && brew services start mongodb-community`
- Linux: `sudo apt-get install mongodb && sudo systemctl start mongod`
- Windows: Download from https://www.mongodb.com/try/download/community

#### 2. Set Environment Variables

The backend expects `MONGODB_URI` in `/backend/api-server/.env`:
```
MONGODB_URI=mongodb://localhost:27017/ecommerce
PORT=5001
NODE_ENV=development
```

#### 3. Seed Initial Data

```bash
cd /Users/a/Desktop/rep/ECommerce-Hub
pnpm install
cd scripts
pnpm run seed
```

#### 4. Start the Backend Server

```bash
cd /Users/a/Desktop/rep/ECommerce-Hub
pnpm run dev
```

The server should output:
```
✓ Connected to MongoDB
✓ Server listening on port 5001
```

### 📊 Database Collections

Collections are automatically created by Mongoose when first used:

- **products** - E-commerce products
- **categories** - Product categories
- **orders** - Customer orders
- **admins** - Admin users

### 🔗 API Integration

The frontend already imports from `@workspace/api-client-react`, which uses the generated API client. The generated hooks like `useGetFeaturedProducts()`, `useListCategories()`, etc. will now work with the MongoDB backend.

### ⚙️ Production Deployment

For MongoDB Atlas (Cloud):
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get the connection string (e.g., `mongodb+srv://user:password@cluster.mongodb.net/ecommerce`)
4. Update `MONGODB_URI` in production environment

### 📝 Files Modified

- ✏️ `/backend/packages/db/src/index.ts` - Enhanced error handling
- ✏️ `/backend/api-server/src/index.ts` - Added database connection wait
- ✏️ `/scripts/seed-admin.ts` - Fixed import path
- ✏️ `/scripts/package.json` - Added seed script and dependencies
- ✏️ `/backend/api-server/.env` - Created with MongoDB URI
- ✏️ `/.gitignore` - Added .env files
- ✨ `/MONGODB_SETUP.md` - Created comprehensive setup guide
- ✨ `/.env.example` - Created environment template

### 🧪 Testing the API

Once running, test with:
```bash
curl http://localhost:5001/api/health
curl http://localhost:5001/api/products
curl http://localhost:5001/api/categories
```

### 📚 Additional Resources

- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Atlas Getting Started](https://www.mongodb.com/docs/atlas/getting-started/)
