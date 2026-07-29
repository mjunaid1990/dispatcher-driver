import { cn } from "~/lib/utils";
import { MapPin, Clock, DollarSign, User, Phone, Navigation } from "lucide-react";
import StatusPill from "../ui/StatusPill";
import Button from "../ui/Button";

interface DeliveryCardProps {
  id: string;
  customerName: string;
  customerPhone?: string;
  pickupAddress: string;
  dropoffAddress: string;
  status: "pending" | "assigned" | "in_transit" | "arrived" | "delivered" | "failed" | "cancelled";
  estimatedTime?: string;
  earnings: number;
  distance?: string;
  driverName?: string;
  onAssign?: () => void;
  onReassign?: () => void;
  onViewDetails?: () => void;
  className?: string;
}

export default function DeliveryCard({
  id,
  customerName,
  customerPhone,
  pickupAddress,
  dropoffAddress,
  status,
  estimatedTime,
  earnings,
  distance,
  driverName,
  onAssign,
  onReassign,
  onViewDetails,
  className,
}: DeliveryCardProps) {
  return (
    <div
      className={cn(
        "bg-surface-card rounded-xl p-5 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-200 border border-surface-elevated",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-mint" />
            <h3 className="font-display font-semibold text-lg text-white">
              {customerName}
            </h3>
          </div>
          <p className="text-sm text-gray-400">Order #{id}</p>
        </div>
        <StatusPill status={status} size="sm" />
      </div>

      {/* Route */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MapPin className="w-4 h-4 text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Pickup</p>
            <p className="text-sm text-gray-300 truncate">{pickupAddress}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-error/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MapPin className="w-4 h-4 text-error" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Drop-off</p>
            <p className="text-sm text-gray-300 truncate">{dropoffAddress}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-surface-elevated">
        {estimatedTime && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-mint" />
            <span className="text-sm text-gray-300">{estimatedTime}</span>
          </div>
        )}
        {distance && (
          <div className="flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-mint" />
            <span className="text-sm text-gray-300">{distance}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-success" />
          <span className="text-sm font-semibold text-success">${earnings.toFixed(2)}</span>
        </div>
      </div>

      {/* Driver Info (if assigned) */}
      {driverName && (
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-mint/20 flex items-center justify-center">
            <User className="w-4 h-4 text-mint" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Assigned Driver</p>
            <p className="text-sm font-medium text-white">{driverName}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        {status === "pending" && onAssign && (
          <Button variant="primary" size="sm" className="flex-1" onClick={onAssign}>
            Assign Driver
          </Button>
        )}
        {status === "assigned" && onReassign && (
          <Button variant="outline" size="sm" className="flex-1" onClick={onReassign}>
            Reassign
          </Button>
        )}
        {customerPhone && (
          <Button variant="icon" size="sm" onClick={() => window.open(`tel:${customerPhone}`)}>
            <Phone className="w-4 h-4" />
          </Button>
        )}
        <Button variant="ghost" size="sm" className="flex-1" onClick={onViewDetails}>
          View Details
        </Button>
      </div>
    </div>
  );
}
