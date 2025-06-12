import { useState, useEffect, useRef } from 'react';

interface BoundingBox {
  id: number;
  x: number;
  y: number;
  inlineSize: number;
  height: number;
  label: string;
  confidence: number;
}

export const useObjectDetection = (
  isScanning: boolean,
  isCameraActive: boolean,
  videoRef: React.RefObject<HTMLVideoElement>
) => {
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
  const detectionIntervalRef = useRef<number | null>(null);

  const simulateObjectDetection = () => {
    if (!videoRef.current) return;
    
    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;
    
    if (videoWidth === 0 || videoHeight === 0) return;
    
    // Generate 1-3 random bounding boxes
    const numBoxes = Math.floor(Math.random() * 3) + 1;
    const newBoxes: BoundingBox[] = [];
    
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
    
    setBoundingBoxes(newBoxes);
  };

  useEffect(() => {
    if (isScanning && isCameraActive) {
      detectionIntervalRef.current = window.setInterval(() => {
        simulateObjectDetection();
      }, 2000);
    } else {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      setBoundingBoxes([]);
    }

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [isScanning, isCameraActive]);

  return { boundingBoxes };
};