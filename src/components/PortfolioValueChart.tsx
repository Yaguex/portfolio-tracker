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
  // Calculate accumulated returns
  const startValue = data[0]?.value || 0;
  const formattedData = data.map(item => {
    const accumulatedReturn = ((item.value - startValue) / startValue) * 100;
    return {
      ...item,
      formattedDate: format(new Date(item.date), 'MMM yyyy'),
      formattedValue: `$${item.value.toLocaleString()}`,
      accumulatedReturn: accumulatedReturn,
      formattedReturn: `${accumulatedReturn.toFixed(2)}%`
    };
  });

  // Calculate min and max values with 10% padding for both axes
  const values = data.map(item => item.value);
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
              margin={{ top: 20, right: 60, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="formattedDate"
                tick={{ fill: 'currentColor' }}
                tickLine={{ stroke: 'currentColor' }}
              />
              <YAxis 
                yAxisId="value"
                domain={valueAxisDomain}
                tick={{ fill: 'currentColor' }}
                tickLine={{ stroke: 'currentColor' }}
                tickFormatter={(value) => `$${(value / 1000)}k`}
              />
              <YAxis 
                yAxisId="return"
                orientation="right"
                domain={returnAxisDomain}
                tick={{ fill: 'currentColor' }}
                tickLine={{ stroke: 'currentColor' }}
                tickFormatter={(value) => `${value.toFixed(1)}%`}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid gap-2">
                          <div className="font-semibold">
                            {payload[0].payload.formattedDate}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground">Value</div>
                              <div className="font-medium">
                                {payload[0].payload.formattedValue}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Return</div>
                              <div className="font-medium">
                                {payload[0].payload.formattedReturn}
                              </div>
                            </div>
                          </div>
                        </div>
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
                stroke="#9b87f5" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                yAxisId="return"
                type="monotone" 
                dataKey="accumulatedReturn" 
                stroke="#22c55e" 
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