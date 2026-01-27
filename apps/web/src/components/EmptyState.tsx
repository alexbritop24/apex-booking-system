// src/components/EmptyState.tsx
import React from "react";
import { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="w-full rounded-2xl border border-neutral-800/40 bg-neutral-950/30 backdrop-blur-sm p-10">
      <div className="mx-auto max-w-md text-center space-y-6">
        {Icon ? (
          <div className="mx-auto h-14 w-14 rounded-2xl border border-neutral-800/40 bg-neutral-950/40 flex items-center justify-center">
            <Icon className="h-6 w-6 text-neutral-300" />
          </div>
        ) : null}

        <div className="space-y-2">
          <div className="text-xl font-extralight tracking-tight text-neutral-100">
            {title}
          </div>
          {description ? (
            <div className="text-[13px] font-light text-neutral-400/80 leading-relaxed">
              {description}
            </div>
          ) : null}
        </div>

        {action ? (
          <div className="pt-2">{action}</div>
        ) : null}
      </div>
    </div>
  );
}