"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PublicShell } from "@/components/shell";
import { Button } from "@/components/ui";
export default function Register() { const router = useRouter(); return <PublicShell><main className="grid min-h-[70vh] place-items-center px-5 py-14"><div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-soft sm:p-10"><h1 className="text-3xl font-bold">Create your account</h1><p className="mt-2 text-slate-500">Start a secure demo verification in minutes.</p><div className="mt-8 space-y-4"><input className="field" placeholder="Full name" /><input className="field" placeholder="Work email" type="email" /><input className="field" placeholder="Password" type="password" /><Button className="w-full" onClick={() => router.push("/dashboard")}>Create account <ArrowRight className="ml-2 inline h-4 w-4" /></Button><p className="text-center text-sm text-slate-500">Already registered? <Link className="font-semibold text-brand-600" href="/login">Sign in</Link></p></div></div></main></PublicShell> }
