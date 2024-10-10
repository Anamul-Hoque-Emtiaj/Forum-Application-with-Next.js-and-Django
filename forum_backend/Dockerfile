# forum_backend/Dockerfile

# Base image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    netcat \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy project
COPY . .

# Create a user to run the application
RUN adduser --disabled-password --no-create-home appuser
USER appuser

# Expose port 8000
EXPOSE 8000

# Command to run when starting the container
CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate --noinput && gunicorn forum_project.wsgi:application --bind 0.0.0.0:8000"]
