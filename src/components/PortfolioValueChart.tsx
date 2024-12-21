import { format } from "date-fns";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface ChartData {
  date: string;
  value: number;
}

interface Props {
  data: ChartData[];
}

export const PortfolioValueChart = ({ data }: Props) => {
  // Get last 12 months of data
  const last12Months = data.slice(0, 12).reverse();

  // Calculate Y-axis domain with 10% padding
  const maxValue = Math.max(...last12Months.map(d => d.value));
  const minValue = Math.min(...last12Months.map(d => d.value));
  const padding = (maxValue - minValue) * 0.1;
  const yDomain = [minValue - padding, maxValue + padding];

  // Find year change point
  const yearChangeIndex = last12Months.findIndex((d, i) => {
    if (i === 0) return false;
    const currentYear = new Date(d.date).getFullYear();
    const prevYear = new Date(last12Months[i - 1].date).getFullYear();
    return currentYear !== prevYear;
  });

  const yearChangeDateStr = yearChangeIndex !== -1 ? last12Months[yearChangeIndex].date : null;

  // Calculate YTD return for each point
  const enrichedData = last12Months.map(point => {
    const currentYear = new Date(point.date).getFullYear();
    const yearStart = last12Months.find(d => 
      new Date(d.date).getFullYear() === currentYear && 
      new Date(d.date).getMonth() === 0
    )?.value || point.value;
    
    const ytdReturn = ((point.value - yearStart) / yearStart) * 100;
    
    return {
      ...point,
      ytdReturn,
      formattedDate: format(new Date(point.date), "MMM yyyy"),
      formattedValue: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(point.value),
      formattedYtdReturn: `${ytdReturn >= 0 ? '+' : ''}${ytdReturn.toFixed(2)}%`
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    
    const data = payload[0].payload;
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px]">
        <div className="space-y-2">
          <p className="text-sm font-medium">{data.formattedDate}</p>
          <p className="text-sm">Value: {data.formattedValue}</p>
          <p className="text-sm">YTD Return: {data.formattedYtdReturn}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-[400px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={enrichedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis 
            dataKey="formattedDate"
            stroke="rgb(100 116 139)"
            fontSize={12}
          />
          <YAxis
            stroke="rgb(100 116 139)"
            fontSize={12}
            tickFormatter={(value) => 
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                notation: 'compact',
                maximumFractionDigits: 1
              }).format(value)
            }
            domain={yDomain}
          />
          {yearChangeDateStr && (
            <ReferenceLine
              x={format(new Date(yearChangeDateStr), "MMM yyyy")}
              stroke="rgb(100 116 139)"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
          )}
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};