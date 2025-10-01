#!/bin/bash

echo "Deploying Sociedade Absolutus..."

# Navigate to project directory
cd ~/absolutus_society

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install

# Start backend server (in background)
echo "Starting backend server..."
node server.js &

# Navigate back to root
cd ..

# Add all files to git
echo "Adding files to git..."
git add .

# Commit changes
echo "Committing changes..."
git commit -m "Update Sociedade Absolutus mining platform - $(date)"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo "Deployment completed! Backend server is running."
echo "Frontend should be accessible at: https://sociedade-absolutus.vercel.app/"
echo "Backend API is running on port 3001"
