# Hiring Platform Backend System

A robust and scalable backend system for a hiring platform, built with **Express.js** and **MongoDB**. This platform enables seamless interaction between job seekers and companies, featuring role-based access control, real-time notifications, and secure data handling.

---

## Features

- **User Roles**: Supports **Admin**, **Normal Users**, and **HR Representatives**.
- **Job Management**: HRs can post job listings, and users can apply by uploading resumes.
- **Role-Based Access Control (RBAC)**: Implements **JWT** for secure authentication and authorization.
- **Real-Time Notifications**: Integrated **Socket.IO** to notify HRs about job applications instantly.
- **Admin Panel**: Built a dynamic admin panel API using **GraphQL** for efficient data management.
- **Security**: Protected against vulnerabilities like **IDORs**, **Broken Access Control**, and data manipulation (using **Joi** for input validation).
- **File Uploads**: Used **Multer** for handling resume uploads, profile pictures, and cover photos.
- **Data Encryption**: Sensitive data (e.g., phone numbers) is encrypted, and passwords/OTPs are securely hashed.
- **Refresh Tokens**: Implemented refresh tokens for seamless user sessions.

---

## Technologies Used

- **Backend Framework**: Express.js
- **Database**: MongoDB (with Mongoose for ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Real-Time Communication**: Socket.IO
- **Admin Panel API**: GraphQL
- **File Uploads**: Multer
- **Input Validation**: Joi
- **Security**: Bcrypt (for hashing), Crypto-Js (for encryption)
- **Session Management**: Refresh Tokens

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/0xmond/hiring-platform-app.git
   cd hiring-platform-app
