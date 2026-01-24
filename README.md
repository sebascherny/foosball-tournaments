# Foosball Tournaments Management System

A comprehensive web application for managing foosball tournaments with Django backend, FastAPI integration, TypeScript React frontend, PostgreSQL database, and Docker containerization.

## 🏆 Features

- **Single Page Application** with sticky navigation
- **6 Main Sections:**
  - **INICIO**: Full-page hero image
  - **REGLAMENTO**: Tournament rules and regulations
  - **FUNCIONAMIENTO**: How the tournament works
  - **PARTICIPANTES**: Participant management with 3-column layout
  - **CLASIFICACIÓN**: Real-time classification table
  - **GALERÍA**: Image gallery with navigation arrows

## 🛠 Tech Stack

### Backend
- **Django 4.2** - Main web framework
- **FastAPI** - Additional API endpoints
- **Django REST Framework** - API development
- **PostgreSQL** - Database
- **pytest** - Testing framework

### Frontend
- **React 18** with **TypeScript**
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client
- **Framer Motion** - Animations

### DevOps
- **Docker & Docker Compose** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **PostgreSQL 15** - Database

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd foosball-tournaments
   ```

2. **Start the application**
   ```bash
   # Start all services in detached mode
   docker-compose up -d --build
   
   # Or start with logs visible
   docker-compose up --build
   ```

3. **Run initial setup (first time only)**
   ```bash
   # Run database migrations
   docker-compose exec backend python manage.py migrate
   
   # Create superuser for admin access
   docker-compose exec backend python manage.py createsuperuser
   
   # Load initial data (optional)
   docker-compose exec backend python manage.py loaddata initial_data.json
   ```

4. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:8000
   - Django Admin: http://localhost:8000/admin
   - Admin Panel: http://localhost:3001/admin-panel

#### Using SQLite Database (Alternative)

For simpler setup or development without PostgreSQL:

1. **Using environment variable**
   ```bash
   # Set environment variable and start
   USE_SQLITE=true docker-compose up --build
   ```

2. **Using dedicated SQLite compose file**
   ```bash
   # Use the SQLite-specific docker-compose file
   docker-compose -f docker-compose.sqlite.yml up --build
   ```

3. **Local development with SQLite**
   ```bash
   # Set environment variable in your shell
   export USE_SQLITE=true
   
   # Or create a .env file in backend directory
   echo "USE_SQLITE=true" > backend/.env
   
   # Run migrations and start
   cd backend
   python manage.py migrate
   python manage.py runserver
   ```

#### Docker Management Commands

**Running Django Management Commands:**
```bash
# General format
docker-compose exec backend python manage.py <command>

# Common commands
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py createsuperuser
docker-compose exec backend python manage.py collectstatic
docker-compose exec backend python manage.py shell
docker-compose exec backend python manage.py loaddata <fixture>
docker-compose exec backend python manage.py dumpdata <app> > <filename>
```

**Container Management:**
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart specific service
docker-compose restart backend
docker-compose restart frontend

# View logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs -f  # Follow logs

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh
```

**Database Management:**
```bash
# Access PostgreSQL directly
docker-compose exec db psql -U postgres -d foosball_tournaments

# Backup database
docker-compose exec db pg_dump -U postgres foosball_tournaments > backup.sql

# Restore database
docker-compose exec -T db psql -U postgres foosball_tournaments < backup.sql
```

**Development Workflow:**
```bash
# Rebuild after code changes
docker-compose up --build

# Reset database (WARNING: destroys all data)
docker-compose down -v
docker-compose up --build
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

#### Docker Troubleshooting

**Common Issues and Solutions:**

1. **Port conflicts**
   ```bash
   # If ports 3000 or 8000 are in use
   docker-compose down
   # Kill processes using the ports
   lsof -ti:3000 | xargs kill -9
   lsof -ti:8000 | xargs kill -9
   docker-compose up -d
   ```

2. **Database connection issues**
   ```bash
   # Check database status
   docker-compose ps
   docker-compose logs db
   
   # Restart database
   docker-compose restart db
   ```

3. **Frontend not updating**
   ```bash
   # Clear React cache and rebuild
   docker-compose exec frontend npm start
   # Or rebuild the container
   docker-compose up --build frontend
   ```

4. **Permission issues**
   ```bash
   # Fix file permissions (Linux/Mac)
   sudo chown -R $USER:$USER .
   ```

5. **Clean slate restart**
   ```bash
   # Remove all containers, volumes, and images
   docker-compose down -v --rmi all
   docker system prune -a
   docker-compose up --build
   ```

### Local Development Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start Django server**
   ```bash
   python manage.py runserver
   ```

8. **Start FastAPI server (optional)**
   ```bash
   python fastapi_app.py
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📁 Project Structure

```
foosball-tournaments/
├── backend/
│   ├── foosball_project/          # Django project settings
│   ├── tournaments/               # Main Django app
│   │   ├── models.py             # Database models
│   │   ├── views.py              # API views
│   │   ├── serializers.py        # DRF serializers
│   │   ├── urls.py               # URL routing
│   │   ├── admin.py              # Admin configuration
│   │   └── tests.py              # Unit tests
│   ├── fastapi_app.py            # FastAPI integration
│   ├── requirements.txt          # Python dependencies
│   ├── pytest.ini               # Test configuration
│   └── Dockerfile               # Backend container
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.tsx    # Sticky navigation
│   │   │   └── sections/         # Page sections
│   │   ├── App.tsx               # Main app component
│   │   ├── index.tsx             # Entry point
│   │   └── index.css             # Global styles
│   ├── public/                   # Static assets
│   ├── package.json              # Node dependencies
│   ├── tsconfig.json             # TypeScript config
│   ├── tailwind.config.js        # Tailwind config
│   └── Dockerfile                # Frontend container
├── docker-compose.yml            # Multi-container setup
├── .github/workflows/ci.yml      # CI/CD pipeline
└── README.md                     # This file
```

## 🗄 Database Models

### Team
- `name`: Team name (unique)
- `created_at`: Creation timestamp

### Classification
- `team`: Foreign key to Team
- `points`: Tournament points
- `games_played`: Number of games played
- `games_won`: Games won
- `games_lost`: Games lost
- `goals_for`: Goals scored
- `goals_against`: Goals conceded
- `position`: Table position

### Participant
- `name`: Participant name
- `team`: Foreign key to Team (optional)
- `is_active`: Active status

### GalleryImage
- `title`: Image title
- `image`: Image file
- `description`: Image description
- `order`: Display order

## 🔧 API Endpoints

### Django REST API
- `GET /api/teams/` - List all teams
- `POST /api/teams/` - Create new team
- `GET /api/classifications/` - Get classification table
- `GET /api/participants/` - List participants
- `GET /api/gallery/` - Get gallery images

### FastAPI Endpoints
- `GET /` - API status
- `GET /api/teams/` - Teams (FastAPI version)
- `GET /api/classifications/` - Classifications (FastAPI version)

## 🎨 Frontend Sections

1. **INICIO**: Hero section with full-page gradient background
2. **REGLAMENTO**: Tournament rules with structured content
3. **FUNCIONAMIENTO**: Tournament format explanation
4. **PARTICIPANTES**: 3-column participant grid (6 rows each)
5. **CLASIFICACIÓN**: Dynamic classification table
6. **GALERÍA**: Image carousel with thumbnails and navigation

## 🚢 Deployment

The application is containerized and ready for deployment on any Docker-compatible platform:

- **Development**: `docker-compose up`
- **Production**: Configure environment variables and use production Docker compose file

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Database connection errors**
   - Ensure PostgreSQL is running
   - Check database credentials in `.env`

2. **Frontend build errors**
   - Delete `node_modules` and run `npm install`
   - Check Node.js version compatibility

3. **Docker issues**
   - Run `docker-compose down -v` to reset volumes
   - Rebuild with `docker-compose up --build`

### Support

For issues and questions, please create an issue in the repository.
