# 🗓️ Automated Timetable Generator (MERN Stack)

A professional, high-performance web application designed to automate the complex process of educational scheduling. Built with a focus on **relational integrity**, **intelligent constraints**, and a **premium user experience**.

---

## 🚀 Key Features

### 🧠 Intelligent Scheduling Engine
The core algorithm solves for 100% timetable utilization while adhering to strict institutional rules:
- **Lab & Project Optimization**: Automatically schedules 3-hour consecutive blocks for Labs and Minor Projects.
- **Conflict Resolution**: Zero-conflict guarantee across Teachers, Rooms, and Class Groups.
- **Randomized Distribution**: Labs are intelligently randomized across the week (Monday-Friday) to prevent morning/afternoon clustering.
- **100% Resource Filling**: Automatically fills gaps with "Self-Study," "Library," or "Sports/Seminar" sessions if the primary curriculum is satisfied.
- **Saturday Logic**: Custom handling for Saturday sessions (Minor Project/Internship) to ensure weekend compliance.

### 🍱 Multi-Role Dashboards
Full **Role-Based Access Control (RBAC)** with specialized views:
- **Admin Dashboard**: Global statistics, registry management (Staff, Rooms, Subjects), and one-click timetable generation.
- **Teacher Dashboard**: Personalized weekly agenda with a professional horizontal layout.
- **Student Dashboard**: Class-specific view with real-time updates and simple class selection.

### 💎 Premium UI/UX
Designed for a high-end software feel:
- **Horizontal Timetable Layout**: Modern "Days-as-Rows" grid for maximum readability.
- **Glassmorphism Design**: Sleek, translucent cards with subtle blurs and interactive hover states.
- **Professional PDF Export**: Integrated `jsPDF` for high-fidelity, printable schedule downloads.
- **Micro-animations**: Smooth transitions and loading states for a responsive experience.

---

## 📂 Project Architecture & Structure

The repository is organized into a clean **Decoupled Architecture**, separating the API concern (Backend) from the User Interface (Frontend).

```text
WT project/
├── 📁 backend/
│   ├── 📁 controllers/      # Business logic (Scheduler, Auth, Generic CRUD)
│   ├── 📁 middleware/       # JWT Auth & Admin authorization rules
│   ├── 📁 prisma/           # Database Schema (MySQL) & Migrations
│   ├── 📁 routes/           # RESTful API Endpoint definitions
│   └── index.js          # Entry point & Express server config
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── api.js        # Central Axios instance with Auth interceptors
│   │   ├── 📁 context/      # Global State Management (AuthContext)
│   │   ├── 📁 pages/        # Dashboard Views (Admin, Teacher, Student)
│   │   ├── 📁 components/   # Reusable UI elements & Route Guards
│   │   └── App.jsx       # Routing Layer & Navigation logic
└── README.md             # Project documentation (You are here)
```

---

## 🛠️ Technical Stack

### **Backend**
- **Node.js & Express**: High-performance REST API.
- **Prisma ORM**: Modern database access with Type-safety and Migrations.
- **MySQL/MariaDB**: Robust relational database for keeping all schedules synchronized.
- **JWT & Bcrypt**: Secure authentication and password hashing.

### **Frontend**
- **React 19 (Vite)**: Lightning-fast development and build cycles.
- **Tailwind CSS 4**: Next-gen styling with a curated color system and variables.
- **Lucide Icons**: Crisp, professional iconography for a modern look.
- **jsPDF + AutoTable**: Advanced client-side document generation.

---

## 🛡️ Security & Integration
- **Auto-Role Assignment**: Faculty members are automatically recognized and assigned the `TEACHER` role during signup based on the institutional registry.
- **Global Middleware**: Centralized protection for all sensitive API routes.
- **Data Integrity**: Foreign key constraints ensure that no session can be scheduled for a deleted room or teacher.

---

## 📦 Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Adbhutha10/Automated-Timetable-Generator.git
   cd Automated-Timetable-Generator
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file with DATABASE_URL and JWT_SECRET
   npx prisma generate
   npx prisma db push
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 📝 Usage Guide
1. **Admin**: Head to `/admin`, manage your staff and subjects. Ensure all teachers are "mapped" to their subjects.
2. **Generate**: Click **"Generate New Registry"** to create a fresh, optimized schedule.
3. **Faculty**: Sign up with your professional email to automatically see your assigned timetable.
4. **Export**: Use the **"Export PDF"** button on any dashboard to download your schedule instantly.

---

*Built with ❤️ for Educational Excellence.*
