# 🚀 Deployment Guide - Perplexity Clone

This guide provides multiple options to deploy your Perplexity clone to a public URL.

## 🎯 Quick Deploy Options

### Option 1: Render (Recommended - Free)

1. **Fork this repository** to your GitHub account
2. **Sign up** at [render.com](https://render.com)
3. **Connect your GitHub account**
4. **Click "New +" → "Web Service"**
5. **Select your forked repository**
6. **Configure the service:**
   - **Name:** `perplexity-clone`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
7. **Click "Create Web Service"**
8. **Wait for deployment** (2-3 minutes)
9. **Your app will be live** at `https://your-app-name.onrender.com`

### Option 2: Railway (Free Tier)

1. **Sign up** at [railway.app](https://railway.app)
2. **Connect your GitHub account**
3. **Click "New Project" → "Deploy from GitHub repo"**
4. **Select your repository**
5. **Railway will auto-detect** the Node.js app
6. **Deploy automatically**
7. **Get your public URL** from the dashboard

### Option 3: Heroku (Free Tier Discontinued)

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku:**
   ```bash
   heroku login
   ```

3. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```

4. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

5. **Open your app:**
   ```bash
   heroku open
   ```

### Option 4: Vercel (Free)

1. **Sign up** at [vercel.com](https://vercel.com)
2. **Import your GitHub repository**
3. **Configure build settings:**
   - **Framework Preset:** Node.js
   - **Build Command:** `npm install`
   - **Output Directory:** `public`
   - **Install Command:** `npm install`
4. **Deploy**
5. **Get your public URL**

### Option 5: Netlify (Free)

1. **Sign up** at [netlify.com](https://netlify.com)
2. **Connect your GitHub account**
3. **Click "New site from Git"**
4. **Select your repository**
5. **Configure build settings:**
   - **Build command:** `npm install`
   - **Publish directory:** `public`
6. **Deploy site**
7. **Get your public URL**

## 🔧 Manual Deployment Steps

### Prerequisites
- Node.js 14+ installed
- Git installed
- A GitHub account

### Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub repository:**
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it `perplexity-clone`
   - Don't initialize with README (we already have one)

3. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/perplexity-clone.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Choose Your Platform

#### For Render:
- Follow the steps in Option 1 above
- Render will automatically detect the `render.yaml` file

#### For Railway:
- Follow the steps in Option 2 above
- Railway will auto-detect the Node.js configuration

#### For Vercel:
- Follow the steps in Option 4 above
- Create a `vercel.json` file:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

## 🌐 Environment Variables

For production deployment, you may want to set environment variables:

### Render Environment Variables
- Go to your service dashboard
- Click "Environment"
- Add variables:
  - `NODE_ENV=production`
  - `PORT=3001`

### Railway Environment Variables
- Go to your project dashboard
- Click "Variables"
- Add the same variables as above

## 🔒 Security Considerations

1. **API Keys:** Never commit API keys to your repository
2. **Environment Variables:** Use platform-specific environment variable systems
3. **Rate Limiting:** The app includes built-in rate limiting
4. **CORS:** Configure CORS for your domain if needed

## 📊 Monitoring

### Health Check
Your deployed app will have a health check endpoint:
```
https://your-app-url.com/api/health
```

### API Info
Get API information:
```
https://your-app-url.com/api/info
```

## 🐛 Troubleshooting

### Common Issues

**Build fails:**
- Check Node.js version (needs 14+)
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

**App doesn't start:**
- Verify `startCommand` is correct (`npm start`)
- Check if port is properly configured
- Review application logs

**API calls fail:**
- Ensure CORS is properly configured
- Check if environment variables are set
- Verify API keys are valid

### Debug Commands

**Check Node.js version:**
```bash
node --version
```

**Test locally:**
```bash
npm install
npm start
```

**Check logs:**
- Render: Dashboard → Logs
- Railway: Dashboard → Deployments → View Logs
- Heroku: `heroku logs --tail`

## 🚀 Post-Deployment

1. **Test your app** at the provided URL
2. **Configure API keys** through the settings modal
3. **Share your app** with others
4. **Monitor usage** and performance

## 📈 Scaling

### Free Tier Limits
- **Render:** 750 hours/month
- **Railway:** $5 credit/month
- **Vercel:** 100GB bandwidth/month
- **Netlify:** 100GB bandwidth/month

### Upgrading
When you need more resources:
1. **Upgrade your plan** on the platform
2. **Add more environment variables** if needed
3. **Configure custom domains** if desired
4. **Set up monitoring** and analytics

## 🎉 Success!

Once deployed, your Perplexity clone will be available at a public URL that you can share with anyone. The app includes:

- ✅ Demo mode for testing without API keys
- ✅ Full functionality with configured API keys
- ✅ Mobile-responsive design
- ✅ Dark/Light theme support
- ✅ Chat history and conversation management
- ✅ Real-time search and AI responses

**Happy deploying! 🚀**