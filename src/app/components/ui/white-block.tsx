import * as React from 'react';
import { cn } from './utils';

/**
 * A white content block wrapper with consistent padding and border radius.
 * Used for content sections on gray backgrounds.
 */
function WhiteBlock({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="white-block"
      className={cn(
        "bg-card rounded-[var(--radius-card)] p-4",
        className
      )}
      {...props}
    />
  );
}

WhiteBlock.displayName = "WhiteBlock";

export { WhiteBlock };
