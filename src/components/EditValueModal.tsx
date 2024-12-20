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
  const [value, setValue] = useState(initialValue);

  const handleSave = () => {
    onSave(value);
    onClose();
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
            inputMode="decimal"
            value={value}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || val === "-") {
                setValue(val === "-" ? -0 : 0);
              } else {
                const num = parseFloat(val);
                if (!isNaN(num)) {
                  setValue(num);
                }
              }
            }}
            placeholder="Enter amount"
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