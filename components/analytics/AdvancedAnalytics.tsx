import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { 
  TrendingUpIcon, UsersIcon, ChartBarIcon, LightBulbIcon,
  ExclamationTriangleIcon, CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { useToastStore } from '../../store/toastStore';
import { useTransactionStore } from '../../store/transactionStore';
import { useProductStore } from '../../store/productStore';
import { useCustomerStore } from '../../store/customerStore';
import KioskButton from '../common/KioskButton';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  generateSalesForecast,
  analyzeCustomerSegments,
  generateInventoryOptimizations,
  generateBusinessInsights
} from '../../services/geminiService';
import { ForecastData, CustomerSegment, InventoryOptimization, BusinessInsight } from '../../types';

const AdvancedAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'forecast' | 'segments' | 'optimization' | 'insights'>('forecast');
  const [isLoading, setIsLoading] = useState(false);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [customerSegments, setCustomerSegments] = useState<CustomerSegment[]>([]);
  const [inventoryOptimizations, setInventoryOptimizations] = useState<InventoryOptimization[]>([]);
  const [businessInsights, setBusinessInsights] = useState<BusinessInsight[]>([]);

  const { showToast } = useToastStore();
  const { transactions } = useTransactionStore();
  const { products } = useProductStore();
  const { customers } = useCustomerStore();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadSalesForecast(),
        loadCustomerSegments(),
        loadInventoryOptimizations(),
        loadBusinessInsights()
      ]);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      showToast('Failed to load analytics data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSalesForecast = async () => {
    try {
      const historicalData = JSON.stringify(
        transactions.slice(-30).map(t => ({
          date: new Date(t.timestamp).toISOString().split('T')[0],
          amount: t.total
        }))
      );

      const response = await generateSalesForecast(historicalData, 14);
      if (response.data) {
        setForecastData(response.data);
      }
    } catch (error) {
      console.error('Error loading sales forecast:', error);
    }
  };

  const loadCustomerSegments = async () => {
    try {
      const customerData = JSON.stringify(
        customers.map(c => ({
          id: c.id,
          totalSpent: transactions
            .filter(t => t.customerId === c.id)
            .reduce((sum, t) => sum + t.total, 0),
          transactionCount: transactions.filter(t => t.customerId === c.id).length,
          lastPurchase: transactions
            .filter(t => t.customerId === c.id)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]?.timestamp
        }))
      );

      const response = await analyzeCustomerSegments(customerData);
      if (response.data) {
        const segmentsWithColors = response.data.map((segment, index) => ({
          ...segment,
          color: COLORS[index % COLORS.length]
        }));
        setCustomerSegments(segmentsWithColors);
      }
    } catch (error) {
      console.error('Error loading customer segments:', error);
    }
  };

  const loadInventoryOptimizations = async () => {
    try {
      const inventoryData = JSON.stringify(
        products.map(p => ({
          id: p.id,
          name: p.name,
          currentStock: p.stock,
          price: p.price,
          category: p.category,
          salesVelocity: transactions
            .flatMap(t => t.items)
            .filter(item => item.productId === p.id)
            .reduce((sum, item) => sum + item.quantity, 0)
        }))
      );

      const response = await generateInventoryOptimizations(inventoryData);
      if (response.data) {
        setInventoryOptimizations(response.data);
      }
    } catch (error) {
      console.error('Error loading inventory optimizations:', error);
    }
  };

  const loadBusinessInsights = async () => {
    try {
      const businessData = JSON.stringify({
        totalTransactions: transactions.length,
        totalRevenue: transactions.reduce((sum, t) => sum + t.total, 0),
        averageTransactionValue: transactions.length > 0 
          ? transactions.reduce((sum, t) => sum + t.total, 0) / transactions.length 
          : 0,
        topProducts: products
          .map(p => ({
            ...p,
            salesCount: transactions
              .flatMap(t => t.items)
              .filter(item => item.productId === p.id)
              .reduce((sum, item) => sum + item.quantity, 0)
          }))
          .sort((a, b) => b.salesCount - a.salesCount)
          .slice(0, 5),
        customerCount: customers.length,
        productCount: products.length
      });

      const response = await generateBusinessInsights(businessData);
      if (response.data) {
        setBusinessInsights(response.data);
      }
    } catch (error) {
      console.error('Error loading business insights:', error);
    }
  };

  const renderForecastTab = () => (
    <div className="space-y-6">
      <div className="bg-[var(--theme-panel-bg)] p-6 rounded-lg border border-[var(--theme-border-color)]">
        <h3 className="text-lg font-semibold text-[var(--theme-text-primary)] mb-4">
          14-Day Sales Forecast
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border-color)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--theme-text-muted)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--theme-text-muted)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--theme-panel-bg)',
                  border: '1px solid var(--theme-border-color)',
                  borderRadius: '8px',
                  color: 'var(--theme-text-primary)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="var(--theme-accent-cyan)" 
                strokeWidth={2}
                name="Predicted Sales"
              />
              <Line 
                type="monotone" 
                dataKey="confidence" 
                stroke="var(--theme-accent-orange)" 
                strokeWidth={1}
                strokeDasharray="5 5"
                name="Confidence %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--theme-panel-bg)] p-4 rounded-lg border border-[var(--theme-border-color)]">
          <div className="flex items-center">
            <TrendingUpIcon className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-[var(--theme-text-muted)]">Avg. Daily Forecast</p>
              <p className="text-2xl font-bold text-[var(--theme-text-primary)]">
                RM {forecastData.length > 0 
                  ? (forecastData.reduce((sum, d) => sum + d.predicted, 0) / forecastData.length).toFixed(2)
                  : '0.00'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--theme-panel-bg)] p-4 rounded-lg border border-[var(--theme-border-color)]">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-[var(--theme-text-muted)]">Avg. Confidence</p>
              <p className="text-2xl font-bold text-[var(--theme-text-primary)]">
                {forecastData.length > 0 
                  ? Math.round(forecastData.reduce((sum, d) => sum + d.confidence, 0) / forecastData.length)
                  : 0
                }%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--theme-panel-bg)] p-4 rounded-lg border border-[var(--theme-border-color)]">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm text-[var(--theme-text-muted)]">14-Day Total</p>
              <p className="text-2xl font-bold text-[var(--theme-text-primary)]">
                RM {forecastData.reduce((sum, d) => sum + d.predicted, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSegmentsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--theme-panel-bg)] p-6 rounded-lg border border-[var(--theme-border-color)]">
          <h3 className="text-lg font-semibold text-[var(--theme-text-primary)] mb-4">
            Customer Segments Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerSegments}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, count }) => `${name}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {customerSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--theme-panel-bg)',
                    border: '1px solid var(--theme-border-color)',
                    borderRadius: '8px',
                    color: 'var(--theme-text-primary)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--theme-panel-bg)] p-6 rounded-lg border border-[var(--theme-border-color)]">
          <h3 className="text-lg font-semibold text-[var(--theme-text-primary)] mb-4">
            Segment Value Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerSegments}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border-color)" />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--theme-text-muted)"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="var(--theme-text-muted)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--theme-panel-bg)',
                    border: '1px solid var(--theme-border-color)',
                    borderRadius: '8px',
                    color: 'var(--theme-text-primary)'
                  }}
                />
                <Bar dataKey="value" fill="var(--theme-accent-cyan)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-[var(--theme-panel-bg)] rounded-lg border border-[var(--theme-border-color)] overflow-hidden">
        <div className="p-6 border-b border-[var(--theme-border-color)]">
          <h3 className="text-lg font-semibold text-[var(--theme-text-primary)]">
            Segment Details
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--theme-panel-bg-alt)]">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-[var(--theme-text-secondary)]">Segment</th>
                <th className="p-3 text-left text-sm font-semibold text-[var(--theme-text-secondary)]">Customers</th>
                <th className="p-3 text-left text-sm
