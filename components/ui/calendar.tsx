"use client"

import type * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-background rounded-lg", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center mb-4",
        caption_label: "text-base font-medium text-foreground font-serif tracking-wide",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 bg-transparent p-0 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-full transition-all duration-200",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "grid grid-cols-7 mb-2",
        head_cell:
          "text-muted-foreground/70 w-full aspect-square font-normal text-xs uppercase tracking-wider flex items-center justify-center font-serif p-1",
        row: "grid grid-cols-7 gap-0",
        cell: "aspect-square text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "w-full aspect-square p-0 font-normal aria-selected:opacity-100 hover:bg-muted/40 transition-all duration-200 font-serif text-sm flex items-center justify-center",
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-sm font-medium",
        day_today: "bg-muted/50 text-foreground font-medium ring-1 ring-primary/30",
        day_outside:
          "day-outside text-muted-foreground/30 opacity-40 aria-selected:bg-muted/10 aria-selected:text-muted-foreground aria-selected:opacity-20",
        day_disabled: "text-muted-foreground/20 opacity-20 cursor-not-allowed",
        day_range_middle: "aria-selected:bg-muted/30 aria-selected:text-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
