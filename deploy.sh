#!/bin/bash

# SESApp Deployment Script
# This script automates the deployment process for the self-hosted AI search engine

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 14 or higher."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed. Docker deployment will be skipped."
        DOCKER_AVAILABLE=false
    else
        DOCKER_AVAILABLE=true
    fi
    
    print_success "Dependencies check completed"
}

# Install Node.js dependencies
install_dependencies() {
    print_status "Installing Node.js dependencies..."
    npm install
    print_success "Dependencies installed successfully"
}

# Setup environment file
setup_environment() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            print_warning "Created .env file from template. Please edit it with your API keys."
        else
            print_error ".env.example file not found. Please create a .env file manually."
            exit 1
        fi
    else
        print_status ".env file already exists"
    fi
}

# Build Docker image
build_docker() {
    if [ "$DOCKER_AVAILABLE" = true ]; then
        print_status "Building Docker image..."
        docker build -t sesapp .
        print_success "Docker image built successfully"
    else
        print_warning "Skipping Docker build (Docker not available)"
    fi
}

# Start application
start_application() {
    print_status "Starting SESApp..."
    
    if [ "$1" = "docker" ] && [ "$DOCKER_AVAILABLE" = true ]; then
        print_status "Starting with Docker Compose..."
        docker-compose up -d
        print_success "SESApp started with Docker on http://localhost:3001"
    else
        print_status "Starting with Node.js..."
        npm start &
        PID=$!
        echo $PID > .pid
        print_success "SESApp started with Node.js on http://localhost:3001 (PID: $PID)"
    fi
}

# Stop application
stop_application() {
    print_status "Stopping SESApp..."
    
    if [ -f .pid ]; then
        PID=$(cat .pid)
        if kill -0 $PID 2>/dev/null; then
            kill $PID
            rm .pid
            print_success "Application stopped"
        else
            print_warning "Application was not running"
            rm .pid
        fi
    elif [ "$DOCKER_AVAILABLE" = true ]; then
        docker-compose down
        print_success "Docker containers stopped"
    else
        print_warning "No running application found"
    fi
}

# Show status
show_status() {
    print_status "Checking application status..."
    
    if [ -f .pid ]; then
        PID=$(cat .pid)
        if kill -0 $PID 2>/dev/null; then
            print_success "Application is running (PID: $PID)"
        else
            print_warning "Application is not running (stale PID file)"
            rm .pid
        fi
    elif [ "$DOCKER_AVAILABLE" = true ]; then
        if docker-compose ps | grep -q "Up"; then
            print_success "Docker containers are running"
        else
            print_warning "Docker containers are not running"
        fi
    else
        print_warning "No application status available"
    fi
}

# Show logs
show_logs() {
    print_status "Showing application logs..."
    
    if [ "$1" = "docker" ] && [ "$DOCKER_AVAILABLE" = true ]; then
        docker-compose logs -f
    else
        print_warning "Logs not available for Node.js deployment"
    fi
}

# Main deployment function
deploy() {
    print_status "Starting SESApp deployment..."
    
    check_dependencies
    install_dependencies
    setup_environment
    build_docker
    
    print_success "Deployment completed successfully!"
    print_status "Next steps:"
    echo "1. Edit .env file with your API keys"
    echo "2. Run './deploy.sh start' to start the application"
    echo "3. Visit http://localhost:3001 in your browser"
}

# Show usage
show_usage() {
    echo "SESApp Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  deploy     - Full deployment (install dependencies, setup environment)"
    echo "  start      - Start the application"
    echo "  start docker - Start the application with Docker"
    echo "  stop       - Stop the application"
    echo "  restart    - Restart the application"
    echo "  status     - Show application status"
    echo "  logs       - Show application logs (Docker only)"
    echo "  help       - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy"
    echo "  $0 start docker"
    echo "  $0 status"
}

# Main script logic
case "${1:-help}" in
    deploy)
        deploy
        ;;
    start)
        if [ "$2" = "docker" ]; then
            start_application docker
        else
            start_application
        fi
        ;;
    stop)
        stop_application
        ;;
    restart)
        stop_application
        sleep 2
        start_application
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs $2
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        print_error "Unknown command: $1"
        show_usage
        exit 1
        ;;
esac