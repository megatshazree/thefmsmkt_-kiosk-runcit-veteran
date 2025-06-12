interface KioskEvent {
  event: string;
  data: any;
  timestamp: string;
  kioskId: string;
  userId?: string;
}

interface MetricData {
  metricType: string;
  value: number;
  labels?: { [key: string]: string };
}

class MonitoringService {
  private kioskId: string;
  private apiEndpoint: string;

  constructor() {
    this.kioskId = this.generateKioskId();
    this.apiEndpoint = '/api/monitoring'; // Will be handled by Cloud Run backend
  }

  private generateKioskId(): string {
    return `kiosk-${Math.random().toString(36).substr(2, 9)}`;
  }

  async logEvent(event: string, data: any, userId?: string) {
    try {
      const eventData: KioskEvent = {
        event,
        data,
        timestamp: new Date().toISOString(),
        kioskId: this.kioskId,
        userId
      };

      // Send to backend for Cloud Logging
      await fetch(`${this.apiEndpoint}/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      });

      // Also log locally for debugging
      console.log(`[${event}]`, data);
    } catch (error) {
      console.error('Error logging event:', error);
    }
  }

  async recordMetric(metricType: string, value: number, labels?: { [key: string]: string }) {
    try {
      const metricData: MetricData = {
        metricType,
        value,
        labels: {
          ...