"use client"

import React from "react"
import { cn } from "@/lib/utils"

export function FloatingCard({ children, className, hover = true }) {
  return (
    <Card
      className={cn(
        "backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-white/20 dark:border-slate-700/30 shadow-xl",
        hover && "hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-out",
        "relative overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-400/5 dark:to-purple-400/5" />
      <div className="relative z-10">{children}</div>
    </Card>
  )
}
