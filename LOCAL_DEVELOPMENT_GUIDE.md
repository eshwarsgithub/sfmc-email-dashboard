# Local Development Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/eshwarsgithub/sfmc-email-dashboard.git
cd sfmc-email-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory with your SFMC credentials:
```env
# SFMC API Credentials
VITE_SFMC_CLIENT_ID=your_client_id_here
VITE_SFMC_CLIENT_SECRET=your_client_secret_here
VITE_SFMC_SUBDOMAIN=your_subdomain_here

# Dashboard Configuration
VITE_DASHBOARD_TITLE=Email Campaign Dashboard
VITE_COMPANY_NAME=Your Company Name
```

### 4. Start Development Servers

#### Option A: Run Both Servers Separately (Recommended)

**Terminal 1 - Backend Server:**
```bash
node server.cjs
```
- Backend will run on: **http://localhost:3001**
- API endpoints available at: **http://localhost:3001/api/**

**Terminal 2 - Frontend Development Server:**
```bash
npm run dev
```
- Frontend will run on: **http://localhost:5173** (or similar port)

#### Option B: Development Script (if available)
```bash
npm run dev:full  # If this script exists
```

## 🔗 Local URLs

### Frontend Dashboard
- **Main Application**: http://localhost:5173
- **Alternative ports**: http://localhost:5174, http://localhost:5175 (if 5173 is busy)

### Backend API
- **Health Check**: http://localhost:3001/api/health
- **Dashboard Data**: http://localhost:3001/api/dashboard
- **Base URL**: http://localhost:3001

## 🛠️ Development Workflow

### Making Changes

1. **Frontend Changes** (React/TypeScript):
   - Edit files in `src/` directory
   - Hot reload will automatically refresh the browser
   - Main files:
     - `src/App.tsx` - Main dashboard component
     - `src/App.css` - Styling
     - `src/services/sfmcService.ts` - SFMC API integration

2. **Backend Changes** (Node.js/Express):
   - Edit `server.cjs`
   - Restart the server: `Ctrl+C` then `node server.cjs`
   - API changes will be immediately available

3. **Environment Changes**:
   - Edit `.env` file
   - Restart both servers to pick up new environment variables

### Testing Your Changes

```bash
# Test backend API
curl http://localhost:3001/api/health
curl http://localhost:3001/api/dashboard

# Build for production (to test build)
npm run build
npm run preview
```

## 📁 Project Structure

```
sfmc-email-dashboard/
├── src/                     # Frontend React application
│   ├── components/          # React components
│   ├── services/           # API services and SFMC integration
│   ├── App.tsx             # Main dashboard component
│   └── App.css             # Styles
├── api/                    # Serverless functions (for production)
├── server.cjs              # Local development backend server
├── .env                    # Environment variables (create this)
├── package.json            # Dependencies and scripts
└── vercel.json             # Deployment configuration
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start frontend development server
node server.cjs          # Start backend development server

# Building
npm run build            # Build for production
npm run preview          # Preview production build locally

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript checks
```

## 🐛 Troubleshooting

### Common Issues:

1. **Port already in use**:
   - Frontend: Vite will automatically try next available port
   - Backend: Change port in `server.cjs` (line ~8)

2. **SFMC not connecting**:
   - Check `.env` file has correct credentials
   - Verify backend server is running
   - Check console logs for authentication errors

3. **Module not found errors**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **CORS errors**:
   - Ensure backend server is running on port 3001
   - Check `server.cjs` CORS configuration

### Debug Mode:
- Open browser dev tools (F12)
- Check Console tab for frontend errors
- Check Network tab for API call failures
- Backend logs appear in the terminal running `server.cjs`

## 🚀 Deployment

When ready to deploy:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will automatically deploy changes pushed to the main branch.

---

**Happy coding! 🎉** 

For any issues, check the console logs or refer to the SFMC_INTEGRATION_STATUS.md file for integration details.