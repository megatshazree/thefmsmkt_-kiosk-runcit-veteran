import { 
  collection, 
  doc, 
  onSnapshot, 
  updateDoc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface InventoryItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  barcode?: string;
  image?: string;
  lastUpdated: Date;
}

export interface Transaction {
  id: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  timestamp: Date;
  paymentMethod: string;
  kioskId: string;
}

class FirestoreService {
  // Inventory Management
  subscribeToInventory(callback: (inventory: InventoryItem[]) => void) {
    return onSnapshot(
      query(collection(db, 'inventory'), orderBy('name')), 
      (snapshot) => {
        const inventory = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastUpdated: doc.data().lastUpdated?.toDate() || new Date()
        })) as InventoryItem[];
        callback(inventory);
      },
      (error) => {
        console.error('Inventory subscription error:', error);
        callback([]);
      }
    );
  }

  async updateInventoryItem(itemId: string, updates: Partial<InventoryItem>) {
    try {
      const itemRef = doc(db, 'inventory', itemId);
      await updateDoc(itemRef, {
        ...updates,
        lastUpdated: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    }
  }

  async addInventoryItem(item: Omit<InventoryItem, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, 'inventory'), {
        ...item,
        lastUpdated: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding inventory item:', error);
      throw error;
    }
  }

  async deleteInventoryItem(itemId: string) {
    try {
      await deleteDoc(doc(db, 'inventory', itemId));
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      throw error;
    }
  }

  // Transaction Management
  async recordTransaction(transaction: Omit<Transaction, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, 'transactions'), {
        ...transaction,
        timestamp: Timestamp.now()
      });
      
      // Update inventory quantities
      for (const item of transaction.items) {
        await this.updateInventoryQuantity(item.id, -item.quantity);
      }
      
      return docRef.id;
    } catch (error) {
      console.error('Error recording transaction:', error);
      throw error;
    }
  }

  subscribeToTransactions(callback: (transactions: Transaction[]) => void, limit = 50) {
    return onSnapshot(
      query(
        collection(db, 'transactions'), 
        orderBy('timestamp', 'desc')
      ), 
      (snapshot) => {
        const transactions = snapshot.docs.slice(0, limit).map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        })) as Transaction[];
        callback(transactions);
      }
    );
  }

  private async updateInventoryQuantity(itemId: string, quantityChange: number) {
    try {
      const itemRef = doc(db, 'inventory', itemId);
      const itemDoc = await getDocs(query(collection(db, 'inventory'), where('__name__', '==', itemId)));
      
      if (!itemDoc.empty) {
        const currentQuantity = itemDoc.docs[0].data().quantity || 0;
        await updateDoc(itemRef, {
          quantity: Math.max(0, currentQuantity + quantityChange),
          lastUpdated: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('Error updating inventory quantity:', error);
    }
  }

  // Analytics
  async getAnalytics(startDate: Date, endDate: Date) {
    try {
      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        where('timestamp', '<=', Timestamp.fromDate(endDate)),
        orderBy('timestamp', 'desc')
      );
      
      const snapshot = await getDocs(transactionsQuery);
      const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      })) as Transaction[];
      
      return {
        totalSales: transactions.reduce((sum, t) => sum + t.total, 0),
        totalTransactions: transactions.length,
        averageTransaction: transactions.length > 0 ? 
          transactions.reduce((sum, t) => sum + t.total, 0) / transactions.length : 0,
        topItems: this.calculateTopItems(transactions)
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      return {
        totalSales: 0,
        totalTransactions: 0,
        averageTransaction: 0,
        topItems: []
      };
    }
  }

  private calculateTopItems(transactions: Transaction[]) {
    const itemCounts: { [key: string]: { name: string; count: number; revenue: number } } = {};
    
    transactions.forEach(transaction => {
      transaction.items.forEach(item => {
        if (!itemCounts[item.id]) {
          itemCounts[item.id] = { name: item.name, count: 0, revenue: 0 };
        }
        itemCounts[item.id].count += item.quantity;
        itemCounts[item.id].revenue += item.price * item.quantity;
      });
    });
    
    return Object.entries(itemCounts)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}

export const firestoreService = new FirestoreService();