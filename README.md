

## Project Overview
The **Portfolio Backend Server** is a secure and modular backend system for a personal portfolio website.  
It allows the portfolio owner to manage blogs, projects, and personal information through a private dashboard while making all public content accessible to visitors.  
Built with **Express.js**, **TypeScript**, and **Prisma (PostgreSQL)**, this API provides fast, scalable, and secure endpoints for portfolio content management.

---

## Key Features

### Authentication & Authorization
- JWT-based authentication system.
- Single admin (portfolio owner) seeded during setup.
- Secure password hashing using **bcrypt**.
- Role-based route protection via middleware.
- Admin-only access to dashboard routes.

### Blog Management
- Create, read, update, and delete blogs.
- Publicly accessible blogs and individual blog details.

- ISR-compatible API endpoints for frontend caching.

### Project Management
- CRUD operations for portfolio projects.
- Public API to display all projects.
- Includes project title, description, thumbnail, live link, and features.

### About Me Section
- Serve static personal information such as name, title, bio, and contact.
- Admin can update About info via dashboard.

### Error Handling & Validation
- Centralized error handling middleware.
- Schema validation using **Zod**.
- Clear and user-friendly error messages.
- Handles unauthorized or invalid requests gracefully.

---

## Tech Stack

### Core
- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Language:** TypeScript  
- **Database:** PostgreSQL + Prisma ORM  

### Security
- **JWT** for authentication  
- **bcryptjs** for password hashing  
- **Zod** for input validation  

### Utilities
- **dotenv** for environment configuration  
- **cors** for handling cross-origin requests  
- 
- **sweetalert2** (Frontend integration for notifications)  

---

## API Endpoints

### Authentication
| Endpoint | Method | Description | Access |
|-----------|---------|-------------|---------|
| `/api/auth/login` | POST | Admin login (returns JWT) | Public |


---

### Blog Operations
| Endpoint | Method | Description | Access |
|-----------|---------|-------------|---------|
| `/api/blogs` | GET | Get all blogs | Public |
| `/api/blogs/:id` | GET | Get single blog details | Public |
| `/api/blogs/:slug` | GET | Get single blog details | Public |
| `/api/blogs` | POST | Create new blog | Admin |
| `/api/blogs/:id` | PUT | Update blog | Admin |
| `/api/blogs/:id` | DELETE | Delete blog | Admin |

---

### Project Operations
| Endpoint | Method | Description | Access |
|-----------|---------|-------------|---------|
| `/api/projects` | GET | Get all projects | Public |
| `/api/projects` | POST | Add new project | Admin |
| `/api/projects/:id` | PUT | Update project | Admin |
| `/api/projects/:id` | DELETE | Delete project | Admin |
| `/api/projects/:id/featured` | PATCH | Toggle Featured project | Admin |

---

### About Me Section
| Endpoint | Method | Description | Access |
|-----------|---------|-------------|---------|
| `/api/about` | GET | Get about info | Public |
| `/api/about` | PATCH | Update about info | Admin |

---
## Live Link

- **Backend Live Link:** [Backend Live](https://builder-portfolio-eta.vercel.app)

## Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL
- npm or yarn

---

### Installation

```bash
git clone https://github.com/mdmasharafilhossain/Portfolio-Builder-Server.git
cd Portfolio-Builder-Server
npm install
```
### Environment Configuration
Create a .env file in the root directory with the following variables:
```bash
PORT=5000
DATABASE_URL="Your_Database_url"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN=time
bcrypt_salt_rounds=number
NODE_ENV= development | production

```
### Prisma Setup

```bash
npx prisma migrate dev --name init
npx prisma db seed
```
### Run the Project

```bash
npm run dev
```

