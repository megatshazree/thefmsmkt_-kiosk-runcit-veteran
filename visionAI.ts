interface DetectedObject {
  id: number;
  x: number;
  y: number;
  inlineSize: number;
  height: number;
  label: string;
  confidence: number;
}

class VisionAIService {
  private apiEndpoint: string;
  
  constructor() {
    this.apiEndpoint = '/api/vision/detect'; // Will be handled by Cloud Run backend
  }

  async detectObjects(imageData: string, videoWidth: number, videoHeight: number): Promise<DetectedObject[]> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
          width: videoWidth,
          height: videoHeight
        })
      });

      if (!response.ok) {
        throw new Error(`Vision API error: ${response.statusText}`);
      }

      const result = await response.json();
      return this.formatDetections(result.objects, videoWidth, videoHeight);
    } catch (error) {
      console.error('Vision AI detection error:', error);
      // Fallback to simulated detection
      return this.simulateDetection(videoWidth, videoHeight);
    }
  }

  private formatDetections(objects: any[], videoWidth: number, videoHeight: number): DetectedObject[] {
    return objects.map((object, index) => ({
      id: Date.now() + index,
      label: this.mapLabelToProduct(object.name || 'Unknown'),
      confidence: object.score || 0,
      x: Math.round((object.boundingPoly?.normalizedVertices?.[0]?.x || 0) * videoWidth),
      y: Math.round((object.boundingPoly?.normalizedVertices?.[0]?.y || 0) * videoHeight),
      inlineSize: Math.round(((object.boundingPoly?.normalizedVertices?.[2]?.x || 0) - (object.boundingPoly?.normalizedVertices?.[0]?.x || 0)) * videoWidth),
      height: Math.round(((object.boundingPoly?.normalizedVertices?.[2]?.y || 0) - (object.boundingPoly?.normalizedVertices?.[0]?.y || 0)) * videoHeight),
    }));
  }

  private mapLabelToProduct(label: string): string {
    const productMap: { [key: string]: string } = {
      'Bottle': 'Drink',
      'Food': 'Snack',
      'Fruit': 'Fruit',
      'Vegetable': 'Vegetable',
      'Package': 'Packaged Item',
      'Container': 'Canned Item',
      'Box': 'Boxed Item'
    };
    
    return productMap[label] || label;
  }

  private simulateDetection(videoWidth: number, videoHeight: number): DetectedObject[] {
    const numBoxes = Math.floor(Math.random() * 3) + 1;
    const newBoxes: DetectedObject[] = [];
    const possibleLabels = ['Snack', 'Drink', 'Fruit', 'Vegetable', 'Bread', 'Canned Item'];
    
    for (let i = 0; i < numBoxes; i++) {
      const inlineSize = Math.floor(Math.random() * (videoWidth / 3)) + 50;
      const height = Math.floor(Math.random() * (videoHeight / 3)) + 50;
      const x = Math.floor(Math.random() * (videoWidth - inlineSize));
      const y = Math.floor(Math.random() * (videoHeight - height));
      
      newBoxes.push({
        id: Date.now() + i,
        x,
        y,
        inlineSize,
        height,
        label: possibleLabels[Math.floor(Math.random() * possibleLabels.length)],
        confidence: Math.random() * 0.3 + 0.7
      });
    }
    
    return newBoxes;
  }

  captureFrame(video: HTMLVideoElement): string {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8).split(',')[1]; // Remove data:image/jpeg;base64, prefix
  }
}

export const visionAI = new VisionAIService();