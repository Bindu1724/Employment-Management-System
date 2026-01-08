# Employment Management System (EMS)

A simple full-stack Employment Management System (EMS) built with Node.js/Express and React. The project provides user authentication, role-based authorization, and CRUD operations for departments and employees. It aims to be a small but practical example of an internal admin dashboard.

---

## Features

- User registration and login (JWT)
- Role-based access control (admin, manager, employee)
- CRUD operations for Departments and Employees
- Pagination and search for employees
- Simple React dashboard using React Router and Zustand for state

---

## Tech Stack

- Backend: Node.js, Express, MongoDB (Mongoose)
- Auth: JSON Web Tokens (JWT)
- Validation: Joi
- Frontend: React, React Router, Axios, Bootstrap

---

## Requirements

- Node.js >= 18.x
- npm >= 9.x
- MongoDB (Atlas or local)

---

## Getting Started

Clone the repo:

```bash
git clone <repo-url>
cd Employment-Management-System
```

### Server setup

```powershell
cd server
npm install
# create a .env file (see below)
```

### Client setup

```powershell
cd ../client
npm install
```

---

## Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```text
MONGO_URI=mongodb+srv://...   # your MongoDB connection string
PORT=5000                      # default server port
JWT_SECRET=your_jwt_secret     # used to sign auth tokens
JWT_EXPIRES=1d                 # optional, defaults to '1d'
```

> Tip: For local development you can use MongoDB Atlas or a local MongoDB instance.

---

## Running the App

Open two terminals (or use an integrated terminal with multiple tabs):

- Start the server:

```powershell
cd server
npm run dev
```

- Start the client:

```powershell
cd client
npm start
```

The React app runs on `http://localhost:3000` and the API on `http://localhost:5000` (or whatever `PORT` you set).

---

## API Reference

Base URL: `http://localhost:{PORT}/api`

Auth endpoints:

- POST `/api/auth/register` — Register a new user
  - body: `{ name, email, password, role }` (role can be `admin`, `manager`, or `employee`)
  - response: `{ token, user }
- POST `/api/auth/login` — Login
  - body: `{ email, password }`
  - response: `{ token, user }`

Protected routes require an `Authorization` header:

```
Authorization: Bearer <token>
```

User routes (admin only):

- GET `/api/users` — list users
- PUT `/api/users/:id/role` — update user role
- PATCH `/api/users/:id/toggle` — enable/disable user

Departments (auth; create/update/delete require `admin`):

- GET `/api/departments`
- POST `/api/departments`
- PUT `/api/departments/:id`
- DELETE `/api/departments/:id`

Employees (auth; `admin` & `manager` can create/edit, `admin` can delete):

- GET `/api/employees` — supports `q`, `status`, `department`, `page`, `limit`
- POST `/api/employees`
- GET `/api/employees/:id`
- PUT `/api/employees/:id`
- DELETE `/api/employees/:id`

---

## Project Structure

```
root
├── client/        # React front-end
├── server/        # Express back-end
│   ├── src
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   └── routes
└── README.md
```

---


