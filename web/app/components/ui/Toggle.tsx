import { cn } from "~/lib/utils";
import { ButtonHTMLAttributes, forwardRef, useState } from "react";

interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ checked: controlledChecked, onCheckedChange, label, size = "md", className, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = useState(false);
    const checked = controlledChecked !== undefined ? controlledChecked : internalChecked;
    
    const handleToggle = () => {
      const newChecked = !checked;
      if (controlledChecked === undefined) {
        setInternalChecked(newChecked);
      }
      onCheckedChange?.(newChecked);
    };
    
    const sizeStyles = {
      sm: "w-10 h-5",
      md: "w-12 h-6",
      lg: "w-14 h-7",
    };
    
    const thumbStyles = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };
    
    const thumbTranslate = {
      sm: checked ? "translate-x-5" : "translate-x-0.5",
      md: checked ? "translate-x-6" : "translate-x-0.5",
      lg: checked ? "translate-x-7" : "translate-x-0.5",
    };
    
    return (
      <div className="flex items-center gap-3">
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={handleToggle}
          className={cn(
            "relative inline-flex flex-shrink-0 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-mint focus:ring-offset-2 focus:ring-offset-base",
            checked ? "bg-mint shadow-glow" : "bg-surface-card",
            sizeStyles[size],
            className
          )}
          {...props}
        >
          <span
            className={cn(
              "pointer-events-none inline-block rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out",
              thumbStyles[size],
              thumbTranslate[size]
            )}
          />
        </button>
        {label && (
          <span className="text-sm font-medium text-gray-300">{label}</span>
        )}
      </div>
    );
  }
);

Toggle.displayName = "Toggle";

export default Toggle;
