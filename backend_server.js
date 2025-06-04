const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files

// API endpoints configuration
const API_ENDPOINTS = {
    serpapi: 'https://serpapi.com/search.json',
    brave: 'https://api.search.brave.com/res/v1/web/search',
    serper: 'https://google.serper.dev/search',
    openai: 'https://api.openai.com/v1/chat/completions',
    groq: 'https://api.groq.com/openai/v1/chat/completions',
    cohere: 'https://api.cohere.ai/v1/generate'
};

// Search endpoint
app.post('/api/search', async (req, res) => {
    try {
        const { query, provider, apiKey } = req.body;
        
        if (!query || !provider || !apiKey) {
            return res.status(400).json({ 
                error: 'Missing required parameters: query, provider, or apiKey' 
            });
        }

        let url, options;

        switch (provider) {
            case 'serpapi':
                url = `${API_ENDPOINTS.serpapi}?engine=google&q=${encodeURIComponent(query)}&api_key=${apiKey}`;
                options = { method: 'GET' };
                break;
                
            case 'brave':
                url = `${API_ENDPOINTS.brave}?q=${encodeURIComponent(query)}&count=10`;
                options = {
                    method: 'GET',
                    headers: {
                        'X-Subscription-Token': apiKey,
                        'Accept': 'application/json'
                    }
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
                        num: 10
                    })
                };
                break;
                
            default:
                return res.status(400).json({ error: 'Invalid search provider' });
        }

        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ 
                error: `Search API error: ${response.status} - ${errorText}` 
            });
        }

        const data = await response.json();
        const parsedResults = parseSearchResults(data, provider);
        
        res.json({ 
            success: true, 
            results: parsedResults,
            query: query
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ 
            error: 'Internal server error: ' + error.message 
        });
    }
});

// AI generation endpoint
app.post('/api/ai-generate', async (req, res) => {
    try {
        const { query, searchResults, provider, apiKey } = req.body;
        
        if (!query || !provider || !apiKey) {
            return res.status(400).json({ 
                error: 'Missing required parameters: query, provider, or apiKey' 
            });
        }

        const context = searchResults?.map(result => 
            `Title: ${result.title}\nURL: ${result.url}\nSnippet: ${result.snippet}`
        ).join('\n\n') || '';

        const prompt = `Based on the following search results, provide a comprehensive and accurate answer to the query: "${query}"

Search Results:
${context}

Please provide a detailed, informative response that synthesizes information from these sources. Be factual and cite relevant information where appropriate. Keep the response under 300 words.`;

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
                            { role: 'user', content: prompt }
                        ],
                        max_tokens: 400,
                        temperature: 0.7
                    })
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
                            { role: 'user', content: prompt }
                        ],
                        max_tokens: 400,
                        temperature: 0.7
                    })
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
                        max_tokens: 400,
                        temperature: 0.7
                    })
                };
                break;
                
            default:
                return res.status(400).json({ error: 'Invalid AI provider' });
        }

        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ 
                error: `AI API error: ${response.status} - ${errorText}` 
            });
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
            default:
                aiResponse = 'Unable to generate AI response';
        }

        res.json({ 
            success: true, 
            response: aiResponse.trim()
        });

    } catch (error) {
        console.error('AI generation error:', error);
        res.status(500).json({ 
            error: 'Internal server error: ' + error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
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

    return results.slice(0, 8); // Limit to 8 results
}

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    res.status(500).json({ 
        error: 'Something went wrong on the server' 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Frontend available at: http://localhost:${PORT}`);
    console.log(`🔗 API endpoints available at: http://localhost:${PORT}/api/`);
});

module.exports = app;