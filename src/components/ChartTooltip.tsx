interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      formattedDate: string;
    };
  }>;
}

export function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const value = payload[0].value;
  const returnValue = payload[1].value;

  return (
    <div className="bg-background/95 p-2 border rounded-lg shadow-lg">
      <p className="text-sm font-medium">{payload[0].payload.formattedDate}</p>
      <p className="text-sm">Value: ${value.toLocaleString()}</p>
      <p className="text-sm">Return: {returnValue.toFixed(2)}%</p>
    </div>
  );
}