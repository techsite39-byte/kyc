"use client";
import { useState } from "react";
import { Camera, Check, ChevronLeft, FileUp, Globe2, Loader2, ScanFace, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/shell";
import { Button } from "@/components/ui";
import { SumsubWidget } from "@/components/sumsub-widget";

const steps = ["Country", "Document", "Upload", "Review", "Selfie", "Liveness", "Result"];
type ResultStatus = "VERIFIED" | "REJECTED" | "PENDING";

export default function Verify() {
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState("United States");
  const [doc, setDoc] = useState("passport");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultStatus | null>(null);
  const [sumsubToken, setSumsubToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [fallbackMock, setFallbackMock] = useState(false);

  async function createSession(provider?: "mock") {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/kyc/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ provider, userId: "demo-user", country, documentType: doc, documentName: doc === "passport" ? "Passport" : "National ID" }) });
      const data = await response.json() as { provider?: string; token?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to start verification");
      if (data.provider === "sumsub" && data.token) setSumsubToken(data.token);
      else setFallbackMock(true);
    } catch (sessionError) {
      setError(sessionError instanceof Error ? sessionError.message : "Unable to start verification");
    } finally {
      setLoading(false);
    }
  }

  async function next() {
    if (step === 1 && !fallbackMock) {
      await createSession();
      return;
    }
    if (step === 5) {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setResult(doc === "other" ? "REJECTED" : "VERIFIED");
      setLoading(false);
      setStep(6);
      return;
    }
    setStep((current) => Math.min(6, current + 1));
  }

  if (sumsubToken) return <AppShell><div className="mx-auto max-w-3xl px-5 py-8"><div className="mb-8"><p className="text-sm font-bold text-brand-600">SUMSUB SANDBOX · TEST ENVIRONMENT</p><h1 className="mt-2 text-3xl font-bold">Complete your identity verification</h1><p className="mt-2 text-slate-500">This is a sandbox test. No production identity decision is being made.</p></div><SumsubWidget accessToken={sumsubToken} onComplete={(message) => { if (message.includes("applicantStatus") || message.includes("completed")) setResult("PENDING"); }} /><div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800"><b>SUMSUB SANDBOX:</b> Results are delivered asynchronously by webhook and may remain pending during this demo.</div></div></AppShell>;

  return <AppShell><div className="mx-auto max-w-3xl px-5 py-8"><div className="mb-8"><p className="text-sm font-bold text-brand-600">{fallbackMock ? "DEMO MODE" : "IDENTITY VERIFICATION"}</p><h1 className="mt-2 text-3xl font-bold">{result ? (result === "VERIFIED" ? "Verification complete" : "Verification needs attention") : "Let's verify your identity"}</h1><p className="mt-2 text-slate-500">{fallbackMock ? "Sumsub Sandbox is not configured. Continue with the local mock flow." : "Demo flow only. Please use test information."}</p></div>{error && <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><b>{error}</b>{error.includes("not configured") && <Button className="ml-4" onClick={() => { setFallbackMock(true); setError(""); }}>Continue in Mock mode</Button>}</div>}{!result && <div className="mb-8 flex items-center gap-1 overflow-x-auto pb-2">{steps.map((label, i) => <div key={label} className="flex shrink-0 items-center"><div className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${i <= step ? "bg-brand-600 text-white" : "bg-slate-200 text-slate-500"}`}>{i < step ? <Check className="h-4 w-4" /> : i + 1}</div><span className={`ml-2 hidden text-xs font-semibold sm:inline ${i === step ? "text-ink" : "text-slate-400"}`}>{label}</span>{i < steps.length - 1 && <div className={`mx-2 h-px w-5 ${i < step ? "bg-brand-600" : "bg-slate-200"}`} />}</div>)}</div>}<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-9">{loading ? <div className="grid min-h-72 place-items-center text-center"><Loader2 className="h-10 w-10 animate-spin text-brand-600" /><h2 className="mt-5 text-xl font-bold">Running demo checks...</h2><p className="mt-2 text-sm text-slate-500">Simulating OCR, liveness, and face match.</p></div> : result ? <Result approved={result === "VERIFIED"} onRetry={() => { setResult(null); setStep(0); }} /> : <StepContent step={step} country={country} setCountry={setCountry} doc={doc} setDoc={setDoc} />} {!result && !loading && <div className="mt-8 flex justify-between border-t border-slate-100 pt-6">{step > 0 ? <Button variant="ghost" onClick={() => setStep(step - 1)}><ChevronLeft className="mr-1 inline h-4 w-4" />Back</Button> : <span />}{step === 2 ? <label className="cursor-pointer rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Choose test file<input type="file" className="hidden" onChange={() => setStep(3)} /></label> : <Button onClick={next}>{step === 1 && !fallbackMock ? "Start Sumsub Sandbox" : step === 5 ? "Run demo checks" : "Continue"}</Button>}</div>}</div></div></AppShell>;
}
function StepContent({ step, country, setCountry, doc, setDoc }: { step: number; country: string; setCountry: (v: string) => void; doc: string; setDoc: (v: string) => void }) { if (step === 0) return <Panel icon={<Globe2 />} title="Where were you issued your document?"><select className="field" value={country} onChange={(e) => setCountry(e.target.value)}><option>United States</option><option>United Kingdom</option><option>India</option><option>Germany</option><option>Singapore</option></select></Panel>; if (step === 1) return <Panel icon={<ShieldCheck />} title="Choose your document"><div className="grid gap-3 sm:grid-cols-2">{[["passport", "Passport"], ["national-id", "National ID"], ["driver-license", "Driver license"], ["other", "Other document"]].map(([value, label]) => <button key={value} onClick={() => setDoc(value)} className={`rounded-2xl border p-4 text-left font-semibold ${doc === value ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200"}`}>{label}<span className="mt-1 block text-xs font-normal text-slate-500">Use a test document</span></button>)}</div></Panel>; if (step === 2) return <Panel icon={<FileUp />} title="Upload your document"><div className="rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/50 p-10 text-center"><FileUp className="mx-auto h-10 w-10 text-brand-600" /><p className="mt-4 font-bold">Drop a test document here</p><p className="mt-2 text-sm text-slate-500">JPG or PNG · This file is not permanently stored</p></div></Panel>; if (step === 3) return <Panel icon={<FileUp />} title="Review your document"><div className="rounded-2xl bg-slate-100 p-8 text-center"><div className="mx-auto h-24 w-40 rounded-lg bg-slate-300" /><p className="mt-4 text-sm text-slate-500">Demo document preview</p></div></Panel>; if (step === 4) return <Panel icon={<Camera />} title="Take a selfie"><div className="mx-auto grid h-48 max-w-xs place-items-center rounded-3xl bg-slate-900 text-white"><Camera className="h-12 w-12" /></div><p className="mt-4 text-center text-sm text-slate-500">Camera access is simulated in Mock mode.</p></Panel>; return <Panel icon={<ScanFace />} title="Liveness check"><div className="rounded-2xl bg-brand-50 p-5"><p className="font-bold text-brand-900">Follow the prompt</p><p className="mt-1 text-sm text-brand-700">Smile, blink, and turn your head slightly. The local demo simulates the check.</p></div></Panel> }
function Panel({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) { return <div><div className="mb-7 flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">{icon}</div><h2 className="text-xl font-bold">{title}</h2></div>{children}</div> }
function Result({ approved, onRetry }: { approved: boolean; onRetry: () => void }) { return <div className="py-8 text-center"><div className={`mx-auto grid h-20 w-20 place-items-center rounded-full ${approved ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>{approved ? <Check className="h-10 w-10" /> : <ShieldCheck className="h-10 w-10" />}</div><h2 className="mt-6 text-2xl font-bold">{approved ? "Identity verified in demo mode" : "We couldn't verify this document"}</h2><p className="mx-auto mt-3 max-w-md text-slate-500">{approved ? "All local mock checks returned a simulated pass. No real identity decision was made." : "The mock provider returned a simulated failure."}</p><Button className="mt-7" onClick={onRetry}>{approved ? "Start another demo" : "Retry verification"}</Button></div> }
