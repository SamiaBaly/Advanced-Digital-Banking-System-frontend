# Advanced Digital Banking System – Backend

The backend of the Advanced Digital Banking System is built with **Node.js, Express.js, TypeScript, and MongoDB**. It provides secure REST APIs for customer banking operations, staff management, and administrative activities.

## 🚀 Technologies Used

- **Node.js** – JavaScript runtime
- **Express.js 5** – Backend framework
- **TypeScript** – Type-safe development
- **MongoDB Atlas** – NoSQL database
- **Mongoose** – MongoDB object modeling
- **JWT** – Authentication and authorization
- **bcrypt** – Password hashing
- **CORS** – Cross-origin resource sharing
- **dotenv** – Environment variable management
- **tsx / nodemon** – Development tools

## ✨ Features

### 🔐 Authentication
- User registration
- User login
- JWT-based authentication
- Password hashing
- Role-based authorization
- Account approval workflow

### 👤 Customer Management
- Customer profile management
- Customer account information
- Customer status management
- Customer approval and rejection

### 💳 Account Management
- Create and manage bank accounts
- Savings and other account types
- Account balance management
- Account status management

### 💸 Transaction Management
- Money transfers
- Debit and credit transactions
- Transaction history
- Transaction status tracking
- Balance validation
- Daily transfer limit validation

### 🏦 Banking Requests
- Deposit requests
- Withdrawal requests
- Staff request approval and rejection
- Automatic account balance updates

### 📄 Loan Management
- Loan application management
- Loan review and approval
- Loan rejection
- Loan disbursement
- EMI calculation

### 💳 Card Management
- Bank card management
- Card status management
- Customer card operations

### 🔔 Notifications
- Customer notifications
- Staff notifications
- Read and unread notification management
- Mark all notifications as read

### 🛡️ Admin Management
- Dashboard statistics
- Customer management
- Account management
- Transaction management
- Loan management
- Card management
- Staff management
- Reports and analytics
- Bank settings

### 👨‍💼 Staff Management
- Staff dashboard
- Pending banking requests
- Deposit and withdrawal review
- Loan management
- Transaction history
- Staff profile and verification
- Staff notifications
- Staff settings

### 🔒 Security
- JWT authentication middleware
- Role-based route protection
- Password hashing
- Input validation
- Protected API endpoints
- MongoDB transaction sessions for supported banking operations

## 📁 Project Structure

```text
backend/
├── api/
│   └── index.ts
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
├── vercel.json
├── package.json
├── tsconfig.json
└── .env
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
```

### 2. Navigate to Backend

```bash
cd backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5002
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000

ADMIN_NAME=System Administrator
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
```

Replace the example values with your actual configuration. Never commit your `.env` file or expose production credentials.

### 5. Run Development Server

```bash
npm run dev
```

The backend API will run at:

```text
http://localhost:5002
```

API base URL:

```text
http://localhost:5002/api
```

## 🏗️ Build & Production

Build the TypeScript project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## 🔗 API Integration

The backend exposes REST API endpoints for:

- Authentication
- Customer operations
- Account management
- Transactions
- Banking requests
- Loans
- Cards
- Notifications
- Admin operations
- Staff operations
- Reports and settings

The frontend communicates with these endpoints through Redux Toolkit Query.

## 🗄️ Database

The application uses MongoDB Atlas.

**Database Name:**

```text
Advanced-Digital-Banking-System
```

Mongoose is used to define schemas, models, relationships, and database operations.

## ☁️ Deployment

The backend is configured for deployment using Vercel.

Production API URL:

```text
https://advanced-digital-banking-backend.vercel.app/api
```

Configure the required environment variables in the deployment platform before deploying.

## 👩‍💻 Development

The backend follows a modular structure using:

- Express routes for API endpoints
- Mongoose models for database schemas
- Middleware for authentication and authorization
- TypeScript for type safety
- MongoDB sessions for supported transactional operations

---

**Advanced Digital Banking System**

A secure and reliable backend designed to power modern digital banking services.