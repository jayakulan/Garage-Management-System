# Garage Management System (GMS)

A comprehensive web-based application for managing garage operations, including job cards, inventory, and billing.

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Django Rest Framework
- **Database:** MySQL

## Prerequisites
- Python (3.12+)
- Node.js (v18+)
- MySQL Server

---

## 🚀 Getting Started

### 1. Database Setup
Ensure your MySQL server is running and create a database named `gms_db`.

```bash
# Log into MySQL
mysql -u root -p

# Create Database
CREATE DATABASE gms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend Setup (Django)

Navigate to the backend directory:
```bash
cd GMS-Backend
```

Create and activate virtual environment:
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

**Configuration (.env):**
Ensure you have a `.env` file in `GMS-Backend` with your database credentials:
```env
DEBUG=True
SECRET_KEY=your_secret_key
DB_NAME=gms_db
DB_USER=root
DB_PASSWORD=your_password  # Update this!
DB_HOST=localhost
DB_PORT=3306
```

Run migrations and start server:
```bash
python manage.py migrate
python manage.py runserver
```
*The backend runs on http://127.0.0.1:8000*

### 3. Frontend Setup (React)

Open a new terminal and navigate to the frontend directory:
```bash
cd GMS-Frontend
```

Install dependencies:
```bash
npm install
```

Start development server:
```bash
npm run dev
```
*The frontend runs on http://localhost:5173*

---

## 🔑 Default Credentials

The project comes seeded with distinct users for each role:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@gmail.com` | `admin` |
| **Mechanic** | `mechanic@gmail.com` | `mechanic` |
| **Customer** | `customer@gmail.com` | `customer` |

## ✨ Features
- **Role-Based Access Control** (Admin, Mechanic, Customer)
- **Job Card Management**
- **Inventory & Parts Tracking**
- **Invoicing & Billing system**
- **Responsive Dashboard UI**