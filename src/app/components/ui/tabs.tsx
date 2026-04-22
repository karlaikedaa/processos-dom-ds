"use client";

import * as React from "react";
import { cn } from "./utils";

/**
 * Tabs Component - Design System
 *
 * Based on Figma specification:
 * https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web?node-id=6129-2272
 *
 * Style: Underline tabs (not pill/background style)
 * - Selected tab has 1.6px bottom border in #d64000 (orange)
 * - Height: 40px (5x)
 * - Min width: 80px (10x)
 * - Gap: 8px (1x)
 */

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs component");
  }
  return context;
}

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

function Tabs({ value, onValueChange, className, children }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn("flex flex-col", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

function TabsList({ className, children }: TabsListProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 overflow-x-auto",
        "border-b",
        className
      )}
      style={{
        borderBottomColor: 'var(--border)',
        borderBottomWidth: '0.8px',
        scrollbarWidth: 'none'
      }}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

function TabsTrigger({ value, className, children }: TabsTriggerProps) {
  const { value: selectedValue, onValueChange } = useTabsContext();
  const isSelected = selectedValue === value;

  return (
    <button
      onClick={() => onValueChange(value)}
      className={cn(
        "relative flex items-center justify-center gap-1.5",
        "h-10 px-4",
        "min-w-[80px]",
        "text-sm font-medium whitespace-nowrap",
        "cursor-pointer transition-colors",
        "bg-transparent border-none",
        isSelected ? "text-[#d64000]" : "text-[var(--muted-foreground)]",
        className
      )}
      style={{
        borderBottom: isSelected ? '1.6px solid #d64000' : '1.6px solid transparent',
        marginBottom: '-0.8px', // Overlay the container border
      }}
      data-state={isSelected ? "active" : "inactive"}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

function TabsContent({ value, className, children }: TabsContentProps) {
  const { value: selectedValue } = useTabsContext();

  if (selectedValue !== value) {
    return null;
  }

  return (
    <div className={cn("flex-1 outline-none", className)}>
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
