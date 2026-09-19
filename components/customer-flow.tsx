"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { emptyCustomerFlow, readCustomerFlow, writeCustomerFlow, type CustomerFlowState } from "@/lib/customer-flow";

export function BasicInformation() {
  const [flow, setFlow] = useState<CustomerFlowState>(emptyCustomerFlow);
  useEffect(() => setFlow(readCustomerFlow()), []);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    writeCustomerFlow(flow);
    window.location.href = "/upload-proof";
  }

  return <main className="grid min-h-screen place-items-center p-5"><form onSubmit={submit} className="grid w-full max-w-sm gap-5"><label className="grid gap-2 text-sm font-semibold">Name<input className="field" required value={flow.name} onChange={(event) => setFlow({ ...flow, name: event.target.value })} /></label><label className="grid gap-2 text-sm font-semibold">Year<input className="field" value={flow.year} onChange={(event) => setFlow({ ...flow, year: event.target.value })} /></label><label className="grid gap-2 text-sm font-semibold">Email<input className="field" type="email" value={flow.email} onChange={(event) => setFlow({ ...flow, email: event.target.value })} /></label><div className="flex items-center justify-between pt-2"><Link href="/upload-proof" className="text-sm font-semibold text-brand-600">Skip</Link><Button type="submit">Submit</Button></div></form></main>;
}

function ImageInput({ capture, onChange }: { capture?: "environment" | "user"; onChange: (event: ChangeEvent<HTMLInputElement>) => void }) {
  return <label className="grid min-h-48 cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center text-sm font-semibold text-brand-600"><span>{capture === "user" ? "Upload Photo" : "Upload Image"}</span><input className="hidden" type="file" accept="image/*" capture={capture} onChange={onChange} /></label>;
}

function imageData(event: ChangeEvent<HTMLInputElement>, update: (image: string) => void) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => update(String(reader.result));
  reader.readAsDataURL(file);
}

export function UploadProof() {
  const [flow, setFlow] = useState<CustomerFlowState>(emptyCustomerFlow);
  useEffect(() => setFlow(readCustomerFlow()), []);
  function updateProof(image: string) { const next = { ...flow, proofImage: image }; setFlow(next); writeCustomerFlow(next); }
  return <main className="mx-auto flex min-h-screen max-w-5xl flex-col p-5 sm:p-10"><div className="grid flex-1 gap-8 lg:grid-cols-2"><section className="grid content-start gap-5"><div className="text-lg font-semibold">1. Upload Proof</div><div className="grid gap-3"><label className="grid cursor-pointer place-items-center rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold"><span>Scanning</span><input className="hidden" type="file" accept="image/*" capture="environment" onChange={(event) => imageData(event, updateProof)} /></label><ImageInput onChange={(event) => imageData(event, updateProof)} /></div></section><section className="grid min-h-64 place-items-center rounded-2xl border border-slate-200 bg-white p-5">{flow.proofImage && <img src={flow.proofImage} alt="" className="max-h-80 max-w-full object-contain" />}</section></div><div className="mt-8 flex justify-end"><Link href="/selfie"><Button>Next</Button></Link></div></main>;
}

export function Selfie() {
  const [flow, setFlow] = useState<CustomerFlowState>(emptyCustomerFlow);
  useEffect(() => setFlow(readCustomerFlow()), []);
  function updateSelfie(image: string) { const next = { ...flow, selfieImage: image }; setFlow(next); writeCustomerFlow(next); }
  return <main className="mx-auto flex min-h-screen max-w-5xl flex-col p-5 sm:p-10"><div className="grid flex-1 gap-8 lg:grid-cols-2"><section className="grid content-start gap-5"><div className="text-lg font-semibold">2. Selfie</div><ImageInput capture="user" onChange={(event) => imageData(event, updateSelfie)} /></section><section className="grid min-h-64 place-items-center rounded-2xl border border-slate-200 bg-white p-5">{flow.selfieImage && <img src={flow.selfieImage} alt="" className="max-h-80 max-w-full object-contain" />}</section></div><div className="mt-8 flex justify-end"><Link href="/result"><Button>Next</Button></Link></div></main>;
}

export function Result() {
  const [flow, setFlow] = useState<CustomerFlowState>(emptyCustomerFlow);
  useEffect(() => setFlow(readCustomerFlow()), []);
  return <main className="mx-auto flex min-h-screen max-w-5xl flex-col p-5 sm:p-10"><div className="grid flex-1 gap-8 lg:grid-cols-2"><section className="grid content-start gap-5 sm:grid-cols-2 lg:grid-cols-1">{flow.proofImage && <img src={flow.proofImage} alt="" className="max-h-64 w-full object-contain" />}{flow.selfieImage && <img src={flow.selfieImage} alt="" className="max-h-64 w-full object-contain" />}</section><section className="grid min-h-64 place-items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2">{flow.proofImage && <img src={flow.proofImage} alt="" className="max-h-80 max-w-full object-contain" />}{flow.selfieImage && <img src={flow.selfieImage} alt="" className="max-h-80 max-w-full object-contain" />}</section></div><div className="mt-8 flex justify-end"><Link href="/create-id"><Button>Next</Button></Link></div></main>;
}
