#!/bin/bash

echo "🐳 Testing Docker setup for Kanban Backend"
echo "=========================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create a .env file with the required environment variables."
    echo "See DOCKER_SETUP.md for details."
    exit 1
fi

echo "✅ .env file found"

# Build and run the container
echo "🔨 Building Docker image..."
docker build -t kanban-backend-test .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

echo "✅ Docker image built successfully"

# Run the container
echo "🚀 Starting container..."
docker run -d --name kanban-test --env-file .env -p 3000:3000 kanban-backend-test

# Wait for container to start
echo "⏳ Waiting for container to start..."
sleep 10

# Check if container is running
if [ ! "$(docker ps -q -f name=kanban-test)" ]; then
    echo "❌ Container failed to start!"
    echo "Container logs:"
    docker logs kanban-test
    docker rm kanban-test
    exit 1
fi

echo "✅ Container is running"

# Test health endpoint
echo "🏥 Testing health endpoint..."
for i in {1..10}; do
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        echo "✅ Health check passed!"
        break
    else
        echo "⏳ Attempt $i/10 - waiting for health check..."
        sleep 5
    fi
    
    if [ $i -eq 10 ]; then
        echo "❌ Health check failed after 10 attempts!"
        echo "Container logs:"
        docker logs kanban-test
        docker stop kanban-test
        docker rm kanban-test
        exit 1
    fi
done

# Show container logs
echo "📋 Container logs:"
docker logs kanban-test

# Cleanup
echo "🧹 Cleaning up..."
docker stop kanban-test
docker rm kanban-test

echo "✅ All tests passed! Your Docker setup is working correctly."
echo "You can now run: docker-compose up --build"
