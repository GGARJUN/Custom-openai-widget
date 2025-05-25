// components/Dia.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Define prop types
interface DiaProps {
  show: boolean;
  heading?: string;
  title: string;
  close: () => void;
  variant: "success" | "error" | "info";
}

const Dia: React.FC<DiaProps> = ({ show, heading, title, close, variant }) => {
  // Map variant to corresponding icon
  const getIcon = () => {
    switch (variant) {
      case "success":
        return <img src="/dialog-success.svg" alt="Success" width={100} height={100} />;
      case "error":
        return <img src="/dialog-error.svg" alt="Error" width={100} height={100} />;
      case "info":
        return <img src="/dialog-info.svg" alt="Info" width={100} height={100} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={show}>
      <DialogContent onInteractOutside={close} className="max-w-[400px]">
        {/* Title */}
        <DialogTitle className="text-center text-xl font-semibold">
          {heading || "Notification"}
        </DialogTitle>

        {/* Icon */}
        <div className="flex justify-center h-40 items-center">{getIcon()}</div>

        {/* Description */}
        <DialogDescription className="text-center text-base">{title}</DialogDescription>

        {/* Action Button */}
        <div className="flex justify-center pt-2">
          <Button onClick={close} variant="default">
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Dia;