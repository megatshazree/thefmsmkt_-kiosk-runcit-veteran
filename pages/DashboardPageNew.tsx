import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  MagnifyingGlassIcon,
  BanknotesIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

const DashboardPageNew: React.FC = () => {
  const { translate } = useLanguage();

  const stats = [
    {
      title: 'Revenue',
      value: '$1200.56',
      icon: BanknotesIcon,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Paid orders',
      value: '198',
      icon: DocumentTextIcon,
      color: 'bg-gray-100',
      iconColor: 'text-gray-600'
    },
    {
      title: 'Tip amount',
      value: '$186.72',
      icon: UserGroupIcon,
      color: 'bg-gray-100',
      iconColor: 'text-gray-600'
    },
    {
      title: 'Dishes sold',
      value: '227',
      icon: ShoppingBagIcon,
      color: 'bg-gray-100',
      iconColor: 'text-gray-600'
    },
  ];

  const todaysUpsale = [
    { name: 'Roast chicken', orders: 120, icon: '🍗' },
    { name: 'Carbonara Paste', orders: 114, icon: '🍝' },
    { name: 'Fried egg', orders: 98, icon: '🍳' },
    { name: 'Norwegian soup', orders: 82, icon: '🍲' },
  ];

  const chartData = [
    { day: 'Sun', value: 300 },
    { day: 'Mon', value: 350 },
    { day: 'Tue', value: 420 },
    { day: 'Wed', value: 380 },
    { day: 'Thu', value: 450 },
    { day: 'Fri', value: 500 },
    { day: 'Sat', value: 280 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="flex h-screen bg-[var(--theme-bg-deep-space)] text-white">
      {/* Sidebar Navigation */}
      <div className="w-48 bg-[var(--theme-panel-bg)] border-r border-[var(--theme-border-color)] flex flex-col">
        {/* Logo/Brand */}
        <div className="p-4 border-b border-[var(--theme-border-color)]">
          <h1 className="text-lg font-semibold">CosyPOS</h1>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 py-4">
          <div className="px-3 space-y-1">
            <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-[var(--theme-text-muted)] hover:text-white hover:bg-[var(--theme-panel-bg-alt)]">
              Menu
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-[var(--theme-text-muted)] hover:text-white hover:bg-[var(--theme-panel-bg-alt)]">
              Tables
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-[var(--theme-text-muted)] hover:text-white hover:bg-[var(--theme-panel-bg-alt)]">
              Reservation
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-[var(--theme-text-muted)] hover:text-white hover:bg-[var(--theme-panel-bg-alt)]">
              Chat
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md bg-[var(--theme-panel-bg-alt)] text-white">
              Dashboard
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-[var(--theme-text-muted)] hover:text-white hover:bg-[var(--theme-panel-bg-alt)]">
              Accounting
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-[var(--theme-text-muted)] hover:text-white hover:bg-[var(--theme-panel-bg-alt)]">
              Settings
            </a>
          </div>
        </nav>

        {/* User Profiles at bottom */}
        <div className="p-3 border-t border-[var(--theme-border-color)] space-y-2">
          <div className="flex items-center space-x-2 p-2 rounded-md bg-[var(--theme-panel-bg-alt)]">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs">L</div>
            <span className="text-xs">Leslie K.</span>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-md">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs">C</div>
            <span className="text-xs">Cameron W.</span>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-md">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs">J</div>
            <span className="text-xs">Jacob J.</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--theme-border-color)]">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-[var(--theme-text-muted)]" />
              <input
                type="text"
                placeholder="Search"
                className="w-64 pl-10 pr-4 py-2 bg-[var(--theme-input-bg)] border border-[var(--theme-border-color)] rounded-lg text-white placeholder-[var(--theme-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-acceleration)]"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[var(--theme-text-muted)]">Feb 4, 2023</span>
            <button className="text-[var(--theme-text-muted)] hover:text-white">
              ▼
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`${stat.color} rounded-lg p-6 text-gray-800`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-70 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Charts and Lists Section */}
            <div className="grid grid-cols-2 gap-6">
              {/* Today's Upsale */}
              <div className="bg-[var(--theme-panel-bg)] rounded-lg p-6 border border-[var(--theme-border-color)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Today's upsale</h3>
                  <button className="text-[var(--theme-acceleration)] text-sm hover:underline">
                    See All
                  </button>
                </div>
                <div className="space-y-4">
                  {todaysUpsale.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-[var(--theme-text-muted)]">Order: {item.orders}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accepted Orders Chart */}
              <div className="bg-[var(--theme-panel-bg)] rounded-lg p-6 border border-[var(--theme-border-color)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Accepted orders</h3>
                  <select className="bg-[var(--theme-input-bg)] border border-[var(--theme-border-color)] rounded px-3 py-1 text-sm">
                    <option>Week</option>
                    <option>Month</option>
                    <option>Year</option>
                  </select>
                </div>
                
                {/* Simple Bar Chart */}
                <div className="space-y-2">
                  <div className="flex items-end justify-between h-40">
                    {chartData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2">
                        <div 
                          className="w-8 bg-[var(--theme-acceleration)] rounded-t"
                          style={{ 
                            height: `${(data.value / maxValue) * 120}px`,
                            minHeight: '20px'
                          }}
                        />
                        <span className="text-xs text-[var(--theme-text-muted)]">{data.day}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Y-axis labels */}
                  <div className="flex justify-between text-xs text-[var(--theme-text-muted)] px-2">
                    <span>0</span>
                    <span>200</span>
                    <span>400</span>
                    <span>500</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPageNew;
