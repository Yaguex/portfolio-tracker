import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  value: string;
  className?: string;
  trend?: "up" | "down";
}

export function MetricsCard({ title, value, className, trend }: MetricsCardProps) {
  return (
    <Card className={cn("card-gradient card-hover", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {trend && (
            <span className={trend === "up" ? "text-green-500 ml-2" : "text-red-500 ml-2"}>
              {trend === "up" ? "↑" : "↓"}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}