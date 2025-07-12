# SESApp - Self-Hosted AI Search Engine

🚀 **A powerful, self-hosted AI-powered search engine that combines real web search with intelligent AI responses.**

![SESApp Screenshot](https://via.placeholder.com/800x400/667eea/ffffff?text=SESApp+AI+Search+Engine)

## ✨ Features

- 🤖 **AI-Powered Responses** - Get intelligent answers from OpenAI, Groq, or Cohere
- 🌐 **Real Web Search** - Access current information from Serper.dev, SerpAPI, or Brave Search
- 🔒 **Self-Hosted & Private** - Keep your searches private and maintain full control
- ⚡ **Lightning Fast** - Optimized for speed with modern web technologies
- 📱 **Mobile Responsive** - Beautiful design that works on all devices
- 🛠️ **Easy Deployment** - Simple setup and deployment process

## 🏗️ Architecture

```
SESApp/
├── backend_server.js      # Express.js backend server
├── package.json           # Node.js dependencies
├── .env.example          # Environment variables template
├── deployment_guide.md   # Detailed deployment instructions
└── public/
    ├── index.html        # Modern homepage
    └── perplexity_clone.html  # AI search engine interface
```

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd sesapp
npm install
```

### 2. Configure Environment (Optional)
```bash
cp .env.example .env
# Edit .env with your API keys (optional - users can configure via UI)
```

### 3. Run Locally
```bash
npm start
# or for development:
npm run dev
```

Visit: `http://localhost:3001`

## 🌐 Deployment Options

### Railway (Recommended - Free)
1. Visit [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Connect your repository
5. Your app will be live at `https://your-app.railway.app`

### Render (Free)
1. Visit [render.com](https://render.com)
2. Create "New Web Service"
3. Connect your GitHub repository
4. Build Command: `npm install`
5. Start Command: `npm start`

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Vercel (Serverless)
```bash
npm i -g vercel
vercel
```

## 🔑 API Keys Setup

### Search APIs (Choose One)
- **Serper.dev**: [serper.dev](https://serper.dev) - 2,500 free searches/month
- **SerpAPI**: [serpapi.com](https://serpapi.com) - 100 free searches/month  
- **Brave Search**: [brave.com/search/api](https://brave.com/search/api) - 2,000 free/month

### AI APIs (Choose One)
- **Groq**: [groq.com](https://groq.com) - Free tier, very fast
- **OpenAI**: [openai.com](https://openai.com) - $5 free credit
- **Cohere**: [cohere.ai](https://cohere.ai) - Free tier available

## 🎯 How It Works

1. **User Input**: Enter a search query on the homepage or AI search interface
2. **Web Search**: The backend fetches real search results from your chosen provider
3. **AI Processing**: Search results are sent to your chosen AI model for analysis
4. **Intelligent Response**: AI synthesizes information and provides a comprehensive answer
5. **Results Display**: Both search results and AI response are displayed beautifully

## 🛠️ Customization

### Styling
- Modify CSS in `public/index.html` and `public/perplexity_clone.html`
- Change colors, fonts, and layout to match your brand
- Add your logo and branding elements

### Functionality
- Add new search providers in `backend_server.js`
- Integrate additional AI models
- Add authentication if needed
- Implement rate limiting

### Features
- Add search history
- Implement user accounts
- Add bookmarking functionality
- Create custom search filters

## 🔒 Security & Privacy

- ✅ API keys handled securely on backend
- ✅ No sensitive data exposed to frontend
- ✅ HTTPS encryption when deployed
- ✅ Rate limiting handled by API providers
- ✅ Self-hosted for complete data control

## 📱 Mobile Experience

The website is fully responsive and optimized for:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Desktop computers
- 🖥️ Large displays

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Change PORT in .env file or use:
PORT=3002 npm start
```

**API errors**
- Check your API keys are correct
- Verify you haven't exceeded rate limits
- Ensure your chosen provider is working

**Module not found**
```bash
npm install
```

**CORS errors**
- Should be resolved with backend proxy
- Check your deployment platform settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with Express.js, Node.js, and modern web technologies
- Inspired by Perplexity's AI search interface
- Uses various search and AI APIs for functionality

## 📞 Support

- Create an issue on GitHub for bugs
- Check the deployment guide for setup help
- Review API documentation for integration issues

---

**Ready to deploy your own AI search engine?** 🚀

Start with the quick setup above, or dive into the detailed [deployment guide](deployment_guide.md) for comprehensive instructions.