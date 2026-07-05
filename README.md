# Dr. Waseem Iqbal Research Portfolio

A high-performance, fully dynamic academic research portfolio built for Dr. Waseem Iqbal. The platform features a premium, modern public-facing UI with glassmorphic elements and a secure Admin Dashboard that allows the owner to instantly update content without touching a single line of code.

## 🚀 Project Architecture & Flow

This project utilizes a modern **MERN Stack** (MongoDB, Express.js, React.js, Node.js) separated into two distinct layers to maximize performance, scalability, and security.

### 1. Frontend (Public UI & Admin Dashboard)
- **Tech Stack**: React.js (Vite), Tailwind CSS, Lucide React (Icons), Animate.css
- **Location**: `/forntend` directory.
- **Hosting**: Deployed on **Vercel** for ultra-fast global edge delivery.
- **Flow**: 
  - The frontend operates as a Single Page Application (SPA) using `react-router-dom`.
  - Upon loading, public components (Hero, About, Experience, etc.) make asynchronous `GET` requests to the backend API using Axios.
  - The Admin Dashboard (`/admin`) is protected by JWT authentication. Once logged in, the admin can perform CRUD (Create, Read, Update, Delete) operations. These API calls update the database and the UI immediately reflects the changes.
  - To ensure a "blazing fast" feel, loading spinners have been globally removed. The UI renders clean and transparent until the instant the data arrives.

### 2. Backend (API & Database)
- **Tech Stack**: Node.js, Express.js, Mongoose (MongoDB), JSON Web Tokens (JWT), bcryptjs
- **Location**: `/backend` directory.
- **Hosting**: Deployed on **Render** as a web service.
- **Flow**:
  - The Express server provides RESTful API endpoints for every section of the portfolio (Profile, About, Experience, Research, Qualifications, Events, Contact).
  - **Security**: Admin endpoints (`POST`, `PUT`, `DELETE`) are secured via an auth middleware that verifies the JWT provided by the frontend.
  - **Database**: MongoDB acts as the single source of truth. When the admin updates a field, the Express server updates the exact MongoDB document and returns the fresh data to the frontend.

---

## 📂 Directory Structure

```text
waseemiqbalresearchhub/
│
├── backend/                  # Node.js + Express API Server
│   ├── middleware/           # JWT auth verification
│   ├── models/               # MongoDB Schemas (Profile, Experience, etc.)
│   ├── routes/               # API endpoint definitions (auth, data, upload)
│   ├── server.js             # Express application entry point
│   └── package.json          # Backend dependencies
│
├── forntend/                 # React.js + Vite Application
│   ├── src/
│   │   ├── components/       # Public-facing UI components (Hero, About, Navbar)
│   │   ├── pages/            # Full page views & Admin Dashboard Forms
│   │   ├── services/         # Axios API service handlers (api.js)
│   │   ├── App.jsx           # Main React Router setup
│   │   ├── index.css         # Tailwind global styles
│   │   └── main.jsx          # React DOM entry point
│   └── package.json          # Frontend dependencies
│
└── README.md                 # Project documentation
```

## ⚙️ Environment Variables

To run this project locally or deploy it, the following Environment Variables are required:

### Backend (`backend/.env`)
- `PORT` - The port the server runs on (e.g., `5000`)
- `MONGO_URI` - Your MongoDB Atlas connection string.
- `JWT_SECRET` - A strong, secure string used to sign admin login tokens.

### Frontend (`forntend/.env`)
- `VITE_API_URL` - The full URL to the backend server (e.g., `https://your-render-app.onrender.com/api`).

## ✨ Key Features
- **Zero-Code Updates**: Admin panel allows adding, editing, and deleting experiences, qualifications, research impact, and events dynamically.
- **Optimized UI**: No clunky loading spinners. The UI uses optimistic updates and transparent fallbacks to feel instant.
- **Mobile Responsive**: Both the public site and the Admin Control Panel feature sliding mobile menus and responsive grids tailored for tablets and phones.
- **Secure**: Authentication uses hashed passwords, and the admin panel cannot be accessed or manipulated without a valid, signed JWT token.
