import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: number) => void;
}

export function AddTransactionModal({ isOpen, onClose, onSave }: AddTransactionModalProps) {
  const [value, setValue] = useState<number>(0);

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit or Withdraw cash</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            placeholder="Enter amount (negative for withdrawal)"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}