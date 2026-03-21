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
      className={cn("p-4 sm:p-6 bg-background rounded-2xl shadow-xl border border-white/10", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-8 sm:space-x-8 sm:space-y-0 relative", // Side-by-side months
        month: "space-y-6", // Spacing within a month
        month_caption: "flex justify-center pt-1 relative items-center mb-6", // Title (January 2026)
        caption_label: "text-lg font-bold text-foreground tracking-wide",
        nav: "space-x-1 flex items-center absolute inset-x-0 justify-between mx-1 top-1 z-10 w-full p-0 pointer-events-none",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-background border-border hover:bg-muted rounded-full transition-all duration-200 shadow-sm pointer-events-auto absolute left-0 z-20"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-background border-border hover:bg-muted rounded-full transition-all duration-200 shadow-sm pointer-events-auto absolute right-0 z-20"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex w-full justify-between mb-2",
        weekday: "text-muted-foreground w-9 sm:w-10 font-bold text-[0.8rem] uppercase tracking-wider text-center",
        weeks: "w-full block",
        week: "flex w-full mt-2 justify-between",
        day: cn(
          "h-9 w-9 sm:h-10 sm:w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer text-sm"
        ),
        day_button: "w-full h-full flex items-center justify-center bg-transparent border-0 rounded-full hover:bg-muted/50 transition-colors", // v9 uses button inside day
        range_start: "day-range-start bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-sm font-medium",
        range_end: "day-range-end bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-sm font-medium",
        selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-muted/30 text-foreground font-medium ring-1 ring-primary/30",
        outside: "day-outside text-muted-foreground/30 opacity-40 aria-selected:bg-transparent aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground/20 opacity-20 cursor-not-allowed hover:bg-transparent",
        range_middle: "aria-selected:bg-muted/20 aria-selected:text-foreground font-medium rounded-none first:rounded-l-full last:rounded-r-full",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      } as any}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
