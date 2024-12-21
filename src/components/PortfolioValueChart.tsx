import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ChartTooltip } from "./ChartTooltip";
import { ChartDataPoint, formatChartData, findYearChanges, calculateYAxisDomain } from "@/utils/chartDataUtils";

interface PortfolioValueChartProps {
  data: ChartDataPoint[];
}

export function PortfolioValueChart({ data }: PortfolioValueChartProps) {
  const formattedData = formatChartData(data);
  const yearChanges = findYearChanges(formattedData);
  const values = formattedData.map(item => item.value);
  const yAxisDomain = calculateYAxisDomain(values);

  const axisStyle = {
    tick: { fill: 'rgb(100 116 139)', fontSize: 11 },
    tickLine: { stroke: 'rgb(100 116 139)' },
    axisLine: { stroke: 'rgb(100 116 139)' }
  };

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
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="formattedDate"
                {...axisStyle}
              />
              <YAxis 
                yAxisId="value"
                domain={yAxisDomain}
                {...axisStyle}
                tickFormatter={(value) => `$${(value / 1000)}k`}
              />
              {yearChanges.map((date, index) => (
                <ReferenceLine
                  key={index}
                  x={date}
                  yAxisId="value"
                  stroke="rgb(100 116 139)"
                  strokeDasharray="3 3"
                  className="stroke-muted"
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