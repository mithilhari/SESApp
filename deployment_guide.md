# SearchAI - Deployment Guide

## 🚀 CORS Issue Resolved!

This version includes a backend server that handles all API calls, completely resolving CORS issues.

## 📁 File Structure

```
searchai-project/
├── server.js           # Backend server
├── package.json        # Dependencies
├── .env.example        # Environment variables template
├── .env               # Your actual environment variables (create this)
└── public/
    └── index.html     # Frontend (your HTML file)
```

## 🛠️ Setup Instructions

### 1. Create Project Directory
```bash
mkdir searchai-project
cd searchai-project
```

### 2. Create Files
- Copy `server.js` content to `server.js`
- Copy `package.json` content to `package.json`
- Copy `.env.example` to `.env` (and fill in your API keys)
- Create `public/` folder and put your HTML file as `public/index.html`

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
```bash
cp .env.example .env
# Edit .env file with your API keys (optional - users can still use UI)
```

### 5. Run Locally
```bash
npm start
# or for development:
npm run dev
```

Visit: `http://localhost:3001`

## 🌐 Free Deployment Options

### Option 1: Railway (Recommended)
1. Visit [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Connect your GitHub repository
5. Railway will auto-detect Node.js and deploy
6. Set environment variables in Railway dashboard
7. Your app will be live at `https://your-app.railway.app`

### Option 2: Render
1. Visit [render.com](https://render.com)
2. Sign up and create "New Web Service"
3. Connect your GitHub repository
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add environment variables in dashboard
7. Deploy!

### Option 3: Heroku
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables: `heroku config:set PORT=3001`
5. Deploy: `git push heroku main`

### Option 4: Vercel (Serverless)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Add environment variables in Vercel dashboard

## 🔑 API Keys Setup

### Search APIs (Choose One):
- **Serper.dev**: [serper.dev](https://serper.dev) - 2,500 free searches/month
- **SerpAPI**: [serpapi.com](https://serpapi.com) - 100 free searches/month  
- **Brave Search**: [brave.com/search/api](https://brave.com/search/api) - 2,000 free/month

### AI APIs (Choose One):
- **Groq**: [groq.com](https://groq.com) - Free tier, very fast
- **OpenAI**: [openai.com](https://openai.com) - $5 free credit
- **Cohere**: [cohere.ai](https://cohere.ai) - Free tier available

## 🔧 Configuration

### Method 1: Environment Variables (Recommended for deployment)
Set in your hosting platform:
```
SEARCH_API_KEY=your_key_here
AI_API_KEY=your_key_here
SEARCH_PROVIDER=serper
AI_PROVIDER=groq
```

### Method 2: UI Configuration
Users can still configure API keys directly in the web interface.

## 🐛 Troubleshooting

### Common Issues:
1. **Port already in use**: Change PORT in .env file
2. **API errors**: Check your API keys and rate limits
3. **CORS errors**: Should be resolved with backend proxy
4. **Module not found**: Run `npm install`

### Debug Mode:
```bash
NODE_ENV=development npm run dev
```

## 📱 Features

- ✅ Real web search (no more mock data)
- ✅ AI-powered responses
- ✅ CORS issues resolved
- ✅ Multiple API providers
- ✅ Error handling
- ✅ Mobile responsive
- ✅ Free deployment ready

## 🔒 Security Notes

- API keys are handled securely on the backend
- No API keys exposed to frontend
- Rate limiting handled by API providers
- HTTPS encryption when deployed

## 💡 Next Steps

1. Get your free API keys
2. Deploy to your preferred platform
3. Test with real searches
4. Customize the design if needed
5. Share your deployed app!

Your Perplexity clone is now production-ready with real search and AI capabilities! 🎉