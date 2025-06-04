#!/bin/bash

# Script to guide through cloning, installing dependencies for backend and frontend.
# This script is intended as a guide; you might need to adapt commands based on your OS and installed tools.

echo "---------------------------------------------------------------------"
echo "Project Setup Guide"
echo "---------------------------------------------------------------------"

# Ensure you have git, Python (3.7+ recommended), pip, and Node.js (with npm or yarn) installed.

# 1. Clone the Repository (if you haven't already)
#    Replace <YOUR_REPOSITORY_URL> with the actual URL from your Git provider.
#    If you've already cloned, you can skip this and just navigate into the project directory.
#
#    Example:
#    git clone <YOUR_REPOSITORY_URL>
#    cd <NAME_OF_THE_PROJECT_DIRECTORY> # e.g., cd my-petshop-app
#
#    If you are already in the project directory, you can proceed.
echo ""
echo "Step 1: Ensure you are in the project's root directory (the one containing 'frontend' and 'backend' folders)."
echo ""

# 2. Backend Setup
echo "Step 2: Setting up the Python backend..."
if [ -d "backend" ]; then
  cd backend

  # (Optional but Recommended) Create and activate a Python virtual environment
  # This helps manage dependencies for this project specifically.
  echo "  - Creating Python virtual environment (.venv)..."
  python3 -m venv .venv
  echo "  - To activate the virtual environment, run:"
  echo "    On macOS/Linux: source .venv/bin/activate"
  echo "    On Windows (Git Bash/PowerShell): .venv/Scripts/activate"
  echo "  - !! IMPORTANT: Activate the virtual environment in your backend terminal before proceeding further with backend steps if you choose to use one."
  echo ""

  # Install Python dependencies
  if [ -f "requirements.txt" ]; then
    echo "  - Installing Python dependencies from requirements.txt..."
    pip install -r requirements.txt
    # If activation of venv is manual, user must ensure it's active before this pip install.
  else
    echo "  - requirements.txt not found. Attempting to install Flask and Pydantic directly."
    echo "  - This assumes Flask and Pydantic were the primary dependencies."
    pip install Flask Pydantic
  fi
  echo "  - Backend dependencies installation attempted."
  cd ..
else
  echo "  - 'backend' directory not found. Skipping backend setup."
fi
echo "Backend setup steps outlined."
echo ""

# 3. Frontend Setup
echo "Step 3: Setting up the Next.js frontend..."
# Assuming frontend is in the root or a 'frontend' subdirectory.
# If your package.json is in the root:
if [ -f "package.json" ]; then
  echo "  - Installing frontend dependencies (npm install)..."
  npm install # or alternatively: yarn install
  echo "  - Frontend dependencies installation attempted."
else
  echo "  - package.json not found in the root. If your frontend is in a subdirectory (e.g., 'frontend'),"
  echo "    you'll need to 'cd' into it first and then run 'npm install'."
fi
echo "Frontend setup steps outlined."
echo ""

echo "---------------------------------------------------------------------"
echo "Manual Steps to Run the Application:"
echo "---------------------------------------------------------------------"
echo "1. RUN THE BACKEND:"
echo "   - Open a terminal."
echo "   - Navigate to the 'backend' directory: cd backend"
echo "   - (If using a venv) Activate the virtual environment (e.g., source .venv/bin/activate)."
echo "   - Run the Flask app: python app.py"
echo "   - The backend should typically start on http://127.0.0.1:5000."
echo ""
echo "2. RUN THE FRONTEND:"
echo "   - Open a *new* terminal."
echo "   - Navigate to the project's root directory (or your frontend directory if it's separate)."
echo "   - Run the Next.js development server: npm run dev (or yarn dev)"
echo "   - The frontend should typically start on http://localhost:3000."
echo ""
echo "3. ACCESS THE APPLICATION:"
echo "   - Open your web browser and go to http://localhost:3000."
echo "---------------------------------------------------------------------"
