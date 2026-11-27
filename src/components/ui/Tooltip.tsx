import { Tooltip as TooltipPrimitive } from "radix-ui";
import type { ReactElement, ReactNode } from "react";

interface TooltipProps {
  children: ReactElement;
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({
  children,
  content,
  side = "top",
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={300}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>

        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={6}
            className="
              z-50 max-w-xs rounded-control
              bg-content px-3 py-1.5 text-xs
              text-white shadow-md
            "
          >
            {content}

            <TooltipPrimitive.Arrow className="fill-content" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}