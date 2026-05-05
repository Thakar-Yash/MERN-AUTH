# MERN Authentication System with User Profile

A full-stack authentication and user management application built with the **MERN Stack** using **TypeScript**.
This project demonstrates secure authentication, profile management, OTP verification, and image upload functionality.

---

## 🚀 Features

* User Registration / Sign Up
* User Login / Logout
* JWT Authentication with HTTP-Only Cookies
* Protected Routes
* Email Verification using OTP
* Forgot Password / Reset Password with OTP
* User Profile Creation & Management
* Profile Image Upload using Multer
* Secure Password Hashing with bcrypt
* MongoDB Database Integration
* Responsive Frontend UI

---

## 🛠 Tech Stack

### Frontend

* React.js
* TypeScript
* React Router DOM
* Axios
* CSS

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB + Mongoose
* JWT Authentication
* Multer
* Nodemailer
* bcrypt

---

## 📂 Project Structure

```bash
client/
│── src/
│   ├── pages/
│   ├── components/
│   ├── services/
│   └── api/

server/
│── controllers/
│── routes/
│── models/
│── middlewares/
│── uploads/
│── config/
```

---

## 🔐 Authentication Flow

1. User signs up with email and password
2. OTP sent to registered email for verification
3. User verifies email using OTP
4. JWT token stored in HTTP-only cookie after login
5. Protected routes accessible only for authenticated users

---

## 👤 User Profile Module

* Authenticated users can create their profile
* Profile automatically linked with logged-in user
* Name and Email fetched from authenticated account
* Profile image upload support with Multer
* Update profile image anytime

---

## 🔄 Forgot Password Flow

1. User requests password reset
2. OTP sent to registered email
3. User verifies OTP
4. Password reset successfully

---

## 📸 Screens / Modules Included

* Sign Up Page
* Login Page
* Email Verification Page
* Forgot Password Page
* Reset Password Page
* Home Dashboard
* User Profile Page

---

## 🎯 Learning Highlights

This project demonstrates understanding of:

* Full MERN Stack Development
* TypeScript in Frontend & Backend
* Authentication & Authorization
* REST API Design
* File Upload Handling
* Email/OTP Systems
* Secure Backend Practices
* State Management & Protected Routing

---

## ⚙️ Environment Variables

Create `.env` file in server:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
SMTP_EMAIL=your_email
SMTP_PASSWORD=your_password
```

---

## ▶️ Run Locally

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## 📌 Future Improvements

* Role Based Authentication (Admin/User)
* Social Login (Google/GitHub)
* Cloudinary Integration for Image Upload
* Profile Edit for Name/Email
* Better UI/UX Enhancements

---

## 👨‍💻 Author

**Yash Thakar**

---

## ⭐ If you like this project

Give it a star on GitHub!
