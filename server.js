const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API endpoints configuration
const API_ENDPOINTS = {
    serpapi: 'https://serpapi.com/search.json',
    brave: 'https://api.search.brave.com/res/v1/web/search',
    serper: 'https://google.serper.dev/search',
    openai: 'https://api.openai.com/v1/chat/completions',
    groq: 'https://api.groq.com/openai/v1/chat/completions',
    cohere: 'https://api.cohere.ai/v1/generate',
    anthropic: 'https://api.anthropic.com/v1/messages'
};

// Rate limiting (simple in-memory store)
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute

// Rate limiting middleware
function rateLimitMiddleware(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!rateLimit.has(ip)) {
        rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    } else {
        const userLimit = rateLimit.get(ip);
        if (now > userLimit.resetTime) {
            rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        } else if (userLimit.count >= RATE_LIMIT_MAX) {
            return res.status(429).json({ 
                error: 'Rate limit exceeded. Please try again in a minute.' 
            });
        } else {
            userLimit.count++;
        }
    }
    next();
}

// Search endpoint with enhanced error handling
app.post('/api/search', rateLimitMiddleware, async (req, res) => {
    try {
        const { query, provider, apiKey } = req.body;
        
        if (!query || !provider || !apiKey) {
            return res.status(400).json({ 
                error: 'Missing required parameters: query, provider, or apiKey' 
            });
        }

        // Validate query length
        if (query.length > 500) {
            return res.status(400).json({ 
                error: 'Query too long. Please keep it under 500 characters.' 
            });
        }

        let url, options;

        switch (provider) {
            case 'serpapi':
                url = `${API_ENDPOINTS.serpapi}?engine=google&q=${encodeURIComponent(query)}&api_key=${apiKey}&num=10`;
                options = { 
                    method: 'GET',
                    timeout: 10000 // 10 second timeout
                };
                break;
                
            case 'brave':
                url = `${API_ENDPOINTS.brave}?q=${encodeURIComponent(query)}&count=10&safesearch=moderate`;
                options = {
                    method: 'GET',
                    headers: {
                        'X-Subscription-Token': apiKey,
                        'Accept': 'application/json'
                    },
                    timeout: 10000
                };
                break;
                
            case 'serper':
                url = API_ENDPOINTS.serper;
                options = {
                    method: 'POST',
                    headers: {
                        'X-API-KEY': apiKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        q: query,
                        num: 10,
                        gl: 'us',
                        hl: 'en'
                    }),
                    timeout: 10000
                };
                break;
                
            default:
                return res.status(400).json({ error: 'Invalid search provider' });
        }

        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Search API error for ${provider}:`, response.status, errorText);
            
            if (response.status === 401 || response.status === 403) {
                return res.status(401).json({ 
                    error: 'Invalid API key. Please check your credentials.' 
                });
            } else if (response.status === 429) {
                return res.status(429).json({ 
                    error: 'API rate limit exceeded. Please try again later.' 
                });
            } else {
                return res.status(response.status).json({ 
                    error: `Search API error: ${response.status} - ${errorText}` 
                });
            }
        }

        const data = await response.json();
        const parsedResults = parseSearchResults(data, provider);
        
        res.json({ 
            success: true, 
            results: parsedResults,
            query: query,
            provider: provider
        });

    } catch (error) {
        console.error('Search error:', error);
        
        if (error.name === 'AbortError') {
            res.status(408).json({ 
                error: 'Request timeout. Please try again.' 
            });
        } else {
            res.status(500).json({ 
                error: 'Internal server error. Please try again later.' 
            });
        }
    }
});

// AI generation endpoint with streaming support
app.post('/api/ai-generate', rateLimitMiddleware, async (req, res) => {
    try {
        const { query, searchResults, provider, apiKey, stream = false } = req.body;
        
        if (!query || !provider || !apiKey) {
            return res.status(400).json({ 
                error: 'Missing required parameters: query, provider, or apiKey' 
            });
        }

        // Validate query length
        if (query.length > 1000) {
            return res.status(400).json({ 
                error: 'Query too long. Please keep it under 1000 characters.' 
            });
        }

        const context = searchResults?.map(result => 
            `Title: ${result.title}\nURL: ${result.url}\nSnippet: ${result.snippet}`
        ).join('\n\n') || '';

        const prompt = `Based on the following search results, provide a comprehensive and accurate answer to the query: "${query}"

Search Results:
${context}

Please provide a detailed, informative response that synthesizes information from these sources. Be factual and cite relevant information where appropriate. Keep the response under 500 words and format it nicely with paragraphs.`;

        let url, options;

        switch (provider) {
            case 'openai':
                url = API_ENDPOINTS.openai;
                options = {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: [
                            { 
                                role: 'system', 
                                content: 'You are a helpful AI assistant that provides accurate, well-researched answers based on search results. Always cite sources when possible.' 
                            },
                            { role: 'user', content: prompt }
                        ],
                        max_tokens: 800,
                        temperature: 0.7,
                        stream: stream
                    }),
                    timeout: 30000
                };
                break;
                
            case 'groq':
                url = API_ENDPOINTS.groq;
                options = {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'mixtral-8x7b-32768',
                        messages: [
                            { 
                                role: 'system', 
                                content: 'You are a helpful AI assistant that provides accurate, well-researched answers based on search results. Always cite sources when possible.' 
                            },
                            { role: 'user', content: prompt }
                        ],
                        max_tokens: 800,
                        temperature: 0.7,
                        stream: stream
                    }),
                    timeout: 30000
                };
                break;
                
            case 'cohere':
                url = API_ENDPOINTS.cohere;
                options = {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        prompt: prompt,
                        max_tokens: 800,
                        temperature: 0.7,
                        k: 0,
                        stop_sequences: [],
                        return_likelihoods: 'NONE'
                    }),
                    timeout: 30000
                };
                break;

            case 'anthropic':
                url = API_ENDPOINTS.anthropic;
                options = {
                    method: 'POST',
                    headers: {
                        'x-api-key': apiKey,
                        'Content-Type': 'application/json',
                        'anthropic-version': '2023-06-01'
                    },
                    body: JSON.stringify({
                        model: 'claude-3-sonnet-20240229',
                        max_tokens: 800,
                        messages: [
                            { role: 'user', content: prompt }
                        ]
                    }),
                    timeout: 30000
                };
                break;
                
            default:
                return res.status(400).json({ error: 'Invalid AI provider' });
        }

        if (stream && (provider === 'openai' || provider === 'groq')) {
            // Handle streaming response
            const response = await fetch(url, options);
            
            if (!response.ok) {
                const errorText = await response.text();
                return res.status(response.status).json({ 
                    error: `AI API error: ${response.status} - ${errorText}` 
                });
            }

            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            response.body.on('data', chunk => {
                const lines = chunk.toString().split('\n');
                lines.forEach(line => {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') {
                            res.write('data: [DONE]\n\n');
                            res.end();
                        } else {
                            try {
                                const parsed = JSON.parse(data);
                                if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                                    res.write(`data: ${JSON.stringify({ content: parsed.choices[0].delta.content })}\n\n`);
                                }
                            } catch (e) {
                                // Ignore parsing errors
                            }
                        }
                    }
                });
            });

            response.body.on('end', () => {
                res.end();
            });

        } else {
            // Handle regular response
            const response = await fetch(url, options);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`AI API error for ${provider}:`, response.status, errorText);
                
                if (response.status === 401 || response.status === 403) {
                    return res.status(401).json({ 
                        error: 'Invalid API key. Please check your credentials.' 
                    });
                } else if (response.status === 429) {
                    return res.status(429).json({ 
                        error: 'API rate limit exceeded. Please try again later.' 
                    });
                } else {
                    return res.status(response.status).json({ 
                        error: `AI API error: ${response.status} - ${errorText}` 
                    });
                }
            }

            const data = await response.json();
            let aiResponse;

            switch (provider) {
                case 'openai':
                case 'groq':
                    aiResponse = data.choices[0].message.content;
                    break;
                case 'cohere':
                    aiResponse = data.generations[0].text;
                    break;
                case 'anthropic':
                    aiResponse = data.content[0].text;
                    break;
                default:
                    aiResponse = 'Unable to generate AI response';
            }

            res.json({ 
                success: true, 
                response: aiResponse.trim(),
                provider: provider
            });
        }

    } catch (error) {
        console.error('AI generation error:', error);
        
        if (error.name === 'AbortError') {
            res.status(408).json({ 
                error: 'Request timeout. Please try again.' 
            });
        } else {
            res.status(500).json({ 
                error: 'Internal server error. Please try again later.' 
            });
        }
    }
});

// Streaming AI response endpoint
app.post('/api/ai-stream', rateLimitMiddleware, async (req, res) => {
    req.body.stream = true;
    return app._router.handle(req, res, () => {
        // This will be handled by the ai-generate endpoint
    });
});

// Chat history endpoint
app.post('/api/chat', rateLimitMiddleware, async (req, res) => {
    try {
        const { messages, provider, apiKey } = req.body;
        
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ 
                error: 'Invalid messages array' 
            });
        }

        if (!provider || !apiKey) {
            return res.status(400).json({ 
                error: 'Missing provider or apiKey' 
            });
        }

        // Create conversation context
        const conversation = messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        }));

        let url, options;

        switch (provider) {
            case 'openai':
                url = API_ENDPOINTS.openai;
                options = {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: conversation,
                        max_tokens: 800,
                        temperature: 0.7
                    }),
                    timeout: 30000
                };
                break;
                
            case 'groq':
                url = API_ENDPOINTS.groq;
                options = {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'mixtral-8x7b-32768',
                        messages: conversation,
                        max_tokens: 800,
                        temperature: 0.7
                    }),
                    timeout: 30000
                };
                break;
                
            default:
                return res.status(400).json({ error: 'Invalid AI provider for chat' });
        }

        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ 
                error: `AI API error: ${response.status} - ${errorText}` 
            });
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        res.json({ 
            success: true, 
            response: aiResponse.trim(),
            provider: provider
        });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ 
            error: 'Internal server error. Please try again later.' 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        features: ['search', 'ai-generation', 'streaming', 'chat-history']
    });
});

// API info endpoint
app.get('/api/info', (req, res) => {
    res.json({
        name: 'Perplexity Clone API',
        version: '1.0.0',
        description: 'AI-powered search engine with real-time web search and AI generation',
        endpoints: {
            '/api/search': 'Perform web search',
            '/api/ai-generate': 'Generate AI response based on search results',
            '/api/ai-stream': 'Stream AI response',
            '/api/chat': 'Chat with AI using conversation history',
            '/api/health': 'Health check'
        },
        supported_providers: {
            search: ['serpapi', 'brave', 'serper'],
            ai: ['openai', 'groq', 'cohere', 'anthropic']
        }
    });
});

// Parse search results based on provider
function parseSearchResults(data, provider) {
    let results = [];

    try {
        switch (provider) {
            case 'serpapi':
                results = data.organic_results?.map(result => ({
                    title: result.title || 'No title',
                    url: result.link || '#',
                    snippet: result.snippet || 'No description available'
                })) || [];
                break;
                
            case 'brave':
                results = data.web?.results?.map(result => ({
                    title: result.title || 'No title',
                    url: result.url || '#',
                    snippet: result.description || 'No description available'
                })) || [];
                break;
                
            case 'serper':
                results = data.organic?.map(result => ({
                    title: result.title || 'No title',
                    url: result.link || '#',
                    snippet: result.snippet || 'No description available'
                })) || [];
                break;
        }
    } catch (error) {
        console.error('Error parsing search results:', error);
        return [];
    }

    // Filter out invalid results and limit to 8
    return results
        .filter(result => result.url && result.url !== '#' && result.title && result.title !== 'No title')
        .slice(0, 8);
}

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    res.status(500).json({ 
        error: 'Something went wrong on the server',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Endpoint not found',
        available_endpoints: ['/api/search', '/api/ai-generate', '/api/health', '/api/info']
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Perplexity Clone Server running on port ${PORT}`);
    console.log(`📱 Frontend available at: http://localhost:${PORT}`);
    console.log(`🔗 API endpoints available at: http://localhost:${PORT}/api/`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`ℹ️  API info: http://localhost:${PORT}/api/info`);
});

module.exports = app;