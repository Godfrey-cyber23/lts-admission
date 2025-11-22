import express from 'express';
import axios from 'axios';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// Rate limiting
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per minute
  message: {
    error: 'Too many AI requests, please try again later.'
  }
});

// Validate API key on startup
if (!OPENROUTER_API_KEY) {
  console.warn('⚠️  OPENROUTER_API_KEY not found in environment variables');
} else {
  console.log('✅ OpenRouter API key loaded');
}

// System prompt for educational assistant
const SYSTEM_PROMPT = `You are a helpful educational assistant for Literacy Tree School in Zambia. You help students, parents, and teachers find educational resources for primary school (Grades 1-7). 

Key guidelines:
- Be friendly, encouraging, and provide age-appropriate responses
- Focus on reading, math, science, and other primary school subjects
- Keep responses concise but informative (2-3 paragraphs maximum)
- Suggest specific resources from our library when relevant
- For math help, provide step-by-step explanations
- For reading help, suggest appropriate books and activities
- Always maintain a positive and supportive tone

School context:
- Location: Lusaka, Zambia
- Grades: 1-7 (ages 6-13)
- Curriculum: Zambian primary curriculum
- Resources: Storybooks, worksheets, videos, parent guides`;

// Main AI chat endpoint
router.post('/chat', aiLimiter, async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    // Validate request
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a string'
      });
    }

    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'AI service is not configured. Please contact the administrator.'
      });
    }

    console.log('Processing AI request:', { 
      messageLength: message.length,
      historyLength: conversationHistory.length 
    });

    // Prepare messages for the API
    const messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      },
      ...conversationHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Call OpenRouter API
    const response = await axios.post(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: 'deepseek/deepseek-chat',
        messages: messages,
        max_tokens: 800,
        temperature: 0.7,
        top_p: 0.9,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': req.headers.origin || 'https://literacytree.edu.zm',
          'X-Title': 'Literacy Tree School AI Assistant'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    const aiResponse = response.data.choices[0].message.content;

    // Log successful request (without sensitive data)
    console.log('AI request processed successfully');

    res.json({
      success: true,
      response: aiResponse,
      usage: response.data.usage
    });

  } catch (error) {
    console.error('AI API Error:', error.response?.data || error.message);

    // Handle different types of errors
    if (error.response?.status === 401) {
      return res.status(500).json({
        success: false,
        error: 'AI service authentication failed. Please contact support.'
      });
    } else if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        error: 'AI service is busy. Please try again in a moment.'
      });
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({
        success: false,
        error: 'AI service is temporarily unavailable. Please try again later.'
      });
    } else if (error.response?.status >= 500) {
      return res.status(503).json({
        success: false,
        error: 'AI service is experiencing issues. Please try again later.'
      });
    } else if (error.message.includes('timeout')) {
      return res.status(503).json({
        success: false,
        error: 'AI service timeout. Please try again.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to get response from AI assistant. Please try again.'
    });
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    if (!OPENROUTER_API_KEY) {
      return res.json({
        status: 'unconfigured',
        message: 'OpenRouter API key not configured'
      });
    }

    // Test the API with a simple request
    const response = await axios.post(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: 'deepseek/deepseek-chat',
        messages: [{ role: 'user', content: 'Say "OK" if you are working.' }],
        max_tokens: 10,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    res.json({
      status: 'healthy',
      model: 'deepseek/deepseek-chat',
      response_time: response.duration
    });
  } catch (error) {
    console.error('Health check failed:', error.message);
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Test endpoint to verify route is working
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'AI Assistant API is working!',
    timestamp: new Date().toISOString()
  });
});

export default router;