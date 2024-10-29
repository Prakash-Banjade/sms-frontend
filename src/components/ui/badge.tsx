import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        destructiveOutline: "font-base text-red-700 bg-red-50 ring-red-600/20 dark:text-red-50 dark:bg-red-700 dark:ring-red-100/20 inline-flex flex-shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset whitespace-nowrap",
        outline: "text-foreground",
        success: "font-base text-green-700 bg-green-50 ring-green-600/20 dark:text-green-50 dark:bg-green-700 dark:ring-green-100/20 inline-flex flex-shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset whitespace-nowrap",
        info: "font-base text-cyan-700 bg-cyan-50 ring-cyan-600/20 dark:text-cyan-50 dark:bg-cyan-700 dark:ring-cyan-100/20 inline-flex flex-shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset whitespace-nowrap",
        warning: "bg-warning text-warning-foreground hover:bg-warning/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
