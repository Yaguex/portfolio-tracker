import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format, parse } from 'date-fns';

interface PortfolioValueChartProps {
  data: Array<{
    date: string;
    value: number;
  }>;
}

export function PortfolioValueChart({ data }: PortfolioValueChartProps) {
  const last12Months = [...data]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-12);

  const startValue = last12Months[0]?.value || 0;
  const formattedData = last12Months.map(item => {
    const accumulatedReturn = ((item.value - startValue) / startValue) * 100;
    return {
      ...item,
      formattedDate: format(parse(item.date, "yyyy-MM", new Date()), "MMM yyyy"),
      accumulatedReturn,
    };
  });

  // Find year changes
  const yearChanges = formattedData.reduce((acc: string[], item, index) => {
    if (index > 0) {
      const currentYear = parse(item.date, "yyyy-MM", new Date()).getFullYear();
      const prevYear = parse(formattedData[index - 1].date, "yyyy-MM", new Date()).getFullYear();
      if (currentYear !== prevYear) {
        acc.push(item.formattedDate);
      }
    }
    return acc;
  }, []);

  const values = last12Months.map(item => item.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valuePadding = (maxValue - minValue) * 0.1;
  const valueAxisDomain = [minValue - valuePadding, maxValue + valuePadding];

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
                tick={{ fill: 'rgb(100 116 139)', fontSize: 11 }}
                tickLine={{ stroke: 'rgb(100 116 139)' }}
              />
              <YAxis 
                yAxisId="value"
                domain={valueAxisDomain}
                tick={{ fill: 'rgb(100 116 139)', fontSize: 11 }}
                tickLine={{ stroke: 'rgb(100 116 139)' }}
                tickFormatter={(value) => `$${(value / 1000)}k`}
              />
              {yearChanges.map((date, index) => (
                <ReferenceLine
                  key={index}
                  x={date}
                  stroke="rgb(156 163 175)"
                  strokeDasharray="3 3"
                />
              ))}
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const value = payload[0].value as number;
                    const returnValue = payload[1].value as number;
                    return (
                      <div className="bg-background/95 p-2 border rounded-lg shadow-lg">
                        <p className="text-sm font-medium">{payload[0].payload.formattedDate}</p>
                        <p className="text-sm">Value: ${value.toLocaleString()}</p>
                        <p className="text-sm">Return: {returnValue.toFixed(2)}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
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