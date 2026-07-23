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

## Project Directory Structure

```text
Tarun-Builders/
├── client/                     # Frontend Angular Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Core Module (Singleton services, guards, interceptors)
│   │   │   │   ├── guards/     # Authentication & Authorization Guards
│   │   │   │   ├── interceptors/# HTTP Interceptors (JWT attaching)
│   │   │   │   └── services/   # API/Data Services
│   │   │   ├── layouts/        # Layout Components
│   │   │   │   ├── admin-layout/
│   │   │   │   └── public-layout/
│   │   │   ├── pages/          # Feature Pages
│   │   │   │   ├── admin/      # Admin Panel Subpages (Dashboard, Tenders, Careers, etc.)
│   │   │   │   ├── auth/       # Authentication (Login)
│   │   │   │   ├── public/     # Public Facing Pages (Home, About, Tenders, Careers, RTI)
│   │   │   │   └── not-found/
│   │   │   └── shared/         # Shared Components (Header, Footer, Navigation)
│   │   ├── assets/             # Static Assets (Images, Logos)
│   │   └── styles.scss         # Global SCSS Styling & Theme Rules
│   ├── Dockerfile              # Docker Configuration for Frontend
│   └── nginx.conf              # Nginx Configuration for serving Frontend
├── server/                     # Backend Express Application
│   ├── config/                 # Configurations (Database connection, Database Seeder)
│   ├── controllers/            # Request Handlers & Business Logic
│   ├── middleware/             # Express Middlewares (Auth check, file upload)
│   ├── models/                 # Mongoose Database Models
│   ├── routes/                 # Express REST API Endpoints
│   ├── server.js               # Application Entry Point
│   └── Dockerfile              # Docker Configuration for Backend
├── docker-compose.yml          # Docker Compose configuration orchestrating Client & Server
└── nginx.conf                  # Main Nginx reverse proxy configuration
```

---

## Architecture & Data Flow

Below is the structural diagram representing the architecture and request lifecycle of the Tarun Builders MEAN stack application:

```mermaid
graph TD
    %% User Access
    User([User Browser]) -->|HTTP Request| NginxProxy[Nginx Reverse Proxy: Port 80]
    
    %% Nginx Routing
    NginxProxy -->|Static Assets & HTML| AngularApp[Angular 19 Frontend Client]
    NginxProxy -->|/api/* Requests| ExpressAPI[Express Server Backend: Port 5001]
    
    %% Frontend Internal Structure
    subgraph Frontend [Angular 19 Client Client App]
        AngularApp --> AppRoutes[Router: app.routes.ts]
        AppRoutes --> AuthGuard[Auth Guard]
        AppRoutes --> Layouts[Layouts: Public / Admin]
        Layouts --> Pages[Pages & Components]
        Pages --> Services[Services: core/services]
        Services --> AuthInterceptor[Auth Interceptor: Attaches JWT]
    end
    
    %% API requests flow
    AuthInterceptor -->|HTTP Requests| ExpressAPI
    
    %% Backend Internal Structure
    subgraph Backend [Express REST API Backend]
        ExpressAPI --> ExpressRouter[Express Router: routes/*]
        ExpressRouter --> Middlewares[Middlewares: Auth / Upload]
        Middlewares --> Controllers[Controllers: Request Handlers]
        Controllers --> Models[Mongoose Models: models/*]
    end
    
    %% Database Connection
    Models -->|Mongoose Queries| MongoDB[(MongoDB Atlas Database)]
```

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
