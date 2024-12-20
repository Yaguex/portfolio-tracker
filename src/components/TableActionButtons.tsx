import { Edit2, Trash2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TableActionButtonsProps {
  onEdit: () => void;
  onDelete?: () => void;
  onAddTransaction: () => void;
}

export function TableActionButtons({ onEdit, onDelete, onAddTransaction }: TableActionButtonsProps) {
  return (
    <div className="invisible group-hover:visible absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-500 hover:text-blue-700"
            onClick={onEdit}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit row</p>
        </TooltipContent>
      </Tooltip>

      {onDelete && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-700"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete row</p>
          </TooltipContent>
        </Tooltip>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-green-500 hover:text-green-700"
            onClick={onAddTransaction}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Deposit or Withdraw cash</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}