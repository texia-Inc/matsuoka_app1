import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        data-slot="textarea"
        className={cn(
          "flex min-h-16 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-base outline-none placeholder:text-gray-400 transition-colors duration-200 focus:border-gray-900 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [&.border-0]:border-0 [&.border-0]:focus:border-0",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
