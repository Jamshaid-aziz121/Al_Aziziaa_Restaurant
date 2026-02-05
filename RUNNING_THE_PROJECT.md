# Aziz Restaurant Platform

This is a restaurant management platform with frontend and backend components.

## Project Structure

- `frontend/` - Docusaurus-based frontend application
- `backend/` - Node.js/Express backend API server
- `shared/` - Shared components and utilities
- `specs/` - Specification files

## Running the Application

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Setup Instructions

1. **Install Dependencies**

   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

2. **Configure Environment Variables**

   Copy the example environment file and update with your configuration:

   ```bash
   # In the backend directory
   cp .env.example .env
   # Edit .env file with your settings
   ```

3. **Run the Applications**

   **Option 1: Run separately**

   Terminal 1 (Backend):
   ```bash
   cd backend
   npm run dev  # Starts backend on port 3000
   ```

   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run start  # Starts frontend on port 3001
   ```

   **Option 2: Run with PM2 (recommended)**

   ```bash
   # Install PM2 globally if not already installed
   npm install -g pm2

   # Start both applications
   cd backend && pm2 start npm --name "aziz-backend" -- run dev
   cd ../frontend && pm2 start npm --name "aziz-frontend" -- run start
   ```

### Accessing the Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Backend Health Check**: http://localhost:3000/health

### Available Scripts

#### Frontend (in `/frontend` directory)
- `npm start` - Start development server on port 3001
- `npm run build` - Build for production
- `npm run serve` - Serve production build

#### Backend (in `/backend` directory)
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run test` - Run tests
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Features

- Restaurant reservation system
- Online ordering system
- Menu management
- Real-time status updates
- Dashboard for restaurant management
- Admin panel

## Enhanced Order Page

The order page has been enhanced with:
- Modern, attractive design with gradient backgrounds
- Responsive layout that works on all devices
- Animated menu item cards with hover effects
- Professional color scheme optimized for restaurant aesthetics
- High-quality placeholder images for menu items
- Improved typography with better font hierarchy
- Enhanced cart section with better visual organization
- Category badges for menu items
- Smooth animations and transitions