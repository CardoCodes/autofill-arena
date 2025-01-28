# MiddleAI Firefox Extension

This repository contains a Firefox extension built with React and TypeScript.

## Project Structure

# AI Job Application Assistant

An intelligent browser extension that streamlines the job application process using AI. Automatically fills out job applications, generates tailored resumes and cover letters, and helps track your application progress.

## 🌟 Features

- **Smart Form Auto-Fill**: Automatically detects and fills out job application forms using your saved profile
- **AI-Powered Content Generation**: Creates customized cover letters and tailors resumes for specific job postings
- **Resume Parser**: Extracts and structures information from your existing resume
- **Application Tracking**: Keeps track of your job applications and their status
- **Profile Management**: Maintains multiple versions of your professional information
- **Cross-Browser Support**: Works with both Chrome and Firefox

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.9 or higher)
- MongoDB
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/cardocodes/middleai.git
cd middleai
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd extension
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your configuration:
```
OPENAI_API_KEY=your_api_key
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Start the development servers:
```bash
# Start backend services
cd backend
docker-compose up -d  # If using Docker
# OR
npm run dev

# Start extension development
cd ../extension
npm run dev
```

### Loading the Extension

#### Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/dist` directory

#### Firefox
1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file in the `extension/dist` directory

## 🏗️ Architecture

The project consists of several key components:

- **Browser Extension**: React + TypeScript frontend
- **Backend Services**: 
  - Node.js/Express API Gateway
  - Python Resume Parser
  - FastAPI AI Service
  - Job Matcher Service
- **Databases**: 
  - MongoDB for user data
  - Vector Database for semantic search
- **External Services**: 
  - OpenAI API integration
  - AWS S3 for storage

## 💻 Development

### Project Structure
```
.
├── extension/           # Browser extension code
│   ├── src/            # Source files
│   ├── public/         # Static files
│   └── manifest.json   # Extension manifest
├── backend/            # Backend services
│   ├── api/           # API Gateway
│   ├── parser/        # Resume Parser
│   ├── ai-service/    # AI Service
│   └── job-matcher/   # Job Matching Service
└── docs/              # Documentation
```

### Running Tests

```bash
# Run frontend tests
cd extension
npm test

# Run backend tests
cd ../backend
npm test
```

## 📝 API Documentation

API documentation is available at `http://localhost:3000/api-docs` when running the development server.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Development Setup

### Frontend (Browser Extension)

The frontend React application is located in the `extension` directory. To develop it:

1. Navigate to the extension directory:
   ```bash
   cd extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. For development, start the development server:
   ```bash
   npm start
   ```

4. Build the production version:
   ```bash
   npm run build
   ```
   This will create a production build in the `extension/build` directory.

**Important Notes:**
- All npm commands must be run from within the `extension` directory
- The build process requires you to be in the `extension` directory to locate necessary files like `public/index.html`

#### Backend Setup

1. **Production Environment Setup**
   ```bash
   cp .env.example .env.production
   ```
   Configure production environment variables:
   ```
   NODE_ENV=production
   OPENAI_API_KEY=your_production_key
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_secret
   ```

2. **Docker Deployment**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Deployment

#### Extension Deployment

1. **Build the Extension**
   ```bash
   cd extension
   npm install
   npm run build
   ```

2. **Firefox Submission**
   - Create a zip file of the `extension/build` directory
   - Submit to [Firefox Add-ons](https://addons.mozilla.org/developers/)
   - Follow Mozilla's [submission guidelines](https://extensionworkshop.com/documentation/publish/submitting-an-add-on/)

3. **Chrome Web Store**
   - Create a zip file of the `extension/build` directory
   - Submit to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
   - Follow Google's [submission guidelines](https://developer.chrome.com/docs/webstore/publish/)

#### Backend Deployment

1. **Production Environment Setup**
   ```bash
   cp .env.example .env.production
   ```
   Configure production environment variables:
   ```
   NODE_ENV=production
   OPENAI_API_KEY=your_production_key
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_secret
   ```

2. **Docker Deployment**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Project Dependencies

The frontend uses:
- React 18
- TypeScript
- react-scripts for build tooling




