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
import { EditValueModal } from "./EditValueModal";
import { AddTransactionModal } from "./AddTransactionModal";
import { PortfolioTableRow } from "./PortfolioTableRow";
import { useState } from "react";

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
  const [editingRow, setEditingRow] = useState<FormattedDataRow | null>(null);
  const [showAddTransaction, setShowAddTransaction] = useState(false);

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

  const handleEdit = (row: FormattedDataRow) => {
    setEditingRow(row);
  };

  const handleSave = (newValue: number) => {
    console.log("Saving new value:", newValue, "for row:", editingRow);
    setEditingRow(null);
  };

  const handleDelete = (row: FormattedDataRow) => {
    console.log("Delete row:", row);
  };

  const handleAddTransaction = (newValue: number) => {
    console.log("Adding transaction:", newValue);
    setShowAddTransaction(false);
  };

  const formatGain = (value: number) => 
    value < 0 ? `-$${Math.abs(value).toLocaleString()}` : `$${Math.abs(value).toLocaleString()}`;
    
  const formatReturn = (value: number) => 
    `${value >= 0 ? "+" : "-"}${Math.abs(value).toFixed(2)}%`;

  const getValueColor = (value: number) =>
    value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "";

  return (
    <>
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
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formattedData.map((row, index) => {
              const isYearChange = index < formattedData.length - 1 && 
                row.type === "regular" &&
                formattedData[index + 1].type === "regular" &&
                parse(row.date, "yyyy-MM", new Date()).getFullYear() !==
                parse(formattedData[index + 1].date, "yyyy-MM", new Date()).getFullYear();

              return (
                <PortfolioTableRow
                  key={row.date}
                  row={row}
                  formatGain={formatGain}
                  formatReturn={formatReturn}
                  getValueColor={getValueColor}
                  onEdit={() => handleEdit(row)}
                  onDelete={row.type !== "regular" ? () => handleDelete(row) : undefined}
                  onAddTransaction={() => setShowAddTransaction(true)}
                  isYearChange={isYearChange}
                />
              );
            })}
          </TableBody>
        </Table>
      </Card>
      
      {editingRow && (
        <EditValueModal
          isOpen={true}
          onClose={() => setEditingRow(null)}
          onSave={handleSave}
          initialValue={editingRow.value}
        />
      )}

      <AddTransactionModal
        isOpen={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        onSave={handleAddTransaction}
      />
    </>
  );
}