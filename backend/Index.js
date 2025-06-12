const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoints
app.get('/', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    message: 'Kiosk API is running',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
});

// Vision AI endpoint (mock for now)
app.post('/api/vision/detect', async (req, res) => {
  try {
    console.log('Vision detection request received');
    
    // Mock response that matches the frontend expectations
    const mockObjects = [
      {
        name: 'Bottle',
        score: 0.95,
        boundingPoly: {
          normalizedVertices: [
            { x: 0.1, y: 0.1 },
            { x: 0.4, y: 0.1 },
            { x: 0.4, y: 0.7 },
            { x: 0.1, y: 0.7 }
          ]
        }
      },
      {
        name: 'Food',
        score: 0.87,
        boundingPoly: {
          normalizedVertices: [
            { x: 0.5, y: 0.2 },
            { x: 0.8, y: 0.2 },
            { x: 0.8, y: 0.6 },
            { x: 0.5, y: 0.6 }
          ]
        }
      }
    ];
    
    res.json({
      objects: mockObjects
    });
  } catch (error) {
    console.error('Vision API error:', error);
    res.status(500).json({ error: 'Vision detection failed' });
  }
});

// Monitoring/logging endpoint
app.post('/api/monitoring/log', async (req, res) => {
  try {
    console.log('Log entry received:', {
      timestamp: new Date().toISOString(),
      data: req.body
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Logging error:', error);
    res.status(500).json({ error: 'Logging failed' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Kiosk API server running on port ${port}`);
  console.log(`📍 Health check: http://localhost:${port}/health`);
});
