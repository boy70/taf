"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "../../lib/utils"

interface SelectProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
  className?: string
}

const Select = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Root>,
  SelectProps
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Root {...props}>
    <div className={cn("relative", className)} ref={ref}>
      {children}
    </div>
  </SelectPrimitive.Root>
))
Select.displayName = SelectPrimitive.Root.displayName

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

interface SelectTriggerProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  className?: string
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

interface SelectContentProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {
  className?: string
  position?: "popper" | "item-aligned"
}

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80",
        position === "popper" && "translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

interface SelectLabelProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> {
  className?: string
}

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  SelectLabelProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  className?: string
  value: string
  disabled?: boolean
}

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, children, value, disabled = false, ...props }, ref) => {
  if (typeof value !== 'string' || value.trim() === '') {
    console.error("Select.Item must have a non-empty string value prop")
    return null
  }

  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      value={value}
      disabled={disabled}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      {children}
    </SelectPrimitive.Item>
  )
})
SelectItem.displayName = SelectPrimitive.Item.displayName

interface SelectSeparatorProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> {
  className?: string
}

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  SelectSeparatorProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator
}