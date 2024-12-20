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

type RowType = "regular" | "deposit" | "withdraw";

interface FormattedDataRow {
  type: RowType;
  date: string;
  value: number;
  formattedDate: string;
  formattedValue: string;
  momGain: number;
  momReturn: number;
  ytdGain: number;
  ytdReturn: number;
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
    const startOfYearDataEntry = data.find(entry => entry.date === startOfYearDate);
    return startOfYearDataEntry?.value ?? data[data.length - 1].value;
  };

  // Add special transaction rows
  const specialTransactions = [
    {
      type: "deposit" as const,
      date: "2024-09",
      value: 20000,
      position: "2024-10", // Insert before this date
    },
    {
      type: "withdraw" as const,
      date: "2024-02",
      value: -15000,
      position: "2024-03", // Insert before this date
    },
  ];

  const formattedData = sortedData.map((entry, index) => {
    // Artificially make some months negative for demonstration
    const artificialMultiplier = index % 3 === 0 ? -1 : 1;
    const previousMonth = sortedData[index + 1]?.value ?? entry.value;
    const startOfYearValue = getStartOfYearValue(entry.date);
    const momChanges = calculateMoMChange(entry.value, previousMonth);
    const ytdChanges = calculateYTDChange(entry.value, startOfYearValue);

    return {
      ...entry,
      type: "regular" as RowType,
      formattedDate: format(parse(entry.date, "yyyy-MM", new Date()), "MMM yyyy"),
      formattedValue: (entry.value < 0 ? "-$" : "$") + Math.abs(entry.value).toLocaleString(),
      momGain: momChanges.gain * artificialMultiplier,
      momReturn: momChanges.returnPercentage * artificialMultiplier,
      ytdGain: ytdChanges.gain * artificialMultiplier,
      ytdReturn: ytdChanges.returnPercentage * artificialMultiplier,
    };
  });

  // Insert special transactions
  specialTransactions.forEach(transaction => {
    const insertIndex = formattedData.findIndex(entry => entry.date === transaction.position);
    if (insertIndex !== -1) {
      formattedData.splice(insertIndex, 0, {
        type: transaction.type,
        date: transaction.date,
        value: transaction.value,
        formattedDate: transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
        formattedValue: (transaction.value < 0 ? "-$" : "$") + Math.abs(transaction.value).toLocaleString(),
        momGain: 0,
        momReturn: 0,
        ytdGain: 0,
        ytdReturn: 0,
      });
    }
  });

  const formatGain = (value: number) => 
    value < 0 ? `-$${Math.abs(value).toLocaleString()}` : `$${Math.abs(value).toLocaleString()}`;
    
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
              row.type === "regular" &&
              formattedData[index + 1].type === "regular" &&
              parse(row.date, "yyyy-MM", new Date()).getFullYear() !==
              parse(formattedData[index + 1].date, "yyyy-MM", new Date()).getFullYear();

            if (row.type === "deposit" || row.type === "withdraw") {
              const color = row.type === "deposit" ? "text-green-600" : "text-red-600";
              return (
                <TableRow key={row.date} className="border-b">
                  <TableCell className={color}>{row.formattedDate}</TableCell>
                  <TableCell className={`text-right ${color}`}>{row.formattedValue}</TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </TableRow>
              );
            }

            return (
              <TableRow
                key={row.date}
                className={isYearChange ? "border-b-2 border-gray-300" : ""}
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