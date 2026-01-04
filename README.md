# Sampark 🏛️

> **Hack4 Delhi Hackathon Project** 🚀

**AI-Powered Civic Complaint Management System for Municipal Corporation of Delhi**

Sampark ("connection" in Hindi) is a full-stack application that bridges the gap between citizens and the Municipal Corporation of Delhi. It enables citizens to log complaints via voice/text and provides MCD officials with a real-time dashboard for tracking and resolution.

## 🏗️ Architecture

```
sampark/
├── backend/          # FastAPI + Supabase
│   ├── app/
│   │   └── main.py   # API endpoints
│   └── requirements.txt
├── frontend/         # Next.js 15 + Tailwind CSS
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   └── package.json
└── README.md
```

## 🚀 Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | Next.js 15, React 19, Tailwind CSS  |
| Backend  | FastAPI, Python 3.11+               |
| Database | Supabase (PostgreSQL)               |
| AI       | Voice Agent Integration (planned)   |

## 📋 Prerequisites

- **Node.js** >= 18.x
- **Python** >= 3.11
- **Supabase** account with project credentials

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/sampark.git
cd sampark
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run the server
uvicorn app.main:app --reload
```

Backend will be available at: `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## 🔧 Environment Variables

### Backend (`backend/.env`)

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

## 📡 API Endpoints

| Method | Endpoint              | Description                    |
| ------ | --------------------- | ------------------------------ |
| GET    | `/`                   | Health check                   |
| POST   | `/api/log-complaint`  | Log a new complaint            |
| GET    | `/api/dashboard-stats`| Get dashboard statistics       |

### Request Example: Log Complaint

```bash
curl -X POST http://localhost:8000/api/log-complaint \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Dwarka Sector 10",
    "issue": "Garbage not collected for 3 days",
    "urgency": "high"
  }'
```

## 🗄️ Database Schema

### Complaints Table

| Column   | Type      | Description           |
| -------- | --------- | --------------------- |
| id       | UUID      | Primary key           |
| location | TEXT      | Complaint location    |
| issue    | TEXT      | Issue description     |
| urgency  | TEXT      | Priority level        |
| status   | TEXT      | Open/Resolved/Pending |
| created_at | TIMESTAMP | Creation timestamp  |

## 🛠️ Development

### Run Both Services

**Terminal 1 - Backend:**
```bash
cd backend && source venv/bin/activate && uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend && npm run dev
```

### API Documentation

Once backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 📦 Project Structure

```
backend/
├── app/
│   └── main.py          # FastAPI application & routes
├── .env.example         # Environment template
└── requirements.txt     # Python dependencies

frontend/
├── app/
│   ├── page.tsx         # Home page
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
├── public/              # Static assets
└── package.json         # Node dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Built with ❤️ for improving civic services in Delhi.

**Developed for Hack4 Delhi Hackathon 2026**

---

**Sampark** - Connecting citizens with civic services, faster and smarter.
