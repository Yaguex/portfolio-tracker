import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ChartTooltip } from "./ChartTooltip";
import { ChartDataPoint, formatChartData, calculateYAxisDomain } from "@/utils/chartDataUtils";

interface PortfolioValueChartProps {
  data: ChartDataPoint[];
}

export function PortfolioValueChart({ data }: PortfolioValueChartProps) {
  const formattedData = formatChartData(data);
  const values = formattedData.map(item => item.value);
  const yAxisDomain = calculateYAxisDomain(values);

  // Common styles for axes
  const axisStyle = {
    stroke: 'rgb(100 116 139)',
    fontSize: 11,
  };

  // Find year changes for reference lines
  const yearChanges = formattedData.reduce((acc: string[], item, index) => {
    if (index === 0) return acc;
    const currentYear = item.formattedDate.split(' ')[1];
    const prevYear = formattedData[index - 1].formattedDate.split(' ')[1];
    if (currentYear !== prevYear) {
      acc.push(item.formattedDate);
    }
    return acc;
  }, []);

  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle>Portfolio Value History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={formattedData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={axisStyle.stroke}
                opacity={0.2}
              />
              <XAxis 
                dataKey="formattedDate"
                stroke={axisStyle.stroke}
                tick={{ fill: axisStyle.stroke, fontSize: axisStyle.fontSize }}
              />
              <YAxis 
                yAxisId="value"
                domain={yAxisDomain}
                stroke={axisStyle.stroke}
                tick={{ fill: axisStyle.stroke, fontSize: axisStyle.fontSize }}
                tickFormatter={(value) => `$${(value / 1000)}k`}
              />
              {yearChanges.map((date, index) => (
                <ReferenceLine
                  key={index}
                  x={date}
                  yAxisId="value"
                  stroke={axisStyle.stroke}
                  strokeDasharray="3 3"
                  opacity={0.2}
                />
              ))}
              <Tooltip content={ChartTooltip} />
              <Line 
                yAxisId="value"
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                yAxisId="value"
                type="monotone" 
                dataKey="accumulatedReturn" 
                stroke="#9b87f5" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}