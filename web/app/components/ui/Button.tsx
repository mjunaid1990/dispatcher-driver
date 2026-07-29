import { cn } from "~/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "icon";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-mint focus:ring-offset-2 focus:ring-offset-base disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-gradient-primary text-base shadow-glow hover:shadow-glow-strong hover:scale-105 active:scale-95",
      secondary: "bg-surface-elevated text-white hover:bg-surface-card shadow-elevation-1 hover:shadow-elevation-2",
      outline: "border-2 border-mint text-mint hover:bg-mint/10 hover:border-mint-light",
      ghost: "text-mint hover:bg-mint/10",
      destructive: "bg-error text-white hover:bg-error/90 shadow-elevation-1 hover:shadow-elevation-2",
      icon: "bg-surface-elevated text-mint hover:bg-mint/20 hover:text-glow shadow-elevation-1 hover:shadow-glow",
    };
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded-md",
      md: "px-4 py-2 text-base rounded-lg",
      lg: "px-6 py-3 text-lg rounded-xl",
    };
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
