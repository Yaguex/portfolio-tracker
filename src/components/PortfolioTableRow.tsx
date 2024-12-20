import { Edit2, Trash2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";

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
          <div className="invisible group-hover:visible absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-blue-500 hover:text-blue-700"
              onClick={onEdit}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-700"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-500 hover:text-green-700"
              onClick={onAddTransaction}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
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
        <div className="invisible group-hover:visible absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-500 hover:text-blue-700"
            onClick={onEdit}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-green-500 hover:text-green-700"
            onClick={onAddTransaction}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}