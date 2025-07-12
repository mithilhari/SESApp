# 🔍 Perplexity Clone - AI-Powered Search Engine

A modern, feature-rich clone of Perplexity.ai with real-time web search capabilities, AI-powered responses, and a beautiful chat interface.

![Perplexity Clone](https://img.shields.io/badge/Perplexity-Clone-blue?style=for-the-badge&logo=search)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## ✨ Features

### 🎯 Core Features
- **Real-time Web Search** - Search across multiple providers (SerpAPI, Brave Search, Serper.dev)
- **AI-Powered Responses** - Generate intelligent responses using OpenAI, Groq, Cohere, or Anthropic
- **Chat Interface** - Modern, responsive chat UI similar to Perplexity
- **Conversation History** - Save and manage chat sessions
- **Source Citations** - View and click through search sources
- **Dark/Light Mode** - Toggle between themes

### 🚀 Advanced Features
- **Streaming Responses** - Real-time AI response streaming (OpenAI/Groq)
- **Multiple AI Providers** - Support for various AI models
- **Rate Limiting** - Built-in protection against abuse
- **Error Handling** - Comprehensive error handling and user feedback
- **Mobile Responsive** - Works perfectly on all devices
- **Auto-resize Input** - Dynamic textarea sizing
- **Search Suggestions** - Quick-start with suggested questions

### 🔧 Technical Features
- **RESTful API** - Clean, documented API endpoints
- **CORS Support** - Cross-origin request handling
- **Environment Variables** - Secure configuration management
- **Health Checks** - API health monitoring
- **Request Timeouts** - Proper timeout handling
- **Input Validation** - Comprehensive input sanitization

## 🛠️ Installation

### Prerequisites
- Node.js 14.0.0 or higher
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd perplexity-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env_example.sh .env
   # Edit .env with your API keys
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open your browser**
   ```
   http://localhost:3001
   ```

## 🔑 API Configuration

### Required API Keys

You'll need at least one search API key and one AI API key:

#### Search Providers (Choose one)
- **SerpAPI** - [Get free key](https://serpapi.com/) (100 searches/month free)
- **Brave Search** - [Get free key](https://brave.com/search/api/) (2000 searches/month free)
- **Serper.dev** - [Get free key](https://serper.dev/) (2500 searches/month free)

#### AI Providers (Choose one)
- **OpenAI** - [Get API key](https://platform.openai.com/api-keys)
- **Groq** - [Get free key](https://console.groq.com/) (Free tier available)
- **Cohere** - [Get free key](https://cohere.ai/) (Free tier available)
- **Anthropic** - [Get API key](https://console.anthropic.com/) (Claude API)

### Configuration Steps

1. **Get your API keys** from the providers above
2. **Open the app** in your browser
3. **Click the settings icon** (⚙️) or click "Configure API Keys" if prompted
4. **Enter your API keys** and select your preferred providers
5. **Save settings** and start searching!

## 📱 Usage

### Basic Search
1. Type your question in the search box
2. Press Enter or click the send button
3. View the AI-generated response with sources

### Chat Features
- **New Chat** - Start a fresh conversation
- **Chat History** - Access previous conversations from the sidebar
- **Continue Conversations** - Ask follow-up questions in the same chat

### Suggested Questions
Try these example questions to get started:
- "What are the latest developments in artificial intelligence?"
- "What are the best programming languages to learn in 2025?"
- "How does climate change affect global weather patterns?"
- "What are the emerging technology trends for 2025?"

## 🔌 API Endpoints

### Search API
```http
POST /api/search
Content-Type: application/json

{
  "query": "your search query",
  "provider": "serpapi|brave|serper",
  "apiKey": "your_api_key"
}
```

### AI Generation API
```http
POST /api/ai-generate
Content-Type: application/json

{
  "query": "your question",
  "searchResults": [...],
  "provider": "openai|groq|cohere|anthropic",
  "apiKey": "your_api_key"
}
```

### Streaming AI API
```http
POST /api/ai-stream
Content-Type: application/json

{
  "query": "your question",
  "searchResults": [...],
  "provider": "openai|groq",
  "apiKey": "your_api_key"
}
```

### Health Check
```http
GET /api/health
```

### API Info
```http
GET /api/info
```

## 🎨 Customization

### Themes
The app supports both light and dark themes. Click the theme toggle in the sidebar to switch.

### Styling
All styles are defined in CSS custom properties in `public/index.html`. You can easily customize:
- Colors (`--primary-color`, `--secondary-color`, etc.)
- Border radius (`--radius`, `--radius-lg`)
- Shadows (`--shadow-sm`, `--shadow-md`, `--shadow-lg`)

### Adding New Providers
To add new search or AI providers:

1. **Add endpoint** to `API_ENDPOINTS` in `server.js`
2. **Add case** in the switch statements for search/AI generation
3. **Update parsing** in `parseSearchResults` function
4. **Add option** to the frontend select dropdowns

## 🚀 Deployment

### Local Development
```bash
npm run dev  # Uses nodemon for auto-restart
```

### Production Deployment

#### Using PM2
```bash
npm install -g pm2
pm2 start server.js --name "perplexity-clone"
pm2 startup
pm2 save
```

#### Using Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

#### Environment Variables
```bash
PORT=3001
NODE_ENV=production
```

## 🔒 Security Features

- **Rate Limiting** - 10 requests per minute per IP
- **Input Validation** - Query length limits and sanitization
- **API Key Protection** - Keys stored locally in browser
- **CORS Configuration** - Configurable cross-origin policies
- **Request Timeouts** - Prevents hanging requests

## 🐛 Troubleshooting

### Common Issues

**"Invalid API key" error**
- Double-check your API key is correct
- Ensure you have sufficient credits/quota
- Try a different provider

**"Rate limit exceeded" error**
- Wait a minute before making more requests
- Consider upgrading your API plan
- Use a different provider

**Search not working**
- Verify your search API key is valid
- Check if your provider has sufficient quota
- Try a different search provider

**AI responses not generating**
- Verify your AI API key is valid
- Check if your AI provider has sufficient quota
- Try a different AI provider

### Debug Mode
Set `NODE_ENV=development` to see detailed error messages.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Perplexity.ai](https://perplexity.ai)
- Built with [Express.js](https://expressjs.com/)
- Icons from [Font Awesome](https://fontawesome.com/)
- Search APIs from SerpAPI, Brave Search, and Serper.dev
- AI APIs from OpenAI, Groq, Cohere, and Anthropic

## 📞 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting section](#-troubleshooting)
2. Review the [API documentation](#-api-endpoints)
3. Open an issue on GitHub
4. Check the [deployment guide](deployment_guide.md) for production setup

---

**Made with ❤️ for the AI community**