import { cn } from "~/lib/utils";
import { Check, Circle, MapPin, Package, Truck, Flag } from "lucide-react";

interface ProgressStep {
  key: string;
  label: string;
  icon: React.ReactNode;
}

interface ProgressCardProps {
  steps: ProgressStep[];
  currentStep: number;
  className?: string;
}

const defaultSteps: ProgressStep[] = [
  { key: "assigned", label: "Assigned", icon: <Circle className="w-4 h-4" /> },
  { key: "picked_up", label: "Picked Up", icon: <Package className="w-4 h-4" /> },
  { key: "in_transit", label: "In Transit", icon: <Truck className="w-4 h-4" /> },
  { key: "arrived", label: "Arrived", icon: <MapPin className="w-4 h-4" /> },
  { key: "delivered", label: "Delivered", icon: <Check className="w-4 h-4" /> },
];

export default function ProgressCard({
  steps = defaultSteps,
  currentStep,
  className,
}: ProgressCardProps) {
  return (
    <div
      className={cn(
        "bg-surface-card rounded-xl p-5 shadow-elevation-1 border border-surface-elevated",
        className
      )}
    >
      <h3 className="font-display font-semibold text-lg text-white mb-6">
        Delivery Progress
      </h3>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-surface-elevated" />
        
        {/* Active Progress Line */}
        <div
          className="absolute left-[19px] top-2 w-0.5 bg-gradient-primary transition-all duration-500"
          style={{
            height: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
        />
        
        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div key={step.key} className="relative flex items-start gap-4">
                {/* Step Icon */}
                <div
                  className={cn(
                    "relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    isCompleted
                      ? "bg-gradient-primary shadow-glow"
                      : isCurrent
                      ? "bg-mint/20 border-2 border-mint"
                      : "bg-surface-elevated border-2 border-surface-card"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-base" />
                  ) : (
                    <span className="text-gray-400">{step.icon}</span>
                  )}
                </div>
                
                {/* Step Label */}
                <div className="flex-1 pt-1.5">
                  <p
                    className={cn(
                      "font-medium transition-colors duration-300",
                      isCompleted
                        ? "text-white"
                        : isCurrent
                        ? "text-mint"
                        : "text-gray-500"
                    )}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-sm text-gray-400 mt-0.5">In progress...</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
