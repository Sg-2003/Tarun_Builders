# Tarun Builders — Government-Style MEAN Stack Website

A production-ready government/PSU-style portal built with Angular 19, Express, and MongoDB.

---

## Features
- **Official Government Branding**: Navy Blue & Gold color palette, Ashoka Chakra/tricolor bars.
- **Officer In Charge Profiles**: Owner (Tarun) photograph featured as Founder & MD.
- **Comprehensive Public Sections**: Projects, Tenders list, News updates, RTI Transparency documents, Careers, and Contact Form.
- **Protected Admin Panel**: Role-based access control (SuperAdmin/Admin/Engineer/ProjectManager) with analytics and full CRUD interfaces.
- **Database Auto-Seeding**: Seeds 4 departments, 3 landmark projects, and tenders on first connection.

---

## Technology Stack
- **Frontend**: Angular 19, SCSS, RxJS Signals
- **Backend**: Node.js, Express.js, JWT, Helmet, Rate Limiter
- **Database**: MongoDB Atlas

---

## Local Setup & Development

### 1. Install dependencies
From the root directory:
```bash
npm run install:all
```

### 2. Configure Environment variables
Create a `.env` file in the `server/` directory:
```env
PORT=5001
MONGO_URI=mongodb+srv://sukumar:sukumar123@cluster0.b4pieja.mongodb.net/tarun-builders
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
```

### 3. Run Development Server
Run the concurrently orchestrated server + client development loop:
```bash
npm run dev
```
- Client runs on: `http://localhost:4200`
- Server runs on: `http://localhost:5001`
- Admin credentials: `admin@tarunbuilders.in` / `Admin@123456`

---

## Docker Deployment (Production)

To build and run the entire application using containers:
```bash
docker-compose up --build
```
- The frontend will be served at port `80` with pre-configured Nginx reverse proxies routing `/api/*` traffic automatically to the backend on `5001`.
