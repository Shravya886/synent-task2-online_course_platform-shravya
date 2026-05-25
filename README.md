# Online Course Platform 🎓

A full-stack Online Course Platform built using the MERN stack where users can browse courses, enroll using Razorpay payments, 
and access learning content. Admins can manage courses, modules, lessons, users, 
and enrollments through a dedicated admin dashboard.

---

# 🚀 Features

## 🔐 Authentication System

* User Registration & Login
* JWT-based Authentication
* Protected Routes
* Forgot Password Functionality
* Email Notifications using Nodemailer

## 👨‍🎓 User Features

* View all available courses
* Search and filter courses
* View course details
* Enroll in courses
* Razorpay payment integration
* Access enrolled courses
* Watch lessons/videos
* Track lesson completion
* Progress tracking system

## 👨‍💼 Admin Features

* Admin Dashboard
* Add/Edit/Delete Courses
* Add Modules and Lessons
* Manage course content
* View users
* View enrollments

## 💳 Payment System

* Razorpay Test Mode Integration
* Secure payment verification
* Automatic enrollment after successful payment
* Enrollment confirmation email

---

# 🛠️ Tech Stack

## Frontend

* React.js
* React Router DOM
* Axios
* CSS

## Backend

* Node.js
* Express.js
* JWT Authentication
* Nodemailer
* Razorpay API

## Database

* MongoDB
* Mongoose

---

# 📂 Project Structure

```bash
Online-Course-Platform/
│
├── client/                # React Frontend
│   ├── src/
│   └── public/
│
├── server/                # Node.js Backend
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone <your-github-repo-link>
cd Online-Course-Platform
```

---

## 2️⃣ Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 3️⃣ Install Backend Dependencies

```bash
cd ../server
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

---

# ▶️ Run Project

## Start Backend

```bash
cd server
npm start
```

## Start Frontend

```bash
cd client
npm start
```

---

# 💳 Razorpay Test Card

Use Razorpay test mode card details:

```text
Card Number: 4111 1111 1111 1111
Expiry: Any future date
CVV: Any 3 digits
OTP: 1234
```

---

# 📌 Future Improvements

* Course certificates
* Live classes
* Instructor dashboard
* Dark mode
* Quiz system
* Deployment on cloud

---

# 👩‍💻 Author

Developed by Shravya.

---

# ⭐ Conclusion

This project demonstrates full-stack web development concepts including authentication, payments,
REST APIs, MongoDB integration, protected routes, admin management, and course enrollment workflows using the MERN stack.
