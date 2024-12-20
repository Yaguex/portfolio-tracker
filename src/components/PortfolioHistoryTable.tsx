import { format, parse, startOfYear } from "date-fns";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PortfolioHistoryTableProps {
  data: Array<{
    date: string;
    value: number;
  }>;
}

export function PortfolioHistoryTable({ data }: PortfolioHistoryTableProps) {
  // Sort data in reverse chronological order
  const sortedData = [...data].sort((a, b) => b.date.localeCompare(a.date));

  const calculateMoMChange = (currentValue: number, previousValue: number) => {
    const gain = currentValue - previousValue;
    const returnPercentage = (gain / previousValue) * 100;
    return { gain, returnPercentage };
  };

  const calculateYTDChange = (currentValue: number, startOfYearValue: number) => {
    const gain = currentValue - startOfYearValue;
    const returnPercentage = (gain / startOfYearValue) * 100;
    return { gain, returnPercentage };
  };

  const getStartOfYearValue = (date: string) => {
    const currentYear = parse(date, "yyyy-MM", new Date()).getFullYear();
    const startOfYearDate = startOfYear(new Date(currentYear, 0)).toISOString().slice(0, 7);
    const startOfYearEntry = data.find(entry => entry.date === startOfYearDate);
    return startOfYearEntry?.value ?? data[data.length - 1].value;
  };

  const formattedData = sortedData.map((entry, index) => {
    const previousMonth = sortedData[index + 1]?.value ?? entry.value;
    const startOfYearValue = getStartOfYearValue(entry.date);
    const momChanges = calculateMoMChange(entry.value, previousMonth);
    const ytdChanges = calculateYTDChange(entry.value, startOfYearValue);

    return {
      ...entry,
      formattedDate: format(parse(entry.date, "yyyy-MM", new Date()), "MMM yyyy"),
      formattedValue: `$${entry.value.toLocaleString()}`,
      momGain: momChanges.gain,
      momReturn: momChanges.returnPercentage,
      ytdGain: ytdChanges.gain,
      ytdReturn: ytdChanges.returnPercentage,
    };
  });

  const formatGain = (value: number) => `$${Math.abs(value).toLocaleString()}`;
  const formatReturn = (value: number) => 
    `${value >= 0 ? "+" : "-"}${Math.abs(value).toFixed(2)}%`;

  const getValueColor = (value: number) =>
    value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "";

  return (
    <Card className="card-gradient">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Portfolio Value</TableHead>
            <TableHead className="text-right">MoM Gain</TableHead>
            <TableHead className="text-right">MoM Return</TableHead>
            <TableHead className="text-right">YTD Gain</TableHead>
            <TableHead className="text-right">YTD Return</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {formattedData.map((row, index) => {
            const isYearChange = index < formattedData.length - 1 && 
              parse(row.date, "yyyy-MM", new Date()).getFullYear() !==
              parse(formattedData[index + 1].date, "yyyy-MM", new Date()).getFullYear();

            return (
              <TableRow
                key={row.date}
                className={isYearChange ? "border-b-2 border-border" : ""}
              >
                <TableCell>{row.formattedDate}</TableCell>
                <TableCell className="text-right">{row.formattedValue}</TableCell>
                <TableCell className={`text-right ${getValueColor(row.momGain)}`}>
                  {formatGain(row.momGain)}
                </TableCell>
                <TableCell className={`text-right ${getValueColor(row.momReturn)}`}>
                  {formatReturn(row.momReturn)}
                </TableCell>
                <TableCell className={`text-right ${getValueColor(row.ytdGain)}`}>
                  {formatGain(row.ytdGain)}
                </TableCell>
                <TableCell className={`text-right ${getValueColor(row.ytdReturn)}`}>
                  {formatReturn(row.ytdReturn)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}