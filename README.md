# 🗓️ Automated Timetable Generator (Schedulify)

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)](https://www.mongodb.com/mern-stack)
[![Prisma ORM](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS 4](https://img.shields.io/badge/CSS-Tailwind%204-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

An advanced, high-performance scheduling system built with the MERN stack (MySQL, Express, React, Node). This application automates the complex task of educational scheduling by solving multi-variable constraints, ensuring 100% resource utilization and a conflict-free experience.

---

## 🌟 Why Schedulify?

Manual timetable creation is a logistical nightmare involving hundreds of variables: teacher availability, room capacity, subject hours, and student groups. **Schedulify** eliminates human error and saves hundreds of administrative hours through:

- **Constraint-Based Automation**: Solve for "Impossible" schedules in seconds.
- **Relational Integrity**: Every session is backed by robust database constraints.
- **Modern Aesthetics**: A premium, "glassmorphic" UI designed for clarity and ease of use.

---

## 🚀 Intelligent Scheduling Engine

The core algorithm handles complex institutional logic to produce optimized schedules:

### 🧠 Core Constraints & Logic
- **Lab Optimization**: Automatically detects "Lab" type subjects and schedules them in **3-hour consecutive blocks**.
- **Conflict Management**: Real-time validation ensures:
    - No **Teacher** is in two places at once.
    - No **Room** is double-booked.
    - No **Class Group** has overlapping sessions.
- **Fair Distribution**: Sessions are intelligently spread across the week to prevent student fatigue.
- **Resource Recovery**: Automatically fills unscheduled slots with "Self-Study," "Library," or "Seminar" sessions to ensure a full 9-5 agenda.
- **Transactional Generation**: The scheduler uses database transactions. If any conflict is found during generation, the operation rolls back, keeping your existing data safe.

---

## 🍱 Project Architecture

### 🏗️ Data Model (Prisma Schema)

```mermaid
erDiagram
    USER ||--o| CLASS : belongs_to
    TEACHER ||--o{ TEACHER_SUBJECT : teaches
    SUBJECT ||--o{ TEACHER_SUBJECT : taught_by
    CLASS ||--o{ CLASS_SUBJECT : requires
    SUBJECT ||--o{ CLASS_SUBJECT : required_by
    TIMETABLE ||--|| CLASS : for
    TIMETABLE ||--|| SUBJECT : involves
    TIMETABLE ||--|| TEACHER : assigned_to
    TIMETABLE ||--|| ROOM : located_in
    TIMETABLE ||--|| TIMESLOT : scheduled_at
```

### 📂 Directory Structure
```text
.
├── 📁 backend/                # Express.js Server
│   ├── 📁 controllers/        # Logical Handlers (Auth, Scheduler, CRUD)
│   ├── 📁 middleware/         # RBAC Guards & JWT Validation
│   ├── 📁 prisma/             # Schema & Migrations (MySQL)
│   ├── 📁 routes/             # RESTful Endpoints
│   ├── 📁 services/           # Helper Services
│   └── index.js               # App Entry Point
├── 📁 frontend/               # React (Vite) Client
│   ├── 📁 src/
│   │   ├── 📁 components/     # UI Library & Layouts
│   │   ├── 📁 context/        # Global State (Auth)
│   │   ├── 📁 pages/          # Full-page Views
│   │   └── api.js             # Axios Configuration
└── README.md
```

---

## 🛠️ Technical Stack

| Component | Technology | Version | Description |
| :--- | :--- | :--- | :--- |
| **Frontend** | React | 19.0 | Modern UI rendering with Hooks & Context |
| **Build Tool** | Vite | 8.0 | Lightning-fast development server |
| **Styling** | Tailwind CSS | 4.0 | Utility-first styling with modern variables |
| **Icons** | Lucide React | 0.577 | Lightweight, scalable vector icons |
| **Backend** | Node.js / Express | 4.21 | Robust REST API architecture |
| **ORM** | Prisma | 6.19 | Type-safe database client & migrations |
| **Database** | MySQL/MariaDB | ^3.5.2 | Relational storage for high-integrity data |
| **Auth** | JWT / Bcrypt | ^9.0 / ^3.0 | Secure session management & hashing |
| **PDF Export** | jsPDF / AutoTable | 4.2 / 5.0 | Client-side schedule document generation |

---

## 🔐 Security & Role-Based Access (RBAC)

- **ADMIN**: Complete control over Registry (Teachers, Rooms, Subjects, Classes) and one-click Timetable Generation.
- **TEACHER**: Personalized schedule view highlighting their specific sessions and assigned rooms.
- **STUDENT**: Read-only access to their specific class group's timetable.
- **Whitelisting**: Admin registration is restricted to specific emails defined in `.env`.
- **Identity Protection**: Middleware ensures users cannot view or edit data belonging to other classes or teachers.

---

## 📦 Installation & Configuration

### Prerequisites
- Node.js (v18+)
- MySQL or MariaDB instance

### 1. Clone & Install
```bash
git clone https://github.com/Adbhutha10/Automated-Timetable-Generator.git
cd Automated-Timetable-Generator
```

### 2. Backend Setup
1. Define your environment variables in `backend/.env`:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/timetable_db"
   JWT_SECRET="your_ultra_secure_secret"
   ADMIN_EMAILS="admin@institution.edu,principal@institution.edu"
   PORT=5000
   ```
2. Setup Database:
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma db push
   # Optional: Seed initial data
   node seed.js
   npm run dev
   ```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🔌 API Documentation

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Public | Create a new account |
| `POST` | `/api/auth/login` | Public | Authenticate and receive JWT |
| `GET` | `/api/teachers` | Auth | List all faculty members |
| `POST`| `/api/generate-timetable` | Admin | Trigger the scheduling algorithm |
| `GET` | `/api/timetable/class/:id` | Auth | Get timetable for a specific class |
| `GET` | `/api/timetable/teacher/:id`| Auth | Get schedule for a specific teacher |
| `PUT` | `/api/users/:id` | Admin | Manage user permissions & roles |

---

## 📖 Usage Workflow

1. **Setup Registry**: Admin logs in and adds Teachers, Subjects, Rooms, and Class Groups.
2. **Assign Subjects**: Link Teachers to Subjects and Subjects to specific Classes.
3. **Generate**: Navigate to the **Admin Dashboard** and click **"Generate New Registry"**.
4. **Export**: Any user can click **"Export PDF"** to get a professional, high-fidelity copy of their schedule.

---

## 🛣️ Future Roadmap

- [ ] **Drag & Drop Re-scheduling**: Manual fine-tuning of generated schedules.
- [ ] **AI-Powered Optimization**: Genetic algorithms for even better session distribution.
- [ ] **Calendar Integration**: Sync schedules with Google/Outlook calendars.
- [ ] **Mobile App**: Dedicated Flutter or React Native mobile client.

---

*Built with ❤️ for Educational Excellence by Adbhutha.*
