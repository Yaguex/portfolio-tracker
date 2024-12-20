import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface PortfolioValueChartProps {
  data: Array<{
    date: string;
    value: number;
  }>;
}

export function PortfolioValueChart({ data }: PortfolioValueChartProps) {
  // Filter last 12 months of data and sort chronologically
  const last12Months = [...data]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-12);

  // Calculate accumulated returns
  const startValue = last12Months[0]?.value || 0;
  const formattedData = last12Months.map(item => {
    const accumulatedReturn = ((item.value - startValue) / startValue) * 100;
    return {
      ...item,
      formattedDate: format(parse(item.date, "yyyy-MM", new Date()), "MMM yyyy"),
      accumulatedReturn,
    };
  });

  // Calculate min and max values with 10% padding for both axes
  const values = last12Months.map(item => item.value);
  const returns = formattedData.map(item => item.accumulatedReturn);
  
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valuePadding = (maxValue - minValue) * 0.1;
  const valueAxisDomain = [minValue - valuePadding, maxValue + valuePadding];

  const minReturn = Math.min(...returns);
  const maxReturn = Math.max(...returns);
  const returnPadding = (maxReturn - minReturn) * 0.1;
  const returnAxisDomain = [minReturn - returnPadding, maxReturn + returnPadding];

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
              <YAxis 
                yAxisId="return"
                orientation="right"
                domain={returnAxisDomain}
                tick={{ fill: 'rgb(100 116 139)', fontSize: 11 }}
                tickLine={{ stroke: 'rgb(100 116 139)' }}
                tickFormatter={(value) => `${value.toFixed(1)}%`}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background/95 p-2 border rounded-lg shadow-lg">
                        <p className="text-sm font-medium">{payload[0].payload.formattedDate}</p>
                        <p className="text-sm">Value: ${payload[0].value.toLocaleString()}</p>
                        <p className="text-sm">Return: {payload[1].value.toFixed(2)}%</p>
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
                yAxisId="return"
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
