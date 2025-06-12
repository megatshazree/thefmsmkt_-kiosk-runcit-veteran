
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';


interface ChartDataBase {
  name: string; 
  [key: string]: string | number; 
}

interface SalesChartProps {
  data: ChartDataBase[];
  type: 'bar' | 'pie';
  dataKey: string; 
  barColor?: string; 
  barLegendName?: string; 
  pieColors?: string[]; 
  valueFormatter?: (value: number) => string; 
}

const defaultPieColors = [
    'var(--theme-accent-purple)', 
    'var(--theme-accent-cyan)', 
    'var(--theme-accent-magenta)', 
    '#059669', // green-600
    '#f59e0b', // amber-500
    '#3b82f6', // blue-500
    '#ec4899'  // pink-500
];

const SalesChart: React.FC<SalesChartProps> = ({ 
    data, 
    type, 
    dataKey, 
    barColor = 'var(--theme-primary-color)', 
    barLegendName, 
    pieColors = defaultPieColors,
    valueFormatter = (value) => `RM ${Number(value).toFixed(2)}`
}) => {
  const { translate } = useLanguage(); 

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const pointData = payload[0].payload; 
      const name = pointData.name; 
      const value = payload[0].value; 

      return (
        <div className="bg-[var(--theme-panel-bg-alt)] p-3 rounded shadow-lg border border-[var(--theme-border-color)] text-sm">
          <p className="label text-[var(--theme-text-primary)] font-semibold">{`${name}`}</p>
          <p className="intro text-[var(--theme-accent-cyan)]">{`${payload[0].name}: ${valueFormatter(value as number)}`}</p>
        </div>
      );
    }
    return null;
  };

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border-color)" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 11, fill: 'var(--theme-text-muted)' }} 
            interval={0} 
            angle={data.length > 7 ? -30 : 0} 
            textAnchor={data.length > 7 ? "end" : "middle"}
            dy={data.length > 7 ? 10 : 0}
          />
          <YAxis 
            tickFormatter={(value) => valueFormatter(value as number).split(' ')[0] + Number(value).toLocaleString()} 
            tick={{ fontSize: 11, fill: 'var(--theme-text-muted)' }} 
           />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(var(--theme-accent-cyan-rgb, 86,225,233),0.1)' }}/> {/* Assuming --theme-accent-cyan-rgb is defined or use fixed rgba */}
          <Legend 
            wrapperStyle={{ fontSize: '12px', color: 'var(--theme-text-secondary)', paddingTop: '10px' }} 
            payload={[{ value: barLegendName || dataKey, type: 'square', color: barColor }]}
          />
          <Bar dataKey={dataKey} fill={barColor} name={barLegendName || dataKey} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}> 
          <Pie
            data={data}
            cx="50%"
            cy="45%" 
            labelLine={false}
            outerRadius="75%" 
            fill="#8884d8" // Default fill, overridden by Cell
            dataKey={dataKey}
            nameKey="name" 
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                const percentage = (percent * 100).toFixed(0);
                if (parseInt(percentage) < 5) return null; 
                return (
                    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="10" fontWeight="medium">
                      {`${data[index].name} (${percentage}%)`}
                    </text>
                );
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} stroke={pieColors[index % pieColors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            iconSize={10}
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            wrapperStyle={{ fontSize: '11px', color: 'var(--theme-text-secondary)', paddingTop: '0px', paddingBottom: '5px' }}
            payload={
                data.map(
                  (item, index) => ({
                    value: item.name, 
                    type: "square",
                    color: pieColors[index % pieColors.length]
                  })
                )
              }
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return <p className="text-[var(--theme-text-muted)] p-4">{translate('module_in_development')}: Invalid chart type or missing keys.</p>;
};

export default SalesChart;