import { Card } from "./ui/card";

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;

  const dataPoint = payload[0].payload;

  return (
    <Card className="bg-background border p-3 shadow-lg">
      <div className="space-y-2">
        <p className="text-sm font-medium">{dataPoint.formattedDate}</p>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Value: <span className="font-medium text-foreground">${dataPoint.value.toLocaleString()}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Return: <span className="font-medium text-foreground">{dataPoint.accumulatedReturn.toFixed(2)}%</span>
          </p>
        </div>
      </div>
    </Card>
  );
}