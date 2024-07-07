# Component Repository Dashboard

## Overview
This project is an Admin Dashboard for managing a repository of UI components. It allows administrators to add, modify, and delete components. The dashboard is built using the MERN stack (MongoDB, Express, React, Node.js).

## Features
- **User Authentication:** Secure login for administrators.
- **Component Management:** Add, modify, and delete components.
- **Responsive Design:** A clean and responsive user interface.
- **Search Functionality:** Search for components by name, use, technologies, or tags.

## Technologies Used
- **Frontend:** React, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abhishekbhakari/Organizational-Component-Repository.git
   cd component-repository-dashboard
   ```

2. **Install dependencies for both frontend and backend:**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory with the following variables:
   ```env
   MONGO_URI=your_mongo_db_uri
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the application:**
   ```bash
   # Start backend server
   cd backend
   npm start

   # Start frontend server
   cd ../frontend
   npm start
   ```

### Folder Structure

```
component-repository-dashboard
│
├── backend
│   ├── controllers
│   │   └── componentController.js
│   ├── models
│   │   └── Component.js
│   ├── routes
│   │   └── componentRoutes.js
│   ├── server.js
│   └── .env
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   │   └── AdminDashboard.jsx
│   │   ├── services
│   │   │   ├── authService.js
│   │   │   └── componentService.js
│   │   ├── App.css
│   │   └── index.js
│   └── .env
│
└── README.md
```

## API Endpoints

### Authentication
- **POST** `/api/auth/login`: Authenticate user and return JWT.

### Components
- **GET** `/api/components`: Fetch all components.
- **GET** `/api/components?search=term`: Fetch components based on search term.
- **POST** `/api/components`: Add a new component.
- **PUT** `/api/components/:id`: Update an existing component.
- **DELETE** `/api/components/:id`: Delete a component.

## Usage

1. **Login:**
   - Navigate to the login page and authenticate using your credentials.

2. **Dashboard:**
   - After logging in, you will be redirected to the Admin Dashboard.
   - Here, you can view all components, add new components, modify existing ones, and delete components.
