
import React from 'react'; // Added for React.ReactElement

export interface Product {
  id: number;
  name: string;
  price: number; // For items sold by unit, this is the unit price. For weight-based, this might be unused if pricePerUnit is set.
  category: string;
  image: string; // Emoji, URL, or data:image/...;base64,... string from Imagen
  stock: number;
  sku?: string; // Optional SKU

  // Vision AI Checkout related fields
  isVisuallyAmbiguous?: boolean;
  similarProductIds?: number[]; // IDs of products that look similar
  requiresScale?: boolean; // True if item needs to be weighed
  pricePerUnit?: number;   // e.g., price per kg or per 100g
  unitName?: string;       // e.g., 'kg', 'g', 'item'
  requiresAgeVerification?: boolean; // For items needing age check
  simulatedVisionLabels?: string[]; // Mock labels detected by Vision AI

  // Inventory Monitoring related fields
  reorderLevel?: number;
  shelfLocationId?: string; // e.g., "SHELF-A1"
  currentShelfLocationId?: string; // e.g., "SHELF-B3" if misplaced

  // Vision AI Stock In related fields
  hasExpiryDate?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  // For scaled items, price here would be the final calculated price.
  // The original product.price might be price/kg.
  weight?: number; // Optional: store weight for scaled items
  itemDiscount?: number; // Optional: Discount applied specifically to this item
  itemDiscountType?: 'percentage' | 'fixed'; // Type of item-level discount
}

// Specific type for items recognized by Vision AI Checkout, before final cart addition
export interface RecognizedItem extends Product {
  quantity: number;
  weight?: number; // Weight in unitName units (e.g., kg)
  calculatedPrice?: number; // Final price for this item, especially if weight-based
  isBagged?: boolean; // For advanced self-checkout bagging confirmation
}


export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  // Future fields for more detailed E-Invoice:
  // tin?: string;
  // address?: string;
  // businessRegistrationNumber?: string;
}

export interface EmployeePermission {
  fullAccess: boolean;
  manualDiscount: boolean;
  processRefund: boolean;
}

export interface Employee {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  pin: string;
  startDate: string;
  status: 'Aktif' | 'Tidak Aktif';
  permissions: EmployeePermission;
}

export type Language = 'ms' | 'en';

export interface TranslationStrings {
  [key: string]: string | { [nestedKey: string]: string };
}

export interface AllTranslations {
  ms: TranslationStrings;
  en: TranslationStrings;
}

export interface KioskMenuItem {
  id: string;
  translationKey: string; // e.g. "nav_pos" which maps to "kiosk_card_pos"
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  color: string;
  path: string;
  children?: KioskMenuItem[]; // For sub-menus
}

export interface PaymentMethod {
  key: string;
  labelKey: string;
}

export enum ReportTimeRange {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly'
}

export interface SalesDataPoint { // Primarily for generic time-series sales
    name: string; // typically date or general category name (if not using specific categoryKey)
    sales: number;
}

export interface CategorySalesDataPoint {
    categoryKey: string; // translation key like 'pos_cat_food'
    sales: number;
}

export interface TopSellingProductDataPoint {
    productId: number;
    productName: string; // Direct name, translation handled if source is i18n
    quantitySold: number;
    totalRevenue: number;
}

export interface SalesByEmployeeDataPoint {
    employeeId: string; // Could be Emp ID
    employeeName: string; // Direct name
    totalSales: number;
    transactions: number;
}

export interface PaymentMethodDataPoint {
    methodKey: string; // translation key e.g., 'payment_method_cash'
    totalAmount: number;
    transactionCount: number;
}


export interface GeminiResponse<T> {
  data: T | null;
  error: string | null;
}

// --- Vision AI Stock In Types ---
export interface PurchaseOrderItem {
  productId: number;
  productName: string; // For easy display, could be fetched/mapped
  expectedQuantity: number;
}

export interface PurchaseOrder {
  id: string; // e.g., PO-2024-001
  poNumber: string;
  orderDate: string; // ISO date string
  supplierName: string;
  items: PurchaseOrderItem[];
  status: 'Pending' | 'Partially Received' | 'Received' | 'Cancelled';
}

export interface StockInScanResult {
  productId: number;
  productName: string;
  sku?: string;
  expectedQuantity: number;
  scannedQuantity: number;
  discrepancy: number;
  simulatedExpiryDate?: string; // ISO date string or 'N/A' or 'Capture Failed'
  status: 'OK' | 'Under Quantity' | 'Over Quantity' | 'Unexpected Item' | 'Expiry Capture Failed' | 'OK with Expiry' | 'Pending Scan';
}

// --- Vision AI Customer Analytics Types ---
export interface AnonymizedCustomerAnalytics {
  ageGroup?: 'Child' | 'Teenager' | 'Young Adult' | 'Adult' | 'Senior';
  gender?: 'Male' | 'Female' | 'Other' | 'Unknown';
  sentiment?: 'Positive' | 'Neutral' | 'Negative' | 'Unknown';
}


// --- Inventory Monitoring Types ---
export interface ShelfConfig {
  id: string; // e.g., "SHELF-A"
  name: string; // e.g., "Aisle 1 - Snacks"
  rows: number;
  columns: number;
  productSlots?: { // Optional: pre-assign products to specific slots on a shelf for more detailed display
    productId: number;
    row: number; // 0-indexed
    col: number; // 0-indexed
  }[];
}

export interface ShelfDisplayConfig {
  layoutName: string;
  shelves: ShelfConfig[];
}

// --- E-Invoice Types (LHDN Simulation) ---
export interface SupplierInfo {
  tin: string;
  name: string;
  address: string;
  businessRegistrationNumber: string;
  sstNumber?: string; // Optional
  msicCode?: string; // Optional
  email?: string;
  phone?: string;
}

export interface BuyerInfo {
  tin?: string; // Optional for B2C, required for B2B
  name?: string; // Optional for B2C
  address?: string; // Optional for B2C
  email?: string; // For sending invoice
  phone?: string; // For sending invoice
  identificationType?: string; // e.g., BRN, NRIC, Passport
  identificationNumber?: string;
}

export interface EInvoiceLineItem {
  classificationCode?: string; // Optional: From LHDN's list e.g., "01010101" for specific goods
  description: string;
  quantity: number;
  unitPrice: number; // Price before tax
  totalPrice: number; // quantity * unitPrice
  taxType: string; // e.g., "SST"
  taxRate: number; // e.g., 0.06 for 6%
  taxAmount: number; // Tax for this line item
  discountAmount?: number; // Optional discount for this line item
  amountExcludingTax: number; // totalPrice - discountAmount
  amountIncludingTax: number; // amountExcludingTax + taxAmount
}

export interface EInvoiceDetails {
  invoiceId: string; // Unique Invoice Number (e.g., from MyInvois or simulated)
  dateTimeStamp: string; // Submission DateTime in ISO 8601
  validationDateTimeStamp?: string; // Validation DateTime from MyInvois (ISO 8601)
  supplier: SupplierInfo;
  buyer: BuyerInfo;
  lineItems: EInvoiceLineItem[];
  subTotal: number; // Sum of all lineItems' totalPrice (before overall invoice discount)
  discountAmount: number; // Overall invoice discount
  taxableAmount: number; // subTotal - discountAmount
  totalTaxAmount: number; // Sum of all lineItems' taxAmount
  totalAmountIncludingTax: number; // taxableAmount + totalTaxAmount (grand total)
  paymentMode?: string; // e.g., Cash, Credit Card, Ewallet
  currencyCode: string; // e.g., "MYR"
  irbmUniqueId?: string; // Unique ID from MyInvois after validation
  validationUrl?: string; // URL to validate invoice on MyInvois portal
  qrCodeData?: string; // Data to be encoded into the QR code
  notes?: string;
}

// --- Product Set Types ---
export interface ProductSet {
  id: string;
  name: string;
  productIds: number[];
  image?: string; // Optional: emoji or URL or data:image URI
  // Potential future fields:
  // description?: string;
  // specialPrice?: number; // If the set has a specific discounted price
}

// --- Settings Page Types ---
export interface SelectOption {
  value: string;
  label: string;
}

export interface Integration {
  name: string;
  iconKey: string; // Changed from icon: string
  status: string;
  bgColorClass: string;
  textColorClass: string;
  iconBrand?: 'fab' | 'fas';
}

// --- POS Specific Types ---
export interface HeldOrder {
  id: string; // Unique ID for the held order (e.g., timestamp or simple counter)
  timestamp: Date;
  items: CartItem[];
  itemCount: number;
  totalAmount: number; // Grand total of the held order
  customer?: Customer | null; // Optional customer associated with held order
}
