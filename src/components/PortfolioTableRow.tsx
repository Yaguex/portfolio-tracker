import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { TableActionButtons } from "./TableActionButtons";

interface PortfolioTableRowProps {
  row: {
    type: "regular" | "deposit" | "withdraw";
    formattedDate: string;
    formattedValue: string;
    momGain?: number;
    momReturn?: number;
    ytdGain?: number;
    ytdReturn?: number;
  };
  formatGain: (value: number) => string;
  formatReturn: (value: number) => string;
  getValueColor: (value: number) => string;
  onEdit: () => void;
  onDelete?: () => void;
  onAddTransaction: () => void;
  isYearChange?: boolean;
}

export function PortfolioTableRow({
  row,
  formatGain,
  formatReturn,
  getValueColor,
  onEdit,
  onDelete,
  onAddTransaction,
  isYearChange,
}: PortfolioTableRowProps) {
  if (row.type === "deposit" || row.type === "withdraw") {
    const color = row.type === "deposit" ? "text-green-600" : "text-red-600";
    return (
      <TableRow key={row.formattedDate} className="group relative border-b">
        <TableCell className={color}>{row.formattedDate}</TableCell>
        <TableCell className={`text-right ${color}`}>{row.formattedValue}</TableCell>
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell>
          <TableActionButtons
            onEdit={onEdit}
            onDelete={onDelete}
            onAddTransaction={onAddTransaction}
          />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow className={`group relative ${isYearChange ? "border-b-2 border-gray-300" : ""}`}>
      <TableCell>{row.formattedDate}</TableCell>
      <TableCell className="text-right">{row.formattedValue}</TableCell>
      <TableCell className={`text-right ${getValueColor(row.momGain || 0)}`}>
        {formatGain(row.momGain || 0)}
      </TableCell>
      <TableCell className={`text-right ${getValueColor(row.momReturn || 0)}`}>
        {formatReturn(row.momReturn || 0)}
      </TableCell>
      <TableCell className={`text-right ${getValueColor(row.ytdGain || 0)}`}>
        {formatGain(row.ytdGain || 0)}
      </TableCell>
      <TableCell className={`text-right ${getValueColor(row.ytdReturn || 0)}`}>
        {formatReturn(row.ytdReturn || 0)}
      </TableCell>
      <TableCell>
        <TableActionButtons
          onEdit={onEdit}
          onAddTransaction={onAddTransaction}
        />
      </TableCell>
    </TableRow>
  );
}