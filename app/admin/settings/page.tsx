import { AppShell } from "@/components/shell";
import { Badge, Button } from "@/components/ui";
import { getKycProviderMode } from "@/lib/kyc/provider";

export default function Settings() {
  const mode = getKycProviderMode();
  const configured = Boolean(process.env.SUMSUB_APP_TOKEN && process.env.SUMSUB_SECRET_KEY && process.env.SUMSUB_LEVEL_NAME);
  const sumsub = mode === "sumsub";
  return <AppShell admin><div className="mx-auto max-w-4xl px-5 py-8"><h1 className="text-3xl font-bold">Provider settings</h1><p className="mt-2 text-slate-500">Configure the KYC provider used by your verification flow.</p><div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><div className="flex items-center justify-between border-b border-slate-100 pb-5"><div><h2 className="font-bold">{sumsub ? "Sumsub Sandbox" : "Mock KYC Provider"}</h2><p className="mt-1 text-sm text-slate-500">{sumsub ? "Test environment for document and selfie checks." : "Safe local simulation for demos and QA."}</p></div><Badge tone={sumsub && !configured ? "amber" : "green"}>{sumsub ? (configured ? "Configured" : "Not configured") : "Connected"}</Badge></div><div className="mt-6 grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold">Provider<input className="field mt-2" value={sumsub ? "Sumsub Sandbox" : "MockKycProvider"} readOnly /></label><label className="text-sm font-semibold">Environment<input className="field mt-2" value={sumsub ? "Test environment" : "Demo"} readOnly /></label></div><div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800"><b>{sumsub ? "SUMSUB SANDBOX:" : "DEMO MODE:"}</b> {sumsub && !configured ? "Sumsub Sandbox is not configured." : "Real production KYC is not connected."}</div><Button className="mt-6">Save configuration</Button></div></div></AppShell>;
}
