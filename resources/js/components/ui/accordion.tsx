import * as React from "react";

import { cn } from "@/lib/utils";

const Accordion = ({ children, className }: React.HTMLAttributes<HTMLDivElement> & { type?: string; collapsible?: boolean }) => (
  <div className={className}>{children}</div>
);

const AccordionItem = ({ children, className, ...props }: React.HTMLAttributes<HTMLDetailsElement> & { value?: string }) => (
  <details className={cn("group", className)} {...props}>
    {children}
  </details>
);

const AccordionTrigger = ({ children, className }: React.HTMLAttributes<HTMLElement>) => (
  <summary className={cn("flex cursor-pointer list-none items-center justify-between py-4 [&::-webkit-details-marker]:hidden", className)}>
    {children}
    <span className="ml-4 text-muted-foreground transition-transform group-open:rotate-180">⌄</span>
  </summary>
);

const AccordionContent = ({ children, className }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("pb-4", className)}>{children}</div>
);

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
