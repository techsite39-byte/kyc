"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PublicShell } from "@/components/shell";
import { Button } from "@/components/ui";
export default function Login() { const router = useRouter(); return <PublicShell><Auth title="Welcome back" subtitle="Sign in to continue your verification"><input className="field" placeholder="Email address" type="email" /><input className="field" placeholder="Password" type="password" /><Button className="w-full" onClick={() => router.push("/dashboard")}>Sign in <ArrowRight className="ml-2 inline h-4 w-4" /></Button><p className="text-center text-sm text-slate-500">Don&apos;t have an account? <Link className="font-semibold text-brand-600" href="/register">Create one</Link></p></Auth></PublicShell> }
function Auth({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) { return <main className="grid min-h-[70vh] place-items-center px-5 py-14"><div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-soft sm:p-10"><h1 className="text-3xl font-bold">{title}</h1><p className="mt-2 text-slate-500">{subtitle}</p><div className="mt-8 space-y-4">{children}</div></div></main> }
