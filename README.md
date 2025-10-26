# Event Management & Ticket Booking System
## Features

### User Features
- User registration and login
- Browse and search events
- View event details
- Book tickets for events
- View personal bookings in user dashboard
- Forgot password functionality

### Admin Features
- Admin dashboard with analytics (revenue, user growth, etc.)
- Manage events (view, potentially add/edit in future)
- View all bookings

### Backend APIs
- Authentication (register, login, forgot password)
- Events management (CRUD operations)
- Bookings management
- Analytics for admin

## Prerequisites

- Node.js (version 14 or higher)
- MongoDB (running locally or remote connection)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd "Event Management - Copy"
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the `backend` directory
   - Add necessary environment variables (e.g., MongoDB connection string, JWT secret, email service credentials)

    JWT_SECRET=your_jwt_secret_here
    
    NODE_ENV=development
   
    USE_ETHEREAL=false
   
    EMAIL_USER=your email Id
   
    EMAIL_PASS=app password from google account
   
    MONGO_URI=
   
    PORT=5000


## Running the Application

1. Start MongoDB (if running locally):
   ```
   ```

   

2. Seed the database with sample data:
   ```
   cd backend
   node scripts/seed.js
   ```

3. Start the backend server:
   ```
   npm run dev or node server.js
   ```
   The backend will run on `http://localhost:5000` (or configured port).

4. Start the frontend development server:
   ```
   cd ../frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (or configured port).

## Manual Testing Guide

### Backend API Testing

Use Postman to test the APIs.

#### Authentication
- **Register**: POST `/api/auth/register`
  - Body: `{ "name": "Test User", "email": "test@example.com", "password": "password123" }`
- **Login**: POST `/api/auth/login`
  - Body: `{ "email": "test@example.com", "password": "password123" }`
- **Forgot Password**: POST `/api/auth/forgot-password`
  - Body: `{ "email": "test@example.com" }`

#### Events
- **Get All Events**: GET `/api/events`
- **Get Event by ID**: GET `/api/events/:id`
- **Create Event** (admin): POST `/api/events` (requires auth token)
- **Update Event** (admin): PUT `/api/events/:id`
- **Delete Event** (admin): DELETE `/api/events/:id`

#### Bookings
- **Create Booking**: POST `/api/bookings`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "eventId": "<event-id>", "tickets": 2 }`
- **Get User Bookings**: GET `/api/bookings`
  - Headers: `Authorization: Bearer <token>`

#### Analytics (Admin)
- **Get Analytics Data**: GET `/api/analytics`
  - Headers: `Authorization: Bearer <admin-token>`

### Frontend Manual Testing

1. **Home Page**: Visit the home page, check hero section, navigation.

2. **User Registration**:
   - Click "Register" or "Sign Up"
   - Fill in name, email, password
   - Submit and verify account creation

3. **User Login**:
   - Click "Login"
   - Enter credentials
   - Verify successful login and redirection

4. **Browse Events**:
   - Navigate to Events page
   - Check event cards display correctly
   - Use search/filter if available

5. **Event Details**:
   - Click on an event card
   - Verify details page shows event info, image, description
   - Check booking modal opens

6. **Book Tickets**:
   - From event details, open booking modal
   - Select number of tickets
   - Confirm booking
   - Verify booking appears in user dashboard

7. **User Dashboard**:
   - Login as user
   - Navigate to dashboard
   - Check personal bookings are listed
   - Verify booking details (event, tickets, date)

8. **Admin Dashboard**:
   - Login as admin (use seeded admin account or create one)
   - Check analytics charts (revenue, user growth)
   - Verify data accuracy

9. **Forgot Password**:
   - Click "Forgot Password"
   - Enter email
   - Check email is sent (verify in backend logs or email service)

10. **Responsive Design**:
    - Test on different screen sizes
    - Check mobile navigation, layouts

11. **Error Handling**:
    - Try invalid login
    - Attempt booking without login
    - Check validation messages

## Sample Data

After running `npm run seed`, the database will be populated with:
- Sample users (including admin)
- Sample events with images
- Sample bookings

Admin credentials (from seed):
- Email: admin@example.com
- Password: admin123



### Frontend
- React 19
- Vite
- Tailwind CSS
- Chart.js for analytics
- Lucide React for icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Nodemailer for emails
- PDFKit for ticket generation




