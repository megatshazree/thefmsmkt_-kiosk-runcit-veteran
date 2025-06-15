import express from 'express';
import cors from 'cors';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { Logging } from '@google-cloud/logging';
import { MetricServiceClient } from '@google-cloud/monitoring';

const app = express();
const port = process.env.PORT || 8080;

// Initialize Google Cloud clients
const visionClient = new ImageAnnotatorClient();
const logging = new Logging();
const monitoring = new MetricServiceClient();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Vision AI endpoint
app.post('/api/vision/detect', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image data required' });
    }
    // Accept base64 string, decode to Buffer
    const [result] = await visionClient.objectLocalization({
      image: { content: Buffer.from(image, 'base64') }
    });
    const objects = result.localizedObjectAnnotations || [];
    res.json({
      objects: objects.map(obj => ({
        name: obj.name || 'Unknown',
        score: obj.score || 0,
        boundingPoly: obj.boundingPoly
      }))
    });
  } catch (error) {
    console.error('Vision API error:', error);
    res.status(500).json({
      error: 'Vision detection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Logging endpoint
app.post('/api/monitoring/log', async (req, res) => {
  try {
    const { event, data, timestamp, kioskId, userId } = req.body;
    const log = logging.log('kiosk-events');
    const metadata = {
      resource: { type: 'cloud_run_revision' },
      severity: 'INFO',
    };
    const entry = log.entry(metadata, {
      event,
      data,
      timestamp,
      kioskId,
      userId
    });
    await log.write(entry);
    res.json({ success: true });
  } catch (error) {
    console.error('Logging error:', error);
    res.status(500).json({
      error: 'Logging failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(port, () => {
  console.log(`Kiosk API server running on port ${port}`);
});
  console.log(`Kiosk API server running on port ${port}`);
});
