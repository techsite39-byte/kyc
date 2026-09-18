"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronRight, LockKeyhole, Menu, ShieldCheck, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { DemoBanner, Logo, Button } from "./ui";

export function PublicShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <><DemoBanner /><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"><Link href="/"><Logo /></Link><nav className="hidden items-center gap-7 text-sm text-slate-600 md:flex"><Link href="/#how-it-works">How it works</Link><Link href="/security">Security</Link><Link href="/privacy">Privacy</Link><Link href="/login" className="font-semibold text-ink">Log in</Link><Link href="/register"><Button>Get started <ArrowRight className="ml-1 inline h-4 w-4" /></Button></Link></nav><button className="md:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>{open && <nav className="grid gap-4 border-t px-5 py-4 text-sm md:hidden"><Link href="/#how-it-works">How it works</Link><Link href="/security">Security</Link><Link href="/login">Log in</Link><Link href="/register">Get started</Link></nav>}</header>{children}<footer className="border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><Logo /><div className="flex gap-5"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/security">Security</Link></div><span>© 2026 KeystoneID</span></div></footer></>;
}

export function AppShell({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  return <><DemoBanner /><div className="flex min-h-screen bg-slate-50"><aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-5 lg:block"><Logo /><p className="mb-6 mt-10 text-xs font-bold uppercase tracking-widest text-slate-400">{admin ? "Operations" : "Workspace"}</p><SidebarLink href={admin ? "/admin" : "/dashboard"} label="Overview" icon={<ShieldCheck className="h-4 w-4" />} /><SidebarLink href={admin ? "/admin/verifications" : "/verify"} label={admin ? "Verifications" : "Start verification"} icon={<ChevronRight className="h-4 w-4" />} /><SidebarLink href={admin ? "/admin/users" : "/history"} label={admin ? "Users" : "History"} icon={<CheckCircle2 className="h-4 w-4" />} /><SidebarLink href={admin ? "/admin/settings" : "/profile"} label={admin ? "Settings" : "Profile"} icon={<LockKeyhole className="h-4 w-4" />} /></aside><main className="min-w-0 flex-1"><div className="border-b border-slate-200 bg-white px-5 py-4 lg:hidden"><Logo /></div>{children}</main></div></>;
}
function SidebarLink({ href, label, icon }: { href: string; label: string; icon: ReactNode }) { return <Link href={href} className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700">{icon}{label}</Link>; }
