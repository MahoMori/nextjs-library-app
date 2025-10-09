# 📚 Library App

A modern, full-stack digital library management system built with Next.js, TypeScript, and MongoDB. Browse colelction of books, manage your personal reading collection, and enjoy a seamless library experience.

## 🌟 Features

### 📖 Book Management

- **Browse by Genre**: Explore books across multiple genres including Fiction, Fantasy, Science Fiction, Mystery, Historical, and Non-Fiction
- **Book Details**: View comprehensive information including cover images, publication dates, and availability status

### 👤 User Management

- **Secure Authentication**: JWT-based user registration and login system with bcrypt password hashing
- **Personal Dashboard**: Access your personalized library management interface

### 📋 Personal Library Features

- **Checked Out Books**: Track books you've currently borrowed
- **Hold System**: Reserve books and manage your queue
- **Reading Wishlist**: Save books for later reading with the "For Later" feature
- **Real-time Updates**: Get instant updates on book availability and hold status

## 🚀 Live Demo

Experience the application live: **[Library App Demo](https://nextjs-library-app-p87v.vercel.app/)**

## 🛠️ Tech Stack

### Frontend

- **Frontend Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS and v0

### Backend

- **MongoDB** - NoSQL database for scalable data storage
- **JWT** - Secure user authentication
- **bcryptjs** - Password hashing

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB database (local or MongoDB Atlas)

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment Setup**

   Create a `.env` file in the root directory:

   ```env
   MONGODB_USER=your_mongodb_user_name
   MONGODB_PASSWORD=your_mongodb_password
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
library-app/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth_status/   # Authentication status
│   │   ├── checked_out/   # Checked out books management
│   │   ├── for_later/     # Reading wishlist
│   │   ├── genre/         # Genre-based book filtering
│   │   ├── hold/          # Book hold system
│   │   └── user_data/     # User management
│   ├── components/        # Reusable UI components
│   ├── genre/            # Genre pages
│   ├── hooks/            # Custom React hooks
│   ├── my-page/          # User dashboard
│   ├── sign-in/          # Authentication pages
│   ├── sign-up/
│   ├── book-data.ts      # Book database
│   └── types.d.ts        # TypeScript definitions
├── public/               # Static assets
└── configuration files
```

## 🔧 Available Scripts

```bash
# Development with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Code linting
npm run lint
```

## 🌐 API Endpoints

### Authentication

- `POST /api/sign_up` - User registration
- `POST /api/sign_in` - User login
- `POST /api/sign_out` - User logout
- `GET /api/auth_status` - Check authentication status

### Books & Library Management

- `GET /api/genre/[genre_name]` - Get books by genre
- `GET /api/checked_out` - Get user's checked out books
- `POST /api/checked_out/[book_id]` - Check out a book
- `GET /api/hold` - Get user's held books
- `POST /api/hold/[book_id]` - Place a hold on a book
- `GET /api/for_later` - Get user's reading wishlist
- `POST /api/for_later/[book_id]` - Add book to wishlist

---

**Happy Reading! 📕📗📘**
