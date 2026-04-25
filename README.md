# ShabdVerse — Book Exchange & Community Platform

> A full-stack platform where readers discover, exchange, and discuss books — organized into genre-based communities with a built-in marketplace and real-time chat.

---

## Problem Statement

Most book exchange platforms are either too generic (craigslist-style) or too transactional (no community). ShabdVerse bridges that gap by combining a **peer-to-peer book marketplace** with **genre-based community tribes** where readers can post, discuss, and chat in real time.

---

## Features

| Feature | Description |
|---------|-------------|
| **Authentication** | JWT-based register/login with role-based access (Reader, Seller, Admin) |
| **Seller Approval System** | New seller accounts are locked until an admin approves them |
| **Book Listings** | Sellers list books with cover images, condition, price, and quantity |
| **Marketplace** | Buyers browse and order books; sellers manage order status |
| **Community Tribes** | Genre-based communities with posts, threaded replies, and real-time chat |
| **Book Reviews** | Readers rate and review books; average rating auto-updates |
| **Admin Panel** | Manage users, moderate content, and approve pending sellers |
| **Image Uploads** | Cover images and avatars via ImageKit CDN |
| **Real-time Chat** | Socket.io tribe chat with optional Redis adapter for scaling |
| **Notifications** | User notification system (backend complete, ready for frontend integration) |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + Vite, React Router v6, Axios, Sonner (toasts), Lucide Icons |
| **Backend** | Node.js, Express v5, Socket.io |
| **Database** | MongoDB + Mongoose ODM |
| **Auth** | JWT (JSON Web Tokens), bcryptjs |
| **File Storage** | ImageKit CDN |
| **Validation** | express-validator |
| **Real-time Scaling** | Redis adapter for Socket.io (optional) |
| **Styling** | Vanilla CSS (custom design system — dark mode, glassmorphism) |

---

## Project Structure

```
shabdverse/
├── backend/                    # Node.js / Express API
│   ├── scripts/
│   │   └── addBookCLI.js       # CLI tool to seed books from the terminal
│   ├── src/
│   │   ├── controllers/        # Route handler logic
│   │   ├── db/                 # MongoDB connection
│   │   ├── middleware/         # Auth, role, error, validation middlewares
│   │   ├── models/             # Mongoose schemas (User, Book, Order, etc.)
│   │   ├── routes/             # Express route definitions
│   │   ├── sockets/            # Socket.io event handlers (chat)
│   │   ├── validations/        # express-validator rule sets
│   │   └── app.js              # Express app setup
│   ├── index.js                # Server entry point (HTTP + Socket.io)
│   ├── .env                    # Environment variables (not committed)
│   └── package.json
│
├── frontend/                   # React / Vite SPA
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js        # Axios instance with token interceptor
│   │   ├── components/         # Reusable UI components (Navbar, BookCard, etc.)
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global auth state management
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility functions (cn, etc.)
│   │   ├── pages/              # Full-page route components
│   │   └── App.jsx             # Router + layout setup
│   ├── .env                    # Frontend environment variables
│   ├── vite.config.ts          # Vite config with /api proxy
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js** v18+
- **MongoDB** — running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI
- **Redis** — optional, only needed for Socket.io horizontal scaling
- **ImageKit account** — for image uploads (free tier works fine)

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd shabdverse
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shabdverse
JWT_SECRET=your_super_secret_key_here
FRONTEND_URL=http://localhost:8080

# ImageKit (required for image uploads)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# Redis (optional — only for multi-instance Socket.io scaling)
# REDIS_URL=redis://localhost:6379
```

Start the backend:

```bash
npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=/api
```

Start the frontend:

```bash
npm run dev
# App runs on http://localhost:8080
```

> **Note:** Frontend and backend are fully independent. Run them in separate terminals from their own directories.

### 4. Seed Books (Optional)

```bash
cd backend
node scripts/addBookCLI.js
```

---

## Seller Approval Flow

1. A user registers with role **Seller** → `isApproved: false` is set in the database
2. The seller **cannot log in** until approved — they see: *"Your account is pending admin approval."*
3. **Admin** logs in → navigates to **Admin Panel → Seller Approvals**
4. Admin sees a table of all pending sellers and clicks **Approve**
5. The seller's `isApproved` is set to `true` → they can now log in normally

> **Existing sellers in DB:** If you have sellers created before this feature was added, run this one-time MongoDB command to approve them:
> ```js
> db.users.updateMany({ role: 'seller' }, { $set: { isApproved: true } })
> ```

---

## API Overview

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register a new user |
| POST | `/api/auth/login` | — | Login (returns JWT token) |
| GET | `/api/auth/me` | ✅ | Get current logged-in user |

### Books
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/books` | — | List all books (filterable) |
| GET | `/api/books/:id` | — | Get single book |
| POST | `/api/books` | Seller/Admin | Create a new book listing |
| PUT | `/api/books/:id` | Owner/Admin | Update a book |
| DELETE | `/api/books/:id` | Owner/Admin | Delete a book |

### Marketplace
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/marketplace` | — | Browse books for sale |
| POST | `/api/marketplace/order/:bookId` | ✅ | Place an order |
| GET | `/api/marketplace/orders` | ✅ | Get user's orders (buyer + seller) |
| PUT | `/api/marketplace/order/:orderId` | Seller | Update order status |
| PUT | `/api/marketplace/list/:bookId` | Seller/Admin | List a book for sale |

### Communities
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/communities` | Optional | List all communities |
| POST | `/api/communities` | ✅ | Create a community |
| POST | `/api/communities/:id/join` | ✅ | Join a community |
| GET | `/api/communities/:id/chat` | Optional | Get chat history |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/users` | Admin | List all users |
| DELETE | `/api/admin/users/:id` | Admin | Delete a user |
| GET | `/api/admin/orders` | Admin | List all orders |
| DELETE | `/api/admin/books/:id` | Admin | Delete any book |
| GET | `/api/admin/pending-sellers` | Admin | **Get unapproved sellers** |
| PATCH | `/api/admin/sellers/:id/approve` | Admin | **Approve a seller** |

### Other
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/upload` | ✅ | Upload image to ImageKit |
| GET | `/api/reviews/book/:bookId` | — | Get reviews for a book |
| POST | `/api/reviews` | ✅ | Submit a review |
| GET | `/api/notifications` | ✅ | Get user notifications |
| PUT | `/api/notifications/:id/read` | ✅ | Mark notification as read |

---

## Environment Variables Reference

| Variable | Location | Required | Description |
|----------|----------|----------|-------------|
| `PORT` | backend | No | Server port (default: 5000) |
| `MONGO_URI` | backend | Yes | MongoDB connection string |
| `JWT_SECRET` | backend | Yes | Secret key for JWT signing |
| `FRONTEND_URL` | backend | Yes | CORS origin for frontend |
| `IMAGEKIT_PUBLIC_KEY` | backend | Yes* | ImageKit public key |
| `IMAGEKIT_PRIVATE_KEY` | backend | Yes* | ImageKit private key |
| `IMAGEKIT_URL_ENDPOINT` | backend | Yes* | ImageKit URL endpoint |
| `REDIS_URL` | backend | No | Redis URL for Socket.io scaling |
| `VITE_API_URL` | frontend | No | API base URL (default: `/api`) |

*Required only if using image upload features.
