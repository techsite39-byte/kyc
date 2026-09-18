"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Button({ children, className = "", variant = "primary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  const styles = { primary: "bg-brand-600 text-white hover:bg-brand-700", secondary: "border border-slate-200 bg-white text-ink hover:bg-slate-50", ghost: "text-slate-600 hover:bg-slate-100" };
  return <button className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${styles[variant]} ${className}`} {...props}>{children}</button>;
}
export function Badge({ children, tone = "blue" }: { children: ReactNode; tone?: "blue" | "green" | "amber" | "red" }) {
  const styles = { blue: "bg-brand-50 text-brand-700", green: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700", red: "bg-rose-50 text-rose-700" };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${styles[tone]}`}>{children}</span>;
}
export function DemoBanner() { return <div className="flex items-center justify-between gap-3 bg-ink px-4 py-2 text-xs text-white"><span><strong className="mr-2 text-brand-100">DEMO MODE</strong> Real KYC provider is not connected.</span><span className="hidden text-slate-300 sm:inline">No documents or selfies are permanently stored.</span></div>; }
export function Logo() { return <div className="flex items-center gap-2 font-bold tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">K</span><span>Keystone<span className="text-brand-600">ID</span></span></div>; }
