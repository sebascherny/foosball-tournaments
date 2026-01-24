#!/bin/bash

# Wait for database to be ready
echo "Waiting for database..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "Database port is open, waiting for PostgreSQL to be ready..."

# Additional wait for PostgreSQL to be fully ready
sleep 5

# Test database connection with Django
echo "Testing database connection..."
until python manage.py check --database default; do
  echo "Database not ready yet, waiting..."
  sleep 2
done
echo "Database is ready!"

# Run Django management commands
echo "Running migrations..."
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Creating superuser..."
python manage.py createsuperuser --noinput || true

echo "Starting Django development server..."
python manage.py runserver 0.0.0.0:8000
