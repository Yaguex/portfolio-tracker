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

interface EditValueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: number) => void;
  initialValue: number;
}

export function EditValueModal({ isOpen, onClose, onSave, initialValue }: EditValueModalProps) {
  const [value, setValue] = useState<string>(initialValue.toString());

  const handleSave = () => {
    const numValue = parseFloat(value);
    onSave(isNaN(numValue) ? 0 : numValue);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Amount</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            type="text"
            value={value}
            onChange={handleInputChange}
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