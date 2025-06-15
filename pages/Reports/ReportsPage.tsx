import React, { useState, useMemo, useCallback } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { useLanguageStore } from '../../store/languageStore';
import { summarizeReportData } from '../../services/geminiService';
import { useToastStore } from '../../store/toastStore';
import KioskButton from '../../components/common/KioskButton';
import { SalesDataPoint, CategorySalesDataPoint, TopSellingProductDataPoint, SalesByEmployeeDataPoint, PaymentMethodDataPoint, ReportTimeRange } from '../../types';
import SalesChart from './SalesChart';
import { SparklesIcon, CubeTransparentIcon } from '@heroicons/react/24/solid';
import { 
    mockDailySalesData, mockWeeklySalesData, mockMonthlySalesData,
    mockCategorySalesData, mockTopSellingProducts, mockSalesByEmployee, mockPaymentMethodData 
} from '../../constants/mockData';

type ReportType = 'overview' | 'product' | 'employee' | 'payment';

const ReportsPage: React.FC = () => {
  const { translate } = useLanguageStore();
  const { showToast } = useToastStore();
  
  const [activeReportType, setActiveReportType] = useState<ReportType>('overview');
  const [activeDateRange, setActiveDateRange] = useState<ReportTimeRange>(ReportTimeRange.DAILY);
  
  const [summaries, setSummaries] = useState<Record<ReportType, string | null>>({
    overview: null, product: null, employee: null, payment: null,
  });
  const [isSummarizing, setIsSummarizing] = useState<Record<ReportType, boolean>>({
    overview: false, product: false, employee: false, payment: false,
  });

  const selectedTimeBasedSalesData = useMemo(() => {
    switch (activeDateRange) {
        case ReportTimeRange.WEEKLY: return mockWeeklySalesData;
        case ReportTimeRange.MONTHLY: return mockMonthlySalesData;
        case ReportTimeRange.DAILY:
        default: return mockDailySalesData;
    }
  }, [activeDateRange]);

  const handleSummarizeReport = useCallback(async (reportType: ReportType) => {
    setIsSummarizing(prev => ({ ...prev, [reportType]: true }));
    setSummaries(prev => ({ ...prev, [reportType]: null }));
    
    let reportDataString = "";
    let currentLang = translate('lang_toggle_button').includes('English') ? 'ms' : 'en'; 
    let promptLangInstructions = currentLang === 'ms' ? "Ringkasan dalam Bahasa Malaysia." : "Summary in English.";

    switch (reportType) {
      case 'overview':
        const dailyStr = selectedTimeBasedSalesData.map(d => `${d.name}: RM${d.sales}`).join(', ');
        const catStr = mockCategorySalesData.map(d => `${translate(d.categoryKey)}: RM${d.sales}`).join(', ');
        reportDataString = `Gambaran Jualan (${translate(`reports_filter_${activeDateRange}`)}): Jualan Harian/Berkala: ${dailyStr}. Jualan Mengikut Kategori: ${catStr}. ${promptLangInstructions}`;
        break;
      case 'product':
        const topProdStr = mockTopSellingProducts.map(p => `${p.productName} (Terjual: ${p.quantitySold}, Hasil: RM${p.totalRevenue.toFixed(2)})`).join('; ');
        reportDataString = `Prestasi Produk (${translate(`reports_filter_${activeDateRange}`)}): Produk Terlaris: ${topProdStr}. ${promptLangInstructions}`;
        break;
      case 'employee':
        const empSalesStr = mockSalesByEmployee.map(e => `${e.employeeName} (Jualan: RM${e.totalSales.toFixed(2)}, Transaksi: ${e.transactions})`).join('; ');
        reportDataString = `Prestasi Pekerja (${translate(`reports_filter_${activeDateRange}`)}): Jualan Mengikut Pekerja: ${empSalesStr}. ${promptLangInstructions}`;
        break;
      case 'payment':
        const paymentStr = mockPaymentMethodData.map(p => `${translate(p.methodKey)} (Amaun: RM${p.totalAmount.toFixed(2)}, Transaksi: ${p.transactionCount})`).join('; ');
        reportDataString = `Analisis Pembayaran (${translate(`reports_filter_${activeDateRange}`)}): Agihan Kaedah Pembayaran: ${paymentStr}. ${promptLangInstructions}`;
        break;
    }
    
    showToast(translate('toast_report_summary_generating'), 'info');
    const result = await summarizeReportData(reportDataString);

    setIsSummarizing(prev => ({ ...prev, [reportType]: false }));
    if (result.error) {
      showToast(translate('toast_api_error', { message: result.error }), 'error');
    } else if (result.data) {
      setSummaries(prev => ({ ...prev, [reportType]: result.data }));
      showToast(translate('toast_report_summary_generated'), 'success');
    }
  }, [activeDateRange, selectedTimeBasedSalesData, showToast, translate, isSummarizing]);

  const reportTabs = useMemo(() => [
    { key: 'overview' as ReportType, labelKey: 'reports_tab_overview' },
    { key: 'product' as ReportType, labelKey: 'reports_tab_product' },
    { key: 'employee' as ReportType, labelKey: 'reports_tab_employee' },
    { key: 'payment' as ReportType, labelKey: 'reports_tab_payment' },
  ], []);

  const dateRangeOptions = useMemo(() => [
    { key: ReportTimeRange.DAILY, labelKey: 'reports_filter_daily' },
    { key: ReportTimeRange.WEEKLY, labelKey: 'reports_filter_weekly' },
    { key: ReportTimeRange.MONTHLY, labelKey: 'reports_filter_monthly' },
  ], []);
  
  const renderOverviewReports = useCallback(() => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-[var(--theme-panel-bg)] p-6 rounded-xl shadow-lg border border-[var(--theme-border-color)]">
        <h3 className="text-xl font-semibold text-[var(--theme-text-primary)] mb-5">{translate('reports_daily_sales_title')} ({translate(`reports_filter_${activeDateRange}`)})</h3>
        <div className="chart-container h-[300px] sm:h-[350px] bg-[var(--theme-panel-bg-alt)] p-2 rounded-md">
           <SalesChart data={selectedTimeBasedSalesData} type="bar" dataKey="sales" barColor="var(--theme-accent-cyan)" barLegendName={translate('reports_daily_sales_title')} />
        </div>
      </div>
      <div className="bg-[var(--theme-panel-bg)] p-6 rounded-xl shadow-lg border border-[var(--theme-border-color)]">
        <h3 className="text-xl font-semibold text-[var(--theme-text-primary)] mb-5">{translate('reports_sales_by_category_title')}</h3>
        <div className="chart-container h-[300px] sm:h-[350px] bg-[var(--theme-panel-bg-alt)] p-2 rounded-md">
           <SalesChart 
              data={mockCategorySalesData.map(item => ({ ...item, name: translate(item.categoryKey) }))} 
              type="pie" 
              dataKey="sales"
          />
        </div>
      </div>
    </div>
  ), [activeDateRange, selectedTimeBasedSalesData, translate]);

  const renderProductPerformanceReports = useCallback(() => (
    <div className="bg-[var(--theme-panel-bg)] p-6 rounded-xl shadow-lg border border-[var(--theme-border-color)]">
      <h3 className="text-xl font-semibold text-[var(--theme-text-primary)] mb-5">{translate('reports_top_selling_products_title')}</h3>
      {mockTopSellingProducts.length === 0 ? (
        <div className="text-center py-10 text-[var(--theme-text-muted)]">
            <CubeTransparentIcon className="h-16 w-16 mx-auto text-[var(--theme-text-muted)] opacity-50 mb-4" aria-hidden="true"/>
            <p>{translate('reports_data_not_available')}</p>
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full text-left">
            <thead className="bg-[var(--theme-panel-bg-alt)] sticky top-0">
                <tr>
                <th className="p-3 text-sm font-semibold tracking-wide text-[var(--theme-text-secondary)]">{translate('table_product_name')}</th>
                <th className="p-3 text-sm font-semibold tracking-wide text-right text-[var(--theme-text-secondary)]">{translate('table_quantity_sold')}</th>
                <th className="p-3 text-sm font-semibold tracking-wide text-right text-[var(--theme-text-secondary)]">{translate('table_total_revenue')}</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-[var(--theme-border-color)]">
                {mockTopSellingProducts.map(p => (
                <tr key={p.productId} className="hover:bg-[var(--theme-panel-bg-alt)]">
                    <td className="p-3 text-sm text-[var(--theme-text-primary)] font-medium whitespace-nowrap">{p.productName}</td>
                    <td className="p-3 text-sm text-[var(--theme-text-muted)] text-right">{p.quantitySold}</td>
                    <td className="p-3 text-sm text-[var(--theme-text-muted)] text-right">RM {p.totalRevenue.toFixed(2)}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      )}
    </div>
  ), [translate]);

  const renderEmployeePerformanceReports = useCallback(() => (
    <div className="bg-[var(--theme-panel-bg)] p-6 rounded-xl shadow-lg border border-[var(--theme-border-color)]">
      <h3 className="text-xl font-semibold text-[var(--theme-text-primary)] mb-5">{translate('reports_sales_by_employee_title')}</h3>
      <div className="chart-container h-[350px] bg-[var(--theme-panel-bg-alt)] p-2 rounded-md">
        <SalesChart 
            data={mockSalesByEmployee.map(e => ({ name: e.employeeName, sales: e.totalSales, transactions: e.transactions }))} 
            type="bar" 
            dataKey="sales" 
            barColor="var(--theme-accent-magenta)"
            barLegendName={translate('table_total_sales')}
        />
      </div>
    </div>
  ), [translate]);

  const renderPaymentAnalysisReports = useCallback(() => (
     <div className="bg-[var(--theme-panel-bg)] p-6 rounded-xl shadow-lg border border-[var(--theme-border-color)]">
        <h3 className="text-xl font-semibold text-[var(--theme-text-primary)] mb-5">{translate('reports_payment_method_distribution_title')}</h3>
        <div className="chart-container h-[350px] bg-[var(--theme-panel-bg-alt)] p-2 rounded-md">
           <SalesChart 
              data={mockPaymentMethodData.map(item => ({ ...item, name: translate(item.methodKey) }))}
              type="pie" 
              dataKey="totalAmount"
          />
        </div>
      </div>
  ), [translate]);


  return (
    <div>
      <PageHeader title={translate('reports_title')} subtitle={translate('reports_subtitle')} />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex space-x-2 overflow-x-auto pb-2 custom-scrollbar" role="tablist" aria-label="Report Types">
          {reportTabs.map(tab => (
            <KioskButton
              key={tab.key}
              variant={activeReportType === tab.key ? 'primary' : 'secondary'}
              onClick={() => setActiveReportType(tab.key)}
              className="text-sm whitespace-nowrap px-5 py-2.5"
              role="tab"
              aria-selected={activeReportType === tab.key}
              aria-controls={`report-content-${tab.key}`}
              tabIndex={activeReportType === tab.key ? 0 : -1}
              id={`tab-${tab.key}`}
            >
              {translate(tab.labelKey)}
            </KioskButton>
          ))}
        </div>
        <div className="flex items-center space-x-2" role="group" aria-label="Date Range Filters">
            <span className="text-sm text-[var(--theme-text-secondary)] mr-1">{translate('reports_filter_title')}</span>
            {dateRangeOptions.map(range => (
                 <KioskButton
                    key={range.key}
                    variant={activeDateRange === range.key ? 'primary' : 'secondary'}
                    onClick={() => setActiveDateRange(range.key)}
                    className="text-xs px-3 py-1.5"
                    aria-pressed={activeDateRange === range.key}
                >
                    {translate(range.labelKey)}
                </KioskButton>
            ))}
        </div>
      </div>
      
      <div className="mb-6">
        <KioskButton 
            variant="gemini" 
            onClick={() => handleSummarizeReport(activeReportType)} 
            isLoading={isSummarizing[activeReportType]}
            className="text-sm py-2 px-4"
            aria-controls={`summary-content-${activeReportType}`}
            aria-expanded={!!summaries[activeReportType]}
        >
          <SparklesIcon className="h-4 w-4 mr-1.5" aria-hidden="true"/>
          {translate('reports_btn_gemini_summary')} ({translate(reportTabs.find(t => t.key === activeReportType)?.labelKey || '')})
        </KioskButton>
        {summaries[activeReportType] && (
            <div id={`summary-content-${activeReportType}`} className="mt-4 text-sm text-[var(--theme-text-secondary)] bg-[var(--theme-panel-bg-alt)] p-4 rounded-md shadow border border-[var(--theme-border-color)]" aria-live="polite">
              <h4 className="font-semibold mb-2 text-[var(--theme-accent-magenta)]">{translate(`reports_gemini_summary_${activeReportType}_title`)}</h4>
              <p className="whitespace-pre-wrap">{summaries[activeReportType]}</p>
            </div>
        )}
      </div>


      <div id={`report-content-${activeReportType}`} role="tabpanel" aria-labelledby={`tab-${activeReportType}`}>
        {activeReportType === 'overview' && renderOverviewReports()}
        {activeReportType === 'product' && renderProductPerformanceReports()}
        {activeReportType === 'employee' && renderEmployeePerformanceReports()}
        {activeReportType === 'payment' && renderPaymentAnalysisReports()}
      </div>

    </div>

  );};

export default React.memo(ReportsPage);