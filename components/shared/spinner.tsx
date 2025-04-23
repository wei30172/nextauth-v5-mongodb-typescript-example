import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import { FiLoader } from "react-icons/fi"

const spinnerVariants = cva(
  "text-muted-foreground animate-spin",
  {
    variants: {
      size: {
        default: "h-6 w-6",
        sm: "h-2 w-2",
        lg: "h-10 w-10"
      }
    },
    defaultVariants: {
      size: "default",
    }
  }
)

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
}

export const Spinner = ({ 
  size,
  className
}: SpinnerProps ) => {
  return (
    <FiLoader className={cn(spinnerVariants({ size }), className)} />
  )
}