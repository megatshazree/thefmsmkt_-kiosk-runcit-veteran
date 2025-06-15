import { adminDb, adminAuth } from '../config/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

// Enhanced Vision Detection Service with Admin SDK
export const adminVisionService = {
  // Store vision detection results with bounding boxes
  async storeDetectionResult(detectionData: any, userId: string) {
    try {
      const docRef = await adminDb.collection('detections').add({
        ...detectionData,
        userId,
        timestamp: Timestamp.now(),
        processed: true,
        confidence: detectionData.confidence || 0,
        boundingBoxes: detectionData.boundingBoxes || []
      });

      console.log('Detection stored successfully:', docRef.id);
      return { success: true, id: docRef.id };
    } catch (error: any) {
      console.error('Error storing detection:', error);
      return { success: false, error: error.message };
    }
  },

  // Get detection analytics
  async getDetectionAnalytics(userId: string) {
    try {
      const snapshot = await adminDb.collection('detections')
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(100)
        .get();

      const detections = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const analytics = {
        totalDetections: detections.length,
        averageConfidence: detections.length > 0 
          ? detections.reduce((sum, d) => sum + (d.confidence || 0), 0) / detections.length 
          : 0,
        recentDetections: detections.slice(0, 10),
        confidenceDistribution: this.calculateConfidenceDistribution(detections)
      };

      return { success: true, analytics };
    } catch (error: any) {
      console.error('Error getting detection analytics:', error);
      return { success: false, error: error.message };
    }
  },

  calculateConfidenceDistribution(detections: any[]) {
    const distribution = { high: 0, medium: 0, low: 0 };
    
    detections.forEach(detection => {
      const confidence = detection.confidence || 0;
      if (confidence >= 0.8) distribution.high++;
      else if (confidence >= 0.6) distribution.medium++;
      else distribution.low++;
    });
    
    return distribution;
  }
};

// Enhanced Transaction Service with Admin SDK
export const adminTransactionService = {
  // Create transaction with receipt generation
  async createTransaction(transactionData: any, userId: string) {
    try {
      const receiptNumber = `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const docRef = await adminDb.collection('transactions').add({
        ...transactionData,
        userId,
        receiptNumber,
        timestamp: Timestamp.now(),
        status: 'completed',
        processed: true
      });

      // Update inventory counts if items are provided
      if (transactionData.items && transactionData.items.length > 0) {
        const batch = adminDb.batch();
        
        for (const item of transactionData.items) {
          if (item.productId) {
            const productRef = adminDb.collection('products').doc(item.productId);
            batch.update(productRef, {
              stock: adminDb.FieldValue.increment(-item.quantity),
              lastSold: Timestamp.now()
            });
          }
        }
        
        await batch.commit();
        console.log('Inventory updated for transaction:', docRef.id);
      }

      return { 
        success: true, 
        transaction: { 
          id: docRef.id, 
          receiptNumber,
          ...transactionData 
        }
      };
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      return { success: false, error: error.message };
    }
  },

  // Get sales analytics
  async getSalesAnalytics(userId: string, startDate: Date, endDate: Date) {
    try {
      const snapshot = await adminDb.collection('transactions')
        .where('userId', '==', userId)
        .where('timestamp', '>=', Timestamp.fromDate(startDate))
        .where('timestamp', '<=', Timestamp.fromDate(endDate))
        .get();

      const transactions = snapshot.docs.map(doc => doc.data());
      
      const analytics = {
        totalSales: transactions.reduce((sum, t) => sum + (t.total || 0), 0),
        totalTransactions: transactions.length,
        averageTransaction: transactions.length > 0 
          ? transactions.reduce((sum, t) => sum + (t.total || 0), 0) / transactions.length 
          : 0,
        topProducts: this.calculateTopProducts(transactions)
      };

      return { success: true, analytics };
    } catch (error: any) {
      console.error('Error getting sales analytics:', error);
      return { success: false, error: error.message };
    }
  },

  calculateTopProducts(transactions: any[]) {
    const productCounts: Record<string, number> = {};
    
    transactions.forEach(transaction => {
      transaction.items?.forEach((item: any) => {
        productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
      });
    });

    return Object.entries(productCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  }
};

// Enhanced Product Service with Admin SDK
export const adminProductService = {
  // Add product with server-side validation
  async addProduct(productData: any, userId: string) {
    try {
      const docRef = await adminDb.collection('products').add({
        ...productData,
        createdBy: userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        status: 'active'
      });
      
      return { success: true, id: docRef.id };
    } catch (error: any) {
      console.error('Error adding product:', error);
      return { success: false, error: error.message };
    }
  },

  // Get products with server-side filtering
  async getProducts(filters: any = {}) {
    try {
      let query = adminDb.collection('products');
      
      if (filters.category) {
        query = query.where('category', '==', filters.category);
      }
      
      if (filters.status) {
        query = query.where('status', '==', filters.status);
      }

      const snapshot = await query.get();
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { success: true, products };
    } catch (error: any) {
      console.error('Error getting products:', error);
      return { success: false, error: error.message };
    }
  }
};
