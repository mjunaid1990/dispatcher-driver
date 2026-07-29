import { cn } from "~/lib/utils";

interface StatusPillProps {
  status: "pending" | "assigned" | "in_transit" | "arrived" | "delivered" | "failed" | "cancelled";
  size?: "sm" | "md" | "lg";
}

const statusConfig = {
  pending: {
    label: "Pending",
    bgColor: "bg-surface-elevated",
    textColor: "text-gray-300",
    borderColor: "border-gray-600",
  },
  assigned: {
    label: "Assigned",
    bgColor: "bg-blue-500/20",
    textColor: "text-blue-400",
    borderColor: "border-blue-500",
  },
  in_transit: {
    label: "In Transit",
    bgColor: "bg-mint/20",
    textColor: "text-mint",
    borderColor: "border-mint",
  },
  arrived: {
    label: "Arrived",
    bgColor: "bg-purple-500/20",
    textColor: "text-purple-400",
    borderColor: "border-purple-500",
  },
  delivered: {
    label: "Delivered",
    bgColor: "bg-success/20",
    textColor: "text-success",
    borderColor: "border-success",
  },
  failed: {
    label: "Failed",
    bgColor: "bg-error/20",
    textColor: "text-error",
    borderColor: "border-error",
  },
  cancelled: {
    label: "Cancelled",
    bgColor: "bg-gray-500/20",
    textColor: "text-gray-400",
    borderColor: "border-gray-500",
  },
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs rounded-md",
  md: "px-3 py-1 text-sm rounded-lg",
  lg: "px-4 py-1.5 text-base rounded-xl",
};

export default function StatusPill({ status, size = "md" }: StatusPillProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        "inline-flex items-center border font-medium",
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizeStyles[size]
      )}
    >
      {config.label}
    </span>
  );
}
